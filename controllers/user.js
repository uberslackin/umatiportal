const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');
const cloudinary = require('cloudinary');
const mailChecker = require('mailchecker');
const User = require('../models/User');
// const Calendar = require('../models/Calendar');
const Member = require('../models/Member');
const Messages = require('../models/Messages');

const randomBytesAsync = promisify(crypto.randomBytes);

/**
* GET /login
* Login page.
* 
* ref:
* app.get('/account/payment', passportConfig.isAuthenticated, userController.getMember);
* app.post('/account/payment', passportConfig.isAuthenticated, userController.postMember);
* app.get('/account/activity', passportConfig.isAuthenticated, userController.getActivity);
* app.get('/account/activity-print', passportConfig.isAuthenticated, userController.getActivityprint);
* app.post('/account/activity', passportConfig.isAuthenticated, userController.postUpdateActivity);


 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/login');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) console.log('Error : Failed to destroy the session during logout.', err);
    req.user = null;
    res.redirect('/');
  });
};


/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/signup');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
};

/**
 * GET /account/messages
 * Internal Messages
 */
exports.getMessages = function (req, res, next) {
    var mysort = { createdAt: -1,  };
    Messages.find()
        .sort(mysort)
        .exec(function (err, message_list) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('account/messages', { title: 'Messages', message_list: message_list });
        })
};

/**
 * GET /account/messagesbusiness
 * Internal Messages Business Descriptor
 */
exports.getMessagesBusiness = function (req, res, next) {
    var mysort = { createdAt: -1,  };
    Messages.find()
        .sort(mysort)
        .exec(function (err, message_list) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('account/messagesbusiness', { title: 'Messages Business', message_list: message_list });
        })
};

exports.getMessagesGroupBusiness = function (req, res, next) {
    var mysort = { createdAt: -1,  };
    Messages.find()
        .sort(mysort)
        .exec(function (err, message_list) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('account/messagesgroupbusiness', { title: 'Messages Business', message_list: message_list });
        })
};

/**
 * GET /account/messagessent
 * Internal Messages
 */
exports.getMessagesSent = function (req, res, next) {
    var mysort = { createdAt: -1,  };
    Messages.find()
        .sort(mysort)
        .exec(function (err, message_list) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('account/messagessent', { title: 'Messages Sent', message_list: message_list });
        })
};


/**
 * GET /account/messagesdrafts
 * Internal Messages
 */
exports.getMessagesDrafts = function (req, res, next) {
    var mysort = { createdAt: -1,  };
    Messages.find()
        .sort(mysort)
        .exec(function (err, message_list) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('account/messagesdrafts', { title: 'Messages Drafts', message_list: message_list });
        })
};


/**
 * GET /account/messagesdrafts
 * Internal Messages
 */
exports.getMessagesInspiration = function (req, res, next) {
    var mysort = { createdAt: -1,  };
    Messages.find()
        .sort(mysort)
        .exec(function (err, message_list) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('account/messagesinspiration', { title: 'Messages of Inspiration', message_list: message_list });
        })
};

exports.getMessagesGroupInspiration = function (req, res, next) {
    var mysort = { createdAt: -1,  };
    Messages.find()
        .sort(mysort)
        .exec(function (err, message_list) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('account/messagesgroupinspiration', { title: 'Messages shared for group Inspiration', message_list: message_list });
        })
};


/**
 * GET /account/messagestags
 * Internal Messages
 */
exports.getMessagesTags = function (req, res, next) {
    var mysort = { createdAt: -1,  };
Messages.find()
        .sort(mysort)
        .exec(function (err, message_list) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('account/messagestags', { title: 'Messages Tags', message_list: message_list });
        })
};


/**
 * GET /account/messagestrashlist
 * Internal Messages Trash
 */
