define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('messagesController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
