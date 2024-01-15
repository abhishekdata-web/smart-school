const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    note: {
        type: String
    },
    income: {
        type: String
    },
    expense: {
        type: Number
    },
    particular: {
        type: Number
    },
    year: {
        type: Number
    }
})

const Account = mongoose.model('Account', blogSaccount);

module.exports = { Account };