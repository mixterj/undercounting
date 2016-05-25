'use strict';
//Define the `undercountingApp` module
var undercountingControllers = angular.module('undercountingControllers', ["xeditable"]);

//Define the `OrganizationListController` controller on the `undercountingApp` module
undercountingControllers.controller('OrganizationListController', ['$scope','Organization', function($scope, Organization) {
	$scope.organizations = Organization.query();
	$scope.orderProp = 'name';
}]);

undercountingControllers.controller('OrganizationDetailController', ['$scope', '$routeParams', 'Organization',
                                                                     function($scope, $routeParams, Organization) {
	$scope.organization = Organization.get({orgId: $routeParams.orgId});
	$scope.test
	$scope.visible = false;
	$scope.toggle = function() {
		$scope.visible = !$scope.visible;
	};
}]);

undercountingControllers.controller('profileEditor', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {

	$http.get('organizations/' + $routeParams.orgId + '.json').success(function(data) {
		$scope.organization = data;
	});

	 $scope.saveOrganization = function() {
		 console.log('we made it!') 
		 //$http.post("scripts/router.js", {'urls':profile.url})
	  };
	}]);

undercountingControllers.run(function(editableOptions) {
	editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});  