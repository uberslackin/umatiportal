const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Donation = require('../models/Inventory');
const User = require('../models/User');
    
const randomBytesAsync = promisify(crypto.randomBytes);


/**
 * GET /account/donation
 * Donation manager.
 */


exports.getSurplusprovider = function (req, res, next) {
    Donation.find()
        .sort([['postdate', 'ascending']])
        .exec(function (err, donation_data) {
            if (err) { return next(err); }
            res.render('account/surplus_provider', { title: 'Donations', data: donation_data });
        })
};



exports.getRequests = function (req, res, next) {
    Donation.find()
        .sort([['postdate', 'ascending']])
        .exec(function (err, donation_data) {
            if (err) { return next(err); }
            res.render('account/requests', { title: 'Donations', data: donation_data });
        })
};


exports.getDriver = function (req, res, next) {
    Donation.find()
        .sort([['postdate', 'ascending']])
        .exec(function (err, donation_data) {
            if (err) { return next(err); }
            res.render('account/driver', { title: 'Donations', data: donation_data });
        })
};


exports.getWarehouse = function (req, res, next) {
    Donation.find()
        .sort([['postdate', 'ascending']])
        .exec(function (err, donation_data) {
            if (err) { return next(err); }
            res.render('account/warehouse', { title: 'Donations', data: donation_data });
        })
};

exports.getOps = function (req, res, next) {
    Donation.find()
        .sort([['postdate', 'ascending']])
        .exec(function (err, donation_data) {
            if (err) { return next(err); }
            res.render('account/ops', { title: 'Donations', data: donation_data });
        })
};




/** 
exports.getDonation = (req, res) => {

  const donations = Donation.list;
  res.render('account/donation', {
    title: 'Donation manager'
  });
};

 * POST /donation
 * Sign in using email and password.
 */
exports.postDonation = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.donationpost)) validationErrors.push({ msg: 'Donation post cannot be blank.' });
};


/*
 * POST /account/upload
 * Sign in using email and password.
 */
exports.postUpload = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.donationpost)) validationErrors.push({ msg: 'Donation post cannot be blank.' });
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
    return res.redirect('/account/donation');
  }

  const donation = new Donation({
    posttitle: req.body.posttitle,
    post: req.body.post, 
    username: req.body.user, 
    location: req.body.location, 
    postcat: req.body.postcat,
    posttags: req.body.posttags,
    postdate: req.body.postdate,
    template: req.body.template
  });

  Donation.findOne({ posttitle: req.body.posttitle }, (err, existingDonation) => {
    if (err) { return next(err); }
    if (existingDonation) {
      req.flash('errors', { msg: 'Donation post with that title already exists.' });
      return res.redirect('/account/donation');
    }
    donation.save((err) => {
      if (err) { return next(err); }
      res.redirect('/account/donation');
    });
  });
};




// get a donation post
exports.getUpdateDonationpost = (req, res, next) => {
  Donation.findById(req.params.donationpost_id, function(err, donation) {
    if (donation.username != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }

    return res.render('account/donationedit', {
      title: 'Edit donation entry',
      donationdata: donation
    });
  });
};
 


exports.postUpdateDonationpost = (req, res, next) => {

// create employee and send back all employees after creation
  // create mongose method to update a existing record into collection
  let id = req.params.donationpost_id;
  var data = {
    user : req.body.user,
    username : req.body.user,
    posttitle : req.body.posttitle,
    authorname : req.body.authorname,
    post : req.body.post,
    location : req.body.location,
    postcat : req.body.postcat,
    posttags : req.body.posttags,
    postdate : req.body.postdate,
    sharedwith : req.body.sharedwith
  }
 
  // save the user
  Donation.findByIdAndUpdate(id, data, function(err, donationpost) {
  if (err) throw err;
 
  res.send('Successfully! Donation updated - '+donationpost.name);
  });
};


exports.postUpdateDonation = (req, res) => {
  // update podcast ( Elevator ) and send back all calendar entries after update
  // create mongoose method to update a existing record into collection


  var donationid = req.body.donationpost_id;
  var data = {
    user : req.body.user,
    username : req.body.username,
    posttitle : req.body.posttitle,
    authorname : req.body.authorname,
    post : req.body.post,
    location : req.body.location,
    postcat : req.body.postcat,
    posttags : req.body.posttags,
    postdate : req.body.postdate,
    iphash : req.body.iphash,
    transhash : req.body.transhash,
    group : req.body.group,
    visibility: req.body.visibility
  }

  // save the update
  Donation.findByIdAndUpdate(donationid, data, function(err, pos) {
  if (err) throw err;

  req.flash('success', { msg: 'Your donation post has been updated.' });
  res.redirect('/account/donation');
  });
};
