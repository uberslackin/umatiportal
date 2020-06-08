const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.userSchema;

const elevSchema = new mongoose.Schema({
    id: Number,
    username: String,
    eleventrytitle: String,
    eleventryurl: String,
    seqid: String,
    dayid: String,
    embedcode: String,
    duration: String,
    elevdate: Date,
    post: String,
    elevtags: String,
    location: String,
    elevcat: String,
    group: String,
    visibility: String,
}, { timestamps: true });

/**
 * Password hash middleware.
*

  var data = {
    user : req.body.user,
    eleventrytitle : req.body.elevtitle,
    post : req.body.post,
    location : req.body.location,
    elevcat : req.body.elevcat,
    elevtags : req.body.elevtags,
    elevdate : req.body.elelvdate,
    time : req.body.time,
    visibility: req.body.visibility

blogSchema.pre('save', function save(next) {
  const cal = this;
  if (!blog.isModified('posttitle')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(blog.posttitle, salt, (err, hash) => {
      if (err) { return next(err); }
      pos.posttitle = hash;
      next();
    });
  });
});
 */
 
const Elevator = mongoose.model('Elevator', elevSchema);

module.exports = Elevator;


