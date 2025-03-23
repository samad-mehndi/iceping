const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');
const verifyToken = require('../utils/verifyToken');


router.post('/register',verifyToken, registerUser);

module.exports = router;
