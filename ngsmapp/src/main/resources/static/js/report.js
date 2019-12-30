var urlParams = {};
var maintcheckval=0;
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
	
	$.protip({
	});

    $('#queryType').val(queryType);
    //$('#rpt1_li a')[0].click();
    
    if(urlParams["p"] === "reportjobs"){
        $("#mainmenu2 #mainmenu2a").trigger("click");
        $("#submenu-2 #rpt2_li #rpt2").trigger("click");
    	$("#submenu-2 #rpt2_li #rpt2").trigger("focus");
    	ShowReportJobList();
    } else {
	    $("#mainmenu2 #mainmenu2a").trigger("click");
	    $("#submenu-2 #rpt1_li #rpt1").trigger("click");
		$("#submenu-2 #rpt1_li #rpt1").trigger("focus");
		if(urlParams["p"] === "reportlist"){
			ShowReportList();
		}
    }
    
    $("#mainmenu2 #rpt2_li").on('click', 'a', function (){
    	ShowReportJobList();
	});
    $("#mainmenu2 #rpt1_li").on('click', 'a', function (){
    	ShowReportList();
	});
    
    //Back Button Clicked
    $("#contentpage #rptdiv_back_button").click(function(){
    	$('#rptdiv').attr('class', 'collapse');
    	$('#rptlistdiv').attr('class', '');
    	ShowReportList();
    	//$('#rpt_report_job_div').attr('class', 'collapse');
    });
    
    // Plus/Menus Button Change for new report
    $('#createRptBtn').on('click', function () {
    	if ($('#new_rpt_div').hasClass("collapse")){
    		showCreateReportdiv();
    		/*if($("#crt_queryType:has(option)").val()){
    			$('#new_rpt_div').attr("class"," well");
    		}
    		else{
    			showCreateReportdiv();
    		}*/
    		$('#createRptBtn').removeClass('fa-plus').addClass('fa-minus');    	
    	}
    	else{
    		$('#new_rpt_div').attr("class"," well collapse");
    		$('#createRptBtn').removeClass('fa-minus').addClass('fa-plus');
    	}
    	
    });
    
    // Plus/Menus Button Change for new report job
    $('#createRptJobBtn').on('click', function () {
    	console.log("Create Report Job Clicked!!!");
    	if ($('#rpt_report_job_div #new_rptjobdiv').hasClass('collapse')){
    		console.log("if div close");
    		CreateNewReportJobForm();
    		/*if($("#edit_crt_queryType:has(option)").val()){
    			console.log("not first load");
    			$('#edit_rpt_div').attr('class','well');
    		}
    		else{
    			console.log("first load");
    			CreateNewReportJobForm();   	
    		}*/
    		$('#createRptJobBtn').removeClass('fa-plus').addClass('fa-minus'); 
    	}
    	else{
    		console.log("if div open");
    		$('#new_rptjobdiv').attr("class","well collapse");
    		$('#createRptJobBtn').removeClass('fa-minus').addClass('fa-plus');
    	}
    	
    });
    
	//Redirect jsp pages
    $("#submenu-1 #li_bs").on('click', 'a', function (){
    	window.location.href ="/index.jsp?msbval="+minisideval;
    });
    $("#submenu-1 #li_kpiover").on('click', 'a', function (){
    	window.location.href ="/kpioverall.jsp?msbval="+minisideval;
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
    
	//Delete Report in Report Form
    $("#rptlisttbl").on('click','#rptdeletebtn',function(){
    	console.log("Delete Report in Report Form: "+$(this).attr("data-reportid"));
    	$("#loader").attr('class', 'loader');
    	deleteReportModalShow($(this).attr("data-reportid"));
    	//setEditUserFormValue($(this).attr("data-userid"));
    	//$("#edit_users_form").attr('data-userid', $(this).attr("data-userid"));
    	//$("#edit_users_form").attr('class', 'row');
    });
    
	//Edit Report in Report Form
    $("#rptlisttbl").on('click','#rpteditbtn',function(){
    	console.log("Edit Report in Report Form: "+$(this).attr("data-reportid"));
    	EditReportForm($(this).attr("data-reportid"));
    });
    
  //Close Edit Report in Report Form
    $("#edit_rptlistdiv").on('click','#close_edit_report',function(){
    	$("#edit_rptlistdiv").attr('class', 'collapse');
    	$("#rptlistdiv").attr('class', '');
    	$("#edit_rep_from").attr("class","form-group collapse");
		$("#edit_rep_to").attr("class","form-group collapse");
    }); 
    
    
    $('#saveModal').on('hidden.bs.modal', function () {
    	console.log("Report Hidden model!!!!!!!!!!!");
    	if($("#saveModal").attr("data-form_name") == "addreport"){
    		ShowReportList();
			$('#new_rpt_div #new_rpt_name').val("");
			$('#new_rpt_div #crt_queryType').val("");
			$('#new_rpt_div #crt_rptFromDate').val("");
			$('#new_rpt_div #crt_rptToDate').val("");
			$("#new_rpt_div #crt_queryType").val("LAST_MONTH");
			$('#new_rpt_div #srv_list').val("").trigger("chosen:updated");
			$('#new_rpt_div #new_rep_to').attr("class", "form-group collapse");
			$('#new_rpt_div #new_rep_from').attr("class", "form-group collapse");
    	}
    	if($("#saveModal").attr("data-form_name") == "editreport"){
    		ShowReportList();
    	}
    	if($("#saveModal").attr("data-form_name") == "addreportjob"){
    		ShowCreatedReportJobList();
    		$('#new_rptjobdiv').attr('class', 'collapse');
			$('#createRptJobBtn').removeClass('fa-minus').addClass('fa-plus');
    	}
    	if($("#saveModal").attr("data-form_name") == "editreportjob"){
			ShowCreatedReportJobList();
        	$("#edit_rpt_report_job_div").attr('class', 'collapse');
        	$("#rpt_report_job_div").attr('class', '');
    	}
    });
    
});

function onPeriodSelected(d){
	queryType = d.value;

	if (d.value === "DATE_RANGE"){
		$('#dateDiv').attr("class", "");
		$('#rptBtnDiv').attr("class", "");
	} else if (d.value != "NONE"){
		$('#dateDiv').attr("class", "collapse");
		$('#rptBtnDiv').attr("class", "");
	}
	else {
		$('#dateDiv').attr("class", "collapse");
		$('#rptBtnDiv').attr("class", "collapse");
	}

	//url = '/ReportViewer.jsp?p=' + p + '&sid=' + _ssid + '&queryType=' + queryType + '&startingDate=' + startingDate + '&endingDate=' + endingDate + '&getOutageDetails=' + getOutageDetails
	//ChangeUrl('Service Manager', url);
}

$(function () {
	$('#rptFromDate').datetimepicker();
	$('#rptToDate').datetimepicker();
});

var currentTopServiceName;
var trInd = 0;
function showReport(tbodyID, _sid){
	$('#rptdiv').attr('class', '');
	$('#rptjobdiv').attr('class', 'collapse');
	$('#rptlistdiv').attr('class', 'collapse');
	$('#refreshsaveRptBtn').attr('class', 'collapse');
	$('#createRptJobBtn').attr('class', 'collapse');
	$('#refreshRptBtn').attr('class', 'btn btn-success fa fa-refresh');

	$('#reportcontainertbody').empty();
	trInd++;
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/Report?p=' + p + '&sid=' + _sid + '&queryType=' + queryType + '&startingDate=' + startingDate + '&endingDate=' + endingDate + '&getOutageDetails=' + getOutageDetails+'&enableMaintenance='+maintcheckval,
		success:function(data) {
			$("#loader").attr('class', 'loader collapse');
			$.each(JSON.parse(data), function(key,value) {
				console.log(data);
				  currentTopServiceName = value.service_instance_name;
				  trInd++;
				  var trclass = "";
				  if(value.availabilityMetric < 100){
					  trclass = "warning";
				  }
				  if(value.availabilityMetric < 95){
					  trclass = "danger";
				  }
				  var trdiv = $("<tr class=\"" + trclass + "\" id=\"" + trInd + "tr" + value.service_instance_id + "\"></tr>").attr("data-sid",value.service_instance_id);

				  $('#rptFromDate').val(value.startDateStr);
				  $('#rptToDate').val(value.endDateStr);
				  $('#rpt_servicename').text(value.service_instance_name);

				  $("<td><span title=\"" + value.service_instance_name + "\">" + Truncate(value.service_instance_name) + "</span></td>").appendTo(trdiv);
				  $("<td></td>").text(value.citype).appendTo(trdiv);
				  $("<td></td>").text(value.outageDuration + " (sn)").appendTo(trdiv);
				  $("<td></td>").text(value.maintenanceDuration + " (sn)").appendTo(trdiv);
				  $("<td></td>").text(value.availabilityMetric + "%").appendTo(trdiv);
				  var sscol = $("<td></td>");
				  //var divinput = $("<input type='checkbox' data-toggle='toggle' data-onstyle='success' data-size='mini' data-offstyle='danger' data-on='<i class=\"fa fa-angle-double-up\"></i>' data-off='<li class=\"fa fa-angle-double-down\"></i>'>");
				  var divinput = $("<span id=\"" + trInd + "arrdiv" + value.service_instance_id + "\" class=\"btn btn-success fa fa-angle-double-down\" />");
				  divinput.attr("onclick", "AppendTR('" + trInd + "innertbody" + value.service_instance_id + "', '" + trInd + "tr2" + value.service_instance_id + "', " +  value.service_instance_id + ", '" + trInd + "arrdiv" + value.service_instance_id + "');" );
				  divinput.appendTo(sscol);
				  sscol.append(" ");
				  var details = $("<span id=\"" + trInd + "details" + value.service_instance_id + "\" class=\"btn btn-success fa fa-list-alt\" />");
				  //details.attr("onclick", "ShowOutageDetails(" + JSON.stringify(value.Outages) + ", '" + trInd + "details" + value.service_instance_id + "');");
				  details.attr("onclick","ShowOutageDetailsRedirect(sid="+value.service_instance_id+",queryType=\""+queryType+"\",startingDate="+startingDate+",endingDate="+endingDate+",getOutageDetails="+getOutageDetails+");");
				  details.appendTo(sscol);
				  sscol.append(" ");
				  sscol.appendTo(trdiv);
				  var download = $("<span id=\"" + trInd + "download" + value.service_instance_id + "\" class=\"btn btn-success fa fa-download\" />");
				  download.attr("onclick", "ExportReport(" + value.service_instance_id + ");");
				  download.appendTo(sscol);
				  trdiv.appendTo($("#" + tbodyID));

				  var tr2div = $("<tr class=\"collapse\" id=\"" + trInd + "tr2" + value.service_instance_id + "\"></tr>");
				  var innerTD = $("<td class=\"\" style=\"border-spacing:0;padding:3 0 0 0;\" colspan=\"6\" id=\"" + trInd + "td" + value.service_instance_id + "\"></td>").text("");
				  innerTD.appendTo(tr2div);
				  var innerTable = $("<table id=\"" + trInd + "innertbl" + value.service_instance_id + "\" class=\"table table-striped table-bordered table-condensed table-responsive\" style=\"border-spacing:0;padding:0;\"></table>");
				  var thead = $("<thead><tr class=\"bg-info\"><th>Service Name</th><th>CI Type</th><th>Outage Duration</th><th>Availability Metric</th><th>Action</th></tr></thead>");
				  thead.appendTo(innerTable);
				  var innertbody = $("<tbody id=\"" + trInd + "innertbody" + value.service_instance_id + "\"></tbody>");
				  innertbody.appendTo(innerTable);
				  innerTable.appendTo(innerTD);
				  tr2div.appendTo($("#" + tbodyID));
			});
		}
	});
}

