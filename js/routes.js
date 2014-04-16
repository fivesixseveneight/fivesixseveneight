/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */
define(['./app'], function (app) {
    'use strict';
    return app.config(['$stateProvider','$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    	
    	
    	$stateProvider.state('root', {
    		url: '',
    		views:{
    			'header@' :{
    	            templateUrl: 'partials/header.html',
    	            controller: 'headerController'
    			},
    			'footer@' :{
    				templateUrl: 'partials/footer.html',
     	            controller: 'footerController'
    			},
    			"mainView@":{
  				  templateUrl: 'partials/home.html',
  		          controller: 'homeController'
    			}
    		},
    		resolve:{
    		
    		}
        }).state('root.home', {
    		url: '/home',
    		views:{
    			"mainView@":{
    				  templateUrl: 'partials/home.html',
    		          controller: 'homeController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.about', {
    		url: '/about',
    		views:{
    			"mainView@":{
    				  templateUrl: 'partials/about.html',
    		          controller: 'homeController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.login', {
    		url: '/login',
    		views:{
    			"mainView@":{
    				  templateUrl: 'partials/login.html',
    		          controller: 'loginController'
    			}
    		},
    		resolve:{
    		
    		}
    	});

    	
    	$urlRouterProvider.otherwise('home');
    	
    }]);
});