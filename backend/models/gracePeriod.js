const mongoose = require('mongoose');
const { Schema } = mongoose;

const gracePeriodSchema = new Schema({
    tipo: { type: String, required: true },
    cuota: { type: Number, required: true },
    bono_id: { type: String, required: true },
})

module.exports = mongoose.model('gracePeriod', gracePeriodSchema);