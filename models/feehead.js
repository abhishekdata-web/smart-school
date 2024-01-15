const mongoose = require('mongoose');

const feeHeadSchema = mongoose.Schema({
    particular: {
        type: String
    },
    amount: {
        type: Number
    },
    mobile: {
        type: Number
    },
    type: {
        type: Number
    },
    due: {
        type: Number
    }
})

const Feehead = mongoose.model('Feehead', feeHeadSchema);

module.exports = { Feehead };