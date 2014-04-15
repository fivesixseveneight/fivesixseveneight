define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('primaryController', ['$scope','$rootScope', '$sce', '$compile', '$http', function ($scope, $rootScope, $sce, $compile, $http) {
       	/*
    	 * This is the primary controller 
    	 */
    	
    	//propery object is stored here
    	$scope.propsObj = {
    			loadingBln: true
    	};
    	
    	/*
    	 * determines if we need to show the loading icon/sequence or not
    	 */
    	$scope.initLoadBln = true;
    	$scope.loadingStart = function(){
    	//	console.log("start loading called");
    		$scope.$broadcast('toggle-load',{activeBln: true, initLoadBln: $scope.initLoadBln}); 
    	
    	};
    	
    	$scope.loadingEnd = function(){
    	//	console.log("end loading called");
    		$scope.$broadcast('toggle-load', {activeBln: false, initLoadBln: $scope.initLoadBln}); 
    		
		};
    	/*
    	 * on route change
    	 */
    	$rootScope.$on('$stateChangeStart', function(event, toState){
    	//	console.log("state start change", event, toState);
    		if($scope.propsObj.loadingBln == false){
    			$scope.loadingEnd();
    		}else{
    			$scope.loadingStart();
    		}
    		if($("#main-navbar-collapse").hasClass("in")){
    			$("#main-navbar-menu").click();
   			}
    		
    	});
    	
    	$rootScope.$on('$stateChangeSuccess', function(event, toState){
    	//	console.log("state start success", event, toState);
    	});
    	

    	
    	$scope.env;
    	$rootScope.isMobileBln = false;
    	var detectEnvironment = function(){
    	//	console.log('detectEnvironment');
    		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    			$rootScope.isMobileBln = true;
    		}
    	};
    	    	
    	$rootScope.revealPage = function(){
    	//	console.log("revealPage");
    		$scope.loadingEnd();
    	};
    	
    	// checks if more pins need to be loaded
    	$(window).scroll(function() {
    	   if($(window).scrollTop() + $(window).height() >= ($.getDocHeight()-300) ) {
    		//	console.log("bottom of page");
    			$scope.$broadcast('scrollToBottom'); 
    	   }
    	});
    	
    	//gets document height
    	$.getDocHeight = function(){
    	     var D = document;
    	     return Math.max(
    		 Math.max(D.body.scrollHeight,D.documentElement.scrollHeight), 
    		 Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), 
    		 Math.max(D.body.clientHeight, D.documentElement.clientHeight));
    	};
    	
    	var init = function(){
    		detectEnvironment();	
    	};
    	
    	init();
    	
    }]);
});
