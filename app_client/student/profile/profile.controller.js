angular
.module('app')
.controller('studProfileCtrl', studProfileCtrl)


function studProfileCtrl ($scope,Class,$rootScope,student,toastr,StudAuthentication) {
   var myClass = {bg : false};
   Class.setmyClass(myClass);
   $rootScope.menuOption = "Profile";
   $scope.passBtn = "Change password"
   $scope.student = student;
  

   $scope.change = function (valid) {  
      $scope.passBtn = "Changing...";
      if(!valid){
          toastr.error("All field are required");
          $scope.passBtn = "Change password";
          return;
      }
      StudAuthentication
      .changePassword($scope.password)
      .then(function (response) {
           toastr.success(response.data.message);
           $scope.passBtn = "Change password";
      }, function (error) {
           toastr.error(error.data.message);
           $scope.passBtn = "Change password";
      });
  };
    

  
}

