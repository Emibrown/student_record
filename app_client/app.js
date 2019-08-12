angular.module('app', [
	'dndLists',
	'ngRoute',
	'ngProgress',
	'ngAnimate',
	'ngSanitize',
	'ngDialog',
	'ngFileUpload',
	'toastr'
	]);

function config ($routeProvider, $locationProvider, $httpProvider,toastrConfig) {
	
	$routeProvider
	.when('/', {
		templateUrl: 'home/home.view.html',
		controller: 'homeCtrl'
	})
	.when('/admin', {
		templateUrl: 'admin/login/login.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin/students');   
	            }else{
	                       
	            }
	        }
	    },
		controller: 'adminloginCtrl'
	})
	.when('/admin/students', {
		templateUrl: 'admin/students/students.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin');
	            }
	        },
	        "allfaculties": function(authentication){
              return authentication
			      .allfaculties()
			      .then(function (response) {
			      	return response.data;
			      }, function (error) {
			    	return;
			      });
            },
            "allstudents": function(authentication){
              return authentication
			      .allstudents()
			      .then(function (response) {
			      	return response.data;
			      }, function (error) {
			    	return;
			      });
            }
	    },
		controller: 'adminstudentsCtrl'
	})
	.when('/admin/students/:id', {
		templateUrl: 'admin/students/studentview.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	               
	            }else{
	                $location.path('/');           //redirect user to home if it does not have permission.
	            }
	        },
	        "allfaculties": function(authentication){
              return authentication
			      .allfaculties()
			      .then(function (response) {
			      	return response.data;
			      }, function (error) {
			    	return;
			      });
            },
            "student": function($route,authentication){
	               return authentication
				      .getStudent($route.current.params.id)
				      .then(function (response) {
				      	return response.data;
				      }, function (error) {
				    	return;
				      });
            }
	    },
		controller: 'adminstudentviewCtrl'
	})
	.when('/admin/lecturers', {
		templateUrl: 'admin/lecturer/lecturers.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin');
	            }
	        },
	        "allfaculties": function(authentication){
              return authentication
			      .allfaculties()
			      .then(function (response) {
			      	return response.data;
			      }, function (error) {
			    	return;
			      });
            },
            "alllecturers": function(authentication){
              return authentication
			      .alllecturers()
			      .then(function (response) {
			      	return response.data;
			      }, function (error) {
			    	return;
			      });
            }
	    },
		controller: 'adminlecturersCtrl'
	})
	.when('/admin/sessions', {
		templateUrl: 'admin/sessions/sessions.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin');
	            }
	        },
	        "allsessions": function(authentication){
              return authentication
			      .allsessions()
			      .then(function (response) {
			      	return response.data;
			      }, function (error) {
			    	return;
			      });
			},
			"settings": function(authentication){
				return authentication
					.getSessionSettings()
					.then(function (response) {
						return response.data;
					}, function (error) {
					  return;
					});
			  }
	    },
		controller: 'adminsessionCtrl'
	})
	.when('/admin/lecturers/:id', {
		templateUrl: 'admin/lecturer/lecturerview.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	               
	            }else{
	                $location.path('/');           //redirect user to home if it does not have permission.
	            }
	        },
	        "allfaculties": function(authentication){
              return authentication
			      .allfaculties()
			      .then(function (response) {
			      	return response.data;
			      }, function (error) {
			    	return;
			      });
            },
            "lecturer": function($route,authentication){
	               return authentication
				      .getLecturer($route.current.params.id)
				      .then(function (response) {
				      	return response.data;
				      }, function (error) {
				    	return;
				      });
            }
	    },
		controller: 'adminlecturerviewCtrl'
	})
	.when('/admin/courses/:id', {
		templateUrl: 'admin/courses/courseview.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	               
	            }else{
	                $location.path('/');           //redirect user to home if it does not have permission.
	            }
	        },
            "course": function($route,authentication){
	               return authentication
				      .getCourse($route.current.params.id)
				      .then(function (response) {
				      	return response.data;
				      }, function (error) {
				    	return;
				      });
            }
	    },
		controller: 'adminCourseviewCtrl'
	})
	.when('/admin/courses', {
		templateUrl: 'admin/courses/courses.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin');
	            }
	        },
	        "allcourses": function(authentication){
              return authentication
			      .allcourses()
			      .then(function (response) {
			      	return response.data;
			      }, function (error) {
			    	return;
			      });
            },
	        "alldepartment": function(authentication){
              return authentication
			      .alldepartment()
			      .then(function (response) {
			      	return response.data;
			      }, function (error) {
			    	return;
			      });
            }
	    },
		controller: 'admincoursesCtrl'
	})
	.when('/admin/course/results/:courseID', {
		templateUrl: 'admin/courses/results.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin');   
	            }
			},
			"results": function(authentication,$route){
				return authentication
				.getRsults($route.current.params.courseID)
				.then(function (response) {
					return response.data;
				}, function (error) {
					return;
				});
			},
			"allsessions": function(authentication){
				return authentication
					.allsessions()
					.then(function (response) {
						return response.data;
					}, function (error) {
					  return;
					});
			  },
			  "settings": function(authentication){
				  return authentication
					  .getSessionSettings()
					  .then(function (response) {
						  return response.data;
					  }, function (error) {
						return;
					  });
				}
	    },
		controller: 'courseResultCtrl'
	})
	.when('/admin/departments', {
		templateUrl: 'admin/departments/departments.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin');
	            }
	        },
	        "allfaculties": function(authentication){
              return authentication
			      .allfaculties()
			      .then(function (response) {
			      	return response.data;
			      }, function (error) {
			    	return;
			      });
            },
            "alldepartment": function(authentication){
              return authentication
			      .alldepartment()
			      .then(function (response) {
			      	return response.data;
			      }, function (error) {
			    	return;
			      });
            }
	    },
		controller: 'admindepartmentsCtrl'
	})
	.when('/admin/faculties', {
		templateUrl: 'admin/faculties/faculties.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin');
	            }
	        },
	        "allfaculties": function(authentication){
              return authentication
			      .allfaculties()
			      .then(function (response) {
			      	return response.data;
			      }, function (error) {
			    	return;
			      });
            }
	    },
		controller: 'adminfacultiesCtrl'
	})
	.when('/admin/administrators', {
		templateUrl: 'admin/administrators/administrators.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin');
	            }
	        },
	        "allAdmin": function(authentication){
              return authentication
			      .allAdmin()
			      .then(function (response) {
			      	return response.data;
			      }, function (error) {
			    	return;
			      });
            }
	    },
		controller: 'adminCtrl'
	})
	.when('/admin/profile', {
		templateUrl: 'admin/profile/profile.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin');
	            }
	        },
	        "Profile": function(authentication){
	               return authentication
				      .adminProfile()
				      .then(function (response) {
				      	return response.data;
				      }, function (error) {
				    	return;
				      });
            },
	    },
		controller: 'adminprofileCtrl'
	})
	.when('/student', { // Student rout
		templateUrl: 'student/login/login.view.html',
		resolve:{
	        "check":function(StudAuthentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(StudAuthentication.isStudentLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/student/dashboard');   
	            }else{
	                       
	            }
	        }
	    },
		controller: 'studloginCtrl'
	})
	.when('/student/dashboard', {
		templateUrl: 'student/dashboard/dashboard.view.html',
		resolve:{
	        "check":function(StudAuthentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!StudAuthentication.isStudentLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/student');   
	            }
			},
			"student": function(StudAuthentication){
				return StudAuthentication
				.getStudent(StudAuthentication.currentStudent().id)
				.then(function (response) {
					return response.data;
				}, function (error) {
					return;
				});
			}
	    },
		controller: 'studDashboardCtrl'
	})
	.when('/student/register_courses', {
		templateUrl: 'student/register_courses/register_courses.view.html',
		resolve:{
	        "check":function(StudAuthentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!StudAuthentication.isStudentLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/student');   
	            }
			},
			"settings": function(StudAuthentication){
				return StudAuthentication
				.getSessionSettings()
				.then(function (response) {
					return response.data;
				}, function (error) {
					return;
				});
			},
			"registerCourses": function(StudAuthentication){
				return StudAuthentication
				.getRegisterCourses(StudAuthentication.currentStudent().id)
				.then(function (response) {
					return response.data;
				}, function (error) {
					return;
				});
			},
			"registeredCourses": function(StudAuthentication){
				return StudAuthentication
				.getRegisteredCourses(StudAuthentication.currentStudent().id)
				.then(function (response) {
					return response.data;
				}, function (error) {
					return;
				});
			},
			"allregisteredCourses": function(StudAuthentication){
				return StudAuthentication
				.getAllRegisteredCourses(StudAuthentication.currentStudent().id)
				.then(function (response) {
					return response.data;
				}, function (error) {
					return;
				});
			}
	    },
		controller: 'studRegisterCtrl'
	})
	.when('/student/result', {
		templateUrl: 'student/result/result.view.html',
		resolve:{
	        "check":function(StudAuthentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!StudAuthentication.isStudentLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/student');   
	            }
			},
			"results": function(StudAuthentication){
				return StudAuthentication
				.getResult(StudAuthentication.currentStudent().id)
				.then(function (response) {
					return response.data;
				}, function (error) {
					return;
				});
			}
	    },
		controller: 'studResultCtrl'
	})
	.when('/student/profile', {
		templateUrl: 'student/profile/profile.view.html',
		resolve:{
	        "check":function(StudAuthentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!StudAuthentication.isStudentLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/student');   
	            }
			},
			"student": function(StudAuthentication){
				return StudAuthentication
				.getStudent(StudAuthentication.currentStudent().id)
				.then(function (response) {
					return response.data;
				}, function (error) {
					return;
				});
			}
	    },
		controller: 'studProfileCtrl'
	})
	.when('/lecturer', { // Lecturer rout
		templateUrl: 'lecturer/login/login.view.html',
		resolve:{
	        "check":function(lecAuthentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(lecAuthentication.isLecLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/lecturer/dashboard');   
	            }else{
	                       
	            }
	        }
	    },
		controller: 'lecloginCtrl'
	})
	.when('/lecturer/dashboard', {
		templateUrl: 'lecturer/dashboard/dashboard.view.html',
		resolve:{
	        "check":function(lecAuthentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!lecAuthentication.isLecLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/lecturer');   
	            }
			},
			"lecturer": function(lecAuthentication){
				return lecAuthentication
				.getLecturer(lecAuthentication.currentLecturer().id)
				.then(function (response) {
					return response.data;
				}, function (error) {
					return;
				});
			}
	    },
		controller: 'lecDashboardCtrl'
	})
	.when('/lecturer/courses', {
		templateUrl: 'lecturer/courses/courses.view.html',
		resolve:{
	        "check":function(lecAuthentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!lecAuthentication.isLecLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/lecturer');   
	            }
			},
			"courses": function(lecAuthentication){
				return lecAuthentication
				.getCourses(lecAuthentication.currentLecturer().id)
				.then(function (response) {
					return response.data;
				}, function (error) {
					return;
				});
			}
	    },
		controller: 'lecCoursesCtrl'
	})
	.when('/lecturer/course/students/:courseID', {
		templateUrl: 'lecturer/courses/students.view.html',
		resolve:{
	        "check":function(lecAuthentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!lecAuthentication.isLecLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/lecturer');   
	            }
			},
			"students": function(lecAuthentication,$route){
				return lecAuthentication
				.getStudents($route.current.params.courseID)
				.then(function (response) {
					return response.data;
				}, function (error) {
					return;
				});
			},
			"allsessions": function(lecAuthentication){
				return lecAuthentication
					.allsessions()
					.then(function (response) {
						return response.data;
					}, function (error) {
					  return;
					});
			  },
			  "settings": function(lecAuthentication){
				  return lecAuthentication
					  .getSessionSettings()
					  .then(function (response) {
						  return response.data;
					  }, function (error) {
						return;
					  });
				}
	    },
		controller: 'courseStudentsCtrl'
	})
	.when('/lecturer/profile', {
		templateUrl: 'lecturer/profile/profile.view.html',
		resolve:{
	        "check":function(lecAuthentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!lecAuthentication.isLecLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/lecturer');   
	            }
			},
			"lecturer": function(lecAuthentication){
				return lecAuthentication
				.getLecturer(lecAuthentication.currentLecturer().id)
				.then(function (response) {
					return response.data;
				}, function (error) {
					return;
				});
			}
	    },
		controller: 'lecProfileCtrl'
	})
	.otherwise({redirectTo: '/'});
	
	$locationProvider.html5Mode(true);

	angular.extend(toastrConfig, {
	    autoDismiss: true,
	    containerId: 'toast-container',
	    maxOpened: 0,    
	    newestOnTop: true,
	    positionClass: 'toast-top-right',
	    preventDuplicates: false,
	    preventOpenDuplicates: true,
	    target: 'body'
	  });
}

angular
.module('app')
.factory('Class', function(){
  var myClass = {};
  return {
    myClass: function() { return myClass; },
    setmyClass: function(newClass) { myClass = newClass; }
  };
});

angular
.module('app')
.controller('mainCtrl', mainCtrl);

function mainCtrl ($scope,Class) {
	$scope.myClass = Class;
};

angular
.module('app')
.filter('trusted', ['$sce', function($sce){
	return function(url){
		var video_id = url.split('v=')[1].split('&')[0];
		return $sce.trustAsResourceUrl('http://www.youtube.com/embed/'+video_id);
	}
}]);


angular
.module('app')
.config(['$routeProvider', '$locationProvider', '$httpProvider','toastrConfig', config]);

angular.module('app').run(function ($rootScope, ngProgressFactory) { 

    // first create instance when app starts
    $rootScope.progressbar = ngProgressFactory.createInstance();
    $rootScope.progressbar.setHeight('3px');
    $rootScope.progressbar.setColor('#FFEB3B');
    

    $rootScope.$on("$routeChangeStart", function () {
        $rootScope.progressbar.start();
    });

    $rootScope.$on("$routeChangeSuccess", function () {
        $rootScope.progressbar.complete();
    });
});

