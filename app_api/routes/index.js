var passport = require('passport');
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var mime = require('mime-types');
var Admin = require('../../models/admin');
var Faculty = require('../../models/faculty');
var Department = require('../../models/department');
var Student = require('../../models/user');
var Course = require('../../models/course');
var Lecturer = require('../../models/lecturer');
var Session = require('../../models/session');
var Setting = require('../../models/setting');
var Regcourse = require('../../models/regcourse');
var shortid = require('shortid');
var Multer = require('multer');
var fs = require('fs');

var auth = jwt({
	secret: 'thisIsSecret',
	userProperty: 'payload'
});

Admin.find({}, function(err, admin){
  if(err){ return;}
  if(admin.length == 0){
      var newAdmin = new Admin({
      		firstName: "Admin",
    		lastName: "Admin",
    		otherName: "Admin",
            username: "Admin",
            phoneNumber: "008069685773",
            fullname: "Admin Admin Admin",
            email: "admin@gmail.com",
            password: "11223344E"
          });
       newAdmin.save(function(err, admin){
            if (err) { 
              console.log(err);
              return; 
            }else{
               console.log(admin);
          }
      });
  }
})

Faculty.find({name: 'General Studies'}, function(err, faculties){
	if(err){ return;}
	if(faculties.length == 0){
		var newFaculty = new Faculty({
			name: "General Studies",
			});
		newFaculty.save(function(err, faculty){
			  if (err) { 
				console.log(err);
				return; 
			  }else{
				console.log(faculty);
				var newDepartment = new Department({
					name: "General Studies",
					duration: 4,
					faculty: faculty._id
				});
				newDepartment.save(function(err, department){
					if (err) { 
						console.log(err);
						return; 
					  }else{
						 console.log(department);
					}
				})
			}
		});
	}
  })

var uniqueArray = function(arrArg) {
  return arrArg.filter(function(elem, pos,arr) {
    return arr.indexOf(elem) == pos;
  });
};

var alreadyRegistered = function(arrArg, courseID) {
  var found = false;
	for(var i = 0; i < arrArg.length; i++) {
			if (arrArg[i].courseID == courseID) {
					found = true;
					break;
			}
	}
	return found;
};





var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var studentStorage = Multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/upload/student')
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() +"." + mime.extension(file.mimetype))
    }
});


var studentUpload = Multer({ //multer settings
    storage: studentStorage,
    fileFilter: function(req, file, cb){
     if(file.mimetype !== mime.lookup('jpg') && file.mimetype !== mime.lookup('png')){
        req.fileValidationError = "Only jpg and png files are allowed";
        return cb(new Error('Only jpg and png files are allowed'))
      }
      cb(null, true)
    }
}).single('file');

var lecturerStorage = Multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/upload/lecturer')
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() +"." + mime.extension(file.mimetype))
    }
});

var lecturerUpload = Multer({ //multer settings
    storage: lecturerStorage,
    fileFilter: function(req, file, cb){
     if(file.mimetype !== mime.lookup('jpg') && file.mimetype !== mime.lookup('png')){
        req.fileValidationError = "Only jpg and png files are allowed";
        return cb(new Error('Only jpg and png files are allowed'))
      }
      cb(null, true)
    }
}).single('file');



// Admin API

router.post('/register', function(req, res, next) {
  if(!req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "All fields required"
		});
		return;
	}
	Admin.findOne({email : req.body.email}, function(err, email){
            if(err){return done(err);}
            if(email){
               sendJSONresponse(res, 400, {
					"message": "Email already in use"
				});
               return;
            }else{
            	var newAdmin = new Admin();
				newAdmin.email = req.body.email;
				newAdmin.password = req.body.password;
				newAdmin.save(function(err, admin) {
					if (err) {
						sendJSONresponse(res, 404, err);
					} else {
						token = admin.generateJwt();
						sendJSONresponse(res, 200, {
							"token" : token
						});
					}
				});
            }
        });
});

router.post('/login', function(req, res, next) {
  if(!req.body.email || !req.body.password){
  		sendJSONresponse(res, 400, {"message": "All fields required"});
		return;
	}
	passport.authenticate('admin-local', function(err, admin, info){
	if (err) {
		sendJSONresponse(res, 404, err);
		return;
	}
	if(admin){
		token = admin.generateJwt();
		sendJSONresponse(res, 200, {
			"token" : token
		});
	} else {
		sendJSONresponse(res, 401, info);
	}
	})(req, res);
});

router.post('/student-login', function(req, res, next) {
	Setting.findOne({type:"session"},{ 
		currentSession: 1,
		currentSemister:1
	})
	.exec(function(err, settings) {
	if (err) { return next(err); }
	if(!settings){
		sendJSONresponse(res, 400, {"message": "Sorry you can't login at this time, contact Admin."});
		return;
	}
	if(!settings.currentSession || !settings.currentSemister){
		sendJSONresponse(res, 400, {"message": "Sorry you can't login at this time, contact Admin."});
		return;
	}
	if(!req.body.regNo || !req.body.password){
				sendJSONresponse(res, 400, {"message": "All fields required"});
			return;
		}
		passport.authenticate('user-local', function(err, student, info){
		if (err) {
			sendJSONresponse(res, 404, err);
			return;
		}
		if(student){
			token = student.generateJwt();
			sendJSONresponse(res, 200, {
				"token" : token
			});
		} else {
			sendJSONresponse(res, 401, info);
		}
		})(req, res);
	});
});

