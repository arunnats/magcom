const mongoose = require('mongoose');
const passport = require('passport');
const Magazine = require('../../models/magazine');
const Article = require('../../models/article')
const User = require('../../models/user')
const SACNews = require('../../models/sacnews')
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const config = require('../../config.json');

const dbUrl = config.dbURL;

const storage = new Storage({
  projectId: 'minutes-maker-410913',
  keyFilename: './minutes-maker-410913-8184e634cdc3.json',
});

const bucket = storage.bucket('magcom');
const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
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

async function addMagazine(data, imageFile, pdfFile) {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Adding Magazine:', data);

    const imageFileName = `magazines/covers/${Date.now()}-${imageFile.originalname}`;
    const pdfFileName = `magazines/pdfs/${Date.now()}-${pdfFile.originalname}`;

    const imageUploadStream = bucket.file(imageFileName).createWriteStream();
    imageUploadStream.end(imageFile.buffer);

    const pdfUploadStream = bucket.file(pdfFileName).createWriteStream();
    pdfUploadStream.end(pdfFile.buffer);

    await Promise.all([
      new Promise((resolve, reject) => {
        imageUploadStream.on('finish', resolve);
        imageUploadStream.on('error', reject);
      }),
      new Promise((resolve, reject) => {
        pdfUploadStream.on('finish', resolve);
        pdfUploadStream.on('error', reject);
      }),
    ]);

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${imageFileName}`;
    const pdfUrl = `https://storage.googleapis.com/${bucket.name}/${pdfFileName}`;

    const magazine = new Magazine({ ...data, imageUrl, pdfUrl });

    await magazine.save();

    console.log('Magazine added to the database');
  } catch (err) {
    console.error(err);
    throw err;
  }
}


async function addArticle(data, imageFile) {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const highestIndexArticle = await Article.findOne({}, { indexNumber: 1 })
      .sort({ indexNumber: -1 })
      .exec();
    
    const newIndexNumber = highestIndexArticle ? highestIndexArticle.indexNumber + 1 : 1;

    console.log('Adding Article:', data);

    const imageFileName = `articles/covers/${Date.now()}-${imageFile.originalname}`;

    const imageUploadStream = bucket.file(imageFileName).createWriteStream();
    imageUploadStream.end(imageFile.buffer);

    await Promise.all([
      new Promise((resolve, reject) => {
        imageUploadStream.on('finish', resolve);
        imageUploadStream.on('error', reject);
      })
    ]);

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${imageFileName}`;

    const article = new Article({ ...data, indexNumber: newIndexNumber, imageUrl});

    await article.save();

  } catch (err) {
    console.error(err);
    throw err;
  }
}
  
async function addSACNews(data, pdfFile) {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Adding SAC news:', data);

    const pdfFileName = `sac/pdfs/${Date.now()}-${pdfFile.originalname}`;

    const pdfUploadStream = bucket.file(pdfFileName).createWriteStream();
    pdfUploadStream.end(pdfFile.buffer);

    await Promise.all([
      new Promise((resolve, reject) => {
        pdfUploadStream.on('finish', resolve);
        pdfUploadStream.on('error', reject);
      }),
    ]);

    const pdfUrl = `https://storage.googleapis.com/${bucket.name}/${pdfFileName}`;

    const sacnews = new SACNews({ ...data, pdfUrl});

    await sacnews.save();

  } catch (err) {
    console.error(err);
    throw err;
  }
}
  
