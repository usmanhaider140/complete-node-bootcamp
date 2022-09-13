const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tour.model');
dotenv.config({ path: '../../config.env' });

mongoose
  .connect('mongodb://localhost:27017/natours', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err));

const importData = async () => {
  try {
    const tours = JSON.parse(
      fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
    );

    await Tour.insertMany(tours);
    console.log('Tours Import Successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Tours Deleted Successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}
