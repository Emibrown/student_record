angular
.module('app')
.controller('lecheaderCtrl', lecheaderCtrl);

function lecheaderCtrl ($scope,$routeParams,$route,$location,lecAuthentication) {
	
	$scope.logout = function() {
	    lecAuthentication.leclogout();
	    $location.path('/lecturer');
	    $route.reload();
	  };

}