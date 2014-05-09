define(['./module'], function (services) {
    'use strict';   
    services.service('registerFormPost', ['$http', '$q', function ($http, $q) {
    	var registerFormPostService = {
    			postregisterFormData: function(dataObj) {
    				var deferred = $q.defer();
    				var postObj = dataObj;
    				var urlStr = "api/register";
    				
    		    	var postData = function(){
    		    	//	console.log('postData', postObj);
    		    		$http.post(urlStr, postObj).
    		    	    error(function(dataObj, status, headers, config) {
    		    	    //	console.log("register failure");
    		    	      	requestFailed(dataObj);
    		    	      }).then(function (dataObj) {
        		    	//	console.log('register success',dataObj.data);
        		    		requestSuccess(dataObj.data);
        		    	});
    		    	};
    		    	
    		    	var requestSuccess = function(obj){
    		    		console.log('register requestSuccess',obj);
    		    		var returnObj = {};
    		    		returnObj.messageStr = "register successful";
    		    		returnObj.successBln = true;
    		    		if(obj.data && obj.data.messageStr){
    		    			returnObj.messageStr = obj.data.messageStr;
    		    		};
    		    		deferred.resolve(returnObj);
    		    	};
    		    	
    		    	var requestFailed = function(obj){
    		    		console.log('register requestFailed', obj);
    		    		var returnObj = {};
    		    		returnObj.messageStr = "register failed";
    		    		returnObj.successBln = false;
    		    		if(obj.data){
    		    			if(obj.data.messageStr){
        		    			returnObj.messageStr = obj.data.messageStr;
    		    			}
    		    			if(obj.data.errorMessagesArr){
        		    			returnObj.errorMessagesArr = obj.data.errorMessagesArr;

    		    			}

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
    		  return registerFormPostService;
    }]);
    
    
});
