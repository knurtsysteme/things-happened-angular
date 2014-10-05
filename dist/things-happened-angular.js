/*! things-happened-angular v0.3.0 | (c) 2013-2014 KNURT Systeme | MIT License */
/* Copyright (c) 2013-2014 KNURT Systeme

things-happened-angular JavaScript Library v0.3.0

build: Sun Oct 05 2014 08:07:41 GMT+0200 (CEST)

MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';


/**
 * @ngdoc overview
 * @name thingsHappened
 * @description # thingsHappened
 * 
 * Main module of the application.
 */
angular.module('thingsHappened', []);



/**
 * @ngdoc service
 * @name thingsHappened.thingsDao
 * @description # thingsDao Service in the thingsHappened.
 */
angular.module('thingsHappened').factory('thingsDao', [ '$http', function($http) {
  var result = {};
  var getPseudoResponses = function(message) {
    var res = {};
    message = message || 'invalid request - server not contacted';
    res.error = function(callback) {
      callback(message);
    };
    res.success = function() {
    };
    return res;
  };
  result.get = function(query) {
    var url = query.url();
    var res = {};
    if (url) {
      res = $http.get(query.url());
    } else {
      res = getPseudoResponses();
    }
    return res;
  };
  result.add = function(query) {
    var url = query.url();
    var thing = query.getThing();
    var res = {};
    if (url && thing) {
      res = $http.post(url, thing);
    } else {
      res = getPseudoResponses();
    }
    return res;
  };
  return result;
} ]);



/**
 * @ngdoc directive
 * @name thingsHappened.directive:thingsAddto
 * @description # thingsAddto
 */

// FIXME das ist der supergau, weil hier für input-felder eigene ng-model dinge
// gesesetzt werden
// im wahren leben möchte man dort eigene ng-models setzen udn wenn man das tut,
// funktioniert's nicht mehr!!!
angular.module('thingsHappened').directive('thingsAddto', [ '$compile', 'thingsDao', function($compile, thingsDao) {
  var getNgSubmitFunction = function(cn, state, thingsDao, tmpModel, successCallback, errorCallback) {
    successCallback = successCallback || function(answerFromThingsHappened) {
      window.alert('Your new document stored: ' + JSON.stringify(answerFromThingsHappened));
    };
    errorCallback = errorCallback || function() {
      window.alert('YES! ... an error occured :(');
    };
    return function() {
      var query = things.query.add(this[tmpModel]).to(cn, state);
      thingsDao.add(query).success(successCallback).error(errorCallback);
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
            scope[tmpFunc] = getNgSubmitFunction(cn, state, thingsDao, tmpModel, successCallback, errorCallback);
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



angular.module('thingsHappened').controller('thingsCtrl', [ '$scope', 'thingsDao', function($scope, thingsDao) {
  $scope.add = thingsDao.add
} ]);


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
