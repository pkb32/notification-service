Here's a full `README.md` tailored for your assignment:

---

````md
# Notification Service

A simple notification service built with Node.js, Express, MongoDB, and BullMQ for queuing.

---

## 📌 Features

- Send notifications via API
- Store notifications in MongoDB
- Queue processing with Redis and BullMQ
- Retry mechanism for failed jobs
- Support for Email, SMS, and In-App notifications

---

## 📦 Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Redis (via Redis Cloud)
- BullMQ (Queue library)
- ioredis (Redis client)

---

## 🔧 Setup

### 1. Clone & Install

```bash
git clone https://github.com/your-username/notification-service.git
cd notification-service
npm install
````

### 2. Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/notifications
REDIS_URL=redis://default:<password>@<host>:<port>
```

### 3. Start the Server

```bash
npm run dev
```

### 4. Start the Worker (in another terminal)

```bash
node workers/notificationWorker.js
```

---

## 📮 API Endpoints

### POST `/notifications`

**Send a notification**

```json
{
  "userId": "PKB",
  "type": "email",
  "message": "Hello world!"
}
```

* `type`: one of `email`, `sms`, `in-app`
* `type`: other than the above -> Notification validation will fail
* `O/P`:
```JSON
  {
      "status": "Notification enqueued"
  }
```
### GET `/users/:id/notifications`

Get all notifications for a user (sorted by time)
* `O/P`:
```JSON
{
    "notifications": [
        {
            "_id": "...",
            "userId": "...",
            "type": "email/sms/in-app",
            "message": "...",
            "timestamp": "...",
            "__v": 0
        }
    ]
}
```

### GET `/notifications/jobs`

Get job status of queued/completed/failed jobs

```json
[
    {
        "id": "...",
        "name": "send",
        "data": {
            "userId": "...",
            "type": "email",
            "message": "..."
        },
        "status": "completed/active/waiting/failed"
    },
    {},{}
]

---

## ✅ Assumptions

* Actual delivery (email/sms) is not implemented — focus is on API + queue 
* Retry is simulated using BullMQ's `attempts` and `backoff`
* userID will be unique, hence no need to check for user with same multiple userID
---
