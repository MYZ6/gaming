$(function() {
	// $('body').height($(window).height());
	// initData();
	// refreshPool();
	//
	// initPlayer();
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
		alert("您的浏览器暂不支持锁定横屏操作！");
	}
}

function toFullscreen() {
	if (screenfull.enabled) {
		screenfull.toggle();
	} else {
		alert("您的浏览器暂不支持全屏操作！");
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
		url : 'data/table.json',
		error : function() {
			console.error("query failed");
		},
		success : function(data) {
			$('#table-no v').html(data.tableNo);
			$('#play-no v').html(data.playNo);
			$('#seq-no v').html(data.seqNo);
			$('#up-limit v').html(data.upLimit);
			$('#down-limit v').html(data.downLimit);
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