const express = require('express');
const router = express.Router();
const DatabaseFunctions = require('../scripts/databaseFunctions'); // Adjust the path as needed

router.post('/addMagazine', async (req, res) => {
  try {
      const data = req.body;
      await yourDatabaseFunctions.addMagazine(data);
      res.status(200).json({ success: true, message: 'Magazine added successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;