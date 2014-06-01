define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('editProfileController', ['$scope','$rootScope', '$stateParams', function ($scope, $rootScope, $stateParams) {


    	$scope.pageContent = {};
    	
    	$scope.userObj = {};
    	
    	$scope.editBln = false;
    	
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
    	
    	
    	$scope.aboutObj = {};
    	
    	$scope.aboutObj.aboutStr = "I am this and that";
    	
    	$scope.aboutObj.supportStr = "I support manufacturing and retail";
    	$scope.aboutObj.audienceStr = "My audience includes auto industry";
    	$scope.aboutObj.locationsStr = "";
    	$scope.aboutObj.marketsStr = "";
    	
    	$scope.editProfile = function(){
        		console.log("edit profile");
        		$scope.editBln = true;
        		
    	};
        
    	
    	$scope.saveProfile = function(){
        		console.log("save profile");
        		$scope.editBln = false;
        		
    	};
    	
    	var init = function(){
    	console.log("init", $stateParams);
    		setup();
    	
    	};
    	
    	var setup = function(){
    	// console.log("setup");
    		
    	};
    	
    	init();
    	
    	$scope.loadingEnd();
    	
    	
    }]);
});
