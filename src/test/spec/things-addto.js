'use strict';

describe('Directive: thingsAddto', function() {

  // load the directive's module
  beforeEach(module('thingsHappened'));

  var element, scope, $httpBackend, thingsDao;

  beforeEach(inject(function($injector, $rootScope) {
    thingsDao = $injector.get('ThingsDao');
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
  }));

  it('should make a ng-submit out of it', inject(function($compile) {
    $httpBackend.expectGET(thingsDao.serviceurl + '/addto/diseases/occured.json').respond(mocks.diseases);
    var html = '<form things-addto="diseases occured"><input type="text" name="location" /></form>';
    element = angular.element('<div>' + html + '</div>');
    element = $compile(element)(scope);
    expect(element.html()).toContain('ng-model="things1.location"');
    expect(element.html()).toContain('ng-model="things1"');
    expect(element.html()).toContain('ng-submit="things1Function()"');
  }));
  it('should wrap it in an own success feedback', inject(function($compile) {
    $httpBackend.expectGET(thingsDao.serviceurl + '/addto/diseases/occured.json').respond(mocks.diseases);
    var html = '<form things-addto="diseases occured"><input type="text" name="location" /></form>';
    element = angular.element('<div>' + html + '</div>');
    element = $compile(element)(scope);
    expect(scope.things1Function).toBeDefined();
    expect(scope.things1).toBeDefined();
  }));
});
