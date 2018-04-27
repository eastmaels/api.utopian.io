import {
  CategoryValue,
  POST_MODERATION_THRESHOLD,
  CATEGORY_VALUE,
  POINT_VALUE,
  SUPERVISOR_MAX_POINTS,
  MODERATOR_MAX_POINTS,
  SUPERVISOR_MIN_POINTS,
} from './constants';
import steemAPI, { getContent, getDiscussionsByBlog } from '../server/steemAPI';
import { formatCat, getRoundedDate, RUNTIME_NOW } from './util';
import { ModeratorStats, CommentOpts } from './mod_processor';
import Moderator from '../server/models/moderator.model';
import User from '../server/models/user.model';
import Post from '../server/models/post.model';
import config from '../config/config';
import * as mongoose from 'mongoose';
import * as sc2 from '../server/sc2';
import { Account } from './account';
import * as assert from 'assert';
import * as util from 'util';

const TEST = process.env.TEST === 'false' ? false : true;
const DO_UPVOTE = process.env.DO_UPVOTE === 'false' ? false : true;
const FORCE = process.env.FORCE === 'true';

let POSTER_TOKEN = process.env.POSTER_TOKEN;
let POSTER_ACCOUNT: string;

let UTOPIAN_TOKEN = process.env.UTOPIAN_TOKEN;
let UTOPIAN_ACCOUNT: string;

(mongoose as any).Promise = Promise;
mongoose.connect(config.mongo, {
  useMongoClient: true
});

const conn = mongoose.connection;
conn.once('open', async () => {
  await (async () => {
    try {
      console.log('Running with target pay date: ' + RUNTIME_NOW.toISOString());

      UTOPIAN_TOKEN = (await sc2.getToken(UTOPIAN_TOKEN as any, true)).access_token;
      const utopian = await sc2.send('/me', {
        token: UTOPIAN_TOKEN
      });
      UTOPIAN_ACCOUNT = utopian.name;

      const poster = (await sc2.getToken(POSTER_TOKEN as any, true));
      POSTER_TOKEN = poster.access_token;
      POSTER_ACCOUNT = poster.username;

      assert(UTOPIAN_ACCOUNT, 'missing utopian account');
      assert(POSTER_ACCOUNT, 'missing poster account');

      console.log("UTOPIAN TOKEN", UTOPIAN_TOKEN);
      console.log("POSTER TOKEN", POSTER_TOKEN);

      await run();
    } catch(e) {
      console.log('Error running pay script', e);
    }
  })();

  conn.close();
});

