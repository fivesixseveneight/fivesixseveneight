define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('campaignrequestsController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