function showReportByReportID(tbodyID, rpt_id){
	$('#rptdiv').attr('class', '');
	$('#rptjobdiv').attr('class', 'collapse');
	$('#rptlistdiv').attr('class', 'collapse');
	$('#rptBtnDiv').attr("class", "");	
	$('#refreshRptBtn').attr("class", "collapse");	
	$('#refreshsaveRptBtn').attr("class","btn btn-success fa fa-refresh");
	$('#refreshsaveRptBtn').attr("data-rptid",rpt_id);
	$('#queryType').prop( "disabled", true);
	$('#rptFromDate').prop( "disabled", true);
	$('#rptToDate').prop( "disabled", true);
	$('#rptFromDate').attr('class', 'form-control btn btn-warn');
	$('#rptToDate').attr('class', 'form-control btn btn-warn');
	
	report_id=rpt_id;
	
	$('#reportcontainertbody').empty();
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/Report?p=getCreatedReportOut&report_id=' + rpt_id,
		success:function(data) {
			console.log(data);
			$.each(JSON.parse(data), function(key,value) {
				  currentTopServiceName = value.service_instance_name;
				  trInd++;
				  
				  var trclass = "";
				  if(value.availabilityMetric < 100){
					  trclass = "warning";
				  }
				  if(value.availabilityMetric < 95){
					  trclass = "danger";
				  }
				  var trdiv = $("<tr class=\"" + trclass + "\" id=\"" + trInd + "tr" + value.service_instance_id + "\"></tr>").attr("data-sid",value.service_instance_id);

				  queryType = value.queryType;
				  startingDate = value.startDate;
				  endingDate = value.endDate;

				  $('#rptFromDate').val(value.startDateStr);
				  $('#rptToDate').val(value.endDateStr);
				  $('#rpt_servicename').text(value.service_instance_name);

				  $("<td><span title=\"" + value.service_instance_name + "\">" + Truncate(value.service_instance_name) + "</span></td>").appendTo(trdiv);
				  $("<td></td>").text(value.citype).appendTo(trdiv);
				  $("<td></td>").attr("id","outageval").text(value.outageDuration + " (sn)").appendTo(trdiv);
				  $("<td></td>").attr("id","maintval").text(value.maintenanceDuration + " (sn)").appendTo(trdiv);
				  $("<td></td>").attr("id","availval").text(value.availabilityMetric + "%").appendTo(trdiv);
				  var sscol = $("<td></td>");
				  //var divinput = $("<input type='checkbox' data-toggle='toggle' data-onstyle='success' data-size='mini' data-offstyle='danger' data-on='<i class=\"fa fa-angle-double-up\"></i>' data-off='<li class=\"fa fa-angle-double-down\"></i>'>");
				  var divinput = $("<span id=\"" + trInd + "arrdiv" + value.service_instance_id + "\" class=\"btn btn-success fa fa-angle-double-down\" />");
				  divinput.attr("onclick", "AppendTR('" + trInd + "innertbody" + value.service_instance_id + "', '" + trInd + "tr2" + value.service_instance_id + "', " +  value.service_instance_id + ", '" + trInd + "arrdiv" + value.service_instance_id + "');" );
				  divinput.appendTo(sscol);
				  sscol.append(" ");
				  var details = $("<span id=\"" + trInd + "details" + value.service_instance_id + "\" class=\"btn btn-success fa fa-list-alt\" />");
				  //details.attr("onclick", "ShowOutageDetails(" + JSON.stringify(value.Outages) + ", '" + trInd + "details" + value.service_instance_id + "');");
				  details.attr("onclick","ShowOutageDetailsRedirect(sid="+value.service_instance_id+",queryType=\""+queryType+"\",startingDate="+startingDate+",endingDate="+endingDate+",getOutageDetails="+getOutageDetails+");");
				  details.appendTo(sscol);
				  sscol.append(" ");
				  sscol.appendTo(trdiv);
				  var download = $("<span id=\"" + trInd + "download" + value.service_instance_id + "\" class=\"btn btn-success fa fa-download\" />");
				  download.attr("onclick", "ExportReport(" + value.service_instance_id + ");");
				  download.appendTo(sscol);
				  trdiv.appendTo($("#" + tbodyID));

				  var tr2div = $("<tr class=\"collapse\" id=\"" + trInd + "tr2" + value.service_instance_id + "\"></tr>");
				  var innerTD = $("<td class=\"\" style=\"border-spacing:0;padding:3 0 0 0;\" colspan=\"6\" id=\"" + trInd + "td" + value.service_instance_id + "\"></td>").text("");
				  innerTD.appendTo(tr2div);
				  var innerTable = $("<table id=\"" + trInd + "innertbl" + value.service_instance_id + "\" class=\"table table-striped table-bordered table-condensed table-responsive\" style=\"border-spacing:0;padding:0;\"></table>");
				  var thead = $("<thead><tr class=\"bg-info\"><th>Service Name</th><th>CI Type</th><th>Outage Duration</th><th>Availability Metric</th><th>Action</th></tr></thead>");
				  thead.appendTo(innerTable);
				  var innertbody = $("<tbody id=\"" + trInd + "innertbody" + value.service_instance_id + "\"></tbody>");
				  innertbody.appendTo(innerTable);
				  innerTable.appendTo(innerTD);
				  tr2div.appendTo($("#" + tbodyID));
				  
				  $('#rptFromDate').val(value.startDateStr);
				  $('#rptToDate').val(value.endDateStr);
				  $('#queryType').val(value.queryType);
				  if(value.queryType === "DATE_RANGE"){
					  $('#dateDiv').attr('class', '');
				  }
			});

			if(_ssid === undefined)
				_ssid = 0;
			var newurl = '/ReportViewer.jsp?p=' + p + '&report_id=' + rpt_id + '&sid=' + _ssid + '&queryType=' + queryType + '&startingDate=' + startingDate + '&endingDate=' + endingDate + '&getOutageDetails=' + getOutageDetails
			
			//ChangeUrl('Service Manager', newurl);
			
			$("#loader").attr('class', 'loader collapse');
		}
	});
}

