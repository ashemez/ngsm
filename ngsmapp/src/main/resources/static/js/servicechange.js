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
	/*$.ajax({
		cache: false,
		url:'/ServiceStatOps?p=getServiceName&sid=' + filterSid,
		success:function(data) {
			$("#contentheader .panel-heading").text('Dashboards > Service KPIs > ' + data);
		}
	});*/
	
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
	console.log('/ServiceChange?p=' + p + '&source_ci_id=' + source_ci_id);
	$.ajax({
		cache: false,
		url:'/ServiceChange?p=' + p + '&source_ci_id=' + source_ci_id,
		success:function(data) {
			
			var changetabletbody = $('#servicechangetable tbody');

			var cnt = 0;
			$.each(JSON.parse(data), function(key,value) {

				var ctr = $('<tr></tr>');
				ctr.appendTo(changetabletbody);
				
				var changetypetd = $('<td></td>');
				var mainsrvcitd = $('<td></td>');
				var mainsrvtd = $('<td></td>');
				var changesrvcitd = $('<td></td>');
				var changesrvtd = $('<td></td>');
				var parentsrvcitd = $('<td></td>');
				var parentsrvtd = $('<td></td>');
				var changedesctd = $('<td></td>');
				var changedatetd = $('<td></td>');
				
				changetypetd.text(value.change_type);
				mainsrvcitd.text(value.main_service_ciid);
				mainsrvtd.text(value.main_service_name);
				changesrvcitd.text(value.changed_service_ciid);
				changesrvtd.text(value.changed_service_name);
				parentsrvcitd.text(value.parent_service_ciid);
				parentsrvtd.text(value.parent_service_name);
				changedesctd.text(value.change_description);
				changedatetd.text(value.changedatestr);

				changetypetd.appendTo(ctr);
				mainsrvcitd.appendTo(ctr);
				mainsrvtd.appendTo(ctr);
				changesrvcitd.appendTo(ctr);
				changesrvtd.appendTo(ctr);
				parentsrvcitd.appendTo(ctr);
				parentsrvtd.appendTo(ctr);
				changedesctd.appendTo(ctr);
				changedatetd.appendTo(ctr);

				cnt++;
		    });

			if(cnt === 0){
				var ctr = $('<tr></tr>');
				ctr.appendTo(changetabletbody);

				var notfoundtd = $('<td colspan="9">Ther is no service change record found<td>');
				notfoundtd.appendTo(ctr);
			}
			$("#loader").attr('class', 'loader collapse');
		}
	});

});

