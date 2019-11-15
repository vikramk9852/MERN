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
    blog_data: {
        type: String
    },
    blog_state: {
        type: String
    },
    blog_writer: {
        type: String,
        default: "5d7df1de4c643e353b4af3fa"
    }
});

module.exports = Blog = mongoose.model('Blog', Blog);