function showChildrenReport(tbodyID, _sid){
	$("#loader").attr('class', 'loader');
	console.log('/Report?p=getCalculatedOutageReportOfChildren&sid=' + _sid + '&queryType=' + queryType + '&startingDate=' + startingDate + '&endingDate=' + endingDate + '&getOutageDetails=' + getOutageDetails);
	$.ajax({
		cache: false,
		url:'/Report?p=getCalculatedOutageReportOfChildren&sid=' + _sid + '&queryType=' + queryType + '&startingDate=' + startingDate + '&endingDate=' + endingDate + '&getOutageDetails=' + getOutageDetails,
		success:function(data) {
			$.each(JSON.parse(data), function(key,value) {
				  trInd++;
				  
				  var trclass = "";
				  if(value.availabilityMetric < 100){
					  trclass = "warning";
				  }
				  if(value.availabilityMetric < 95){
					  trclass = "danger";
				  }
				  var trdiv = $("<tr class=\"" + trclass + "\" id=\"" + trInd + "tr" + value.service_instance_id + "\"></tr>").attr("data-sid",value.service_instance_id);
				  $("<td><span title=\"" + value.service_instance_name + "\">" + Truncate(value.service_instance_name) + "</span></td>").appendTo(trdiv);
				  $("<td></td>").text(value.citype).appendTo(trdiv);
				  $("<td></td>").text(value.outageDuration + " (sn)").appendTo(trdiv);
				  $("<td></td>").text(value.availabilityMetric + "%").appendTo(trdiv);
				  var sscol = $("<td></td>");
				  //var divinput = $("<input type='checkbox' data-toggle='toggle' data-onstyle='success' data-size='mini' data-offstyle='danger' data-on='<i class=\"fa fa-angle-double-up\"></i>' data-off='<li class=\"fa fa-angle-double-down\"></i>'>");
				  var divinput = $("<span id=\"" + trInd + "arrdiv" + value.service_instance_id + "\" class=\"btn btn-success fa fa-angle-double-down\" />");
				  divinput.attr("onclick", "AppendTR('" + trInd + "innertbody" + value.service_instance_id + "', '" + trInd + "tr2" + value.service_instance_id + "', " +  value.service_instance_id + ", '" + trInd + "arrdiv" + value.service_instance_id + "');" );
				  divinput.appendTo(sscol);
				  sscol.append(" ");
				  var details = $("<span id=\"" + trInd + "details" + value.service_instance_id + "\" class=\"btn btn-success fa fa-list-alt\" />");
				  //details.attr("onclick", "ShowOutageDetails(" + JSON.stringify(value.Outages) + ", '" + trInd + "details" + value.service_instance_id + "');");
				  details.attr("onclick","ShowOutageDetailsRedirect(sid="+value.service_instance_id+",queryType=\""+queryType+"\",startingDate="+startingDate+",endingDate="+endingDate+",getOutageDetails="+getOutageDetails+");");				  
				  details.appendTo(sscol);
				  sscol.append(" ");
				  var download = $("<span id=\"" + trInd + "download" + value.service_instance_id + "\" class=\"btn btn-success fa fa-download\" />");
				  download.attr("onclick", "ExportReport(" + value.service_instance_id + ");");
				  download.appendTo(sscol);
				  
				  sscol.appendTo(trdiv);
				  trdiv.appendTo($("#" + tbodyID));
				  
				  var tr2div = $("<tr class=\"collapse\" id=\"" + trInd + "tr2" + value.service_instance_id + "\"></tr>");
				  var innerTD = $("<td class=\"\" style=\"border-spacing:0;padding:3 0 0 0;\" colspan=\"6\" id=\"" + trInd + "td" + value.service_instance_id + "\"></td>").text("");
				  innerTD.appendTo(tr2div);
				  var innerTable = $("<table id=\"" + trInd + "innertbl" + value.service_instance_id + "\" class=\"table table-striped table-bordered table-condensed table-responsive\" style=\"border-spacing:0;padding:0;width:100%;\"></table>");
				  var thead = $("<thead><tr class=\"bg-info\"><th>Service Name</th><th>CI Type</th><th>Outage Duration</th><th>Availability Metric</th><th>Action</th></tr></thead>");
				  thead.appendTo(innerTable);
				  var innertbody = $("<tbody id=\"" + trInd + "innertbody" + value.service_instance_id + "\"></tbody>");
				  innertbody.appendTo(innerTable);
				  innerTable.appendTo(innerTD);
				  tr2div.appendTo($("#" + tbodyID));
			});

			$("#loader").attr('class', 'loader collapse');
		}
	});
}

function AppendTR(tbodyID, tr, sid, arrid){
	if($('#' + arrid).hasClass("btn-success")){
		$('#' + arrid).attr("class", "btn btn-danger fa fa-angle-double-up");
		showChildrenReport(tbodyID, sid);
		$('#' + tr).attr("class", "");
	} else {
		$('#' + arrid).attr("class", "btn btn-success fa fa-angle-double-down");
		$('#' + tbodyID).empty();
		$('#' + tr).attr("class", "collapse");
	}
}

var lastSelectedDetails;
function ShowOutageDetails(data, detailsId){
	$('#outagedetailsdiv').attr("class", "outerDiv");
	if(lastSelectedDetails != undefined)
		$('#' + lastSelectedDetails).attr("class", "btn btn-success fa fa-list-alt");
	$('#' + detailsId).attr("class", "btn btn-danger fa fa-list-alt");
	lastSelectedDetails = detailsId;

	$('#outagedetails').empty();
	$.each(data, function(key,value) {
		  var trdiv = $("<tr></tr>");
		  $("<td><span title=\"" + value.outageStartStr + "\">" + value.outageStartStr + "</span></td>").appendTo(trdiv);
		  $("<td><span title=\"" + value.outageEndStr + "\">" + value.outageEndStr + "</span></td>").appendTo(trdiv);
		  $("<td><span title=\"" + value.service_instance_name + "\">" + Truncate(value.service_instance_name) + "</span></td>").appendTo(trdiv);
		  $("<td><span title=\"" + value.outageDuration + " (sn)\">" + value.outageDuration + " (sn)</span></td>").appendTo(trdiv);
		  trdiv.appendTo($('#outagedetails'));
	});
}

function ShowOutageDetailsRedirect(sid,queryType,startingDate,endingDate,getOutageDetails){
	console.log("SID:"+sid+",queryType:"+queryType+",startingDate:"+startingDate+",endingDate:"+endingDate+",getOutageDetails:"+getOutageDetails);
	window.open("/OutageDetails.jsp?sid="+sid+"&startingDate="+startingDate+"&endingDate="+endingDate+"&getOutageDetails="+getOutageDetails+"&queryType="+queryType+"", "_blank");
}

function Truncate(str){
	if(str != undefined){
		var sstr = str.toString();
		if(sstr.length > 40)
			return $.trim(sstr.toString()).substring(0, 40) + "...";
	}
	return str;
}

function ChangeUrl(title, url) {
    if (typeof (history.pushState) != "undefined") {
        var obj = { Title: title, Url: url };
        history.pushState(obj, obj.Title, obj.Url);
    } else {
        alert("Browser does not support HTML5.");
    }
}

function RefreshReport(){
	startingDate=Date.parse($('#rptFromDate').val()) / 1000;
	endingDate=Date.parse($('#rptToDate').val()) / 1000;
	showReport('reportcontainer', _ssid);
	console.log($('#rptFromDate').val() + " " + startingDate + " " + endingDate);
	url = '/ReportViewer.jsp?p=' + p + '&report_id=' + report_id + '&sid=' + _ssid + '&queryType=' + queryType + '&startingDate=' + startingDate + '&endingDate=' + endingDate + '&getOutageDetails=' + getOutageDetails + '&enableMaintenance=' + maintcheckval
	//ChangeUrl('Service Manager', url);
}

function RefreshSavedReport(){
	var rptid = $("#refreshsaveRptBtn").attr("data-rptid");
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/Report?p=getCreatedReportOut&report_id=' + rptid+'&enableMaintenance='+maintcheckval,
		success:function(data) {
			console.log(data);
			$("#loader").attr('class', 'loader collapse');
			$.each(JSON.parse(data), function(key,value) {
				$("#reportcontainer #outageval").text(value.outageDuration + " (sn)");
				$("#reportcontainer #maintval").text(value.maintenanceDuration + " (sn)");
				$("#reportcontainer #availval").text(value.availabilityMetric + "%");
			});

		}
	});
}

function CheckMaint(){
	if($("#checkMaintBtn").hasClass("btn-danger")){
		$("#checkMaintBtn").removeClass("btn-danger");
		$("#checkMaintBtn").addClass("mybtn");
		maintcheckval = 0;
	}
	else{
		$("#checkMaintBtn").removeClass("mybtn");
		$("#checkMaintBtn").addClass("btn-danger");	
		maintcheckval = 1;
	}
}

function ExportReport(sid){
	console.log('/Report?p=getReportOfServiceTree&sid=' + sid + '&queryType=' + queryType + '&startingDate=' + startingDate + '&endingDate=' + endingDate + '&getOutageDetails=' + getOutageDetails);
	$.ajax({
		cache: false,
		url:'/Report?p=getReportOfServiceTree&sid=' + sid + '&queryType=' + queryType + '&startingDate=' + startingDate + '&endingDate=' + endingDate + '&getOutageDetails=' + getOutageDetails,
		success:function(data) {
			var jData = JSON.parse(data);
			JSONArrayToCSV(jData, jData[0].service_instance_name, true);
		}
	});
	
	//JSONToCSV(data, data.service_instance_name, true);
	//JSONArrayToCSV(data.Outages, data.service_instance_name + " Outages", true);
}

