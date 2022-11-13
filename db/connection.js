const mongoose = require('mongoose');

async function connectMongo() {
  await mongoose.connect(
    'mongodb+srv://admin:adminqwerty@clusterbase.enuivrc.mongodb.net/db-contacts?retryWrites=true&w=majority'
  );
  console.log('Connection to DB successfully');
}

module.exports = {
  connectMongo,
};
