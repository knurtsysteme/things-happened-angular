describe('Directive: thingsCount', function() {
  describe('app knows the directive things-count', function() {
    beforeEach(module('thingsHappened'));

    var element, scope, httpBackend, thingsDao;

    beforeEach(inject(function($injector, $rootScope) {
      jasmine.getFixtures().fixturesPath = FIXTURES_PATH;
      thingsDao = $injector.get('thingsDao');
      httpBackend = $injector.get('$httpBackend');
      scope = $injector.get('$rootScope');
    }));

    it('things-count responses the count of all documents', inject(function($compile) {
      loadFixtures('things-count-default-fixture.html');
      var response = {
        diseases : 33,
        dogs : 4,
        _total : 37,
        _ok : 1
      };
      httpBackend.expectGET(things.config.serviceurl + '/count/things.json').respond(response);
      $compile($('#fixture'))(scope);
      httpBackend.flush();
      scope.$apply();
      expect($('#fixture').html()).toBe('37');
    }));

    it('things-count="\'dogs\'" responses the count of all dogs', inject(function($compile) {
      loadFixtures('things-count-cn-fixture.html');
      var response = {
        _cn : "dogs",
        result : 4,
        _ok : 1
      };
      httpBackend.expectGET(things.config.serviceurl + '/count/dogs.json').respond(response);
      $compile($('#fixture'))(scope);
      httpBackend.flush();
      scope.$apply();
      expect($('#fixture').html()).toBe('4');
    }));

    it('things-count="\'dogs runaway\'" responses all dogs run away', inject(function($compile) {
      loadFixtures('things-count-cn-state-fixture.html');
      var response = {
        _cn : "dogs",
        _state : "runaway",
        result : 5,
        _ok : 1
      };
      httpBackend.expectGET(things.config.serviceurl + '/count/dogs/runaway.json').respond(response);
      $compile($('#fixture'))(scope);
      httpBackend.flush();
      scope.$apply();
      expect($('#fixture').html()).toBe('5');
    }));

  });
});
