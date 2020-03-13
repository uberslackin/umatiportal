const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.userSchema;

const posSchema = new mongoose.Schema({
    id: Number,
    name: String,
    username: String,
    postitle: String,
    post: String,
    location: String,
    poscat: String,
    postag: String,
    posdate: Date,
    posHash1: String,
    posHash2: String,
    posHash3: String,
    posHash4: String,
    posHash5: String,
    visibility: String
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
 
module.exports = mongoose.model('Pos', posSchema);