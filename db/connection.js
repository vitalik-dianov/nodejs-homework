const mongoose = require('mongoose');
require('dotenv').config();
async function connectMongo() {
  await mongoose.connect(process.env.MONGO_KEY);
  console.log('Connection to DB successfully');
}

module.exports = {
  connectMongo,
};
