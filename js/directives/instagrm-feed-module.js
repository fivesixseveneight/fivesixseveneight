define(['./module'], function (directives) {
    'use strict';
    directives.directive('instagramModule', ['$compile', '$rootScope', function ($compile, $rootScope) {
        return {
        	  restrict: "A",
        	  link: function(scope, element, attrs){
        			var instagramsData;
        			var instagramPostsArr;
        			var tempObj;
        			
        			$rootScope.$on('addInstagramToCycle', function(event, obj){
        		    //	console.log("addInstagramToCycle received", event, obj);
        		    	addInstagramToCycle(obj);
        			});
        			
        			scope.$on('$destroy', function() {
        	        //  console.log("destroy scope");
        	            destroy();
        	        });
        			
        			var init = function(){
        			//	console.log("init");
        				setupProps();
        				prepInstagramData();
        				generatePosts();
        			};
        			
        			var setupProps = function(){
        			//	console.log("setupProps");
        				instagramsData = scope.pageContent.instagramContent.instagramArr;
        				instagramPostsArr = [];
        				tempObj = {};
        			};
        			
        			var prepInstagramData = function(){
        			//	console.log("prepInstagramData", instagramsData);
         	   			for(var i in instagramsData){
            				tempObj = {};
            				tempObj.linkStr = instagramsData[i].link;
            				tempObj.texStr = instagramsData[i].caption.text;
            				tempObj.imageStr =  instagramsData[i].images.standard_resolution.url;
            				instagramPostsArr.push(tempObj);
            			}
        			};
        			
        		
        			var generatePosts = function(){
        			//	console.log("generatePosts", instagramPostsArr);
        			    var htmlStr = "";
            			
        			    htmlStr += "<div class='instagrm-module-instagrm-title'>";
        			    htmlStr += "Instagram";
        			    htmlStr += "<div class='instagrm-module-follow-button-container'>";
        			    htmlStr += "<a href='http://instagram.com/torontoforeal?ref=badge' target='_blank' class='ig-b- ig-b-24'><img src='//badges.instagram.com/static/images/ig-badge-24.png' alt='Instagram' /></a>";
        			    htmlStr += "</div>";
        			    htmlStr += "</div>";
        			    htmlStr += "<div class='instagrm-module-tweet-container'>";
        			    for(var i in instagramPostsArr){
        			    	htmlStr += "<div animate-instagram-module class='instagrm-module-tweet-wrapper'>";
        			    	htmlStr += "<a href='"+instagramPostsArr[i].linkStr+"' target='_blank' >";
        			    	htmlStr += "<img src='"+instagramPostsArr[i].imageStr+"' class='instagrm-module-img'/>";  			    	
        			    	htmlStr += "<div class='instagrm-module-text'>";
        			    	htmlStr += instagramPostsArr[i].texStr;
        			    	htmlStr += "</div>";
        			    	htmlStr += "</a>";
        			    	htmlStr += "</div>";
        			    }
        			    htmlStr += "</div>";
        			    
        				$(element).html($compile(htmlStr)( scope ));
        			};

        			/*
        			 * Animates instagram cycling animation
        			 * */
        			var isAnimatedBln = false;
        			var instagramElementArr = [];
        			var showInstagramNum = 5;
        			var cycleTimeNum = 10000;
        			var intervalObj;
        			var parentElement;
        			var addInstagramToCycle = function(obj){
        			//	console.log("addInstagramToCycle", obj);
        				instagramElementArr.push(obj.element);
        				if(instagramElementArr.length > showInstagramNum && isAnimatedBln== false){
        					initializeInstagramCycle();
        				}
        				updateInstagramPosts();
        			};
        			
        			var initializeInstagramCycle = function(){
        			//	console.log("initializeInstagramCycle", instagramElementArr);
        				isAnimatedBln = true;
        				parentElement = $(instagramElementArr[0]).parent();
        				intervalObj = setInterval(function(){
        					cycleInstagramPost();
                    	}, cycleTimeNum);
        			};
        			
        			var updateInstagramPosts = function(){
        			//	console.log("updateInstagramPosts", instagramElementArr);
        				if(showInstagramNum >= instagramElementArr.length){
        					showAllInstagrams();
        				}
        			};
        			
        			var showAllInstagrams = function(){
        			//	console.log("showAllInstagrams", instagramElementArr);
        				for(var i in instagramElementArr){
        					$(instagramElementArr[i]).slideDown("slow");
        				}
        			};
        			
        			var cycleInstagramPost = function(){
        			//	console.log("cycleInstagramPost");
        				var tempInstagramElement = parentElement.children()[0];
        				$(tempInstagramElement).slideUp("slow",function(){
        					reparentInstagramPost(tempInstagramElement);
        				});        			
        			};
        			
        			var reparentInstagramPost = function(tempInstagramElement){
        			//	console.log("reparentInstagramPost");
        				$(tempInstagramElement).remove();
        				parentElement.append(tempInstagramElement);
        				for(var i=0; i<showInstagramNum ;i++){
        					$(parentElement.children()[i]).slideDown();
        				}
        			};
        			
        			var destroy = function(){
        			//	console.log("destroy", instagramElementArr);
        				clearInterval(intervalObj);	
        			};
        			
        			init();
        	  }
        };
    }]);
    
    
    
    directives.directive('animateInstagramModule', ['$compile', '$rootScope', function ($compile, $rootScope) {
        return {
        	  restrict: "A",
        	  link: function(scope, element, attrs){
        		//  console.log("animateInstagramModule");
        		  $rootScope.$broadcast('addInstagramToCycle', {element: element}); 
        	  }
     	  
	    };
	}]);

});
