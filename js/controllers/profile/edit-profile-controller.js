define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('editProfileController', ['$scope','$rootScope', '$state' ,'$stateParams', 'getEditUserProfile', function ($scope, $rootScope, $state, $stateParams, getEditUserProfile) {

    	$scope.pageContent = {};
    	$scope.dataObj;
    	$scope.userObj = {};
    	$scope.tokenStr = "";
    	
    	$scope.permissionBln = false;
    	
    	$scope.aboutObj = {};
    	$scope.aboutObj.aboutStr = "I am this and that";
    	$scope.aboutObj.supportStr = "I support manufacturing and retail";
    	$scope.aboutObj.audienceStr = "My audience includes auto industry";
    	$scope.aboutObj.locationsStr = "";
    	$scope.aboutObj.marketsStr = "";
    	
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
    	
    	var destroy = function(){
	    //	console.log("destroy");
    		
	    };
	    
    	init();
    	
    }]);
});
