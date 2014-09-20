beforeEach(function() {
  jasmine.addMatchers({
    toContain : function() {
      return {
        compare : function(actual, expected) {
          return {
            pass : actual.indexOf(expected) >= 0
          };
        }
      };
    }
  });
});