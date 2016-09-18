$(function() {
	refreshRoad();
});

function refreshRoad() {
	$.ajax({
		type : "GET",
		url : 'data/history.json',
		error : function() {
			console.error("query failed");
		},
		success : function(data) {
			beadRoadRender(data);

			bigRoadRender(data);
			downroadAnalyse();

			downroadRender('big-eye', bigEyeData);
			downroadRender('little', littleData);
			sbeadRoadRender(data);// simple bead road
			downroadRender('yy', yyData);
		}
	});
}

var bigColData = [];// two dimension
function bigRoadRender(data) {
	var lastType = null;
	var colNo = 0;

	var coordinateArr = [];// two dimension
	for (var i = 0; i < 100; i++) {// init 100 cols
		coordinateArr[i] = [ -1, -1, -1, -1, -1, -1 ];
	}

	$(data).each(function(i, item) {
		var rtype = item.resultType;
		if (lastType == null) {
			// addCol(colNo);
			bigColData.push({
				height : 6,
				data : []
			});
		} else if (lastType != rtype) {
			colNo++;
			bigColData.push({
				height : 6,
				data : []
			});
			// addCol(colNo);
		}
		var colData = bigColData[colNo];
		item.col = colNo;
		var colLength = colData.data.length;
		var cheight = colData.height;
		// colData.height = colLength;

		var cc = colNo;
		var cr = colLength;
		if (cheight == 6 && colLength < 6 && coordinateArr[colNo][colLength] != -1) {
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
	for (var i = 0; i < 100; i++) {// init 100 cols
		var carr = coordinateArr[i];
		var darr = bigColData[i];
		if (darr != undefined) {
			var dlength = darr.data.length;
			if (i + dlength - 5 > leastCols) {
				leastCols = i + dlength - 5;// considering for long dragon
			}
		}
		if (carr[0] == -1 && i > leastCols) {
			break;
		}

		addCol(i);

		for (var j = 0; j < 6; j++) {
			var dataIndex = carr[j];
			var span = '<span class="bead big-dragon"></span>';
			if (dataIndex == -1) {
				// break;
				// continue;
				span = '<span class="bead"></span>';// empty cell;
			} else {
				var item = data[dataIndex];
				var rtype = item.resultType;
				if (rtype == 2) {
					span = '<span class="bead big-tiger"></span>';
				} else if (rtype == 3) {
					span = '<span class="bead big-dtie"></span>';
				} else if (rtype == 4) {
					span = '<span class="bead big-ttie"></span>';
				}
			}
			$('.big-road .col' + i).append(span);
		}
	}
	function addCol(_colNo) {
		$('.big-road').append('<span class="col col' + _colNo + '"></span>');
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
	for (var i = 0; i < 100; i++) {// init 100 cols
		coordinateArr[i] = [ -1, -1, -1, -1, -1, -1 ];
	}

	$(data).each(function(i, item) {
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
		if (cheight == 6 && colLength < 6 && coordinateArr[colNo][colLength] != -1) {
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
	for (var i = 0; i < 100; i++) {// init 100 cols
		var carr = coordinateArr[i];
		var darr = colDataArr[i];
		if (darr != undefined) {
			var dlength = darr.data.length;
			if (i + dlength - 5 > leastCols) {
				leastCols = i + dlength - 5;// considering for long dragon
			}
		}
		if (carr[0] == -1 && i > leastCols) {
			break;
		}

		addCol(i);

		for (var j = 0; j < 6; j++) {
			var dataIndex = carr[j];
			var span = '<span class="bead ' + _roadtype + '-red"></span>';
			if (dataIndex == -1) {
				// break;
				// continue;
				span = '<span class="bead"></span>';// empty cell;
			} else {
				var item = data[dataIndex];
				var rtype = item.resultType;
				if (rtype == 'blue') {
					span = '<span class="bead ' + _roadtype + '-blue"></span>';
				}
			}
			$('.' + _roadtype + '-road .col' + i).append(span);
		}
	}
	function addCol(_colNo) {
		$('.' + _roadtype + '-road').append('<span class="col col' + _colNo + '"></span>');
	}
}

function beadRoadRender(data) {
	$(data).each(function(i, item) {
		var colNo = Math.floor(i / 6);
		if (i % 6 == 0) {
			$('.bead-road').append('<span class="col col' + colNo + '"></span>');
		}
		var span = '<span class="bead bead-dragon"></span>';
		if (item.resultType == 2) {
			span = '<span class="bead bead-tiger"></span>';
		} else if (item.resultType == 3) {
			span = '<span class="bead bead-tie"></span>';
		}
		$('.bead-road .col' + colNo).append(span);
	});
}
/**
 * simple bead road
 * 
 * @returns
 */
function sbeadRoadRender() {

}
