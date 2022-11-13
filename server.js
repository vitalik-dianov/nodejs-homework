const app = require('./app');
const { connectMongo } = require('./db/connection');

const start = async () => {
  try {
    await connectMongo();

    app.listen(3000, err => {
      if (err) {
        console.log(err);
      }
      console.log('Server running. Use our API on port: 3000');
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

start();
