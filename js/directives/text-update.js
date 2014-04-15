define(['./module'], function (directives) {
    'use strict';
    directives.directive('textUpdate', [function () {
        return {
        	  restrict: "A",
        	  scope:{
        		  done: "&"
        	  },
              template: '<input type="text" ng-model="textInput">'+
              ' {{textInput}}'+
              '<div class="button" ng-click="done({textInput:textInput})">Im Done</div>'
        };
    }]);
});