router.post('/lecturer-login', function(req, res, next) {
	Setting.findOne({type:"session"},{ 
		currentSession: 1,
		currentSemister:1
	})
	.exec(function(err, settings) {
	if (err) { return next(err); }
	if(!settings){
		sendJSONresponse(res, 400, {"message": "Sorry you can't login at this time, contact Admin."});
		return;
	}
	if(!settings.currentSession || !settings.currentSemister){
		sendJSONresponse(res, 400, {"message": "Sorry you can't login at this time, contact Admin."});
		return;
	}
  if(!req.body.staffID || !req.body.password){
  		sendJSONresponse(res, 400, {"message": "All fields required"});
		return;
	}
	passport.authenticate('lecturer-local', function(err, lecturer, info){
	if (err) {
		sendJSONresponse(res, 404, err);
		return;
	}
	if(lecturer){
		token = lecturer.generateJwt();
		sendJSONresponse(res, 200, {
			"token" : token
		});
	} else {
		sendJSONresponse(res, 401, info);
	}
	})(req, res);
});
});


router.get('/profile',  auth, function(req, res, next) {
  Admin.findOne({ _id: req.payload._id }, function(err, admin) {
    if (err) { return next(err); }
    if (!admin) { return next(404); }
    sendJSONresponse(res, 200, admin);
  });
});

router.post('/profile',  auth, function(req, res, next) {
   console.log(req.body);
    var updateAdmin  = {
        firstName: req.body.firstName,
        lastName : req.body.lastName,
        otherName : req.body.otherName,
        fullname: req.body.firstName+" "+req.body.otherName+" "+req.body.lastName,
        phoneNumber : req.body.phoneNumber,
        email: req.body.email
    }
    Admin.update({_id: req.payload._id }, updateAdmin, function(err) {
      if (err) {  console.log("jffjj");  return next(err); }
         sendJSONresponse(res, 200, {"message": "Profile updated sucessfully"});
         return;
    });
});

router.post('/changePassword', auth,  function(req, res, next) {
   if(!req.body.old || !req.body.new || !req.body.repeat){
          sendJSONresponse(res, 400, {"message": "All the fields are required"});
          return;
        }
     Admin.findOne({ _id: req.payload._id }, function(err, admin) {
        if (err) { return next(err); }
        if (!admin) { return next(404); }
        if(admin.password != req.body.old){
           sendJSONresponse(res, 400, {"message": "Invalied current password"});
          return;
        }
         Admin.update({_id: req.payload._id}, { password: req.body.new }, function(err) {
            if (err) {   return next(err); }
               sendJSONresponse(res, 200, {"message": "Password changed successfully."});
                return;
          });
      });
});

router.post('/create_admin', auth, function(req, res, next) {
  	 if(!req.body.firstName || !req.body.lastName || !req.body.otherName
  	  || !req.body.email || !req.body.phoneNumber  || !req.body.new || !req.body.repeat
  	 	){
          sendJSONresponse(res, 400, {"message": "All the fields are required"});
          return;
        }
      Admin.findOne({ email: req.body.email }, function(err, email) {
        if (err) { return next(err); }
        if(email){
           sendJSONresponse(res, 400, {"message": "Email address already in use"});
          return;
        }
      });
  	 var newAdmin = new Admin({
	     firstName: req.body.firstName,
         lastName : req.body.lastName,
         otherName : req.body.otherName,
         phoneNumber : req.body.phoneNumber,
         fullname: req.body.firstName+" "+req.body.otherName+" "+req.body.lastName,
         email: req.body.email,
         password: req.body.new
	  });
	  newAdmin.save(function(err, admin){
	    if (err) { 
	        return next(err); 
	    }else{
	        sendJSONresponse(res, 200, {
	        	 firstName: admin.firstName,
		         lastName : admin.lastName,
		         otherName : admin.otherName,
		         email: admin.email,
		         phoneNumber : admin.phoneNumber,
		         createdAt: admin.createdAt
	        });
	    }
	  });
});

router.get('/admin', auth, function(req, res, next) {
  Admin.find({},{ 
	    firstName: 1,
	    lastName: 1,
	    otherName: 1,
	    fullname: 1,
	    email: 1,
	    phoneNumber: 1,
	    createdAt: 1
	  }).
	    exec(function(err, admins) {
	    if (err) { return next(err); }
	    if (!admins) { return next(404); }
	    sendJSONresponse(res, 200, admins);
	  });
});

router.get('/faculties', auth, function(req, res, next) {
  Faculty.find({},{ 
	    name: 1,
	    createdOn: 1
	  }).
	    exec(function(err, faculties) {
	    if (err) { return next(err); }
	    if (!faculties) { return next(404); }
	    sendJSONresponse(res, 200, faculties);
	  });
});

router.get('/students', auth, function(req, res, next) {
  Student.find({},{ 
	    fullname:1,
		gender:1,
		regNo:1,
		department:1,
		faculty:1,
		yearOfAdmission:1,
		level:1
	  })
  		.populate('faculty', 'name')
  		.populate('department', 'name')
	    .exec(function(err, students) {
	    if (err) { return next(err); }
	    if (!students) { return next(404); }
	    sendJSONresponse(res, 200, students);
	  });
});

