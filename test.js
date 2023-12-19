const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Magazine = require('./models/magazine');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/test', (req, res) => {
    res.render('test', { title: 'Magazine' });
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  
  
  