async function removeMagazine(data) {
  let removedMagazine; 

  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Removing Magazine:', data);

    removedMagazine = await Magazine.findOneAndDelete({ name: data.name });

    if (removedMagazine) {
      console.log('Magazine removed from the database:', removedMagazine);

      const imageFileName = removedMagazine.imageUrl.split('/').pop();
      const imageFile = bucket.file(`magazines/images/${imageFileName}`);
      await imageFile.delete();

      const pdfFileName = removedMagazine.pdfUrl.split('/').pop();
      const pdfFile = bucket.file(`magazines/pdfs/${pdfFileName}`);
      await pdfFile.delete();
    } else {
      console.log('Magazine not found');
    }
  } catch (err) {
    console.error(err);
    throw err;
  } 
}

  
async function removeArticle(data) {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Removing Article:', data);

    const removedArticle = await Article.findOneAndDelete({ articleID: data.articleID });

    if (removedArticle) {
      console.log('Article removed from the database:', removedArticle);

      const imageFileName = removedArticle.imageUrl.split('/').pop();
      const imageFile = bucket.file(`articles/covers/${imageFileName}`);
      await imageFile.delete();
    } else {
      console.log('Article not found');
    }
  } catch (err) {
    console.error(err);
    throw err;
  } 
}

async function removeSACNews(data) {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Removing SAC News:', data);

    const removedSAC = await SACNews.findOneAndDelete({ sacID: data.sacID });

    if (removedSAC) {
      console.log('SAC news removed from the database:', removedSAC);

      const pdfFileName = removedSAC.pdfUrl.split('/').pop();
      const pdfFile = bucket.file(`sac/pdfs/${pdfFileName}`);
      await pdfFile.delete();
    } else {
      console.log('SAC news not found');
    }
  } catch (err) {
    console.error(err);
    throw err;
  } 
}

async function resetMagazines() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Resetting Magazines');

    const magazines = await Magazine.find({});
    await Magazine.deleteMany({});

    for (const magazine of magazines) {
      const imageFileName = magazine.imageUrl.split('/').pop();
      const pdfFileName = magazine.pdfUrl.split('/').pop();

      const imageFile = bucket.file(`magazines/images/${imageFileName}`);
      const pdfFile = bucket.file(`magazines/pdfs/${pdfFileName}`);

      await Promise.all([
        imageFile.delete(),
        pdfFile.delete(),
      ]);
    }

    console.log('All magazines and associated files removed from the database and Google Cloud Storage');
  } catch (err) {
    console.error(err);
    throw err;
  } 
}

async function resetArticles() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Resetting Articles');

    const articles = await Article.find({});
    await Article.deleteMany({});

    for (const article of articles) {
      const imageFileName = article.imageUrl.split('/').pop();
      const imageFile = bucket.file(`articles/covers/${imageFileName}`);
      await imageFile.delete();
    }

    console.log('All articles and associated files removed from the database and Google Cloud Storage');
  } catch (err) {
    console.error(err);
    throw err;
  } 
}

async function resetSACNews() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Resetting SAC News');

    const sacNews = await SACNews.find({});
    await SACNews.deleteMany({});

    for (const sacNew of sacNews) {
      const pdfFileName = sacNew.pdfUrl.split('/').pop();
      const pdfFile = bucket.file(`sac/pdfs/${pdfFileName}`);
      await pdfFile.delete();
    }

    console.log('All SAC News and associated files removed from the database and Google Cloud Storage');
  } catch (err) {
    console.error(err);
    throw err;
  } 
}

  
async function addUser(data) {
  try {
    await User.register(new User({ username: data.username }), data.password);
    console.log('User added to the database');
  } catch (err) {
    console.error(err);
    throw err;
  }
}
  
async function removeUser(data) {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Removing User:', data);

    const user = await User.findOne({ username: data.username });

    if (user) {
      if (user.authenticate(data.password)) {
        const removedUser = await User.findOneAndDelete({ username: user.username });
        if (removedUser) {
          console.log('User removed from the database:', removedUser); 
          
        } else {
          console.log('Error removing user');
        }
      } else {
        console.log('Incorrect password');
      }
    } else {
      console.log('User not found');
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function test() {
  console.log('test');
}

module.exports = {
  addMagazine,
  addArticle,
  addSACNews,
  removeArticle,
  removeMagazine,
  removeSACNews,
  resetArticles,
  resetMagazines,
  resetSACNews,
  addUser,
  removeUser,
  test,
};