router.get('/courses', auth, function(req, res, next) {
  Course.find({},{ 
	  title:1,
		code:1,
		semister:1,
		department:1,
		creditLoad:1,
		level:1
	  })
  		.populate('department', 'name')
	    .exec(function(err, courses) {
	    if (err) { return next(err); }
	    if (!courses) { return next(404); }
	    sendJSONresponse(res, 200, courses);
	  });
});



router.get('/sessions', auth, function(req, res, next) {
	Session.find({},{ 
		  title:1,
		  startDate:1,
		  endDate:1
		})
		  .exec(function(err, sessions) {
		  if (err) { return next(err); }
		  if (!sessions) { sendJSONresponse(res, 200, {}); }
		  sendJSONresponse(res, 200, sessions);
		});
  });

router.get('/lecturers', auth, function(req, res, next) {
  Lecturer.find({},{ 
	  fullname:1,
		staffID:1,
		phoneNumber:1,
		department:1,
		faculty:1,
	  })
  		.populate('faculty', 'name')
  		.populate('department', 'name')
	    .exec(function(err, lecturers) {
	    if (err) { return next(err); }
	    if (!lecturers) { return next(404); }
	    sendJSONresponse(res, 200, lecturers);
	  });
});

router.get('/department', auth, function(req, res, next) {
  Department.find({},{ 
	    name: 1,
	    duration: 1,
	    faculty:1,
	    createdOn: 1
	  })
  		.populate('faculty', 'name')
	    .exec(function(err, departments) {
	    if (err) { return next(err); }
	    if (!departments) { return next(404); }
	    sendJSONresponse(res, 200, departments);
	  });
});

router.get('/departments/:id', auth, function(req, res, next) {
  Department.find({faculty:req.params.id},{ 
	    name: 1
	  })
	    .exec(function(err, departments) {
	    if (err) { return next(err); }
	    if (!departments) { return next(404); }
	    sendJSONresponse(res, 200, departments);
	  });
});

router.get('/department_lec/:id', auth, function(req, res, next) {
	Lecturer.find({},{ 
		  fullname: 1,
		  staffID:1
		})
		  .exec(function(err, lecturers) {
		  if (err) { return next(err); }
		  if (!lecturers) { return next(404); }
		  sendJSONresponse(res, 200, lecturers);
		});
	});
	
	router.get('/session_settings', auth, function(req, res, next) {
		Setting.findOne({type:"session"},{ 
				currentSession: 1,
				currentSemister:1
			})
				.populate('currentSession')
				.exec(function(err, settings) {
				if (err) { return next(err); }
				if (!settings) { return sendJSONresponse(res, 200, {}); }
				sendJSONresponse(res, 200, {
					currentSession: settings.currentSession._id,
					currentSemister: settings.currentSemister,
					sessionTitle: settings.currentSession.title
				});
			});
		});

  router.post('/course/:id/assign-lec', auth, function(req, res, next) {
	Course.findOne({_id: req.params.id})
	  .exec(function(err, course) {
	  if (err) { return next(err); }
	  if (!course) { 
		  sendJSONresponse(res, 400, {"message": "Invalid Course ID"});
		  return; 
	  }
			 var courselecturers = {
				lecturers: req.body
			};
		Course.findOneAndUpdate({_id: req.params.id}, courselecturers, { new: true }, function(err){
		  if (err) { 
			  return next(err); 
		  }else{
			  Course.findOne({_id: req.params.id})
				 .populate('lecturers')
				 .exec(function(err, courseLec) {
				 if (err) { return next(err); }
				 sendJSONresponse(res, 200, {
					lecturers: courseLec.lecturers
				  }); 
			  });
		  }
		});
  });
});

router.get('/students/:id', auth, function(req, res, next) {
   Student.findOne({_id: req.params.id})
   .populate('faculty', 'name')
   .populate('department')
   .exec(function(err, student) {
    if (err) { 
     	sendJSONresponse(res, 400, {
			"message": "Your request can not be process"
		});
    	return; 
 	}
    sendJSONresponse(res, 200, {
        firstname: student.firstname,
        surname: student.surname,
        othername: student.othername,
        address: student.address,
        phoneNumber: student.phoneNumber,
        email: student.email,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        regNo: student.regNo,
        photourl: student.Photourl,
        stateOfOrigin: student.stateOfOrigin,
	    yearOfAdmission: student.yearOfAdmission,
	    level: student.level,
	    department: student.department.name,
	    duration: student.department.duration,
	    faculty: student.faculty.name,
	    lga: student.lga	  
    });
  });
});

router.get('/courses/:id', auth, function(req, res, next) {
	Course.findOne({_id: req.params.id})
	.populate('department')
	.populate('lecturers')
	.exec(function(err, course) {
	 if (err) { 
		  sendJSONresponse(res, 400, {
			 "message": "Your request can not be process"
		 });
		 return; 
	  }
	 sendJSONresponse(res, 200, {
		 _id: course._id,
		 title: course.title,
		 code: course.code,
		 creditLoad: course.creditLoad,
		 semister: course.semister,
		 level: course.level,
		 department: course.department.name,
		 departmentID: course.department._id,
		 lecturers: course.lecturers,
		 createdOn: course.createdOn
	 });
   });
 });

