const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Magazine = require('../../models/magazine');
const Article = require('../../models/article')
const User = require('../../models/user')

const dbUrl = 'mongodb+srv://arunnats:DouglasAdams42@clustermagcom.chf4jce.mongodb.net/?retryWrites=true&w=majority';

async function addMagazine(data) {
    try {
      // Connect to MongoDB
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log('Adding Magazine:', data);

      const magazine = new Magazine(data);
  
      // Save the magazine to the database
      await magazine.save();
  
      console.log('Magazine added to the database');
    } catch (err) {
      // Log the error if there's an issue
      console.error(err);
      // Rethrow the error to propagate it to the calling function
      throw err;
    } 
  }
  async function addArticle(data) {
    try {
      // Connect to MongoDB
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      console.log('Adding Article:', data);
  
      const highestIndexArticle = await Article.findOne({}, {}, { sort: { indexNumber: -1 } });
      console.log(highestIndexArticle.indexNumber);
      const newIndex = highestIndexArticle ? highestIndexArticle.indexNumber + 1 : 0;
      const articleDataWithIndex = { ...data, indexNumber: newIndex };
      const article = new Article(articleDataWithIndex);

      await article.save();
      console.log('Article added to the database');
    } catch (err) {
      // Log the error if there's an issue
      console.error(err);
      // Rethrow the error to propagate it to the calling function
      throw err;
    }
  }
  
  async function removeMagazine(data) {
    try {
      // Connect to MongoDB
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      console.log('Removing Magazine:', data);
  
      // Find and remove the magazine from the database
      const removedMagazine = await Magazine.findOneAndDelete({ name: data.name });
  
      if (removedMagazine) {
        console.log('Magazine removed from the database:', removedMagazine);
      } else {
        console.log('Magazine not found');
      }
    } catch (err) {
      // Log the error if there's an issue
      console.error(err);
      // Rethrow the error to propagate it to the calling function
      throw err;
    }
  }
  
  async function removeArticle(data) {
    try {
      // Connect to MongoDB
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      console.log('Removing Article:', data);
  
      const removedArticle = await Article.findOneAndDelete({ articleID: data.articleID });
  
      if (removedArticle) {
        console.log('Article removed from the database:', removedArticle);
      } else {
        console.log('Article not found');
      }
    } catch (err) {
      // Log the error if there's an issue
      console.error(err);
      // Rethrow the error to propagate it to the calling function
      throw err;
    }
  }
  
  async function resetMagazines() {
    try {
      // Connect to MongoDB
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      console.log('Resetting Magazines');
  
      // Delete all magazines from the database
      await Magazine.deleteMany({});
  
      console.log('All magazines removed from the database');
    } catch (err) {
      // Log the error if there's an issue
      console.error(err);
      // Rethrow the error to propagate it to the calling function
      throw err;
    }
  }
  
  async function resetArticles() {
    try {
      // Connect to MongoDB
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      console.log('Resetting Articles');
  
      // Delete all articles from the database
      await Article.deleteMany({});
  
      console.log('All articles removed from the database');
    } catch (err) {
      // Log the error if there's an issue
      console.error(err);
      // Rethrow the error to propagate it to the calling function
      throw err;
    }
  }
  
  async function addUser(data) {
    try {
      // Connect to MongoDB
      await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      console.log('Adding User:', data);

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = new User({
        username: data.username,
        hashedPassword: hashedPassword,
      });

      await user.save();
  
      console.log('User added to the database');
    } catch (err) {
      // Log the error if there's an issue
      console.error(err);
      // Rethrow the error to propagate it to the calling function
      throw err;
    }
  }
  
async function removeUser(data) {
  try {
      // Connect to MongoDB
      await mongoose.connect(dbUrl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });

      console.log('Removing User:', data);

      // Find the user by username
      const user = await User.findOne({ username: data.username });

      if (user) {
          // Compare the provided password with the hashed password
          const passwordMatch = await bcrypt.compare(data.password, user.hashedPassword);

          if (passwordMatch) {
              // If the passwords match, remove the user
              const removedUser = await User.findOneAndDelete({ username: data.username });

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
      // Log the error if there's an issue
      console.error(err);
      // Rethrow the error to propagate it to the calling function
      throw err;
  }
}

function test() {

    console.log('test');

}

module.exports = {
    addMagazine,
    addArticle,
    removeArticle,
    removeMagazine,
    resetArticles,
    resetMagazines,
    addUser,
    removeUser,
    test,
};  