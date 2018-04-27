import steemAPI from './server/steemAPI';
import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import config from './config/config';
import Post from './server/models/post.model';
import {updatePost, validateNewPost} from './server/controllers/post.controller/update';
import {getContent} from './server/steemAPI';

(mongoose as any).Promise = Promise;
mongoose.connect(config.mongo);
const conn = mongoose.connection;

conn.once('open', async function() {
    const query = {"tag":"utopian-io", "limit": "100"};
    const fromDate = process.env.FROM_DATE;

    if (!fromDate) {
        console.log("info", "no date specified");
        conn.close();
        process.exit(0);
    }

    const run = (query) => steemAPI.getDiscussionsByCreated(query, function(err, posts) {
        if (posts.length) {
            posts.forEach(async (post, index) => {

                try {
                    await processPost(post, fromDate);
                }catch(e) {
                    console.log("ERROR", e);
                }

                if (index === posts.length - 1) {
                    if (post.created > fromDate) {
                        console.log("RERUNNING", "not finished yet, checking next 100");
                        run({
                            ...query,
                            start_author: post.author,
                            start_permlink: post.permlink,
                        });
                    }
                }
            })
        }

        if (!posts.length) {
            console.log("DONE", "NO MORE POSTS TO CHECK");
            conn.close();
            process.exit(0);
        }
    });

    run(query);
});

async function processPost (post, fromDate) {
    return new Promise(async (resolve, reject) => {

        if (post.created < fromDate) {
            console.log("INFO", "CHECK COMPLETED");
            conn.close();
            process.exit(0);
        }

        const meta = JSON.parse(post.json_metadata);
        if (meta.app === 'utopian/1.0.0' && meta.) {
            const newPost = new Post({
                ...post,
                json_metadata: meta});
            await newPost.save().then((savedPost) => {
                console.log("-----------------------");
                console.log("Post author", post.author);
                console.log("Post permlink", post.permlink);
                console.log("Post created at", post.created);
                resolve(savedPost);
            });
        } else {
            reject('invalid')
        }

    });
}