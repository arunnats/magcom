const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const Magazine = require('./models/magazine');
const Article = require('./models/article');
const User = require('./models/user');
const bodyParser = require('body-parser');
const DatabaseFunctions = require('./public/scripts/databaseFunctions.js'); // Adjust the path as needed

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());


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


app.get('/', async (req, res) => {
  try {
    const latestMagazine = await Magazine.findOne().sort({ publicationYear: -1 });
    res.render('index', { latestMagazine });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/magArchive', async (req, res) => {
  try {
    const magazines = await Magazine.find();
    res.render('magArchive', { magazines });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});


app.get('/articles', async (req, res) => {
  try {
    res.render('articles', { });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/newsletter', async (req, res) => {
  try {
    res.render('newsletter', { });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/admin', async (req, res) => {
  try {
    res.render('admin', {});
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/admin/dashboard', async (req, res) => {
  try {
    res.render('adminDashboard', {});
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// POST REQUESTS

app.post('/admin/dashboard/test', async (req, res) => {
  
  const data = req.body; // Assuming the data is sent in the request body
  try {
    console.log(data);
    console.log("cleared 4");
    res.json({ success: true, message: 'test success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/admin/dashboard/addmagazine', async (req, res) => { 
  const data = req.body;
  try {
    await DatabaseFunctions.addMagazine(data);
    res.json({ success: true, message: 'Magazine added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/admin/dashboard/addarticle', async (req, res) => {
  const data = req.body; // Assuming the data is sent in the request body
    try {
        await DatabaseFunctions.addArticle(data);
        console.log("cleared 4")
        res.json({ success: true, message: 'Magazine added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/admin/dashboard/removemagazine', async (req, res) => {
  const data = req.body; // Assuming the data is sent in the request body
    try {

        await DatabaseFunctions.removeMagazine(data);
        res.json({ success: true, message: 'Magazine added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/admin/dashboard/removearticle', async (req, res) => {
  const data = req.body; // Assuming the data is sent in the request body
    try {

        await DatabaseFunctions.removeArticle(data);
        res.json({ success: true, message: 'Magazine added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/admin/dashboard/resetmagazines', async (req, res) => {
  try {
    await DatabaseFunctions.resetMagazines();
    res.json({ success: true, message: 'Magazines reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/admin/dashboard/resetarticles', async (req, res) => {
  try {
    await DatabaseFunctions.resetArticles();  
    res.json({ success: true, message: 'Articles reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/admin/dashboard/adduser', async (req, res) => {
  const data = req.body; // Assuming the data is sent in the request body
    try {
        await DatabaseFunctions.addUser(data);
        res.json({ success: true, message: 'Magazine added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/admin/dashboard/removeuser', async (req, res) => {
  const data = req.body; // Assuming the data is sent in the request body
    try {

        await DatabaseFunctions.removeUser(data);
        res.json({ success: true, message: 'Magazine added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  try {
    const user = await User.findOne({ username });

    if (user) {
      console.log("User found");
      const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
      if (isPasswordValid) {
        res.json({ success: true, redirect: '/admin/dashboard' });
      } else {
        res.json({ success: false, message: "Invalid Password! Try again" });
      }
    } else {
      console.log("User not found");
      res.json({ success: false, message: "User not found. Try again" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});




app.get('/submissions', async (req, res) => {
  try {
    res.render('submissions', { });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

//magazine viewer

app.get('/open-pdf/:magazineName', async (req, res) => {
  try {
    // Find the magazine by name in MongoDB
    const magazine = await Magazine.findOne({ name: req.params.magazineName });

    if (!magazine) {
      return res.status(404).send('Magazine not found');
    }    

    // Set the appropriate content type for a PDF file
    res.setHeader('Content-Type', 'application/pdf');

    // Send the PDF file as a response
    const pdfFilePath = path.join(__dirname, 'public', 'content', 'magazine', magazine.fileName);
    res.sendFile(pdfFilePath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//article viewer

app.get('/open-article/:articleId', async (req, res) => {
  try {
    const article = await Article.findOne({ articleID: req.params.articleId });

    if (!article) {
      return res.status(404).send('Article not found');
    }

    res.render('articleView', { article });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
