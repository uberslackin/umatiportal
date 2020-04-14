const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Pos = require('../models/Pos');
const User = require('../models/User');


const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * GET /account/calendar
 * Calendar manager.
 *
 * Display calendar data.
*/


// Display list of Member activity.
exports.getPos = function (req, res, next) {

    Pos.find()
        .sort([['createdAt', 'descending']])
        .exec(function (err, pos_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/pos', { title: 'Point of Sale item manager', posdata: pos_data });
        })
};



 /*
 * POST /cal
 * Sign in using email and password.
 */
exports.postPosEntry = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.pospost)) validationErrors.push({ msg: 'Point of Sale post cannot be blank.' });
};

/**
 * GET /createpost
 * Signup page.
 */
exports.getPosEntry = (req, res) => {
  res.render('account/posentrycreate', {
    title: 'Edit point of sale entry'
  });
};


// Load Edit Form
// Display list of Member activity.
exports.getUpdatePosEntry = function (req, res, next) {
  Pos.findById(req.params.posid, function(err, pos){
    if(pos.username != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }
    return res.render('account/posentryedit', {
      title:'Edit Article',
      pos:pos
    });
  });
};

/**
 * app.post('/account/posentryedit', 
 * passportConfig.isAuthenticated, posController.postCreatePosEntry);
 * POST /necal
 * Create a new local account.
 */
exports.postCreatePosEntry = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isAscii(req.body.postitle)) validationErrors.push({ msg: 'Please enter a title for your new POS entry.' });
  if (!validator.isAscii(req.body.post)) validationErrors.push({ msg: 'Please add some content to your POS entry.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/posentrycreate');
  }

  const pos = new Pos({
    username: req.body.user,
    name: req.body.name,
    postitle: req.body.postitle,
    post: req.body.post, 
    location: req.body.location, 
    poscat: req.body.poscat,
    postag: req.body.postag,
    posdate: req.body.posdate,
    time: req.body.posdate,
    visibility: req.body.visibility
  });


  Pos.findOne({ postitle: req.body.postitle }, (err, existingPos) => {
    if (err) { return next(err); }
    if (existingPos) {
      req.flash('errors', { msg: 'Post with that title already exists.' });
      return res.redirect('/account/pos');
    }
    pos.save((err) => {
      if (err) { return next(err); }
      res.redirect('/account/pos');
    });
  });
};



exports.postUpdatePosEntry = (req, res) => {

// create employee and send back all employees after creation
  // create mongose method to update a existing record into collection
  var posid = req.body.positemid;
  var data = {
    user : req.body.user,
    postitle : req.body.postitle,
    post : req.body.post,
    location : req.body.location,
    poscat : req.body.poscat,
    postags : req.body.postags,
    posdate : req.body.posdate,
    visibility: req.body.visibility
  }
 
  // save the user
  Pos.findByIdAndUpdate(posid, data, function(err, pos) {
  if (err) throw err;
 
  req.flash('success', { msg: 'Nice job. Your Point of Sale entry has been updated.' });
  res.redirect('/account/pos');
  });
};