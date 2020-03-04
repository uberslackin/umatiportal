const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.userSchema;

const blogSchema = new mongoose.Schema({
    id: Number,
    name: String,
    user: String,
    username: String,
    posttitle: String,
    post: String,
    location: String,
    postcat: String,
    posttags: String,
    postdate: Date
}, { timestamps: true });

 
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;


