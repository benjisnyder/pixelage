'use strict';

// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      var kValue;
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

// Declare app level module which depends on filters, and services
angular.module('myApp', [
	'ngRoute',
	'myApp.filters',
	'myApp.services',
	'myApp.directives',
	'myApp.controllers'
	]).

	config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider.when('/', {templateUrl : 'partials/play.html', controller: 'PlayCtrl', resolve : {
			context : function() {
				var docWidth = $(document).width() - 40, // -40 here to account for level offset set in CSS
					docHeight = $(document).height() - 40;

				var players = [
					{client : true, name : 'bsnyder', id : 'OzAnLt', color : '#ff0000', health : 2, power : 1, actions : 2, maxActions : 2, actionDelay : 2000, special : null, rounds : 0, wins : 0, diodes : 0, bits : 0},
					{name : 'apollo', id : 'XzATLt', color : '#00ff00', health : 2, power : 1, special : null, rounds : 0, wins : 0, diodes : 0, bits : 0},
					{name : 'owen', id : 'OzAnPX',color : '#0000ff', health : 2, power : 1, special : null, rounds : 0, wins : 0, diodes : 0, bits : 0},
					{name : 'erica', id : 'ZCVvfO',color : 'purple', health : 2, power : 1, special : null, rounds : 0, wins : 0, diodes : 0, bits : 0}
				];

				var level = {
					name : 'Level 1',
					theme : 'default',
					width : 280,
					height : 280,
					gridSize : 40,
					gridCount : 7,
					pattern : [
						'0003002',
						'0121210',
						'0422230',
						'4128214',
						'0422230',
						'0121210',
						'0003000'
					],
					// pattern : [
					// 	'0000000',
					// 	'0101010',
					// 	'1001000',
					// 	'0108010',
					// 	'0001010',
					// 	'0111010',
					// 	'0010110'
					// ],
				};

				level.bits = [];
				level.actions = [];

				var bitKeys = {
					0 : 'path',
					1 : 'static',
					2 : 'destructible',
					3 : 'power',
					4 : 'health',
					8 : 'diode'
				};

				// adjust the level ratios by 7 (7 rows/cols per level)
				// and set width/height to smalles of document height or width
				if (docWidth < docHeight) {
					if (docWidth > 500) {
						docWidth = 500;
					}

					level.gridSize = Math.floor(docWidth/level.gridCount);
				} else {
					if (docHeight > 500) {
						docHeight = 500;
					}

					level.gridSize = Math.floor(docHeight/level.gridCount);
				}

				level.width = level.gridSize*level.gridCount;
				level.height = level.gridSize*level.gridCount;

				// render the level
				for (var i = 0, l = level.pattern.length; i < l; i++) {
					var row = level.pattern[i];

					for (var rI = 0, rL = row.length; rI < rL; rI++) {
						var val = row[rI],
							path = val === '0' ? true : false;

						//if (val !== '0') { // if its not a path
							level.bits.push({
								cls : bitKeys[val],
								x : level.gridSize*rI,
								y : level.gridSize*i,
								cellX : rI,
								cellY : i,
								path : path,
								type : 'bit'
							});
						//}
					}
				}

				// add player's initial x/y
				for (var i = 0, l = players.length; i < l; i++) {
					var player = players[i];
					// default is 0/0
					player.cellX = 0;
					player.cellY = 0;
					player.type = 'player';

					// overrides
					switch(i) {
						case 1:
							player.cellX = level.gridCount - 1;
							break;
						case 2:
							player.cellY = level.gridCount - 1;
							break;
						case 3:
							player.cellX = level.gridCount - 1;
							player.cellY = level.gridCount - 1;
							break;
					}
				}

				var context = {
					level : level,
					players : players,
					time : 72000 //1.2 mins
				};

				return context;
			}
		}});
	}]);
