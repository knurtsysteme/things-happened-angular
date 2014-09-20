'use strict';

/**
 * @ngdoc directive
 * @name thingsHappened.directive:thingsTimeframe
 * @description # thingsTimeframe
 */
angular.module('thingsHappened').directive('thingsTimeframe', function() {
  return {
    template : '<div></div>',
    restrict : 'A',
    link : function postLink(scope, element) {
      element.text('this is the thingsTimeframe directive');
    }
  };
});
