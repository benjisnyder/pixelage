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

			hitMoveTest : function(data, slide) {
				var grid;

				var isCellMatch = function(data, target, slide) {
					// Check if the user is on top of an element
					if (
						(data.oldX === data.newX && data.newX === target.cellX)
						&&
						(data.oldY === data.newY && data.newY === target.cellY)
						) {
						return false;
					}

					if (slide === true) {
						// if user dragged really fast past a bit...
						// this says if the historic Y (tempCellY) is known to have been
						// on one side or the other and now its trying to be on the other side
						// then that should register a positive hit test. (if they are on the same opposite plane)
						console.log(data.oldY);
						console.log(data.newY);
						console.log(target.cellY);
						if (
							(data.newY > target.cellY && data.oldY < target.cellY && data.newX === target.cellX)
							||
							(data.newY < target.cellY && data.oldY > target.cellY && data.newX === target.cellX)
							) {
							return true;
						}

						if (
							(data.newX > target.cellX && data.oldX < target.cellX && data.newY === target.cellY)
							||
							(data.newX <= target.cellX && data.oldX > target.cellX && data.newY === target.cellY)
							) {
							return true;
						}
					}

					if (target.cellX === data.newX && target.cellY === data.newY) {
						return true;
					}

					return false;
				}

				// check array of grid items
				for (var sI = 0, sL = data.grids.length; sI < sL; sI++) {
					grid = data.grids[sI];
//console.log(grid);
					for (var i = 0, l = grid.length; i < l; i ++) {
						o = grid[i];

						if (isCellMatch(data, o, slide)) {
							return o;
						}
					}
				}

				return false;
			},

			hitTest : function(data, callback) {
				var grid,
					d = data.diameter,
					ret = [],
					o;

				if (typeof callback !== 'function') {
					// make the call back code easier to write;
					callback = function() {};
				}

				// check array of grid items
				for (var sI = 0, sL = data.grids.length; sI < sL; sI++) {
					grid = data.grids[sI];

					for (var i = 0, l = grid.length; i < l; i ++) {
						o = grid[i];

						if (o.path === false && o.cls !== 'static') {
							if (typeof d !== 'undefined') {
								if ( (o.cellY >= data.y - d && o.cellY < data.y) && o.cellX === data.x) {
									// to the top
									callback(o);
									ret.push(o);
								} else if ((o.cellX <= data.x + d && o.cellX > data.x) && o.cellY === data.y) {
									// to the right
									callback(o);
									ret.push(o);
								} else if ((o.cellY <= data.y + d && o.cellY > data.y) && o.cellX === data.x) {
									// to the bottom
									callback(o);
									ret.push(o);
								} else if ((o.cellX >= data.x - d && o.cellX < data.x) && o.cellY === data.y) {
									// to the left
									callback(o);
									ret.push(o);
								}
							} else {
								if (o.cellX === data.x && o.cellY === data.y) {
									callback(o);
									ret = o;
								}
							}
						}
					}
				}

				return ret;
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