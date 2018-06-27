const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/mern-starter',
  testMongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/mern-test',
  port: process.env.PORT || 5000,
  api : process.env.API || "https://min-api.cryptocompare.com/data"
};

module.exports = config;
