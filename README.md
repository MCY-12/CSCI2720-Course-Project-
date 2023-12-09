# Project Name

CSCI2720 Project

## Getting Started

These instructions will help you set up the project on your local machine.

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- npm: Comes with Node.js installation
- MongoDB: [Download and Install MongoDB](https://www.mongodb.com/try/download/community)

### Installing Dependencies

To set up the back-end, run the following command in your terminal:

```bash
cd front-end
npm install
npm start
```

To set up the back-end, run the following command in your terminal:

   ```bash
   cd back-end
npm install
node server.js
```
#### Handle MongoDB Error

You can ignore this if you don't meet error.

As I said in Whatsapp, it can be solved by changing localhost to 127.0.0.1 in server.js. However, here is the alternative way.

```bash
   cd C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg
```

Change

```bash
net:
  port: 27017
  bindIp: 127.0.0.1
```

to

```bash
net:
  port: 27017
  bindIp: 127.0.0.1,::1
  ipv6: true
  bindIpAll: true
```
You may need to restart MongoDB after changes.
