'use strict';

/* Services */

var undercountingServices = angular.module('undercountingServices', ['ngResource']);

undercountingServices.factory('Organization', ['$resource',
  function($resource){
    return $resource('organizations/:orgId.json', {}, {
      query: {method:'GET', params:{orgId:'organizations'}, isArray:true}
    });
  }]);
