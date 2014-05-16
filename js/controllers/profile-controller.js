define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('profileController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	console.log("PROFILE LOAD");
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
