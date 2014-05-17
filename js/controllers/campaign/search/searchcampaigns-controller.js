define(['../../module'], function (controllers) {
    'use strict';
    controllers.controller('searchcampaignsController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.loadingEnd();
    	
    }]);
});
