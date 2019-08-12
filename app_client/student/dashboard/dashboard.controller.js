angular
.module('app')
.controller('studDashboardCtrl', studDashboardCtrl)


function studDashboardCtrl ($scope,student,Class,$rootScope,$location,ngDialog) {
   var myClass = {bg : false};
   Class.setmyClass(myClass);
   $scope.student = student;
   $rootScope.menuOption = "Dashboard";

  


    

  
}

