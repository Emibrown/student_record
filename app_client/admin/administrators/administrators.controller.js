angular
.module('app')
.controller('adminCtrl', adminCtrl)
.controller('addAdminCtrl', addAdminCtrl);


function adminCtrl ($scope,allAdmin,$rootScope,$http,$routeParams,Class,authentication,$location,ngDialog,toastr) {
   var myClass = {bg : false};
   Class.setmyClass(myClass);
   $scope.allAdmin = allAdmin;
   $rootScope.menuOption = "Administrators";
  

   $scope.add = function () {
        var dialog = ngDialog.open({ 
          template: '/admin/administrators/addadministrator.html',
          controller: 'addAdminCtrl',
          className: 'ngdialog-theme-default',
          closeByDocument: false,
          closeByEscape: false,
        });

         dialog.closePromise.then(function (data) {
            if(data.value != '$closeButton'){
               $scope.allAdmin.push(data.value);
            }
        });
    };
}

function addAdminCtrl ($scope,$http,authentication,toastr,ngDialog) {
    $scope.btn ="Continue";
    $scope.admin = {};
    $scope.create = function(valid){
     $scope.btn ="Creating...";
     if(!valid){
        toastr.error("All field are required");
        $scope.btn ="Continue";
        return;
      }
       var uploadUrl = "/api/create_admin";
       $http.post(uploadUrl, $scope.admin, {
          headers: {
           Authorization: 'Bearer '+ authentication.getToken()
          }
       }).then(function (response) {
          $scope.closeThisDialog(response.data);
          toastr.success('Admin created successfully');
          $scope.btn ="Continue";
      }, function (error) {
          $scope.btn ="Continue";
          toastr.error(error.data.message);
      });
    };
}

