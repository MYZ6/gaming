$(function() {
	$('.road-info>div').click(function(evt) {
		$(this).removeClass('current');
		var $next = $(this).next();
		if ($next.length == 0) {
			$next = $('.road-one');
		}
		$next.addClass('current');
	});

	canvasObj = svg('road-one', 'grid');
	canvasObj2 = svg('road-two', 'grid2');
	canvasObj3 = svg('road-three', 'grid3');

	refreshRoad();
});

var canvasObj = null;
var canvasObj2 = null;
var canvasObj3 = null;
function svg(_target, _img) {
	$('#' + _target).empty();
	var canvasObj = SVG(_target).size('100%', '100%');
	$('#' + _target + ' svg')[0].setAttribute('preserveAspectRatio', 'none');
	canvasObj.viewbox({
		x : 0,
		y : 0,
		width : 1266,
		height : 397
	});
	var image = canvasObj.image('img/road/' + _img + '.png', 1266, 397);

	return canvasObj;
}

var gameData = null;

function refreshRoad() {
	$.ajax({
		type : "GET",
		url : 'data/baccarat_history.json',
		error : function(a, b) {
			console.error(a, b, "query failed");
		},
		success : function(data) {
			gameData = data;

			var history = data.history;
			beadRoadRender({
				'canvas' : canvasObj,
				'gameData' : history,
				'xstart' : 12,
				'ystart' : 12,
				'cellSize' : 60,
				'cellPadding' : 2
			});

			sbeadRoadRender({
				'canvas' : canvasObj3,
				'gameData' : history,
				'xstart' : 672,
				'ystart' : 202,
				'cellSize' : 60,
				'cellPadding' : 2,
				'maxVCols' : 9
			});

			// beadRoadRender({
			// 'canvas' : canvasObj2,
			// 'gameData' : history,
			// 'xstart' : 10,
			// 'ystart' : 9,
			// 'cellSize' : 60,
			// 'cellPadding' : 2
			// });

			bigRoadRender(history);

			downroadAnalyse();
			//
			// downroadRender({
			// 'roadType' : 'big-eye',
			// 'gameData' : bigEyeData,
			// 'canvas' : canvasObj,
			// 'xstart' : 7,
			// 'ystart' : 263,
			// 'cellSize' : 19,
			// 'cellPadding' : 2
			// });

			downroadRender({
				'roadType' : 'big-eye',
				'gameData' : bigEyeData,
				'canvas' : canvasObj3,
				'xstart' : 28,
				'ystart' : 10,
				'cellSize' : 29,
				'cellPadding' : 2,
				'maxVCols' : 20
			});
			// downroadRender({
			// 'roadType' : 'little',
			// 'gameData' : littleData,
			// 'canvas' : canvasObj,
			// 'xstart' : 262,
			// 'ystart' : 263,
			// 'cellSize' : 19,
			// 'cellPadding' : 2
			// });

			downroadRender({
				'roadType' : 'little',
				'gameData' : littleData,
				'canvas' : canvasObj3,
				'xstart' : 672,
				'ystart' : 10,
				'cellSize' : 29,
				'cellPadding' : 2,
				'maxVCols' : 18
			});
			// downroadRender({
			// 'roadType' : 'yy',
			// 'gameData' : yyData,
			// 'canvas' : canvasObj,
			// 'xstart' : 520,
			// 'ystart' : 263,
			// 'cellSize' : 19,
			// 'cellPadding' : 2
			// });
			downroadRender({
				'roadType' : 'yy',
				'gameData' : yyData,
				'canvas' : canvasObj3,
				'xstart' : 28,
				'ystart' : 202,
				'cellSize' : 29,
				'cellPadding' : 2,
				'maxVCols' : 20
			});
		}
	});
}

function drawStatistics() {
	var statistics = gameData.statistics;
	drawText(statistics.count1, 870, 343);
	drawText(statistics.count2, 1005, 343);
	drawText(statistics.count3, 1140, 343);
	drawText(statistics.total, 1147, 375);

	function drawText(text, x, y) {
		canvasObj.text(function(add) {
			add.tspan(text).fill('#000');
		}).font({
			family : 'Helvetica',
			size : 21,
			anchor : 'middle',
			leading : '1.3em'
		}).move(x, y);
	}
}

