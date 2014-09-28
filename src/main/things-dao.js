'use strict';

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
