define(['./module'], function (directives) {
    'use strict';
    directives.directive('windowResize', [ '$window','$rootScope',function ($window, $rootScope) {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	
            	var windowResized = function() {
            	//   console.log("windowResized");
            		$rootScope.windowWidth = window.innerWidth;
            		$rootScope.windowheight = window.innerHeight;
            		if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
            			scope.$apply();
            		}
            		$rootScope.$broadcast('windowResized');
            	};
            	//first call of tellAngular when the dom is loaded
            	document.addEventListener("DOMContentLoaded", windowResized, false);
            	// gets initial window size
            	windowResized();
            	
            	//calling tellAngular on resize event
            	window.onresize = windowResized;

            }
        };
    }]);
    
});
