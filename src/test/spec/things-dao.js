'use strict';

describe('Service: ThingsDao', function() {

  // load the service's module
  beforeEach(module('thingsHappened'));

  // instantiate service
  var thingsDao, httpBackend;
  beforeEach(inject(function($injector) {
    thingsDao = $injector.get('ThingsDao');
    httpBackend = $injector.get('$httpBackend');
  }));

  it('should do something', function() {
    expect(!!thingsDao).toBe(true);
  });

  it('should support a things query', function(done) {
    httpBackend.expectGET(thingsDao.serviceurl + '/count/schools.json').respond({
      _ok : 1
    });
    var query = ThingsQuery.select('schools').count();
    thingsDao.query(query).success(function(response) {
      expect(response._ok).toBe(1);
      done();
    });
    httpBackend.flush();
  });
  describe('if only diseases with location = paris are requested', function() {
    it('should return only those diseases', function(done) {
      var paris = [ mocks.diseases[2] ];
      httpBackend.expectGET(thingsDao.serviceurl + '/get/diseases.json?criteria={"location":"paris"}').respond(paris);
      var http = thingsDao.get('diseases', {
        location : 'paris'
      });
      expect(http).toBeDefined();
      http.success(function(diseases) {
        expect(diseases).toBeDefined();
        expect(diseases.length).toBe(1);
        done();
      }).error(function() {
        expect(true).toBe(false);
        done();
      });
      httpBackend.flush();
    });
  });
  describe('if all diseases are requested and diseases are there', function() {
    it('should return an array of all diseases', function(done) {
      httpBackend.expectGET(thingsDao.serviceurl + '/get/diseases.json').respond(mocks.diseases);
      thingsDao.get('diseases').success(function(diseases) {
        expect(diseases).toBeDefined();
        expect(diseases.length).toBe(4);
        expect(diseases[0]._id).toBe('53b9793af9d800d7313870a3');
        done();
      });
      httpBackend.flush();
    });
  });
  describe('if diseases noticed are requested', function() {
    it('should return an array of all diseases noticed', function(done) {
      var diseasesNoticed = [];
      mocks.diseases.forEach(function(disease) {
        if (disease._status == 'occured') {
          diseasesNoticed.push(disease);
        }
      });
      httpBackend.expectGET(thingsDao.serviceurl + '/get/diseases/noticed.json').respond(diseasesNoticed);
      thingsDao.get([ 'diseases', 'noticed' ]).success(function(diseases) {
        expect(diseases).toBeDefined();
        expect(diseases.length).toBe(diseasesNoticed.length);
        done();
      });
      httpBackend.flush();
    });
  });
  describe('user like to know what happened to things', function() {
    it('should support this query', function() {
      var response = [ "hailed", "noticed", "occured" ];
      httpBackend.expectGET(thingsDao.serviceurl + '/get/happened/to/diseases.json').respond(response);
      thingsDao.getHappenedTo('diseases').success(function(diseases) {
        expect(diseases.length).toBe(response.length);
        expect(diseases[0]).toBe(response[0]);
        expect(diseases[1]).toBe(response[1]);
      });
      httpBackend.flush();
    });
  });
  describe('user has a global secret defined and', function() {
    var car = {
      color : 'red',
      vendor : 'Skoda'
    };
    beforeEach(inject(function($injector) {
      ThingsConfig.secret = 'testsecret_x8T12_geheim';
    }));
    afterEach(inject(function($injector) {
      ThingsConfig.secret = false;
    }));
    describe('user request things', function() {
      it('should get only things with that secret', function(done) {
        httpBackend.when('GET', thingsDao.serviceurl + '/get/cars.json?criteria={"_secret":"testsecret_x8T12_geheim"}').respond([ car ]);
        thingsDao.get('cars').success(function(result) {
          expect(result).toBeDefined();
          done();
        });
        httpBackend.flush();

      });
      it('should request NOT only things with that secret IF more secret explicitly not requested', function(done) {
        httpBackend.when('GET', thingsDao.serviceurl + '/get/cars.json').respond([ car ]);
        thingsDao.get('cars', {
          _secret : false
        }).success(function(result) {
          expect(result).toBeDefined();
          done();
        });
        httpBackend.flush();
      });
    });
  });
  describe('user want to insert a disease to diseases occured', function() {
    describe('and everything is complete', function() {
      it('should insert it and support a result object', function(done) {
        var disease = {
          location : 'Flensburg',
          diagnosis : 'cancer'
        };
        var mockResponse = mocks.getDiseaseAnswer(disease);
        httpBackend.when('POST', thingsDao.serviceurl + '/addto/diseases/occured.json').respond(mockResponse);
        thingsDao.add(disease).to('diseases', 'occured').success(function(result) {
          expect(result).toBeDefined();
          expect(result._ok).toBe(1);
          expect(result.location).toBe(disease.location);
          expect(result._state).toBe('occured');
          expect(result._cn).toBe('diseases');
          expect(result._pid).toBe(null);
          done();
        });
        httpBackend.flush();

      });
    });
  });

});
