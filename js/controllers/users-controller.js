define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('usersController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
    	$scope.campaigns = "";
		$scope.campaignsOptions = "";    
		
		var init = function(){
			sliderFunction();
			$('.selectpicker').selectpicker({});
		};
		
    	var sliderFunction = function(){
    	//	console.log("slider function");
    		 $scope.campaigns = "0;1000";
    		 $scope.campaignsOptions = {       
    		    from: 0,
    		    to: 1000,
    		    step: 10,
    		    dimension: ""
    		 };
    	};
    	

    	$scope.loadingEnd();
    	init();
    	
    }]);
});
