const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Elevator = require('../models/Elevator');
const User = require('../models/User');


const randomBytesAsync = promisify(crypto.randomBytes);

exports.getElevjson = function (req, res, next) {
    Elevator.find()
        .sort([['elevdate', 'ascending']])
        .exec(function (err, elev_data) {
            if (err) { return next(err); }
            // Successful, so rendeelevsr.
            res.json(elev_data);
        })
};

// Display calendar data
exports.getElevator = function (req, res, next) {
    Elevator.find()
        .sort([['elevdate', 'ascending']])
        .exec(function (err, elev_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/elevator', { title: 'Personalized Podcast', elevdata: elev_data });
        })
};

// Display calendar data
exports.getElevator3 = function (req, res, next) {
    Elevator.find()
        .sort([['elevdate', 'ascending']])
        .exec(function (err, elev_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/elevator3', { title: 'Test Podcast Manager', elevdata: elev_data });
        })
};

// css grid calendar - display calendar data
exports.getElevator4 = function (req, res, next) {
    Elevator.find()
        .sort([['elevdate', 'ascending']])
        .exec(function (err, elev_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/elevator4', { title: 'Elevator4', elevdata: elev_data });
        })
};

// css grid podcast display - display tabular as calendar data
exports.getElevator5 = function (req, res, next) {
    Elevator.find()
        .sort([['elevdate', 'ascending']])
        .exec(function (err, elev_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/elevator5', { title: 'Elevator5', elevdata: elev_data });
        })
};



// Load Edit Form
exports.getUpdateElevatorEntry = function (req, res, next) {
  Elevator.findById(req.params.elevitem_id, function(err, elev){
    if(elev.username != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }
    return res.render('account/elevatorentryedit', {
      title:'Edit Elevator Item',
      elevdata:elev
    });
  });
};


 /*
 * POST /cal
 * Sign in using email and password.
 */
exports.postElevator = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.post)) validationErrors.push({ msg: 'Elevator content cannot be blank.' });
};

/**
 * GET account/elevatorentrycreate
 * a
 */
exports.getElevatorEntry = (req, res) => {
  res.render('account/elevatorentrycreate', {
    title: 'Create elevator entry'
  });
};


/**
 * POST /account/elevator
 * Create a new calendar entry.
 */
exports.postCreateElevatorEntry = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isAscii(req.body.eleventrytitle)) validationErrors.push({ msg: 'Please enter a title for your new podast entry.' });
  if (!validator.isAscii(req.body.post)) validationErrors.push({ msg: 'Please add some content to your podcast entry.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/elevatorentryedit');
  }

  const elev = new Elevator({
    username: req.body.user,
    eleventrytitle: req.body.eleventrytitle,
    eleventryurl: req.body.eleventryurl,
    post: req.body.post, 
    location: req.body.location, 
    elevcat: req.body.elevcat,
    elevtags: req.body.elevtags,
    elevdate: req.body.elevdate,
    time: req.body.elevdate
  });

  Elevator.findOne({ eleventrytitle: req.body.eleventrytitle }, (err, existingElev) => {
    if (err) { return next(err); }
    if (existingElev) {
      req.flash('errors', { msg: 'Podcast entry with that title already exists.' });
      return res.redirect('/account/elevatorentryedit');
    }
    elev.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/elevator');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Podast update saved.' });
      res.redirect('/account/elevator');
    });
  });
};


/**
 * POST /elevatorentryupdate
 */

exports.postUpdateElevatorEntry = (req, res) => {

  // update podcast ( Elevator ) and send back all calendar entries after update
  // create mongose method to update a existing record into collection
  var elevid = req.body.elevitemid;
  var data = {
    username : req.body.user,
    eleventrytitle : req.body.eleventrytitle,
    eleventryurl : req.body.eleventryurl,
    post : req.body.post,
    location : req.body.location,
    elevcat : req.body.elevcat,
    elevtags : req.body.elevtags,
    elevdate : req.body.elevdate,
    time : req.body.time,
    group : req.body.group,
    visibility: req.body.visibility
  }
 
  // save the update
  Elevator.findByIdAndUpdate(elevid, data, function(err, pos) {
  if (err) throw err;
 
  req.flash('success', { msg: 'Nice job. Your podcast entry has been updated.' });
  res.redirect('/account/elevator');
  });
};
