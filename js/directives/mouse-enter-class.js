define(['./module'], function (directives) {
    'use strict';
    directives.directive('mouseEnterClass', [function () {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	$(element).bind("mouseenter", function(){
            		$(element).addClass(attrs.mouseEnterClass);
            	});
            }
        };
    }]);

});
