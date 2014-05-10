define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('confirmregistrationController', ['$scope','$rootScope', '$state', function ($scope, $rootScope, $state ) {
     	
    	$scope.pageContent = {};

    	$scope.$on('$destroy', function() {
        //  console.log("destroy scope");
            destroy();
        });
	
    	var destroy = function(){
    	//	console.log("destroy");

    	};
    	

    	$scope.loadingEnd();

	
    }]);
});
