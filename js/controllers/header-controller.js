define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('headerController', ['$scope','$rootScope', '$compile', function ($scope, $rootScope, $compile) {
    	

    		
    		$scope.showIconBln = true;
    		$scope.iconWidthNum = ($("#main-logo").width())+20;
    		$scope.navWrapper = $("#right-navigation-wrapper");
    		
    		$rootScope.$on('windowResized', function(event, toState){
    			windowResized();
    	   	});
    		
    		
    	 
    	   	
    	   	
    		
    		var windowResized = function(){
    			
          		if($rootScope.windowWidth >= 768){
        			if($("#main-logo").width() != 0){
        				$scope.iconWidthNum = ($("#main-logo").width())+20;
        			}
        			
            		$scope.navWrapperWidthNum = $("#right-navigation-wrapper").width();
            
            		//	console.log($rootScope.windowWidth, $scope.navWrapperWidthNum, $scope.iconWidthNum );
        			
            		if(($rootScope.windowWidth - $scope.navWrapperWidthNum)>$scope.iconWidthNum){
                		$scope.showIconBln = true;
                	}else{
                		$scope.showIconBln = false;
                	}
        		}else if($rootScope.windowWidth <= 767){
            		$scope.showIconBln = true;
            	}else{
            		$scope.showIconBln = false;
            	}
            	
    		};
    		

        	
        	
    }]);
});
