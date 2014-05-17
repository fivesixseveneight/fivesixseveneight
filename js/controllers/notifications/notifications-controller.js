define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('notificationsController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
