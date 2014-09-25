'use strict';

/* Directives */

angular.module('myApp.directives', []).

	directive('player', ['$rootScope', function($rootScope) {
		return {
			scope : {
				player : '='
			},
			link : function(scope, element, attrs) {
				if (typeof scope.player.client !== 'undefined' && scope.player.client === true) {
					$rootScope.$broadcast('registerClient', {client : scope.player});
				}
			}
		}
	}]).

	directive('action', ['$rootScope', 'utils', function($rootScope, utils) {
		return function(scope, element, attrs) {
			var s = scope;

			s.a.fx = 'border-color:' + s.a.color + ';border-width:' + s.a.borderSize + 'px;';

			s._toId = window.setTimeout(function() {
				utils.hitTest({
					x : s.a.cellX,
					y : s.a.cellY,
					diameter : s.a.cellSize,
					grids : [scope.level.bits, scope.players],
					ignore : {
						path : true,
						cls : 'static'
					}
				}, function(hit) {
					$rootScope.$broadcast('actionHit', {
						type : 'bomb',
						hit : hit
					});
				});

				s.a.fx = 'box-shadow: 0 ' + s.a.size + 'px 0px 0px ' + s.a.color + ', ' + s.a.size + 'px 0 0px 0px ' + s.a.color + ', 0 -' + s.a.size + 'px 0px 0px ' + s.a.color + ', -' + s.a.size + 'px 0 0px 0px ' + s.a.color + ';';
				element.addClass('fire');
				s.$apply();

				s.a.path = true;

				$rootScope.$broadcast('actionReplenish', {
					client : s.a.client
				});
			}, s.a.delay);
		}
	}]).

	directive('level', ['$rootScope', 'utils', function($rootScope, utils) {
		return {
			scope : {
				level : '=',
				client : '='
			},
			link : function(scope, element, attrs) {
				var hmEl = new Hammer(element[0]);
					gridSize = scope.level.gridSize,
					tempCellX = 0,
					tempCellY = 0,
					tempTapX = 0,
					tempTapY = 0,
					oldDeltaCellX = 0,
					oldDeltaCellY = 0,
					actionStyle = '';

				hmEl.get('pan').set({ direction: Hammer.DIRECTION_ALL });
				hmEl.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

				function getCell(x, y) {
					var	levelOffset = $('#level_content').offset(),
						tapX = (x-levelOffset.left) / scope.level.gridSize,
						tapY = (y-levelOffset.top) / scope.level.gridSize;

					if (tapX > scope.client.cellX + 1) {
						tapX = Math.ceil(tapX) - 1;
					} else if (tapX < scope.client.cellX) {
						tapX = Math.floor(tapX);
					} else {
						tapX = scope.client.cellX;
					}

					if (tapY > scope.client.cellY + 1) {
						tapY = Math.ceil(tapY) - 1;
					} else if (tapY < scope.client.cellY) {
						tapY = Math.floor(tapY);
					} else {
						tapY = scope.client.cellY;
					}

					return {
						x : tapX,
						y : tapY
					};
				}

				var moveFunc = function(e) {
					// Pan is not working quite right, cant pan up or left
					var cell = getCell(e.center.x, e.center.y),
						deltaCellX =  cell.x - tempTapX,
						deltaCellY =  cell.y - tempTapY,
						cellX = tempCellX + deltaCellX,
						cellY = tempCellY + deltaCellY;

					if (deltaCellX !== oldDeltaCellX || deltaCellY !== oldDeltaCellY) {
						// old values are used to only do a hit test when the cell changes
						oldDeltaCellX = deltaCellX;
						oldDeltaCellY = deltaCellY;

						utils.hitMoveTest({
							oldX : scope.client.cellX,
							oldY : scope.client.cellY,
							newX : cellX,
							newY : cellY,
							grids : [scope.level.bits, scope.level.actions],
							ignore : {
								path : true
							}
						}, function(hits) {
							
							if (hits.length === 0 && !(cellX !== scope.client.cellX && cellY !== scope.client.cellY)) {
								if (cellX >= 0 && cellX < scope.level.gridCount) {
									scope.client.cellX = cellX;
								}

								if (cellY >= 0 && cellY < scope.level.gridCount) {
									scope.client.cellY = cellY;
								}

								scope.$apply();
							}
						});
					}
				};

				var upFunc = function(e) {
					hmEl.off('panmove', moveFunc);
					hmEl.off('panend', upFunc);
				};
// paning is a little buggy
				// hmEl.on('panstart', function(e) {
				// 	levelOffset = $('#level_content').offset();
				// 	tempCellX = scope.client.cellX;
				// 	tempCellY = scope.client.cellY;

				// 	hmEl.on('panmove', moveFunc);
				// 	hmEl.on('panend', upFunc);
				// });

				hmEl.on('tap', function(e) {
					if (e.target.id === scope.client.id) {
						if (scope.client.actions > 0) {
							var dimension = scope.client.power*scope.level.gridSize;

							scope.level.actions.push({
								cls : 'bomb',
								cellX : scope.client.cellX,
								cellY : scope.client.cellY,
								color : scope.client.color,
								borderSize : scope.level.gridSize/2,
								size : dimension,
								cellSize : dimension/scope.level.gridSize,
								delay : scope.client.actionDelay,
								client : scope.client,
								path : false
							});

							scope.client.actions--;
							scope.$apply();
						}
					} else {
						var cell = getCell(e.center.x, e.center.y);
						
						utils.hitMoveTest({
							oldX : scope.client.cellX,
							oldY : scope.client.cellY,
							newX : cell.x,
							newY : cell.y,
							grids : [scope.level.bits, scope.level.actions],
							ignore : {
								path : true
							}
						}, function(hits) {
							if (hits.length === 0 && !(cell.x !== scope.client.cellX && cell.y !== scope.client.cellY)) {
								if (cell.x >= 0 && cell.x < scope.level.gridCount) {
									scope.client.cellX = cell.x;
								}

								if (cell.y >= 0 && cell.y < scope.level.gridCount) {
									scope.client.cellY = cell.y;
								}

								scope.$apply();
							}
						});
					}
				});

				$rootScope.$on('actionHit', function(e, data) {	
					var hitIdx;
				
					if (data.hit.type === 'bit' && data.hit.cls !== 'static') {
						hitIdx = scope.level.bits.indexOf(data.hit);
						scope.level.bits[hitIdx].path = true;
					}

					if (data.hit.type === 'player') {
						if (data.hit.health > 0) {
							data.hit.health--;
						} else {
							// remove player
						}
					}

					scope.$apply();
				});

				$rootScope.$on('actionReplenish', function(e, data) {	
					if (data.client.actions < data.client.maxActions) {
						data.client.actions++;
						scope.$apply();
					}
				});
			}
		}
	}]);