angular
.module('app')
.controller('adminfacultiesCtrl', adminfacultiesCtrl)
.controller('addfacultyCtrl', addfacultyCtrl)




function adminfacultiesCtrl ($scope,allfaculties,$rootScope,$routeParams, Class,authentication,$location,ngDialog,toastr) {
   var myClass = {bg : false};
   $scope.allfaculties = allfaculties;
   Class.setmyClass(myClass);
   $rootScope.menuOption = "Faculties";
  

  $scope.add = function () {
        var dialog = ngDialog.open({ 
          template: '/admin/faculties/addfaculty.html',
          controller: 'addfacultyCtrl',
          className: 'ngdialog-theme-default',
          closeByDocument: false,
          closeByEscape: false,
        });


      dialog.closePromise.then(function (data) {
          if(data.value != '$closeButton'){
              if(data.value != '$closeButton'){
                 $scope.allfaculties.push(data.value);
              }
          }
      });
  };

 

}

function addfacultyCtrl ($scope,$http,$routeParams,authentication,$location,ngDialog,toastr) {
    $scope.faculty ={};
    
    $scope.btn ="Continue";
    $scope.submitted = false;
    $scope.add = function(valid){
     if(!valid){
        $scope.submitted = true;
        return;
      }
      $scope.btn ="Adding...";
       var uploadUrl = "/api/add_faculty";
       $http.post(uploadUrl, $scope.faculty, {
          headers: {
           Authorization: 'Bearer '+ authentication.getToken()
          }
       }).then(function (response) {
          $scope.closeThisDialog(response.data);
          toastr.success('Faculty added successfully');
          $scope.btn ="Continue";
      }, function (error) {
          $scope.btn ="Continue";
          toastr.error(error.data.message);
      });
    };
}



