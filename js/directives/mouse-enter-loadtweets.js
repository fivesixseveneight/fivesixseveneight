define(['./module'], function (directives) {
    'use strict';
    directives.directive('mouseEnterLoadtweets', [function () {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	$(element).bind("mouseenter", function(){
            		scope.$apply(attrs.mouseEnterLoadtweets);
            	});
            }
        };
    }]);
});
