$(function() {
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