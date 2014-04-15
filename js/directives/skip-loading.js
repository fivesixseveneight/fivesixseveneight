define(['./module'], function (directives) {
    'use strict';
    directives.directive('skipLoading', [function () {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	$(element).bind("click", function(){
            		scope.loadingEnd();
            	});
            }
        };
    }]);
    
});
