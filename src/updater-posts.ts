import * as mongoose from 'mongoose';

import {
  updatePost,
  getUpdatedPost
} from './server/controllers/post.controller/update';
import Stats from './server/models/stats.model';
import { getContent } from './server/steemAPI';
import User from './server/models/user.model';
import Post from './server/models/post.model';
import config from './config/config';
import * as sc2 from './server/sc2';

const TEST = process.env.TEST === 'false' ? false : true;

(mongoose as any).Promise = Promise;
mongoose.connect(config.mongo);
const conn = mongoose.connection;

conn.once('open', async function() {
  let stats;
  try {
    stats = await Stats.get();
  } catch (e) {
    console.log("ERROR STATS", e);
    return conn.close();
  }

  // get all the posts in the editable window (7 days + 1)
  const activeSince = new Date((new Date().getTime() - ((7 + 1) * 24 * 60 * 60 * 1000)));
  const query = {
    created: {
      $gte: activeSince.toISOString()
    }
  };

  const find = Post.find(query);
  const c = find.cursor({ batchSize: 1 });
  console.log(`Found ${await find.count()} posts to check`);
  let index = 0;
  let post;
  while ((post = await c.next()) !== null) {
    await processPost(post, ++index);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  stats.stats_last_updated_posts = new Date().toISOString();
  await stats.save();
  console.log("DONE");
  conn.close();
});

async function processPost(post: any, index: number): Promise<void> {
  console.log(`----NOW CHECKING POST ${post.permlink} by ${post.author} (post number: ${index})----\n`);
  try {
    const chainPost = await getContent(post.author, post.permlink);
    const chainMeta = chainPost.json_metadata;
    if (!(chainPost.author && chainPost.permlink)) {
      console.log('REMOVING DELETED POST');
      if (!TEST) {
        post.deleted = true;
        return await post.save();
      }
    }

    post = updatePost(post, chainPost);
    post.markModified('json_metadata.repository');
    await processMetadata(post, chainMeta);
    try {
      await post.save();
      console.log(`POST UPDATED SUCCESSFULLY\n`);
    } catch (e) {
      console.log(`ERROR UPDATING POST ${e}\n`);
    }
  } catch (err) {
    console.log(`CANNOT RETRIEVE POST - STEEM ERROR ${err}\n`);
  }
}

async function processMetadata(post, chainMeta): Promise<void> {
  try {
    let a = post.json_metadata.moderator;
    let b = JSON.parse(chainMeta).moderator;
    if (!a) a = {};
    if (!b) b = {};
    if (!a.account || (a.account === b.account
        && a.reviewed === b.reviewed
        && a.pending === b.pending
        && a.flagged === b.flagged
        && a.time === b.time)) {
      return;
    }
    console.log(`Updating blockchain data
From: ${chainMeta}
To: ${JSON.stringify(post.json_metadata)}`);
    if (TEST) {
      return;
    }
    const user = await User.get(post.author);
    await sc2.send('/broadcast', {
      user,
      data: {
        operations: [[
          'comment',
          {
            parent_author: post.parent_author,
            parent_permlink: post.parent_permlink,
            author: post.author,
            permlink: post.permlink,
            title: post.title,
            body: post.body,
            json_metadata: JSON.stringify(post.json_metadata),
          }
        ]]
      }
    });
  } catch (e) {
    console.log('FAILED TO UPDATE POST ON BLOCKCHAIN', e);
  }
}
