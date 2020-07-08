const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const gracePeriodController = require('../controllers/gracePeriod.controller');
const { request } = require('express');

router.get('/getGracePeriods', gracePeriodController.getGracePeriods)
router.get('/', gracePeriodController.getGracePeriodsByBonoID)
router.post('/', gracePeriodController.createGracePeriod);
router.get('/:id', gracePeriodController.getGracePeriodByID);
router.put('/:id', gracePeriodController.editGracePeriod);
router.delete('/:id', gracePeriodController.deleteGracePeriod);
router.post('/updateManyGracePeriods', gracePeriodController.updateManyGracePeriods);

 

module.exports = router;