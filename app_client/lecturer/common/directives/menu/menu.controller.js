angular
.module('app')
.controller('lecmenuCtrl', lecmenuCtrl);

function lecmenuCtrl ($scope,$routeParams,$route,$location,lecAuthentication) {
	
	$scope.logout = function() {
	    lecAuthentication.leclogout();
	    $location.path('/lecturer');
	    $route.reload();
	  };

}