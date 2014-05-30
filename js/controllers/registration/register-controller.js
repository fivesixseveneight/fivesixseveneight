define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('registerController', ['$scope','$rootScope', '$state', 'registerFormPost', 'checkUsernamePost', 'checkEmailPost', function ($scope, $rootScope, $state, registerFormPost, checkUsernamePost, checkEmailPost) {
     	
    	$scope.pageContent = {};

    	$scope.validator;
    	$scope.username;
    	$scope.password;
    	$scope.password2;
    	$scope.firstname;
    	$scope.lastname;
   // 	$scope.phone;
    	$scope.email;
    	$scope.email2;
  //  	$scope.companyname = "";
   // 	$scope.address;
   // 	$scope.country = "US";
  //  	$scope.city = "Adak";
  //  	$scope.state;
   // 	$scope.zip;
    	
    	$scope.countriesListArr = $rootScope.countriesArr;
    	$scope.citiesListArr = $rootScope.citiesArr;

    	
    	$scope.$on('$destroy', function() {
        //  console.log("destroy scope");
            destroy();
        });
		
    	$scope.registerSubmit = function(){
        // 	console.log("registerSubmit");
    		if(verfiyBeforeSubmit()){
    	//		console.log('setup ajax request');
    			postFormData();
    		}
    	};
        
    	
        
    	// this function obtains all the videos for a given playlist
    	var postFormData = function(){
		//	console.log('postFormData');
    		
			var dataObj = {
					username : $scope.username,
					password: $scope.password,
					password2: $scope.password2,
					firstname : $scope.firstname,
					lastname : $scope.lastname,
			//		phone : $scope.phone,
					email: $("input[name='email']").val(),
					email2: $("input[name='email2']").val(),
			//		companyname : $scope.companyname,
			//		address : $scope.address,
			//		country : $scope.country,
			//		city : $scope.city,
			//		state : $scope.state,
			//		zip : $scope.zip
			};
			
			$scope.$broadcast('formProcessingBln');
			registerFormPost.postregisterFormData(dataObj).then(function(obj){
			//	console.log("callback post", obj);
				formSubmittedComplete(obj);
			});
		};
		
		var setupVerification = function(event ){
	    	//	console.log("setupVerification");
	    		$("#registerForm").submit(false);
	    		
	    		$.validator.addMethod("phone", function(phoneNum, element) {
	    			phoneNum = phoneNum.replace(/\s+/g, "");
	    		    return this.optional(element) || phoneNum.length > 9 &&  phoneNum.match(/^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/);
	    		});
	    		
	    		$.validator.addMethod("checkUsername", function(usernameStr, element) {
	    		//	console.log("checkUsername");
	    			if($scope.username != undefined && $scope.username != ""){
			    		var dataObj = {
								username : $scope.username,
						};
			    		checkUsernamePost.postUsernameFormData(dataObj).then(function(obj){
						//	console.log("callback post", obj);
							var dataObj = {};
							dataObj.messageStr = obj.messageStr;
							var successBln = obj.successBln;
							if(successBln == false){
								if($scope.validator != undefined){
								$scope.validator.showErrors({
									  "username": dataObj.messageStr
									});
								}
							}	
			    		});
	    			}
		    		return true;
	    		});
	    		
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

				$.validator.addMethod("checkPasswordsMatch", function(passwordStr, element) {
					if($scope.password == $scope.password2){
						return true;
					}else{
						return false;
					}
				});

	    		
	    		$scope.validator = $("#registerForm").validate({
	        		rules: {
	        		/*	phone:{
	        				phone: true
	        			},	*/
	        			username: {
				            required: true,
				            checkUsername: true,
				            maxlength: 30
			    		},
	        			firstname: {
	        				required: true,
				            maxlength: 35
	        			},
	        			lastname:  {
	        				required: true,
				            maxlength: 35
	        			},
	        		//	address: "required",
	        		//	country: "required",
	        		//	city: "required",
	        		//	state: "required",
	        		//	zip: "required",
	        			password: {
	        				required: true,
				            minlength: 8,
				            maxlength: 100
	        			},
	        			password2: {
	        				required: true,
	        				checkPasswordsMatch: true,
				            maxlength: 100
	        			},
	        		//	password2: "required",
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
	        			username: {
	        				required: "Please enter a username"
	        			},	 
	        			firstname: {
	        				required: "Please enter your first name"
	        			},
	        			lastname: {
	        				required: "Please enter your last name"
	        			},
	        		//	address: "Please enter your address",
	        		//	country: "Please enter your country",
	        		//	city: "Please enter your city",
	        		//	state: "Please enter your state",
	        		//	zip: "Please enter your zip/postal code",
	        		//	phone: "Please enter a valid phone number",
	        			password: {
	        				required: "Please enter a password"
	        			},
	        			password2: {
	        				required: "Please re-enter your password",
	        				checkPasswordsMatch: "Your passwords do not match"
	        			},
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
	    		return $("#registerForm").valid();
	    	};
	    	
	    	var formSubmittedComplete = function(obj){
	    	//	console.log("formSubmittedComplete", obj);
	    	 	$scope.$broadcast('formSubmittedBln', obj); 
	    	 	var successBln = obj.successBln;
	    	 	var errorMessagesArr;
	    	
	    	 	if(successBln == true){
	        		$rootScope.isLoggedInBln = true;
	        		$rootScope.userObj = obj.userSessionObj;
	        		$state.go('root.primary.confirmregistration');
	    	 	}else{
	    	 		if(obj.errorMessagesArr){
		    	 		errorMessagesArr = obj.errorMessagesArr;
		    	 		var errorObj = {};
		    	 		for(var i in errorMessagesArr){
		    	 			errorObj[i] = errorMessagesArr[i];
		    	 			if($scope.validator != undefined){
		    	 				$scope.validator.showErrors(errorObj);
		    	 			}
		    	 		}
		    	 	}	
	    	 	}
	    	};

	    	var destroy = function(){
	    	//	console.log("destroy");
	    		$('#registerForm').data('validator', null);
	    		$("#registerForm").unbind('validate');
	    		$scope.validator = undefined;
	    	};
	    	

	    	setupVerification();
	    	$scope.loadingEnd();

		
    }]);
});
