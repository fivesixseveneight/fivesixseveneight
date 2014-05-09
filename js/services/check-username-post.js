define(['./module'], function (services) {
    'use strict';   
    services.service('checkUsernamePost', ['$http', '$q', function ($http, $q) {
    	var checkUsernamePostService = {
    			postUsernameFormData: function(dataObj) {
    				var deferred = $q.defer();
    				var postObj = dataObj;
    				var urlStr = "api/checkUsername";
    				
    		    	var postData = function(){
    		    	//	console.log('postData', postObj);
    		    		$http.post(urlStr, postObj).
    		    	    error(function(dataObj, status, headers, config) {
    		    	    //	console.log("contact form submission failure");
    		    	      	requestFailed(dataObj);
    		    	      }).then(function (dataObj) {
        		    	//	console.log('postSuccess',dataObj.data);
        		    		requestSuccess(dataObj.data);
        		    	});
    		    	};
    		    	
    		    	var requestSuccess = function(obj){
    		    	//	console.log('requestSuccess',obj);
    		    		var returnObj = {};
    		    		returnObj.messageStr = "";
    		    		returnObj.successBln = true;
    		    		if(obj.data && obj.data.messageStr){
    		    			returnObj.messageStr = obj.data.messageStr;
    		    		};
    		    		if(obj.data && obj.data.successBln != undefined){
    		    			returnObj.successBln = obj.data.successBln;
    		    		};
    		    		deferred.resolve(returnObj);
    		    	};
    		    	
    		    	var requestFailed = function(obj){
    		    	//	console.log('requestFailed', obj);
    		    		var returnObj = {};
    		    		returnObj.messageStr = "";
    		    		returnObj.successBln = false;
    		    		if(obj.data && obj.data.messageStr){
    		    			returnObj.messageStr = obj.data.messageStr;
    		    		};
    		    		if(obj.data && obj.data.successBln != undefined){
    		    			returnObj.successBln = obj.data.successBln;
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
    		  return checkUsernamePostService;
    }]);
    
    
});
