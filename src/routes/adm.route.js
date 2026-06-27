const express = require("express");
const router = express.Router();
const controller = require("../controllers/adm.controller");
const auth = require("../middleware/auth.middleware");
const permission = require("../middleware/perm.middleware");

router.get("/users", auth, permission, controller.viewUser);

router.delete("/user", auth, permission, controller.deleteUser);

module.exports = router
