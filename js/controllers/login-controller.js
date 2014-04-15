define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('loginController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
    	
    	$scope.loadingEnd();
    	
    }]);
});
