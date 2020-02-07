const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Blog = require('../models/Blog');
const User = require('../models/User');


const randomBytesAsync = promisify(crypto.randomBytes);


/**
 * GET /account/blog
 * Blog manager.
 */
exports.getBlog = (req, res) => {
  res.render('account/blog', {
    title: 'Blog manager'
  });
};

/**
 * POST /blog
 * Sign in using email and password.
 */
exports.postBlog = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.blogpost)) validationErrors.push({ msg: 'Blog post cannot be blank.' });
};

/**
 * GET /createpost
 * Signup page.
 */
exports.getCreatepost = (req, res) => {
  res.render('account/createpost', {
    title: 'Create post'
  });
};


/**
 * POST /createpost
 * Create a new local account.
 */
exports.postCreatepost = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isAscii(req.body.posttitle)) validationErrors.push({ msg: 'Please enter a title for your new post.' });
  if (!validator.isAscii(req.body.post)) validationErrors.push({ msg: 'Please add some content to your post.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/createpost');
  }

  const blog = new Blog({
    name: req.body.name,
    posttitle: req.body.posttitle,
    post: req.body.post, 
    location: req.body.location, 
    postcat: req.body.postcat,
    posttags: req.body.posttags,
    postdate: req.body.postdate
  });

  Blog.findOne({ posttitle: req.body.posttitle }, (err, existingBlog) => {
    if (err) { return next(err); }
    if (existingBlog) {
      req.flash('errors', { msg: 'Blog post with that title already exists.' });
      return res.redirect('/account/createpost');
    }
    blog.save((err) => {
      if (err) { return next(err); }
      req.logIn(res.user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/account/blog');
      });
    });
  });
};



/**
 * POST /account/blog
 * Update blog information.
 */
exports.postUpdateBlog = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/blog');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.blog.name = req.body.name || '';
    user.blog.user = req.body.user || '';
    user.blog.visibility = req.body.visibility || '';
    user.blog.post = req.body.post || '';
    user.blog.postcat = req.body.postcat || '';
    user.blog.postttag = req.body.postttag || '';
    user.blog.postdate = req.body.postdate || '';
    user.blog.iphash = req.body.iphash || '';
    user.blog.transhash = req.body.transhash || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/blog');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Blog has been registered.' });
      res.redirect('/account/blog');
    });
  });
};

