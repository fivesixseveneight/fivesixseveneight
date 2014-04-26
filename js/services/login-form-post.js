define(['./module'], function (services) {
    'use strict';   
    services.service('loginFormPost', ['$http', '$q', function ($http, $q) {
    	var loginFormPostService = {
    			postLoginFormData: function(dataObj) {
    				var deferred = $q.defer();
    				var postObj = dataObj;
    				var urlStr = "api/login";
    				
    		    	var postData = function(){
    		    	//	console.log('postData', postObj);
    		    		$http.post(urlStr, postObj).
    		    	    error(function(dataObj, status, headers, config) {
    		    	    	console.log("login failure");
    		    	      	requestFailed(dataObj);
    		    	      }).then(function (dataObj) {
        		    		console.log('login success',dataObj.data);
        		    		requestSuccess(dataObj.data);
        		    	});
    		    	};
    		    	
    		    	var requestSuccess = function(obj){
    		    		console.log('login requestSuccess',obj);
    		    		var returnObj = {};
    		    		returnObj.messageStr = "login successful";
    		    		returnObj.successBln = true;
    		    		if(obj.data && obj.data.messageStr){
    		    			returnObj.messageStr = obj.data.messageStr;
    		    		};
    		    		deferred.resolve(returnObj);
    		    	};
    		    	
    		    	var requestFailed = function(obj){
    		    		console.log('login requestFailed', obj);
    		    		var returnObj = {};
    		    		returnObj.messageStr = "login failed";
    		    		returnObj.successBln = false;
    		    		if(obj.data && obj.data.messageStr){
    		    			returnObj.messageStr = obj.data.messageStr;
    		    		};
    		    		deferred.resolve(returnObj);
    		    	};
    		    	
    		    	
    		    	var init = function(){
        		    	postData();
        		    };
        		    init();
        		    
    		     return deferred.promise;
    		     }
    		  };
    		  return loginFormPostService;
    }]);
    
    
});