router.get('/lecturers/:id', auth, function(req, res, next) {
	Lecturer.findOne({_id: req.params.id})
	.populate('faculty', 'name')
	.populate('department')
	.exec(function(err, lecturer) {
	 if (err) { 
		  sendJSONresponse(res, 400, {
			 "message": "Your request can not be process"
		 });
		 return; 
	  }
	  Course.find({lecturers: req.params.id},{
		  title:1,
		  code:1
	  })
		.exec(function(err, courses) {
		if (err) { return next(err); }
		sendJSONresponse(res, 200, {
			firstname: lecturer.firstname,
			lastname: lecturer.lastname,
			othername: lecturer.othername,
			address: lecturer.address,
			phoneNumber: lecturer.phoneNumber,
			email: lecturer.email,
			gender: lecturer.gender,
			title: lecturer.title,
			staffID: lecturer.staffID,
			Photourl: lecturer.Photourl,
			stateOfOrigin: lecturer.stateOfOrigin,
			department: lecturer.department.name,
			duration: lecturer.department.duration,
			faculty: lecturer.faculty.name,
			courses: courses
		});
	  });
   });
 });

router.post('/add_faculty', auth, function(req, res, next) {
  	 if(!req.body.name){
          sendJSONresponse(res, 400, {"message": "All the fields are required"});
          return;
        }
  	 var newFaculty = new Faculty({
	     name: req.body.name,
	  });
	  newFaculty.save(function(err, faculty){
	    if (err) { 
	        return next(err); 
	    }else{
	        sendJSONresponse(res, 200, {
	        	 name: faculty.name,
		         createdOn: faculty.createdOn
	        });
	    }
	  });
});

router.post('/add_department', auth, function(req, res, next) {
  	 if(!req.body.name || !req.body.duration || !req.body.faculty ){
          sendJSONresponse(res, 400, {"message": "All the fields are required"});
          return;
        }
    Faculty.findOne({_id: req.body.faculty})
	    .exec(function(err, faculty) {
	    if (err) { return next(err); }
	    if (!faculty) { 
	    	sendJSONresponse(res, 400, {"message": "Invalid Faculty ID"});
	    	return; 
	    }
	    var newDepartment = new Department({
		     name: req.body.name,
		     duration: req.body.duration,
		     faculty: req.body.faculty
		  });
		  newDepartment.save(function(err, department){
		    if (err) { 
		        return next(err); 
		    }else{
		        sendJSONresponse(res, 200, {
		        	 name: department.name,
		        	 duration: department.duration,
		        	 faculty: {
		        	 	name: faculty.name
		        	 },
			         createdOn: department.createdOn
		        });
		    }
		  });
	 });
});

router.post('/add_session', auth, function(req, res, next) {
	if(!req.body.startDate || !req.body.endDate ){
	   sendJSONresponse(res, 400, {"message": "All the fields are required"});
	   return;
	 }
	 Session.find({})
	    .exec(function(err, sessions) {
		if (err) { return next(err); }
	    if (sessions == "") { 
				var currentYear = new Date().getFullYear()
				var newSession = new Session({
					year: currentYear,
					title: currentYear-1+"/"+currentYear,
					startDate: req.body.startDate,
					endDate: req.body.endDate
				});
				newSession.save(function(err, value){
					if (err) { 
						return next(err); 
					}else{
					   var newSettings = {
						   currentSession: value._id,
						   currentSemister: "First"
					   }
					   Setting.update({type: "session"},newSettings,{ upsert : true }, function(err){
					   if (err) { return next(err); }
					   else{
						   sendJSONresponse(res, 200, {
							   session:{
								   	_id: value._id,
									title: value.title,
									startDate: value.startDate,
									endDate: value.endDate
								},
								settings:{
									currentSession: newSettings.currentSession,
									currentSemister: newSettings.currentSemister,
									sessionTitle: value.title
								}
						  });
					   }
					  });
					}
				  });
	    }else{
			Setting.findOne({type: 'session'})
			.populate('currentSession')
			.exec(function(err,settings){
				if (err) { return next(err); }
					var currentYear = settings.currentSession.year+1
					var newSession = new Session({
						year: currentYear,
						title: currentYear-1+"/"+currentYear,
						startDate: req.body.startDate,
						endDate: req.body.endDate
					});
					newSession.save(function(err, value){
						if (err) { 
							return next(err); 
						}else{
						   var newSettings = {
							   currentSession: value._id,
							   currentSemister: "First"
						   }
						   Setting.update({type: "session"},newSettings,{ upsert : true }, function(err){
						   if (err) { return next(err); }
						   else{
							   Student.update({},{ $inc: { level: 100 } },{ multi: true },function(err){
									if (err) { return next(err); }
									Student.find({})
									.populate('department')
									.exec(function(err,students){
											if (err) { return next(err); }
											students.forEach(function(student) {
												if(student.level > student.department.duration*100){
													Student.update({_id: student._id},{ level: student.department.duration*100  },function(err){
														if (err) { return next(err); }
												})
												}
											});
									})
							   })
							   Regcourse.update({
									'courses.status': 'Not approved'
								},{
									$set: {
											'courses.$.status': 'Approved'
									}
								},function(err) {
									if (err) {  return next(err); }
								});
							   sendJSONresponse(res, 200, {
								session:{
									_id: value._id,
									title: value.title,
									startDate: value.startDate,
									endDate: value.endDate
								},
								settings:{
									currentSession: newSettings.currentSession,
									currentSemister: newSettings.currentSemister,
									sessionTitle: value.title
								}
							  });
						   }
						  });
						}
					  });
			})
		}
	})
  });

