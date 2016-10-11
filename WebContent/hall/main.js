$(function() {
	initEvent();
	if (screen.lockOrientation) {
		// screen.lockOrientation("landscape-primary");
	}

	if (!screenfull.isFullscreen) {
		// alert('建议在全屏和横屏下操作！');
	}

	loadTableList(0);
});

function initEvent() {
	$('.house-item').each(function(i, ele) {
		$(this).click(function(evt) {
			$(this).siblings().removeClass('current');
			$(this).addClass('current');
			loadTableList(i);
		});
	});
	$('.btn-play').click(function(evt) {
	});
}

function loadTableList(_type) {
	var _url = 'data/house2.json';
	var gameName = "龙虎";
	if (_type == 0) {
		_url = 'data/house1.json';
		gameName = "百家乐";
	}
	$('.hall-content').empty();
	$.ajax({
		type : "GET",
		url : _url,
		error : function(a, b) {
			console.error(a, b, "query failed");
		},
		success : function(data) {
			$(data).each(function(i, item) {
				tableRender(item);
			});
			$('.btn-play').click(function(evt) {
				location.href = 'baccarat2.html';
			});
		}
	});
	function tableRender(item) {
		var ghtml = '<div class="table-item"> <span class="">' + gameName
				+ '</span> <span class="">场<v>' + item.playNo
				+ '</v></span> <span class="">次<v>' + item.seqNo
				+ '</v></span> <span class="btn-play"><ic>&gt;</ic>开始游戏</span>'
				+ '<div id="canvas' + item.tableNo
				+ '" class="canvas"> </div> </div>';
		$('.hall-content').append(ghtml);
		var cobj = svg('canvas' + item.tableNo);
		bigRoadRender(item.gameData, cobj);
	}
	function svg(_target) {
		$('#' + _target).empty();
		var canvasObj = SVG(_target).size('100%', '100%');
		$('#' + _target + ' svg')[0]
				.setAttribute('preserveAspectRatio', 'none');
		canvasObj.viewbox({
			x : 0,
			y : 0,
			width : 1266,
			height : 397
		});
		var image = canvasObj.image('img/road/grid3.png', 1266, 397);

		return canvasObj;
	}
}