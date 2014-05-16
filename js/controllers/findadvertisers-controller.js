define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('findadvertisersController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	console.log("loading end 2.1");
    	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	console.log("loading end 2.2");

    }]);
});
