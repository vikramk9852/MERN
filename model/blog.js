const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Blog = new Schema({
    blog_title: {
        type: String
    },
    blog_category: {
        type: String
    },
    blog_publish_date: {
        type: String
    },
    blog_description: {
        type: String
    },
    blog_data: {
        type: String
    },
    blog_state: {
        type: String
    }
});

module.exports = Blog = mongoose.model('Blog', Blog);