define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('findpublishersController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