async function run() {
  const moderators = await ModeratorStats.list();

  let mainPost;
  { // Generate global post
    const totalReviewed: number = moderators.reduce((prev, cur) => {
      return typeof(prev) === 'number'
              ? prev + cur.totalReviewed
              : prev.totalReviewed + cur.totalReviewed as any;
    }) as any;
    const totalFlagged: number = moderators.reduce((prev, cur) => {
      return typeof(prev) === 'number'
              ? prev + cur.totalFlagged
              : prev.totalFlagged + cur.totalFlagged as any;
    }) as any;

    mainPost =
`\
![utopian-post-banner.png](https://res.cloudinary.com/hpiynhbhq/image/upload/v1516449865/t0gmipslwoa6htmribn7.png)\

This is an automated weekly reward post for moderators from @utopian-io. Each \
comment is generated for the moderator and receives an upvote as reward for \
contributions to Utopian.\

In total for this week, there were ${totalReviewed} posts reviewed and \
${totalFlagged} posts flagged. ${(totalReviewed / (totalFlagged + totalReviewed) * 100).toFixed(0)}% \
of the total amount of posts were accepted by moderators.
`;

    const cats: { [key: string]: CategoryValue } = {};
    for (const mod of moderators) {
      for (const catKey in mod.categories) {
        let cat = cats[catKey];
        if (!cats[catKey]) {
          cat = cats[catKey] = {
            reviewed: 0,
            flagged: 0
          };
        }
        cat.reviewed += mod.categories[catKey].reviewed;
        cat.flagged += mod.categories[catKey].flagged;
      }
    }

    for (const key in cats) {
      mainPost +=
`
### ${formatCat(key)} Category
- ${cats[key].reviewed} post${cats[key].reviewed === 1 ? '' : 's'} reviewed
- ${cats[key].flagged} post${cats[key].flagged === 1 ? '' : 's'} flagged
`;
    }
  }

  {
    // Calculate raw rewards without the bound cap applied
    for (const mod of moderators) {
      /*
      let referrer: string|undefined = mod.moderator.referrer;
      if (referrer && mod.moderator.supermoderator === true) {
        referrer = undefined;
      }*/

      let totalPoints = mod.rewards;
      for (const catKey in mod.categories) {
        assert(CATEGORY_VALUE[catKey], 'category ' + catKey + ' is missing from the reward registry');
        const cat = mod.categories[catKey];
        const reviewedPoints = cat.reviewed * CATEGORY_VALUE[catKey].reviewed * POINT_VALUE;
        const flaggedPoints = cat.flagged * CATEGORY_VALUE[catKey].flagged * POINT_VALUE;
        totalPoints += reviewedPoints + flaggedPoints;
        /*if (referrer) {
          let ref = moderators.filter(val => {
            return val.moderator.account === referrer;
          })[0];
          if (ref && ref.moderator.supermoderator === true) {
            ref.rewards += reviewedPoints + flaggedPoints;
          }
        } */
      }

      if (mod.totalReviewed + mod.totalFlagged >= POST_MODERATION_THRESHOLD) {
        mod.rewards = totalPoints;
      }
    }

    // Normalize the rewards
    for (const mod of moderators) {
      if (mod.moderator.supermoderator === true) {
        // Supervisors receive a 20% bonus
        mod.rewards = mod.rewards + SUPERVISOR_MIN_POINTS;
        if (mod.rewards > SUPERVISOR_MAX_POINTS) mod.maxRewardsReached = true;
        mod.rewards = Math.min(mod.rewards, SUPERVISOR_MAX_POINTS);
      }
      if (mod.moderator.supermoderator !== true) {
        if (mod.rewards > MODERATOR_MAX_POINTS) mod.maxRewardsReached = true;
        mod.rewards = Math.min(mod.rewards, MODERATOR_MAX_POINTS);
      }
    }

    { // It's show time!
      const account = await Account.get(UTOPIAN_ACCOUNT);

      {
        let payout = await account.estimatePayout(10000);
        console.log('Estimated current 100% vote is worth $' + payout + ' SBD (weight: 10000)');

        payout = parseFloat((payout / 100).toFixed(2));
        const est = await account.estimateWeight(payout);
        console.log('Estimated weight value for $' + (payout) + ' SBD is ' + est);
      }

      const date = getRoundedDate(RUNTIME_NOW);
      const dateString = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      const title = 'Utopian Moderator Payout - ' + dateString;
      const permlink = 'utopian-pay-' + dateString.replace(/\//g, '-');

      const parentCategory = DO_UPVOTE ? 'utopian-io' : 'testcategory';
      const operations: any[] = [
        ['comment',
          {
            parent_author: '',
            parent_permlink: parentCategory,
            author: POSTER_ACCOUNT,
            permlink,
            title,
            body: mainPost,
            json_metadata : JSON.stringify({
              tags: [parentCategory, 'utopian-pay']
            })
          }
        ]
      ];

      let mainPostExists: boolean;
      {
        const existingContent = await getContent(POSTER_ACCOUNT, permlink);
        mainPostExists = existingContent.author && existingContent.permlink;
      }
      if (!mainPostExists) {
        operations.push([
          'comment_options',
          {
            author: POSTER_ACCOUNT,
            permlink,
            allow_curation_rewards: false,
            allow_votes: true,
            max_accepted_payout: '0.000 SBD',
            percent_steem_dollars : 10000
          }
        ]);
      }

      console.log('BROADCASTING MAIN POST:', util.inspect(operations));
      if (!TEST && (!mainPostExists || (mainPostExists && FORCE))) {
        await sc2.send('/broadcast', {
          token: POSTER_TOKEN,
          data: {
            operations
          }
        });
      }

      for (const mod of moderators) {
        if (!mod.rewards || mod.moderator.opted_out === true) {
          continue;
        }
        try {
          if (!TEST) {
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
          await broadcast(mod, account, {
            parentAuthor: POSTER_ACCOUNT,
            parentPermlink: permlink,
            permlink: permlink + '-comment',
            title
          });
        } catch (e) {
          if (e.broadcast === BroadcastType.COMMENT && e.status === 401) {
            console.log('BROADCAST AUTH ERROR');
          } else {
            console.log('BROADCAST FAILED', e);
          }
        }
      }
    }
  }
}

async function broadcast(mod: ModeratorStats,
                          account: Account,
                          opts: CommentOpts) {
  const content = await getContent(mod.moderator.account, opts.permlink);
  let commentExists = content.author && content.permlink;

  const operations = mod.getCommentOps(opts, !commentExists);
  console.log('BROADCASTING MODERATOR COMMENT\n' + util.inspect(operations));
  if (!TEST && (!commentExists || (commentExists && FORCE))) {
    try {
      const user = await User.get(mod.moderator.account);
      await sc2.send('/broadcast', {
        user,
        data: {
          operations
        }
      });
    } catch (e) {
      e.broadcast = BroadcastType.COMMENT;
      throw e;
    }
  }

  const weight = await account.estimateWeight(mod.rewards);
  console.log('BROADCASTING UPVOTE FOR $' + mod.rewards + ' SBD (weight: ' + weight + ')');
  const hasVote = commentExists && content.active_votes.map(v => v.voter).includes(UTOPIAN_ACCOUNT);
  if (!TEST && DO_UPVOTE && (!hasVote || (hasVote && FORCE))) {
    try {
      await sc2.send('/broadcast', {
        token: UTOPIAN_TOKEN,
        data: {
          operations: [[
            'vote',
            {
              voter: UTOPIAN_ACCOUNT,
              author: mod.moderator.account,
              permlink: opts.permlink,
              weight
            }
          ]]
        }
      });
    } catch (e) {
      e.broadcast = BroadcastType.UPVOTE;
      throw e;
    }
  }
}

enum BroadcastType {
  COMMENT,
  UPVOTE
}
