var express = require('express');
var router = express.Router();
var nodeMailer = require('nodemailer');
var config = require("../config.js");
var transporter = nodeMailer.createTransport(config.mailer);
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Editor Share Project Looking For Contributors' });
});


//about Route
router.get('/about', function(req, res, next) {
    res.render('about', {title: 'Editor Share Project'})
});

//contact Route
router.route('/contact').
get(function(req, res, next){
    res.render('contact', {title: 'Editor Share Project'});
}).
post(function(req,res,next){
    req.checkBody('name', 'Empty name').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('message', 'Empty message').notEmpty();
    var errors = req.validationErrors();
    
    if(errors){
        res.render('contact', {
            title: 'Editor Share Project',
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
            errorMessages: errors
        });
    }else{
        let mailOptions = {
            from: 'shareableEditor <no-reply@shareable.com>',
            to: 'zeayycool@gmail.com',
            subject: 'New contact request from website',
            text: req.body.message,
        };
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                res.render('thank', {title: 'Thank You Contacting'});
            }
            
        });
    }
});


//Register Route
router.route('/register').
    get(function(req, res, next){
        res.render('register', {title: 'Register New Account'})
    })
   .post(function(req, res,next){
        req.checkBody('name', 'Empty Name').notEmpty();
        req.checkBody('email', 'Invalid Email').isEmail();
        req.checkBody('password', 'Empty Name').notEmpty();
        req.checkBody('password', 'password didnt match').equals(req.body.confirmPassword).notEmpty();
        var errors = req.validationErrors();
        if(errors) {
            res.render('register', {
               name: req.body.name,
               email: req.body.email,
               errorMessages: errors
            });
        }else {
            var user = new User();
            user.name = req.body.name;
            user.email = req.body.email;
            user.setPassword(req.body.password);
            user.save(function (err) {
               if(err){
                   res.render('register', {errorMessages: err});
               } else {
                   res.redirect('/login');
               }
            });
        }
    });

//login Route
router.route('/login').
get(function(req, res, next){
    res.render('login', {title: 'Login Your Account'})
})
.post(passport.authenticate('local', { 
    failureRedirect: '/login'
}), function(req, res){ 
    res.redirect('/');
});

//logout
router.get('/logout', function(req, res) { 
    req.logout();
    res.redirect('/');
});

//facebook auth
router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
}));


module.exports = router;





























