define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('fundsController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
