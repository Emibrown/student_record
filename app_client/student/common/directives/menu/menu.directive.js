angular
.module('app')
.directive('studmenu', studmenu);

function studmenu () {
	return {
		restrict: 'EA',
		templateUrl: '/student/common/directives/menu/menu.template.html',
		controller: 'studmenuCtrl'
	};
}