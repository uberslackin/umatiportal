const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Cal = require('../models/Calendar');
const User = require('../models/User');


const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * GET /account/calendar
 * Calendar manager.
 *
 * Display calendar data.
*/


// Display list of Member activity.
exports.getCal = function (req, res, next) {

    Cal.find()
        .sort([['caldate', 'ascending']])
        .exec(function (err, cal_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/cal', { title: 'Personal Calendar', caldata: cal_data });
        })
};


exports.getUpdateCalEntry = (req, res) => {
    Cal.findOne({ id: req.params.url }, (err, cal_data) => {
        res.render('account/calentryedit', {
        title: 'Edit calendar entry', caldata: cal_data
  });
  });
};



 /*
 * POST /cal
 * Sign in using email and password.
 */
exports.postCal = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.calpost)) validationErrors.push({ msg: 'Cal post cannot be blank.' });
};

/**
 * GET /createpost
 * Signup page.
 */
exports.getCalEntry = (req, res) => {
  res.render('account/calentrycreate', {
    title: 'Create calendar entry'
  });
};


/**
 * POST /necal
 * Create a new local account.
 */
exports.postCreateCalEntry = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isAscii(req.body.calentrytitle)) validationErrors.push({ msg: 'Please enter a title for your new calendar entry.' });
  if (!validator.isAscii(req.body.post)) validationErrors.push({ msg: 'Please add some content to your calendar entry.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/calentryedit');
  }

  const cal = new Cal({
    username: req.body.user,
    calentrytitle: req.body.calentrytitle,
    post: req.body.post, 
    location: req.body.location, 
    calcat: req.body.calcat,
    caltags: req.body.caltags,
    caldate: req.body.caldate,
    time: req.body.caldate
  });

  Cal.findOne({ calentrytitle: req.body.calentrytitle }, (err, existingCal) => {
    if (err) { return next(err); }
    if (existingCal) {
      req.flash('errors', { msg: 'Calendar entry with that title already exists.' });
      return res.redirect('/account/calentryedit');
    }
    cal.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/cal');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Calendar update saved.' });
      res.redirect('/account/cal');
    });
  });
};





/**
 * POST /account/calendar
 * Update cal information.
 */
exports.postUpdateCalEntry = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/calendar');
  }

  Cal.findById(req.user.id, (err, user, next) => {
    if (err) { return next(err); }
    username = req.body.name || '';
    user = req.body.user || '';
    visibility = req.body.visibility || '';
    post = req.body.post || '';
    postcat = req.body.postcat || '';
    postttag = req.body.postttag || '';
    postdate = req.body.posgtdate || '';
    time = req.body.time || '';
    iphash = req.body.iphash || '';
    transhash = req.body.transhash || '';
    Cal.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your calendar update.' });
          return res.redirect('/account/calentrycreate');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Calendar entry has been registered.' });
      res.redirect('/account/cal');
    });
  });
};

