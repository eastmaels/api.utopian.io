import config from '../config/config';
import * as mongoose from "mongoose";
import * as winston from "winston";
import Stats from "../server/models/stats.model";
import * as SteemConnect from 'sc2-sdk';
import Post from "../server/models/post.model";
import {createCommentPermlink} from "../server/steemitHelpers";
import * as fs from "fs";
import {uploadBotLog} from "../server/helpers/s3";
import * as random from "randomstring";

import {
    checkVotingPower,
    getStats,
    prepareSteemConnect,
    processPost,
} from './util';

import {
    MAX_USABLE_POWER
} from './constants';

(mongoose as any).Promise = Promise;

const conn = mongoose.connection;
const paidRewardsDate = '1969-12-31T23:59:59';
const botAccount = process.env.BOT;
const refreshToken = process.env.REFRESH_TOKEN;
const secret = process.env.CLIENT_SECRET;
const forced = process.env.FORCED === 'true' || false;
const test = process.env.TEST === 'true' || false;

const now = new Date();

let console = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename: 'bot.log'})
    ]
});

mongoose.connect(config.mongo);

const queryStaffPick = {
    'json_metadata.moderator.flagged': { $ne : true },
    'json_metadata.staff_pick': true,
    author: {$ne: botAccount},
    'active_votes.voter': {$ne: botAccount},
    cashout_time: {
        $gt: paidRewardsDate,
    },
};

const queryPosts = {
    'json_metadata.moderator.flagged': { $ne : true },
    'json_metadata.score': { $exists: true, $ne : null},
    'json_metadata.total_influence': { $exists: true, $ne : null, $gt: 0},
    author: {$ne: botAccount},
    'active_votes.voter': {$ne: botAccount},
    created: {
        $lte: new Date(now.getTime() - (48) * 60 * 60 * 1000).toISOString()
    },
    cashout_time: {
        $gt: paidRewardsDate,
    },
};

console.log("info", "STARTING UTOPIAN BOT");
console.log("info", "Bot Account: " + botAccount);

if (test) {
    console.log("info", "");
    console.log("info", "THIS IS A DRY RUN. NO POSTS WILL BE VOTED OR COMMENTED");
    console.log("info", "");
}

if (fs.existsSync('bot.log')) {
    console.log("info", "Delete old log file from previous run")
    fs.unlinkSync('bot.log');
}

async function exit(skipStats = false) {
    let prefix = random.generate().toLocaleLowerCase();
    if (!test && !skipStats) {
        Stats.get().then(stats => {
            stats.bot_is_voting = false;
            stats.save().then(() => {
                uploadBotLog(prefix).then(() => {
                    conn.close();
                    process.exit(0);
                });
            });
        }).catch((err) => {
            uploadBotLog(prefix).then(() => {
                conn.close();
                process.exit(0);
            });
        });
    }

    if (test || skipStats) {
        conn.close();
        process.exit(0);
    }
}

function logVote (postToVote, usedVotingPower, index)  {
    console.log("info", "---Now voting author---", postToVote.author);
    console.log("info", "Post permlink", postToVote.permlink);
    console.log("info", "Post category", postToVote.type);
    console.log("info", "Post index", index);
    console.log("info", "Voting power used so far", usedVotingPower);
    console.log("info", "Post Tot Inflluence", postToVote.total_influence);
    console.log("info", "Post Score", postToVote.score);
    console.log("info", "Is Staff Picked", postToVote.staff_pick);
    console.log("info", "Will Receive Vote", postToVote.voting_power);
}

