define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('jobsController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