exports.getMessagesTrashlist = function (req, res, next) {
/**    var mysort = { createdAt: -1,  };
  *      .sort(mysort)
 */
    Messages.find()
        .exec(function (err, message_list) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('account/messagestrash', { title: 'Messages Trash List', message_list: message_list });
        })
};


/**
 * GET /account/messagestrash
 * Internal Messages Trash
 */

function getTrashlist(req, res) {
  var query =  Messages.where({ _id: req.params.messageid });

  query.findOne(function (err, messages) {
      if (err)
          return res.send(err)
      res.render('account/messagestrash', { title: 'Messages Trash', message_list: messages });
  });
};

exports.getMessagesTrash = function (req, res) {
      getTrashlist(req,res);
};

/**
 * GET /account/door1
 * Update DOM based ininvite code
 */
exports.getDoor1 = function (req, res) {
    var itemid = req.params.itemid;
    var status = req.params.status;

    var data = {
      status: status
    };
 /*  console.log("Itemid: " + itemid + " status: " + status );*/
    Messages.findByIdAndUpdate(itemid, data, function(err, result) {
    if (err){
         res.send(err);
    }
    else{
         res.status(200);
 /*        console.log("RESULT: " + result);*/
    };

  });
};




/**
 * GET /account/messagestrashmoveajax
 * Update status of entry to 'trash' or whatever needed
 */
exports.getMessagesTrashMoveAjax = function (req, res) {

    var itemid = req.params.itemid;
    var status = req.params.status;

    var data = {
      status: status
    };
 /*  console.log("Itemid: " + itemid + " status: " + status );*/
    Messages.findByIdAndUpdate(itemid, data, function(err, result) {
    if (err){
         res.send(err);
    }
    else{
         res.status(200);
 /*        console.log("RESULT: " + result);*/
    };

  });
};


exports.getLink = function (req, res, next) {
  usernameparam = req.params.username;
  res.render('link')

  };


/**
 * GET /account/messagesimportant
 * Internal Messages Important
 */
exports.getMessagesImportant = function (req, res, next) {
    var mysort = { createdAt: -1,  };
    Messages.find()
        .sort(mysort)
        .exec(function (err, message_list) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('account/messagesimportant', { title: 'Messages Important', message_list: message_list });
        })
};

exports.getMessagesGroupImportant = function (req, res, next) {
    var mysort = { createdAt: -1,  };
    Messages.find()
        .sort(mysort)
        .exec(function (err, message_list) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('account/messagesgroupimportant', { title: 'Messages Important', message_list: message_list });
        })
};



/**
 * GET /account/messagesTrashRemove
 * Internal Messages Trash Remove
 */
exports.getMessagesTrashRemove = function (req, res, next) {
    Messages.findByIdAndRemove(req.params.itemid, function(err, result) {
    if (err){
         res.send(err);
     }
     else {
         res.status(200);
     };
     })
};

/**
 * GET /account/messagecompose
 * Internal Messages
 */
exports.getMessageCompose = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/');
  }




  var mysort = { createdAt: -1,  };
  User.find()
      .sort(mysort)
      .exec(function (err, user_list) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('account/messagecompose', { title: 'Compose Message', user_list: user_list });
      });
};


exports.postMessageCreate = (req, res, next) => {
  const validationErrors = [];

        var db = new Messages();
        var response = {};
        db.username = req.body.user;
        db.user = req.body.user;
        db.name = req.body.name;
        db.subject = req.body.subject;
        db.sentfrom = req.body.sentfrom;
        db.sentto = req.body.sentto;
        db.group = req.body.group;
        db.message = req.body.message;
        db.date = req.body.date;
        db.status = req.body.status;
        db.tag = req.body.tag;

        db.save((err) => {
          if (err) {
            if (err.code === 11000) {
              req.flash('errors', { msg: 'There was an error in your update.' });
              return res.redirect('/account/messagecompose');
          }
          return next(err);
          }
          req.flash('success', { msg: 'Your message has been sent.' });
          res.redirect('/account/messages');
          });

};


