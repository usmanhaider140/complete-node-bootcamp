const app = require('./app');
const env = require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const port = process.env.PORT || 3001;

const DB = process.env.DATABASE_LOCAL + process.env.DATABASE_NAME;
console.log(DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB Connection connected Successfully');
  });

app.listen(port, () => console.log(`App listening on port ${port}!`));

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection', err.message);
  server.close(() => {
    process.exit(1);
  });
});
