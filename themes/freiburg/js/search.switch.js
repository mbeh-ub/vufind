$( document ).ready(function(){
	$('input[value="katalog"]').click(function() {
		$('form#searchForm').attr('action', "https://katalog.ub.uni-freiburg.de/opac/RDSIndex/Results");
	});
	$('input[value="website"]').click(function() {
		$('form#searchForm').attr('action', "/opac/Web/Results");
	});
})

