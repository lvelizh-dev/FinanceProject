const bonoDB = require('../models/bono');
const jwt = require('jsonwebtoken');
const { response } = require('express');
// var finance = require('')

const bonoController = {};


function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    }
//////////con ese split obtiene separa el Token del Bearer y lo obtiene de la cabecera
   const token = req.headers.authorization.split(' ')[1];
    if(token === 'null') {
        return res.status(401).send('Unauthorized request');
    }

    const payload = jwt.verify(token, 'secretKey');
    console.log(payload);
}

    bonoController.getBonos = async (req, res) => {
        const bonos = await bonoDB.find();
        res.json(bonos);
    }

    bonoController.getBonosByUserID = async (req, res) => {
        const digitosFound = req.query.user_id;
        console.log(digitosFound)
        const bonos = await bonoDB.find({user_id: digitosFound});
        console.log('ya?');

        res.json(bonos);
    }

    bonoController.getBonosByBonistaID = async (req, res) => {
        const digitosFound = req.query.user_id;
        console.log(digitosFound)
        const bonos = await bonoDB.find({bonistas_ids: digitosFound});
        console.log('ya?');

        res.json(bonos);
    }

    bonoController.getBonoByID =  async (req, res) => {
        const e = await bonoDB.findById(req.params.id);
        res.json(e);
    }

    bonoController.editBono = async (req, res) => {
        const { id } = req.params;
        const bono = {
            valorNominal: req.body.valorNominal,
            valorComercial: req.body.valorComercial,
            nroxAnos: req.body.nroxAnos,
            frecuenciaPago: req.body.frecuenciaPago,
            diasXAno: req.body.diasXAno,
            tipoTasaInteres: req.body.tipoTasaInteres,
            capitalizacion: req.body.capitalizacion,
            tasaInteres: req.body.tasaInteres,
            tasaAnualDcto: req.body.tasaAnualDcto,
            IRenta: req.body.IRenta,
            fechaEmision: req.body.fechaEmision,
            porcentajePrima: req.body.porcentajePrima,
            porcentajeEstructuracion: req.body.porcentajeEstructuracion,
            porcentajeColocacion: req.body.porcentajeColocacion,
            porcentajeFlotacion: req.body.porcentajeFlotacion,
            porcentajeCavali: req.body.porcentajeCavali,
            user_id: req.body.user_id,
            bonistas_ids: req.body.bonistas_ids

        }
        // bonoDB.findById(req.params.id);
        await bonoDB.findByIdAndUpdate(id, {$set: bono}, {new: true});
        res.json({status: 'Bono Updated'});

    }

    bonoController.createBono = async (req, res) => {
         const e = new bonoDB(req.body);
         var response = {};
         console.log(e);
         await e.save(function(err, result){
            if(err) {
                response = {error: true, message: 'error'};
            }
            else{
                response = {error: false, message: 'añadido', id:result._id};
            }

         });
        //  const bono_id = res.insertedId;

         res.json(
             {  e,
                 'status': 'Bono saved'});
     };

     bonoController.deleteBono = async (req, res) => {
        await bonoDB.findByIdAndRemove(req.params.id);
        res.json('Bono deleted');
    }



module.exports = bonoController;