function beadRoadRender(option) {
	// console.log(option)
	var canvas = option.canvas;
	var gameData = option.gameData;
	var length = gameData.length;
	var totalCols = Math.floor((length - 1) / 6 + 1);
	var maxColNo = 20;
	var invisibleCols = totalCols - maxColNo;
	if (invisibleCols < 0) {
		invisibleCols = 0;
	}
	$(gameData).each(
			function(i, item) {
				var colNo = Math.floor(i / 6);
				if (colNo + 1 <= invisibleCols) {
					return;
				}

				var visibleColNo = colNo - invisibleCols;
				var rowNo = i % 6;
				var imgName = 'banker';
				if (item.resultType == 2) {
					imgName = 'player';
				} else if (item.resultType == 3) {
					imgName = 'tie';
				}
				canvas.image('img/' + imgName + '.png', option.cellSize,
						option.cellSize).move(
						option.xstart + visibleColNo
								* (option.cellSize + option.cellPadding),
						option.ystart + rowNo
								* (option.cellSize + option.cellPadding));
			});
}

/**
 * simple bead road
 * 
 * @returns
 */
function sbeadRoadRender(option) {
	var sbeadroadData = [];
	var gameData = option.gameData;
	$(gameData).each(function(i, item) {
		if (item.resultType == 3) {
			if (i == 0) {// ignore the first tie
				return;
			}
			var lastSitem = sbeadroadData[sbeadroadData.length - 1];
			var tieCount = lastSitem.tieCount;
			if (tieCount == undefined) {
				tieCount = 1;
			} else {
				tieCount += 1;
			}
			lastSitem.tieCount = tieCount;
		} else {
			// Shallow copy
			var newItem = jQuery.extend({}, item);
			sbeadroadData.push(newItem);
		}
	});

	var canvas = option.canvas;
	var length = sbeadroadData.length;
	var colLength = 3;
	var totalCols = Math.floor((length - 1) / colLength + 1);
	var maxVCols = 12;
	if (option.maxVCols != undefined) {
		maxVCols = option.maxVCols;
	}
	var invisibleCols = totalCols - maxVCols;
	if (invisibleCols < 0) {
		invisibleCols = 0;
	}
//	console.log(invisibleCols,invisibleCols,maxVCols)
	$(sbeadroadData).each(
			function(i, item) {
				var colNo = Math.floor(i / colLength);
				if (colNo + 1 <= invisibleCols) {
					return;
				}

				var visibleColNo = colNo - invisibleCols;
				var rowNo = i % colLength;

				var rtype = item.resultType;
				var tieCount = item.tieCount;
				var imgName = 'dragon';
				if (tieCount != undefined) {
					imgName = tieCellRender(rtype, tieCount);
				} else if (rtype == 2) {
					imgName = 'tiger';
				}
				canvas.image('img/bigroad/' + imgName + '.png',
						option.cellSize, option.cellSize).move(
						option.xstart + visibleColNo
								* (option.cellSize + option.cellPadding),
						option.ystart + rowNo
								* (option.cellSize + option.cellPadding));
			});
}

