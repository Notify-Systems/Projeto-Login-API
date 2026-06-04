const express = require('express');
const router = express.Router();
const { addUser, login, infoUsuario} = require('../controllers/user.controller');
const auth = require("../middleware/auth.middleware")

router.post("/usuario", addUser);

router.post("/usuario/login", login );

router.get("/usuario", auth, infoUsuario)

module.exports = router;