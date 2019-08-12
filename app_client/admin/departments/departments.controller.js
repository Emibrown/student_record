angular
.module('app')
.controller('admindepartmentsCtrl', admindepartmentsCtrl)
.controller('adddepartmentCtrl', adddepartmentCtrl);


function admindepartmentsCtrl ($scope,allfaculties,alldepartment,$rootScope,$routeParams,Class,authentication,$location,ngDialog,toastr) {
   var myClass = {bg : false};
   $scope.alldepartments = alldepartment;
   Class.setmyClass(myClass);
   $rootScope.menuOption = "Departments";
  
   

   $scope.add = function () {
        var dialog = ngDialog.open({ 
          template: '/admin/departments/adddepartment.html',
          controller: 'adddepartmentCtrl',
          className: 'ngdialog-theme-default',
          closeByDocument: false,
          closeByEscape: false,
          resolve : {
            faculties : function () {
              return allfaculties;
            }
          }
        });

         dialog.closePromise.then(function (data) {
            if(data.value != '$closeButton'){
               $scope.alldepartments.push(data.value);
            }
        });
    };

}

function adddepartmentCtrl ($scope,faculties,$http,$routeParams,Class,authentication,$location,ngDialog,toastr) {
    $scope.department ={};
    $scope.btn ="Add department";
    $scope.faculties = faculties;
    $scope.submitted = false;
    $scope.add = function(valid){
     if(!valid){
        $scope.submitted = true;
        return;
      }
      $scope.btn ="Adding...";
        var uploadUrl = "/api/add_department";
       $http.post(uploadUrl, $scope.department, {
          headers: {
           Authorization: 'Bearer '+ authentication.getToken()
          }
       }).then(function (response) {
          $scope.closeThisDialog(response.data);
          toastr.success('Department added successfully');
          $scope.btn ="Add department";
      }, function (error) {
          $scope.btn ="Add department";
          toastr.error(error.data.message);
      });
    };
}

