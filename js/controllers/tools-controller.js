define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('toolsController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