/**
 * GET /wardsignup
 * Food Group Signup page.
 */
exports.getWardsignup = (req, res) => {
  if (req.user) {
    return res.redirect('/account/elevatormanage?status=signedin');
  } 
  res.render('account/wardsignup', {
    title: 'Create Food Logistics Account'
  });
};

/**
 * GET /wardsignup
 * Food Group Signup page.
 */
exports.getWardsignup2 = (req, res) => {
  if (req.user) {
    return res.redirect('/account/elevatormanage?status=signup2');
  } 
  res.render('account/wardsignup2', {
    title: 'forWard'
  });
};

/**
 * POST /wardwelcome
 * Create a new resource logistics account.
 */
exports.getWardwelcome = (req, res) => {
  if (req.user) {
    return res.redirect('/account/messages');
  } 
  res.render('account/wardwelcome', {
    title: 'Create Food Logistics Account'
  });
};

/**
 * GET /avatared
 * Food Group Signup page.
 */
exports.getAvatared = (req, res) => {
  let options = {};
  let avatars = new Avatars(sprites, options);
  let svg = avatars.create('custom-seed');
    res.render('account/avatared', {
    title: 'Create Avatars'
  });
};


/**
 * POST /wardwelcome
 * Create a new local account.
 */
exports.postWardwelcome = (req, res, next) => {
  const validationErrors = [];
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
  }
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/wardsignup');
  }
  if (req.body.invite === "art") var thisgroup = "for Ward";
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    group: thisgroup,
    paneldriver: req.body.paneldriver,
    panelsurplus: req.body.panelsurplus,
    panelrequests: req.body.panelrequests,
    panelwarehouse: req.body.panelwarehouse,
    panelresearch: req.body.panelresearch,
    nicname: req.body.nicname,
    invitecode: req.body.invite,
    invited: req.body.invited,
    inviter: req.body.inviter
  });
  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that nicname or email address already exists.' });
      return res.redirect('/wardsignup');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/account/messages/');
      });
    });
  });
};



/**
 * POST /wardsignup
 * Create a new local account.
 */
exports.postWardsignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/wardsignup');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/wardsignup');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/account/elevatormanage/');
      });
    });
  });
};



/**
 * GET /account/setup
 * member payment account settings page.
 */

exports.getSetup = (req, res) => {
  res.render('account/setup', {
    title: 'Account settings'
  });
};


// Display list of Member activity.
exports.getActivity = function (req, res, next) {

    var mysort = { createdAt: -1,  };
    Member.find()
        .sort(mysort)
        .exec(function (err, list_activity) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/activity', { title: 'Account Ledger', activity_list: list_activity });
        })
};


// Display list of Member activity.
exports.getActivityprint = function (req, res, next) {

    Member.find()
        .sort([['date', 'ascending']])
        .exec(function (err, list_activity) {
            if (err) { return next(err); }
            // Successful, so rendecalsr.
            res.render('account/activity-print', { title: 'Account Ledger', activity_list: list_activity });
        })
};


exports.getMember = (req, res) => {
  res.render('account/membercreate', {
    title: 'Business transaction'
  });
};

exports.getRequestMember = (req, res) => {
  res.render('account/memberrequest', {
    title: 'Member Request'
  });
};

exports.getJexcel = (req, res) => {
  res.render('account/jexcel', {
    title: 'Jexcel'
  });
};



exports.postMember = (req, res, next) => {
  const validationErrors = [];

        var db = new Member();
        var response = {};
        db.username = req.body.username;
        db.name = req.body.name;
        db.source = req.body.source;
        db.amount = req.body.amount;
        db.date = req.body.date;
        db.group = req.body.group;
        db.witness = req.body.witness;
        db.comment = req.body.comment;

        db.save((err) => {
          if (err) {
            if (err.code === 11000) {
              req.flash('errors', { msg: 'There was an error in your update.' });
              return res.redirect('/account/activity');
          }
          return next(err);
          }
          req.flash('success', { msg: 'Account transaction has been registered.' });
          res.redirect('/account/activity');
          });

};


