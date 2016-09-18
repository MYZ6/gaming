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

function bigRoadRender() {

}
function bigEyeRoadRender() {

}
function littleRoadRender() {

}
function beadRoadRender(data) {
	$(data).each(function(i, item) {
		var colNo = Math.floor(i / 6);
		if (i % 6 == 0) {
			$('#road-map').append('<span class="col col' + colNo + '"></span>');
		}
		var span = '<span class="bead bead-dragon"></span>';
		if (item.resultType == 2) {
			span = '<span class="bead bead-tiger"></span>';
		} else if (item.resultType == 3) {
			span = '<span class="bead bead-tie"></span>';
		}
		console.log($('#road-map .col' + colNo), span, colNo, i);
		$('#road-map .col' + colNo).append(span);
	});
}
function sbeadRoadRender() {

}
function yyRoadRender() {

}