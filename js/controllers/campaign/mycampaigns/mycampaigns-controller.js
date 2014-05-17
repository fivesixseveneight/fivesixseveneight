define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('mycampaignsController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
