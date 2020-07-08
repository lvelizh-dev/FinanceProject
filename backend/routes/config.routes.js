const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const configController = require('../controllers/config.controller');
const { request } = require('express');

router.get('/getConfigs', configController.getConfigs)
router.get('/', configController.getConfigsByUserID)
router.post('/', configController.createConfig);
router.get('/:id', configController.getConfigByID);
router.put('/:id', configController.editConfig);
router.delete('/:id', configController.deleteConfig);

 

module.exports = router;