$(function() {
	initData();
	refreshPool();

	initPlayer();
	$('#btn-swichnet').click(changeAngle);
	$('#btn-confirmchip').click(changeAngle2);

	initEvent();

});

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
	player = videojs('really-cool-video', { /* Options */}, function() {
		console.log('Good to go!');

		this.play(); // if you don't trust autoplay for some reason

		// How about an event listener?
		this.on('ended', function() {
			console.log('awww...over so soon?');
		});
	});
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
}