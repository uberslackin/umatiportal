const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String,
  user: String,
  visibility: String,
  comment: String,
  address1: String,
  address2: String,
  country: String,
  postalcode: String,
  postalcode: String,
  vetted: Date,
  phoneh: Date,
  phoneb: Date,
  source: Date,
  group: String,
  project: String,
  iphash: String,
  transhash: String
 }, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
