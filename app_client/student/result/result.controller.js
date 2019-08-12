angular
.module('app')
.controller('studResultCtrl', studResultCtrl)


function studResultCtrl ($scope,Class,results,$rootScope,$location,ngDialog) {
   var myClass = {bg : false};
   Class.setmyClass(myClass);
   $rootScope.menuOption = "Result";
   $scope.results = results;
  
   $scope.status = function(status){
      if(status == "Not approved"){
        return 'badge-danger'
      }
       return 'badge-info';
   }

   $scope.total = function(assessment, exam){
      var total = assessment + exam
      if(total >= 70){
        return 'text-success'
      }
      else if(total >= 60){
         return 'text-success'
      }
      else if(total >= 50){
         return 'text-info'
      }
      else if(total >= 45){
         return 'text-warning'
      }
      else {
         return 'text-danger'
      }
   }

   $scope.grade = function(assessment, exam){
      var total = assessment + exam
      if(!assessment || !exam){
         return 'Null'
      }
      if(total >= 70){
        return 'A'
      }
      else if(total >= 60){
         return 'B'
      }
      else if(total >= 50){
         return 'C'
      }
      else if(total >= 45){
         return 'D'
      }
      else {
         return 'F'
      }
   }

   $scope.gradeColor = function(assessment, exam){
      var total = assessment + exam
      if(total >= 70){
        return 'badge-success'
      }
      else if(total >= 60){
         return 'badge-success'
      }
      else if(total >= 50){
         return 'badge-info'
      }
      else if(total >= 45){
         return 'badge-warning'
      }
      else {
         return 'badge-danger'
      }
   }
   


    

  
}

