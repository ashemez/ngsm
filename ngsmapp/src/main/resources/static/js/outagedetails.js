var outagedetailsjson = "";
$(document).ready(function() {
	console.log("Odpage:"+odpage);
	$("#loader").attr('class', 'loader');
	var url = '/Report?p=getReportServiceBaseOutageDetails&sid=' + sid + "&startingDate=" + startingDate +"&endingDate=" + endingDate +"&getOutageDetails=" + getOutageDetails +"&queryType=" + queryType;
	console.log(url);
	$.ajax({
		cache: false,
		url:url,
		success:function(data) {
			$("#loader").attr('class', 'loader collapse');
			console.log(data);
			$.each(JSON.parse(data), function(key,value) {
				showOutageDetailsHeader(value.startDateStr,value.endDateStr);
				outagedetailsjson = value.Outages;
				ShowOutageDetailsNew(JSON.stringify(value.Outages));
			});
			
		}
	});
});

function showOutageDetailsHeader(startDateStr,endDateStr){
	var innerdiv1 = $("<div></div>").addClass("outagedetailsdate");
	/*var label1 = $("<label></label>")
		.addClass("control-label")
		.text("From:").appendTo(innerdiv1);*/
	$("<span></span>").attr("id","span1").text("Date Range:").attr("style","font-weight:bold").appendTo(innerdiv1);
	$("<label></label>").attr("id","startdatelabel").text(startDateStr).appendTo(innerdiv1);
	/*var label2 = $("<label></label>")
		.addClass("control-label")
		.text("To:").appendTo(innerdiv1);*/
	$("<label></label>").attr("id","label2").text("-").appendTo(innerdiv1);
	$("<label></label>").attr("id","enddatelabel").text(endDateStr).appendTo(innerdiv1);
	
	innerdiv1.appendTo($("#outagedetailsheader"));
}

function ShowOutageDetailsNew(data){
	$('#outagedetails').empty();
	var jsondata= JSON.parse(data);
	//console.log(jsondata);
	//console.log(outagedetailsjson);   
	var firstindex = (odpage-1) * 50;
	if(jsondata.length < ((odpage-1) * 50)+50){
		var lastindex = jsondata.length;
	}
	else{
		var lastindex = ((odpage-1) * 50)+50;
	}
	for (var i = firstindex; i < lastindex; i++) {
		 var trdiv = $("<tr></tr>");
		  $("<td><span title=\"" + jsondata[i].outageStartStr + "\">" + jsondata[i].outageStartStr + "</span></td>").appendTo(trdiv);
		  $("<td><span title=\"" + jsondata[i].outageEndStr + "\">" + jsondata[i].outageEndStr + "</span></td>").appendTo(trdiv);
		  $("<td><span title=\"" + jsondata[i].service_instance_name + "\">" + Truncate(jsondata[i].service_instance_name) + "</span></td>").appendTo(trdiv);
		  $("<td><span title=\"" + jsondata[i].outageDuration + " (sn)\">" + jsondata[i].outageDuration + " (sn)</span></td>").appendTo(trdiv);
		  $("<td><span title=\"" + jsondata[i].maintenanceDuration + " (sn)\">" + jsondata[i].maintenanceDuration + " (sn)</span></td>").appendTo(trdiv);
		  trdiv.appendTo($('#outagedetails'));
	}
	OutageDetailsPaginate(jsondata.length);
	
	
	/*$.each(JSON.parse(data), function(key,value) {
		  var trdiv = $("<tr></tr>");
		  $("<td><span title=\"" + value.outageStartStr + "\">" + value.outageStartStr + "</span></td>").appendTo(trdiv);
		  $("<td><span title=\"" + value.outageEndStr + "\">" + value.outageEndStr + "</span></td>").appendTo(trdiv);
		  $("<td><span title=\"" + value.service_instance_name + "\">" + Truncate(value.service_instance_name) + "</span></td>").appendTo(trdiv);
		  $("<td><span title=\"" + value.outageDuration + " (sn)\">" + value.outageDuration + " (sn)</span></td>").appendTo(trdiv);
		  $("<td><span title=\"" + value.maintenanceDuration + " (sn)\">" + value.maintenanceDuration + " (sn)</span></td>").appendTo(trdiv);
		  trdiv.appendTo($('#outagedetails'));
	});*/
}

function Truncate(str){
	if(str != undefined){
		var sstr = str.toString();
		if(sstr.length > 40)
			return $.trim(sstr.toString()).substring(0, 40) + "...";
	}
	return str;
}

function OnPageClickEventCat(event, page) {
	console.log("Page number:"+page);
	odpage = page;
	ShowOutageDetailsNew(JSON.stringify(outagedetailsjson));
}

function OutageDetailsPaginate(data){
	var pageCount = Math.ceil(data / 50);
	console.log("PAGE COUNT:"+pageCount+" total outage details:"+data);
	var visiblePages = 4;
	if(pageCount == 0){
		pageCount=1;
		visiblePages=1;
	}
	if(pageCount < 4){
		visiblePages = pageCount;
	}
	if($('#pagination_outagedet').data("twbs-pagination"))
		  $('#pagination_outagedet').twbsPagination('destroy');
	console.log("Table Page Number:"+odpage);
	if(pageCount < odpage){
		odpage=1;
	}
	$('#pagination_outagedet').twbsPagination({
		totalPages: pageCount,
		visiblePages: visiblePages,
		startPage: odpage,
		next: 'Next',
		prev: 'Prev',
		onPageClick: OnPageClickEventCat
	});
	$("#outagedetpagidiv").css("display","block");
}