define(['./module'], function (directives) {
    'use strict';
    directives.directive('primaryBackgroundImgToggle', [ '$rootScope', function ($rootScope) {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	var removeClasses = function(){
            		$(element).removeClass("small");
            		$(element).removeClass("large");
            	};
            
            	scope.$on('showPrimaryBackground', function(event, obj){
            		element.addClass("active");
            		removeClasses();
            		if(obj.largeBln != undefined && obj.largeBln == false){
            			$(element).addClass("small");
            		}else{
            			$(element).addClass("large");	
            		}
            	});
            	
            	scope.$on('hidePrimaryBackground', function(){
            		$(element).removeClass("active");
            		removeClasses();
            		
            		
            	});
            	
            }
        };
    }]);
    
});

