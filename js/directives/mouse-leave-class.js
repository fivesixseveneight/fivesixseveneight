define(['./module'], function (directives) {
    'use strict';
    directives.directive('mouseLeaveClass', [function () {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	$(element).bind("mouseleave", function(){
            		$(element).removeClass(attrs.mouseLeaveClass);
            	});
            }
        };
    }]);

});
