define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('findadvertisersController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
