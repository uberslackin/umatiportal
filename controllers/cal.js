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
 */

exports.getCalendar = async(function*(req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const _id = req.query.item;
  const limit = 15;
  const options = {
    limit: limit,
    page: page
  };

  if (_id) options.criteria = { _id };

  const cals = yield Cal.list;
  const count = yield Cal.countDocuments();

  console.log(cals);

  res.render('account/calendar', {
    title: 'Calendar entries',
    username: req.user,
    cals: cals,
    page: page + 1,
    pages: Math.ceil(count / limit)
  });
});



/**
exports.getCal = (req, res) => {

  const cals = Cal.list;
  res.render('account/calendar', {
    title: 'Calendar manager'
  });
};

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
  res.render('account/newcalentry', {
    title: 'Create calendar entry'
  });
};


/**
 * POST /newcal
 * Create a new local account.
 */
exports.postCreateCalEntry = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isAscii(req.body.calentrytitle)) validationErrors.push({ msg: 'Please enter a title for your new calendar entry.' });
  if (!validator.isAscii(req.body.post)) validationErrors.push({ msg: 'Please add some content to your calendar entry.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/newcalentry');
  }

  const cal = new Cal({
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
      return res.redirect('/account/newcalentry');
    }
    cal.save((err) => {
      if (err) { return next(err); }
      req.logIn(res.user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/account/calendar');
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

