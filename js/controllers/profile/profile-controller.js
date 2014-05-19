define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('profileController', ['$scope','$rootScope', function ($scope, $rootScope) {

    	$scope.pageContent = {};
    	
    	$scope.userObj = {};
    	
    	$scope.editBln = false;
    	
      	$scope.userObj.usernameStr = "usrnm";
      	$scope.userObj.firstnameStr = "firstname";
      	$scope.userObj.lastnameStr = "lastname";
    	$scope.userObj.companyStr = "companyStr";
    	$scope.userObj.websiteStr = "websiteStr";
    	$scope.userObj.facebookStr = "facebookStr";
    	$scope.userObj.twitterStr = "twitterStr";
    	$scope.userObj.youtubeStr = "youtubeStr";
    	$scope.userObj.instagramStr = "instagramStr";
    	$scope.userObj.googleplusStr = "googleplusStr";
    	$scope.userObj.vineStr = "vineStr";
    	$scope.userObj.pinterestStr = "pinterestStr";
    	
    	$scope.userObj.activeCampaignNum = 4;
    	$scope.userObj.connectionsNum = 30;
    	$scope.userObj.lactActiveDate = "Dec 2 2014";
    	$scope.userObj.joinedDate = "Dec 1 2014";
    	
    	$scope.aboutObj = {};
    	
    	$scope.aboutObj.supportStr = "I support manufacturing and retail";
    	$scope.aboutObj.audienceStr = "My audience includes auto industry";
    	$scope.aboutObj.locationsStr = "";
    	$scope.aboutObj.marketsStr = "";
    	
    	
    	$scope.editProfile = function(){
    	//	console.log("edit profile");
    		$scope.editBln = true;
    		
    	};
    	
    	var init = function(){
    	// console.log("init");
    		setup();
    	
    	};
    	
    	var setup = function(){
    	// console.log("setup");
        		
    	};
    	
    	
    	
    	init();
    	
    	$scope.loadingEnd();
    }]);
});
