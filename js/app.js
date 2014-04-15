/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
    'angular',
    'angular-route',
    'angular-animate',
    'angular-sanitize',
    './controllers/index',
    './directives/index',
    './filters/index',
    './services/index',
    
], function (
		angular,
		angularRoute, 
		angularAnimate, 
		angularSanitize, 
		contollers,
		directives,
		filters,
		services) {
    'use strict';
    
   var app = angular.module('app', ['app.controllers','app.directives','app.filters', 'app.services', 'ui.router', 'ngAnimate', 'ngSanitize']);
	   
   	app.config([ '$locationProvider', function($locationProvider){
	           $locationProvider.html5Mode(false);
	       }
	   ]);
    return app;
});
