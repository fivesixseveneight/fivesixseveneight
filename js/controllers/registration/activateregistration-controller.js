define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('activateregistrationController', ['$scope','$rootScope', '$state', '$stateParams', function ($scope, $rootScope, $state, $stateParams) {
     	
    	$scope.pageContent = {};

       	$scope.$on('$destroy', function() {
        //  console.log("destroy scope");
            destroy();
        });
       	
    	var init = function(){
    		console.log("init", $stateParams);
    		setup();
    		$scope.loadingEnd();
    	};
    	
    	var setup = function(){
    	//	console.log("setup");
        	};
    	
    	var destroy = function(){
    		console.log("destroy");
    	};
	
    	init();
    	
    }]);
});
