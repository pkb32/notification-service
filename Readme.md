
# 🚀 Notification Service

A simple and robust **Notification Service** built with Node.js, Express, MongoDB, and BullMQ to handle notification queuing and processing.

---

## ✨ Features

- 📩 Send notifications via REST API  
- 💾 Store notifications persistently in MongoDB  
- ⚙️ Background queue processing using Redis + BullMQ  
- 🔄 Retry failed notification jobs with exponential backoff  
- 📧 Supports multiple notification types: `email`, `sms`, and `in-app`  

---

## 🛠️ Tech Stack

| Technology          | Purpose                |
|---------------------|------------------------|
| Node.js + Express   | Server and API         |
| MongoDB + Mongoose  | Database & ODM         |
| Redis + BullMQ      | Job Queue & Retry      |
| ioredis             | Redis client           |

---

## 🔧 Setup & Installation

### 1️⃣ Clone the repository and install dependencies

```bash
git clone https://github.com/your-username/notification-service.git
cd notification-service
npm install
````

### 2️⃣ Configure environment variables

Create a `.env` file in the root directory (use `.env.example` as a template):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/notifications
REDIS_URL=redis://default:<password>@<host>:<port>
```

### 3️⃣ Start the Express server

```bash
npm start
```

### 4️⃣ Run the worker process (in a separate terminal)

```bash
node workers/notificationWorker.js
```

---

## 📬 API Endpoints

### POST `/notifications`

Send a new notification

**Request body:**

```json
{
  "userId": "PKB",
  "type": "email",
  "message": "Hello world!"
}
```

* `type` must be one of: `email`, `sms`, or `in-app`
* Validation errors if `type` is invalid or fields missing

**Response:**

```json
{
  "status": "Notification enqueued"
}
```

---

### GET `/users/:id/notifications`

Retrieve all notifications for a user, sorted by timestamp (newest first).

**Response:**

```json
{
  "notifications": [
    {
      "_id": "603d9b76c12345abcdef6789",
      "userId": "PKB",
      "type": "email",
      "message": "Hello world!",
      "timestamp": "2023-06-05T12:34:56.789Z",
      "__v": 0
    }
  ]
}
```

---

### GET `/notifications/jobs`

(Optional) List all jobs in the queue with their status

**Response example:**

```json
[
  {
    "id": "123",
    "name": "send",
    "data": {
      "userId": "PKB",
      "type": "email",
      "message": "Hello world!"
    },
    "status": "completed"
  }
]
```

---

## ✅ Assumptions & Notes

* Actual sending of emails/SMS/in-app messages is **not implemented**; focus is on queue and API.
* Retry mechanism is handled using BullMQ’s built-in `attempts` and `backoff` features.
* `userId` is expected to be unique per user (no duplicate userId checks currently).

---

## 📚 Further Improvements

* Integrate real notification delivery via email/SMS providers
* Add authentication & authorization
* Add pagination and filtering on notification retrieval
* Add monitoring and alerts for failed jobs

---

**Happy coding!** 🎉
Feel free to contribute or raise issues in the repo.

---