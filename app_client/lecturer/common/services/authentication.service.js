angular
.module('app')
.service('lecAuthentication', lecAuthentication);

function lecAuthentication ($http,$window) {



   var saveToken = function (token) {
		$window.localStorage['lecturer-token'] = token;
	};

	var getToken = function () {
		return $window.localStorage['lecturer-token'];
	};

	var leclogin = function(user) {
		return $http.post('/api/lecturer-login', user);
	};

	var leclogout = function() {
		$window.localStorage.removeItem('lecturer-token');
	};

	var isLecLoggedIn = function() {
		var token = getToken();
		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	var currentLecturer = function() {
		if(isLecLoggedIn()){
			var token = getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return {
				id: payload._id,
				staffID : payload.staffID
			};
		}
	};

	var getLecturer = function(lecturersId){
		return $http.get('/api/lecturers/'+lecturersId,{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var getCourses = function(lecturersId){
		return $http.get('/api/lecturer/courses/'+lecturersId,{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var getStudents = function(courseId){
		return $http.get('/api/lecturer/course/students/'+courseId,{
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

	var changePassword = function(date) {
		return $http.post('/api/lecturer/changePassword', date, {
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	return {
		saveToken : saveToken,
		getToken : getToken,
		leclogin: leclogin,
		leclogout: leclogout,
		isLecLoggedIn: isLecLoggedIn,
		currentLecturer: currentLecturer,
		getLecturer: getLecturer,
		getCourses: getCourses,
		getStudents: getStudents,
		allsessions: allsessions,
		getSessionSettings: getSessionSettings,
		changePassword: changePassword
	};
}