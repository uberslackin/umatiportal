const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const mailChecker = require('mailchecker');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * GET /account/blog
 * Blog manager.
 */



// Display list of Member activity.
exports.getInventory = function (req, res, next) {

    Inventory.find()
        .sort([['postdate', 'ascending']])
        .exec(function (err, inv_data) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/inventory', { title: 'Personal Inventory', data: inv_data });
        })
};


/**
 * POST /inventory
 * Sign in using email and password.
 */
exports.postInventory = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.post)) validationErrors.push({ msg: 'new inventory item cannot be blank.' });
};

/**
 * GET /createinventory
 * new inventory page.
 */
exports.getCreateinventory = (req, res) => {
  res.render('account/createinventory', {
    title: 'Create inventory'
  });
};

/**
 * POST /createpost
 * Create a new local account.
 */
exports.postCreateinventory = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isAscii(req.body.posttitle)) validationErrors.push({ msg: 'Please enter a title for your new inventory.' });
  if (!validator.isAscii(req.body.post)) validationErrors.push({ msg: 'Please add some content to your inventory.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/createinventory');
  }

  const inventory = new Inventory({
    id: req.body.id,
    name: req.body.name,
    user: req.body.user,
    username: req.body.username, 
    posttitle: req.body.posttitle, 
    post: req.body.post,
    location: req.body.location,
    postcat: req.body.postcat,
    posttags: req.body.posttags,
    postdate: req.body.postdate,
    sharedwith: stringify(req.body.sharedwith)
  });

  Inventory.findOne({ posttitle: req.body.posttitle }, (err, existingInventory) => {
    if (err) { return next(err); }
    if (existingInventory) {
      req.flash('errors', { msg: 'Inventory post with that title already exists.' });
      return res.redirect('/account/createinventory');
    }
    inventory.save((err) => {
      if (err) { return next(err); }
      req.logIn(res.user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/account/inventory');
      });
    });
  });
};

/**
 * POST /account/blog
 * Update blog information.
 */
exports.postUpdateInventory = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/inventory');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.inventory.name = req.body.name || '';
    user.inventory.user = req.body.user || '';
    user.inventory.visibility = req.body.visibility || '';
    user.inventory.post = req.body.post || '';
    user.inventory.postcat = req.body.postcat || '';
    user.inventory.postttag = req.body.postttag || '';
    user.inventory.postdate = req.body.postdate || '';
    user.inventory.iphash = req.body.iphash || '';
    user.inventory.transhash = req.body.transhash || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your inventory update.' });
          return res.redirect('/account/inventory');
        }
        return next(err);
      }
      req.flash('success', { msg: 'inventory has been registered.' });
      res.redirect('/account/inventory');
    });
  });
};

