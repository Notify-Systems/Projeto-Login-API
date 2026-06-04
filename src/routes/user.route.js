const express = require('express');
const router = express.Router();
const { addUser, login, infoUsuario, alterarUsuario, autoDelete} = require('../controllers/user.controller');
const auth = require("../middleware/auth.middleware")

router.post("/", addUser);

router.post("/login", login );

router.get("/", auth, infoUsuario)

router.patch("/", auth , alterarUsuario)

router.delete("/", auth ,autoDelete)

module.exports = router;