define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('profileController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
