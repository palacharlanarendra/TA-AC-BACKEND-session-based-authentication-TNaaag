var express = require('express');
var router = express.Router();
var User = require('../models/User');
/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session);
  res.render('users');
});

router.get('/register', (req, res, next) => {
  var error = req.flash('error');
  res.render('register', { error: error });
});
router.post('/register', (req, res, next) => {
  var { email, password } = req.body;

  User.find({ email: email }).exec((err, elem) => {
    if (elem[0] == undefined) {
      req.flash('error', 'Email already registered!!!');
      return res.redirect('/users/register');
    }
    if (elem[0].email != email) {
      req.flash('error', 'Email already registered!!!');
      return res.redirect('/users/register');
    }
  });
  if (password.length <= 4) {
    req.flash('error', 'Password should be more than 4 characters!!!');
    return res.redirect('/users/register');
  } else if (
    !User.find({ email: email }) ? true : false && password.length >= 4
  ) {
    User.create(req.body, (err, user) => {
      if (err) return next(err);
      return res.redirect('/users/login');
    });
  }
});
router.get('/login', (req, res, next) => {
  var error = req.flash('error');
  res.render('login', { error: error });
});
router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email/Password required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    //no user
    if (!user) {
      req.flash('error', "Email doesn't registered");
      return res.redirect('users/login');
    }
    //compare password
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Wrong password!!!');
        return res.redirect('/users/login');
      }
      //persist logged in user information
      req.session.userId = user.id;
      res.redirect('/users');
    });
  });
});

module.exports = router;
