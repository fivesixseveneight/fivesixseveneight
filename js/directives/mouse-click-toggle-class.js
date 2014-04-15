define(['./module'], function (directives) {
    'use strict';
    directives.directive('mouseClickToggleClass', [function () {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	$(element).bind("click", function(){
            		if($(element).hasClass(attrs.mouseClickToggleClass)){
                		$(element).removeClass(attrs.mouseClickToggleClass);
            		}else{
                		$(element).addClass(attrs.mouseClickToggleClass);
            		}
            	});
            }
        };
    }]);

});
