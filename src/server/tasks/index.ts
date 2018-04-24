import {runTask as sessionTask} from './sessions';
import {
  sleep as utilSleep,
  getBlock as utilGetBlock,
  getOpsInBlock as utilGetOpsInBlock,
  getGlobalProps as utilGetGlobalProps,
  mutliOpsInBlock as utilMutliOpsInBlock,
  getBlockOps as utilGetBlockOps
} from '../helpers/utils';

const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient(process.env.REDISCLOUD_URL);

const _ = require('lodash');

const cache = {};
const useCache =  false;

const limit = 100;

export async function start() {
  setInterval(async () => {
    try {
      await sessionTask();
    } catch (e) {
      console.log('Unexpected error running `sessions` task', e);
    }
  }, 1000 * 60 * 60);

  loadNextBlock();
}

/** Stream the blockchain for notifications */

const getNotifications = (ops) => {
  const notifications = [];
  ops.forEach((op) => {
    const type = op.op[0];
    const params = op.op[1];
    switch (type) {
      case 'comment': {
        const isRootPost = !params.parent_author;

        /** Find replies */
        if (!isRootPost) {
          const notification = {
            type: 'reply',
            parent_permlink: params.parent_permlink,
            author: params.author,
            permlink: params.permlink,
            timestamp: Date.parse(op.timestamp) / 1000,
            block: op.block,
          };
          notifications.push([params.parent_author, notification]);
        }

        /** Find mentions */
        const pattern = /(@[a-z][-\.a-z\d]+[a-z\d])/gi;
        const content = `${params.title} ${params.body}`;
        const mentions = _.without(_.uniq(content.match(pattern))
          .join('@')
          .toLowerCase()
          .split('@')
          .filter(n => n), params.author)
          .slice(0, 9); // Handle maximum 10 mentions per post
        if (mentions.length) {
          mentions.forEach(mention => {
            const notification = {
              type: 'mention',
              is_root_post: isRootPost,
              author: params.author,
              permlink: params.permlink,
              timestamp: Date.parse(op.timestamp) / 1000,
              block: op.block,
            };
            notifications.push([mention, notification]);
          });
        }
        break;
      }
      case 'custom_json': {
        let json = {};
        try {
          json = JSON.parse(params.json);
        } catch (err) {
          console.log('Wrong json format on custom_json', err);
        }
        switch (params.id) {
          case 'follow': {
            /** Find follow */
            if (json[0] === 'follow' && json[1].follower && json[1].following && _.has(json, '[1].what[0]') && json[1].what[0] === 'blog') {
              const notification = {
                type: 'follow',
                follower: json[1].follower,
                timestamp: Date.parse(op.timestamp) / 1000,
                block: op.block,
              };
              notifications.push([json[1].following, notification]);
            }
            /** Find reblog */
            if (json[0] === 'reblog' && json[1].account && json[1].author && json[1].permlink) {
              const notification = {
                type: 'reblog',
                account: json[1].account,
                permlink: json[1].permlink,
                timestamp: Date.parse(op.timestamp) / 1000,
                block: op.block,
              };
              // console.log('Reblog', [json[1].author, JSON.stringify(notification)]);
              notifications.push([json[1].author, notification]);
            }
            break;
          }
        }
        break;
      }
      case 'account_witness_vote': {
        /** Find witness vote */
        const notification = {
          type: 'witness_vote',
          account: params.account,
          approve: params.approve,
          timestamp: Date.parse(op.timestamp) / 1000,
          block: op.block,
        };
        // console.log('Witness vote', [params.witness, notification]);
        notifications.push([params.witness, notification]);
        break;
      }
      case 'vote': {
        /** Find vote */
        const notification = {
          type: 'vote',
          voter: params.voter,
          permlink: params.permlink,
          weight: params.weight,
          timestamp: Date.parse(op.timestamp) / 1000,
          block: op.block,
        };
        // console.log('Vote', JSON.stringify([params.author, notification]));
        notifications.push([params.author, notification]);
        break;
      }
      case 'transfer': {
        /** Find transfer */
        const notification = {
          type: 'transfer',
          from: params.from,
          amount: params.amount,
          memo: params.memo,
          timestamp: Date.parse(op.timestamp) / 1000,
          block: op.block,
        };
        // console.log('Transfer', JSON.stringify([params.to, notification]));
        notifications.push([params.to, notification]);
        break;
      }
    }
  });
  return notifications;
};

const loadBlock = (blockNum) => {
  utilGetOpsInBlock(blockNum, false).then(ops => {
    if (!ops.length) {
      console.error('Block does not exit?', blockNum);
      utilGetBlock(blockNum).then(block => {
        if (block && block.previous && block.transactions.length === 0) {
          console.log('Block exist and is empty, load next', blockNum);
          redisClient.setAsync('last_block_num', blockNum).then(() => {
            loadNextBlock();
          }).catch(err => {
            console.error('Redis set last_block_num failed', err);
            loadBlock(blockNum);
          });
        } else {
          console.log('Sleep and retry', blockNum);
          sleep(2000).then(() => {
            loadBlock(blockNum);
          });
        }
      }).catch(err => {
        console.log('Error lightrpc (utilGetBlock), sleep and retry', blockNum, JSON.stringify(err));
        utilSleep(2000).then(() => {
          loadBlock(blockNum);
        });
      });
    } else {
      const notifications = getNotifications(ops);
      /** Create redis operations array */
      const redisOps = [];
      notifications.forEach((notification) => {
        redisOps.push(['lpush', `notifications:${notification[0]}`, JSON.stringify(notification[1])]);
        redisOps.push(['ltrim', `notifications:${notification[0]}`, 0, limit - 1]);
      });
      redisOps.push(['set', 'last_block_num', blockNum]);
      redisClient.multi(redisOps).execAsync().then(() => {
        console.log('Block loaded', blockNum, 'notification stored', notifications.length);
        loadNextBlock();
      }).catch(err => {
        console.error('Redis store notification multi failed', err);
        loadBlock(blockNum);
      });
    }
  }).catch(err => {
    console.error('Call failed with lightrpc (utilGetOpsInBlock)', err);
    console.log('Retry', blockNum);
    loadBlock(blockNum);
  });
};

const loadNextBlock = () => {
  redisClient.getAsync('last_block_num').then((res) => {
    let nextBlockNum = (res === null)? 20000000 : parseInt(res) + 1;
    utilGetGlobalProps().then(globalProps => {
      const lastIrreversibleBlockNum = globalProps.last_irreversible_block_num;
      if (lastIrreversibleBlockNum >= nextBlockNum) {
        loadBlock(nextBlockNum);
      } else {
        utilsSleep(2000).then(() => {
          console.log('Waiting to be on the lastIrreversibleBlockNum', lastIrreversibleBlockNum, 'now nextBlockNum', nextBlockNum);
          loadNextBlock();
        });
      }
    }).catch(err => {
      console.error('Call failed with lightrpc (utilGetGlobalProps)', err);
      console.log('Retry loadNextBlock');
      loadNextBlock();
    });
  }).catch(err => {
    console.error('Redis get last_block_num failed', err);
  });
};
