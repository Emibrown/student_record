angular
.module('app')
.controller('admincoursesCtrl', admincoursesCtrl)
.controller('addCourseCtrl', addCourseCtrl)
.controller('adminCourseviewCtrl', adminCourseviewCtrl)
.controller('assignLecCtrl', assignLecCtrl)
.controller('courseResultCtrl', courseResultCtrl)



function admincoursesCtrl ($scope,$routeParams,allcourses,alldepartment,$rootScope,Class,authentication,$location,ngDialog,toastr) {
   var myClass = {bg : false};
   $scope.allcourses = allcourses;
   Class.setmyClass(myClass);
   $rootScope.menuOption = "Courses";
  
   $scope.show = function (id){
        $location.path('/admin/courses/'+id);
    }

   $scope.add = function () {
        var dialog = ngDialog.open({ 
          template: '/admin/courses/addcourse.html',
          controller: 'addCourseCtrl',
          className: 'ngdialog-theme-default',
          closeByDocument: false,
          closeByEscape: false,
          resolve : {
            departments : function () {
              return alldepartment;
            }
          }
        });

        dialog.closePromise.then(function (data) {
            if(data.value != '$closeButton'){
               $scope.allcourses.push(data.value);
            }
        });
    };

}

function addCourseCtrl ($scope,departments,$http,$routeParams,Class,authentication,$location,ngDialog,toastr) {
    $scope.course ={};
    $scope.departments = departments;
    $scope.btn ="Add Course";
    $scope.submitted = false;
    $scope.add = function(valid){
     if(!valid){
        $scope.submitted = true;
        return;
      }
       $scope.btn ="Adding...";
        var uploadUrl = "/api/add-course";
       $http.post(uploadUrl, $scope.course, {
          headers: {
           Authorization: 'Bearer '+ authentication.getToken()
          }
       }).then(function (response) {
          $scope.closeThisDialog(response.data);
          console.log(response.data);
          toastr.success('Course added successfully');
          $scope.btn ="Add Course";
      }, function (error) {
          $scope.btn ="Add Course";
          toastr.error(error.data.message);
      });
    };
}

function adminCourseviewCtrl (Class,course,$rootScope,$scope,authentication,$location,ngDialog) {
    var myClass = {bg : false};
    Class.setmyClass(myClass);
    $rootScope.addbtn = "Update";
    $rootScope.menuOption = "Courses";
    $scope.course = course;
    $scope.lecturers = course.lecturers;
  
    $scope.results = function (courseID){
          $location.path('/admin/course/results/'+courseID);
    }

    $scope.add = function () {
      var dialog = ngDialog.open({
        template: '/admin/courses/assignLecturer.html',
        controller: 'assignLecCtrl',
        className: 'ngdialog-theme-default',
        closeByDocument: false,
        closeByEscape: false,
        resolve : {
          lecturers : function () {
            return authentication
				      .getDepartmentLec($scope.course.departmentID)
				      .then(function (response) {
				      	return response.data;
				      }, function (error) {
				    	return;
				      });
          },
          assignLecturer : function () {
            return $scope.lecturers;
          },
        }
      });
  
      dialog.closePromise.then(function (data) {
        if(data.value != '$closeButton'){
           $scope.lecturers = data.value.lecturers;
        }
      });
    };
   
  }


  function assignLecCtrl ($scope,lecturers,$routeParams,assignLecturer,authentication,$http,toastr) {
    $scope.lecturers = lecturers;
    $scope.selection= [];
  
    for (var i = 0; i < assignLecturer.length; i++) {
       $scope.selection.push(assignLecturer[i]._id);
    }
     
      // toggle selection for a given employee by name
      $scope.toggleSelection = function toggleSelection(lecID) {
        var idx = $scope.selection.indexOf(lecID);
  
        // is currently selected
        if (idx > -1) {
          $scope.selection.splice(idx, 1);
        }
  
        // is newly selected
        else {
          $scope.selection.push(lecID);
        }
      };
  
      $scope.btn ="Assign";
      $scope.submitted = false;
      $scope.add = function(){
        $scope.btn ="Loading...";
         var uploadUrl = "/api/course/"+$routeParams.id+"/assign-lec";
         $http.post(uploadUrl, $scope.selection, {
            headers: {
             Authorization: 'Bearer '+ authentication.getToken()
            }
         }).then(function (response) {
            $scope.closeThisDialog(response.data);
            if(response.data.lecturers.length < 1){
              toastr.success('No lecturers has been assign to this course');
            }else{
              toastr.success('Lecturers assigned successfully');
            }
            $scope.btn ="Assign";
        }, function (error) {     
            toastr.error(error.data.message);
            $scope.btn ="Assign";
        });
      };
  }

  function courseResultCtrl ($scope,Class,$rootScope,results,allsessions,settings,$http,authentication,toastr,ngDialog) {
    var myClass = {bg : false};
    Class.setmyClass(myClass);
    $rootScope.menuOption = "Courses";
 
    $scope.results = results.students;
    $scope.course = results.course;
    $scope.allsessions = allsessions;
    $scope.settings = settings;
    $scope.value ={};
    $scope.value.session = results.session._id;
    $scope.selectedSession = results.session.title;
 
       
    
    $scope.currentSession = function(id){
       if(settings.currentSession == id){
          return "Current";
       }
    }
 
    $scope.change = function(){
          var uploadUrl = "/api/lecturer/course/students/"+results.course._id;
         $http.post(uploadUrl, $scope.value , {
            headers: {
             Authorization: 'Bearer '+ authentication.getToken()
            }
         }).then(function (response) {
             $scope.results = response.data.students;
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
 
      $scope.approve = function(regcourseID){
          var uploadUrl = "/api/admin/approve_result/"+regcourseID;
          $http.post(uploadUrl,{courseID: $scope.course._id },{
             headers: {
              Authorization: 'Bearer '+ authentication.getToken()
             }
          }).then(function (response) {
             objIndex = $scope.results.findIndex((obj => obj._id == response.data._id));
             //Update object's name property.
             $scope.results[objIndex].courses[0].status = response.data.courses[0].status
             toastr.success('Result Approved');
         }, function (error) {
             toastr.error(error.data.message);
         });
       };    
 }

