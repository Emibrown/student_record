angular
.module('app')
.directive('studpageheader', studpageheader);

function studpageheader () {
	return {
		restrict: 'EA',
		templateUrl: '/student/common/directives/pageheader/pageheader.template.html',
		controller: 'studheaderCtrl'
	};
}