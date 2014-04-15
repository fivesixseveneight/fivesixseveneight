define(['./module'], function (directives) {
    'use strict';
    directives.directive('navHover', [function () {
        return {
            restrict: "A",
            scope:{},
            link: function(scope, element, attrs){
            	$(element).bind("mouseenter", function(){
            		element.addClass("hover"); 
            	});
            	$(element).bind("mouseleave", function(){
            		$(element).removeClass("hover"); 
            	});
            }
        };
    }]);
    
});
