const express = require('express');
const { test, updateUser } = require('../controller/user.controller');
const verifyToken = require('../utils/verifyUser');

const router = express.Router();

router.get('/user', test);
router.post('/update/:id',verifyToken, updateUser);

module.exports = router;