import steemAPI, { formatter, broadcast } from './server/steemAPI';
import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import Sponsor from './server/models/sponsor.model';
import Moderator from './server/models/moderator.model';
import Post from './server/models/post.model';
import User from './server/models/user.model';
import config from './config/config';

(mongoose as any).Promise = Promise;
mongoose.connect(config.mongo);
const conn = mongoose.connection;

const defaultScoreDivider = 3;
const customScoreDivider = {
    "development": {
        "score_divider": 1,
    },
    "graphics": {
        "score_divider": 2,
    },
    "analysis": {
        "score_divider": 1,
    },
    "documentation": {
        "score_divider": 1.5,
    },
    "translations": {
        "score_divider": 2,
    },
    "tutorials": {
        "score_divider": 2,
    },
    "video-tutorials": {
        "score_divider": 1.5,
    },
    "copywriting": {
        "score_divider": 1.5,
    },
};

conn.once('open', async function() {
    const topUser = await User.find().sort({score: -1}).limit(1);
    const topScore = topUser[0].score;
    const find = User.find({}).sort({createdAt: -1});
    const c = find.cursor({ batchSize: 1 });
    let index = 0;
    let user;

    console.log("TOP SCORE", topScore);
    console.log(`Found ${await find.count()} users to check`);
    while ((user = await c.next()) !== null) {

        console.log(`----NOW CHECKING USER ${user.account}`);
        const score = await processScore(user);
        await processReputation(user, score, topScore);
        index++;
        console.log(`---user number ${index}`)
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log("DONE");
    conn.close();
});

async function processScore(user: any): Promise<void> {
    try {
        let score = 0;
        const query = {
            author: user.account,
            'json_metadata.moderator.reviewed': {$exists: true},
            'json_metadata.moderator.flagged': {$exists: true},
        };

        const find = Post.find(query);
        const c = find.cursor({ batchSize: 1 });
        let post;
        console.log(`Found ${await find.count()} posts to check`);

        while ((post = await c.next()) !== null) {
            const postScore = post.json_metadata.score;
            const divider = customScoreDivider[post.json_metadata.type] ?
                customScoreDivider[post.json_metadata.type].score_divider :
                defaultScoreDivider;
            // for contributions which did not have the score functionality
            if (postScore === undefined) {
                if (post.json_metadata.moderator.reviewed === true) {
                    score = (100 / divider) + score;
                }
                if (post.json_metadata.moderator.flagged === true) {
                    score = score - 100 / (divider);
                }
            }
            // for contributions which have the score functionality
            if (postScore !== undefined) {
                if (post.json_metadata.moderator.flagged === true) {
                    score = score - (100 / divider); // penalisation for rejection
                }
                if (postScore >= 0 && post.json_metadata.moderator.reviewed === true) {
                    // using score set by the community
                    score = score + (postScore / divider);
                }
            }
        }

        user.score = score >= 0 ? score : 0;
        await user.save();
        console.log(`USER UPDATED SUCCESSFULLY with SCORE ${user.score}\n`);
        return user.score;
    } catch (e) {
        console.log(`ERROR UPDATING USER ${e}\n`);
    }
}

async function processReputation(user: any, score: any, topScore: number): Promise<void> {
    try {
        const levels = [
            {
                name: 'Newbie',
                influence: 0,
            },
            {
                name: 'Beginner',
                influence: 5,
            },
            {
                name: 'Advanced',
                influence: 10,
            },
            {
                name: 'Expert',
                influence: 15,
            },
            {
                name: 'Pro',
                influence: 30,
            },
            {
                name: 'Ninja',
                influence: 45,
            },
            {
                name: 'Guru',
                influence: 60,
            },
            {
                name: 'Hero',
                influence: 75,
            },
            {
                name: 'Legend',
                influence: 90,
            },
            {
                name: 'Elite',
                influence: 100,
            },
        ];

        const scoreImpact = (score / topScore) * 100;
        const levelImpact = Math.ceil((scoreImpact * (levels.length - 1)) / 100);
        let level = levels[levelImpact].name;
        let influence = levelImpact >= 0 ? levels[levelImpact].influence : levels[0].influence;
        const isModerator = await Moderator.get(user.account);
        const isSupervisor = isModerator && isModerator.supermoderator === true || false;
        const isSponsor = await Sponsor.get(user.account);

        console.log("SCORE", score);
        console.log("LEVEL IMPACT", levelImpact);
        console.log("SCORE IMPACT", scoreImpact);


        if (isModerator && levelImpact < 6) {
            level = levels[6].name;
            influence = levels[6].influence;
        }
        if (isSupervisor && levelImpact < 9) {
            level = levels[9].name;
            influence = levels[9].influence;
        }

        if (isSponsor && isSponsor.vesting_shares > 0) {
            const dynamicProps = await getProps();
            if (dynamicProps) {
                const VS = isSponsor.vesting_shares;
                const delegatedSP = formatter.vestToSteem(VS, dynamicProps.total_vesting_shares, dynamicProps.total_vesting_fund_steem);
                if (delegatedSP >= 100 && levelImpact < 1) {
                    level = levels[1].name;
                    influence = levels[1].influence;
                }
                if (delegatedSP >= 1000 && levelImpact < 2) {
                    level = levels[2].name;
                    influence = levels[2].influence;
                }
                if (delegatedSP >= 5000 && levelImpact < 3) {
                    level = levels[3].name;
                    influence = levels[3].influence;
                }
                if (delegatedSP >= 10000 && levelImpact < 4) {
                    level = levels[4].name;
                    influence = levels[4].influence;
                }
                if (delegatedSP >= 15000 && levelImpact < 5) {
                    level = levels[5].name;
                    influence = levels[5].influence;
                }
                if (delegatedSP >= 20000 && levelImpact < 6) {
                    level = levels[6].name;
                    influence = levels[6].influence;
                }
                if (delegatedSP >= 25000 && levelImpact < 7) {
                    level = levels[7].name;
                    influence = levels[7].influence;
                }
                if (delegatedSP >= 50000 && levelImpact < 8) {
                    level = levels[8].name;
                    influence = levels[8].influence;
                }
                if (delegatedSP >= 100000 && levelImpact < 9) {
                    level = levels[9].name;
                    influence = levels[9].influence;
                }
            }
        }

        if(user.honor_reputation && levelImpact < user.honor_reputation) {
            level = levels[user.honor_reputation].name;
            influence = levels[user.honor_reputation].influence;
        }

        if(user.forced_reputation) {
            level = levels[user.forced_reputation].name;
            influence = levels[user.forced_reputation].influence;
        }

        user.reputation = level;
        user.influence = influence;

        console.log("REPUTATION", user.reputation);
        console.log("INFLUENCE", user.influence);

        await user.save();
        console.log(`USER UPDATED SUCCESSFULLY with LEVEL ${level}\n`);
    } catch (e) {
        console.log(`ERROR UPDATING USER ${e}\n`);
    }
}

async function getProps(): Promise<void> {
    return new Promise((resolve, reject) => {
        steemAPI.getDynamicGlobalProperties(function(err, result) {
            if (!err) {
                resolve({
                    total_vesting_shares: result.total_vesting_shares,
                    total_vesting_fund_steem: result.total_vesting_fund_steem,
                })
            }
            reject();
        })
    });
}
