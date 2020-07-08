const mongoose = require('mongoose');
const { Schema } = mongoose;

const configSchema = new Schema({
    method: { type: String, required: true },
    coin: { type: String, required: true },
    user_id: { type: String, required: true },
})

module.exports = mongoose.model('Config', configSchema);