function JSONArrayToCSV(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';
    CSV += "Date Range: " + arrData[0]['startDateStr'] + " - " + arrData[0]['endDateStr'] + "\r\n\n";

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }
        
        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
        	if(index != 'Outages')
        		row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "Report_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function JSONToCSV(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';
    CSV += arrData.startDateStr + " - " + arrData.endDateStr + "\r\n\n";

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        /*for (var index in arrData[0]) {
            console.log("**** " + index);
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }
        
        row = row.slice(0, -1);*/
        
        row += "Service Name,Outage Duration,Availability Metric";
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    /*for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }*/
    
    row = arrData.service_instance_name + "," + arrData.outageDuration + "," + arrData.availabilityMetric;
    
    CSV += row + '\r\n';

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "Report_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function openRptWRSB(){
	$('#page-content-wrapper .container-fluid').attr('class','container-fluid col-md-6');
	$('#rightsidebar').attr('class', 'col-md-6');
	$("#rightsidebar").on('click','#closerptrsb', function(){
		closeRptRSB();
		clearRptRSB();
	});
}

function clearRptRSB(){
	$("#rightsidebar").empty();
}

function closeRptRSB(){
	$('#page-content-wrapper .container-fluid').attr('class','container-fluid');
	$('#rightsidebar').attr('class', 'collapse');
}

function onCrtPeriodSelected(d){
	if (d.value === "DATE_RANGE"){
		$('#crt_dateDiv').attr("class", "");
		$('#new_rep_from').attr("class", "form-group");
		$('#new_rep_to').attr("class", "form-group");
		//$('#crt_rptFromDate').datetimepicker();
		//$('#crt_rptToDate').datetimepicker();
	} else {
		$('#crt_dateDiv').attr("class", "collapse");
		$('#new_rep_to').attr("class", "form-group collapse");
		$('#new_rep_from').attr("class", "form-group collapse");
	}

	//url = '/ReportViewer.jsp?p=' + p + '&sid=' + _ssid + '&queryType=' + queryType + '&startingDate=' + startingDate + '&endingDate=' + endingDate + '&getOutageDetails=' + getOutageDetails
	//ChangeUrl('Service Manager', url);
}

function onCrtPeriodSelectedEdit(d){
	if (d.value === "DATE_RANGE"){
		$("#edit_rep_from").attr("class", "form-group");
		$("#edit_rep_to").attr("class", "form-group");
		//$('#edit_crt_rptFromDate').datetimepicker();
		//$('#edit_crt_rptToDate').datetimepicker();
	} else {
		$('#edit_rep_to').attr("class", "form-group collapse");
		$('#edit_rep_from').attr("class", "form-group collapse");
	}

	//url = '/ReportViewer.jsp?p=' + p + '&sid=' + _ssid + '&queryType=' + queryType + '&startingDate=' + startingDate + '&endingDate=' + endingDate + '&getOutageDetails=' + getOutageDetails
	//ChangeUrl('Service Manager', url);
}
function showCreateReportRSB(){
	//$('#rptdiv').attr('class', '');
	//$('#rptlistdiv').attr('class', 'collapse');
	$('#rptjoblistdiv').attr('class', 'collapse');
	$('#form_message_div').attr('class', 'collapse');
	$('#new_rptjobdiv').attr('class', 'collapse');
	
	clearRptRSB();

	startingDate=Date.parse($('#rptFromDate').val()) / 1000;
	endingDate=Date.parse($('#rptToDate').val()) / 1000;

	// _ssid, currentTopServiceName
	
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/Report?p=getAllServiceList',
		success:function(data) {
			$("#loader").attr('class', '');
			
			// service list data
			var jData = JSON.parse(data);
			
			var headerdiv = $("<div></div>").addClass("modal-header");
			var closediv = $("<div></div>").addClass("close").attr("id","closerptrsb").text("x").appendTo(headerdiv);
			var hdiv = $("<h3></h3>").text("Create New Report").appendTo(headerdiv);
			
			var bodydiv = $("<div></div>").addClass("modal-body");
			var innerdiv1 = $("<div></div>");
			
			//$("<label></label>").attr("id", _ssid).text(currentTopServiceName).appendTo(innerdiv1);
			var label1 = $("<label class='control-label'>Select Services:</label>");
			var srvselect = $("<select data-placeholder='Select a service...' id='srv_list' multiple='multiple' class='form-control'></select>");
			$.each(jData, function(key,value) {
				  // var selected = "";
				  //if(_ssid === value.service_instance_id)
				  //	selected = "selected";
				  var option = $("<option value='" + value.service_instance_id + "' >" + value.service_instance_name + "</option>");
				  option.appendTo(srvselect);
			});
			label1.appendTo(innerdiv1);
			srvselect.appendTo(innerdiv1);
			var label2 = $("<label class='control-label'>Report Name:</label>");
			label2.appendTo(innerdiv1);
			$("<input>").attr("id","new_rpt_name").attr("placeholder","Enter a report name").attr("type","text").appendTo(innerdiv1);
			var period = $('<div class="input-group" id="crt_periodselectlist"></div>');
			$('<span class="input-group-addon"><i class="fa fa-list"></i></span>').appendTo(period);
			var label3 = $("<label class='control-label'>Select Date Range:</label>");
			var pselect = $('<select class="form-control" id="crt_queryType" onchange="onCrtPeriodSelected(this);"></select>');
			$('<option value="LAST_DAY">Last Day</option>').appendTo(pselect);
			$('<option value="LAST_WEEK">Last Week</option>').appendTo(pselect);
			$('<option value="LAST_MONTH">Last Month</option>').appendTo(pselect);
			$('<option value="DATE_RANGE">Date Range</option>').appendTo(pselect);
			pselect.appendTo(period);
			label3.appendTo(innerdiv1);
			period.appendTo(innerdiv1);
			
			var dateClass = "collapse";
			if($('#queryType').val() === "DATE_RANGE"){
				dateClass = "";
			}
			var datediv = $('<div id="crt_dateDiv" class="' + dateClass + '"></div>');
			var datetbl = $('<table class="table table-striped"></table>');
			var trfrom = $('<tr></tr>');
			$('<td class="bg bg-info">From: </td>').appendTo(trfrom);
			$('<td><div class="col-md-6 input-group"><span class="input-group-addon"><i class="fa fa-calendar"></i></span><input class="form-control btn btn-warning" id="crt_rptFromDate" type="text" value="Select..."></div></td>').appendTo(trfrom);
			trfrom.appendTo(datetbl);
			var trto = $('<tr></tr>');
			$('<td class="bg bg-info">To: </td>').appendTo(trto);
			$('<td><div class="col-md-6 input-group"><span class="input-group-addon"><i class="fa fa-calendar"></i></span><input class="form-control btn btn-warning" id="crt_rptToDate" type="text" value="Select..."></div></td>').appendTo(trto);
			trto.appendTo(datetbl);
			datetbl.appendTo(datediv);
			datediv.appendTo(innerdiv1);
			
			innerdiv1.appendTo(bodydiv);
			
			var footerdiv = $("<div></div>")
					.addClass("modal-footer");
			$("<button></button>").addClass("btn btn-warning").attr("type","submit").attr("id","saverptbtn").attr("onclick", "CreateNewReport();").text("Save").appendTo(footerdiv);

			headerdiv.appendTo($("#rightsidebar"));
			bodydiv.appendTo($("#rightsidebar"));
			footerdiv.appendTo($("#rightsidebar"));
			
			$('#crt_queryType').val(queryType);
			$('#crt_rptFromDate').val($('#rptFromDate').val());
			$('#crt_rptToDate').val($('#rptToDate').val());
			$('#crt_rptFromDate').datetimepicker();
			$('#crt_rptToDate').datetimepicker();
			
			// server list search
			$('#srv_list').val(_ssid); // Select the value before .chosen();
			var $chosen = $('#srv_list').chosen({
				max_selected_options: 1,
			});
			$chosen.change(function () {
			  var $this = $(this);
			  var chosen = $this.data('chosen');
			  var search = chosen.search_container.find('input[type="text"]');
			  
			  //search.prop('disabled', $this.val() !== null);
			  
			  //_ssid = JSON.parse(chosen)[0];
			  if($('#srv_list').val().length > 0)
				  _ssid = JSON.parse($('#srv_list').val());
			  // console.log(JSON.parse($('#srv_list').val()));
			  console.log(chosen.active_field);
			  if (chosen.active_field) {
			    search.focus();
			  }
			});

		}
	});
	$("#srv_list").val(_ssid).trigger("chosen:updated");
	//$('#srv_list').val(_ssid).trigger("liszt:updated");
	openRptWRSB();
}

