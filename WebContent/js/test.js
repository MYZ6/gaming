$(function() {
	svg();
});

function velocity() {
	$("#rect").delay(500).velocity({
		x : "+=200",
		y : "25%"
	}).velocity({
		fillGreen : 255,
		strokeWidth : 2
	}).velocity({
		height : 50,
		width : 50
	}).velocity({
		rotateZ : 90,
		scaleX : 0.5
	}).velocity("reverse", {
		delay : 250
	});
}
var draw = null;
function svg() {
	draw = SVG('drawing').size('100%', '100%');
	$('#drawing svg')[0].setAttribute('preserveAspectRatio', 'none');
	draw.viewbox({
		x : 0,
		y : 0,
		width : 1266,
		height : 397
	});

	// var rect = draw.rect(100, 100).attr({
	// fill : '#f06'
	// });
	var image = draw.image('img/jinbao/grid.png', 1266, 397);// .move(100,
	// 100)

	// draw.image('img/banker.png', 40, 40).move(7, 8);

	refreshRoad();
	draw.text(function(add) {
		add.tspan('1').fill('#f06')
	}).font({
		family : 'Helvetica',
		size : 36,
		anchor : 'middle',
		leading : '1.5em'
	}).move(890, 350);
}

function refreshRoad() {
	$.ajax({
		type : "GET",
		url : 'data/history2.json',
		error : function() {
			console.error("query failed");
		},
		success : function(data) {
			beadRoadRender(data);

			bigRoadRender(data);

			downroadAnalyse();

			downroadRender('big-eye', bigEyeData);
			downroadRender('little', littleData);
			downroadRender('yy', yyData);

		}
	});
}

function beadRoadRender(data) {
	var length = data.length;
	var totalCols = Math.floor((length - 1) / 6 + 1);
	var invisibleCols = totalCols - 6;
	$(data).each(
			function(i, item) {
				var colNo = Math.floor(i / 6);
				if (colNo + 1 <= invisibleCols) {
					return;
				}

				var visibleColNo = colNo - invisibleCols;
				var rowNo = i % 6;
				var cellSize = 40;
				var cellPadding = 2;
				var imgName = 'dragon';
				if (item.resultType == 2) {
					imgName = 'tiger';
				} else if (item.resultType == 3) {
					imgName = 'tie';
				}
				draw.image('img/' + imgName + '.png', cellSize, cellSize).move(
						7 + visibleColNo * (cellSize + cellPadding),
						8 + rowNo * (cellSize + cellPadding));
			});
}

var bigColData = [];// two dimension
function bigRoadRender(data) {
	var lastType = null;
	var colNo = 0;

	var coordinateArr = [];// two dimension
	for ( var i = 0; i < 100; i++) {// init 100 cols
		coordinateArr[i] = [ -1, -1, -1, -1, -1, -1 ];
	}

	$(data).each(
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
	var invisibleCols = totalCols - 22;
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
			var item = data[dataIndex];
			var rtype = item.resultType;
			var tieCount = item.tieCount;

			var imgName = 'dragon';
			if (tieCount != undefined) {
				imgName = tieCellRender(rtype, tieCount);
			} else if (rtype == 2) {
				imgName = 'tiger';
			}

			var cellSize = 40;
			var cellPadding = 2;
			var visibleColNo = i - invisibleCols;
			draw.image('img/bigroad/' + imgName + '.png', cellSize, cellSize)
					.move(263 + visibleColNo * (cellSize + cellPadding),
							8 + j * (cellSize + cellPadding));
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
function downroadRender(_roadtype, data) {
	var lastType = null;
	var colNo = 0;
	var colDataArr = [];

	var coordinateArr = [];// two dimension
	for ( var i = 0; i < 100; i++) {// init 100 cols
		coordinateArr[i] = [ -1, -1, -1, -1, -1, -1 ];
	}

	$(data).each(
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
	var invisibleCols = totalCols - 12;
	if (invisibleCols < 0) {
		invisibleCols = 0;
	}
	// console.log(coordinateArr, colDataArr)
	// console.log(totalCols, invisibleCols, leastCols)
	for ( var i = invisibleCols; i < totalCols; i++) {
		var carr = coordinateArr[i];
		// console.log(carr, i)
		for ( var j = 0; j < 6; j++) {
			var dataIndex = carr[j];
			if (dataIndex != -1) {
				var item = data[dataIndex];
				var rtype = item.resultType;
				drawCell(rtype, i, j);
			}
		}
	}
	function drawCell(colorType, i, j) {
		var imgName = 'bigroad/dragon';
		var xstartPosition = 7;
		if (_roadtype == 'little') {
			xstartPosition = 262;
			if (colorType == 'blue') {
				imgName = 'downroad/little-blue';
			} else {
				imgName = 'downroad/little-red';
			}
		} else if (_roadtype == 'yy') {
			xstartPosition = 520;
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
		var cellSize = 19;
		var cellPadding = 2;
		var visibleColNo = i - invisibleCols;
		draw.image('img/' + imgName + '.png', cellSize, cellSize).move(
				xstartPosition + visibleColNo * (cellSize + cellPadding),
				263 + j * (cellSize + cellPadding));
	}
}