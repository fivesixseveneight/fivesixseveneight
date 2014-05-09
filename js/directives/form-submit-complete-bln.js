define(['./module'], function (directives) {
    'use strict';
    directives.directive('formSubmitCompleteBln', [ '$rootScope', function ($rootScope) {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	
            	var messageStr = "";
            	
            	scope.$on("formSubmittedBln", function(event, obj){
            	//	console.log("formSubmittedBln", obj);
            		 $(element).prop('disabled', false);
            	}, true);

            	
            }
        };
    }]);

});