router.post("/session_settings", auth, function(req, res, next) {
	console.log(req.body);
	if(!req.body.currentSession || !req.body.currentSemister ){
		sendJSONresponse(res, 400, {"message": "Please select an option"});
		return;
	  }
	  var newSettings = {
		  currentSession: req.body.currentSession,
		  currentSemister: req.body.currentSemister
	  }
	Setting.update({type: "session"},newSettings,{ upsert : true }, function(err){
	 if (err) { return next(err); }
	 else{
	   sendJSONresponse(res, 200, {"message": "Successfull"});
	   return;
	 }
	 });
});


router.post('/add-course', auth, function(req, res, next) {
  	 if(!req.body.title || !req.body.code || !req.body.semister
  	 || !req.body.level || !req.body.creditLoad || !req.body.department ){
          sendJSONresponse(res, 400, {"message": "All the fields are required"});
          return;
        }
    Department.findOne({_id: req.body.department})
	    .exec(function(err, department) {
	    if (err) { return next(err); }
	    if (!department) { 
	    	sendJSONresponse(res, 400, {"message": "Invalid Department ID"});
	    	return; 
	    }
	    var newCourse = new Course({
		     title: req.body.title,
		     code: req.body.code,
		     level: req.body.level,
		     semister: req.body.semister,
		     creditLoad: req.body.creditLoad,
		     department: req.body.department
		  });
		  newCourse.save(function(err, course){
		    if (err) { 
		        return next(err); 
		    }else{
		        sendJSONresponse(res, 200, {
					_id: course._id,
		        	 title: course.title,
		        	 code: course.code,
		        	 department: {
		        	 	name: department.name
		        	 },
			         creditLoad: course.creditLoad,
			         level: course.level,
			         semister: course.semister
		        });
		    }
		  });
	 });
});

router.post('/admin/approve_result/:regcourseID', auth, function(req, res, next) {
	Regcourse.update({
		_id: req.params.regcourseID,
		'courses.courseID': req.body.courseID
	},{
		$set: {
				'courses.$.status': 'Approved'
		}
	},function(err) {
		if (err) { console.log(err);  return next(err); }

		Regcourse.findOne({
			_id: req.params.regcourseID,
			'courses.courseID': req.body.courseID
		},{
			student: 1,
			'courses.$' : 1
		})
			.populate('student','fullname regNo')
			.exec(function(err, student) {
			if (err) {  return next(err); }
			console.log(student)
			sendJSONresponse(res, 200, student);
		});
	});
});


router.post('/add-student', auth, function(req, res, next) {
  	studentUpload(req,res,function(err){
  	  if(!req.body.surname  || 
  	  	!req.body.firstname || 
  	  	!req.body.othername || 
  	  	!req.body.address || 
  	  	!req.body.phoneNumber || 
  	  	!req.body.gender || 
    	!req.body.dateOfBirth ||
    	 !req.body.stateOfOrigin || 
    	 !req.body.yearOfAdmission || 
    	 !req.body.level ||
    	  !req.body.department||
    	   !req.body.faculty || 
    	!req.body.lga || 
    	 !req.body.email || 
    	 !req.body.regNo){
        sendJSONresponse(res, 400, {"message": "All fields required"});
	    return;
	  }
	  if(req.fileValidationError){
	    sendJSONresponse(res, 400, {"message": req.fileValidationError});
	    return;
	  }
	  Student.findOne({regNo: req.body.regNo})
	    .exec(function(err, student) {
	    if (err) { console.log('1'); return next(err); }
	    if (student) { 
	    	sendJSONresponse(res, 400, {"message": "Student with Matric Number"+req.body.regNo+"already added"});
	    	return; 
	    }
	   Department.findOne({_id: req.body.department})
	  	.populate('faculty', 'name')
	    .exec(function(err, department) {
	    if (err) { console.log('2'); return next(err); }
	    if (!department) { 
	    	sendJSONresponse(res, 400, {"message": "Invalied ID"});
	    	return; 
	    }
	    
	   	if(req.file){
		  	 var newStudent = new Student({
			    firstname : req.body.firstname,
			    surname : req.body.surname,
			    othername: req.body.othername,
			    fullname: req.body.firstname+" "+req.body.othername+" "+req.body.surname,
			    address: req.body.address,
			    phoneNumber: req.body.phoneNumber,
			    email: req.body.email,
			    regNo: req.body.regNo,
			    gender: req.body.gender,
			    dateOfBirth: req.body.dateOfBirth,
			    stateOfOrigin: req.body.stateOfOrigin,
			    yearOfAdmission: req.body.yearOfAdmission,
			    level: req.body.level,
			    department: req.body.department,
			    faculty: req.body.faculty,
			    lga: req.body.lga,
			    Photourl: "http://"+req.headers.host+"/upload/student/"+req.file.filename,
			  });
		  }else{
		  	 sendJSONresponse(res, 400, {"message": "Upload student Photo"});
	    	 return; 
		  }
		  newStudent.save(function(err, student){
		    if (err) { 
		      console.log(err); return next(err); 
		    }else{
		        sendJSONresponse(res, 200, {
		        	_id: student._id,
				    fullname: student.fullname,
				    regNo: student.regNo,
				    department: {
				    	name: department.name
				    },
				    faculty:{
				    	name: department.faculty.name
				    },
				    level: student.level,
				    yearOfAdmission: student.yearOfAdmission,
				    gender: student.gender
		        });
		    }	 
		});
	  });
	 });
  });
});


