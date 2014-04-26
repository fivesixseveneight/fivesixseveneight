define(['./module'], function (services) {
    'use strict';   
    services.service('logoutPost', ['$http', '$q', function ($http, $q) {
    	var logoutPostService = {
    			postLogout: function(dataObj) {
    				var deferred = $q.defer();
    				var postObj = dataObj;
    				var urlStr = "api/logout";
    				
    		    	var postData = function(){
    		    	//	console.log('postData');
    		    		$http.post(urlStr, postObj).
    		    	    error(function(dataObj, status, headers, config) {
    		    	    //	console.log("logout failure");
    		    	      	requestFailed(dataObj);
    		    	      }).then(function (dataObj) {
        		    	//	console.log('logout success',dataObj.data);
        		    		requestSuccess(dataObj.data);
        		    	});
    		    	};
    		    	
    		    	var requestSuccess = function(obj){
    		    	//	console.log('logout requestSuccess',obj);

    		    		if(obj.data){
    		    			deferred.resolve(obj.data);
    		    		};
    		    	
    		    	};
    		    	
    		    	var requestFailed = function(obj){
    		    	//	console.log('logout requestFailed', obj);
    		    		var returnObj = {};
    		    		returnObj.messageStr = "logout failed";
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
    		  return logoutPostService;
    }]);
    
    
});
