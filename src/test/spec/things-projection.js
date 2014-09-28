/**
 * all these tests assumes a things-happened-db running with the data from the
 * nodeunit run in it.
 */

'use strict';

describe('Directive: thingsProjection', function() {

  // load the directive's module
  beforeEach(module('thingsHappened'));

  var element, scope, httpBackend, thingsDao;

  beforeEach(inject(function($injector, $rootScope) {
    jasmine.getFixtures().fixturesPath = FIXTURES_PATH;
    thingsDao = $injector.get('thingsDao');
    httpBackend = $injector.get('$httpBackend');
    scope = $injector.get('$rootScope');
  }));

  describe('on using project <li things-repeat="disease in diseases" things-projection="{location:1}"', function() {
    beforeEach(inject(function($injector, $rootScope) {
      loadFixtures('things-repeat-projection-fixture.html');
    }));
    it('it should take care of things-projection', inject(function($compile) {
      var response = [ {
        location : 'Berlin'
      } ];
      httpBackend.expectGET(things.config.serviceurl + '/get/diseases.json?projection={"location":1}').respond(response);
      $compile($('#fixture'))(scope);
      httpBackend.flush();
      scope.$apply();
      expect($('#fixture > li:visible').length).toBe(1);
      expect($('#fixture > li:visible').text()).toBe('Berlin');
    }));
  });
});