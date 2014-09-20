/**
 * all these tests assumes a things-happened-db running with the data from the
 * nodeunit run in it.
 */

'use strict';

describe('Directive: thingsCriteria', function() {

  // load the directive's module
  beforeEach(module('thingsHappened'));

  var element, scope, httpBackend, thingsDao;

  beforeEach(inject(function($injector, $rootScope) {
    jasmine.getFixtures().fixturesPath = FIXTURES_PATH;
    thingsDao = $injector.get('ThingsDao');
    httpBackend = $injector.get('$httpBackend');
    scope = $injector.get('$rootScope');
  }));

  describe('on using criteria <li things-repeat="disease in diseases" things-criteria="{location:\'Paris\'}"', function() {
    beforeEach(inject(function($injector, $rootScope) {
      loadFixtures('things-repeat-criteria-fixture.html');
    }));
    it('it should take care of things-criteria', inject(function($compile) {
      var response = [ mocks.diseases[2] ];
      httpBackend.expectGET(thingsDao.serviceurl + '/get/diseases.json?criteria={"location":"Paris"}').respond(response);
      $compile($('#fixture'))(scope);
      httpBackend.flush();
      scope.$apply();
      expect($('#fixture > li:visible').length).toBe(1);
      expect($('#fixture > li:visible').text()).toBe('Paris');
    }));
  });
});