router.post('/add-lecturer', auth, function(req, res, next) {
  	lecturerUpload(req,res,function(err){
  	  if(!req.body.title  || 
  	  	!req.body.firstname  || 
  	  	!req.body.lastname || 
  	  	!req.body.othername || 
  	  	!req.body.address || 
  	  	!req.body.phoneNumber || 
  	  	!req.body.gender || 
		 !req.body.stateOfOrigin || 
		 !req.body.lga || 
    	  !req.body.department||
    	   !req.body.faculty || 
    	 !req.body.email || 
    	 !req.body.staffID){
        sendJSONresponse(res, 400, {"message": "All fields required"});
	    return;
	  }
	  if(req.fileValidationError){
	    sendJSONresponse(res, 400, {"message": req.fileValidationError});
	    return;
	  }
	  Lecturer.findOne({staffID: req.body.staffID})
	    .exec(function(err, lecturer) {
	    if (err) {  return next(err); }
	    if (lecturer) { 
	    	sendJSONresponse(res, 400, {"message": "Lecturer with staffID "+req.body.staffID+" already added"});
	    	return; 
	    }
	   Department.findOne({_id: req.body.department})
	  	.populate('faculty', 'name')
	    .exec(function(err, department) {
	    if (err) {  return next(err); }
	    if (!department) { 
	    	sendJSONresponse(res, 400, {"message": "Invalied ID"});
	    	return; 
	    }
	    
	   	if(req.file){
		  	 var newlecturer = new Lecturer({
		  	 	title:req.body.title,
			    firstname : req.body.firstname,
			    lastname : req.body.lastname,
			    othername: req.body.othername,
			    fullname: req.body.title+". "+req.body.firstname+" "+req.body.othername+" "+req.body.lastname,
			    address: req.body.address,
			    phoneNumber: req.body.phoneNumber,
			    email: req.body.email,
			    staffID: req.body.staffID,
			    gender: req.body.gender,
				stateOfOrigin: req.body.stateOfOrigin,
				lga: req.body.lga,
			    department: req.body.department,
			    faculty: req.body.faculty,
			    Photourl: "http://"+req.headers.host+"/upload/lecturer/"+req.file.filename,
			  });
		  }else{
		  	 sendJSONresponse(res, 400, {"message": "Upload lecturer's Photo"});
	    	 return; 
		  }
		  newlecturer.save(function(err, lecturer){
		    if (err) { 
		       return next(err); 
		    }else{
		        sendJSONresponse(res, 200, {
		        	_id: lecturer._id,
				    fullname: lecturer.fullname,
				    staffID: lecturer.staffID,
				    phoneNumber: lecturer.phoneNumber,
				    department: {
				    	name: department.name
				    },
				    faculty:{
				    	name: department.faculty.name
				    }
		        });
		    }	 
		});
	  });
	 });
  });
});


router.post('/user/login', function(req, res, next) {
  if(!req.body.username || !req.body.password){
  		sendJSONresponse(res, 400, {"message": "All fields required"});
		return;
	}
	passport.authenticate('user-local', function(err, user, info){
	if (err) {
		sendJSONresponse(res, 404, err);
		return;
	}
	if(user){
		token = user.generateJwt();
		sendJSONresponse(res, 200, {
			"token" : token
		});
	} else {
		sendJSONresponse(res, 401, info);
	}
	})(req, res);
});



// Student Sections

router.get('/student/register_course/:id', auth, function(req, res, next) {
	Student.findOne({_id: req.params.id})
		.exec(function(err, student) {
		if (err) {  return next(err); }
		if (!student) { return next(404); }
		Setting.findOne({type:"session"},{ 
			currentSession: 1,
			currentSemister:1
		})
		.exec(function(err, settings) {
		if (err) { return next(err); }
		Department.findOne({name: 'General Studies'}, function(err, department){
			if(err){ return next(err);}
			if (!student) { return next(404); }
		Course.find({
			 department: { $in: [ student.department, department._id ] }, 
			 level: { $lte: student.level },
			 semister: settings.currentSemister
			},{ 
			title:1,
			code:1,
			creditLoad:1,
			level:1
			})
				.exec(function(err, courses) {
				if (err) {  return next(err); }
				if (!courses) { return next(404); }
				console.log(courses);
				var allcourses = courses;
				courses.forEach(function(course) {
					Regcourse.findOne({
						'courses.courseID': course._id
					},{
						'courses.$' : 1
					})
						.exec(function(err, regcourse) {
						if (err) {  return next(err); }
						
						if(regcourse){
							
							 
						}
					});
				});
				sendJSONresponse(res, 200, allcourses);
		});
	});
	});
});
});

