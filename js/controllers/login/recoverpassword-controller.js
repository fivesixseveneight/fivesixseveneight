define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('recoverpasswordController', ['$scope','$rootScope', '$state', '$stateParams', 'recoverPasswordPost', 'resetPasswordPost', function ($scope, $rootScope, $state, $stateParams, recoverPasswordPost, resetPasswordPost) {
     	
    	$scope.pageContent = {};
    	$scope.messageStr = "";
    	$scope.userObj = {};
    	$scope.userObj.password;
    	$scope.userObj.password2;
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
    	//	console.log("setup", $stateParams.id);
        	$scope.editBln = false;
    		activationIdNum = $stateParams.id;
    		$scope.messageStr = "Verifying password recovery";
    	};
        
           	
    	var checkRecovery = function(){
    	//	console.log("checkRecovery");
      		if(activationIdNum == "" || $rootScope.isLoggedInBln){
        		$state.transitionTo("root.primary.overview");
        		return;
        	}
      		
    		var dataObj = {
    				activationIdNum: activationIdNum
			};
			
			recoverPasswordPost.postRecoverPasswordData(dataObj).then(function(obj){
				console.log("callback post", obj);
				if(obj.successBln){
					checkRecoverSuccess(obj);
				}else{
					checkRecoverFailed(obj);
				}
			});
    		
    	};
    	
    	
    	var checkRecoverSuccess = function(obj){
    		console.log("checkRecoverSuccess");
    		$scope.messageStr = obj.messageStr;
    		if(obj.editBln){
    			setupVerification();
        		$scope.editBln = true;				
    		}
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
					password: $scope.userObj.password,
					password2: $scope.userObj.password2,
					activationIdNum: activationIdNum
			};
			
			$scope.$broadcast('formProcessingBln');
			resetPasswordPost.postResetPasswordData(dataObj).then(function(obj){
			//	console.log("callback post", obj);
				formSubmittedSuccess(obj);
			});
		};
		
		
		
		var setupVerification = function(event ){
    	//	console.log("setupVerification");
    		$("#recoverPasswordForm").submit(false);
    		
			$.validator.addMethod("checkPasswordsMatch", function(passwordStr, element) {
				if($scope.userObj.password == $scope.userObj.password2){
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
  		  	
  		  	$scope.editBln = false;
  		  	if(obj.successBln){
  		  		$scope.messageStr = "Password has been reset.";
    		}else{
    			$scope.messageStr = obj.messageStr;
    		}
    	};
		
        	
    

    	
    	var destroyValidate = function(){
    	//	console.log("destroyValidate");
    		$('#recoverPasswordForm').data('validator', null);
    		$("#recoverPasswordForm").unbind('validate');
    		$scope.validator = undefined;
    	};
    	
    	var destroy = function(){
    	//	console.log("destroy");
    		destroyValidate();
    	};
	
        	
    	init();

    }]);
});
