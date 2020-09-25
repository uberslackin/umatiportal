const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.userSchema;

const mediaSchema = new mongoose.Schema({
    id: Number,
    user: String,
    username: String,
    title: String,
    author: String,
    license: String,
    licenseurl: String,
    imageurl: String,
    backupurl: String,
    imagetags: String,
    imagecat: String,
    iphash: String,
    iphashtimestamp: String,
    project: String,
    group: String,
    visibility: String
}, { timestamps: true });

 
const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;


