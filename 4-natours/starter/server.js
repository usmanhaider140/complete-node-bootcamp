const app = require('./app');
const env = require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const port = process.env.PORT || 3001;

// UnhandledExceptionWarning: Unhandled exception: Error: ECONNREFUSED: Connection refused
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception', err.message);
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE_LOCAL + process.env.DATABASE_NAME;
console.log(DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB Connection connected Successfully');
  });

const server = app.listen(port, () =>
  console.log(`App listening on port ${port}!`)
);

// UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1):
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection', err.message);
  server.close(() => {
    process.exit(1);
  });
});
