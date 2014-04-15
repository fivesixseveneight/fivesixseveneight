define(['./module'], function (directives) {
    'use strict';
    directives.directive('navToggle', [function () {
        return {
            restrict: "A",
            controller: ["$scope",function($scope){
            	$scope.navActiveBln = false;
            }],
            link: function(scope, element, attrs){
            	scope.$on("ui_sref_changed", function(){
            		(element).removeClass("active"); 
            	});
            	$(element).bind("click", function(){
            		scope.$broadcast("ui_sref_changed");
            		$(element).addClass("active"); 
            		scope.navDrawerClose();
            	});
            }
        };
    }]);
    
});
