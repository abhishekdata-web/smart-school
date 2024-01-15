const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
    note: {
        type: String
    },
    mobile: {
        type: Number
    },
    image: {
        type: String
    },
    date: { type: Date, default: Date.now }
})

const Result = mongoose.model('Result', resultSchema);

module.exports = { Result };