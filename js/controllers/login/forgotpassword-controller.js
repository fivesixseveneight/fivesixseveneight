define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('forgotpasswordController', ['$scope','$rootScope', '$state', 'forgotpasswordPost', function ($scope, $rootScope, $state, forgotpasswordPost) {
     	
    	$scope.pageContent = {};
    	$scope.messageStr = "";
    	$scope.userLoggedIn = $rootScope.isLoggedInBln;
    	
    	
    	$scope.$on('$destroy', function() {
        //  console.log("destroy scope");
            destroy();
        });
		
    	var init = function(){
    	//	console.log("init");
    		if($scope.userLoggedIn){
    			return;
    		}
    		setup();
    		setupVerification();
    		$scope.loadingEnd();
    	};
    	
    	var setup = function(){
    		$scope.messageStr = "Please enter your email and we'll send you a password recovery email.";
    	};
    	
    	$scope.$watch('isLoggedInBln', function() {
        //     console.log("isLoggedInBln", $scope.userLoggedIn);
             $scope.userLoggedIn = $rootScope.isLoggedInBln;
             checkIfLoggedIn();
       });
       
    	var checkIfLoggedIn = function(){
    	//	console.log("forgotpassword checkIfLoggedIn", $rootScope.isLoggedInBln);
    		if($scope.userLoggedIn == true){
    			$state.transitionTo("root.primary.overview");
    		}
    	};
    
    	$scope.recoverPasswordSubmit = function(){
        // 	console.log("recoverPasswordSubmit");
    		if(verfiyBeforeSubmit()){
    	//		console.log('setup ajax request');
    			postFormData();
    		}
    	};
        
        	
    	// this function obtains all the videos for a given playlist
    	var postFormData = function(){
		//	console.log('postFormData');
			var dataObj = {
					email: $scope.email
			};
			
			$scope.$broadcast('formProcessingBln');
			forgotpasswordPost.postForgotPasswordData(dataObj).then(function(obj){
				console.log("callback post", obj);
				formSubmittedSuccess(obj);
			});
		};
		
		var setupVerification = function(event ){
    	//	console.log("setupVerification");
    		$("#recoverPasswordForm").submit(false);
    		$("#recoverPasswordForm").validate({
        		rules: {
        			email: {
        			      required: true,
        			      email: true
        			}
        		},
        		messages: {
        			email: "Please enter a valid e-mail"
        		}
        	});
    		
    	};
    	
    	var verfiyBeforeSubmit = function(){
    	//	console.log("verfiyBeforeSubmit");
    		return $("#recoverPasswordForm").valid();
    	};
    	
    	var formSubmittedSuccess = function(obj){
    	//	console.log("formSubmittedSuccess", obj);
  		  	$scope.$broadcast('formSubmittedBln', obj); 
    	
  		  	if(obj.successBln){
  		  		$scope.messageStr = "We have sent a password recovery email to "+$scope.email+" please check your inbox for further instructions.";
    		}else{
    			$scope.messageStr = obj.messageStr;
    		}
    	};
		
        	
    

    	
    	var destroy = function(){
        	//	console.log("destroy");

        };
        	
    	init();

    }]);
});
