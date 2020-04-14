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
    return res.redirect('/account/inventory');
  }

  const inventory = new Inventory({
    name: req.body.name,
    user: req.body.user,
    username: req.body.username, 
    inventorytitle: req.body.inventorytitle, 
    post: req.body.post,
    location: req.body.location,
    inventorycat: req.body.inventorycat,
    inventorytags: req.body.inventorytags,
    inventorydate: req.body.inventorydate
  });

  Inventory.findOne({ posttitle: req.body.posttitle }, (err, existingInventory) => {
    if (err) { return next(err); }
    if (existingInventory) {
      req.flash('errors', { msg: 'Inventory post with that title already exists.' });
      return res.redirect('/account/inventory');
    }
    inventory.save((err) => {
      if (err) { return next(err); } 
        res.redirect('/account/inventory');
      });
    });
  };




/**
 * POST /account/inventory
 */
exports.postUpdateInventory = (req, res) => {

// create employee and send back all employees after creation
  // create mongose method to update a existing record into collection
  var invid = req.body.inventoryitemid;
  var data = {
    inventorytitle : req.body.inventorytitle,
    post : req.body.post,
    location : req.body.location,
    inventorycat : req.body.inventorycat,
    inventorytags : req.body.inventorytags,
    inventorydate : req.body.inventorydate,
    visibility: req.body.visibility
  }
 
  // save the user
  Inventory.findByIdAndUpdate(invid, data, function(err, pos) {
  if (err) throw err;
 
  req.flash('success', { msg: 'Nice job. Your Inventory entry has been updated.' });
  res.redirect('/account/inventory');
  });
};



exports.getUpdateInventory = function (req, res, next) {
  Inventory.findById(req.params.inventory_id, function(err, inventory){
    if(inventory.user != req.user._id){
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }
    return res.render('account/inventoryedit', {
      title:'Edit Inventory Item',
      inventory:inventory
    });
  });
};