/*
 * This directive compiles unsafe string into html 
 * such that we can use directives
 * */
define(['./module'], function (directives) {
    'use strict';
    directives.directive('dateDifference', [function () {
        return {
            restrict: "A",
            scope: {},
            link: function(scope, element, attrs){
            	var oldDate = new Date(attrs.dateDifference);
            	var newDate = new Date();
            	var differenceSecondsNum = (newDate.getTime()-oldDate.getTime())/1000;
            	var differenceYearNum = ((((differenceSecondsNum/60)/60)/24)/365).toFixed(1);
            	scope.differenceDate = differenceYearNum;
            },
            replace: true,
            template: '<div>{{differenceDate}}</div>'
        };
    }]);
    
});


