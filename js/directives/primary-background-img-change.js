define(['./module'], function (directives) {
    'use strict';
    directives.directive('primaryBackgroundImgChange', [ '$rootScope', function ($rootScope) {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	scope.$on('updatedBackgroundImages', function(){
            		scope.updatedBackgroundImages();
            	});
            	
             	scope.$on('allImageLoaded', function(){
             		scope.changeImage();
            	});
            	
            	scope.$on('showPrimaryBackground', function(event, obj){
            		scope.changeImage();
            		scope.pageTitleStr = obj.titleStr;
            	});
            	scope.$on('hidePrimaryBackground', function(){
            		
            	});
            	
            	var slideCountNum = 0;
            	var slideLimitNum = scope.backgroundImagesArr.length-1;
        		if(slideLimitNum<0){
        			slideLimitNum = 0;
        		}
        		
            	scope.updatedBackgroundImages = function(){
            		slideLimitNum = scope.backgroundImagesArr.length-1;
            	};
            	
            	
            	// change the image of the background
            	scope.changeImage = function(){
            		if(slideLimitNum == 0){
            			console.log('no background images found, a waiting for it to load');
            			return;
            		}
         			slideCountNum++;
        			if(slideCountNum > slideLimitNum){
        				slideCountNum = 0;
        			}
        			scope.primaryBackgroundPathStr = scope.backgroundImagesArr[slideCountNum] ;
        			
        			
            	};
            },
            replace: true,
            template: 	"<div>" +
            			"<img class='primary-background-img-toggle' ng-src='{{primaryBackgroundPathStr}}'/>"+
            				"<div class='page-title-wrapper'>" +
            					/*
		            			"<div class='keyline'></div>"+
		            				"<div class='page-title-decoration-wrapper-top'></div>"+
		            			"<div class='keyline'></div>"+
		            				*/
		            				"<div class='page-title'>{{pageTitleStr}}</div>"+
		            				/*
		            			"<div class='keyline'></div>"+	
		            				"<div class='page-title-decoration-wrapper-bottom'></div>"+
		            			"<div class='keyline'></div>"+
		            			*/
	            			"</div>"+   
            			"</div>"
        };
    }]);
    
});

