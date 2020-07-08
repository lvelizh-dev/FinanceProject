const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const bonoController = require('../controllers/bono.controller');
const { request } = require('express');

// router.get('/', (req, res) => {
//     res.json({
//         object: 'API is working!'
//     })
// })

// function verifyToken(req, res, next) {
//     if(!req.headers.authorization) {
//         return res.status(401).send('Unauthorized request');
//     }
// //////////con ese split obtiene separa el Token del Bearer y lo obtiene de la cabecera
//    const token = req.headers.authorization.split(' ')[1];
//     if(token === 'null') {
//         return res.status(401).send('Unauthorized request');
//     }

//     const payload = jwt.verify(token, 'secretKey');
//     console.log(payload);
// }
router.get('/getBonos', bonoController.getBonos)
router.get('/', bonoController.getBonosByUserID)
router.get('/getByBonista', bonoController.getBonosByBonistaID);
router.post('/', bonoController.createBono);
router.get('/:id', bonoController.getBonoByID);
router.put('/:id', bonoController.editBono);
router.delete('/:id', bonoController.deleteBono);



module.exports = router;