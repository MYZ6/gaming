
function bigRoadRender(gameData, cobj) {
	var bigColData = [];// two dimension
	var lastType = null;
	var colNo = 0;

	var coordinateArr = [];// two dimension
	for ( var i = 0; i < 100; i++) {// init 100 cols
		coordinateArr[i] = [ -1, -1, -1, -1, -1, -1 ];
	}

	$(gameData).each(
			function(i, item) {
				var rtype = item.resultType;
				if (lastType == null) {
					bigColData.push({
						height : 6,
						data : []
					});
				} else if (lastType != rtype && rtype != 3) {// not tie
					colNo++;
					bigColData.push({
						height : 6,
						data : []
					});
				}
				var colData = bigColData[colNo];
				var colLength = colData.data.length;

				if (rtype == 3) {
					if (colLength > 0) {// ignore the first tie
						var tieCount = colData.data[colLength - 1].tieCount;
						if (tieCount == undefined) {
							tieCount = 1;
						} else {
							tieCount += 1;
						}
						colData.data[colLength - 1].tieCount = tieCount;
					}
				} else {
					var cheight = colData.height;
					var cc = colNo;
					var cr = colLength;
					if (cheight == 6 && colLength < 6
							&& coordinateArr[colNo][colLength] != -1) {
						colData.height = colLength;
						cheight = colLength;
					}
					if (colLength >= cheight) {
						// long dragon
						cc = colNo + (colLength - cheight) + 1;
						cr = cheight - 1;
					}
					item.col = cc;
					item.row = cr;

					colData.data.push(item);
					coordinateArr[cc][cr] = i;
				}
				lastType = rtype;
				if (i == 39) {
					// return false;
				}
			});
	var leastCols = 1;
	var totalCols = 0;
	// counting for total cols;
	for ( var i = 0; i < 100; i++) {// init 100 cols
		var carr = coordinateArr[i];
		var darr = bigColData[i];
		if (darr != undefined) {
			var dlength = darr.data.length;
			var dheight = darr.height;
			if ((i + 1) + dlength - dheight > leastCols) {
				// considering for long dragon
				leastCols = (i + 1) + dlength - dheight;
			}
		}
		if (carr[0] == -1 && i >= leastCols) {
			totalCols = i;
			break;
		}
	}

	drawMap({
		'canvas' : cobj,
		'xstart' : 12,
		'ystart' : 12,
		'cellSize' : 60,
		'cellPadding' : 2,
		'maxColNo' : 20
	});

	function drawMap(option) {
		var invisibleCols = totalCols - option.maxColNo;
		if (invisibleCols < 0) {
			invisibleCols = 0;
		}
		// console.log(coordinateArr, bigColData)
		// console.log(totalCols, invisibleCols, leastCols)
		for ( var i = invisibleCols; i < totalCols; i++) {
			var carr = coordinateArr[i];
			for ( var j = 0; j < 6; j++) {
				var dataIndex = carr[j];
				if (dataIndex == -1) {
					continue;
				}
				var item = gameData[dataIndex];
				var rtype = item.resultType;
				var tieCount = item.tieCount;

				var imgName = 'dragon';
				if (tieCount != undefined) {
					imgName = tieCellRender(rtype, tieCount);
				} else if (rtype == 2) {
					imgName = 'tiger';
				}

				var visibleColNo = i - invisibleCols;
				option.canvas.image('img/bigroad/' + imgName + '.png',
						option.cellSize, option.cellSize).move(
						option.xstart + visibleColNo
								* (option.cellSize + option.cellPadding),
						option.ystart + j
								* (option.cellSize + option.cellPadding));
			}
		}
	}
}
function tieCellRender(_rtype, _tieCount) {
	var imgName = '';
	if (_rtype == 2) {
		imgName = 'tiger-tie' + _tieCount;
	} else {
		imgName = 'dragon-tie' + _tieCount;
	}
	return imgName;
}
