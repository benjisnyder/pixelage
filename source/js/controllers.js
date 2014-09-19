'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('PlayCtrl', ['$scope', 'context', '$rootScope', function($scope, context, $rootScope) {
		$scope.players = context.players;
		$scope.level = context.level;
		$scope.client = null;

		$rootScope.$on('registerClient', function(e, data) {
			$scope.client = data.client;
		});
	}]);
