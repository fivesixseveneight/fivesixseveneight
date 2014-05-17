define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('flaggedController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
