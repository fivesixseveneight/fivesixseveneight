define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('confirmregistrationController', ['$scope','$rootScope', '$state', 'checkEmailPost', 'emailUpdatePost', 'activationEmailPost', 'updateSessionPost', function ($scope, $rootScope, $state, checkEmailPost, emailUpdatePost, activationEmailPost, updateSessionPost) {
     	
    	$scope.pageContent = {};
    	$scope.userObj = {};
    	
    	$scope.userObj.emailStr = "";
    	$scope.userObj.newEmailStr = "";
    	$scope.userObj.newEmail2Str = "";
    	$scope.userObj.firstnameStr = "";
    	$scope.userObj.userIdNum = "";
    	$scope.errorBln = false;
    	$scope.activationMessageStr = "";
    	$rootScope.justRegisteredBln = false;
    	
    	$scope.editBln = false;
    	
    	$scope.$on('$destroy', function() {
        //  console.log("destroy scope");
            destroy();
        });

    	
    	var init = function(){
    	//	console.log("init");
    		checkActivated();
    		setup();
    		
    		$scope.loadingEnd();
    	};
    	
    	var setup = function(){
    	//	console.log("setup");
    		$scope.userObj.emailStr = $rootScope.userObj.emailStr;
    		$scope.userObj.newEmailStr = $rootScope.userObj.emailStr;
        	$scope.userObj.firstnameStr = $rootScope.userObj.firstnameStr;
        	$scope.userObj.userIdNum = $rootScope.userObj.userIdNum;
        
        	
        	$scope.activationMessageStr = "Hey there "+$scope.userObj.firstnameStr+", you need to activate your account to continue.";
        	if($rootScope.justRegisteredBln){
        		justRegistered();
        	}
    	};
    	
    	var checkActivated = function(){
    	//	console.log("checkActivated");
    		// if user is logged in
    		if($rootScope.isLoggedInBln){
    			//if user is activated
    			if($rootScope.activatedBln){
    				//redirect to overview if we are are already activated
    				$state.go('root.primary.overview');
    			}else{
    				//user is not activated yet, they are logged in, so they need to activate
    				
    			}
    		}else{
    			//redirect to login if user isn't logged in
    			$state.go('root.primary.login');
    		}
    	};
    	
    	var justRegistered = function(){
    	//	console.log("justRegistered");
        	$scope.activationMessageStr = "Thank you for registering "+$scope.userObj.firstnameStr+".";
    	};
    	
    	var activationError = function(){
    	//	console.log("activationError");
    		$scope.activationMessageStr = "Oops, something went wrong on our end. Please get in touch with one of us and we'll resolve the issue shortly.";
    		$scope.errorBln = true;
    	};
    	
    	$scope.resendEmail = function(){
    	//	console.log("resendEmail");
    		
			var dataObj = {
					userIdNum: $scope.userObj.userIdNum
			};
			
			activationEmailPost.postActivateEmailData(dataObj).then(function(obj){
			//	console.log("callback post", obj);
				if(obj.successBln){
					emailResent();
				}else{
					activationError();
				}
			});
    	};
    	
    	var emailResent = function(){
    	//	console.log("emailResent");
    		$scope.activationMessageStr = "Thank you "+$scope.userObj.firstnameStr+", we have resent the activation email to you.";
    	};
    	
    	$scope.changeEmail = function(){
    	//	console.log("changeEmail");
    		$scope.editBln = true;
    	};
        	
    	$scope.cancelChangeEmail = function(){
    	//	console.log("cancelChangeEmail");
    		$scope.editBln = false;
    	};	
    	
    	// event handler for when the email has been updated successfully
    	var updateEmailSuccess = function(){
    	//	console.log("updateEmailSuccess");
    		destroyValidate();
    		updateUserSession();
    	};
    	
    	//event handler for updating the user session
    	var updateUserSession = function(){
    	//	console.log("updateUserSession");
    		var dataObj = {
					userIdNum: $scope.userObj.userIdNum
			};
			
    		updateSessionPost.postUpdateSessionData(dataObj).then(function(obj){
			//	console.log("callback post", obj);
				$rootScope.userObj = obj.userSessionObj;
				updateUserSessionSuccess();
			});
    	};
    	
    	var updateUserSessionSuccess = function(){
    	//	console.log("updateUserSessionSuccess");
    		$scope.userObj.emailStr = $scope.userObj.newEmailStr;
    		$rootScope.userObj.emailStr = $scope.userObj.newEmailStr;
    		
    		$scope.editBln = false;
    		$scope.activationMessageStr = "Thank you for updating your email "+$scope.userObj.firstnameStr+", we have sent the activation email to your updated email address.";
    	};
    	
    	$scope.confirmRegisterSubmit = function(){
     	//	console.log("confirmRegisterSubmit");
 			setupVerification();
        	if(verfiyBeforeSubmit()){
    			//	console.log('setup ajax request');
    			postFormData();
    		}
       };
	  
	    // this function obtains all the videos for a given playlist
	   	var postFormData = function(){
		//	console.log('postFormData');
   		
			var dataObj = {
					userIdNum: $scope.userObj.userIdNum,
					email: $("input[name='email']").val(),
					email2: $("input[name='email2']").val()
			};
			

			emailUpdatePost.postEmailData(dataObj).then(function(obj){
			//	console.log("callback post", obj);
				if(obj.successBln){
					updateEmailSuccess();	
				}else{
					activationError();
				}
					
			});
		};
		
		var setupVerification = function(event ){
	    //		console.log("setupVerification");
	    		$("#confirmRegisterForm").submit(false);
	    		
	    		$.validator.addMethod("checkEmail", function(emailStr, element) {
	    		//	console.log("checkEmail");
	    			if( $("input[name='email']").val() != undefined &&  $("input[name='email']").val() != ""){
	    				var dataObj = {
			    				email :  $("input[name='email']").val(),
						};
			    		checkEmailPost.postEmailFormData(dataObj).then(function(obj){
						//	console.log("callback post", obj);
							var dataObj = {};
							dataObj.messageStr = obj.messageStr;
							var successBln = obj.successBln;
							if(successBln == false){
								if($scope.validator != undefined){
								$scope.validator.showErrors({
									  "email": dataObj.messageStr
									});
								}
							}	
			    		});
	    			}
			    	return true;
		    	});
	    		
	    		$.validator.addMethod("checkEmailMatch", function(emailStr, element) {
	    		//	console.log("check emails match");
	    			if($("input[name='email']").val() == $("input[name='email2']").val()){
						return true;
					}else{
						return false;
					}
	    		});

	    		$scope.validator = $("#confirmRegisterForm").validate({
	        		rules: {
	        		    email: {
	        			      required: true,
	        			      email: true,
	        			      checkEmail: true,
	        			      maxlength: 255,
	        			      checkEmailMatch: true,
	        			},
	        			email2: {
	        			      required: true,
	        			      email: true,
	        			      checkEmailMatch: true,
	        			}
	        		},
	        		messages: {
	        			email: {
	        				required: "Please enter a E-mail address",
	       				    email: "Please enter a valid E-mail address",
	        				checkEmailMatch: ""
	        			},
	        			email2: {
	        				required: "Please re-enter your E-mail address",
	        				checkEmailMatch: "Your E-mail addresses do not match"
	        			}
	        		}
	        	});
	    	};
	    	
	    	var verfiyBeforeSubmit = function(){
	    	//	console.log("verfiyBeforeSubmit");
	    		return $("#confirmRegisterForm").valid();
	    	};

	    	var destroyValidate = function(){
	    	//	console.log("destroyValidate");
	    		$('#confirmRegisterForm').data('validator', null);
	    		$("#confirmRegisterForm").unbind('validate');
	    		$scope.validator = undefined;
	    	};
	    	
	    	var destroy = function(){
	    		console.log("destroy");
	    		destroyValidate();
	    	};
    	
	    	init();
    	
    }]);
});
