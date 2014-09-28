'use strict';

/**
 * @ngdoc directive
 * @name thingsHappened.directive:thingsCount
 * @description # thingsCount
 */
angular.module('thingsHappened').directive('thingsCount', [ 'thingsDao', function(thingsDao) {
  return {
    scope : {
      'thingsCount' : '=',
      'thingsHappened' : '='
    },
    link : function postLink(scope, element) {
      var onChange = function() {
        if (scope.thingsCount) {
          var query = things.query.count(scope.thingsCount);
          if (scope.thingsHappened) {
            query.that(scope.thingsHappened);
          }
          thingsDao.get(query).success(function(count) {
            element.text(count.result);
          });
        } else {
          thingsDao.get(things.query.count()).success(function(count) {
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
