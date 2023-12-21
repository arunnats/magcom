const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Magazine = require('./models/magazine');
const Article = require('./models/article');

const app = express();
const PORT = process.env.PORT || 3000;

const mockUser = {
  username: "magcom",
  password: "arunnats",
};

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

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === mockUser.username && password === mockUser.password) {
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin'); 
    alert("Invalid! Try again")
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
    const article = await Article.findOne({ title: req.params.articleId });

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
