/*
 * This directive creates a youtube module
 * */
define(['./module'], function (directives) {
    'use strict';  
    directives.directive('newsletterSignupModule', ['$compile', '$http', '$rootScope', 'newsLetterFormPost', function ($compile, $http, $rootScope, newsLetterFormPost) {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            //	console.log("newsletterSignupModule");
            	scope.email;
            	scope.firstName;
            	scope.lastName;
            	scope.name2;
            	scope.newsletterSubmit = function(){
            	//	 console.log("newsletterSubmit");
            		 if(verfiyBeforeSubmit()){
    	    		//	console.log('setup ajax request');
    	    			postFormData();
    	    		}
            	};

            	var setupVerification = function(event ){
            	//	console.log("setupVerification");
            		$("#newsletterForm").submit(false);
            		$("#newsletterForm").validate({
                		rules: {
                			email: {
                			      required: true,
                			      email: true
                			},
                			firstName: "required",
                        	lastName: "required"
                		},
                		messages: {
                			email: "Please enter a valid e-mail",
                			firstName: "Please enter your first name",
                			lastName: "Please enter your last name"
                		}
                	});
            	};
            	
            	var verfiyBeforeSubmit = function(){
                //	console.log("verfiyBeforeSubmit");
                	return $("#newsletterForm").valid();
                };
            	
            	// this function obtains all the videos for a given playlist
            	var postFormData = function(){
        		//	console.log('postFormData');
        			var dataObj = {
        					email: scope.email,
        					firstName: scope.firstName,
        					lastName: scope.lastName,
        					name2: scope.name2
        			};
        			scope.$broadcast('formProcessingBln');
        			newsLetterFormPost.postNewsletterFormData(dataObj).then(function(obj){
        			//	console.log("callback post", obj);
        				var dataObj = {};
        				dataObj.messageStr = obj.messageStr;
        				formSubmittedSuccess(dataObj);
        			});
        		};
        		
                var formSubmittedSuccess = function(obj){
            	//	console.log("formSubmittedSuccess");
          		  	scope.$broadcast('formSubmittedBln', obj); 
            	};   
            	
            	scope.$on('$destroy', function() {
        	    //    console.log("destroy scope");
            		destroy();
        	    });
            	
    			var destroy = function(){
    			//	console.log("destroy");
	
    			};
    			setupVerification();
            },
            replace: true,
            template: 	'<form id="newsletterForm" form-submitted-bln ng-submit="newsletterSubmit()" action="" method="post">'+
				            '<div class="form-group">'+
            				'<input class="form-control" ng-model="email" type="text" name="email" placeholder="E-mail">'+
				            '</div>'+
				            '<div class="form-group">'+
            				'<input class="form-control" ng-model="firstName" type="text" name="firstName" placeholder="First name">'+
            				 '</div>'+
            				 '<div class="form-group">'+
				            '<input class="form-control" ng-model="lastName" type="text" name="lastName" placeholder="Last name">'+
				            '</div>'+
				            '<div id="newsletterInput" class="form-group">'+
				            '<input class="form-control" ng-model="name2" type="text" name="name2" placeholder="name">'+
				            '</div>'+
                			'<button type="submit" submit-form-clicked class="submit btn btn-lg">Submit</button>'+
                		'</form>'
        };
    }]);
   

    
});


