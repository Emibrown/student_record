angular
.module('app')
.directive('menu', menu);

function menu () {
	return {
		restrict: 'EA',
		templateUrl: '/admin/common/directives/menu/menu.template.html',
		controller: 'menuCtrl'
	};
}