$(function() {
	// $('body').height($(window).height());
	initData();
	// refreshPool();
	//
	initPlayer();
	//
	initEvent();
	if (screen.lockOrientation) {
		screen.lockOrientation("landscape-primary");
	}

	if (!screenfull.isFullscreen) {
		// alert('建议在全屏和横屏下操作！');
	}
});

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

function videoSource() {
	console.log($('.btn-video-source'), $('.btn-video-source').hasClass(
			'source_near'))
	if ($('.btn-video-source').hasClass('source_near')) {
		console.log('sldjlf')
		$('.btn-video-source').removeClass('source_near');
		$('.btn-video-source img').attr('src', 'img/jinbao/video_zoomin.png');
		$('.btn-video-source tc').html('近端视频');
		changeAngle();
	} else {
		console.log('32423')
		$('.btn-video-source').addClass('source_near');
		$('.btn-video-source img').attr('src', 'img/jinbao/video_zoomout.png');
		$('.btn-video-source tc').html('远端视频');
		changeAngle2();
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
	$('#btn-videonear').click(changeAngle);
	$('#btn-videofar').click(changeAngle2);
}

function changeAngle() {
	player.pause();
	player.src('http://liveproxy.kukuplay.com:9222/mweb/fytv-letv/szws.m3u8');
	player.load();
	player.play();
}
function changeAngle2() {
	player.pause();
	player.src('http://liveproxy.kukuplay.com:9222/mweb/fytv-letv/hubws.m3u8');
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

	});

}