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
			bigRoadRender(data);
			bigEyeRoadRender(data);
			littleRoadRender(data);
			beadRoadRender(data);
			sbeadRoadRender(data);// simple bead road
			yyRoadRender(data);
		}
	});
}

function bigRoadRender(data) {
	var lastType = null;
	var colNo = 0;
	var dataArr = [];// two dimension

	var coordinateArr = [];// two dimension
	for (var i = 0; i < 100; i++) {// init 100 cols
		coordinateArr[i] = [ -1, -1, -1, -1, -1, -1 ];
	}
	// console.log(coordinateArr);

	$(data).each(function(i, item) {
		var rtype = item.resultType;
		if (lastType == null) {
			// addCol(colNo);
			dataArr.push({
				height : 6,
				data : []
			});
		} else if (lastType != rtype) {
			colNo++;
			dataArr.push({
				height : 6,
				data : []
			});
			// addCol(colNo);
			// console.log(dataArr,dataArr.length,colNo)
		}
		var colData = dataArr[colNo];
		item.col = colNo;
		var colLength = colData.data.length;
		var cheight = colData.height;
		// colData.height = colLength;
		// console.log(dataArr,colData.data,colLength)

		var cc = colNo;
		var cr = colLength;
		if (cheight == 6 && colLength < 6 && coordinateArr[colNo][colLength] != -1) {
			console.log(colLength, '987987')
			colData.height = colLength;
			cheight = colLength;
		}
		if (colLength < cheight) {
			// not taken by prior long dragon
			// console.log(coordinateArr[colNo][colLength], colNo, colLength)
			if (coordinateArr[colNo][cheight] == -1) {
				// colData.height = colLength;
				// } else {// turn right, boundary value
				// cc = colNo + (colLength - cheight) + 1;
				// cr = colLength - 1;
				// console.log('sdlfjlsdkfjldksf', cc, cr);
			}
		} else {// long dragon
		// console.log("lskdfjlksd329429847983")
			console.log(i,'sfde')
			cc = colNo + (colLength - cheight) + 1;
			cr = cheight - 1;
		}
		console.log(cc, cr);
		coordinateArr[cc][cr] = i;
		item.col = cc;
		item.row = cr;
		console.log(colData)
		colData.data.push(item);
		lastType = rtype;
		if (i == 15) {
//			return false;
		}
	});
	console.log(dataArr)
	// console.log(coordinateArr)
	var leastCols = 1;
	for (var i = 0; i < 100; i++) {// init 100 cols
		var carr = coordinateArr[i];
		var darr = dataArr[i];
		if (darr != undefined) {
			var dlength = darr.data.length;
			if (i + dlength - 5 > leastCols) {
				leastCols = i + dlength - 5;// considering for long dragon
			}
		}
		// console.log(carr)
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
			// console.log($('.big-road .col' + colNo), span, colNo, i);
			$('.big-road .col' + i).append(span);
		}
	}
	console.log(coordinateArr[4][5], data[16]);
	function addCol(_colNo) {
		$('.big-road').append('<span class="col col' + _colNo + '"></span>');
	}
}

function bigEyeRoadRender() {

}
function littleRoadRender() {

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
		// console.log($('.bead-road .col' + colNo), span, colNo, i);
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
function yyRoadRender() {

}