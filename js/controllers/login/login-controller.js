define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('loginController', ['$scope','$rootScope', '$state', 'loginFormPost', function ($scope, $rootScope, $state, loginFormPost) {
     	
    	$scope.pageContent = {};

    	$scope.email;
    	$scope.password;
    	$scope.userLoggedIn = $rootScope.isLoggedInBln;
    	$scope.messageStr = "";
    	$scope.$on('$destroy', function() {
        //  console.log("destroy scope");
            destroy();
        });
		
    	$scope.$watch('isLoggedInBln', function() {
         //     console.log("isLoggedInBln", $scope.userLoggedIn);
              $scope.userLoggedIn = $rootScope.isLoggedInBln;
              checkIfLoggedIn();
        });
    		
    	
    	$scope.loginSubmit = function(){
        // 	console.log("loginSubmit");
    		if(verfiyBeforeSubmit()){
    	//		console.log('setup ajax request');
    			$scope.messageStr = "Logging in...";
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
			//	console.log("callback post", obj);
				formSubmittedSuccess(obj);
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
        			email: "Please enter your e-mail"
        		}
        	});
    		
    	};
    	
    	var verfiyBeforeSubmit = function(){
    	//	console.log("verfiyBeforeSubmit");
    		return $("#loginForm").valid();
    	};
    	
    	var formSubmittedSuccess = function(obj){
    	//	console.log("formSubmittedSuccess", obj);
  		  	$scope.$broadcast('formSubmittedBln', obj); 
    		if(obj.successBln){
    			$rootScope.userObj = obj.userSessionObj;
        	//	console.log("user session", $rootScope.userObj);
        	//	console.log("login success");
        		$rootScope.isLoggedInBln = true;
    		}else{
        		$rootScope.isLoggedInBln = false;
        		$scope.messageStr = obj.messageStr;
    		}
    	};
		

    	var destroy = function(){
    	//	console.log("destroy");
    		$('#loginForm').data('validator', null);
    		$("#loginForm").unbind('validate');
    	};
    	
    	var checkIfLoggedIn = function(){
    	//	console.log("login checkIfLoggedIn", $rootScope.isLoggedInBln);
    		if($scope.userLoggedIn == true){
    			$state.transitionTo("root.primary.overview");
    		}
    	};
    	
    	var init = function(){
    	//	console.log("init");

    		if($scope.userLoggedIn){
    			return;
    		}
    		setupVerification();
    		$scope.loadingEnd();
    	};
    	
    	init();

		
    }]);
});
