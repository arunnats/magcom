const mongoose = require('mongoose');

const magazineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  publicationYear: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  pdfUrl: { type: String, required: true },
});

const Magazine = mongoose.model('Magazine', magazineSchema);

module.exports = Magazine;
