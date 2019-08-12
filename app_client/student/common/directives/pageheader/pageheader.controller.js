angular
.module('app')
.controller('studheaderCtrl', studheaderCtrl);

function studheaderCtrl ($scope,$routeParams,$route,$location,StudAuthentication) {
	
	$scope.logout = function() {
	    StudAuthentication.studentlogout();
	    $location.path('/student');
	    $route.reload();
	  };

}