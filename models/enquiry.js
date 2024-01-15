const mongoose = require('mongoose');

const enquirySchema = mongoose.Schema({
    name: {
        type: String
    },
    mobile: {
        type: Number
    },
    email: {
        type: String
    },
    message: {
        type: String
    },
    course: {
        type: String
    },
    who: {
        type: Number
    },
    date: { type: Date, default: Date.now }
})

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = { Enquiry };