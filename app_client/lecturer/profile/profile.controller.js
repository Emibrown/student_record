angular
.module('app')
.controller('lecProfileCtrl', lecProfileCtrl)


function lecProfileCtrl ($scope,Class,$rootScope,lecturer,toastr,lecAuthentication) {
   var myClass = {bg : false};
   Class.setmyClass(myClass);
   $rootScope.menuOption = "Profile";
   $scope.passBtn = "Change password";
   $scope.lecturer = lecturer;



   $scope.change = function (valid) {  
      $scope.passBtn = "Changing...";
      if(!valid){
          toastr.error("All field are required");
          $scope.passBtn = "Change password";
          return;
      }
      lecAuthentication
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

