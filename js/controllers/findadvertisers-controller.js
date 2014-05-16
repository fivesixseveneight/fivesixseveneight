define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('findadvertisersController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	var init = function(){
    	console.log("findAdvertisersController init");
    		
    	};
    	
    	$scope.pageContent = {};
  
    	console.log("loading end 2");
    	$scope.loadingEnd();
    	init();

    	
    	
    }]);
});
