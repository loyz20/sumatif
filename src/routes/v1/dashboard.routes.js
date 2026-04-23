const express = require('express');
const dashboardController = require('../../modules/dashboard/controller');

const router = express.Router();

router.get('/summary', dashboardController.getSummary);

module.exports = router;
