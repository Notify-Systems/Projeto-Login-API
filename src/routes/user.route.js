const express = require('express');
const router = express.Router();
const { addUser, login, infoUsuario} = require('../controllers/user.controller');
const auth = require("../middleware/auth.middleware")

router.post("/usuario", addUser);

router.post("/login", login );

router.get("/", auth, infoUsuario)


module.exports = router;