function showCreateReportdiv(){
	$('#rptjoblistdiv').attr('class', 'collapse');
	$('#form_message_div').attr('class', 'collapse');
	$('#new_rptjobdiv').attr('class', 'collapse');
	$('#new_rpt_div').attr('class','well');
	$("#new_rpt_name").val("");
	$("#crt_queryType option").remove();
	$("#srv_list option").remove();
	$('#crt_rptFromDate').datetimepicker("destroy");
	$('#crt_rptToDate').datetimepicker("destroy");
	$('#new_rpt_div #new_rep_to').attr("class", "form-group collapse");
	$('#new_rpt_div #new_rep_from').attr("class", "form-group collapse");

	startingDate=Date.parse($('#rptFromDate').val()) / 1000;
	endingDate=Date.parse($('#rptToDate').val()) / 1000;
	
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/Report?p=getAllServiceList',
		success:function(data) {
			$("#loader").attr('class', '');
			
			// service list data
			var jData = JSON.parse(data);
			$.each(jData, function(key,value) {
				  // var selected = "";
				  //if(_ssid === value.service_instance_id)
				  //	selected = "selected";
				  var option = $("<option value='" + value.service_instance_id + "' >" + value.service_instance_name + "</option>");
				  option.appendTo($("#srv_list"));
			});
			console.log("Option is added");
			$("#srv_list").val("").trigger("chosen:updated");
			$('<option value="LAST_DAY">Last Day</option>').appendTo($("#crt_queryType"));
			$('<option value="LAST_WEEK">Last Week</option>').appendTo($("#crt_queryType"));
			$('<option value="LAST_MONTH">Last Month</option>').appendTo($("#crt_queryType"));
			$('<option value="DATE_RANGE">Date Range</option>').appendTo($("#crt_queryType"));
			
			
			var dateClass = "collapse";
			/*if($('#queryType').val() === "DATE_RANGE"){
				$('#crt_rptFromDate').datetimepicker();
				$('#crt_rptToDate').datetimepicker();
			}*/
			$('#crt_rptFromDate').datetimepicker();
			$('#crt_rptToDate').datetimepicker();
			$('#crt_queryType').val(queryType);
			$('#crt_rptFromDate').val($('#rptFromDate').val());
			//console.log("Fromdate:"+$('#rptFromDate').val());
			//console.log("Todate:"+$('#crt_rptToDate').val());
			$('#crt_rptToDate').val($('#rptToDate').val());
			
			
			// server list search
			$('#srv_list').val(_ssid); // Select the value before .chosen();
			var $chosen = $('#srv_list').chosen({
				max_selected_options: 1,
			});
			$chosen.change(function () {
			  var $this = $(this);
			  var chosen = $this.data('chosen');
			  var search = chosen.search_container.find('input[type="text"]');
			  
			  //search.prop('disabled', $this.val() !== null);
			  
			  //_ssid = JSON.parse(chosen)[0];
			  if($('#srv_list').val().length > 0){
			    //_ssid = JSON.parse($('#srv_list').val());
			    $('#saverptbtn').attr('data-sid', $('#srv_list').val());
			    console.log(JSON.parse($('#srv_list').val()));
			  }
			  console.log("Chosen Active Field:"+chosen.active_field);
			  if (chosen.active_field) {
			    search.focus();
			  }
			});

		}
	});
	//$("#srv_list").trigger("chosen:updated");
	//$('#srv_list').val(_ssid).trigger("liszt:updated");
}

function EditReportForm(report_id){
	$('#rptlistdiv').attr('class', 'collapse');
	$('#edit_rptlistdiv').attr('class', '');
	$("#edit_crt_queryType option").remove();
	$("#edit_rpt_name").val("");
	$("#edit_crt_rptFromDate").datetimepicker("reset");
	$("#edit_crt_rptToDate").datetimepicker("reset");
	$("#edit_crt_rptFromDate").datetimepicker("destroy");
	$("#edit_crt_rptToDate").datetimepicker("destroy");
	
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/Report?p=getAllServiceList',
		success:function(data) {
			$("#loader").attr('class', '');
			
			// service list data
			var jData1 = JSON.parse(data);
			
			$('#edit_srv_list option').remove();
			$.each(jData1, function(key,value) {
				  // var selected = "";
				  //if(_ssid === value.service_instance_id)
				  //	selected = "selected";
				  var option = $("<option value='" + value.service_instance_id + "' >" + value.service_instance_name + "</option>");
				  option.appendTo($("#edit_srv_list"));
			})
			
			$.ajax({
				cache: false,
				url:'/Report?p=getReport&report_id=' + report_id,
				success:function(data) {
					console.log(data);
					var jData = JSON.parse(data);
					
					// report name
					$('#edit_rpt_name').val(jData.report_name);
					//console.log("Report name:" + $('#edit_rpt_name').val());
					
					$('<option value="LAST_DAY">Last Day</option>').appendTo($("#edit_crt_queryType"));
					$('<option value="LAST_WEEK">Last Week</option>').appendTo($("#edit_crt_queryType"));
					$('<option value="LAST_MONTH">Last Month</option>').appendTo($("#edit_crt_queryType"));
					$('<option value="DATE_RANGE">Date Range</option>').appendTo($("#edit_crt_queryType"));
					
					$('#edit_crt_queryType').val(jData.queryType);
					$('#edit_crt_rptFromDate').datetimepicker();
					$('#edit_crt_rptToDate').datetimepicker();
					//$('#edit_crt_rptFromDate').datetimepicker({dateFormat: "yy-mm-dd HH:ii:ss"});
					//$('#edit_crt_rptToDate').datetimepicker({dateFormat: "yy-mm-dd HH:ii:ss"});
					if($('#edit_crt_queryType').val() === "DATE_RANGE"){
						console.log("kkkkkk");
						$("#edit_rep_from").attr("class","form-group");
						$("#edit_rep_to").attr("class","form-group");
						$("#edit_crt_rptFromDate").val(isotodatetime(new Date(jData.startDateStr*1000)));
						$("#edit_crt_rptToDate").val(isotodatetime(new Date(jData.endDateStr*1000)));
						$('#edit_crt_rptFromDate').datetimepicker({dateFormat: "yy-mm-dd HH:ii:ss"});
						$('#edit_crt_rptToDate').datetimepicker({dateFormat: "yy-mm-dd HH:ii:ss"});
						//console.log("Fromdate:"+$("#edit_crt_rptFromDate").val());
						//console.log("Todate:"+$("#edit_crt_rptToDate").val());
						//isotodatetime(new Date(jData.endDateStr*1000));
					}
					else{
						$("#edit_rep_from").attr("class","form-group collapse");
						$("#edit_rep_to").attr("class","form-group collapse");
					}
					
					//console.log("SID:"+jData.service_instance_id);
					$('#saverpteditbtn').attr('data-sid', jData.service_instance_id);
					// server list search
					$('#edit_srv_list').val(jData.service_instance_id).trigger("chosen:updated"); // Select the value before .chosen();
					var $chosen = $('#edit_srv_list').chosen({
						max_selected_options: 1,
					});
					//$('#edit_srv_list').val(jData.service_instance_id); // Select the value before .chosen();
					//$('#edit_srv_list').trigger("chosen:updated");
					$chosen.change(function () {
					  var $this = $(this);
					  var chosen = $this.data('chosen');
					  var search = chosen.search_container.find('input[type="text"]');
					  
					  //search.prop('disabled', $this.val() !== null);
					  
					  //_ssid = JSON.parse(chosen)[0];
					  //console.log("jjjj"+$('#edit_srv_list').val().length);
					  //if($('#edit_srv_list').val().length > 0)
					  //	  _ssid = JSON.parse($('#edit_srv_list').val());
					  //console.log(chosen.active_field);
					  if (chosen.active_field) {
					    search.focus();
					    //console.log($('#edit_srv_list').val());
					    $('#saverpteditbtn').attr('data-sid', $('#edit_srv_list').val());
					  }
					});
							
					$("#loader").attr('class', 'loader collapse');
				}
			});
		}
			
	});
	//$("#edit_srv_list").val(_ssid).trigger("chosen:updated");
	$('#saverpteditbtn').attr('onclick', 'EditReportSave(' + report_id + ');');
}

function CreateNewReport(){
	var crt_qtype = $('#crt_queryType').val();
	var crt_startingDate=Date.parse($('#crt_rptFromDate').val()) / 1000;
	var crt_endingDate=Date.parse($('#crt_rptToDate').val()) / 1000;
	
	if(isNaN(crt_startingDate))
		crt_startingDate = 0;
	if(isNaN(crt_endingDate))
		crt_endingDate = 0;
	
	//console.log(crt_startingDate + ' ' + crt_endingDate);
	//var uuu = '/Report?p=createNewReport&sid=' + _ssid + '&queryType=' + crt_qtype + '&startingDate=' + crt_startingDate + '&endingDate=' + crt_endingDate + '&getOutageDetails=1&name=' + $('#new_rpt_name').val();
	//console.log(uuu);
	$.ajax({
		cache: false,
		url:'/Report?p=createNewReport&sid=' + $('#saverptbtn').attr('data-sid') + '&queryType=' + crt_qtype + '&startingDate=' + crt_startingDate + '&endingDate=' + crt_endingDate + '&getOutageDetails=1&name=' + $('#new_rpt_name').val(),
		success:function(data) {
			console.log(data);
			var jData = JSON.parse(data);
			if(jData.state != undefined){
				
				//clearRptRSB();
				//var headerdiv = $("<div></div>").addClass("modal-header");
				//var closediv = $("<div></div>").addClass("close").attr("id","closerptrsb").text("x").appendTo(headerdiv);
				//var hdiv = $("<h3></h3>").text("Create New Report").appendTo(headerdiv);
				//var bodydiv = $("<div></div>").addClass("modal-body");
				//var innerdiv1 = $("<div></div>");
				//$("<label></label>").attr("id", _ssid).text(jData.message).appendTo(innerdiv1);
				//innerdiv1.appendTo(bodydiv);
				//headerdiv.appendTo($("#rightsidebar"));
				//bodydiv.appendTo($("#rightsidebar"));
				//$('#new_rpt_div #new_report_form_message_div').delay(1000).css("display","block").slideUp({ opacity: "show" }, "slow");
				//ShowReportList();
				
				if(jData.state == "SUCCESS"){
					$("#saveModal").attr("data-form_name","addreport");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
					console.log(jData.message);
				}
				else{
					$("#saveModal").attr("data-form_name","addreport");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
				}
				
				/*$('#new_rpt_div #new_rpt_name').val("");
				$('#new_rpt_div #crt_queryType').val("");
				$('#new_rpt_div #crt_rptFromDate').val("");
				$('#new_rpt_div #crt_rptToDate').val("");
				$("#new_rpt_div #crt_queryType").val("LAST_MONTH");
				$('#new_rpt_div #srv_list').val("").trigger("chosen:updated");
				$('#new_rpt_div #new_rep_to').attr("class", "form-group collapse");
				$('#new_rpt_div #new_rep_from').attr("class", "form-group collapse");*/
			}
		}
	});
}

