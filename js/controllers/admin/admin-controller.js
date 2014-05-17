define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('adminController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
