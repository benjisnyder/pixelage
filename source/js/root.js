(function() {
	var utils = {
		parseLevel : function(xml) {
			
		}
	};
	/*var player = document.getElementById('pa'),
		level = document.getElementById('level'),
		playerDim = player.getBoundingClientRect(),
		levelDim = level.getBoundingClientRect(),
		gridCount = levelDim.width/playerDim.width,
		gridSize = playerDim.width;

	var movePlayer = function(p, x, y) {
		var moveToX = Math.floor(x/gridSize) * gridSize,
			moveToY = Math.floor(y/gridSize) * gridSize;

		p.style.top = moveToY + 'px';
		p.style.left = moveToX + 'px';
	};

	player.addEventListener('mousedown', function(e) {
		var move = function(e) {
			var levelMoveX = e.pageX - levelDim.left,
				levelMoveY = e.pageY - levelDim.top;
			
			if (levelMoveX > 0 && levelMoveX < levelDim.width && levelMoveY > 0 && levelMoveY < levelDim.height) {
				movePlayer(player, levelMoveX, levelMoveY);
			}
		};

		var rem = function() {
			document.removeEventListener('mousemove', move);
			document.removeEventListener('mouseup', rem);
		};
		document.addEventListener('mousemove', move);
		document.addEventListener('mouseup', rem);
		e.preventDefault();
	});*/
})();