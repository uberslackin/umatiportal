const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.userSchema;

const blogSchema = new mongoose.Schema({
    id: Number,
    user: String,
    username: String,
    posttitle: String,
    post: String,
    postfiles: Object,
    location: String,
    postcat: String,
    posttags: String,
    postdate: Date,
    iphash: String,
    group: String,
    transhash: String,
    visibility: String
}, { timestamps: true });

 
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;


