const express = require('express');
const router = express.Router();
const bakerController = require('../controller/bakers.controller');
const verifyToken = require("../middleware/verfiyToken");

router.route('/:bakerId')
    .get(verifyToken, bakerController.getBakerProfile);

module.exports = router;