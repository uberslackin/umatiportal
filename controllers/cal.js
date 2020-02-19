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
    return res.redirect('/account/calentrycreate');
  }

  const cal = new Cal({
    username: req.body.user,
    name: req.body.name,
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
      return res.redirect('/account/calentrycreate');
    }
    cal.save((err) => {
      if (err) { return next(err); }
      req.logIn(res.user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/account/cal');
      });
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

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.cal.name = req.body.name || '';
    user.cal.user = req.body.user || '';
    user.cal.visibility = req.body.visibility || '';
    user.cal.post = req.body.post || '';
    user.cal.postcat = req.body.postcat || '';
    user.cal.postttag = req.body.postttag || '';
    user.cal.postdate = req.body.posgtdate || '';
    user.cal.time = req.body.time || '';
    user.cal.iphash = req.body.iphash || '';
    user.cal.transhash = req.body.transhash || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your calendar update.' });
          return res.redirect('/account/calendar');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Calendar entry has been registered.' });
      res.redirect('/account/calendar');
    });
  });
};

