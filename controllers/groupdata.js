const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Groupdata = require('../models/Groupdata');
const User = require('../models/User');


const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * GET /account/calendar
 * Calendar manager.
 *
 * Display calendar data.
*/


// Display list of Member activity.
exports.getGroupdata = function (req, res, next) {

    Groupdata.find()
        .sort([['name', 'ascending']])
        .exec(function (err, group_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/group', { title: 'Group members', groupdata: group_data });
        })
};



 /*
 * POST /cal
 * Sign in using email and password.
 */
exports.postGroupdata = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.name)) validationErrors.push({ msg: 'Group name cannot be blank.' });
};

/**
 * GET /createpost
 * Signup page.
 */
exports.getPosEntry = (req, res) => {
  res.render('account/posentryedit', {
    title: 'Edit point of sale entry'
  });
};

/**
 * GET /createpost
 * Signup page.
 */
exports.getCreategroupdata = (req, res) => {
  res.render('account/creategroup', {
    title: 'Create new group entry'
  });
};


/**
 * POST /necal  postCreategroupdata
 * Create a new local account.
 */
exports.postCreategroupdata = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isAscii(req.body.name)) validationErrors.push({ msg: 'Please enter a title for your new POS entry.' });
  if (!validator.isAscii(req.body.group)) validationErrors.push({ msg: 'Please add some content to your POS entry.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/creategroup');
  }

  const groupdata = new Groupdata({
    name: req.body.name,
    admin: req.body.admin,
    group: req.body.group,
    secret: req.body.secret,
    post: req.body.post, 
    location: req.body.location, 
    sourcenum: req.body.sourcenum,
    sourcename: req.body.sourcename,
    sourcetype: req.body.sourcetype,
    date: req.body.posdate,
    witness: req.body.witness,
    comment: req.body.comment
  });

  Groupdata.findOne({ name: req.body.name }, (err, existingPos) => {
    if (err) { return next(err); }
    if (existingPos) {
      req.flash('errors', { msg: 'Group entry with that title already exists.' });
      return res.redirect('/account/creategroup');
    }
    groupdata.save((err) => {
      if (err) { return next(err); }
      req.logIn(res.user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/account/creategroup');
      });
    });
  });
};



/**
 * POST /account/  
 * Update cal information.
 */
exports.postUpdateGroupdata = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/group');
  }

  Groupdata.findById(req.groupdata.id, (err, user) => {
    if (err) { return next(err); }
    groupdata.name = req.body.name || '';
    groupdata.admin = req.body.admin || '';
    groupdata.secret = req.body.secret || '';
    groupdata.amount = req.body.amount || '';
    groupdata.sourcename = req.body.sourcename || '';
    groupdata.sourcenum = req.body.sourcenum || '';
    groupdata.sourcetype = req.body.sourcetype || '';
    groupdata.transhash = req.body.transhash || '';
    groupdata.date = req.body.date || '';
    groupdata.group = req.body.group || '';
    groupdata.witness = req.body.witness || '';
    groupdata.comment = req.body.comment || '';
    groupdata.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your group update.' });
          return res.redirect('/account/group');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Group entry has been registered.' });
      res.redirect('/account/group');
    });
  });
};