exports.getPrivacy = (req, res) => {
  res.render('privacy', {
    title: 'Privacy'
  });
};

exports.getProjects = (req, res) => {
  res.render('projects', {
    title: 'Projects'
  });
};


exports.getPong = (req, res) => {
  res.render('games/pong', {
    title: 'Pong'
  });
};

exports.getSi = (req, res) => {
  res.render('games/si', {
    title: 'Space Invaders old skool therapeutic game fun'
  });
};

/**
 * POST /account/setup
 * Update setup info.
 */
exports.postUpdateSetup = (req, res, next) => {
  const validationErrors = [];
/**  if (!validator.isEmail(req.body.amount)) validationErrors.push({ msg: 'Please enter a valid payment amount.' });
 */

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/setup');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.setup.name = req.body.name || '';
    user.setup.amount = req.body.amount || '';
    user.setup.sourcetype = req.body.sourcetype || '';
    user.setup.sourcenum = req.body.sourcenum || '';
    user.setup.postdate = req.body.postdate || '';

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/setup');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Settings have been updated.' });
      res.redirect('/account/setup');
    });
  });
};

/**
 * GET /account/business
 * Profile page.
 */
exports.getBusiness = (req, res) => {
  res.render('account/business', {
    title: 'Business description'
  });
};

/**
 * POST /account/business
 * Update blog information.
 */
exports.postUpdateBusiness = (req, res, next) => {
  const validationErrors = [];
/**  if (!validator.isEmail(req.body.amount)) validationErrors.push({ msg: 'Please enter a valid payment amount.' });
 */

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/business');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.business.name = req.body.name || '';
    user.business.description = req.body.description || '';
    user.business.contactemail = req.body.contactemail || '';
    user.business.contactphone = req.body.contactphone || '';
    user.business.social1 = req.body.social1 || '';
    user.business.social2 = req.body.social2 || '';
    user.business.social3 = req.body.social3 || '';
    user.business.businesstags = req.body.businesstags || '';
    user.business.postdate = req.body.postdate || '';
    user.business.members = req.body.members || '';
    user.business.weburl = req.body.weburl || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/business');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Business description has been registered.' });
      res.redirect('/account/business');
    });
  });
};

/**
 * POST /account/activity
 * Update activity information.
 */
exports.postUpdateActivity = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/activity');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.activity.name = req.body.name || '';
    user.activity.amount = req.body.amount || '';
    user.activity.source = req.body.source || '';
    user.activity.postdate = req.body.postdate || '';
    user.activity.iphash = req.body.iphash || '';
    user.activity.transhash = req.body.transhash || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your update.' });
          return res.redirect('/account/activity');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Account transaction has been registered.' });
      res.redirect('/account/activity');
    });
  });
};

/**
 * GET /account/calsettings
 * Profile page.
 */
exports.getCalsettings = (req, res) => {
  res.render('account/calsettings', {
    title: 'Calendar Settings'
  });
};

/**
 * GET /account/elevsettings
 * Profile page.
 */
exports.getElevsettings = (req, res) => {
  res.render('account/elevsettings', {
    title: 'Elevator Settings'
  });
};


/**
 * POST /account/calsettings
 * Update blog settings.
 */
exports.postUpdateCalsettings = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/calsettings');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.calsettings.user = req.body.user || '';
    user.calsettings.caltitle = req.body.caltitle || '';
    user.calsettings.caldesc = req.body.caldesc || '';
    user.calsettings.shortdesc = req.body.shortdesc || '';
    user.calsettings.caltags = req.body.caltags || '';
    user.calsettings.visibility = req.body.visibility || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your calendar settings update.' });
          return res.redirect('/account/calsettings');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Calendar setings has been updated.' });
      res.redirect('/account/calsettings');
    });
  });
};



