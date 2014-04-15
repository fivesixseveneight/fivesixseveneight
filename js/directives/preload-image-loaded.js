define(['./module'], function (directives) {
    'use strict';
    directives.directive('preloadImageLoaded', [ '$rootScope', function ($rootScope) {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	$(element).bind('load', function() {
                 // console.log('image is loaded', element);
        	    	$rootScope.$broadcast('imageLoaded', {imgStr: $(element).src}); 
                });
            }
        };
    }]);
    
});

