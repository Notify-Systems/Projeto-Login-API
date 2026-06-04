const express = require("express");
const router = express.Router();
const {mostrarUsuarios,deleteUsuario} = require("../controllers/adm.controller");
const auth = require("../middleware/auth.middleware");
const permission = require("../middleware/perm.middleware");

router.get("/users", auth, permission, mostrarUsuarios);

router.delete("/user", auth, permission, mostrarUsuarios);

module.exports = router
