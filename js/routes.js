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
    			'@' :{
    				templateUrl: 'partials/primary.html',
     	            controller: 'primaryController'
    			}
    		},
    		resolve:{
    			checkSession: (["$q", "$http",function($q, $http){         
            		var deferred = $q.defer();
            		return $http({method: 'POST', url: "/api/isLoggedIn"}).then(function (obj) {
            			 deferred.resolve();
                         return obj.data;
                    });
            		return deferred.promise;
            	}])
    		}
        }).state('root.primary', {
    		views:{
    			'header' :{
		            templateUrl: 'partials/header.html',
		            controller: 'headerController'
				},
				'footer' :{
					templateUrl: 'partials/footer.html',
	 	            controller: 'footerController'
				}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.home', {
    		url: '/home',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/home.html',
    		          controller: 'homeController'
    			}
    		},
    		resolve:{
    		
    		}
    	})    	
    	.state('root.primary.about', {
    		url: '/about',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/about.html',
    		          controller: 'homeController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.login', {
    		url: '/login',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/login.html',
    		          controller: 'loginController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.logout', {
    		url: '/logout',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/logout.html',
    		          controller: 'logoutController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.register', {
    		url: '/register',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/register.html',
    		          controller: 'registerController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.confirmregistration', {
    		url: '/confirmregistration',
    		views:{
    			"mainView@root":{
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