angular
.module('app')
.service('StudAuthentication', StudAuthentication);

function StudAuthentication ($http,$window) {



   var saveToken = function (token) {
		$window.localStorage['student-token'] = token;
	};

	var getToken = function () {
		return $window.localStorage['student-token'];
	};

	var studentlogin = function(user) {
		return $http.post('/api/student-login', user);
	};

	var studentlogout = function() {
		$window.localStorage.removeItem('student-token');
	};

	var isStudentLoggedIn = function() {
		var token = getToken();
		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	var currentStudent = function() {
		if(isStudentLoggedIn()){
			var token = getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return {
				id: payload._id,
				regNo : payload.regNo
			};
		}
	};

	var getStudent = function(studentId){
		return $http.get('/api/students/'+studentId,{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var getSessionSettings = function() {
		return $http.get('/api/session_settings',{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var getRegisterCourses = function(studentId){
		return $http.get('/api/student/register_course/'+studentId,{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var getRegisteredCourses = function(studentId){
		return $http.get('/api/student/registered_courses/'+studentId,{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var getAllRegisteredCourses = function(studentId){
		return $http.get('/api/student/allregistered_courses/'+studentId,{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var getResult = function(studentId){
		return $http.get('/api/student/result/'+studentId,{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var changePassword = function(date) {
		return $http.post('/api/student/changePassword', date, {
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	return {
		saveToken : saveToken,
		getToken : getToken,
		studentlogin: studentlogin,
		studentlogout: studentlogout,
		isStudentLoggedIn: isStudentLoggedIn,
		changePassword:changePassword,
		currentStudent: currentStudent,
		getStudent: getStudent,
		getSessionSettings: getSessionSettings,
		getRegisterCourses : getRegisterCourses,
		getRegisteredCourses: getRegisteredCourses,
		getResult: getResult,
		getAllRegisteredCourses: getAllRegisteredCourses
	};
}