angular
.module('app')
.controller('adminprofileCtrl', adminprofileCtrl)
.controller('addLessonsCtrl', addLessonsCtrl);


function adminprofileCtrl ($scope,$rootScope,Profile,$routeParams,Class,authentication,$location,ngDialog,toastr) {
   var myClass = {bg : false};
   Class.setmyClass(myClass);
   $rootScope.menuOption = "Profile";
   $scope.admin = authentication.currentAdmin().email;
   $scope.profile = Profile;
   $scope.btn = "Change profile";
   $scope.passBtn = "Change password";
  
  $scope.edit = function(valid){
    $scope.btn = "Loading...";
    if(!valid){
        toastr.error("All field are required");
        $scope.btn = "Change profile";
        return;
    }
    authentication
    .editProfile($scope.profile)
    .then(function (response) {
       toastr.success(response.data.message);
       $scope.btn = "Change profile";
    }, function (error) {
        toastr.error(error.data.message);
        $scope.btn = "Change profile";
    });
  }

  $scope.change = function (valid) {  
      $scope.passBtn = "Changing...";
      if(!valid){
          toastr.error("All field are required");
          $scope.passBtn = "Change password";
          return;
      }
      authentication
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

function addLessonsCtrl ($scope,$http,$routeParams,Class,authentication,$location,ngDialog,toastr) {
    $scope.lesson ={};
    $scope.btn ="Add lesson";
    $scope.submitted = false;
    $scope.add = function(valid){
     if(!valid){
        $scope.submitted = true;
        return;
      }
      $scope.btn ="Adding...";
        var uploadUrl = "/api/add-lesson/"+$routeParams.id;;
       $http.post(uploadUrl, $scope.lesson, {
          headers: {
           Authorization: 'Bearer '+ authentication.getToken()
          }
       }).then(function (response) {
          $scope.closeThisDialog(response.data);
          toastr.success('lesson added successfully');
          $scope.btn ="Add lesson";
      }, function (error) {
          $scope.btn ="Add lesson";
          toastr.error(error.data.message);
      });
    };
}

