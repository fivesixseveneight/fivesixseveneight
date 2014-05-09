define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('registerController', ['$scope','$rootScope', 'registerFormPost', 'checkUsernamePost', 'checkEmailPost', function ($scope, $rootScope, registerFormPost, checkUsernamePost, checkEmailPost) {
     	
    	$scope.pageContent = {};

    	
    	$scope.username;
    	$scope.password;
   // 	$scope.password2;
    	$scope.firstname;
    	$scope.lastname;
   // 	$scope.phone;
    	$scope.email;
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
			//		password2: $scope.password2,
					firstname : $scope.firstname,
					lastname : $scope.lastname,
			//		phone : $scope.phone,
					email: $scope.email,
			//		companyname : $scope.companyname,
			//		address : $scope.address,
			//		country : $scope.country,
			//		city : $scope.city,
			//		state : $scope.state,
			//		zip : $scope.zip
			};
			
			$scope.$broadcast('formProcessingBln');
			registerFormPost.postregisterFormData(dataObj).then(function(obj){
				console.log("callback post", obj);
				var dataObj = {};
				dataObj.messageStr = obj.messageStr;
				formSubmittedSuccess(dataObj);
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
	    	 
		    		var dataObj = {
							username : $scope.username,
					};

		    		checkUsernamePost.postUsernameFormData(dataObj).then(function(obj){
					//	console.log("callback post", obj);
						var dataObj = {};
						dataObj.messageStr = obj.messageStr;
						var successBln = obj.successBln;
						if(successBln == false){
							validator.showErrors({
								  "username": dataObj.messageStr
								});
						}	
		    		});
		    		
		    		return true;
	    		});
	    		
	    		$.validator.addMethod("checkEmail", function(emailStr, element) {
		    		//	console.log("checkUsername");
		    	 
			    		var dataObj = {
			    				email : $scope.email,
						};

			    		checkEmailPost.postEmailFormData(dataObj).then(function(obj){
						//	console.log("callback post", obj);
							var dataObj = {};
							dataObj.messageStr = obj.messageStr;
							var successBln = obj.successBln;
							if(successBln == false){
								validator.showErrors({
									  "email": dataObj.messageStr
									});
							}	
			    		});
			    		
			    		return true;
		    		});
	    		
	    		var validator = $("#registerForm").validate({
	        		rules: {
	        		/*	phone:{
	        				phone: true
	        			},	*/
	        			username: {
				            required: true,
				            checkUsername: true
			    		},
	        			firstname: "required",
	        			lastname: "required",
	        		//	address: "required",
	        		//	country: "required",
	        		//	city: "required",
	        		//	state: "required",
	        		//	zip: "required",
	        			password: "required",
	        		//	password2: "required",
	        			email: {
	        			      required: true,
	        			      email: true,
	        			      checkEmail: true
	        			}
	        		},
	        		messages: {
	        			username: {
	        				required: "Please enter a username"
	        			},	 
	        			firstname: "Please enter your first name",
	        			lastname: "Please enter your last name",
	        		//	address: "Please enter your address",
	        		//	country: "Please enter your country",
	        		//	city: "Please enter your city",
	        		//	state: "Please enter your state",
	        		//	zip: "Please enter your zip/postal code",
	        		//	phone: "Please enter a valid phone number",
	        			password: "Please enter a password",
	        		//	password2: "Please re-enter your password",
	        			email: {
	        				required: "Please enter a E-mail address",
	       				    email: "Please enter a valid E-mail address"
	        			}
	        		}
	        	});
	    		
	    	};
	    	
	    	var verfiyBeforeSubmit = function(){
	    	//	console.log("verfiyBeforeSubmit");
	    		return $("#registerForm").valid();
	    	};
	    	
	    	var formSubmittedSuccess = function(obj){
	    	//	console.log("formSubmittedSuccess");
	  		  	$scope.$broadcast('formSubmittedBln', obj); 
	    	};
			
	    	var destroy = function(){
	    	//	console.log("destroy");
	    		$('#registerForm').data('validator', null);
	    		$("#registerForm").unbind('validate');
	    	
	    	};
	    	

	    	setupVerification();
	    	$scope.loadingEnd();

		
    }]);
});
