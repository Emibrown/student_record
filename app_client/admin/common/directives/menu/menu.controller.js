angular
.module('app')
.controller('menuCtrl', menuCtrl);

function menuCtrl ($scope,$routeParams,$route,$location,authentication) {
	
	$scope.logout = function() {
	    authentication.adminlogout();
	    $location.path('/admin');
	    $route.reload();
	  };

}