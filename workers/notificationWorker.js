const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
require('dotenv').config();

const connection = require('../queues/redisConnection'); 

mongoose.connect(process.env.MONGODB_URI);

const worker = new Worker('notifications', async job => {
  console.log('Received job:', job.id, job.data);  // log the received job
  const { userId, type, message } = job.data;
  await new Notification({ userId, type, message }).save();
  console.log(`Saved notification for user ${userId}`);
}, { connection });

worker.on('failed', (job, err) => {
  console.error(`Job failed: ${job.id}`, err);
});
