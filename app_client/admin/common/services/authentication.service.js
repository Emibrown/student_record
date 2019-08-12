angular
.module('app')
.service('authentication', authentication);

function authentication ($http,$window) {



   var saveToken = function (token) {
		$window.localStorage['admin-token'] = token;
	};

	var getToken = function () {
		return $window.localStorage['admin-token'];
	};

	var adminlogin = function(user) {
		return $http.post('/api/login', user);
	};

	var adminlogout = function() {
		$window.localStorage.removeItem('admin-token');
	};

	var adminProfile = function() {
		return $http.get('/api/profile',{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var editProfile = function(date) {
		return $http.post('/api/profile', date, {
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};
	var changePassword = function(date) {
		return $http.post('/api/changePassword', date, {
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var allAdmin = function() {
		return $http.get('/api/admin',{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	}; 

	var allfaculties = function() {
		return $http.get('/api/faculties',{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var alldepartment = function() {
		return $http.get('/api/department',{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var allcourses = function() {
		return $http.get('/api/courses',{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var allstudents = function() {
		return $http.get('/api/students',{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var getStudent = function(studentId){
		return $http.get('/api/students/'+studentId,{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var getLecturer = function(lecturerId){
		return $http.get('/api/lecturers/'+lecturerId,{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	
	var getCourse = function(courseId){
		return $http.get('/api/courses/'+courseId,{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var getDepartmentLec = function(id){
		return $http.get('/api/department_lec/'+id,{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var alllecturers = function() {
		return $http.get('/api/lecturers',{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var allsessions = function() {
		return $http.get('/api/sessions',{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var getSessionSettings = function() {
		return $http.get('/api/session_settings',{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var isAdminLoggedIn = function() {
		var token = getToken();
		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	var currentAdmin = function() {
		if(isAdminLoggedIn()){
			var token = getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return {
				id: payload._id,
				email : payload.email
			};
		}
	};

	var getRsults = function(courseId){
		return $http.get('/api/lecturer/course/students/'+courseId,{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	return {
		saveToken : saveToken,
		getToken : getToken,
		adminlogin: adminlogin,
		adminlogout: adminlogout,
		isAdminLoggedIn: isAdminLoggedIn,
		currentAdmin: currentAdmin,
		adminProfile: adminProfile,
		editProfile: editProfile,
		changePassword: changePassword,
		allAdmin: allAdmin,
		allfaculties: allfaculties,
		alldepartment: alldepartment,
		allstudents: allstudents,
		alllecturers: alllecturers,
		getStudent: getStudent,
		allcourses: allcourses,
		allsessions: allsessions,
		getSessionSettings: getSessionSettings,
		getRsults: getRsults,
		getLecturer: getLecturer,
		getCourse: getCourse,
		getDepartmentLec: getDepartmentLec
	};
}