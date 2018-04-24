const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient(process.env.REDISCLOUD_URL);

function list(req, res, next) {
  const author = req.params.author;
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAUTHOR');
  console.log(author);
  redisClient.lrangeAsync(`notifications:${author}`, 0, -1).then((res) => {
    console.log('Send notifications');
    const notifications = res.map((notification) => JSON.parse(notification));
    res.json({ 
      result: notifications 
    });
  }).catch(err => {
    console.log('Redis get_notifications failed', err);
  });
}

export default { list };
