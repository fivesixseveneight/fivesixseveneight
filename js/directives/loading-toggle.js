define(['./module'], function (directives) {
    'use strict';
    directives.directive('loadingToggle', [ function () {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	var transitionTimeNum = attrs.loadingToggle;
            	var transitionConvertedNum = transitionTimeNum/1000;
            	$(element).css({
            		transition: 'all '+transitionConvertedNum+'s ease 0s'
            	});
            	scope.$on("toggle-load", function(event, dataObj){
            		if(dataObj.activeBln){
            		//	console.log("loadingToggle toggle load ON");
            		//	$(element).addClass("active");	
            			$("html").css('overflow','hidden');
            		}else{
            		//	console.log("loadingToggle toggle load OFF");
            			$(element).removeClass("active");
            			scope.initLoadBln = false;
            			setTimeout(function(){
            				$("html").css('overflow','auto');
            				$(element).remove();
            			},transitionTimeNum);
            		}
            	});
            }
        };
    }]);
    
});
