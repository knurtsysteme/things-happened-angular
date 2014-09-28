'use strict';

/**
 * 
 * @ngdoc directive
 * @name thingsHappened.directive:thingsRepeat
 * @description # thingsRepeat
 */
angular.module('thingsHappened').directive('thingsRepeat', [ '$compile', 'thingsDao', function($compile, thingsDao) {

  var handleThingsRepeat = function(scope, element) {
    var originalElement = element.clone();
    element.css('display', 'none');
    var onChange = function(newVal, oldVal) {
      var match = scope.thingsRepeat.match(/^\s*([\s\S]+?)\s+in\s+([a-z]+)(.*)$/);
      if (match) {
        var thingsString = match[2];
        var template = originalElement.clone().wrap('<div />').parent().html();
        // kill the entire html of elements parent now!
        element.parent().html(element);
        var query = things.query.select(thingsString, {
          criteria : scope.thingsCriteria,
          projection : scope.thingsProjection
        });
        thingsDao.get(query).success(function(things) {
          scope[thingsString] = things;
          var el = angular.element(template);
          el.attr('ng-repeat', scope.thingsRepeat);
          el.removeAttr('things-repeat');
          $compile(el)(scope);
          element.after(el);
        });
      }
    };
    scope.$watch(function() {
      return scope.thingsRepeat + angular.toJson(scope.thingsCriteria) + scope.thingsProjection;
    }, onChange);
  };

  return {
    replace : true,
    restrict : 'A',
    scope : {
      'thingsRepeat' : '@',
      'thingsCriteria' : '=',
      'thingsProjection' : '='
    },
    compile : function compile() {
      return {
        post : handleThingsRepeat
      };
    }
  };
} ]);
