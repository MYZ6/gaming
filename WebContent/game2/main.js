$(function() {
	if (document.mozFullScreenEnabled) {
		console.log('slkdfjldksfjldksfj324234')
	}
	$('body').height($(window).height());
	var elem = $('.video-chip')[0];
	console.log(elem.mozRequestFullScreen)
	// if (elem.mozRequestFullScreen) {
	// elem.mozRequestFullScreen();
	// }
	// // $('body')[0].requestFullscreen();
	// initData();
	// refreshPool();
	//
	// initPlayer();
	//
	// initEvent();

});

function test() {
	// var target = $('body')[0];
	// console.log(elem.mozRequestFullScreen)
	// if (elem.mozRequestFullScreen) {
	// elem.mozRequestFullScreen();
	// }
	if (screenfull.enabled) {
		// screenfull.request(target);
		screenfull.toggle();
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
	$('#chip-list span').click(function(evt) {
		if ($(this).hasClass('selected')) {
			return;
		} else {
			$('#chip-list span.selected').removeClass('selected');
			$(this).addClass('selected');
		}
	});
	$('#chip-info span').click(function(evt) {
		var schip = $('#chip-list .selected').attr('chip');
		console.log(schip)
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

		var prepareChip = $('.prepare-chip', this).html();
		prepareChip = parseInt(prepareChip) + parseInt(schip);
		$('.prepare-chip', this).html(prepareChip);

	});

}