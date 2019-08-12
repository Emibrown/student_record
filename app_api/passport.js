var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Admin = require('../models/admin');
var User = require('../models/user');
var Lecturer = require('../models/lecturer');


passport.use('admin-local',new LocalStrategy({
    usernameField: 'email'},
	function(username, password, done) {
		 Admin.findOne({email : username}, function(err, admin){
            if(err){return done(err);}
            if(!admin){
                return done(null, false,
                 {message: "No Admin has that Email Address!"});
            }
            if (admin.password != password) {
				return done(null, false, {
				message: 'Incorrect password.'
				});
            }else{
                return done(null, admin);
            }
        });
	}
));

passport.use('user-local',new LocalStrategy({
    usernameField: 'regNo'},
    function(username, password, done) {
         User.findOne({regNo : username}, function(err, user){
            if(err){return done(err);}
            if(!user){
                return done(null, false,
                 {message: "No Student has that Matric Number!"});
            }
            if (user.password != password) {
                return done(null, false, {
                message: 'Incorrect password.'
                });
            }else{
                return done(null, user);
            }
        });
    }
));

passport.use('lecturer-local',new LocalStrategy({
    usernameField: 'staffID'},
    function(username, password, done) {
         Lecturer.findOne({staffID : username}, function(err, lecturer){
            if(err){return done(err);}
            if(!lecturer){
                return done(null, false,
                 {message: "No Lecturer has that Staff ID!"});
            }
            if (lecturer.password != password) {
                return done(null, false, {
                message: 'Incorrect password.'
                });
            }else{
                return done(null, lecturer);
            }
        });
    }
));
