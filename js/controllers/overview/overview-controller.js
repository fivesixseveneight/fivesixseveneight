define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('overviewController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    }]);
});
