const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const inflationController = require('../controllers/inflation.controller');
const { request } = require('express');

router.get('/getInflations', inflationController.getInflations)
router.get('/', inflationController.getInflationsByBonoID)
router.post('/', inflationController.createInflation);
router.get('/:id', inflationController.getInflationByID);
router.put('/:id', inflationController.editInflation);
router.delete('/:id', inflationController.deleteInflation);
router.post('/updateManyInflations', inflationController.updateManyInflations);


 

module.exports = router;