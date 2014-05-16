define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('usersController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
    	$scope.value = "";
		$scope.options = "";    
    	
    	var sliderFunction = function(){
    	//	console.log("slider function");
    		 $scope.value = "0;1000";
    		 $scope.options = {       
    		    from: 0,
    		    to: 1000,
    		    step: 10,
    		    dimension: ""
    		 };
    	};
    	
    	
        $('.selectpicker').selectpicker({

        });
        
        
    	sliderFunction();

    	console.log("loading end 1");
    	$scope.loadingEnd();
    	
    }]);
});
