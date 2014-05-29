define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('activateregistrationController', ['$scope','$rootScope', '$state', '$stateParams', 'activateAccountPost', 'updateSessionPost', function ($scope, $rootScope, $state, $stateParams, activateAccountPost, updateSessionPost) {
     	
    	$scope.pageContent = {};
    	$scope.messageStr = "";
    	var activationIdNum;
    	
       	$scope.$on('$destroy', function() {
        //  console.log("destroy scope");
            destroy();
        });
       	
    	var init = function(){
    	//	console.log("init", $stateParams);
    		setup();
    		checkActivation();
    		$scope.loadingEnd();
    	};
    	
    	var setup = function(){
    	//	console.log("setup");
    		activationIdNum = $stateParams.id;
    		$scope.messageStr = "Activating your account...";
       	};
    	
       	var checkActivation = function(){
       	//	console.log("checkActivation");
       		if(activationIdNum == "" || $rootScope.userObj.activatedBln != "0"){
        		$state.transitionTo("root.primary.overview");
        		return;
        	}
       		activateAccount();
       	};
       	
       	
        var activateAccount = function(){
        //	console.log("activateAccount");
        	var dataObj = {
        			activationIdNum: activationIdNum
			};
			
        	activateAccountPost.postActivateAccountData(dataObj).then(function(obj){
			//	console.log("callback post", obj);
				if(obj.successBln){
					activateAccountSuccess();
	        	}else{
	        		activateAccountFailed(obj);
	        	}
			});
        };
        	
        var activateAccountSuccess = function(){
        //	console.log("activateAccountSuccess");
        	$scope.messageStr = "Thank you for activating your account.";
        	// need to update 
        	updateUserSession();
        };
        
       //event handler for updating the user session
    	var updateUserSession = function(){
    	//	console.log("updateUserSession");
    		var dataObj = {
					userIdNum: $rootScope.userObj.userIdNum
			};
			
    		updateSessionPost.postUpdateSessionData(dataObj).then(function(obj){
			//	console.log("callback post", obj);
				$rootScope.userObj = obj.userSessionObj;
				updateUserSessionSuccess();
			});
    	};
    	
    	var updateUserSessionSuccess = function(){
    	//	console.log("updateUserSessionSuccess", $rootScope.userObj);
        };

        var activateAccountFailed = function(obj){
        //	console.log("activateAccountFailed");
        	$scope.messageStr = obj.messageStr;
        	updateUserSession();
        };
        
    	var destroy = function(){
    	//	console.log("destroy");
    	};
	
    	init();
    	
    }]);
});
