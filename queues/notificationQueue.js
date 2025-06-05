const { Queue } = require('bullmq');
const connection = require('./redisConnection'); 

const notificationQueue = new Queue('notifications', { connection });

module.exports = notificationQueue;
