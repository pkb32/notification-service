const express = require('express');
const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
require('dotenv').config();

const connection = require('../queues/redisConnection'); 

mongoose.connect(process.env.MONGODB_URI);


const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Notification Worker is up and running!');
});

app.listen(PORT, () => {
  console.log(`Worker HTTP server listening on port ${PORT}`);
});


const worker = new Worker('notifications', async job => {
  console.log('Received job:', job.id, job.data);  // log the received job
  const { userId, type, message } = job.data;
  switch (type) {
    case 'email':
      console.log(`Sending EMAIL to ${userId}: ${message}`);
      break;
    case 'sms':
      console.log(`Sending SMS to ${userId}: ${message}`);
      break;
    case 'in-app':
      console.log(`Saving IN-APP notification for ${userId}`);
      break;
    default:
      console.warn(`Unknown notification type: ${type}`);
  }
  await new Notification({ userId, type, message }).save();
  console.log(`Saved notification for user ${userId}`);
}, { connection });

worker.on('failed', (job, err) => {
  console.error(`Job failed: ${job.id}`, err);
});
