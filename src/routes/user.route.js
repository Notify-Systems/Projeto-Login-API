const express = require('express');
const router = express.Router();
const { addUser } = require('../controllers/user.controller');

router.post("/usuario", addUser);

router.post("/usuario", addUser);

module.exports = router;