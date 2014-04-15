define(['./module'], function (directives) {
    'use strict';
    directives.directive('twitterModule', ['$compile', '$rootScope', function ($compile, $rootScope) {
        return {
        	  restrict: "A",
        	  link: function(scope, element, attrs){
        			var tweetsData;
        			var tweetsArr;
        			var tempObj;
        			
        			$rootScope.$on('addTweetToCycle', function(event, obj){
        		    //	console.log("addTweetToCycle received", event, obj);
        		    	addTweetToCycle(obj);
        			});
        			
        			scope.$on('$destroy', function() {
        	        //    console.log("destroy scope");
        	            destroy();
        	        });
        			
        			var init = function(){
        			//	console.log("init");
        				setupProps();
        				prepTweetsData();
        				generateTweets();
        			};
        			
        			var setupProps = function(){
        			//	console.log("setupProps");
        				tweetsData = scope.pageContent.twitterContent.tweetsArr;
        				tweetsArr = [];
        				tempObj = {};
        			};
        			
        			var prepTweetsData = function(){
        			//	console.log("prepTweetsData", tweetsData);
         	   			for(var i in tweetsData){
            				tempObj = {};
            				tempObj.screenNameStr = tweetsData[i].user.screen_name;
            				tempObj.tweetStr = tweetsData[i].text;
            				tempObj.entitiesObj =  tweetsData[i].entities;
            				tweetsArr.push(tempObj);
            			}
         	   			
         	   			for(var i in tweetsArr){
         	   				tweetsArr[i] = resolveEntities(tweetsArr[i]);
         	   			}
        			};
        			
        			var resolveEntities = function(obj){
        			//	console.log("resolveEntities", obj);
        				var entitiesObj = obj.entitiesObj;
        				var tweetStr = obj.tweetStr;
        				var entitiesArr = [];
        				var entitiyArr;
        				var tempReturnObj;
        			
        				if(entitiesObj.hashtags){
        					entitiyArr = entitiesObj.hashtags;
        					for(var i in entitiyArr){
        						tempReturnObj = resolveHashtags(entitiyArr[i]);
        						entitiesArr.push(tempReturnObj);
        					}
        				}
        				if(entitiesObj.symbols){
        					entitiyArr = entitiesObj.symbols;
        					for(var i in entitiyArr){
        						tempReturnObj = resolveSymbols(entitiyArr[i]);
        						entitiesArr.push(tempReturnObj);
        					}
        				}
        				if(entitiesObj.urls){
        					entitiyArr = entitiesObj.urls;
        					for(var i in entitiyArr){
        						tempReturnObj = resolveUrls(entitiyArr[i]);
        						entitiesArr.push(tempReturnObj);
        					}
        				}
        				if(entitiesObj.user_mentions){
        					entitiyArr = entitiesObj.user_mentions;
        					for(var i in entitiyArr){
        						tempReturnObj = resolveUser_mentions(entitiyArr[i]);
        						entitiesArr.push(tempReturnObj);
        					}		  					
        				}
        				if(entitiesObj.media){
        					entitiyArr = entitiesObj.media;
        					for(var i in entitiyArr){
        						tempReturnObj = resolveMedia(entitiyArr[i]);
        						entitiesArr.push(tempReturnObj);
        					}		  
        				}
        			
        				entitiesArr = sortEntities(entitiesArr);
        				tweetStr = replaceWithEntities({tweetStr: tweetStr, entitiesArr: entitiesArr});
        				return tweetStr;
        			};
        			
        			var resolveMedia = function(obj){
        			//	console.log("resolveMedia", obj);
        				var dataObj = obj;
        				var returnObj = {};
        				var htmlStr = "";
        				htmlStr += "<a href='https://"+dataObj.display_url+"' target='_blank' >"+dataObj.display_url+"</a>";
        				returnObj.htmlStr = htmlStr;
        				returnObj.startIndexNum = dataObj.indices[0];
        				returnObj.endIndexNum = dataObj.indices[1];
        				return returnObj;
        			};
        			
        			var resolveHashtags = function(obj){
        			//	console.log("resolveHashtags", obj);
        				var dataObj = obj;
        				var returnObj = {};
        				var htmlStr = "";
        				htmlStr += "<a href='https://twitter.com/search?q="+dataObj.text+"&src=ctag' target='_blank' >#"+dataObj.text+"</a>";
        				returnObj.htmlStr = htmlStr;
        				returnObj.startIndexNum = dataObj.indices[0];
        				returnObj.endIndexNum = dataObj.indices[1];
        				return returnObj;
        			};
        			
        			var resolveSymbols = function(obj){
        			//	console.log("resolveSymbols", obj);
        				var dataObj = obj;
        				var returnObj = {};
        				var htmlStr = "";
        				htmlStr += "<a href='https://twitter.com/search?q="+dataObj.text+"&src=ctag' target='_blank' >$"+dataObj.text+"</a>";
        				returnObj.htmlStr = htmlStr;
        				returnObj.startIndexNum = dataObj.indices[0];
        				returnObj.endIndexNum = dataObj.indices[1];
        				return returnObj;
        			};
        			
        			var resolveUrls = function(obj){
        			//	console.log("resolveUrls", obj);
        				var dataObj = obj;
        				var returnObj = {};
        				var htmlStr = "";
        				htmlStr += "<a href='"+dataObj.expanded_url+"' target='_blank' >"+dataObj.display_url+"</a>";
        				returnObj.htmlStr = htmlStr;
        				returnObj.startIndexNum = dataObj.indices[0];
        				returnObj.endIndexNum = dataObj.indices[1];
        				return returnObj;
        			};
        			
        			var resolveUser_mentions = function(obj){
        			//	console.log("resolveUser_mentions", obj);
        				var dataObj = obj;
        				var returnObj = {};
        				var htmlStr = "";
        				htmlStr += "<a href='https://twitter.com/"+dataObj.screen_name+"' target='_blank' >@"+dataObj.name+"</a>";
        				returnObj.htmlStr = htmlStr;
        				returnObj.startIndexNum = dataObj.indices[0];
        				returnObj.endIndexNum = dataObj.indices[1];
        				return returnObj;
        			};
        			
         			var sortEntities = function(dataArr){
        			//	console.log('sortEntities', dataArr);			
        				dataArr = dataArr.sort(function(a, b) {
        				    a = a.startIndexNum;
        				    b = b.startIndexNum;
        				    return a>b ? -1 : a<b ? 1 : 0;
        				});
        				return dataArr;
        			};
        			
        			var replaceWithEntities = function(obj){
        			//	console.log('replaceWithEntities', obj);	
        				var tweetStr = obj.tweetStr;
        				var entitiesArr = obj.entitiesArr;		
        				for(var i in entitiesArr){
        					tweetStr = tweetStr.split("");
        					tweetStr.splice(entitiesArr[i].startIndexNum, entitiesArr[i].endIndexNum-entitiesArr[i].startIndexNum);
        					tweetStr.splice(entitiesArr[i].startIndexNum, 0, entitiesArr[i].htmlStr);
        					tweetStr = tweetStr.join("");
        				}
        				return tweetStr;
        			};
        			
        			var generateTweets = function(){
        			//	console.log("generateTweets", tweetsArr);
        			    var htmlStr = "";
        			    htmlStr += "<div class='twitter-module-twitter-title'>";
        			    htmlStr += "Twitter";       
        			    htmlStr += "<div class='twitter-module-follow-button-container'>";
        			    htmlStr += "<iframe allowtransparency='true' frameborder='0' scrolling='no' src='//platform.twitter.com/widgets/follow_button.html?screen_name=torontoforeal' show_count='false' style='width:59px; height:21px;'></iframe>"
        			    htmlStr += "</div>";
        			    htmlStr += "</div>";
        			    htmlStr += "<div class='twitter-module-tweet-container'>";
        			    for(var i in tweetsArr){
        			    	htmlStr += "<div animate-twitter-module class='twitter-module-tweet-wrapper'>";
        			    	htmlStr += tweetsArr[i];
        			    	htmlStr += "</div>";
        			    }
        			    htmlStr += "</div>";
        				$(element).html($compile(htmlStr)( scope ));
        			};
        			
        			/*
        			 * Animates twitter cycling animation
        			 */
        			var isAnimatedBln = false;
        			var tweetsElementArr = [];
        			var showTweetsNum = 10;
        			var cycleTimeNum = 10000;
        			var intervalObj;
        			var parentElement;
        			var addTweetToCycle = function(obj){
        			//	console.log("addTweetToCycle", obj);
        				tweetsElementArr.push(obj.element);
        				if(tweetsElementArr.length > showTweetsNum && isAnimatedBln== false){
        					initializeTweetCycle();
        				}
        				updateTweets();
        			};
        			
        			var initializeTweetCycle = function(){
        			//	console.log("initializeTweetCycle", tweetsElementArr);
        				isAnimatedBln = true;
        				parentElement = $(tweetsElementArr[0]).parent();
        				intervalObj = setInterval(function(){
        					cycleTweet();
                    	}, cycleTimeNum);
        			};
        			
        			var updateTweets = function(){
        			//	console.log("updateTweets", tweetsElementArr);
        				if(showTweetsNum >= tweetsElementArr.length){
        					showAllTweets();
        				}
        			};
        			
        			var showAllTweets = function(){
        			//	console.log("showAllTweets", tweetsElementArr);
        				for(var i in tweetsElementArr){
        					$(tweetsElementArr[i]).slideDown("slow");
        				}
        			};
        			
        			var cycleTweet = function(){
        			//	console.log("cycleTweet");
        				var tempTweetElement = parentElement.children()[0];
        				$(tempTweetElement).slideUp("slow",function(){
        					reparentTweet(tempTweetElement);
        				});        			
        			};
        			
        			var reparentTweet = function(tempTweetElement){
        			//	console.log("reparentTweet");
        				$(tempTweetElement).remove();
        				parentElement.append(tempTweetElement);
        				for(var i=0; i<showTweetsNum ;i++){
        					$(parentElement.children()[i]).slideDown();
        				}
        			};
        			
        			var destroy = function(){
        			//	console.log("destroy", tweetsElementArr);
        				clearInterval(intervalObj);	
        			};
        			init();
        	  }
        };
    }]);

    directives.directive('animateTwitterModule', ['$compile', '$rootScope', function ($compile, $rootScope) {
        return {
        	  restrict: "A",
        	  link: function(scope, element, attrs){
        		//  console.log("animateTwitterModule");
        		  $rootScope.$broadcast('addTweetToCycle', {element: element}); 
        	  }
     	  
	    };
	}]);

});
