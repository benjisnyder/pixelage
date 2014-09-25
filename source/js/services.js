'use strict';

/* Services */

angular.module('myApp.services', []).

	factory('utils', ['$rootScope', function($rootScope) {
		return {
			/*
			** data {
			** 		oldX, oldY, newX, newY, griditems [array of objects]
			** }
			}
			*/

			hitMoveTest : function(data, callback) {
				var grid,
					hits = [];

				if (typeof callback !== 'function') {
					// make the call back code easier to write;
					callback = function() {};
				}

				var isCellMatch = function(data, target) {
					if (typeof data.ignore !== 'undefined') {
						for (var k in data.ignore) {
							if ((data.ignore.hasOwnProperty(k) && target.hasOwnProperty(k)) && (target[k] === data.ignore[k]) ) {
								return false;
							} else {
								break;
							}
						}
					}

					// Check if the user is on top of an element, if so, ignore cell match
					if (
						(data.oldX === data.newX && data.newX === target.cellX)
						&&
						(data.oldY === data.newY && data.newY === target.cellY)
						) {
						return false;
					}

					if (
						data.newX === target.cellX 
						&&
						((data.newY > target.cellY && data.oldY < target.cellY)
						||
						(data.newY < target.cellY && data.oldY > target.cellY))
						) {
						return true;
					}

					if (
						data.newY === target.cellY 
						&&
						((data.newX > target.cellX && data.oldX < target.cellX)
						||
						(data.newX < target.cellX && data.oldX > target.cellX))
						) {
						return true;
					}

					if (target.cellX === data.newX && target.cellY === data.newY) {
						return true;
					}

					return false;
				}

				// check array of grid items
				for (var sI = 0, sL = data.grids.length; sI < sL; sI++) {
					grid = data.grids[sI];

					for (var i = 0, l = grid.length; i < l; i ++) {
						o = grid[i];

						if (isCellMatch(data, o)) {
							hits.push(o);
						}
					}
				}

				callback(hits);
			},

			hitTest : function(data, callback) {
				var grid,
					d = data.diameter,
					execute = true,
					o;
				
				cb = function(obj) {
					if (typeof callback !== 'function') {
						callback(obj);
					}
				};

				function checkMatch(targ, data) {
					if (typeof d !== 'undefined') {
						if ( (targ.cellY >= data.y - d && targ.cellY < data.y) && targ.cellX === data.x) {
							// to the top
							callback(targ);
						} else if ((targ.cellX <= data.x + d && targ.cellX > data.x) && o.cellY === data.y) {
							// to the right
							callback(targ);
						} else if ((targ.cellY <= data.y + d && targ.cellY > data.y) && targ.cellX === data.x) {
							// to the bottom
							callback(targ);
						} else if ((targ.cellX >= data.x - d && targ.cellX < data.x) && targ.cellY === data.y) {
							// to the left
							callback(targ);
						}
					} else {
						if (targ.cellX === data.x && targ.cellY === data.y && !o._hit) {
							callback(targ);
						}
					}
				}

				// check array of grid items
				for (var sI = 0, sL = data.grids.length; sI < sL; sI++) {
					grid = data.grids[sI];

					for (var i = 0, l = grid.length; i < l; i ++) {
						o = grid[i];

						if (typeof data.ignore !== 'undefined') {
							for (var k in data.ignore) {
								if ( (data.ignore.hasOwnProperty(k) && o.hasOwnProperty(k)) && (o[k] === data.ignore[k]) ) {
									execute = false;
								}
							}

							if (execute) {
								checkMatch(o, data);
							}

							execute = true;
						} else {
							checkMatch(o, data);
						}
					}
				}
			},

			ngApply : function($sc, func) {
				if(!$sc.$$phase && $sc) {
					if (func) {
						$sc.$apply(function() {
							func();
						});
					} else {
						$sc.$apply();
					}
				} else if (func) {
					func();
				}
			}
		}
	}]);