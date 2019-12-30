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
	$("#contentheader .panel-heading").text('Dashboards > KPI Overall'); 
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
		url:'/Chart?p=getStatusPieChart',
		success:function(data) {
			console.log(data);
			$("#loader").attr('class', 'loader collapse');
			var pieChart = new Chart($("#statpiechart"), JSON.parse(data));
		}
	});
	
	$.ajax({
		cache: false,
		url:'/Chart?p=getLastMonthAvailChartAllServicesPieChart&queryType=LAST_MONTH',
		success:function(data) {
			console.log(data);
			$("#loader").attr('class', 'loader collapse');
			var pieChart = new Chart($("#lastmonthavailpiechart"), JSON.parse(data));
			
			$.ajax({
				cache: false,
				url:'/Chart?p=getTopTenChart&queryType=CURRENT_MONTH',
				success:function(data) {
					console.log(data);
					$("#loader").attr('class', 'loader collapse');
					var pieChart = new Chart($("#currentmonthavailpiechart"), JSON.parse(data));
				}
			});
			
		}
	});
});

