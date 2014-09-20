'use strict';

/**
 * @ngdoc directive
 * @name thingsHappened.directive:thingsCount
 * @description # thingsCount
 */
angular.module('thingsHappened').directive('thingsCount', [ 'ThingsDao', function(ThingsDao) {
  return {
    scope : {
      'thingsCount' : '=',
      'thingsHappened' : '='
    },
    link : function postLink(scope, element) {
      var onChange = function() {
        if (scope.thingsCount) {
          var http = null;
          if (scope.thingsHappened) {
            http = ThingsDao.getCountOf(scope.thingsCount, scope.thingsHappened);
          } else {
            http = ThingsDao.getCountOf(scope.thingsCount);
          }
          http.success(function(count) {
            element.text(count.result);
          });
        } else {
          ThingsDao.getCountOfThings().success(function(count) {
            element.text(count._total);
          });
        }
      };
      scope.$watch(function() {
        return scope.thingsCount + scope.thingsHappened;
      }, onChange);
    }
  };
} ]);
