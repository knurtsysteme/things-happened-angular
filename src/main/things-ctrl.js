angular.module('thingsHappened').controller('thingsCtrl', [ '$scope', 'thingsDao', function($scope, thingsDao) {
  $scope.add = thingsDao.add
} ]);