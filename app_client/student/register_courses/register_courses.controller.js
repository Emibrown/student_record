angular
.module('app')
.controller('studRegisterCtrl', studRegisterCtrl)


function studRegisterCtrl ($scope,Class,$rootScope,settings,registerCourses,registeredCourses,allregisteredCourses,StudAuthentication,$http,toastr) {
   var myClass = {bg : false};
   Class.setmyClass(myClass);
   $rootScope.menuOption = "Register";
   $scope.regbtn ="Register";

   $scope.settings = settings;
   $scope.registerCourses = registerCourses;
   $scope.registeredCourses = registeredCourses;
   $scope.allregisteredCourses = allregisteredCourses;


   $scope.showme = function(id){
      var found = true;
      for(var i = 0; i < allregisteredCourses.length; i++) {
         for(var j = 0; j < allregisteredCourses[i].courses.length; i++) {
            if(allregisteredCourses[i].courses[j].courseID == id && (allregisteredCourses[i].courses[j].assessment + allregisteredCourses[i].courses[j].exam) >= 45 && allregisteredCourses[i].courses[j].status =="Approved"){
                  found = false;
                  break
            }
         }
      }
      return found;
   }

   /*$scope.showme = function(id){
      var found = true;
      for(var i = 0; i < registeredCourses.length; i++) {
            if(registeredCourses[i].courseID == id && (registeredCourses[i].assessment + registeredCourses[i].exam) >= 45 && registeredCourses[i].status =="Approved"){
                  found = false;
                  break
            }
      }
      return found;
    } */


   $scope.register = function(courseID){
       $scope.regbtn ="...";
         var uploadUrl = "/api/student/register_course/"+StudAuthentication.currentStudent().id;
        $http.post(uploadUrl, {courseID: courseID}, {
           headers: {
            Authorization: 'Bearer '+ StudAuthentication.getToken()
           }
        }).then(function (response) {
           toastr.success(response.data.message);
           $scope.registeredCourses.push({
              courseID: courseID
           })
           $scope.regbtn ="Register";
       }, function (error) {
           $scope.regbtn ="Register";
           toastr.error(error.data.message);
       });
   };

   $scope.unregister = function(courseID){
      $scope.regbtn ="...";
        var uploadUrl = "/api/student/unregister_course/"+StudAuthentication.currentStudent().id;
       $http.post(uploadUrl, {courseID: courseID}, {
          headers: {
           Authorization: 'Bearer '+ StudAuthentication.getToken()
          }
       }).then(function (response) {
          toastr.success(response.data.message);
          // get index of object by it ID
          var removeIndex = $scope.registeredCourses.map(function(item) { 
            return item.courseID; 
          }).indexOf(courseID)
          // remove object
          $scope.registeredCourses.splice(removeIndex, 1);
          
          $scope.regbtn ="Register";
      }, function (error) {
          $scope.regbtn ="Register";
          toastr.error(error.data.message);
      });
  };

   $scope.courseCheck = function(courseID) {
      
      var found = false;
       for(var i = 0; i < $scope.registeredCourses.length; i++) {
             if ($scope.registeredCourses[i].courseID == courseID) {
                   found = true;
                   break;
             }
       }
       console.log(found)
       return found;
   };
  


   
  
}

