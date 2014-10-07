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
    				  templateUrl: 'partials/home/home.html',
    		          controller: 'homeController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.overview', {
    		url: '/overview/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/overview/overview.html',
    		          controller: 'overviewController'
    			}
    		},
    		resolve:{
    		
    		}
    	})
    	
    	
    	/*
    	.state('root.primary.campaign', {
    		url: '/campaign/',
    		abstract: true,
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/campaign/campaign.html',
    		          controller: 'campaignController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.campaign.mycampaigns', {
    		url: 'mycampaigns/',
    		views:{
    			"campaignOptionWrapper@root.primary.campaign":{
    				  templateUrl: 'partials/campaign/mycampaigns.html',
    		          controller: 'mycampaignsController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.campaign.newcampaign', {
    		url: 'newcampaign/',
    		views:{
    			"campaignOptionWrapper@root.primary.campaign":{
    				  templateUrl: 'partials/campaign/newcampaign.html',
    		          controller: 'newcampaignController'
    			}
    		},
    		resolve:{
    		
    		}
    	})
    	.state('root.primary.campaign.search', {
    		url: 'search/',
    		views:{
    			"campaignOptionWrapper@root.primary.campaign":{
    				  templateUrl: 'partials/campaign/searchcampaigns.html',
    		          controller: 'searchcampaignsController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.campaign.requests', {
    		url: 'requests/',
    		views:{
    			"campaignOptionWrapper@root.primary.campaign":{
    				  templateUrl: 'partials/campaign/requestscampaigns.html',
    		          controller: 'campaignrequestsController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.reporting', {
    		url: '/reporting/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/reporting/reporting.html',
    		          controller: 'reportingController'
    			}
    		},
    		resolve:{
    		
    		}
    	})
    	*/
    	
    	
    	.state('root.primary.users', {
    		url: '/users/',
    		abstract: true,
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/users/users.html',
    		          controller: 'usersController'
    			}
    		},
    		resolve:{

    		}
    	}).state('root.primary.users.advertisers', {
    		url: 'advertisers/',
    		views:{
    			"subFilterView@root.primary.users":{
  				  templateUrl: 'partials/users/findadvertisers.html',
  		          controller: 'findadvertisersController'
    			},
    			"usersfoundView@root.primary.users":{
  				  templateUrl: 'partials/users/foundadvertisers.html',
  		          controller: 'foundadvertisersController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.users.publishers', {
    		url: 'publishers/',
    		views:{
    			"subFilterView@root.primary.users":{
    				  templateUrl: 'partials/users/findpublishers.html',
    		          controller: 'findpublishersController'
    			},
    			"usersfoundView@root.primary.users":{
    				  templateUrl: 'partials/users/foundpublishers.html',
    		          controller: 'foundpublishersController'
      			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.profile', {
    		url: '/profile/:id/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/profile/profile.html',
    		          controller: 'profileController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.profile.edit', {
    		url: 'edit/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/profile/editProfile.html',
    		          controller: 'editProfileController'
    			}
    		},
    		resolve:{
    			getEditUserProfile: (["$q", "$http", "$stateParams", function($q, $http, $stateParams){         
            		var deferred = $q.defer();
            		return $http({method: 'POST', url: "/api/get-edit-profile", data:{userIdNum: $stateParams.id}
		        	    }).then(function (obj) {
	        			 deferred.resolve();
	                     return obj.data;
                    });
            		return deferred.promise;
            	}])
    		}
    	}).state('root.primary.notifications', {
    		url: '/notifications/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/notifications/notifications.html',
    		          controller: 'notificationsController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.messages', {
    		url: '/messages/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/messages/messages.html',
    		          controller: 'messagesController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.settings', {
    		url: '/settings/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/settings/settings.html',
    		          controller: 'settingsController'
    			}
    		},
    		resolve:{
    		
    		}
    	})
    	
    	
    	/*
    	
    	.state('root.primary.tools', {
    		url: '/tools/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/tools/tools.html',
    		          controller: 'toolsController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.funds', {
    		url: '/funds/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/funds/funds.html',
    		          controller: 'fundsController'
    			}
    		},
    		resolve:{
    		
    		}
    	})
    	*/
    	
    	.state('root.primary.about', {
    		url: '/about/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/about/about.html',
    		          controller: 'aboutController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.jobs', {
    		url: '/jobs/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/jobs/jobs.html',
    		          controller: 'jobsController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.help', {
    		url: '/help/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/help/help.html',
    		          controller: 'helpController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.terms', {
    		url: '/terms/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/terms/terms.html',
    		          controller: 'termsController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.admin', {
    		url: '/admin/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/admin/admin.html',
    		          controller: 'adminController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.flagged', {
    		url: '/flagged/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/flagged/flagged.html',
    		          controller: 'flaggedController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.login', {
    		url: '/login/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/login/login.html',
    		          controller: 'loginController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.forgotpassword', {
    		url: '/forgotpassword/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/login/forgotpassword.html',
    		          controller: 'forgotpasswordController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.recoverpassword', {
    		url: '/recoverpassword/:id/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/login/recoverpassword.html',
    		          controller: 'recoverpasswordController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.logout', {
    		url: '/logout/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/logout/logout.html',
    		          controller: 'logoutController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.register', {
    		url: '/register/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/register/register.html',
    		          controller: 'registerController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.confirmregistration', {
    		url: '/confirmregistration/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/register/confirmregistration.html',
    		          controller: 'confirmregistrationController'
    			}
    		},
    		resolve:{
    		
    		}
    	}).state('root.primary.activateaccount', {
    		url: '/activateaccount/:id/',
    		views:{
    			"mainView@root":{
    				  templateUrl: 'partials/register/activateregistration.html',
    		          controller: 'activateregistrationController'
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
    	
    	$urlRouterProvider.when('/campaign', '/campaign/search');
    	$urlRouterProvider.when('/campaign/', '/campaign/search');
    	
    	
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