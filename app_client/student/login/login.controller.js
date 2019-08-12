angular
.module('app')
.controller('studloginCtrl', studloginCtrl);

function studloginCtrl ($scope,StudAuthentication,Class,$location, toastr) {
	var myClass = {bg : true};
  Class.setmyClass(myClass);

  $scope.credentials = {
		regNo : "",
		password : ""
	};
  $scope.btn = "Login";

 function userlogin(){
      StudAuthentication
      .studentlogin($scope.credentials)
      .then(function (response) {
          StudAuthentication.saveToken(response.data.token);
          toastr.success('You have successfully logged in');
          $location.path('/student/dashboard');
      }, function (error) {
          $scope.btn = "Login";
          toastr.error(error.data.message);
      });
  }
	$scope.onSubmit = function(){
     $scope.btn = "Loading...";
		 userlogin();
	};
  $scope.clear = function(){
   
  };
}