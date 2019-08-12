angular
.module('app')
.controller('adminsessionCtrl', adminsessionCtrl)
.controller('addsessionCtrl', addsessionCtrl);


function adminsessionCtrl ($scope,allsessions,settings,$rootScope,$http,Class,authentication,$location,ngDialog,toastr) {
   var myClass = {bg : false};
   $scope.allsessions = allsessions;
   Class.setmyClass(myClass);
   $rootScope.menuOption = "Sessions";
  
   

   $scope.add = function () {
        var dialog = ngDialog.open({ 
          template: '/admin/sessions/addsession.html',
          controller: 'addsessionCtrl',
          className: 'ngdialog-theme-default',
          closeByDocument: false,
          closeByEscape: false,
        });

         dialog.closePromise.then(function (data) {
            if(data.value != '$closeButton'){
               $scope.allsessions.push(data.value.session);
               $scope.settings = data.value.settings;
            }
        });
    };

    // settings
    $scope.settings = settings;
    $scope.sessionbtn ="Save Settings";
    $scope.submitted = false;
    $scope.saveSettings = function(valid){
     if(!valid){
        $scope.submitted = true;
        return;
      }
      $scope.sessionbtn ="Saving...";
        var uploadUrl = "/api/session_settings";
       $http.post(uploadUrl, $scope.settings, {
          headers: {
           Authorization: 'Bearer '+ authentication.getToken()
          }
       }).then(function (response) {
          toastr.success('Settings Saved');
          $scope.sessionbtn ="Save Settings";
      }, function (error) {
          $scope.sessionbtn ="Save Settings";
          toastr.error(error.data.message);
      });
    };

}

function addsessionCtrl ($scope,$http,$routeParams,Class,authentication,$location,ngDialog,toastr) {
    $scope.session ={};
    $scope.btn ="Start session";
    $scope.submitted = false;
    $scope.add = function(valid){
     if(!valid){
        $scope.submitted = true;
        return;
      }
      $scope.btn ="loading...";
        var uploadUrl = "/api/add_session";
       $http.post(uploadUrl, $scope.session, {
          headers: {
           Authorization: 'Bearer '+ authentication.getToken()
          }
       }).then(function (response) {
          $scope.closeThisDialog(response.data);
          toastr.success('New session started');
          $scope.btn ="Start session";
      }, function (error) {
          $scope.btn ="start session";
          toastr.error(error.data.message);
      });
    };
}

