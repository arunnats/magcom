const mongoose = require('mongoose');
const Magazine = require('./models/magazine.js'); // Adjust the path as needed

mongoose.connect('mongodb+srv://arunnats:DouglasAdams42@clustermagcom.chf4jce.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Magazines = [
  {
    name: 'Audacia',
    publicationYear: 2022,
    image: 'audacia22.jpg',
  },
  {
    name: 'Safar',
    publicationYear: 2021,
    image: 'safar21.jpg',
  },
  {
    name: 'Vermodalen',
    publicationYear: 2019,
    image: 'vermodalen19.jpg',
  },
  {
    name: 'Chaipedia',
    publicationYear: 2017,
    image: 'chaipedia17.jpg',
  },
  {
    name: 'Vox Populi',
    publicationYear: 2016,
    image: 'voxpopuli16.jpg',
  },
];

// Insert sample magazines into the database
Magazine.insertMany(Magazines)
  .then(() => {
    console.log('Sample magazines added to the database');
    mongoose.connection.close();
  })
  .catch((err) => console.error(err));
