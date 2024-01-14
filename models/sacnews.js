const mongoose = require('mongoose');

const sacNewsSchema = new mongoose.Schema({
  sacID: { type: String, required: true },
  title: { type: String, required: true },
  publicationYear: { type: Number, required: false },
  publicationMonth: { type: String, required: false },
  publicationDate: { type: Number, required: false },
  pdfUrl: { type: String, required: true },
});

const SACNews = mongoose.model('SACNews', sacNewsSchema);

module.exports = SACNews;
