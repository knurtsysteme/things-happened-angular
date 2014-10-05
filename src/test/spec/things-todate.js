'use strict';

describe('provide filter todate', function() {

  // load the directive's module
  beforeEach(module('thingsHappened'));

  var element, scope, httpBackend, thingsDao;

  beforeEach(inject(function($injector, $rootScope) {
    jasmine.getFixtures().fixturesPath = FIXTURES_PATH;
    thingsDao = $injector.get('thingsDao');
    httpBackend = $injector.get('$httpBackend');
    scope = $injector.get('$rootScope');
  }));

  it('should make a js Date object from the _date field', inject(function($compile) {
    scope.thing = {
      _date : '201410050704'
    };
    element = angular.element('<div>{{thing | todate | date:\'yyyy-MM-dd HH:mm:ss\'}}</div>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('2014-10-05 07:04:00');
  }));
  describe('when a first Parameter is given', function() {
    it('should use the field of the first parameter', inject(function($compile) {
      scope.thing = {
        foo : '201410050704'
      };
      element = angular.element('<div>{{thing | todate : \'foo\' | date:\'yyyy-MM-dd HH:mm:ss\'}}</div>');
      element = $compile(element)(scope);
      scope.$apply();
      expect(element.text()).toBe('2014-10-05 07:04:00');
    }));
    it('should use null on unset fields', inject(function($compile) {
      scope.thing = {
          foo : '201410050704'
      };
      element = angular.element('<div>{{thing | todate : \'bar\' | date:\'yyyy-MM-dd HH:mm:ss\'}}</div>');
      element = $compile(element)(scope);
      scope.$apply();
      expect(element.text()).toBe('');
    }));
  });
});