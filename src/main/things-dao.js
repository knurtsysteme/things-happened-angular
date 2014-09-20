'use strict';

/**
 * @ngdoc service
 * @name thingsHappened.ThingsDao
 * @description # ThingsDao Service in the thingsHappened.
 */
angular.module('thingsHappened').factory('ThingsDao', [ '$http', function($http) {
  var result = {};
  result.serviceurl = ThingsConfig.serviceurl.replace(/\/$/, '');
  /*
   * TODO das hier muss anders:
   * 
   * thingsDao.get('cars').criteria('...').query()
   * 
   * thingsDao.get('cars', 'crashed').count().query()
   * 
   * thingsDao.get('cars', 'crashed').criteria(...).count().query()
   * 
   * thingsDao.get('cars', 'crashed').in(subquery).query()
   * 
   * es muss also immer mit query() aufhören, damit die funktion weiß, jetzt das
   * http zeugs.
   * 
   * var a = function() { var foo, bar; return { b : function(b) { foo = b;
   * return this; }, c : function(c) { bar = c; return this; }, query :
   * function() { console.info(foo, bar); } }; };
   * 
   * a().b("Daniel").c("Oltmanns").query();
   */
  result.get = function(cn, criteria, projection) {
    if (typeof (cn) == 'object') {
      cn = cn[0] + '/' + cn[1];
    }
    var url = result.serviceurl + '/get/' + cn + '.json';

    // take care about the global secret
    if (criteria && criteria._secret == false) {
      delete criteria._secret;
    } else if (ThingsConfig.secret) {
      criteria = criteria || {};
      criteria._secret = typeof criteria._secret == 'undefined' ? ThingsConfig.secret : criteria._secret;
    }

    if (criteria && JSON.stringify(criteria) != "{}") {
      url += '?criteria=' + JSON.stringify(criteria);
    }

    if (projection) {
      url += criteria ? '&' : '?';
      url += 'projection=' + JSON.stringify(projection);
    }
    return $http.get(url);
  };
  result.query = function(thingsQuery) {
    if (ThingsConfig.secret && !thingsQuery.hasCriterion('_secret')) {
      thingsQuery.setSecret(ThingsConfig.secret);
    }
    return $http.get(result.serviceurl + thingsQuery.url());
  };
  result.getCountOfThings = function() {
    return $http.get(result.serviceurl + '/count/things.json');
  };
  result.getHappenedTo = function(cn) {
    return $http.get(result.serviceurl + '/get/happened/to/' + cn + '.json');
  };
  result.getCountOf = function(cn, state) {
    if (state) {
      return $http.get(result.serviceurl + '/count/' + cn + '/' + state + '.json');
    } else {
      return $http.get(result.serviceurl + '/count/' + cn + '.json');
    }
  };
  result.add = function(subject) {
    return {
      to : function(cn, state) {
        var url = result.serviceurl + '/addto/' + cn + '/' + state + '.json';
        if (ThingsConfig.secret) {
          subject._secret = ThingsConfig.secret;
        }
        return $http.post(url, subject);
      }
    }
  };
  return result;
} ]);
