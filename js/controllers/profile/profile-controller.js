define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('profileController', ['$scope','$rootScope', '$stateParams', function ($scope, $rootScope, $stateParams) {

    	$scope.pageContent = {};
    	
    	$scope.userObj = {};
    	
      	$scope.userObj.usernameStr = "username";
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
    	
    	var init = function(){
    	//  console.log("init");
    		setup();
    	};
    	
    	var setup = function(){
    	// console.log("setup");
    		$scope.userObj.userIdNum = $rootScope.userObj.userIdNum;
    		
    	};
    	
    	init();
    	
    	$scope.loadingEnd();
    }]);
});
