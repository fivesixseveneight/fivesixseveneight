define(['./module'], function (directives) {
    'use strict';
    directives.directive('formSubmittedBln', [ '$rootScope', function ($rootScope) {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	
            	var messageStr = "";
            	
            	scope.$on("formSubmittedBln", function(event, obj){
            	//	console.log("formSubmittedBln", obj);
            		messageStr = obj.messageStr;
            		closeSlider();
            	}, true);

            	var closeSlider = function(){
            	//	console.log("closeSlider");
            		
            		$(element).slideUp("slow",function(){
            			updatePageContent();
    				});  
            	};
            	
            	var updatePageContent = function(){
            	//	console.log("updatePageContent");
            		var htmlStr = "";
            		htmlStr += "<div class='form-submitted-bln'>";
            		htmlStr += messageStr;
            		htmlStr += "</div>";
            		$(element).html(htmlStr);
            		$(element).slideDown("slow");
            	};
            	
            	
            	
            }
        };
    }]);

});
