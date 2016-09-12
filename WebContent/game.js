$(function() {
	initData();
	refreshPool();
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