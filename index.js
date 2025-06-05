const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const notificationQueue = require("./queues/notificationQueue");
const Notification = require("./models/Notification");
const { QueueEvents } = require('bullmq');
const queueConnection = require('./queues/redisConnection');
const queueEvents = new QueueEvents('notifications', { connection: queueConnection });

const app = express();
app.use(bodyParser.json());
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(`MongoDB connected on ${PORT}`))
  .catch((err) => console.error("MongoDB connection error:", err));

const validTypes = ['email', 'sms', 'in-app'];

// Send Notifications to a User
app.post("/notifications", async (req, res) => {
  const {userId,type,message} = req.body;
  if (!userId || !type || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid notification type" });
  }
  try {
    await notificationQueue.add(
      "send",
      { userId, type, message },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000, 
        },
      }
    );

    res.status(202).json({ status: "Notification enqueued" });
  } catch (err) {
    res.status(500).json({ error: "Queueing failed", details: err.message });
  }
});

// Get Notifications for a User
app.get("/users/:id/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.id,
    }).sort({ timestamp: -1 });
    res.json({ notifications });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch notifications", details: err.message });
  }
});

app.get('/notifications/jobs', async (req, res) => {
  try {
    const jobs = await notificationQueue.getJobs(['waiting', 'active', 'completed', 'failed']);
    res.json(jobs.map(job => ({
      id: job.id,
      name: job.name,
      data: job.data,
      status: job.finishedOn ? 'completed' : job.failedReason ? 'failed' : 'pending'
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to get job status', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Notification service listening on port ${PORT}!`)
);
