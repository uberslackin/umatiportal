const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.userSchema;

const locSchema = new mongoose.Schema({
    id: Number,
    user: String,
    username: String,
    loctitle: String,
    authorname: String,
    description: String,
    locfiles: Object,
    lat: String,
    long: String,
    location: String,
    loccat: String,
    loctags: String,
    postdate: Date,
    iphash: String,
    group: String,
    transhash: String,
    visibility: String
}, { timestamps: true });

 
const Loc = mongoose.model('Loc', locSchema);

module.exports = Loc;
