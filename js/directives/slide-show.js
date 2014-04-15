define(['./module'], function (directives) {
    'use strict';
    directives.directive('slideShow', ['$rootScope', function ($rootScope) {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	var slideCountNum = 0;
            	var slideLimitNum = scope.projectImagesArr.length-1;
            	
            	// sets the interval for the slideshow
            	scope.setSlideShowInterval = function(){
            		scope.slideShowInterval = setInterval(function(){
            			$(element).addClass("active");
            			scope.changeImage();
                		clearSlideShowInterval();
                		scope.setSlideShowInterval();
                	}, 5000);
            	};
            	// change the image of the slideshow
            	scope.changeImage = function(){
         			slideCountNum++;
        			if(slideCountNum > slideLimitNum){
        				slideCountNum = 0;
        			}
        			scope.slideShowPathStr = scope.projectImagesArr[slideCountNum] ;
        			scope.$apply();
            	};
            	// clears the interval
            	var clearSlideShowInterval = function(){
            		clearInterval(scope.slideShowInterval);	
            	};
            	// when the view is recycled use this as a destroy function
            	$rootScope.$on('$stateChangeStart', function(){
            		clearSlideShowInterval();
            		slideCountNum = undefined;
            		slideLimitNum = undefined;
            	});
            	// start the slide show
            	
            	scope.setSlideShowInterval();
            },
		    template: 	"<div class='slide-show-wrapper'>"+
		    			"<div class='project-enlarge-wrapper'></div>"+
						"<div class='fake-img-height'></div>"+
						"<div class='project-img-wrapper'>"+
						"<img class='project-img'  ng-src='{{slideShowPathStr}}'/>"+
						"</div>"+
						"</div>"+
						"<div class='slide-show-loading-wrapper loading-img' ></div>"
        };
    }]);

});
