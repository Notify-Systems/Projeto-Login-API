const express = require('express');
const router = express.Router();
const { addUser, login, infoUsuario, alterarUsuario, autoDelete} = require('../controllers/user.controller');
const auth = require("../middleware/auth.middleware")

router.post("/usuario", addUser);

router.post("/usuario/login", login );

router.get("/usuario", auth, infoUsuario)

router.patch("/usuario", auth , alterarUsuario)

router.delete("/usuario", auth ,autoDelete)

module.exports = router;