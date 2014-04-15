/*
 * This directive creates a youtube module
 * */
define(['./module'], function (directives) {
    'use strict';  
    directives.directive('blogFeedModule', ['$compile', '$http', '$rootScope', function ($compile, $http, $rootScope) {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	//console.log("blog module", scope.pageContent);
            	
            	var blogFeedArr;
            	var initBlogCountNum = 2;
            	var currentBlogIndexNum = 0;
            	var additionalBlogNum = 1;
            	var endBlogBln = false;
            	scope.$watch('pageContent', function(){	
            		if(scope.pageContent.blogsContent && scope.pageContent.blogsContent.length > 0){
            			blogFeedReceived();
            		}
            	}, true);
            	
            	
            	scope.$on('scrollToBottom', function() {
          	    //      console.log("scrollToBottom");
          	          generateMoreBlogs();
          	    });
            	
            	scope.$on('$destroy', function() {
        	      //      console.log("destroy scope");
            		destroy();
        	    });
            	

            	var blogFeedReceived = function(){
            	//	console.log('blogFeedReceived', scope.pageContent.blogsContent);
            		blogFeedArr = scope.pageContent.blogsContent;
            		generateBlogs();
            	};

            	var generateBlogs = function(){
                //	console.log('generateBlogs', blogFeedArr);
            		var htmlStr = "";
            		for(var i in blogFeedArr){
            			currentBlogIndexNum++;
            			htmlStr += blogFeedArr[i].content;
            			if(initBlogCountNum == currentBlogIndexNum){
            				break;
            			}
            		}
            		htmlStr = $compile(htmlStr)(scope);
            		$(element).append(htmlStr);
            	};
            	
            	var generateMoreBlogs = function(){
            	//	console.log('generateMoreBlogs', currentBlogIndexNum);
            		if(endBlogBln){
            	//		console.log("no more blogs");
            			return;
            		}
            		var nextBlogIndexNum = currentBlogIndexNum+additionalBlogNum;
            		var htmlStr = "";
            		// if we have reached the end of the blog
            		if(nextBlogIndexNum > blogFeedArr.length-1){
            		//	console.log("last blog entry");
            			nextBlogIndexNum = blogFeedArr.length-1;
            			endBlogBln = true;
            		}
            	//	console.log("currentBlogIndexNum, nextBlogIndexNum", currentBlogIndexNum, nextBlogIndexNum);
            		for(var i = currentBlogIndexNum; i<=nextBlogIndexNum ; i++){
            			htmlStr += blogFeedArr[i].content;
            		}
            		currentBlogIndexNum = nextBlogIndexNum+1;
            	//	console.log("inserting more blogs");
            		$(element).append($compile(htmlStr)(scope));
            	};
            	
    			var destroy = function(){
    			//	console.log("destroy");
    				
    			};
    			
            },
            replace: true,
            template: ''
        };
    }]);
   

    
});


