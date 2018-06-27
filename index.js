const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./server/routes');
const serverConfig = require('./server/config');
const dummyData = require('./server/dummyData')

const app = express();

// Set environment flags
const isTest = serverConfig.nodeEnv === 'test';
const isDev = serverConfig.nodeEnv === 'development';

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
try {
  mongoose.connect(isTest ? serverConfig.testMongoURL : serverConfig.mongoURL, (error) => {
    if (error) {
      console.error('Please make sure Mongodb is installed and running!');
      throw error;
    } else {
      console.log(`Connected to DB at ${isTest ? serverConfig.testMongoURL : serverConfig.mongoURL}`);
    }

    // feed some dummy data in DB.
    //dummyData();
  });
} catch (e) {

} finally {

}

// Apply body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.use('/api', routes.coin);


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = serverConfig.port;
app.listen(port);

console.log(`listening on ${port}`);
