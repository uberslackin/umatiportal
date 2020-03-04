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

/**
 * GET /createpost
 * Signup page.
 */
exports.getUpdatePosEntry = (req, res, next) => {
    Pos.findOne({ _id: req.params.url }, (err, existingPos) => {

  res.render('account/posentryedit', {
    title: 'Edit point of sale entry',
    pos: existingPos
  });
});
}


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
    postags: req.body.postags,
    posdate: req.body.posdate,
    time: req.body.posdate
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







/**
 * POST /pos/createpost  
 * Update cal information.
 */
exports.postUpdatePosEntry = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/pos');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.pos.name = req.body.name || '';
    user.pos.user = req.body.user || '';
    user.pos.visibility = req.body.visibility || '';
    user.pos.post = req.body.post || '';
    user.pos.postcat = req.body.postcat || '';
    user.pos.postttag = req.body.postttag || '';
    user.pos.postdate = req.body.posgtdate || '';
    user.pos.time = req.body.time || '';
    user.pos.iphash = req.body.iphash || '';
    user.pos.transhash = req.body.transhash || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your POS update.' });
          return res.redirect('/account/pos');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Point of Sale entry has been registered.' });
      res.redirect('/account/pos');
    });
  });
};