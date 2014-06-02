define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('editProfileController', ['$scope','$rootScope', '$state' ,'$stateParams', 'getEditUserProfile', function ($scope, $rootScope, $state, $stateParams, getEditUserProfile) {

    	$scope.pageContent = {};
    	$scope.dataObj;

    	$scope.tokenStr = "";
    	
    	$scope.permissionBln = false;
    	
    	
    	$scope.saveProfile = function(){
    		console.log("save profile");
    	};
    	
    	$scope.$on('$destroy', function() {
        //  console.log("destroy scope");
            destroy();
        });
    		
    	
    	var init = function(){
    	//console.log("init");
    		setup();
    		checkPermission();
    		if($scope.permissionBln){
    			parseData();
    		}
    		$scope.loadingEnd();
    	};
    	
    	var setup = function(){
    	// console.log("setup");
    		$scope.dataObj = getEditUserProfile.data;
    		$scope.permissionBln = $scope.dataObj.permissionBln;
    		$scope.userObj = $scope.dataObj.userObj;
    	};
    	
    	var checkPermission = function(){
    		if(!$scope.permissionBln){
    			//redirect
    	    	$state.transitionTo("root.primary.profile", {id: $stateParams.id});
    		}
    	};
    	
    	var parseData = function(){
    		console.log("parseData", $scope.userObj);

        	$scope.userObj.locationsArr;
        	$scope.userObj.marketsArr;
        	
        	$scope.userObj.audienceStr;
        	$scope.userObj.bioStr;
        	$scope.userObj.supportStr;
        	
        	$scope.userObj.userIdNum;
        	$scope.userObj.useraccountIdNum;
        	$scope.userObj.profilePicStr;
        	
    		$scope.userObj.usernameStr;
        	$scope.userObj.firstnameStr;
        	$scope.userObj.lastnameStr;
        	$scope.userObj.websiteStr;

    		$scope.userObj.companyObj;
    		$scope.userObj.facebookObj;
    		$scope.userObj.googleplusObj;
    		$scope.userObj.instagramObj;
    		$scope.userObj.pinterestObj;
    		$scope.userObj.vineObj;
    		$scope.userObj.youtubeObj;
    	};
    	
    	var destroy = function(){
	    //	console.log("destroy");
    		
	    };
	    
    	init();
    	
    }]);
});