function ShowReportList(){
	$('#rptdiv').attr('class', 'collapse');
	$('#rptlistdiv').attr('class', '');
	$('#edit_rptlistdiv').attr('class', 'collapse');
	$('#edit_rpt_report_job_div').attr('class', 'collapse');
	//$('#createRptJobBtn').attr('class', 'collapse');
	//$('#rptjoblistdiv').attr('class', 'collapse');
	//$('#form_message_div').attr('class', 'collapse');
	//$('#new_rptjobdiv').attr('class', 'collapse');
	$('#rpt_report_job_div').attr('class', 'collapse');
	$("#contentheader .panel-heading").text('Reporting > Reports');
	
	if($('#createRptBtn').hasClass('fa-minus')){
		$('#new_rpt_div').attr("class"," well collapse");
		$('#createRptBtn').removeClass('fa-minus').addClass('fa-plus');
	}
	
	$("#loader").attr('class', 'loader');	
	$('#rptlisttbody').empty();
	
	$.ajax({
		cache: false,
		url:'/Report?p=isEditReportAuthorized',
		success:function(edata) {
			$.ajax({
				cache: false,
				url:'/Report?p=getCreatedReportList',
				success:function(data) {
					var jData = JSON.parse(data);
					$.each(jData, function(key,value) {
						  trInd++;
						  var trdiv = $("<tr></tr>").attr("data-reportid",value.report_id);
						  $("<td><span title=\"" + value.report_name + "\">" + Truncate(value.report_name) + "</span></td>").appendTo(trdiv);
						  $("<td><span title=\"" + value.service_instance_name + "\">" + Truncate(value.service_instance_name) + "</span></td>").appendTo(trdiv);
						  var rptPeriod = "Date range";
						  var fromDate = " - ";
						  var toDate = " - ";
						  if(value.queryType === "LAST_DAY"){
							  rptPeriod = "Last day";
						  }
						  else if(value.queryType === "LAST_WEEK"){
							  rptPeriod = "Last week";
						  }
						  else if(value.queryType === "LAST_MONTH"){
							  rptPeriod = "Last month";
						  }
						  else if(value.queryType === "DATE_RANGE"){
							  rptPeriod = "Date range";
							  fromDate = value.startDateStr;
							  toDate = value.endDateStr;
						  }
						  $("<td></td>").text(rptPeriod).appendTo(trdiv);
						  $("<td></td>").text(fromDate).appendTo(trdiv);
						  $("<td></td>").text(toDate).appendTo(trdiv);
						  $("<td></td>").text(value.createdby).appendTo(trdiv);

						  var sscol = $("<td></td>");
						  //var divinput = $("<input type='checkbox' data-toggle='toggle' data-onstyle='success' data-size='mini' data-offstyle='danger' data-on='<i class=\"fa fa-angle-double-up\"></i>' data-off='<li class=\"fa fa-angle-double-down\"></i>'>");
						  var divrun = $('<span id="" class=\"btn btn-success fa fa-play\" />');
						  divrun.attr("onclick", "showReportByReportID('reportcontainertbody', " + value.report_id + ");" );
						  divrun.appendTo(sscol);
						  sscol.append(" ");
						  if(edata === "true"){
							  var divedit = $('<span id="rpteditbtn" class=\"btn btn-success fa fa-edit\" />');
							  divedit.attr("data-reportid",value.report_id);
							  divedit.appendTo(sscol);
							  sscol.append(" ");
							  var divdelete = $('<span id="rptdeletebtn" class=\"btn btn-danger fa fa-trash-o\" />');
							  divdelete.attr("data-reportid",value.report_id);
							  divdelete.appendTo(sscol);
						  }
						  
						  sscol.appendTo(trdiv);
						  
						  trdiv.appendTo($('#rptlisttbody'));
					});

					$("#loader").attr('class', 'loader collapse');
				}
			});

		}
	});
	
	
	//ChangeUrl('Business Service View',$(location).attr('origin')+'/ReportViewer.jsp?p=reportlist');
}

function ShowReportJobList(){
	$('#rptdiv').attr('class', 'collapse');
	$('#rptlistdiv').attr('class', 'collapse');
	$('#edit_rptlistdiv').attr('class', 'collapse');
	//$('#createRptJobBtn').attr('class', '');
	//$('#form_message_div').attr('class', 'collapse');
	//$('#new_rptjobdiv').attr('class', 'collapse');
	$('#rpt_report_job_div').attr('class', '');
	$('#rptjoblistdiv').attr('class', '');
	$("#contentheader .panel-heading").text('Reporting > Report Jobs');
	if(!$("#edit_rpt_report_job_div").hasClass("collapse")){
		$("#edit_rpt_report_job_div").attr("class", "collapse");
	}

	if($('#createRptJobBtn').hasClass('fa-minus')){
		$('#new_rptjobdiv').attr("class","well collapse");
	    $('#createRptJobBtn').removeClass('fa-minus').addClass('fa-plus');
	}
	$('#rpt_job_name').val("");
	$('#subject_div_input').val("");
	$('#rpt_job_addresslist').val("");
	$('#message_div_input').val("");
	$('#rptjoblisttbody').empty();
	$("#loader").attr('class', 'loader');

	$.ajax({
		cache: false,
		url:'/Report?p=isEditReportAuthorized',
		success:function(edata) {
			$.ajax({
				cache: false,
				url:'/ReportJob?p=getReportJobList',
				success:function(data) {
					var jData = JSON.parse(data);
					if(jData.length == 0){
						var trdiv = $("<tr></tr>");
						$('<td colspan="6"></td>').text('No report jobs found!').appendTo(trdiv);
						trdiv.appendTo($('#rptjoblisttbody'));
					} else {

						$.each(jData, function(key,value) {
							var trdiv = $("<tr></tr>").attr("data-reportjobid",value.report_job_id);
							$("<td><span title=\"" + value.report_name + "\">" + Truncate(value.report_job_name) + "</span></td>").appendTo(trdiv);
							var recurrent = "No";
							if(value.recurrent === 1)
								recurrent = "Yes";
							var sendmail = "No";
							if(value.sendmail === 1)
								sendmail = "Yes";
							var enabled = "No";
							if(value.isenabled === 1)
								enabled = "Yes";
							$("<td></td>").text(recurrent).appendTo(trdiv);
							$("<td></td>").text(sendmail).appendTo(trdiv);
							$("<td></td>").text(enabled).appendTo(trdiv);
							$("<td></td>").text(value.createdby).appendTo(trdiv);

							var sscol = $("<td></td>");
							//var divinput = $("<input type='checkbox' data-toggle='toggle' data-onstyle='success' data-size='mini' data-offstyle='danger' data-on='<i class=\"fa fa-angle-double-up\"></i>' data-off='<li class=\"fa fa-angle-double-down\"></i>'>");
							
							if(edata === "true"){
								var divedit = $('<span id=\"rptjobeditbtn\" class=\"btn btn-success fa fa-edit\" onclick=\"UpdateReportJobForm(' + value.report_job_id + ');\" />');
								divedit.attr("data-reportjobid",value.report_job_id);
								divedit.appendTo(sscol);
								sscol.append(" ");
								var divdelete = $('<span id="rptjobdeletebtn" class=\"btn btn-danger fa fa-trash-o\" />');
								divdelete.attr("data-reportjobid",value.report_job_id);
								divdelete.appendTo(sscol);
							}
			
							sscol.appendTo(trdiv);
							
							trdiv.appendTo($('#rptjoblisttbody'));
						});
					
					}

					$("#loader").attr('class', 'loader collapse');
				}
			});
		}
	});

	//ChangeUrl('Business Service View',$(location).attr('origin')+'/ReportViewer.jsp?p=reportjobs');
}

