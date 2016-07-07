'use strict';
//Define the `undercountingApp` module
var undercountingControllers = angular.module('undercountingControllers', ["xeditable", "googlechart", "ui.bootstrap"]);

//Define the `OrganizationListController` controller on the `undercountingApp` module
undercountingControllers.controller('OrganizationListController', ['$scope','Organization', function($scope, Organization) {
	$scope.organizations = Organization.query();
	$scope.orderProp = 'name';
}]);

undercountingControllers.controller('OrganizationDetailController', ['$scope', '$routeParams', '$http', '$filter', '$window', function($scope, $routeParams, $http, $filter, $window) {

	$http.get('organizations/' + $routeParams.orgId + '/client_secrets.json').success(function(data) {
		$scope.organization = data;
	});
	$http.get('organizations/' + $routeParams.orgId + '/data.json').success(function(data) {
		$scope.description = data;
	});	
	$scope.routerHost = "sanmateo-32.dev.oclc.org";
	$scope.routerPort = ":3072";
	$scope.apiRouterPort = ':3073'

		$scope.saveSites = function() {
		console.log($scope.description);
		var router = "http://"+$scope.routerHost+$scope.routerPort;
		$http.post(router, $scope.description)
		.then(function success(response) {
			console.log(response.data);
		}, function error(response) {
			console.log(response.status);
			console.log('error');
		});

	};

	$scope.addUrl = function(){
		$scope.description.urls.push('');
		console.log('row added')

	};

	$scope.cancelEdit = function(){
		var tempList = [];
		angular.forEach($scope.description.urls, function(value, key) {
			if (value.length > 0) {
				tempList.push(value);
			}
		});
		$scope.description.urls = tempList;
	};

	$scope.removeUrl = function(ind){
		var tempList = [];
		angular.forEach($scope.description.urls, function(value, key) {
			if (key != ind) {
				tempList.push(value);
			}
		});
		$scope.description.urls = tempList;
	};

	$scope.saveSecrets = function() {
		console.log($scope.organization);
		var router = "http://"+$scope.routerHost+$scope.routerPort;
		$http.post(router, $scope.organization)
		.then(function success(response) {
			console.log(response.data);
		}, function error(response) {
			console.log(response.status);
			console.log('error');
		}); 
	};

	$scope.getResults = function() {
		console.log('in the results function')
		var router = "http://"+$scope.routerHost+$scope.apiRouterPort+"?id="+$routeParams.orgId + "&task=visualize" + "&date_search="+ $filter('date')($scope.dt, "yyyy-MM-dd");
		console.log(router)
		$http({
			method: 'GET',
			url: router
		}).then(function successCallback(response) {
			console.log(response.data);
			$scope.apiData = response.data;
			$scope.myChartObject = {};
			$scope.myChartObject.type = "PieChart";
			$scope.myChartObject.data = $scope.apiData;
			$scope.myChartObject.options = {
					'title': 'Access by Device'
			};			              

		}, function errorCallback(response) {
			console.log('error');
		});
	};
		
	$scope.downloadData = function() {
		var url = "http://"+$scope.routerHost+$scope.apiRouterPort+"?id="+$routeParams.orgId + "&task=download" +"&date_search=" + $filter('date')($scope.dt, "yyyy-MM-dd");
		$window.open(url, '_blank');
	};

	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();
	
	var todayDate = new Date();
	$scope.maxDate = new Date(todayDate.setDate(todayDate.getDate()));
	$scope.minDate = new Date(todayDate.setDate(todayDate.getDate()-90));

	$scope.clear = function() {
		$scope.dt = null;
	};

	$scope.open = function() {
		$scope.popup.opened = true;
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.altInputFormats = ['M!/d!/yyyy'];

	$scope.popup = {
			opened: false
	};

}]);

undercountingControllers.run(function(editableOptions) {
	editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