router.get('/student/registered_courses/:id', auth, function(req, res, next) {
	Student.findOne({_id: req.params.id})
		.exec(function(err, student) {
		if (err) {  return next(err); }
		if (!student) { return next(404); }
		Setting.findOne({type:"session"},{ 
			currentSession: 1,
			currentSemister:1
		})
		.exec(function(err, settings) {
		if (err) { return next(err); }
		Regcourse.findOne({
				session: settings.currentSession,
				semister: settings.currentSemister,
				student: req.params.id
			})
				.exec(function(err, regcourses) {
				if (err) {  return next(err); }
				if (!regcourses) { return sendJSONresponse(res, 200, [] ); }
				sendJSONresponse(res, 200, regcourses.courses);
		});
	});
	});
});

router.get('/student/allregistered_courses/:id', auth, function(req, res, next) {
	Student.findOne({_id: req.params.id})
		.exec(function(err, student) {
		if (err) {  return next(err); }
		if (!student) { return next(404); }
		Setting.findOne({type:"session"},{ 
			currentSession: 1,
			currentSemister:1
		})
		.exec(function(err, settings) {
		if (err) { return next(err); }
		Regcourse.find({
				semister: settings.currentSemister,
				student: req.params.id
			})
				.exec(function(err, regcourses) {
				if (err) {  return next(err); }
				if (!regcourses) { return sendJSONresponse(res, 200, [] ); }
				console.log(regcourses);
				sendJSONresponse(res, 200, regcourses);
		});
	});
	});
});

router.post('/student/register_course/:id',  auth, function(req, res, next) {
	Student.findOne({_id: req.params.id})
		.exec(function(err, student) {
		if (err) {  return next(err); }
		if (!student) { return next(404); }
		Setting.findOne({type:"session"},{ 
			currentSession: 1,
			currentSemister:1
		})
		.exec(function(err, settings) {
		if (err) { return next(err); }
			Course.findOne({_id: req.body.courseID})
				.exec(function(err, course){
				if (err) {  return next(err); }
				if (!course) { 
					sendJSONresponse(res, 400, {"message": "Invalied Course ID"});
					return; 
				}
					Regcourse.findOne({
						session: settings.currentSession,
						semister: settings.currentSemister,
						student: req.params.id,
						level: student.level
					})
					.exec(function(err, regcourse){
					if (err) {  return next(err); }
					if (!regcourse) { 
						// do some thing
						Regcourse.update({
							session: settings.currentSession,
							semister: settings.currentSemister,
							student: req.params.id,
							level: student.level
						},{ $push:{ courses:{courseID: req.body.courseID }}},{ upsert : true },function(err) {
								if (err) { return next(err); }
								sendJSONresponse(res, 200, {"message": "You have successfully registered this course"});
						});
						return; 
					}
					
					if(alreadyRegistered(regcourse.courses,req.body.courseID)){
						sendJSONresponse(res, 400, {"message": "You have Already registered this course for the current session"});
						return; 
					}else{
						Regcourse.update({
							session: settings.currentSession,
							semister: settings.currentSemister,
							student: req.params.id,
							level: student.level
						},{ $push:{ courses:{courseID: req.body.courseID }}},function(err) {
								if (err) { return next(err); }
								sendJSONresponse(res, 200, {"message": "You have successfully registered this course"});
						});
					}
				});
			});
		});
	});
});

router.get('/student/result/:id',  auth, function(req, res, next) {
	Student.findOne({_id: req.params.id})
		.exec(function(err, student) {
		if (err) {  return next(err); }
		if (!student) { return next(404); }
		Regcourse.find({
			student: req.params.id
		})
			.sort( { level: 1, semister: 1 } )
			.populate('courses.courseID')
			.exec(function(err, results){
			if (err) {  return next(err); }
			sendJSONresponse(res, 200, results);
		});
	});
});

router.post('/student/unregister_course/:id',  auth, function(req, res, next) {
	Student.findOne({_id: req.params.id})
		.exec(function(err, student) {
		if (err) {  return next(err); }
		if (!student) { return next(404); }
		Setting.findOne({type:"session"},{ 
			currentSession: 1,
			currentSemister:1
		})
		.exec(function(err, settings) {
		if (err) { return next(err); }
			Course.findOne({_id: req.body.courseID})
				.exec(function(err, course){
				if (err) {  return next(err); }
				if (!course) { 
					sendJSONresponse(res, 400, {"message": "Invalied Course ID"});
					return; 
				}
					Regcourse.findOne({
						session: settings.currentSession,
						semister: settings.currentSemister,
						student: req.params.id,
						level: student.level
					})
					.exec(function(err, regcourse){
					if (err) {  return next(err); }
					if (!regcourse) { 
						// do some thing
						sendJSONresponse(res, 400, {"message": "Bad request refrash for browser"});
						return;
					}
					if(!alreadyRegistered(regcourse.courses,req.body.courseID)){
						sendJSONresponse(res, 400, {"message": "Bad request refrash for browser"});
						return; 
					}else{
						Regcourse.update({
							session: settings.currentSession,
							semister: settings.currentSemister,
							student: req.params.id,
							level: student.level
						},{ $pull:{ courses:{courseID: req.body.courseID }}},function(err) {
								if (err) { return next(err); }
								sendJSONresponse(res, 200, {"message": "You have successfully unregister this course"});
						});
					}
				});
			});
		});
	});
});

