/*
 * This directive creates a youtube module
 * */
define(['./module', 'swfobj'], function (directives, swfobj) {
    'use strict';  
    directives.directive('youtubeModule', ['$compile', '$http', '$rootScope', function ($compile, $http, $rootScope) {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	//console.log("youtube module", scope.pageContent);
            	var youtubePlaylistArr;
            	var currentVideoIdStr;
            	var allVideosArr = [];
            	var playedVideosArr = [];
            	
            	scope.$watch('pageContent', function(){	
            		if(scope.pageContent.youTubePlaylistArr && scope.pageContent.youTubePlaylistArr.length > 0){
            			playlistUpdated();
            		}
            	}, true);
            	
            	scope.$on('$destroy', function() {
        	      //      console.log("destroy scope");
        	            destroyVideoPlayer();
        	    });
            	
            	scope.$on('youtubeVideoIdClicked', function(event, obj){
    	       // 	console.log("youtubeVideoIdClicked", obj);	 
    	        	currentVideoIdStr = obj.videoIdStr;
    	        	$("html, body").animate({ scrollTop: 0 }, "slow");
    	        	switchVideos();
    	        });
    	    		
            	var playlistUpdated = function(){
            	//	console.log('playlistUpdated', scope.pageContent.youTubePlaylistArr);
            		youtubePlaylistArr = scope.pageContent.youTubePlaylistArr;
            		createPlaylistContainer();
   
            		if($rootScope.isMobileBln){
            			createIframePlayer();
            		}else{
            			createVideoPlayer();
            		}
            	
            	};

            	var createPlaylistContainer = function(){
                //	console.log('createPlaylistContainer', youtubePlaylistArr);
            		var htmlStr = "";
            		var videosArr = [];
            		htmlStr += "<div class='youtubeModulePlaylistContentWrapper'>";
            		for(var i in youtubePlaylistArr){
            			videosArr = youtubePlaylistArr[i].videosArr;
            			if(youtubePlaylistArr[i].playlistIdStr == "PLVt0yV1-NIlu1bIywBMG5wGtTvLfBfPO8" ){
            				if(videosArr && videosArr[0] && videosArr[0].videoIdStr){
            					currentVideoIdStr = videosArr[0].videoIdStr;	
            				}
            			
            				continue;
            			}
            			htmlStr += "<div class='youtubeModulePlaylistWrapper' mouse-click-toggle-class='active' >";
            			htmlStr += "<div class='youtubeModulePlaylistTitleWrapper' >";
            		//	htmlStr += "<img class='youtubeModulePlaylistImage' src='"+youtubePlaylistArr[i].thumbnailsArr.high.url+"' />";
            			htmlStr += "<div class='youtubeModulePlaylistTitle' >";
            			htmlStr += youtubePlaylistArr[i].playlistTitleStr;
            			htmlStr += "</div>";
            		//	htmlStr += "<div class='youtubeModulePlaylistDesc'>";
            		//	htmlStr += youtubePlaylistArr[i].descriptionStr;
            		//	htmlStr += "</div>";
            			htmlStr += "</div>";
            			for(var j in videosArr){
            			//	console.log(videosArr[j].thumbnailsArr);
            				allVideosArr.push(videosArr[j].videoIdStr);
            				htmlStr += "<div youtube-broadcast-video-id='"+videosArr[j].videoIdStr+"' class='youtubeModuleVideoWrapper' >";
                			htmlStr += "<img class='youtubeModuleVideoImage' src='"+videosArr[j].thumbnailsArr.high.url+"' />";
            				htmlStr += "<div class='youtubeModuleVideoTitle'>";
            				htmlStr += videosArr[j].videoTitleStr;
            				htmlStr += "</div>";
            		//		htmlStr += "<div class='youtubeModuleVideoDesc'>";
            		//		htmlStr += videosArr[j].descriptionStr;
            		//		htmlStr += "</div>";
            				htmlStr += "</div>";
            			}
            			htmlStr += "</div>";
            		}
            		htmlStr += "</div>";
            		var html = $compile(htmlStr)( scope );
            		$(html).insertAfter(element);
            	};
            	
            	
            	/*
            	 * THIS IS THE VIDEO PLAYER CONTAINER
            	 * */

            	var videoWrapper = "youtubeModule_videoReplaceThisContainer";
            	var containerStr = "youtube-module";
			  	var videoPlayer;
			    
			    
			  	/*
			  	 * For mobile browsers that cant hook onto the callback
			  	 * */
			  	var createIframePlayer = function(){
			  	//	console.log('createIframePlayer');
			  		$('#youtubeModule_VideoPlayerWrapper').html('');
			  		var htmlStr = '<iframe id="youtube-module" width="100%" height="100%" src="http://www.youtube.com/embed/' + currentVideoIdStr+ '?hd=1&rel=0&showinfo=0&autoplay=1&fs=1&controls=1&wmode=transparent&enablejsapi=1&playerapiid=ytplayer&version=3" frameborder="0" allowfullscreen></iframe>';
			  		$('#youtubeModule_VideoPlayerWrapper').html(htmlStr);
			  	};
			  	
    			var createVideoPlayer = function() {
    			//	console.log('createVideoPlayer');
    				var videoIdStr= currentVideoIdStr;
    				if(!videoIdStr){
    					videoIdStr = "cZAlXvq1puc";
    				}
    				var paramsObj = { allowScriptAccess: "always", allowFullScreen: "true" };
    			    var controlsNum = 1;
    			    var autoplayNum = 1;
    			    var playerWidthNum = '100%';
    			    var playerHeightNum = '100%';
    			    var volumeNum = 100;
    			    playedVideosArr.push(currentVideoIdStr);
    			    swfobject.embedSWF("http://www.youtube.com/v/"+videoIdStr+"?hd=1&rel=0&showinfo=0&autoplay="+autoplayNum+"&fs=1&controls="+controlsNum+"&enablejsapi=1&playerapiid=ytplayer&version=3", videoWrapper, playerWidthNum, playerHeightNum, "8", null, null, paramsObj, { id: containerStr });
    			    window.onYouTubePlayerReady = function(obj){
    				//	console.log("onYouTubePlayerReady", obj);
    				//	console.log('containerStr',containerStr);
       			    		videoPlayer = document.getElementById(containerStr);
        					videoPlayer.addEventListener("onStateChange", "onytplayerStateChange");
        					videoPlayer.setVolume(volumeNum);    					
    			    };
    			    window.onytplayerStateChange = function (stateNum) {
    			    		videoStateChangeHandler(stateNum);
    			    };
    			};
    			
    			var videoStateChangeHandler = function(stateNum){
			    //	console.log("videoStateChangeHandler", stateNum);			 
    				if(stateNum == "-1"){
    				//	this.videoUnstartedHandler();
    				}else if(stateNum == "0"){
    				//	this.videoEndedHandler();
    					playRandomVideo();
    				}else if(stateNum == "1"){
    				//	this.videoPlayingHandler();
    				}else if(stateNum == "2"){
    				//	this.videoPausedHandler();
    				}else if(stateNum == "3"){
    				//	this.videoBufferingHandler();
    				}else if(stateNum == "5"){
    				//	this.videoCuedHandler();
    				}
    			};
    			
    			var playRandomVideo = function(){
    			//	console.log("playRandomVideo", currentVideoIdStr, playedVideosArr);
    				var maxNum = allVideosArr.length-1;
    				var minNum = 0;
    				var randIndexNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    				var randVideoStr = allVideosArr[randIndexNum];
				//	console.log(randVideoStr);	
					if($.inArray(randVideoStr,playedVideosArr) == -1 ){
						currentVideoIdStr = randVideoStr;
						switchVideos();
					}else{
						playRandomVideo();
					}
    			};
    			
    			var switchVideos = function(){
    	        //	console.log("switchVideos", currentVideoIdStr);	 
    				if(!currentVideoIdStr){ return; }
    				if($.inArray(currentVideoIdStr,playedVideosArr) == -1 ){
    					playedVideosArr.push(currentVideoIdStr);
    				}
    				if($rootScope.isMobileBln){
    					createIframePlayer();
    				}else{
    					if(videoPlayer == undefined){
    						return;
    					}
        	        	videoPlayer.loadVideoById({'videoId': currentVideoIdStr, 'startSeconds': 0,'suggestedQuality': 'large'});
    				}
    	    	};
    
    			var destroyVideoPlayer = function(){
    			//	console.log("destroyVideoPlayer");
    				
    				if(videoPlayer){
    					videoPlayer.removeEventListener("onStateChange", "onytplayerStateChange");
    				}
    				videoPlayer = undefined;
    			
    				swfobject.removeSWF(containerStr);
    				videoPlayer = undefined;
    				window.onYouTubePlayerReady = undefined;
    				window.onytplayerStateChange = undefined;
    				switchVideos = undefined;
    				playRandomVideo = undefined;
    				videoStateChangeHandler = undefined;
    				createVideoPlayer = undefined;
    				createIframePlayer = undefined;
    				playlistUpdated = undefined;
    				playedVideosArr = undefined;
    				youtubePlaylistArr = undefined;
                	currentVideoIdStr = undefined;
                	allVideosArr = undefined;
                    videoWrapper = undefined;
                 	containerStr = undefined;
     			  
    			
             
     			  		
    			};
            },
            replace: true,
            template: '<div id="youtubeModule_Wrapper">'+
            		'<div class="fake-img-height"></div>'+
            		'<div id="youtubeModule_VideoPlayerWrapper">'+
            		'<div id="youtubeModule_videoReplaceThisContainer"></div>'+
            		'</div>'+
            		'</div>'
        };
    }]);
   

    directives.directive('youtubeBroadcastVideoId', ['$rootScope', function ($rootScope) {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
            	element.bind("click", function(){
            		scope.$broadcast('youtubeVideoIdClicked', {videoIdStr: attrs.youtubeBroadcastVideoId}); 
            	});
            }
        };
    }]);
    
    
    
});


