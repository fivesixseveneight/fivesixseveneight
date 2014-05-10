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
    	}).state('root.logout', {
    		url: '/logout',
    		views:{
    			"mainView@":{
    				  templateUrl: 'partials/logout.html',
    		          controller: 'logoutController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.register', {
    		url: '/register',
    		views:{
    			"mainView@":{
    				  templateUrl: 'partials/register.html',
    		          controller: 'registerController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.confirmregistration', {
    		url: '/confirmregistration',
    		views:{
    			"mainView@":{
    				  templateUrl: 'partials/confirmregistration.html',
    		          controller: 'confirmregistrationController'
    			}
    		},
    		resolve:{
    		
    		}
    	});

    	
    	$urlRouterProvider.otherwise('home');
    	
    }]);
});