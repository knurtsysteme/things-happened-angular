beforeEach(function() {
  jasmine.addMatchers({
    toContainLiElements : function() {
      return {
        compare : function(actual, expected) {
          // FIXME fails if actual ends with </li>
          return {
            pass : actual.split('</li>').length == expected + 1
          };
        }
      };
    }
  });
});