define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('loginController', ['$scope','$rootScope', 'loginFormPost', function ($scope, $rootScope, loginFormPost) {
     	
    	$scope.pageContent = {};

    	$scope.email;
    	$scope.password;
    	
    	$scope.$on('$destroy', function() {
        //  console.log("destroy scope");
            destroy();
        });
		
    	
    	$scope.loginSubmit = function(){
        // 	console.log("loginSubmit");
    		if(verfiyBeforeSubmit()){
    	//		console.log('setup ajax request');
    			postFormData();
    		}
    	};
        	
        	
    	// this function obtains all the videos for a given playlist
    	var postFormData = function(){
		//	console.log('postFormData');
			var dataObj = {
					password: $scope.password,
					email: $scope.email
			};
			
			$scope.$broadcast('formProcessingBln');
			loginFormPost.postLoginFormData(dataObj).then(function(obj){
				console.log("callback post", obj);
				var dataObj = {};
				dataObj.messageStr = obj.messageStr;
				formSubmittedSuccess(dataObj);
			});
		};
		
		var setupVerification = function(event ){
	    	//	console.log("setupVerification");
	    		$("#loginForm").submit(false);
	    		$("#loginForm").validate({
	        		rules: {
	        			password: "required",
	        			email: {
	        			      required: true,
	        			      email: true
	        			}
	        		},
	        		messages: {
	        			password: "Please enter your password",
	        			email: "Please enter a valid e-mail"
	        		}
	        	});
	    		
	    	};
	    	
	    	var verfiyBeforeSubmit = function(){
	    	//	console.log("verfiyBeforeSubmit");
	    		return $("#loginForm").valid();
	    	};
	    	
	    	var formSubmittedSuccess = function(obj){
	    	//	console.log("formSubmittedSuccess");
	  		  	$scope.$broadcast('formSubmittedBln', obj); 
	    	};
			
	    	
	    	var destroy = function(){
	    		console.log("destroy");
	    		$('#loginForm').data('validator', null);
	    		$("#loginForm").unbind('validate');
	    	
	    	};
	    	
	    	setupVerification();
	    	$scope.loadingEnd();

		
    }]);
});
