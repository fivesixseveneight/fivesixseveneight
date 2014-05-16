define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('foundadvertisersController', ['$scope','$rootScope', function ($scope, $rootScope) {
    	
    	$scope.pageContent = {};
    
		var init = function(){
			
		};
		

    	$scope.loadingEnd();
    	init();
    	
    	
    	
    }]);
});
