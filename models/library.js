const mongoose = require('mongoose');

const librarySchema = mongoose.Schema({
    title: {
        type: String
    },
    author: {
        type: String
    },
    standard: {
        type: String
    },
    quantity: {
        type: Number
    },
    bookedBy: {
        type: Array,
        default: []
    },
    date: { type: Date, default: Date.now }
})

const Library = mongoose.model('Library', librarySchema);

module.exports = { Library };