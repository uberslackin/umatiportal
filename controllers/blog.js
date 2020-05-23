const mongoose = require('mongoose');
const { wrap: async } = require('co');
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



exports.getBlogupdated = function (req, res, user) {
    
            // Successful, so rendecalsr.
            res.render('account/blogupdated', { title: 'Blog updated'});
};


exports.getBlog = function (req, res, user) {
    
    Blog.find()
        .exec(function (err, blog_data) {          
            // Successful, so rendecalsr.
            res.render('account/blog', { title: 'Personal Blog', blogs: blog_data });
        })
};



/** 
exports.getBlog = (req, res) => {

  const blogs = Blog.list;
  res.render('account/blog', {
    title: 'Blog manager'
  });
};

 * POST /blog
 * Sign in using email and password.
 */
exports.postBlog = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.blogpost)) validationErrors.push({ msg: 'Blog post cannot be blank.' });
};


/*
 * POST /account/upload
 * Sign in using email and password.
 */
exports.postUpload = (req, res, next) => {
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
    return res.redirect('/account/blog');
  }

  const blog = new Blog({
    name: req.body.name,
    posttitle: req.body.posttitle,
    post: req.body.post, 
    username: req.body.user, 
    location: req.body.location, 
    postcat: req.body.postcat,
    posttags: req.body.posttags,
    postdate: req.body.postdate,
    template: req.body.template
  });

  Blog.findOne({ posttitle: req.body.posttitle }, (err, existingBlog) => {
    if (err) { return next(err); }
    if (existingBlog) {
      req.flash('errors', { msg: 'Blog post with that title already exists.' });
      return res.redirect('/account/blog');
    }
    blog.save((err) => {
      if (err) { return next(err); }
      res.redirect('/account/blog');
    });
  });
};




// get a blog post
exports.getUpdateBlogpost = (req, res, next) => {
  Blog.findById(req.params.blogpost_id, function(err, blog) {
    if (blog.username != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }

    return res.render('account/blogedit', {
      title: 'Edit point of sale entry',
      blogdata: blog
    });
  });
};
 


exports.postUpdateBlogpost = (req, res, next) => {

// create employee and send back all employees after creation
  // create mongose method to update a existing record into collection
  let id = req.params.blogpost_id;
  var data = {
    name : req.body.name,
    user : req.body.user,
    username : req.body.username,
    postitle : req.body.posttitle,
    post : req.body.post,
    location : req.body.location,
    postcat : req.body.postcat,
    posttags : req.body.posttags,
    postdate : req.body.postdate,
    sharedwith : req.body.sharedwith
  }
 
  // save the user
  Blog.findByIdAndUpdate(id, data, function(err, blogpost) {
  if (err) throw err;
 
  res.send('Successfully! Blog updated - '+blogpost.name);
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

  Blog.findById(req.user.id, (err, blog) => {
    if (err) { return next(err); }
    blog.name = req.body.name || '';
    blog.user = req.body.user || '';
    blog.visibility = req.body.visibility || '';
    blog.post = req.body.post || '';
    blog.postcat = req.body.postcat || '';
    blog.postttag = req.body.postttag || '';
    blog.postdate = req.body.postdate || '';
    blog.iphash = req.body.iphash || '';
    blog.transhash = req.body.transhash || '';
    blog.save((err) => {
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

