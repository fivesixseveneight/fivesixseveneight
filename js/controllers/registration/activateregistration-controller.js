define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('activateregistrationController', ['$scope','$rootScope', '$state', '$stateParams', 'activateAccountPost', function ($scope, $rootScope, $state, $stateParams, activateAccountPost) {
     	
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
    		activateAccount();
    		$scope.loadingEnd();
    	};
    	
    	var setup = function(){
    	//	console.log("setup");
    		activationIdNum = $stateParams.id;
    		$scope.messageStr = "Activating your account.";
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
        };
        
        var activateAccountFailed = function(obj){
        //	console.log("activateAccountFailed");
        	$scope.messageStr = obj.messageStr;
        };
        
    	var destroy = function(){
    	//	console.log("destroy");
    	};
	
    	init();
    	
    }]);
});
