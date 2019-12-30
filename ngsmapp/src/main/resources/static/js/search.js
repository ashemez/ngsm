
$(document).ready(function() {
	var timer = null;
	$('#spattern').keydown(function(){
	       clearTimeout(timer); 
	       timer = setTimeout(doStuff, 1000)
	});

	function doStuff() {
	    // search and repopulate service boxes
		spattern = $('#spattern').val();
		console.log('spattern: ' + spattern);
		srvBoxPageNumber = 1;
		statusFilter = [0,3,5];
		ChangeUrl('Business Service View', $(location).attr('origin')+'/index?page=' + srvBoxPageNumber+'&statusFilter='+statusFilter+'&spattern=' + spattern);
		outerPopulateServicesCategoryCount();
		//console.log('Searchpopparams----srvboxpagenumber: ' + srvBoxPageNumber+"**statusFilter:**"+statusFilter+"**spattern*"+spattern+"*outerpagecount:*"+outerPageCount);
		outerPopulateAllServiceBoxes(srvBoxPageNumber,statusFilter,spattern);
		outerPaginate(statusFilter,spattern);
	}

});
