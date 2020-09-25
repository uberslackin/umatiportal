const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Media = require('../models/Media');
const User = require('../models/User');


const randomBytesAsync = promisify(crypto.randomBytes);



/**
 *  mediaController.getUpdateMediaAjax
 * GET /account/mediaajax
 * Update entry based on params in the url string
 */
exports.getUpdateMediaAjax = function (req, res, next) {

    var user = req.params.user;
    var item = req.params.item;
    var val = req.params.val;

    if (item === "imagename") var data = { imagename: val };
    if (item === "imageurl") var data = { imageurl: val };
    console.log("hello there. Item id is: " + item + " val: " + val + "user: " + user );

    User.findByIdAndUpdate(user, data, function(err, result) {
    if (err){
         res.send(err);
    }
    else{
         res.status(200);
    };

  });
};








/**
 * POST /mediaentryupdate
 */

exports.postUpdateMediaEntry = (req, res) => {

  var mediaid = req.body.mediaitemid;
  var data = {
    user : req.body.user,
    username : req.body.username,
    author : req.body.author,
    license : req.body.license,
    licenseurl : req.body.licenseurl,
    imageurl : req.body.imageurl,
    backupurl : req.body.backupurl,
    imagetags : req.body.imagetags,
    imagecat : req.body.imagecat,
    iphash : req.body.iphash,
    iphashtimestamp : req.body.iphashtimestamp,
    group : req.body.group,
    visibility: req.body.visibility
  }
 
  // save the update
  Media.findByIdAndUpdate(mediaid, data, function(err, pos) {
  if (err) throw err;
 
  req.flash('success', { msg: 'Your media entry has been updated.' });
  res.redirect('/account/media');
  });
};