async function run() {
    const votingPower = await checkVotingPower(botAccount);
    const stats: any = await getStats();
    const processedPosts = Array();

    if (!botAccount) {
        console.log("error", "No bot account was set.");
        return exit();
    }

    if (!refreshToken) {
        console.log("error", "No refresh token was set.");
        return exit();
    }

    if (!secret) {
        console.log("error", "No app secret was set.");
        return exit();
    }

    if (!votingPower || !stats) {
        console.log("info", "Something went wrong. Retrying.");
        return run();
    }

    if (votingPower < 9900 && !forced && !test) {
        console.log("info", "Voting power not enough. Can't vote.");
        return exit();
    }

    if (stats.bot_is_voting === true && !test) {
        console.log("info", "Bot is already voting.");
        return exit(true);
    }

    const SC: any = await prepareSteemConnect();

    console.log("info", votingPower);

    if (!SC) {
        console.log("info", "Something went wrong. Retrying.");
        return run();
    }

    if (!test) {
        Stats.get().then(stats => {
            stats.bot_is_voting = true;
            stats.save();
        });
    }

    console.log("info", "Begin Voting Process.");

    const findStaffPicks = Post.find(queryStaffPick).sort( { 'json_metadata.total_influence': -1, 'json_metadata.score': -1} );
    const findPosts = Post.find(queryPosts).sort( { 'json_metadata.total_influence': -1, 'json_metadata.score': -1 } );
    const cursorStaffPicks = findStaffPicks.cursor({ batchSize: 1 });
    const cursorPosts = findPosts.cursor({ batchSize: 1 });
    let postStaffPicked;
    let post;

    console.log("info", `Found ${await findStaffPicks.count()} staff picks.`);
    console.log("info", `Found ${await findPosts.count()} more contributions.`);

    while ((postStaffPicked = await cursorStaffPicks.next()) !== null) {
        const processedPost = processPost(postStaffPicked);
        processedPosts.push(processedPost);
    }

    while ((post = await cursorPosts.next()) !== null) {
        const score = post.json_metadata.score;
        const totalInfluence = post.json_metadata.total_influence;
        const reviewed = post.json_metadata.moderator && post.json_metadata.moderator.reviewed === true || false;

        if (totalInfluence && (reviewed || (score >= 80 && totalInfluence >= 60))) {
            const processedPost = processPost(post);
            processedPosts.push(processedPost);
        }
    }

    console.log("info", "Finished processing posts. Now voting. Total:", processedPosts.length);

    if (!processedPosts.length) exit();

    let usedVotingPower = 0;
    processedPosts.forEach((postToVote, index) => {
        const votingPower = postToVote.voting_power;

        if (test) {
            logVote(postToVote, usedVotingPower, index);
            usedVotingPower = usedVotingPower + votingPower;
        }

        if (!test && usedVotingPower < MAX_USABLE_POWER) {
            setTimeout(() => {

                logVote(postToVote, usedVotingPower, index);

                SteemConnect.vote(botAccount, postToVote.author, postToVote.permlink, votingPower)
                .then(() => {
                    usedVotingPower = usedVotingPower + votingPower;

                    SteemConnect.comment(
                        postToVote.author,
                        postToVote.permlink,
                        botAccount,
                        createCommentPermlink(postToVote.author, postToVote.permlink),
                        '',
                        postToVote.comment,
                        postToVote.json_metadata,
                    ).then(() => {
                        console.log("info", "Post commented successfully.");
                        console.log("info", 'Post processed.');

                        if (index === processedPosts.length - 1) {
                            console.log("info", "All posts voted.");
                            exit();
                        }

                    }).catch(e => {
                        console.log("error", "Failed to post comment!", e);

                        if (index === processedPosts.length - 1) {
                            console.log("info", "All posts voted.");
                            exit();
                        }
                    });
                }).catch(e => {
                    console.log("error", "Failed to vote!", e);

                    if (index === processedPosts.length - 1) {
                        console.log("info", "All posts voted.");
                        exit();
                    }
                });

            }, 30000 * index);
        }

        if (usedVotingPower >= MAX_USABLE_POWER) {
            console.log("info", "Voting power exhausted.");
            exit();
        }

        if (test && index === processedPosts.length - 1) {
            console.log("info", "All posts voted.");
            exit();
        }
    });

}

conn.once('open', () => {
    run();
});