import steemAPI from "../server/steemAPI";
import Stats from "../server/models/stats.model";
import * as request from 'superagent';
import * as SteemConnect from 'sc2-sdk';
import config from '../config/config';

import {
  CATEGORY_VALUES,
} from './constants';

export async function checkVotingPower(account) {
  return new Promise((resolve, reject) => {
    steemAPI.getAccounts([account], function (err, accounts) {
      if (!err) {
        const botStatus = accounts[0];

        const secondsago = (new Date().getTime() - new Date(botStatus.last_vote_time + "Z").getTime()) / 1000;
        const votingPower = botStatus.voting_power + (10000 * secondsago / 432000);

        setTimeout(() => {
          resolve(votingPower)
        }, 4000);
      } else {
        console.log("error", "An error occured while fetching the voting power", err);
        reject(err);
      }
    });
  });
}

export async function getStats() {
  return new Promise((resolve, reject) => {
    Stats.get().then(stats => {
      resolve(stats);
    }).catch(e => reject(e))
  });
}

export async function prepareSteemConnect() {
  const scBase = config.steemconnectHost;
  const refreshToken = process.env.REFRESH_TOKEN;
  const secret = process.env.CLIENT_SECRET;

  console.log("info", "contacting SC");

  return new Promise((resolve, reject) => {
    request
        .get(`${scBase}/api/oauth2/token?refresh_token=${refreshToken}&client_secret=${secret}&scope=vote,comment,delete_comment,comment_options,custom_json,claim_reward_balance,offline`)
        .end((err, res) => {
          if (!res.body.access_token) {
            console.log("error", "Could not get access token", res);
            reject()
          }
          if (res.body.access_token) {
            SteemConnect.setAccessToken(res.body.access_token);
            resolve(true);
          }
        });
  })
}

export function processPost (post) {
  const jsonMetadata = {tags: ['utopian-io'], community: 'utopian', app: `utopian/1.0.0`};
  const meta = post.json_metadata;
  const type = meta.type;
  const score = meta.score || 0;
  const staff_pick = meta.staff_pick === true || false;
  const total_influence = meta.total_influence || 0;
  const processedType = type.indexOf('task-') > -1 ? 'tasks-requests' : type;
  const MaxVote: number = CATEGORY_VALUES[processedType].max_vote;

  const postConfig = {
    voting_power : 0,
    comment: '',
    author: post.author,
    permlink: post.permlink,
    json_metadata: jsonMetadata,
    score,
    staff_pick,
    total_influence,
    type,
  };

  if (staff_pick) {
    postConfig.voting_power = MaxVote * 100;
  }

  if (!staff_pick && score) {
    const scoreImpact = score * MaxVote / 100;
    postConfig.voting_power = Math.round(scoreImpact.toFixed(2) * 100);
  }

  let commentBody = `### Hey @${post.author}! Thank you for the great work you've done!\n`;
  commentBody += `We're already looking forward to your next contribution!\n`;
  commentBody += `#### Fully Decentralized Rewards\n`;
  commentBody += `We hope you will take the time to share your expertise and knowledge by rating contributions made by others on Utopian.io to help us reward the best contributions together.\n`;
  commentBody += '#### Utopian Witness!\n';
  commentBody += '<a href="https://v2.steemconnect.com/sign/account-witness-vote?witness=utopian-io&approve=1">Vote for Utopian Witness!</a> We are made of developers, system administrators, entrepreneurs, artists, content creators, thinkers. We embrace every nationality, mindset and belief.\n';
  commentBody += '\n**Want to chat? Join us on Discord https://discord.me/utopian-io**';

  postConfig.comment = commentBody;

  return postConfig;
}
