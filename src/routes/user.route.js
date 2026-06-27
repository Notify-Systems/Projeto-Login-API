const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const auth = require("../middleware/auth.middleware")

router.post("/", controller.create);

router.post("/login", controller.login);

router.get("/", auth, controller.view)

router.patch("/", auth , controller.update)

router.delete("/", auth , controller.delete)

router.get("/refresh", controller.refresh)

router.put("/setTheme", auth, controller.setTheme)

module.exports = router;