exports.postUpdateElevsettings = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/elevsettings');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.elevsettings.user = req.body.user || '';
    user.elevsettings.elevtitle = req.body.elevtitle || '';
    user.elevsettings.elevdesc = req.body.elevdesc || '';
    user.elevsettings.shortdesc = req.body.shortdesc || '';
    user.elevsettings.elevtags = req.body.elevtags || '';
    user.elevsettings.visibility = req.body.visibility || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your elevator settings update.' });
          return res.redirect('/account/elevsettings');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Elevator setings has been updated.' });
      res.redirect('/account/elevsettings');
    });
  });
};


/**
 * GET /account/calsettings
 * Profile page.
 */
exports.getPossettings = (req, res) => {
  res.render('account/possettings', {
    title: 'POS Settings'
  });
};


/**
 * POST /account/blogsettings
 * Update blog settings.
 */
exports.postUpdatePossettings = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/possettings');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.possettings.user = req.body.user || '';
    user.possettings.postitle = req.body.postitle || '';
    user.possettings.posdesc = req.body.posdesc || '';
    user.possettings.shortdesc = req.body.shortdesc || '';
    user.possettings.postags = req.body.postags || '';
    user.possettings.visibility = req.body.visibility || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your point of sale settings update.' });
          return res.redirect('/account/possettings');
        }
        return next(err);
      }
      req.flash('success', { msg: 'POS setings has been updated.' });
      res.redirect('/account/possettings');
    });
  });
};



/**
 * GET /account/blogsettings
 * Profile page.
 */
exports.getBizsettings = (req, res) => {
  res.render('account/bizsettings', {
    title: 'Business configuration'
  });
};

/**
 * POST /account/blogsettings
 * Update blog settings.
 */
exports.postUpdateBizsettings = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/bizsettings');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.bizsettings.user = req.body.user || '';
    user.bizsettings.biztitle = req.body.biztitle || '';
    user.bizsettings.bizdesc = req.body.bizdesc || '';
    user.bizsettings.shortdesc = req.body.shortdesc || '';
    user.bizsettings.biztags = req.body.biztags || '';
    user.bizsettings.template = req.body.template || '';
    user.bizsettings.visibility = req.body.visibility || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your business configuration update.' });
          return res.redirect('/account/bizsettings');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Business configuration has been updated.' });
      res.redirect('/account/bizsettings');
    });
  });
};



/**
 * GET /account/blogsettings
 * Profile page.
 */
exports.getBlogsettings = (req, res) => {
  res.render('account/blogsettings', {
    title: 'Blog Settings'
  });
};

/**
 * POST /account/blogsettings
 * Update blog settings.
 */
exports.postUpdateBlogsettings = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/blogsettings');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.blogsettings.user = req.body.user || '';
    user.blogsettings.blogtitle = req.body.blogtitle || '';
    user.blogsettings.blogdesc = req.body.blogdesc || '';
    user.blogsettings.shortdesc = req.body.shortdesc || '';
    user.blogsettings.blogtags = req.body.blogtags || '';
    user.blogsettings.template = req.body.template || '';
    user.blogsettings.visibility = req.body.visibility || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your blog settings update.' });
          return res.redirect('/account/blogsettings');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Blog setings has been updated.' });
      res.redirect('/account/blogsettings');
    });
  });
};

/**
*
* Inventory Settings
*
* GET /account/blogsettings
* Profile page.
*/

exports.getInventorysettings = (req, res) => {
  res.render('account/inventorysettings', {
    title: 'Inventory Settings'
  });
};

/**
 * POST /account/blogsettings
 * Update blog settings.
 */
