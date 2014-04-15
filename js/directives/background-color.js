define(['./module'], function (directives) {
    'use strict';
    directives.directive('backgroundColor', [ function () {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	$(element).css("background-color", "#"+attrs.backgroundColor);
            }
        };
    }]);
    
});
