angular
.module('app')
.controller('lecDashboardCtrl', lecDashboardCtrl)


function lecDashboardCtrl ($scope,lecturer,Class,$rootScope,$location,ngDialog) {
   var myClass = {bg : false};
   Class.setmyClass(myClass);
   $scope.lecturer = lecturer;
   $scope.courses = lecturer.courses;
   $rootScope.menuOption = "Dashboard";

  


    

  
}