exports.postUpdateInventorysettings = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/inventorysettings');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.inventorysettings.user = req.body.user || '';
    user.inventorysettings.invtitle = req.body.invtitle || '';
    user.inventorysettings.shortdesc = req.body.shortdesc || '';
    user.inventorysettings.invdesc = req.body.invdesc || '';
    user.inventorysettings.invtags = req.body.invtags || '';
    user.inventorysettings.visibility = req.body.visibility || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your Inventory settings update.' });
          return res.redirect('/account/inventorysettings');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Inventory setings has been updated.' });
      res.redirect('/account/inventorysettings');
    });
  });
};


/**
 * GET /account/group getGroupsettings
 * Group page.
 */
exports.getGroup = (req, res) => {
  res.render('account/group', {
    title: 'Group Details'
  });
};

/**
 * getGroupsettings form
 *
*/

exports.getGroupsettings = (req, res) => {
  res.render('account/groupsettings', {
    title: 'Group Settings'
  });
};


/**
 * POST /account/group 
 * Update blog settings.
 */
exports.postUpdateGroupsettings = (req, res, next) => {
  const validationErrors = [];

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account/groupsettings');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.groupsettings.groupname = req.body.groupname || '';
    user.groupsettings.adminperson = req.body.adminperson || '';
    user.groupsettings.location = req.body.location || '';
    user.groupsettings.description = req.body.description || '';
    user.groupsettings.shortdesc = req.body.shortdesc || '';
    user.groupsettings.memberlist = req.body.memberlist || '';
    user.groupsettings.visibility = req.body.visibility || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'There was an error in your group details update.' });
          return res.redirect('/account/groupsettings');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Group details have been updated.' });
      res.redirect('/account/groupsettings');
    });
  });
};


/**
 * GET /account
 * savings page.
 */
exports.getAccount = (req, res) => {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    if (user.email !== req.body.email) user.emailVerified = false;
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.story = req.body.story || '';
    user.profile.location = req.body.location || '';
    user.group = req.body.group || '';
    user.profile.business = req.body.business || '';
    user.profile.vocation = req.body.vocation || '';
    user.profile.role = req.body.role || '';
    user.profile.website = req.body.website || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/account');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Profile information has been updated.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  User.deleteOne({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const { provider } = req.params;
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user[provider.toLowerCase()] = undefined;
    const tokensWithoutProviderToUnlink = user.tokens.filter((token) =>
      token.kind !== provider.toLowerCase());
    // Some auth providers do not provide an email address in the user profile.
    // As a result, we need to verify that unlinking the provider is safe by ensuring
    // that another login method exists.
    if (
      !(user.email && user.password)
      && tokensWithoutProviderToUnlink.length === 0
    ) {
      req.flash('errors', {
        msg: `The ${_.startCase(_.toLower(provider))} account cannot be unlinked without another form of login enabled.`
          + ' Please link another account or add an email address and password.'
      });
      return res.redirect('/account');
    }
    user.tokens = tokensWithoutProviderToUnlink;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('info', { msg: `${_.startCase(_.toLower(provider))} account has been unlinked.` });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  const validationErrors = [];
  if (!validator.isHexadecimal(req.params.token)) validationErrors.push({ msg: 'Invalid Token.  Please retry.' });
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/forgot');
  }

  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * GET /account/verify/:token
 * Verify email address
 */
exports.getVerifyEmailToken = (req, res, next) => {
  if (req.user.emailVerified) {
    req.flash('info', { msg: 'The email address has been verified.' });
    return res.redirect('/account');
  }

  const validationErrors = [];
  if (req.params.token && (!validator.isHexadecimal(req.params.token))) validationErrors.push({ msg: 'Invalid Token.  Please retry.' });
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/account');
  }

  if (req.params.token === req.user.emailVerificationToken) {
    User
      .findOne({ email: req.user.email })
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'There was an error in loading your profile.' });
          return res.redirect('back');
        }
        user.emailVerificationToken = '';
        user.emailVerified = true;
        user = user.save();
        req.flash('info', { msg: 'Thank you for verifying your email address.' });
        return res.redirect('/account');
      })
      .catch((error) => {
        console.log('Error saving the user profile to the database after email verification', error);
        req.flash('error', { msg: 'There was an error when updating your profile.  Please try again later.' });
        return res.redirect('/account');
      });
  }
};

