define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('termsController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
