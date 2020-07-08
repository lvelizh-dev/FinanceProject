const mongoose = require('mongoose');
const { Schema } = mongoose;

const inflationSchema = new Schema({
    inflation: { type: Number, required: true },
    year: { type: Number, required: true },
    bono_id: { type: String, required: true },
})

module.exports = mongoose.model('Inflation', inflationSchema);