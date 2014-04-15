define(['./module'], function (directives) {
    'use strict';
    directives.directive('loadingViewToggle', [ function () {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
             	var transitionTimeNum = attrs.transTime;
             	// var transitionInitTimeNum = attrs.initTime;

            	var transitionConvertedNum = transitionTimeNum/1000;
            	$(element).css({
            		transition: 'all '+transitionConvertedNum+'s ease 0s'
            	});

            	scope.$on("toggle-load", function(event, dataObj){
            		if(dataObj.activeBln){
            		//	console.log("loadingViewToggle toggle load ON");
            			turnOff();
            		}else{
            		//	console.log("loadingViewToggle toggle load OFF");
            			turnOn();
            		}
            	});
            	
            	var timeOutObj;
            	var turnOff = function(){
            	//	console.log("turnOff");
            		$(element).css({
                		opacity: '0'
                	});
            		clearTimeout(timeOutObj);
            		timeOutObj = setTimeout(function(){
            			$(element).hide();
        			},transitionTimeNum);
            	};
            	
               	var turnOn = function(){
            	//	console.log("turnOn");
            		$(element).show();
            		clearTimeout(timeOutObj);
            		setTimeout(function(){
            			$(element).css({
                    		opacity: '1'
                    	});
        			},transitionTimeNum);
            	};
            	
            	
            	
            }
        };
    }]);
    
});
