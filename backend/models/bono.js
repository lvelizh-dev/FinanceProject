const mongoose = require('mongoose');
const { Schema } = mongoose;
var User = require('../models/user');


const BonoSchema = new Schema({
    valorNominal: { type: Number, required: true },
    valorComercial: { type: Number, required: true },
    nroxAnos: { type: Number, required: true },
    frecuenciaPago: { type: String, required: true },
    diasXAno: { type: Number, required: true },
    tipoTasaInteres: { type: String, required: true },
    capitalizacion: { type: String, required: true },
    tasaInteres: { type: Number, required: true },
    tasaAnualDcto: { type: Number, required: true },
    IRenta: { type: Number, required: true },
    fechaEmision: { type: String, required: true },
    porcentajePrima: { type: Number, required: false },
    porcentajeEstructuracion: { type: Number, required: false },
    porcentajeColocacion: { type: Number, required: false },
    porcentajeFlotacion: { type: Number, required: false },
    porcentajeCavali: { type: Number, required: false },
    user_id: { type: String, required: true},
    bonistas_ids: [{type: Schema.Types.ObjectId, ref: 'User'}]
    
 
    
},
{
    timestamps: true
}

);

module.exports = mongoose.model('Bono', BonoSchema);
