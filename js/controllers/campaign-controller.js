define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('campaignController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
