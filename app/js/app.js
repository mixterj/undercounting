'use strict';

/* App Module */

var undercountingApp = angular.module('undercountingApp', [
  'ngRoute',
  'undercountingControllers',
  'undercountingServices'
]);

undercountingApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/organization', {
        templateUrl: 'partials/org-list.html',
        controller: 'OrganizationListController'
      }).
      when('/organization/:orgId', {
        templateUrl: 'partials/org-detail.html',
        controller: 'OrganizationDetailController'
      }).
      otherwise({
        redirectTo: '/organization'
      });
  }]);