define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('foundpublishersController', ['$scope','$rootScope', function ($scope, $rootScope) {
    	
    	$scope.pageContent = {};
    
		var init = function(){
			
		};
		

    	$scope.loadingEnd();
    	init();
    	
    	
    	
    }]);
});
