angular
.module('app')
.directive('lecpageheader', lecpageheader);

function lecpageheader () {
	return {
		restrict: 'EA',
		templateUrl: '/lecturer/common/directives/pageheader/pageheader.template.html',
		controller: 'lecheaderCtrl'
	};
}