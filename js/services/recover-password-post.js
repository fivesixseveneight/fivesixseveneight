define(['./module'], function (services) {
    'use strict';   
    services.service('recoverPasswordPost', ['$http', '$q', function ($http, $q) {
    	var recoverpasswordPostService = {
    			postRecoverPasswordData: function(dataObj) {
    				var deferred = $q.defer();
    				var postObj = dataObj;
    				var urlStr = "api/verify-recovery";
    				
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
    		    		if(obj.data){
    		    			if(obj.data.messageStr){
    		    				returnObj.messageStr = obj.data.messageStr;
    		    			};
    		    			if(obj.data.editBln != undefined){
    		    				returnObj.editBln = obj.data.editBln;
    		    			}
    		    		};
    		    		
    		    		deferred.resolve(returnObj);
    		    	};
    		    	
    		    	var requestFailed = function(obj){
    		    	//	console.log('requestFailed', obj);
    		    		var returnObj = {};
    		    		returnObj.messageStr = "Something went wrong and we can't recover your password at the moment. Please contact us to assist you.";
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
    		  return recoverpasswordPostService;
    }]);
    
    
});
