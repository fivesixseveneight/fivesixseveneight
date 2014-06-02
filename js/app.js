/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
    'angular',
    'angular-route',
    'angular-statehelper',
    'angular-animate',
    'angular-sanitize',
    'angular-slider',
    './controllers/index',
    './directives/index',
    './filters/index',
    './services/index',
    
], function (
		angular,
		angularRoute,
		angularStateHelper,
		angularAnimate, 
		angularSanitize, 
		angularSlider, 
		contollers,
		directives,
		filters,
		services) {
    'use strict';
    
   var app = angular.module('app', ['app.controllers','app.directives','app.filters', 'app.services', 'ui.router', 'ui.router.stateHelper','ngAnimate', 'ngSanitize', 'ngSlider', 'ui.bootstrap']);
	   
   	app.config([ '$locationProvider', function($locationProvider){
	           $locationProvider.html5Mode(false);
	       }
	   ]).run(['$q','$http', '$rootScope' , function($q, $http, $rootScope){
		   	/*
			var deferred = $q.defer();
		    $rootScope.userObj = {};
	    	$rootScope.isLoggedInBln = false;
	    	$http({method: 'POST', url: '/api/isLoggedIn'}).success(function(obj, status, headers, config) {
	    	//	console.log("check isLoggedInBln successful");
	    		$rootScope.isLoggedInBln = obj.data.userSessionObj.loggedInBln;
	    		if($rootScope.isLoggedInBln == true){
	    			$rootScope.userObj = obj.data.userSessionObj;	
	    			console.log("user session: ", $rootScope.userObj);
	    		}else{
	    			console.log("user has session: ", $rootScope.isLoggedInBln);	
	    		}
	    		 deferred.resolve();
	    	});
	    	
	    	return deferred.promise;
	    	*/
		   
	   }]);
    return app;
});