var bigColData = [];// two dimension
function bigRoadRender(gameData) {
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

	// drawMap({
	// 'canvas' : canvasObj,
	// 'xstart' : 263,
	// 'ystart' : 8,
	// 'cellSize' : 40,
	// 'cellPadding' : 2,
	// 'maxColNo' : 22
	// });

	drawMap({
		'canvas' : canvasObj2,
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

var bigEyeData = [];
var littleData = [];
var yyData = [];
function downroadAnalyse() {
	// big eye road
	$(bigColData).each(function(i, col) {
		// begin from second row of the second col
		if (i == 0) {
			return;
		}
		var itemArr = col.data;
		if (i == 1) {
			// if second col only have one cell, then begin from the next cell
			// of
			// next col(that is the first cell of the third col)
			if (itemArr.length == 1) {
				return;
			}
			$(itemArr).each(function(j, item) {
				if (j == 0) {
					return;
				}
				var aheadCol1 = bigColData[i - 1].data;
				if ((aheadCol1.length + 1) < (j + 1)) {// 长庄长闲red
					bigEyeData.push({
						'resultType' : 'red'
					});
				} else if ((aheadCol1.length + 1) == (j + 1)) {// 一房两厅blue
					bigEyeData.push({
						'resultType' : 'blue'
					});
				} else if ((aheadCol1.length + 1) > (j + 1)) {// 拍拍连red
					bigEyeData.push({
						'resultType' : 'red'
					});
				}
			});
		} else {
			$(itemArr).each(function(j, item) {
				var aheadCol1 = bigColData[i - 1].data;
				if (j == 0) {// 齐脚red不齐脚blue
					var aheadCol2 = bigColData[i - 2].data;
					if (aheadCol1.length == aheadCol2.length) {// red
						bigEyeData.push({
							'resultType' : 'red'
						});
					} else {// blue
						bigEyeData.push({
							'resultType' : 'blue'
						});
					}

				} else {
					if ((aheadCol1.length + 1) < (j + 1)) {// 长庄长闲red
						bigEyeData.push({
							'resultType' : 'red'
						});
					} else if ((aheadCol1.length + 1) == (j + 1)) {// 一房两厅blue
						bigEyeData.push({
							'resultType' : 'blue'
						});
					} else if ((aheadCol1.length + 1) > (j + 1)) {// 拍拍连red
						bigEyeData.push({
							'resultType' : 'red'
						});
					}
				}
			});

		}
	});
	// little road
	$(bigColData).each(function(i, col) {
		// begin from second cell of the third col
		if (i < 2) {
			return;
		}
		var itemArr = col.data;
		if (i == 2) {
			// if third col only have one cell, then begin from the next cell
			// of
			// next col(that is the first cell of the forth col)
			if (itemArr.length == 1) {
				return;
			}
			$(itemArr).each(function(j, item) {
				if (j == 0) {
					return;
				}
				var aheadCol2 = bigColData[i - 2].data;
				if ((aheadCol2.length + 1) < (j + 1)) {// 长庄长闲red
					littleData.push({
						'resultType' : 'red'
					});
				} else if ((aheadCol2.length + 1) == (j + 1)) {// 一房两厅blue
					littleData.push({
						'resultType' : 'blue'
					});
				} else if ((aheadCol2.length + 1) > (j + 1)) {// 拍拍连red
					littleData.push({
						'resultType' : 'red'
					});
				}
			});
		} else {
			$(itemArr).each(function(j, item) {
				if (j == 0) {// 齐脚red不齐脚blue, compare ahead1 and ahead3
					var aheadCol1 = bigColData[i - 1].data;
					var aheadCol3 = bigColData[i - 3].data;
					if (aheadCol1.length == aheadCol3.length) {// red
						littleData.push({
							'resultType' : 'red'
						});
					} else {// blue
						littleData.push({
							'resultType' : 'blue'
						});
					}

				} else {
					var aheadCol2 = bigColData[i - 2].data;
					if ((aheadCol2.length + 1) < (j + 1)) {// 长庄长闲red
						littleData.push({
							'resultType' : 'red'
						});
					} else if ((aheadCol2.length + 1) == (j + 1)) {// 一房两厅blue
						littleData.push({
							'resultType' : 'blue'
						});
					} else if ((aheadCol2.length + 1) > (j + 1)) {// 拍拍连red
						littleData.push({
							'resultType' : 'red'
						});
					}
				}
			});

		}
	});

	// yy road
	$(bigColData).each(function(i, col) {
		// begin from second cell of the forth col
		if (i < 3) {
			return;
		}
		var itemArr = col.data;
		if (i == 3) {
			// if forth col only have one cell, then begin from the next cell
			// of
			// next col(that is the first cell of the fifth col)
			if (itemArr.length == 1) {
				return;
			}
			$(itemArr).each(function(j, item) {
				if (j == 0) {
					return;
				}
				var aheadCol2 = bigColData[i - 2].data;
				if ((aheadCol2.length + 1) < (j + 1)) {// 长庄长闲red
					yyData.push({
						'resultType' : 'red'
					});
				} else if ((aheadCol2.length + 1) == (j + 1)) {// 一房两厅blue
					yyData.push({
						'resultType' : 'blue'
					});
				} else if ((aheadCol2.length + 1) > (j + 1)) {// 拍拍连red
					yyData.push({
						'resultType' : 'red'
					});
				}
			});
		} else {
			$(itemArr).each(function(j, item) {
				if (j == 0) {// 齐脚red不齐脚blue, compare ahead1 and ahead4
					var aheadCol1 = bigColData[i - 1].data;
					var aheadCol4 = bigColData[i - 4].data;
					if (aheadCol1.length == aheadCol4.length) {// red
						yyData.push({
							'resultType' : 'red'
						});
					} else {// blue
						yyData.push({
							'resultType' : 'blue'
						});
					}

				} else {
					var aheadCol3 = bigColData[i - 3].data;
					if ((aheadCol3.length + 1) < (j + 1)) {// 长庄长闲red
						yyData.push({
							'resultType' : 'red'
						});
					} else if ((aheadCol3.length + 1) == (j + 1)) {// 一房两厅blue
						yyData.push({
							'resultType' : 'blue'
						});
					} else if ((aheadCol3.length + 1) > (j + 1)) {// 拍拍连red
						yyData.push({
							'resultType' : 'red'
						});
					}
				}
			});

		}
	});
}
function downroadRender(option) {
	var _roadtype = option.roadType;
	var gameData = option.gameData;
	var lastType = null;
	var colNo = 0;
	var colDataArr = [];

	var coordinateArr = [];// two dimension
	for ( var i = 0; i < 100; i++) {// init 100 cols
		coordinateArr[i] = [ -1, -1, -1, -1, -1, -1 ];
	}

	$(gameData).each(
			function(i, item) {
				var rtype = item.resultType;
				if (lastType == null) {
					// addCol(colNo);
					colDataArr.push({
						height : 6,
						data : []
					});
				} else if (lastType != rtype) {
					colNo++;
					colDataArr.push({
						height : 6,
						data : []
					});
					// addCol(colNo);
				}
				var colData = colDataArr[colNo];
				item.col = colNo;
				var colLength = colData.data.length;
				var cheight = colData.height;
				// colData.height = colLength;

				var cc = colNo;
				var cr = colLength;
				if (cheight == 6 && colLength < 6
						&& coordinateArr[colNo][colLength] != -1) {
					colData.height = colLength;
					cheight = colLength;
				}
				if (colLength < cheight) {
					// not taken by prior long dragon
					if (coordinateArr[colNo][cheight] == -1) {
						// colData.height = colLength;
						// } else {// turn right, boundary value
						// cc = colNo + (colLength - cheight) + 1;
						// cr = colLength - 1;
					}
				} else {// long dragon
					cc = colNo + (colLength - cheight) + 1;
					cr = cheight - 1;
				}
				coordinateArr[cc][cr] = i;
				item.col = cc;
				item.row = cr;
				colData.data.push(item);
				lastType = rtype;
				if (i == 15) {
					// return false;
				}
			});
	var leastCols = 1;
	var totalCols = 0;
	for ( var i = 0; i < 100; i++) {// init 100 cols
		var carr = coordinateArr[i];
		var darr = colDataArr[i];
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
	var maxVCols = 12;
	if (option.maxVCols != undefined) {
		maxVCols = option.maxVCols;
	}
	var invisibleCols = totalCols - maxVCols;
	if (invisibleCols < 0) {
		invisibleCols = 0;
	}
	for ( var i = invisibleCols; i < totalCols; i++) {
		var carr = coordinateArr[i];
		// console.log(carr, i)
		for ( var j = 0; j < 6; j++) {
			var dataIndex = carr[j];
			if (dataIndex != -1) {
				var item = gameData[dataIndex];
				var rtype = item.resultType;
				drawCell(rtype, i, j);
			}
		}
	}
	function drawCell(colorType, i, j) {
		var imgName = 'bigroad/dragon';
		if (_roadtype == 'little') {
			if (colorType == 'blue') {
				imgName = 'downroad/little-blue';
			} else {
				imgName = 'downroad/little-red';
			}
		} else if (_roadtype == 'yy') {
			if (colorType == 'blue') {
				imgName = 'downroad/yy-blue';
			} else {
				imgName = 'downroad/yy-red';
			}
		} else {
			if (colorType == 'blue') {
				imgName = 'bigroad/tiger';
			}
		}
		var visibleColNo = i - invisibleCols;
		option.canvas.image('img/' + imgName + '.png', option.cellSize,
				option.cellSize).move(
				option.xstart + visibleColNo
						* (option.cellSize + option.cellPadding),
				option.ystart + j * (option.cellSize + option.cellPadding));
	}
}
