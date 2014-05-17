define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('settingsController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
