$(function() {
	// $('body').height($(window).height());
	initData();
	// refreshPool();
	//
	initPlayer();
	//
	initEvent();
	if (screen.lockOrientation) {
		// screen.lockOrientation("landscape-primary");
	}

	if (!screenfull.isFullscreen) {
		// alert('建议在全屏和横屏下操作！');
	}
});

function hall() {
	location.href = "hall.html";
}

function lock() {
	if (screen.lockOrientation) {
		screen.lockOrientation("landscape-primary");
	} else {
		toastr.info('您的浏览器暂不支持锁定横屏操作！');
	}
}

function toFullscreen() {
	if (screenfull.enabled) {
		screenfull.toggle();
	} else {
		toastr.info('您的浏览器暂不支持全屏操作！');
	}
}

function videoSize() {
	if ($('.game-video').hasClass('max')) {
		$('.game-video').removeClass('max');
		$('.btn-video-size img').attr('src', 'img/jinbao/video_max.png');
		$('.btn-video-size tc').html('放大视频');
	} else {
		$('.game-video').addClass('max');
		$('.btn-video-size img').attr('src', 'img/jinbao/video_min.png');
		$('.btn-video-size tc').html('缩小视频');
	}
}

function refreshPool() {
	$.ajax({
		type : "GET",
		url : 'data/pool.json',
		error : function() {
			console.error("query failed");
		},
		success : function(data) {
			console.log(data);
			$('#dragon-amount v').html(data.dragon);
			$('#tie-amount v').html(data.tie);
			$('#tiger-amount v').html(data.tiger);
		}
	});
}

function initData() {
	$.ajax({
		type : "GET",
		url : 'data/table-list.json',
		error : function(a, b, c) {
			console.error(a, b, c, "query failed");
		},
		success : function(data) {
			var table1 = data[0];
			$('#table-no v').html(table1.tableNo);
			$('#play-no v').html(table1.playNo);
			$('#seq-no v').html(table1.seqNo);
			$('#up-limit v').html(table1.upLimit);
			$('#down-limit v').html(table1.downLimit);

			$(data).each(
					function(i, table) {
						$('.table-list').append(
								'<div class="table-title">' + table.tableName
										+ '</div');
					});
		}
	});
}
var player = null;
function initPlayer() {
	player = videojs('video-player', { /* Options */}, function() {
		console.log('Good to go!');

		this.play(); // if you don't trust autoplay for some reason

		// How about an event listener?
		this.on('ended', function() {
			console.log('awww...over so soon?');
		});
	});
}

function changeAngle(_type) {
	var _url = 'http://liveproxy.kukuplay.com:9222/mweb/fytv-letv/szws.m3u8';
	if (_type == 2) {
		_url = 'http://liveproxy.kukuplay.com:9222/mweb/fytv-letv/hubws.m3u8';
	} else if (_type == 3) {
		_url = 'http://liveproxy.kukuplay.com:9222/mweb/fytv-letv/gzws.m3u8';
	}
	player.pause();
	player.src(_url);
	player.load();
	player.play();
}

function initEvent() {
	toastr.options = {
		"timeOut" : "2000"
	};
	if (window.orientation == 0) {
		toastr.info('建议在横屏下操作！');
	}
	$(window).on("orientationchange", function(evt) {
		// alert(window.orientation )
		if (window.orientation == 0) {
			toastr.info('建议在横屏下操作！');
		}
	});

	$('.video-source .btn').click(function(evt) {
		if ($(this).hasClass('current')) {
			return;
		}
		if ($(this).hasClass('source-near')) {
			changeAngle(1);
		} else if ($(this).hasClass('source-far')) {
			changeAngle(2);
		} else {
			changeAngle(3);
		}
		$(this).siblings().removeClass('current');
		$(this).addClass('current');
	});

	// scrolling notice
	$('.marquee').marquee({
		// speed in milliseconds of the marquee
		duration : 8000,
		// gap in pixels between the tickers
		gap : 350,
		duplicated : true
	});
	setTimeout(function() {
		// $('.marquee').marquee('pause');
	}, 3000);

	$('.chip-list .chip').click(highlight);
	function highlight() {
		if ($(this).hasClass('selected')) {
			return;
		} else {
			$schip = $('.chip-list .selected');
			var schip = $schip.attr('chip');
			if (schip != undefined) {
				$('img', $schip).attr('src', 'img/chip' + schip + '.png');
				$schip.removeClass('selected');
			}

			$('img', this).attr('src',
					'img/chip' + $(this).attr('chip') + 'h.png');
			$(this).addClass('selected');
		}
	}
	$('.chip-table div').click(function(evt) {
		var schip = $('.chip-list .selected').attr('chip');
		if (schip == undefined) {
			$(this).css('cursor', 'auto');
			return;
		}
		$(this).css('cursor', 'pointer');
		var $fchip = $('#chip' + schip + 'h');
		// console.log($fchip)
		$fchip.css({
			'left' : evt.pageX - 25,
			'top' : evt.pageY - 25,
		}).show();
		setTimeout(function() {
			$fchip.hide();
		}, 200);

		var prepareChip = $('.prepare-chip .text-cell', this).html();
		prepareChip = parseInt(prepareChip) + parseInt(schip);
		$('.prepare-chip .text-cell', this).html(prepareChip);

		$('.btn-chip').show();
	});
	$('.btn-chip-cancel').click(function(evt) {
		$('.chip-table div').each(function(i, ele) {
			$('.prepare-chip .text-cell', this).html(0);
		});
		$('.btn-chip').hide();
	});
	$('.btn-chip-confirm').click(function(evt) {
		$('.chip-table div').each(function(i, ele) {
			var prepareChip = $('.prepare-chip .text-cell', this).html();
			var certainChip = $('.certain-chip .text-cell', this).html();
			certainChip = parseInt(certainChip) + parseInt(prepareChip);
			$('.certain-chip .text-cell', this).html(certainChip);
			$('.prepare-chip .text-cell', this).html(0);
		});
		$('.btn-chip').hide();
	});

}