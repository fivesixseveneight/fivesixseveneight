define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('aboutController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};

    	$scope.loadingEnd();
    }]);
});
