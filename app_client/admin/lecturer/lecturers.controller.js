angular
.module('app')
.controller('adminlecturersCtrl', adminlecturersCtrl)
.controller('addlecturerCtrl', addlecturerCtrl)
.controller('adminlecturerviewCtrl', adminlecturerviewCtrl)

function adminlecturersCtrl ($scope,Class,allfaculties,alllecturers,authentication,$rootScope,$location,ngDialog,toastr) {
   var myClass = {bg : false};
   $scope.alllecturers = alllecturers;
   Class.setmyClass(myClass);
   $rootScope.menuOption = "Lecturers";

   $scope.show = function (id){
        $location.path('/admin/lecturers/'+id);
    }


    $scope.add = function () {
        var dialog = ngDialog.open({ 
          template: '/admin/lecturer/addlecturer.html',
          controller: 'addlecturerCtrl',
          className: 'ngdialog-theme-default',
          closeByDocument: false,
          closeByEscape: false,
          width: '70%',
          resolve : {
            faculties : function () {
              return allfaculties;
            }
          }
        });

        dialog.closePromise.then(function (data) {
            if(data.value != '$closeButton'){
               $scope.alllecturers.push(data.value);
            }
        });
    };

  
}

function addlecturerCtrl ($scope,authentication,faculties,$location,$http,ngDialog,toastr) {
    $scope.lecturer ={};
    $scope.faculties = faculties;
    $scope.departments = {};
    $scope.btn ="Add Lecturer";
    $scope.submitted = false;
    $scope.add = function(valid){
     if(!valid){
        $scope.submitted = true;
        return;
      }
      $scope.btn ="Adding...";
       var uploadUrl = "/api/add-lecturer";
       var fd = new FormData();
       for(var key in $scope.lecturer)
          fd.append(key, $scope.lecturer[key]);
       $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {
          'Content-Type': undefined,
           Authorization: 'Bearer '+ authentication.getToken()
          }
       }).then(function (response) {
          $scope.closeThisDialog(response.data);
          console.log(response.data);
          toastr.success('Lecturer added successfully');
          $scope.btn ="Add Lecturer";
      }, function (error) {
          $scope.btn ="Add Lecturer";
          toastr.error(error.data.message);
      });
    };

    $scope.update = function(){
      if($scope.lecturer.faculty === ""){
        $scope.departments = {};
        return;
      }
      var uploadUrl = "/api/departments/"+$scope.lecturer.faculty;
       $http.get(uploadUrl,{
          headers: {
           Authorization: 'Bearer '+ authentication.getToken()
          }
       }).then(function (response) {
          $scope.departments = response.data
      }, function (error) {
          return;
      });
    }
}

function adminlecturerviewCtrl (allfaculties,Class,lecturer,$rootScope,$scope,$routeParams,$route,$location,ngDialog) {
    var myClass = {bg : false};
    Class.setmyClass(myClass);
    $rootScope.addbtn = "Update";
    $rootScope.menuOption = "Lecturers";
    $scope.lecturer = lecturer;
    $scope.courses = lecturer.courses;
  
  
   // $scope.add = function () {
     //     var dialog = ngDialog.open({ 
       //     template: 'updatestudent', 
         //   controller: 'updateStudentCtrl',
         //   className: 'ngdialog-theme-default',
         //   closeByDocument: false,
         //   closeByEscape: false,
         //   width: '70%',
         //   resolve : {
         //     Courses : function () {
         //       return allCourses;
          //    },
          //    Student : function () {
           //     return student;
         //     }
       //     }
     //     });
  
       //   dialog.closePromise.then(function (data) {
         //     if(data.value != '$closeButton'){
           //      $scope.student = data.value;
         //     }
      //    });
    //  }; 
  }