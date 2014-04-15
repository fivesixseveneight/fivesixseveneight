define(['./module'], function (directives) {
    'use strict';
    directives.directive('preloadImages', ['$rootScope', '$compile', function ($rootScope, $compile) {
        return {
            restrict: "A",
            link: function(scope, element, attrs){            	
            	scope.preloadedImagesArr = [];
            	scope.preloadedImageNum = 0;
            	scope.$on('preloadImages', function(event, obj){
            	//	console.log("preloadImages received");
            		scope.preloadImages(obj);
            	});
            	
        		scope.preloadImages = function(obj){
        		//	console.log("preloadImages processing", obj);
        			var imagesArr = obj.imagesArr;
        			var htmlStr;
        			for(var i in imagesArr){
        				if($.inArray(imagesArr[i], scope.preloadedImagesArr ) != -1){
            			//	console.log("already preloaded into array");
        				}else{
            			//	console.log("preloadeding into array");
        					scope.preloadedImagesArr.push(imagesArr[i]);
        					htmlStr = $compile( '<img preload-image-loaded ng-src="'+imagesArr[i]+'"/>')( scope );
            				$(element).append(htmlStr);
            				$rootScope.allImagesLoadedBln = false;
        				}
        			}
        		};
        		
        		//if an image is loaded it will check if all images are loaded
        		scope.$on('imageLoaded', function(event, obj){
               //console.log("imageLoaded received", obj.imgStr);
        			scope.preloadedImageNum++;
        			if(scope.checkImagesLoaded()){
        				scope.allImagesLoaded();
        			}
                });
        		
        		//if all images are loaded it will broadcast all images are loaded
        		scope.checkImagesLoaded = function(){
        			/*
        			console.log(scope.preloadedImageNum == scope.preloadedImagesArr.length);
        			console.log(scope.preloadedImageNum);
        			console.log(scope.preloadedImagesArr.length);
        			*/
        			return (scope.preloadedImageNum == scope.preloadedImagesArr.length)
        		};
        		
        		scope.allImagesLoaded = function(){
        		//	console.log("allImagesLoaded");
        			$rootScope.allImagesLoadedBln = true;
        	    	$rootScope.$broadcast('allImageLoaded'); 
        		};
        		
            }
        };
    }]);
    
});

