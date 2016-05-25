'use strict';
//Define the `undercountingApp` module
var undercountingControllers = angular.module('undercountingControllers', ["xeditable"]);

//Define the `OrganizationListController` controller on the `undercountingApp` module
undercountingControllers.controller('OrganizationListController', ['$scope','Organization', function($scope, Organization) {
	$scope.organizations = Organization.query();
	$scope.orderProp = 'name';
}]);

undercountingControllers.controller('OrganizationDetailController', ['$scope', '$routeParams', 'Organization',function($scope, $routeParams, Organization) {
	$scope.organization = Organization.get({orgId: $routeParams.orgId});
	$scope.test
	$scope.visible = false;
	$scope.toggle = function() {
		$scope.visible = !$scope.visible;
	};
}]);

undercountingControllers.controller('profileEditor', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

	$http.get('organizations/' + $routeParams.orgId + '.json').success(function(data) {
	  console.log('refreshing scope.organization with organizations/' + $routeParams.orgId + '.json');
		$scope.organization = data;
	});
	
	$scope.routerHost = "sanmateo-32.dev.oclc.org";
	$scope.routerPort = ":3072";

	$scope.saveOrganization = function() {
		console.log($scope.organization);
		var router = "http://"+$scope.routerHost+$scope.routerPort;
		$http.post(router, $scope.organization)
			.then(function success(response) {
				console.log(response.data);
			}, function error(response) {
				console.log(response.status);
			}); 
	};
	
}]);

undercountingControllers.run(function(editableOptions) {
	editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});