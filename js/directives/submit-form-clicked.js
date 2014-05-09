define(['./module'], function (directives) {
    'use strict';
    directives.directive('submitFormClicked', [function () {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	scope.$on("formProcessingBln", function(){
                //	console.log("formProcessingBln");
                	handleProcessing();
                }, true);
            	
            	var handleProcessing = function(){
            	//	  console.log("handleProcessing");
            	//	 $(element).html('');
            		 $(element).prop('disabled', true);
            	};
            	
            }
        };
    }]);
});
