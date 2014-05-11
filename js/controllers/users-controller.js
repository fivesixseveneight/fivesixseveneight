define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('usersController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