router.post('/student/changePassword', auth,  function(req, res, next) {
	if(!req.body.old || !req.body.new || !req.body.repeat){
		   sendJSONresponse(res, 400, {"message": "All the fields are required"});
		   return;
		 }
	  Student.findOne({ _id: req.payload._id }, function(err, student) {
		 if (err) { return next(err); }
		 if (!student) { return next(404); }
		 if(student.password != req.body.old){
			sendJSONresponse(res, 400, {"message": "Invalied current password"});
		   return;
		 }
		  Student.update({_id: req.payload._id}, { password: req.body.new }, function(err) {
			 if (err) {   return next(err); }
				sendJSONresponse(res, 200, {"message": "Password changed successfully."});
				 return;
		   });
	   });
 });

//Lecturers section

router.get('/lecturer/courses/:id', auth, function(req, res, next) {
	Lecturer.findOne({_id: req.params.id})
	.exec(function(err, lecturer) {
	 if (err) { 
		  sendJSONresponse(res, 400, {
			 "message": "Your request can not be process"
		 });
		 return; 
	  }
	  Course.find({lecturers: req.params.id})
		.exec(function(err, courses) {
		if (err) { return next(err); }
		sendJSONresponse(res, 200, courses);
	  });
   });
 });

router.get('/lecturer/course/students/:courseID', auth, function(req, res, next) {
	Course.findOne({_id: req.params.courseID})
		.exec(function(err, course) {
		if (err) {  return next(err); }
		if (!course) { return next(404); }
		Setting.findOne({type:"session"},{ 
			currentSession: 1,
			currentSemister:1
		})
		.exec(function(err, settings) {
		if (err) { return next(err); }
		var session = req.body.session || settings.currentSession;
		Regcourse.find({
				session: session,
				'courses.courseID': req.params.courseID
			},{
				student: 1,
				'courses.$' : 1
			})
				.populate('student','fullname regNo')
				.exec(function(err, students) {
				if (err) {  return next(err); }
				if (!students) { return sendJSONresponse(res, 200, [] ); }
				console.log(students)
				Session.findOne({_id: session},{ 
						title:1,
					})
						.exec(function(err, seletedSessions) {
						if (err) { return next(err); }
						if (!seletedSessions) { return next(404); }
						sendJSONresponse(res, 200, {
							students: students,
							course: course,
							session: seletedSessions
						});
				});
		});
	});
	});
});

router.post('/lecturer/course/students/:courseID', auth, function(req, res, next) {
	Course.findOne({_id: req.params.courseID})
		.exec(function(err, course) {
		if (err) {  return next(err); }
		if (!course) { return next(404); }
		Setting.findOne({type:"session"},{ 
			currentSession: 1,
			currentSemister:1
		})
		.exec(function(err, settings) {
		if (err) { return next(err); }
		var session = req.body.session || settings.currentSession;
		Regcourse.find({
				session: session,
				'courses.courseID': req.params.courseID
			},{
				student: 1,
				'courses.$' : 1
			})
				.populate('student','fullname regNo')
				.exec(function(err, students) {
				if (err) {  return next(err); }
				if (!students) { return sendJSONresponse(res, 200, [] ); }
				Session.findOne({_id: session},{ 
						title:1,
					})
						.exec(function(err, seletedSessions) {
						if (err) { return next(err); }
						if (!seletedSessions) { return next(404); }
						sendJSONresponse(res, 200, {
							students: students,
							course: course,
							session: seletedSessions
						});
				});
		});
	});
	});
});

router.post('/lecturer/set_score/:regcourseID', auth, function(req, res, next) {
		Regcourse.update({
			_id: req.params.regcourseID,
			'courses.courseID': req.body.courseID
		},{
			$set: {
					'courses.$.assessment': req.body.assessment,
					'courses.$.exam': req.body.exam
			}
		},function(err) {
			if (err) { console.log(err);  return next(err); }

			Regcourse.findOne({
				_id: req.params.regcourseID,
				'courses.courseID': req.body.courseID
			},{
				student: 1,
				'courses.$' : 1
			})
				.populate('student','fullname regNo')
				.exec(function(err, student) {
				if (err) {  return next(err); }
				console.log(student)
				sendJSONresponse(res, 200, student);
			});
		});
});


router.post('/lecturer/changePassword', auth,  function(req, res, next) {
	if(!req.body.old || !req.body.new || !req.body.repeat){
		   sendJSONresponse(res, 400, {"message": "All the fields are required"});
		   return;
		 }
	  Lecturer.findOne({ _id: req.payload._id }, function(err, lecturer) {
		 if (err) { return next(err); }
		 if (!lecturer) { return next(404); }
		 if(lecturer.password != req.body.old){
			sendJSONresponse(res, 400, {"message": "Invalied current password"});
		   return;
		 }
		  Lecturer.update({_id: req.payload._id}, { password: req.body.new }, function(err) {
			 if (err) {   return next(err); }
				sendJSONresponse(res, 200, {"message": "Password changed successfully."});
				 return;
		   });
	   });
 });
  
module.exports = router;