/**
 * GET /account/verify
 * Verify email address
 */
exports.getVerifyEmail = (req, res, next) => {
  if (req.user.emailVerified) {
    req.flash('info', { msg: 'The email address has been verified.' });
    return res.redirect('/account');
  }

  if (!mailChecker.isValid(req.user.email)) {
    req.flash('errors', { msg: 'The email address is invalid or disposable and can not be verified.  Please update your email address and try again.' });
    return res.redirect('/account');
  }

  const createRandomToken = randomBytesAsync(16)
    .then((buf) => buf.toString('hex'));

  const setRandomToken = (token) => {
    User
      .findOne({ email: req.user.email })
      .then((user) => {
        user.emailVerificationToken = token;
        user = user.save();
      });
    return token;
  };

  const sendVerifyEmail = (token) => {
    let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: req.user.email,
      from: 'hackathon@starter.com',
      subject: 'Please verify your email address on Umati Bank self help group netork',
      text: `Thank you for registering with umati bank website.\n\n
        This verify your email address please click on the following link, or paste this into your browser:\n\n
        http://${req.headers.host}/account/verify/${token}\n\n
        \n\n
        Thank you!`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('info', { msg: `An e-mail has been sent to ${req.user.email} with further instructions.` });
      })
      .catch((err) => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
          transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions)
            .then(() => {
              req.flash('info', { msg: `An e-mail has been sent to ${req.user.email} with further instructions.` });
            });
        }
        console.log('ERROR: Could not send verifyEmail email after security downgrade.\n', err);
        req.flash('errors', { msg: 'Error sending the email verification message. Please try again shortly.' });
        return err;
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendVerifyEmail)
    .then(() => res.redirect('/account'))
    .catch(next);
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (req.body.password !== req.body.confirm) validationErrors.push({ msg: 'Passwords do not match' });
  if (!validator.isHexadecimal(req.params.token)) validationErrors.push({ msg: 'Invalid Token.  Please retry.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('back');
  }

  const resetPassword = () =>
    User
      .findOne({ passwordResetToken: req.params.token })
      .where('passwordResetExpires').gt(Date.now())
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
          return res.redirect('back');
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return user.save().then(() => new Promise((resolve, reject) => {
          req.logIn(user, (err) => {
            if (err) { return reject(err); }
            resolve(user);
          });
        }));
      });

  const sendResetPasswordEmail = (user) => {
    if (!user) { return; }
    let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Your Umati Bank password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
      })
      .catch((err) => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
          transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions)
            .then(() => {
              req.flash('success', { msg: 'Success! Your password has been changed.' });
            });
        }
        console.log('ERROR: Could not send password reset confirmation email after security downgrade.\n', err);
        req.flash('warning', { msg: 'Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly.' });
        return err;
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => { if (!res.finished) res.redirect('/'); })
    .catch((err) => next(err));
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/forgot');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  const createRandomToken = randomBytesAsync(16)
    .then((buf) => buf.toString('hex'));

  const setRandomToken = (token) =>
    User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Account with that email address does not exist.' });
        } else {
          user.passwordResetToken = token;
          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
          user = user.save();
        }
        return user;
      });

  const sendForgotPasswordEmail = (user) => {
    if (!user) { return; }
    const token = user.passwordResetToken;
    let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Reset your password on Umati Bank',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
      })
      .catch((err) => {
        if (err.message === 'self signed certificate in certificate chain') {
          console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
          transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions)
            .then(() => {
              req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
            });
        }
        console.log('ERROR: Could not send forgot password email after security downgrade.\n', err);
        req.flash('errors', { msg: 'Error sending the password reset message. Please try again shortly.' });
        return err;
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect('/forgot'))
    .catch(next);
};
