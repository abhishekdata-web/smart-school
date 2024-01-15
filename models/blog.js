const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String
    },
    detail: {
        type: String
    },
    keyword: {
        type: String
    },
    image: {
        type: String
    },
    date: { type: Date, default: Date.now }
})

blogSchema.index({ keyword: 'text' });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = { Blog };