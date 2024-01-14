const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const bodyParser = require('body-parser');
const Magazine = require('./models/magazine');
const Article = require('./models/article');
const User = require('./models/user');
const DatabaseFunctions = require('./public/scripts/databaseFunctions.js');
const config = require('./config.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());

// Configure Express sessions
app.use(session({
  secret: config.secretKey,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  },
});

const uploadFilesMiddleware = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]);

const dbUrl = config.dbURL;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/admin/login');
}


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
    const articles = await Article.find().sort({ indexNumber: -1 });
    res.render('articleArchive', {articles});
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/articles/more', async (req, res) => {
  try {
    const articles = await Article.find().sort({ indexNumber: -1 });
    res.render('articleAll', {articles});
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

app.get('/admin/login', async (req, res) => {
  try {
    res.render('admin', {});
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/admin/dashboard', isAuthenticated, async (req, res) => {
  try {
    res.render('adminDashboard', {});
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// POST REQUESTS

app.get('/admin/dashboard/test', async (req, res) => {
  try {
    res.render('adminDashboard', {});
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.post('/admin/dashboard/addmagazine', uploadFilesMiddleware, async (req, res) => {
  const data = req.body;
  const imageFile = req.files['image'][0];
  const pdfFile = req.files['pdfFile'][0];

  try {
    await DatabaseFunctions.addMagazine(data, imageFile, pdfFile);
    res.json({ success: true, message: 'Magazine added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/admin/dashboard/addarticle', uploadFilesMiddleware,  async (req, res) => {
  const data = req.body; 
  const imageFile = req.files['image'][0];
    try {
        await DatabaseFunctions.addArticle(data, imageFile);
        res.json({ success: true, message: 'Magazine added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/admin/dashboard/addsacnews', uploadFilesMiddleware, async (req, res) => {
  const data = req.body; 
  const pdfFile = req.files['pdfFile'][0];;
    try {
        await DatabaseFunctions.addSACNews(data, pdfFile);
        res.json({ success: true, message: 'SAC News added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


app.post('/admin/dashboard/removemagazine', uploadFilesMiddleware, async (req, res) => {
  const data = req.body; 
    try {

        await DatabaseFunctions.removeMagazine(data);
        res.json({ success: true, message: 'Magazine added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/admin/dashboard/removearticle', uploadFilesMiddleware, async (req, res) => {
  const data = req.body;
    try {

        await DatabaseFunctions.removeArticle(data);
        res.json({ success: true, message: 'Magazine added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/admin/dashboard/removeSacNews', uploadFilesMiddleware, async (req, res) => {
  const data = req.body;
    try {

        await DatabaseFunctions.removeSACNews(data);
        res.json({ success: true, message: 'SacNews added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/admin/dashboard/resetmagazines', uploadFilesMiddleware,  async (req, res) => {
  try {
    await DatabaseFunctions.resetMagazines();
    res.json({ success: true, message: 'Magazines reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/admin/dashboard/resetarticles', uploadFilesMiddleware, async (req, res) => {
  try {
    await DatabaseFunctions.resetArticles();  
    res.json({ success: true, message: 'Articles reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/admin/dashboard/resetsacnews', uploadFilesMiddleware, async (req, res) => {
  try {
    await DatabaseFunctions.resetSACNews();  
    res.json({ success: true, message: 'Sac news reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/admin/dashboard/adduser', uploadFilesMiddleware, async (req, res) => {
  const data = req.body;
  console.log(data);
    try {
        await DatabaseFunctions.addUser(data);
        res.json({ success: true, message: 'User added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/admin/dashboard/removeuser', uploadFilesMiddleware, async (req, res) => {
  const data = req.body;
    try {

        await DatabaseFunctions.removeUser(data);
        res.json({ success: true, message: 'User removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/admin/login', passport.authenticate('local'), (req, res) => {
  console.log('User authenticated:', req.user);
  res.json({ success: true, redirect: '/admin/dashboard' });
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
