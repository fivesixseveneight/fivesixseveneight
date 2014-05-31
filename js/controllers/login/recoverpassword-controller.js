define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('recoverpasswordController', ['$scope','$rootScope', '$state', '$stateParams', 'recoverPasswordPost', function ($scope, $rootScope, $state, $stateParams, recoverPasswordPost) {
     	
    	$scope.pageContent = {};
    	$scope.messageStr = "";
    	$scope.password;
    	$scope.password2;
    	$scope.editBln;
    	var activationIdNum;
    	
    	$scope.$on('$destroy', function() {
        //  console.log("destroy scope");
            destroy();
        });
		
    	var init = function(){
    	//	console.log("init");
    		setup();
    		checkRecovery();
    
    		$scope.loadingEnd();
    	};
    	
    	var setup = function(){
    		console.log("setup", $stateParams.id);
        	$scope.editBln = false;
    		activationIdNum = $stateParams.id;
    		$scope.messageStr = "Verifying password recovery";
    	};
        
    	var checkRecovery = function(){
    		console.log("checkRecovery");
    		
    		var dataObj = {
    				activationIdNum: activationIdNum
			};
			
			recoverPasswordPost.postRecoverPasswordData(dataObj).then(function(obj){
				console.log("callback post", obj);
				if(obj.successBln){
					enableEdit();
				}else{
					checkRecoverFailed(obj);
				}
			});
    		
    	};
    	
    	
    	
    	var enableEdit = function(){
    		console.log("enableEdit");
    		$scope.messageStr = "Please enter your new password.";
    		setupVerification();
    		$scope.editBln = true;
    	};
    	
    	var checkRecoverFailed = function(obj){
    		console.log("checkRecoverFailed", obj.messageStr);
    		$scope.messageStr = obj.messageStr;
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
					password: $scope.password,
					password2: $scope.password2
			};
			
    		return;
			$scope.$broadcast('formProcessingBln');
			recoverPasswordPost.postRecoverPasswordData(dataObj).then(function(obj){
				console.log("callback post", obj);
				formSubmittedComplete(obj);
			});
		};
		
		var setupVerification = function(event ){
    	//	console.log("setupVerification");
    		$("#recoverPasswordForm").submit(false);
    		
			$.validator.addMethod("checkPasswordsMatch", function(passwordStr, element) {
				if($scope.password == $scope.password2){
					return true;
				}else{
					return false;
				}
			});
			
    		$("#recoverPasswordForm").validate({
        		rules: {
        			password: {
        				required: true,
			            minlength: 8,
			            maxlength: 100
        			},
        			password2: {
        				required: true,
        				checkPasswordsMatch: true,
			            maxlength: 100
        			}
        		},
        		messages: {
        			password: {
        				required: "Please enter a password"
        			},
        			password2: {
        				required: "Please re-enter your password",
        				checkPasswordsMatch: "Your passwords do not match"
        			}
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
  		  		$scope.messageStr = "Password has been reset.";
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
