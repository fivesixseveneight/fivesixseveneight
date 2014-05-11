define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('logoutController', ['$scope','$rootScope', '$state', 'logoutPost', function ($scope, $rootScope, $state, logoutPost) {
     	
    	$scope.pageContent = {};

    	$scope.email;
    	$scope.password;
    	$scope.userLoggedIn = $rootScope.isLoggedInBln;

    	$scope.$on('$destroy', function() {
        //  console.log("destroy scope");
            destroy();
        });
		
    	$scope.$watch('isLoggedInBln', function() {
        //	console.log("logout controller isLoggedInBln", $scope.userLoggedIn);
              $scope.userLoggedIn = $rootScope.isLoggedInBln;
              if($scope.userLoggedIn){
            	  $scope.logoutSubmit();
              }else{
            	  $state.transitionTo("root.primary.login");
              }
        });
    		
    	
    	$scope.logoutSubmit = function(){
         //	console.log("request log out");
    	//	console.log('setup ajax request');
    		postFormData();
    	};
        	
        	
    	// this function obtains all the videos for a given playlist
    	var postFormData = function(){
		//	console.log('postFormData');
			logoutPost.postLogout().then(function(obj){
			//	console.log("callback post", obj);
				formSubmittedSuccess(obj);
			});
		};
		
    	var formSubmittedSuccess = function(obj){
    		$rootScope.userObj = obj.userSessionObj;
    		console.log("user session", $rootScope.userObj);
    		console.log("logout success");
    		$rootScope.isLoggedInBln = false;
    		$state.transitionTo("root.primary.login");
    	};
		
    	
    	var destroy = function(){
    	//	console.log("destroy");
    	};
    	
	    	
    	var init = function(){
    	//	console.log("init");
    		if($scope.userLoggedIn == false){
    			
    		}
    		$scope.loadingEnd();
    	};
    	
    	init();

		
    }]);
});
