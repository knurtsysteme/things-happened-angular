'use strict';

/**
 * @ngdoc directive
 * @name thingsHappened.directive:thingsCount
 * @description # thingsCount
 */
angular.module('thingsHappened').filter('todate', function() {
  return function(thing, key) {
    return thing ? things.date.getDate(thing, key) : null;
  };
});
