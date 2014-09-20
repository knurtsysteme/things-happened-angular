beforeEach(function() {
  jasmine.addMatchers({
    toHaveThisOrder : function() {
      return {
        compare : function(actual, order) {
          var result = false;
          if(!Array.isArray(order) || order.length <= 1) {
            console.error('need an array with at least two elements here');
          } else {
            var i = 0;
            var result = true;
            while(result && i < order.length - 1) {
              var a = order[i];
              var b = order[i+1];
              result = actual.indexOf(a) < actual.indexOf(b);
              i++;
            }
          }
          return {pass: result };
        }
      };
    }
  });
});