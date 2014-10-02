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


				// var horizontal = new Hammer.Pan({
				//     event: 'panh',
				//     direction: Hammer.DIRECTION_HORIZONTAL
				// });
				// var vertical = new Hammer.Pan({
				//     event: 'panv',
				//     direction: Hammer.DIRECTION_VERTICAL
				// });
				// vertical.requireFailure(horizontal);

				hmEl.get('pan').set({ 
					direction: Hammer.DIRECTION_ALL,
					time : 0
				 });
				hmEl.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
				hmEl.get('press').set({ time: 0 });

				function valUp(val) {
					scope.client[val]++;
				};

				function valDown(val) {
					scope.client[val]--;
				};

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

				function doMove(newX, newY) {
					utils.hitMoveTest({
						oldX : scope.client.cellX,
						oldY : scope.client.cellY,
						newX : newX,
						newY : newY,
						grids : [scope.level.bits, scope.level.actions],
						ignore : {
							path : true
						}
					}, function(result) {
						if ((result.type !== 'bit' || result.path === 'active' || result.cls === 'diode') && !(newX !== scope.client.cellX && newY !== scope.client.cellY)) {
							if (newX >= 0 && newX < scope.level.gridCount) {
								scope.client.cellX = newX;
							}

							if (newY >= 0 && newY < scope.level.gridCount) {
								scope.client.cellY = newY;
							}

							switch(result.cls) {
								case 'power':
								case 'health':
									if (result.path === 'active') {
										valUp(result.cls);
										result.path = true;
									}
									break;
								case 'diode':
									valUp('diode');
									result.path = true;
									break;
							}

							scope.$apply();
							console.log('----doMove---');
							console.log(scope.client.cellX);
						}
					});
				}

				function setBaseLines() {console.log(scope.client.cellX);
					tempCellX = scope.client.cellX;
					tempCellY = scope.client.cellY;
				}

				function doPan(e, axis, direction) {
					var xy = axis === 'x' ? tempCellX : tempCellY,
						distance = Math.round(e.distance/scope.level.gridSize);
					//console.log(xy);
					if (direction === 'up' || direction === 'left') {
						distance = xy - distance;
					} else {
						distance = xy + distance;
					}

					if (distance >= 0 && distance <= scope.level.gridCount) {
						if (axis === 'x' && (distance !== scope.client.cellX)) {
							doMove(distance, tempCellY);
						} else if (distance !== scope.client.cellY) {
							doMove(tempCellX, distance);
						}
					}
				}

				hmEl.on('panstart', function(e) {
					setBaseLines();
				});


				hmEl.on('panup', function(e) {
					doPan(e, 'y', 'up');
				});

				hmEl.on('pandown', function(e) {
					doPan(e, 'y', 'down');
				});

				hmEl.on('panleft', function(e) {
					doPan(e, 'x', 'left');
				});

				hmEl.on('panright', function(e) {
					doPan(e, 'x', 'right');
				});

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
						
						doMove(cell.x, cell.y);
					}
				});

				$rootScope.$on('actionHit', function(e, data) {	
					//var hitIdx;
				
					if (data.hit.type === 'bit' && data.hit.cls !== 'static') {
						//hitIdx = scope.level.bits.indexOf(data.hit);
						switch(data.hit.cls) {
							case 'power':
							case 'health':
								if (data.hit.path !== 'active') {
									data.hit.path = 'active';
								} else {
									data.hit.path = true;
								}
								break;
							case 'diode':
								data.hit.path = true;
								break;
							case 'destructible':
								data.hit.path = true;
								break;
						}
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