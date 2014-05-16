/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */
define(['./app'], function (app) {
    'use strict';
    return app.config(['$stateProvider','$urlRouterProvider', 'stateHelperProvider', function ($stateProvider, $urlRouterProvider, stateHelperProvider) {
    	
    	$stateProvider.state('root', {
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
    	}).state('root.home', {
    		url: '/home/',
    		views:{
    			"@":{
    				  templateUrl: 'partials/home.html',
    		          controller: 'homeController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.overview', {
    		url: '/overview/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/overview.html',
    		          controller: 'overviewController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.campaign', {
    		url: '/campaign/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/campaign.html',
    		          controller: 'campaignController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.reporting', {
    		url: '/reporting/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/reporting.html',
    		          controller: 'reportingController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.users', {
    		url: '/users/',
    		abstract: true,
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/users.html',
    		          controller: 'usersController'
    			}
    		},
    		resolve:{

    		}
    	}).state('root.primary.users.advertisers', {
    		url: 'advertisers/',
    		views:{
    			"usersView@root.primary.users":{
    				  templateUrl: 'partials/findadvertisers.html',
    		          controller: 'findadvertisersController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.users.publishers', {
    		url: 'publishers/',
    		views:{
    			"usersView@root.primary.users":{
    				  templateUrl: 'partials/findpublishers.html',
    		          controller: 'findpublishersController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.profile', {
    		url: '/profile/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/profile.html',
    		          controller: 'profileController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.notifications', {
    		url: '/notifications/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/notifications.html',
    		          controller: 'notificationsController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.messages', {
    		url: '/messages/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/messages.html',
    		          controller: 'messagesController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.settings', {
    		url: '/settings/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/settings.html',
    		          controller: 'settingsController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.tools', {
    		url: '/tools/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/tools.html',
    		          controller: 'toolsController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.funds', {
    		url: '/funds/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/funds.html',
    		          controller: 'fundsController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.about', {
    		url: '/about/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/about.html',
    		          controller: 'aboutController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.jobs', {
    		url: '/jobs/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/jobs.html',
    		          controller: 'jobsController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.help', {
    		url: '/help/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/help.html',
    		          controller: 'helpController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.terms', {
    		url: '/terms/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/terms.html',
    		          controller: 'termsController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.admin', {
    		url: '/admin/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/admin.html',
    		          controller: 'adminController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.flagged', {
    		url: '/flagged/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/flagged.html',
    		          controller: 'flaggedController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.login', {
    		url: '/login/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/login.html',
    		          controller: 'loginController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.logout', {
    		url: '/logout/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/logout.html',
    		          controller: 'logoutController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.register', {
    		url: '/register/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/register.html',
    		          controller: 'registerController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.confirmregistration', {
    		url: '/confirmregistration/',
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
    	$urlRouterProvider.when('/users', '/users/advertisers');
    	$urlRouterProvider.when('/users/', '/users/advertisers');
    	$urlRouterProvider.when('/users', '/users/publishers');
    	$urlRouterProvider.when('/users/', '/users/publishers');
    	
        $urlRouterProvider.rule(function($injector, $location) {
            var path = $location.path()
              // Note: misnomer. This returns a query object, not a search string
              , search = $location.search()
              , params
              ;

            // check to see if the path already ends in '/'
            if (path[path.length - 1] === '/') {
              return;
            }

            // If there was no search string / query params, return with a `/`
            if (Object.keys(search).length === 0) {
              return path + '/';
            }

            // Otherwise build the search string and return a `/?` prefix
            params = [];
            angular.forEach(search, function(v, k){
              params.push(k + '=' + v);
            });
            return path + '/?' + params.join('&');
          });
        
    }]);
});