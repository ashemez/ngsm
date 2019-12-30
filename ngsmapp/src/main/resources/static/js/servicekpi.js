var urlParams = {};
$(function() {
    pairs = document.URL.split('?')
           .pop()
           .split('&');

    for (var i = 0, p; i < pairs.length; i++) {
           p = pairs[i].split('=');
           urlParams[ p[0] ] =  p[1];
    }
});
$(document).ready(function() {
	$.ajax({
		cache: false,
		url:'/ServiceStatOps?p=getServiceName&sid=' + filterSid,
		success:function(data) {
			$("#contentheader .panel-heading").text('Dashboards > Service KPIs > ' + data);
		}
	}); 
	if(!$("#submenu-1 #dash2").hasClass("faimagecolor")){
		$("#mainmenu1 #mainmenu1a").trigger("click");
		$("#submenu-1 #dash2").trigger("click");
		$("#submenu-1 #dash2").trigger("focus");
	}
	
	//Redirect jsp pages
    $("#submenu-1 #li_bs").on('click', 'a', function (){
    	window.location.href ="/index.jsp?msbval="+minisideval;
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
	
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/Kpi?p=getServiceKPIHistoryBarChartByKPI&sid=' + filterSid,
		success:function(data) {			
			var charts = data.split('*');
			
			var ctable = $('<table style="width:100%;height:100%;"></table>');
			ctable.appendTo($('#chartsContainer'));
			
			var currentTR;
			var td1;
			var td2;
			for (var i = 0; i < charts.length; i++) {

				var ctr = $('<tr></tr>');
				var ctd = $('<td><td>');
				var chartCanvas = $('<canvas id="chartCanvas' + i + '"></canvas>');
				ctr.appendTo(ctable);
				ctd.appendTo(ctr);
	            chartCanvas.appendTo(ctd);
	            
	            var chartD = JSON.parse(charts[i]);
	            var c = new Chart($('#chartCanvas' + i), chartD);

		    }


			$("#loader").attr('class', 'loader collapse');
		}
	});

});

