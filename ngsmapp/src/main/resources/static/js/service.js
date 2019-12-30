//When Page Load Service Open 

$(document).ready(function() {
	$("#contentheader .panel-heading").text('Dashboards > Service Tree');
	
	//Redirect jsp pages
    $("#submenu-1 #li_bs").on('click', 'a', function (){
    	window.location.href ="/index.jsp?msbval="+minisideval;
    }); 
    $("#submenu-1 #li_kpiover").on('click', 'a', function (){
    	window.location.href ="/kpioverall.jsp?msbval="+minisideval;
    });    
	$("#submenu-2 #rpt1_li" ).on('click', 'a', function (){
    	window.location.href ="/ReportViewer.jsp?p=reportlist&msbval="+minisideval;
    });
    $("#submenu-2 #rpt2_li").on('click', 'a', function (){
    	window.location.href ="/ReportViewer.jsp?p=reportjobs&msbval="+minisideval;
    });	
    $("#submenu-3 #li_ds" ).on('click', 'a', function (){
    	window.location.href ="/kpi.jsp?p=ds&msbval="+minisideval;
    });
    $("#submenu-3 #li_kpi" ).on('click', 'a', function (){
    	window.location.href ="/kpi.jsp?p=kpi&msbval="+minisideval;
    });
    $("#admin_menu #li_usr" ).on('click', 'a', function (){
    	window.location.href ="/admin.jsp?p=users&msbval="+minisideval;
    });
    $("#admin_menu #li_role" ).on('click', 'a', function (){
    	window.location.href ="/admin.jsp?p=roles&msbval="+minisideval;
    });
    $("#admin_menu #li_grp" ).on('click', 'a', function (){
    	window.location.href ="/admin.jsp?p=groups&msbval="+minisideval;
    });
    $("#op_menu #li_maintenance").on('click', 'a', function (){
    	window.location.href ="/maintenance.jsp?page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval;
    });
    $("#op_menu #li_eventcatalog").on('click', 'a', function (){
    	window.location.href ="/eventcatalog.jsp?page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval;
    });

});

//serviceviewer kpi table
var kpiTable;
function GetKPIList(sid){
	
	$.fn.dataTable.ext.errMode = 'none';
	if ( $.fn.dataTable.isDataTable('#kpitable')){
		kpiTable.destroy();
		
		kpiTable = $('#kpitable').DataTable( {
			"processing": false,
			"serverSide": true,
	        //ajax: 'resource/alarmlist.json',
			"ajax": {
				"url":  '/Kpi?p=getSrvKPIListForTable&sid=' + sid,
				"cache": false
			},
		    "cache": false,
	        scrollY:        200,
	        scrollCollapse: true,
			"bPaginate": false,
			lengthChange: false,
		    "bFilter": true,
		    "bInfo": false,
		    "bAutoWidth": false,
		    "createdRow": function( row, data, dataIndex ) {
		    	$(row).css('backgroundColor', getKPIStatusColor(data[3]));
		    }
	    } );
	} else {
		kpiTable = $('#kpitable').DataTable( {
			"processing": false,
			"serverSide": true,
	        //ajax: 'resource/alarmlist.json',
			"ajax": {
				"url":  '/Kpi?p=getSrvKPIListForTable&sid=' + sid,
				"cache": false
			},
		    "cache": false,
	        scrollY:        200,
	        scrollCollapse: true,
			"bPaginate": false,
			lengthChange: false,
		    "bFilter": true,
		    "bInfo": false,
		    "bAutoWidth": false,
		    "createdRow": function( row, data, dataIndex ) {       
		    	$(row).css('backgroundColor', getKPIStatusColor(data[3]));
		    }
	    } );
	}
	
	//setInterval( function () {
	//	kpiTable.ajax.reload(); // user paging is not reset on reload
	//}, 300000 );
}

function buildKpiTable(sid){
	$.ajax({
		cache: false,
		url:'/Kpi?p=getSrvKPIListForTable&sid=' + sid,
		success:function(data) {
			//console.log(data);
			
			var kpitbody = $('#kpitable tbody');
			kpiListJson = JSON.parse(data);
			
			if(kpiListJson.state === undefined){
				
				kpitbody.empty();
				
				$.each(kpiListJson.data, function( key, value ) {
					var tr = $('<tr></tr>')
					var td1 = $('<td>' + value[0] + '</td>');
					td1.appendTo(tr);
					var td2 = $('<td>' + value[1] + '</td>');
					td2.appendTo(tr);
					var td3 = $('<td>' + value[2] + '</td>');
					td3.appendTo(tr);
					var td4 = $('<td>' + value[3] + '</td>');
					td4.appendTo(tr);
					var td5 = $('<td>' + value[4] + '</td>');
					tr.css('backgroundColor', getKPIStatusColor(value[3]));
					td5.appendTo(tr);
					tr.appendTo(kpitbody);
	        	});
			}
		}
	});
}


