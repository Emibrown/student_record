angular
.module('app')
.controller('lecloginCtrl', lecloginCtrl);

function lecloginCtrl ($scope,lecAuthentication,Class,$location, toastr) {
	var myClass = {bg : true};
  Class.setmyClass(myClass);

  $scope.credentials = {
		staffID : "",
		password : ""
	};
  $scope.btn = "Login";

 function userlogin(){
      lecAuthentication
      .leclogin($scope.credentials)
      .then(function (response) {
          lecAuthentication.saveToken(response.data.token);
          toastr.success('You have successfully logged in');
          $location.path('/lecturer/dashboard');
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