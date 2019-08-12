angular
.module('app')
.controller('lecCoursesCtrl', lecCoursesCtrl)
.controller('courseStudentsCtrl', courseStudentsCtrl)
.controller('setScoreCtrl', setScoreCtrl)


function lecCoursesCtrl ($scope,Class,$rootScope,courses,$location,ngDialog) {
   var myClass = {bg : false};
   Class.setmyClass(myClass);
   $rootScope.menuOption = "Courses";
   $scope.courses = courses;
  
   $scope.show = function (courseId){
      $location.path('/lecturer/course/students/'+courseId);
   }

}

function courseStudentsCtrl ($scope,Class,$rootScope,students,allsessions,settings,$http,lecAuthentication,toastr,ngDialog) {
   var myClass = {bg : false};
   Class.setmyClass(myClass);
   $rootScope.menuOption = "Courses";

   $scope.students = students.students;
   $scope.course = students.course;
   $scope.allsessions = allsessions;
   $scope.settings = settings;
   $scope.value ={};
   $scope.value.session = students.session._id;
   $scope.selectedSession = students.session.title;

      
   
   $scope.currentSession = function(id){
      if(settings.currentSession == id){
         return "Current";
      }
   }

   $scope.change = function(){
         var uploadUrl = "/api/lecturer/course/students/"+students.course._id;
        $http.post(uploadUrl, $scope.value , {
           headers: {
            Authorization: 'Bearer '+ lecAuthentication.getToken()
           }
        }).then(function (response) {
            $scope.students = response.data.students;
            $scope.course = response.data.course;
            $scope.value.session = response.data.session._id;
            $scope.selectedSession = response.data.session.title;
           toastr.success('Session changed');
       }, function (error) {
           toastr.error(error.data.message);
       });
     };

     $scope.check = function(status){
        if(status == "Not approved"){
          return 'badge-danger'
        }
         return 'badge-info';
     }


     $scope.set = function (regNo,assessment,exam, regcourseID) {
      var dialog = ngDialog.open({ 
        template: '/lecturer/courses/set_score.html',
        controller: 'setScoreCtrl',
        className: 'ngdialog-theme-default',
        closeByDocument: false,
        closeByEscape: false,
        resolve : {
          score : function () {
            return {
               courseID: $scope.course._id,
               assessment: assessment,
               exam: exam
            };
          },
          values : function () {
            return {
               regNo: regNo,
               regcourseID: regcourseID
            };
          },
        }
      });

       dialog.closePromise.then(function (data) {
          if(data.value != '$closeButton'){
             objIndex = $scope.students.findIndex((obj => obj._id == data.value._id));
            //Update object's name property.
            $scope.students[objIndex].courses[0].exam = data.value.courses[0].exam
            $scope.students[objIndex].courses[0].assessment = data.value.courses[0].assessment
         }
      });
  };
    
}


function setScoreCtrl ($scope,score,values,lecAuthentication,$http,toastr) {
   $scope.score = score;
   $scope.values = values;
   $scope.btn ="Set Score"

   $scope.set = function(valid){
      if(!valid){
         $scope.submitted = true;
         return;
       }
       $scope.btn ="Loading...";
         var uploadUrl = "/api/lecturer/set_score/"+values.regcourseID;
        $http.post(uploadUrl, $scope.score, {
           headers: {
            Authorization: 'Bearer '+ lecAuthentication.getToken()
           }
        }).then(function (response) {
           $scope.closeThisDialog(response.data);
           toastr.success('Score successfully set');
           $scope.btn ="Set Score";
       }, function (error) {
           $scope.btn ="Set Score"
           toastr.error(error.data.message);
       });
     };
  
   
   
}

