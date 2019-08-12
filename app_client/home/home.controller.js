angular
.module('app')
.controller('homeCtrl', homeCtrl);

function homeCtrl ($scope,Class) {
  var myClass = {bg : true};
  Class.setmyClass(myClass);
	
}