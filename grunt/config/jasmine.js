var getVendors = function() {
  var result = [];
  result.push('bower_components/es5-shim/es5-shim.js');
  result.push('bower_components/jasmine/lib/jasmine-core/jasmine.js');
  result.push('bower_components/jasmine/lib/jasmine-core/jasmine-html.js');
  result.push('bower_components/jasmine/lib/jasmine-core/boot.js');
  result.push('bower_components/jquery/dist/jquery.min.js');
  result.push('bower_components/angular/angular.js');
  result.push('bower_components/angular-mocks/angular-mocks.js');
  result.push('bower_components/jasmine-jquery/lib/jasmine-jquery.js');
  result.push('bower_components/things-happened-util/dist/things-happened-util.js');
  return result;
}

module.exports = {
  core : {
    src : [ 'src/main/things-happened.js', 'src/main/*.js' ],
    options : {
      specs : 'src/test/spec/*.js',
      helpers : [ 'src/test/helpers/grunt-run.js', 'src/test/mock/*.js', 'src/test/helpers/matchers/*.js' ],
      vendor : getVendors()
    }
  }
};
