angular
.module('app')
.directive('lecmenu', lecmenu);

function lecmenu () {
	return {
		restrict: 'EA',
		templateUrl: '/lecturer/common/directives/menu/menu.template.html',
		controller: 'lecmenuCtrl'
	};
}