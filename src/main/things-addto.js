'use strict';

/**
 * @ngdoc directive
 * @name thingsHappened.directive:thingsAddto
 * @description # thingsAddto
 */

// FIXME das ist der supergau, weil hier für input-felder eigene ng-model dinge
// gesesetzt werden
// im wahren leben möchte man dort eigene ng-models setzen udn wenn man das tut,
// funktioniert's nicht mehr!!!
angular.module('thingsHappened').directive('thingsAddto', [ '$compile', 'ThingsDao', function($compile, ThingsDao) {
  var getNgSubmitFunction = function(cn, state, thingsDao, tmpModel, successCallback, errorCallback) {
    successCallback = successCallback || function(answerFromThingsHappened) {
      window.alert('Your new document stored: ' + JSON.stringify(answerFromThingsHappened));
    };
    errorCallback = errorCallback || function() {
      window.alert('YES! ... an error occured :(');
    };
    return function() {
      thingsDao.add(this[tmpModel]).to(cn, state).success(successCallback).error(errorCallback);
      return false;
    };
  };
  var num = 1;
  var getTmpModel = function() {
    return 'things' + num++;
  };
  var directiveDefinitionObject = {
    compile : function compile() {
      return {
        post : function postLink(scope, element, attr) {
          var expression = attr.thingsAddto;
          var match = expression.match(/^\s*([a-z]+)\s+([a-z]+)(.*)$/);
          if (match) {
            var cn = match[1];
            var state = match[2];
            var successCallback = attr.thingsSuccess || false;
            if (successCallback) {
              successCallback = scope[successCallback];
            }
            var errorCallback = attr.thingsError || false;
            if (errorCallback) {
              errorCallback = scope[errorCallback];
            }
            var tmpModel = getTmpModel();
            var tmpFunc = tmpModel + 'Function';
            scope[tmpModel] = {};
            scope[tmpFunc] = getNgSubmitFunction(cn, state, ThingsDao, tmpModel, successCallback, errorCallback);
            var template = element.clone().wrap('<div />').parent().html();
            // set ng-model as attribute of our tmpModel
            template = template.replace(/name\s*=\s*"/g, 'ng-model="' + tmpModel + '.');
            template = template.replace(/name\s*=\s*'/g, 'ng-model=\'' + tmpModel + '.');
            element.html(template);
            element.attr('ng-model', tmpModel);
            element.attr('ng-submit', tmpFunc + '()');
            element.removeAttr('things-addto');
            $compile(element)(scope);
          }
        }
      };
    }
  };
  return directiveDefinitionObject;
} ]);