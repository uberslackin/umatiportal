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

/* [{"title":"Budding Leaf",
     "start":"2018-11-11",
     "end":"2018-11-11",
     "backgroundColor":"#f76973",
     "borderColor":"#f56954"}

existing output

 {"sharedwith":[],
 "_id":"5e598531ccf07b52195179a7",
 "username":"5e4869a6dc11621cba9be1af",
 "calentrytitle":"as",
 "post":"kkl",
 "location":"jkj",
 "calcat":"kj",
 "caltags":"kj",
 "caldate":"2018-01-26T00:00:00.000Z",
 "time":"2018-01-26",
 "createdAt":"2020-02-28T21:25:05.755Z",
 "updatedAt":"2020-02-28T21:25:05.755Z",
 "__v":0},


* Display list of Member activity.


db.books.aggregate( [
                      { $group : { _id : "$author", books: { $push: "$title" } } },
                      { $out : "authors" }
                  ] )
*/
exports.getCaljson = function (req, res, next) {
    Cal.find()
        .sort([['caldate', 'ascending']])
        .exec(function (err, cal_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.json(cal_data);
        })
};

// Display calendar data
exports.getCal = function (req, res, next) {
    Cal.find()
        .sort([['caldate', 'ascending']])
        .exec(function (err, cal_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/cal', { title: 'Personal Calendar', caldata: cal_data });
        })
};

// Display calendar data
exports.getCal3 = function (req, res, next) {
    Cal.find()
        .sort([['caldate', 'ascending']])
        .exec(function (err, cal_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/cal3', { title: 'Test Calendar', caldata: cal_data });
        })
};

// css grid calendar - display calendar data
exports.getCal4 = function (req, res, next) {
    Cal.find()
        .sort([['caldate', 'ascending']])
        .exec(function (err, cal_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/cal4', { title: 'Cal4', caldata: cal_data });
        })
};



// Load Edit Form
// Display list of Member activity.
exports.getUpdateCalEntry = function (req, res, next) {
  Cal.findById(req.params.calitem_id, function(err, cal){
    if(cal.username != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }
    return res.render('account/calentryedit', {
      title:'Edit Calendar Item',
      caldata:cal
    });
  });
};


 /*
 * POST /cal
 * Sign in using email and password.
 */
exports.postCal = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.post)) validationErrors.push({ msg: 'Calendar content cannot be blank.' });
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
 * POST /cal
 * Create a new calendar entry.
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
 * POST /calentryupdate
 */

exports.postUpdateCalEntry = (req, res) => {

  // update calendar and send back all calendar entries after update
  // create mongose method to update a existing record into collection
  var calid = req.body.calitemid;
  var data = {
    username : req.body.user,
    calentrytitle : req.body.calentrytitle,
    post : req.body.post,
    location : req.body.location,
    calcat : req.body.calcat,
    caltags : req.body.caltags,
    caldate : req.body.caldate,
    time : req.body.time,
    group : req.body.group,
    visibility: req.body.visibility
  }
 
  // save the update
  Cal.findByIdAndUpdate(calid, data, function(err, pos) {
  if (err) throw err;
 
  req.flash('success', { msg: 'Nice job. Your calendar entry has been updated.' });
  res.redirect('/account/cal');
  });
};
