angular
.module('app')
.controller('studmenuCtrl', studmenuCtrl);

function studmenuCtrl ($scope,$routeParams,$route,$location,StudAuthentication) {
	
	$scope.logout = function() {
	    StudAuthentication.studentlogout();
	    $location.path('/student');
	    $route.reload();
	  };

}