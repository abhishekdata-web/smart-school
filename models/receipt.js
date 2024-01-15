const mongoose = require('mongoose');

const receitptSchema = mongoose.Schema({
    mobile: {
        type: Number
    },
    month: {
        type: String
    },
    particular: {
        type: String
    },
    amount: {
        type: Number
    },
    data: {
        type: Array
    },
    date: { type: Date, default: Date.now }
})

const Receipt = mongoose.model('Receipt', receitptSchema);

module.exports = { Receipt };