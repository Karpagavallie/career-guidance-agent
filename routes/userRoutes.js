const express = require('express');
const router = express.Router();
const { getUserByEmail } = require('../controllers/userController');

router.get('/:email', getUserByEmail);

module.exports = router;