const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Member = require('../models/Member');
const User = require('../models/User');


const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * GET /account/calendar
 * Calendar manager.
 *
 * Display calendar data.
*/


// Display list of Member activity.
exports.getMember = function (req, res, next) {

    Member.find()
        .sort([['date', 'ascending']])
        .exec(function (err, cal_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/member', { title: 'Member data', memdata: cal_data });
        })
};





 /*
 * POST /cal
 * Sign in using email and password.
 */
exports.postMember = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.name)) validationErrors.push({ msg: 'Item name cannot be blank.' });
};

/**
 * GET /createpost
 * Signup page.
 */
exports.getCreatemember = (req, res) => {
  res.render('account/createmember', {
    title: 'Create entry'
  });
};


/**
 * POST /necal
 * Create a new local account.
 */
exports.postCreateMemberEntry = (req, res) => {
  const validationErrors = [];
  if (!validator.isAscii(req.body.name)) validationErrors.push({ msg: 'Please enter a title for your new entry.' });
  if (!validator.isAscii(req.body.post)) validationErrors.push({ msg: 'Please add some content to your entry.' });

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
exports.postUpdateMemberEntry = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/membercreate');
  }

  Member.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    member.name = req.body.name || '';
    member.user = req.body.user || '';
    member.visibility = req.body.visibility || '';
    member.post = req.body.post || '';
    member.postcat = req.body.postcat || '';
    member.postttag = req.body.postttag || '';
    member.postdate = req.body.posgtdate || '';
    member.time = req.body.time || '';
    member.iphash = req.body.iphash || '';
    member.transhash = req.body.transhash || '';
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

