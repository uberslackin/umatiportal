const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.userSchema;

const calSchema = new mongoose.Schema({
    id: Number,
    name: String,
    user: String,
    username: String,
    calentrytitle: String,
    post: String,
    location: String,
    calcat: String,
    caltags: String,
    caldate: Date,
    time: String,
    sharedwith: Array,
}, { timestamps: true });

/**
 * Password hash middleware.
*
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
 
const Cal = mongoose.model('Cal', calSchema);

module.exports = Cal;


