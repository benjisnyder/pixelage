'use strict';

/* Directives */

angular.module('myApp.directives', []).

	directive('player', ['$rootScope', function($rootScope) {
		return {
			scope : {
				player : '='
			},
			link : function(scope, element, attrs) {
				if (typeof scope.player.client !== 'typeof' && scope.player.client === true) {
					$rootScope.$broadcast('registerClient', {client : scope.player});
				}
			}
		}
	}]).

	directive('action', ['$rootScope', 'utils', function($rootScope, utils) {
		return function(scope, element, attrs) {
			var s = scope;

			setTimeout(function() {
				utils.hitTest({
					x : s.a.cellX,
					y : s.a.cellY,
					diameter : s.a.cellSize,
					grids : [scope.level.bits]
				}, function(hit) {
					// hit test will only return cells that have path == false
					$rootScope.$broadcast('actionHit', {
						type : 'bomb',
						source : s.a,
						hit : hit
					});
				});

				s.a.fx = 'box-shadow: 0 ' + s.a.size + 'px 0px 0px ' + s.a.color + ', ' + s.a.size + 'px 0 0px 0px ' + s.a.color + ', 0 -' + s.a.size + 'px 0px 0px ' + s.a.color + ', -' + s.a.size + 'px 0 0px 0px ' + s.a.color + ';';
				element.addClass('fire');
				s.$apply();
			}, 1000);
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
					levelOffset = null,
					tempCellX = 0,
					tempCellY = 0,
					tempTapX = 0,
					tempTapY = 0,
					oldDeltaCellX = 0,
					oldDeltaCellY = 0,
					hitObj = {},
					actionStyle = '';

				hmEl.get('pan').set({ direction: Hammer.DIRECTION_ALL });
				hmEl.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

				var moveFunc = function(e) {
					var curTapCellX = Math.round(e.center.x / scope.level.gridSize),
						curTapCellY = Math.round(e.center.y / scope.level.gridSize), 
						deltaCellX =  curTapCellX - tempTapX,
						deltaCellY =  curTapCellY - tempTapY,
						cellX = tempCellX + deltaCellX,
						cellY = tempCellY + deltaCellY,
						doUpdateX = true,
						doUpdateY = true;

					if (deltaCellX !== oldDeltaCellX || deltaCellY !== oldDeltaCellY) {
						// old values are used to only do a hit test when the cell changes
						oldDeltaCellX = deltaCellX;
						oldDeltaCellY = deltaCellY;

						hitObj = utils.hitMoveTest({
							oldX : scope.client.cellX,
							oldY : scope.client.cellY,
							newX : cellX,
							newY : cellY,
							grids : [scope.level.bits, scope.level.actions]
						}, true);

						if (
							(hitObj.path === false)
							||
							(cellX !== scope.client.cellX && cellY !== scope.client.cellY)
						)
						{
							doUpdateX = false;
							doUpdateY = false;
						}

						if (doUpdateX && (cellX >= 0 && cellX < scope.level.gridCount)) {
							scope.client.cellX = cellX;
						}

						if (doUpdateY && (cellY >= 0 && cellY < scope.level.gridCount)) {
							scope.client.cellY = cellY;
						}
					}

					scope.$apply();
				};

				var upFunc = function(e) {
					hmEl.off('panmove', moveFunc);
					hmEl.off('panend', upFunc);
				};

				hmEl.on('panstart', function(e) {
					levelOffset = $('#level_content').offset();
					tempCellX = scope.client.cellX;
					tempCellY = scope.client.cellY;
					tempTapX = Math.round(e.center.x / scope.level.gridSize);
					tempTapY = Math.round(e.center.y / scope.level.gridSize);
					
					hmEl.on('panmove', moveFunc);
					hmEl.on('panend', upFunc);
				});

				hmEl.on('tap', function() {
					var dimension = scope.client.power*scope.level.gridSize;

					actionStyle = 'border-color:' + scope.client.color + ';border-width:' + scope.level.gridSize/2 + 'px;';

					scope.level.actions.push({
						cls : 'bomb',
						cellX : scope.client.cellX,
						cellY : scope.client.cellY,
						color : scope.client.color,
						size : dimension,
						cellSize : dimension/scope.level.gridSize,
						fx : actionStyle,
						path : false
					});

					scope.$apply();
				});

				$rootScope.$on('actionHit', function(e, data) {	
					var idx = data.hit.cellY*scope.level.gridCount + data.hit.cellX;
					
					if (data.hit.type === 'bit') {
						scope.level.bits[idx].path = true;
					}

					scope.$apply();
					// switch(data.type) {
					// 	case 'bomb'
					// }
					//console.log(data);
				});
			}
		}
	}]);