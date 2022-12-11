const app = require('./app');
require('dotenv').config();
const { connectMongo } = require('./db/connection');
const {PORT} = process.env;
const start = async () => {
  try {
    await connectMongo();
    app.listen(PORT, err => {
      if (err) {
        console.log(err);
      }
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

start();
