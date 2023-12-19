const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Magazine = require('./models/magazine');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const dbUrl = 'mongodb+srv://arunnats:DouglasAdams42@clustermagcom.chf4jce.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection string
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/magArchive', async (req, res) => {
  try {
    const magazines = await Magazine.find();
    res.render('archive', { magazines });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