function ShowCreatedReportJobList(){
	$("#loader").attr('class', 'loader');
	
	$('#rptjoblisttbody').empty();

	$.ajax({
		cache: false,
		url:'/ReportJob?p=getReportJobList',
		success:function(data) {
			var jData = JSON.parse(data);
			if(jData.length == 0){
				var trdiv = $("<tr></tr>");
				$('<td colspan="6"></td>').text('No report jobs found!').appendTo(trdiv);
				trdiv.appendTo($('#rptjoblisttbody'));
			} else {
				
				$.each(jData, function(key,value) {
					var trdiv = $("<tr></tr>").attr("data-reportjobid",value.report_job_id);
					$("<td><span title=\"" + value.report_name + "\">" + Truncate(value.report_job_name) + "</span></td>").appendTo(trdiv);
					var recurrent = "No";
					if(value.recurrent === 1)
						recurrent = "Yes";
					var sendmail = "No";
					if(value.sendmail === 1)
						sendmail = "Yes";
					var enabled = "No";
					if(value.isenabled === 1)
						enabled = "Yes";
					$("<td></td>").text(recurrent).appendTo(trdiv);
					$("<td></td>").text(sendmail).appendTo(trdiv);
					$("<td></td>").text(enabled).appendTo(trdiv);
					$("<td></td>").text(value.createdby).appendTo(trdiv);
	
					var sscol = $("<td></td>");
					//var divinput = $("<input type='checkbox' data-toggle='toggle' data-onstyle='success' data-size='mini' data-offstyle='danger' data-on='<i class=\"fa fa-angle-double-up\"></i>' data-off='<li class=\"fa fa-angle-double-down\"></i>'>");
					var divedit = $('<span id=\"rptjobeditbtn\" class=\"btn btn-success fa fa-edit\" onclick=\"UpdateReportJobForm(' + value.report_job_id + ');\" />');
					divedit.attr("data-reportjobid",value.report_job_id);
					divedit.appendTo(sscol);
					sscol.append(" ");
					var divdelete = $('<span id="rptjobdeletebtn" class=\"btn btn-danger fa fa-trash-o\" />');
					divdelete.attr("data-reportjobid",value.report_job_id);
					divdelete.appendTo(sscol);
	
					sscol.appendTo(trdiv);
					
					trdiv.appendTo($('#rptjoblisttbody'));
				});
			
			}

			$("#loader").attr('class', 'loader collapse');
		}
	});
}

function ShowCron(){
	$('#cronselector').empty();
	$(document).ready(function() {
	    $('#cronselector').cron({
	        //initial: "0 0 1 1 * ?",
	        onChange: function() {
	            //$('#example1-val').text($(this).cron("value"));
	        }
	    });
	});
}

var selectedReports = [];
function CreateNewReportJobForm(){
	$('#rptdiv').attr('class', 'collapse');
	//$('#rptjoblistdiv').attr('class', 'collapse');
	$('#rptlistdiv').attr('class', 'collapse');
	$('#form_message_div').attr('class', 'collapse');
	$('#new_rptjobdiv').attr('class', 'well');
	$('#new_rptjobdiv').attr('data-hide', '0');
	$('#select_report_list_div #select_report_list #rpt_list option').remove();
	$("#subject_div_input").val("");
	$("#rpt_job_name").val("");
	$("#subject_div_input").val("");
	$("#rpt_job_addresslist").val("");
	$("#message_div_input").val("");
	$('#addresslist_div').attr('class', 'form-group collapse');
	$('#subject_div').attr('class', 'form-group collapse');
	$('#message_div').attr('class', 'form-group collapse');
	ShowCron();
	
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/Report?p=getCreatedReportList',
		success:function(data) {
			var jData = JSON.parse(data);
			$.each(jData, function(key,value) {
				$("<option></option>").text(value.report_name).val(value.report_id).attr("title", value.report_name).appendTo($("#rpt_list"));			
			});
			
			$('#rpt_list').multiselect('destroy');
			$('#rpt_list').multiSelect({
				selectableHeader: "<div class='custom-header'>Available Reports</div>",
			    selectionHeader: "<div class='custom-header'>Selected Reports</div>",
			});
			
			$("#loader").attr('class', 'loader collapse');
		}
	});
	
	// update selected report list
	$('#rpt_list').change(function(){
		selectedReports=[];
		selectedReports = $(this).val().slice();
	});

	//$('#rptjob_runat').datetimepicker();
	
	$('#rpt_job_recurrent').remove();
	var recurrent = $('<span id="rpt_job_recurrent" type="checkbox" class="btn btn-success fa fa-check-square-o" />');//onclick="RptJobRecurrentClick();"
	recurrent.appendTo($('#recurrent'));
	$('#rpt_job_recurrent').val('true');
	
	$('#rpt_job_isenabled').remove();
	var enableinput = $('<span id="rpt_job_isenabled" type="checkbox" class="btn btn-danger fa fa-square-o" onclick="RptJobEnabledClick();" />');
	enableinput.appendTo($('#isenableddiv'));
	$('#rpt_job_isenabled').val('false');
	
	$('#rpt_job_sendmail').remove();
	var sendmail = $('<span id="rpt_job_sendmail" type="checkbox" class="btn btn-danger fa fa-square-o" onclick="RptJobSendmailClick();" />');
	sendmail.appendTo($('#sendmaildiv'));
	$('#rpt_job_sendmail').val('false');
	
	$('#rptjob_submit').attr('onclick', 'SaveReportJob(0);');

}

function UpdateReportJobForm(report_job_id){
	selectedReports = [];
	
	$('#rptdiv').attr('class', 'collapse');
	$('#rptlistdiv').attr('class', 'collapse');
	$('#form_message_div').attr('class', 'collapse');
	$("#rpt_report_job_div").attr('class','collapse');
	$('#edit_rpt_report_job_div').attr('class', '');
	
	$('#edit_select_report_list_div #edit_select_report_list #edit_rpt_list option').remove();
	$("#loader").attr('class', 'loader');

	$.ajax({
		cache: false,
		url:'/ReportJob?p=getReportJob&report_job_id=' + report_job_id,
		success:function(data) {
			//console.log(data);
			console.log("reportjob: " + '/ReportJob?p=getReportJob&report_job_id=' + report_job_id);
			var jData = JSON.parse(data);
			$.each(jData.report_list, function(key, value){
				selectedReports.push(value.report_id);
			});
			
			console.log(selectedReports);
			// report job name
			//$('#rpt_job_name').val(jData.report_job_name);
			$('#edit_rpt_job_name').val(jData.report_job_name);
			console.log("Job name:" + $('#edit_rpt_job_name').val());
			
			// recurrent
			var recurrent = "true";
			if(jData.recurrent === 1){
				recurrent = "false";
			}
			//$('#rpt_job_recurrent').val(recurrent);
			console.log("Recurrent:"+recurrent)
			$('#edit_rpt_job_recurrent').val(recurrent);
			//$('#edit_rptjob_runat').datetimepicker();
			//RptJobRecurrentClick();
			EditRptJobRecurrentClick();
			
			// cron schedule
			$('#edit_cronselector').empty();
			$('#edit_cronselector').cron({
		        initial: jData.cron,
		    });
			
			// build report list
			$.ajax({
				cache: false,
				url:'/Report?p=getCreatedReportList',
				success:function(report_data) {
					var jrData = JSON.parse(report_data);
					$.each(jrData, function(key,value) {
						$("<option></option>").text(value.report_name).val(value.report_id).attr("title", value.report_name).appendTo($("#edit_rpt_list"));
					});

					$('#edit_rpt_list').multiselect('destroy');
					$('#edit_rpt_list').multiSelect({
						selectableHeader: "<div class='custom-header'>Available Reports</div>",
					    selectionHeader: "<div class='custom-header'>Selected Reports</div>",
					});
					
					/*$('#rpt_list').multiselect('destroy');
					$('#rpt_list').multiSelect({
						selectableHeader: "<div class='custom-header'>Available Reports</div>",
					    selectionHeader: "<div class='custom-header'>Selected Reports</div>",
					});*/
					$('#edit_rpt_list').multiSelect("select",selectedReports.map(function(e){
						return e.toString();
					}));
					
					$("#loader").attr('class', 'loader collapse');
				}
			});
			
			// enable
			console.log("isenabled: " + jData.isenabled);
			var isenabled = "true";
			if(jData.isenabled === 1)
				isenabled = "false";
			$('#edit_rpt_job_isenabled').val(isenabled);
			EditRptJobEnabledClick();
			
			// sendmail
			var sendmail = "true";
			if(jData.sendmail === 1)
				sendmail = "false";
			$('#edit_rpt_job_sendmail').val(sendmail);
			EditRptJobSendmailClick();
			
			// addresslist
			$('#edit_rpt_job_addresslist').val(jData.addresslist);
			$('#edit_subject_div_input').val(jData.subject);
			$('#edit_message_div_input').val(jData.msgbody);
			
			$("#loader").attr('class', 'loader collapse');
		}
	});
	
	// update selected report list
	$('#edit_rpt_list').change(function(){
		selectedReports=[];
		selectedReports = $(this).val().slice();
	});
	
	$('#edit_recurrent').empty();
	var recurrent = $('<span id="edit_rpt_job_recurrent" type="checkbox" class="btn btn-success fa fa-check-square-o" />');//RptJobRecurrentClick();
	recurrent.appendTo($('#edit_recurrent'));
	$('#edit_rpt_job_recurrent').val('true');
	
	$('#edit_isenableddiv').empty();
	var enableinput = $('<span id="edit_rpt_job_isenabled" type="checkbox" class="btn btn-danger fa fa-square-o" onclick="EditRptJobEnabledClick();" />');
	enableinput.appendTo($('#edit_isenableddiv'));
	$('#edit_rpt_job_isenabled').val('false');
	
	$('#edit_sendmaildiv').empty();
	var sendmail = $('<span id="edit_rpt_job_sendmail" type="checkbox" class="btn btn-danger fa fa-square-o" onclick="EditRptJobSendmailClick();" />');
	sendmail.appendTo($('#edit_sendmaildiv'));
	$('#edit_rpt_job_sendmail').val('false');
	
	$('#edit_rptjob_submit').attr('onclick', 'EditSaveReportJob(' + report_job_id + ');');

}

