$(function() {
	if (screen.lockOrientation) {
		screen.lockOrientation("landscape-primary");
	}

	$('.baccarat').click(function(evt) {
		location.href = "baccarat.html";
	});
	$('.dragontiger').click(function(evt) {
		location.href = "game2.html";
	});
});