define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('findadvertisersController', ['$scope','$rootScope', function ($scope, $rootScope) {
    	
    	$scope.pageContent = {};
    	
       	$scope.budget = "";
		$scope.budgetOptions = "";    
		$scope.conversion = "";
		$scope.conversionOptions = "";
		
		var init = function(){
			sliderFunction();
			$('.selectpicker').selectpicker({});
			
		};
		
    	var sliderFunction = function(){
    	//	console.log("slider function");
    		 $scope.budget = "0;100000";
    		 $scope.budgetOptions = {       
    		    from: 0,
    		    to: 100000,
    		    step: 1000,
    		    dimension: "$"
    		 };
    		 
    		 $scope.conversion = "0;100";
    		 $scope.conversionOptions = {       
    		    from: 0,
    		    to: 100,
    		    step: 1,
    		    dimension: "%"
    		 };
    		 
    	};
    	

    	$scope.loadingEnd();
    	init();
    	
    	
    	
    }]);
});
