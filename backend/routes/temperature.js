const express = require("express");
const router = express.Router();
const {getTemperature} = require("../controllers/temperature");

// define routes
router.get("/getTemperature", getTemperature);

module.exports = router;