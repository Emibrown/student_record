angular
.module('app')
.controller('adminstudentsCtrl', adminstudentsCtrl)
.controller('addStudentCtrl', addStudentCtrl)
.controller('adminstudentviewCtrl', adminstudentviewCtrl)

function adminstudentsCtrl ($scope,Class,allfaculties,allstudents,authentication,$rootScope,$location,ngDialog,toastr) {
   var myClass = {bg : false};
   $scope.allstudents = allstudents;
   Class.setmyClass(myClass);
   $rootScope.menuOption = "Students";

   $scope.show = function (id){
         $location.path('/admin/students/'+id);
    }


    $scope.add = function () {
        var dialog = ngDialog.open({ 
          template: '/admin/students/addstudent.html',
          controller: 'addStudentCtrl',
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
               $scope.allstudents.push(data.value);
            }
        });
    };

  
}

function addStudentCtrl ($scope,authentication,faculties,$location,$http,ngDialog,toastr) {
    $scope.student ={};
    $scope.faculties = faculties;
    $scope.departments = {};
    $scope.btn ="Add Student";
    $scope.submitted = false;
    $scope.add = function(valid){
     if(!valid){
        $scope.submitted = true;
        return;
      }
      $scope.btn ="Adding...";
       var uploadUrl = "/api/add-student";
       var fd = new FormData();
       for(var key in $scope.student)
          fd.append(key, $scope.student[key]);
       $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {
          'Content-Type': undefined,
           Authorization: 'Bearer '+ authentication.getToken()
          }
       }).then(function (response) {
          $scope.closeThisDialog(response.data);
          console.log(response.data);
          toastr.success('Student added successfully');
          $scope.btn ="Add Student";
      }, function (error) {
          $scope.btn ="Add Student";
          toastr.error(error.data.message);
      });
    };

    $scope.update = function(){
      if($scope.student.faculty === ""){
        $scope.departments = {};
        return;
      }
      var uploadUrl = "/api/departments/"+$scope.student.faculty;
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

function adminstudentviewCtrl (allfaculties,Class,student,$rootScope,$scope,$routeParams,$route,$location,ngDialog) {
  var myClass = {bg : false};
  Class.setmyClass(myClass);
  $rootScope.addbtn = "Update";
  $rootScope.menuOption = "Students";
  $scope.student = student;


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