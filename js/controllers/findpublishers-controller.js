define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('findpublishersController', ['$scope','$rootScope', function ($scope, $rootScope) {
     	
    	$scope.pageContent = {};
  
    	$scope.clicks = "";
		$scope.clicksOptions = "";
		$scope.conversion = "";
		$scope.conversionOptions = "";
		$scope.conversionpct = "";
		$scope.conversionPctOptions = "";
	
		var init = function(){
			sliderFunction();
			$('.selectpicker').selectpicker({});
			
		};
		
    	var sliderFunction = function(){
    	//	console.log("slider function");
    		 
	   		 $scope.clicks = "0;100000";
			 $scope.clicksOptions = {       
			    from: 0,
			    to: 100000,
			    step: 10,
			    dimension: ""
			 };
			 
			 $scope.conversion = "0;100000";
			 $scope.conversionOptions = {       
			    from: 0,
			    to: 100000,
			    step: 1,
			    dimension: ""
			 };
			 
			 $scope.conversionpct = "0;100";
			 $scope.conversionPctOptions = {       
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
