const express = require('express');
const router = express.Router();
const { addUser, login, infoUsuario, alterarUsuario, autoDelete, refresh} = require('../controllers/user.controller');
const auth = require("../middleware/auth.middleware")

router.post("/", addUser);

router.post("/login", login );

router.get("/", auth, infoUsuario)

router.patch("/", auth , alterarUsuario)

router.delete("/", auth ,autoDelete)

router.get("/refresh", refresh)

module.exports = router;