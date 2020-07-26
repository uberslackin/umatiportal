const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    id: Number,
    donationname: String,
    user: String,
    group: String,
    description: String,
    carsizeneeded: String,
    value: String,
    taxcredit: String,
    location: String,
    donationcat: String,
    donationtags: String,
    pickuptime: Date,
    pickupperson: String,
    pickedup: String,
    droppedof: String,
    recievedby: String,
    dropofftime: Date,
}, { timestamps: true });

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
