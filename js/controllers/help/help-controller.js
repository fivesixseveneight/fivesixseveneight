define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('helpController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
