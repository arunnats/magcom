const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  articleID: { type: String, required: true },
  title: { type: String, required: true },
  publicationYear: { type: Number, required: false },
  publicationMonth: { type: String, required: false },
  publicationDate: { type: Number, required: false },
  coverImgName: { type: String, required: true },
  content: { type: String, required: true },
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;