function RptJobRecurrentClick(){
	if($('#rpt_job_recurrent').val() === "false"){
		$('#rpt_job_schedule_div').attr('class', 'form-group');
		$('#rpt_job_date_div').attr('class', 'form-group collapse');
		$('#rpt_job_recurrent').val('true');
		$('#rpt_job_recurrent').attr('class', 'btn btn-success fa fa-check-square-o');
	} else {
		$('#rpt_job_schedule_div').attr('class', 'form-group collapse');
		$('#rpt_job_date_div').attr('class', 'form-group');
		$('#rpt_job_recurrent').val('false');
		$('#rpt_job_recurrent').attr('class', 'btn btn-danger fa fa-square-o');
	}
}

function EditRptJobRecurrentClick(){
	if($('#edit_rpt_job_recurrent').val() === "false"){
		$('#edit_rpt_job_schedule_div').attr('class', 'form-group');
		$('#edit_rpt_job_date_div').attr('class', 'form-group collapse');
		$('#edit_rpt_job_recurrent').val('true');
		$('#edit_rpt_job_recurrent').attr('class', 'btn btn-success fa fa-check-square-o');
	} else {
		$('#edit_rpt_job_schedule_div').attr('class', 'form-group collapse');
		$('#edit_rpt_job_date_div').attr('class', 'form-group');
		$('#edit_rpt_job_recurrent').val('false');
		$('#edit_rpt_job_recurrent').attr('class', 'btn btn-danger fa fa-square-o');
	}
}

function RptJobEnabledClick(){
	if($('#rpt_job_isenabled').val() === "false"){
		$('#rpt_job_isenabled').val('true');
		$('#rpt_job_isenabled').attr('class', 'btn btn-success fa fa-check-square-o');
	} else {
		$('#rpt_job_isenabled').val('false');
		$('#rpt_job_isenabled').attr('class', 'btn btn-danger fa fa-square-o');
	}
}
function EditRptJobEnabledClick(){
	if($('#edit_rpt_job_isenabled').val() === "false"){
		$('#edit_rpt_job_isenabled').val('true');
		$('#edit_rpt_job_isenabled').attr('class', 'btn btn-success fa fa-check-square-o');
	} else {
		$('#edit_rpt_job_isenabled').val('false');
		$('#edit_rpt_job_isenabled').attr('class', 'btn btn-danger fa fa-square-o');
	}
}
function RptJobSendmailClick(){
	console.log('sendmail click: ' + $('#rpt_job_sendmail').val());
	if($('#rpt_job_sendmail').val() === "false"){
		$('#addresslist_div').attr('class', 'form-group');
		$('#subject_div').attr('class', 'form-group');
		$('#message_div').attr('class', 'form-group');
		
		$('#rpt_job_sendmail').val('true');
		$('#rpt_job_sendmail').attr('class', 'btn btn-success fa fa-check-square-o');
	} else {
		$('#addresslist_div').attr('class', 'form-group collapse');
		$('#subject_div').attr('class', 'form-group collapse');
		$('#message_div').attr('class', 'form-group collapse');
		
		$('#rpt_job_sendmail').val('false');
		$('#rpt_job_sendmail').attr('class', 'btn btn-danger fa fa-square-o');
	}
}
function EditRptJobSendmailClick(){
	console.log('edit sendmail click: ' + $('#edit_rpt_job_sendmail').val());
	if($('#edit_rpt_job_sendmail').val() === "false"){
		$('#edit_addresslist_div').attr('class', 'form-group');
		$('#edit_subject_div').attr('class', 'form-group');
		$('#edit_message_div').attr('class', 'form-group');
		
		$('#edit_rpt_job_sendmail').val('true');
		$('#edit_rpt_job_sendmail').attr('class', 'btn btn-success fa fa-check-square-o');
	} else {
		$('#edit_addresslist_div').attr('class', 'form-group collapse');
		$('#edit_subject_div').attr('class', 'form-group collapse');
		$('#edit_message_div').attr('class', 'form-group collapse');
		
		$('#edit_rpt_job_sendmail').val('false');
		$('#edit_rpt_job_sendmail').attr('class', 'btn btn-danger fa fa-square-o');
	}
}

function SaveReportJob(report_job_id){
	var sendmail = 0;
	if($('#rpt_job_sendmail').val() === "true")
		sendmail = 1;
	var recurr = 0;
	if($('#rpt_job_recurrent').val() === "true")
		recurr = 1;
	var enabled = 0;
	if($('#rpt_job_isenabled').val() === "true")
		enabled = 1;
	var addresslist = "";
	if($('#rpt_job_addresslist').val() != undefined)
		addresslist = $('#rpt_job_addresslist').val();
	var subject = "";
	if($('#subject_div_input').val() != undefined)
		subject = $('#subject_div_input').val();
	var message = "";
	if($('#message_div_input').val() != undefined)
		message = $('#message_div_input').val();
	var cron = "";
	if($('#cronselector').cron("value") != undefined)
		cron = $('#cronselector').cron("value");
	var url = '/ReportJob?p=saveReportJob&report_job_id=' + report_job_id + '&report_job_name=' + $('#rpt_job_name').val();
	url += '&sendmail=' + sendmail + '&addresslist=' + addresslist + '&subject=' + subject +'&message=' + message +'&cron=' + cron + '&recurrent=' + recurr;
	url += '&isenabled=' + enabled + '&reportList=' + selectedReports;

	console.log(url);
	$.ajax({
		cache: false,
		url: url,
		success:function(data) {
			var jData = JSON.parse(data);
			console.log(jData.message);
			if(jData.state != undefined){
				if(jData.state == "SUCCESS"){
					$("#saveModal").attr("data-form_name","addreportjob");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
				}
				else{
					$("#saveModal").attr("data-form_name","addreportjob");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
				}
			}
		}
	});
}

function EditReportSave(report_id){
	
	var edit_crt_qtype = $('#edit_crt_queryType').val();
	var edit_crt_startingDate=Date.parse($('#edit_crt_rptFromDate').val()) / 1000;
	var edit_crt_endingDate=Date.parse($('#edit_crt_rptToDate').val()) / 1000;
	
	if(isNaN(edit_crt_startingDate))
		edit_crt_startingDate = 0;
	if(isNaN(edit_crt_endingDate))
		edit_crt_endingDate = 0;
	
	console.log(edit_crt_startingDate + ' ' + edit_crt_endingDate);
	var uuu = '/Report?p=updateReport&sid=' + $('#saverpteditbtn').attr("data-sid") + '&queryType=' + edit_crt_qtype + '&startingDate=' + edit_crt_startingDate + '&endingDate=' + edit_crt_endingDate + '&getOutageDetails=1&name=' + $('#edit_rpt_name').val();
	console.log(uuu);
	$.ajax({
		cache: false,
		url:'/Report?p=updateReport&sid=' + $('#saverpteditbtn').attr("data-sid") + '&queryType=' + edit_crt_qtype + '&startingDate=' + edit_crt_startingDate + '&endingDate=' + edit_crt_endingDate + '&getOutageDetails=1&name=' + $('#edit_rpt_name').val(),
		success:function(data) {
			var jData = JSON.parse(data);
			console.log("state:"+jData.state);
			if(jData.state != undefined){	
				//$('#edit_rpt_report_job_div #edit_form_message_div').delay(1000).css("display","block").slideUp({ opacity: "show" }, "slow");
				//ShowReportList();
				if(jData.state == "SUCCESS"){
					$("#saveModal").attr("data-form_name","editreport");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
					console.log(jData.message);
				}
				else{
					$("#saveModal").attr("data-form_name","editreport");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
				}
			}
		}
	});
}

function EditSaveReportJob(report_job_id){
	var sendmail = 0;
	if($('#edit_rpt_job_sendmail').val() === "true")
		sendmail = 1;
	var recurr = 0;
	if($('#edit_rpt_job_recurrent').val() === "true")
		recurr = 1;
	var enabled = 0;
	if($('#edit_rpt_job_isenabled').val() === "true")
		enabled = 1;
	var addresslist = "";
	if($('#edit_rpt_job_addresslist').val() != undefined)
		addresslist = $('#edit_rpt_job_addresslist').val();
	var subject = "";
	if($('#edit_subject_div_input').val() != undefined)
		subject = $('#edit_subject_div_input').val();
	var message = "";
	if($('#edit_message_div_input').val() != undefined)
		message = $('#edit_message_div_input').val();
	var cron = "";
	if($('#edit_cronselector').cron("value") != undefined)
		cron = $('#edit_cronselector').cron("value");
	var url = '/ReportJob?p=saveReportJob&report_job_id=' + report_job_id + '&report_job_name=' + $('#edit_rpt_job_name').val();
	url += '&sendmail=' + sendmail + '&addresslist=' + addresslist + '&subject=' + subject +'&message=' + message + '&cron=' + cron + '&recurrent=' + recurr;
	url += '&isenabled=' + enabled + '&reportList=' + selectedReports;

	console.log(url);
	$.ajax({
		cache: false,
		url: url,
		success:function(data) {
			var jData = JSON.parse(data);
			if(jData.state != undefined){
				if(jData.state == "SUCCESS"){
					$("#saveModal").attr("data-form_name","editreportjob");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
				}
				else{
					$("#saveModal").attr("data-form_name","editreportjob");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
				}
				//$('#edit_rpt_report_job_div #edit_form_message_div').delay(1000).css("display","block").slideUp({ opacity: "show" }, "slow");
			}
			
			
		}
	});
}

