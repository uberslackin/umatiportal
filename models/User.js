const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerified: Boolean,

  snapchat: String,
  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  steam: String,
  quickbooks: String,
  tokens: Array,

  profile: {
    name: String,
    gender: String,
    story: String,
    location: String,
    website: String,
    group: String,
    business: String,
    vocation: String,
    role: Array,
    picture: String,
    salt: String,
    active: Boolean
  },
  groupsettings: {
    groupname: String,
    adminperson: String,
    location: String,
    description: String,
    shortdesc: String,
    memberlist: String,
    visibility: String
  },
  blogsettings: {
    user: String,
    blogtitle: String,
    shortdesc: String,
    blogdesc: String,
    blogtags: String,
    template: String,
    visibility: String
  },
  inventorysettings: {
    user: String,
    invtitle: String,
    shortdesc: String,
    invdesc: String,
    invtags: String,
    visibility: String
  },
  calsettings: {
    user: String,
    caltitle: String,
    shortdesc: String,
    caldesc: String,
    caltags: String,
    visibility: String
  },
  possettings: {
    user: String,
    postitle: String,
    shortdesc: String,
    posdesc: String,
    postags: String,
    visibility: String
  },
  setup: {
    username: String,
    name: String,
    amount: Number,
    sourcetype: String,
    sourcenum: String,
    postdate: Date,
    iphash: String,
    transhash: String
  },
  business: {
    name: String,
    description: String,
    contactemail: String,
    contactphone: String,
    social1: String,
    social2: String,
    social3: String,
    businesstags: String,
    postdate: Date,
    members: String,
    weburl: String
  },
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
