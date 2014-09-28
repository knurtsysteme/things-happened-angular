/**
 * all these tests assumes a things-happened-db running with the data from the
 * nodeunit run in it.
 */

'use strict';

describe('Directive: thingsRepeat', function() {

  // load the directive's module
  beforeEach(module('thingsHappened'));

  var element, scope, httpBackend, thingsDao;

  beforeEach(inject(function($injector, $rootScope) {
    jasmine.getFixtures().fixturesPath = FIXTURES_PATH;
    thingsDao = $injector.get('thingsDao');
    httpBackend = $injector.get('$httpBackend');
    scope = $injector.get('$rootScope');
  }));

  describe('if html is <li things-repeat></li>', function() {
    it('it should ignore it', inject(function($compile) {
      element = angular.element('<div things-repeat></div>');
      element = $compile(element)(scope);
      expect(element.text()).toBe('');
    }));
  });
  describe('if html is <li things-repeat="disease in diseases">{{disease.location}}</li>', function() {
    describe('and there are diseases in the db having locations', function() {
      beforeEach(inject(function($injector, $rootScope) {
        loadFixtures('things-repeat-fixture.html');
      }));
      it('it should iterate these (Test 201407251134)', inject(function($compile) {
        httpBackend.expectGET(things.config.serviceurl + '/get/diseases.json').respond(mocks.diseases);
        $compile($('#fixture'))(scope);
        httpBackend.flush();
        scope.$apply();
        expect($('#fixture').html()).toContain('>Paris<');
        expect($('#fixture').html()).toContain('>Mexico City<');
        expect($('#fixture').html()).toContain('>New York City<');
        expect($('#fixture > li:visible').length).toBe(4);
      }));
    });
    describe('and there are no diseases', function() {
      it('it should iterate nothing', inject(function($compile) {
        $compile($('#fixture'))(scope);
        scope.$apply();
        expect($('#fixture > li:visible').length).toBe(0);
      }));
    });
  });
  describe('if user pipes something like <li things-repeat="disease in diseases | orderBy:\'location\'"', function() {
    beforeEach(inject(function($injector, $rootScope) {
      loadFixtures('things-repeat-pipe-fixture.html');
    }));
    it('it should support piped things', inject(function($compile) {
      httpBackend.expectGET(things.config.serviceurl + '/get/diseases.json').respond(mocks.diseases);
      $compile($('#fixture'))(scope);
      httpBackend.flush();
      scope.$apply();
      expect($('#fixture > li:visible').length).toBe(4);
      expect($('#fixture').html()).toContain('>Paris<');
      expect($('#fixture').html()).toContain('>Mexico City<');
      expect($('#fixture').html()).toContain('>New York City<');
      expect($('#fixture').html()).toHaveThisOrder([ 'Mexico', 'New York', 'Paris' ]);
    }));
  });
  // TEST 201407252131
  describe('if things is a variable in the scope and it changes', function() {
    beforeEach(inject(function($injector, $rootScope) {
      loadFixtures('things-repeat-var-fixture.html');
    }));
    it('should run even with empty things', inject(function($compile) {
      $compile($('#fixture'))(scope);
      scope.$apply();
      expect($('#fixture > li:visible').length).toBe(0);
    }));
    it('should update the view', inject(function($compile) {
      $compile($('#fixture'))(scope);
      scope.$apply();
      httpBackend.expectGET(things.config.serviceurl + '/get/diseases.json').respond(mocks.diseases);
      scope.myThings = 'diseases';
      httpBackend.flush();
      scope.$apply();
      expect($('#fixture > li:visible').length).toBe(mocks.diseases.length);

      httpBackend.expectGET(things.config.serviceurl + '/get/cars.json').respond(mocks.cars);
      scope.myThings = 'cars';
      httpBackend.flush();
      scope.$apply();
      expect($('#fixture > li:visible').length).toBe(mocks.cars.length);
    }));
  });
});