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

Number.prototype.padLeft = function(base,chr){
	   var  len = (String(base || 10).length - String(this).length)+1;
	   return len > 0? new Array(len).join(chr || '0')+this : this;
}

function isotodatetime(d){
     dformat2 = [ d.getFullYear(),(d.getMonth()+1).padLeft(),
                 d.getDate().padLeft()
                 ].join('/')+
                 ' ' +
               [ d.getHours().padLeft(),
                 d.getMinutes().padLeft()].join(':');
     console.log("test date format2:"+dformat2);
     return dformat2;
}

$(document).ready(function() {
	minisideval = '0';
    console.log("Minisideval:"+minisideval);
    if(minisideval == '1'){
    	$('#sidebar').addClass('minisidebar');
    	$('#page-content-wrapper').addClass('minisidebar');
    	$('#wrapper').addClass('minisidebar');
    }
	$('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust().draw();
    });
	$('[data-toggle="tooltip"]').tooltip({ trigger:'hover'});
	$("#sidebar-nav .collapse").on("hide.bs.collapse", function() {                   
		$(this).prev().find("#pull").eq(0).removeClass("fa-angle-right").addClass("fa-angle-down");
		
	});
	$('#sidebar-nav .collapse').on("show.bs.collapse", function() {
		$(this).prev().find("#pull").eq(0).removeClass("fa-angle-down").addClass("fa-angle-right"); 
		$(this).parent().siblings().find('.collapse.in').collapse('hide');
	});

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('minisidebar');
		$('#page-content-wrapper').toggleClass('minisidebar');
		$('#wrapper').toggleClass('minisidebar');
		if($('#sidebar').hasClass('minisidebar')){
			//$('#searchboxes').addClass('collapse');
			//$('#servicesboxes').removeClass('collapse');
			minisideval=1;
			console.log("1");
		}
		else{
			//$('#searchboxes').removeClass('collapse');
			//$('#servicesboxes').addClass('collapse');
			console.log("0");
			minisideval=0;
		}
    });
	$('.side-nav li ul li a').focus(function(){
		$(this).parent().siblings().find(".faimagecolor").removeClass("faimagecolor");
		$(this).parent().parent().parent().siblings().find(".faimagecolor").removeClass("faimagecolor");
		$(this).parent().parent().parent().siblings().find(".focusParentBorder").removeClass("focusParentBorder");
		$(this).find(".fa").addClass("faimagecolor");
		$(this).parent().parent().siblings('a').addClass('focusParentBorder');
	});
	
	//KPI Overall Dashboard Click
	$("#submenu-1 #dash2").click(function(){
		if(!$("#submenu-1 #dash2").hasClass("faimagecolor")){
        	$("#submenu-1 #dash2").trigger("focus");
        };
	});
	
	//Save Confirmation Model Hide
	$("#saveModal #savemodalbtn").click(function(){
    	$("#saveModal").modal("hide");
    });
    
    //DataSource-KPI-User-Role-Group-Report-Operations Delete and Delete-Confirmation Model Close
    $("#deleteModel #modaldeletebtn").click(function(){
    	$("#loader").attr('class', 'loader');
    	if($("#deleteModel").attr("data-dsid")){
    		var dsid = $("#deleteModel").attr("data-dsid");
        	dsDeleteFunc(dsid);
        	$("#deleteModel").modal("hide");
        	//console.log("Deleted!!!!");
    		$('#existingdatasource tr[data-sid=\''+dsid+'\']').fadeOut(300, function() { 
    			//$(this).remove(); 
    		});     		
    	}
    	if($("#deleteModel").attr("data-kpiid")){
    		var kpiid = $("#deleteModel").attr("data-kpiid");
        	kpiDeleteFunc(kpiid);
        	$("#deleteModel").modal("hide");
        	//console.log("Deleted!!!!");
    		$('#existingkpi tr[data-kpiid=\''+kpiid+'\']').fadeOut(300, function() { 
    			//$(this).remove(); 
    		});
    	}
    	if($("#deleteModel").attr("data-userid")){
    		var userid = $("#deleteModel").attr("data-userid");
    		console.log("Userid:"+userid);
        	userDeleteFunc(userid);
        	$("#deleteModel").modal("hide");
        	//console.log("Deleted!!!!");
    		$('#existingusers tr[data-userid=\''+userid+'\']').fadeOut(300, function() { 
    			//$(this).remove(); 
    		});
    	}
    	if($("#deleteModel").attr("data-roleid")){
    		var roleid = $("#deleteModel").attr("data-roleid");
    		console.log("Roleid:"+roleid);
        	roleDeleteFunc(roleid);
        	$("#deleteModel").modal("hide");
        	//console.log("Deleted!!!!");
    		$('#existingroles tr[data-roleid=\''+roleid+'\']').fadeOut(300, function() { 
    			//$(this).remove(); 
    		});
    	}
    	if($("#deleteModel").attr("data-groupid")){
    		var groupid = $("#deleteModel").attr("data-groupid");
    		//console.log("Groupid:"+groupid);
        	groupDeleteFunc(groupid);
        	$("#deleteModel").modal("hide");
        	//console.log("Deleted!!!!");
    		$('#existinggroups tr[data-groupid=\''+groupid+'\']').fadeOut(300, function() { 
    			//$(this).remove(); 
    		});
    	}
    	if($("#deleteModel").attr("data-reportid")){
    		var reportid = $("#deleteModel").attr("data-reportid");
        	reportDeleteFunc(reportid);
        	$("#deleteModel").modal("hide");
        	console.log("Deleted!!!!");
    		$('#rptlisttbl tr[data-reportid=\''+reportid+'\']').fadeOut(300, function() { 
    			//$(this).remove(); 
    		});     		
    	}
    	if($("#deleteModel").attr("data-reportjobid")){
    		var reportjobid = $("#deleteModel").attr("data-reportjobid");
        	reportJobDeleteFunc(reportjobid);
        	$("#deleteModel").modal("hide");
        	console.log("Deleted!!!!");
    		$('#rptjoblisttbl tr[data-reportjobid=\''+reportjobid+'\']').fadeOut(300, function() { 
    			//$(this).remove(); 
    		});     		
    	}
    	if($("#deleteModel").attr("data-mid")){
    		var mid = $("#deleteModel").attr("data-mid");
    		$("#loader").attr('class', 'loader');
    		$.ajax({
    			cache: false,
    			url:"/Maintenance?p=deleteMaintenance",
    			data:{mid:mid},
    			success:function(data) {
    				$("#loader").attr('class', 'loader collapse');
    				if(isNaN(filtermainstartdate) || filtermainstartdate == "")
    	        		filtermainstartdate = 0;
    	        	if(isNaN(filtermainenddate) || filtermainenddate == "")
    	        		filtermainenddate = 0;
    				$("#loader").attr('class', 'loader');
        			$.ajax({
        				cache: false,
        				url : '/Maintenance?p=getMaintenanceFilterList&title='+filtermaintitle+'&sid='+filtermainsid+'&startDate='+filtermainstartdate+'&endDate='+filtermainenddate+'&rfcid='+filtermainrfcid+'&createdby='+filtermaincreatedby+'&page=0',
        				success:function(data) {
        					$("#loader").attr('class', 'loader collapse');
        					var attr = $("#m_form #existingmaintenance tbody tr").attr('data-mid');
        	                if (typeof attr !== typeof undefined && attr !== false) {
        	                	$("#m_form #existingmaintenance tbody tr[data-mid]").remove();
        	                }
        	                showMaintenanceList(data);
        					tablePageNumber=1;
        					MaintenancePaginate();
        					$("#deleteModel").modal("hide");
        				}
        			});
    			}
    		});    		
    	}
    	if($("#deleteModel").attr("data-mlist")){
    		$("#loader").attr('class', 'loader');
    		$.ajax({
    			cache: false,
    			url:"/Maintenance?p=deleteMaintenanceList&midlist="+removeMainIdList,
    			success:function(data) {
    				$("#loader").attr('class', 'loader collapse');
					if(isNaN(filtermainstartdate) || filtermainstartdate == "")
    	        		filtermainstartdate = 0;
    	        	if(isNaN(filtermainenddate) || filtermainenddate == "")
    	        		filtermainenddate = 0;
    				$("#loader").attr('class', 'loader');
        			$.ajax({
        				cache: false,
        				url : '/Maintenance?p=getMaintenanceFilterList&title='+filtermaintitle+'&sid='+filtermainsid+'&startDate='+filtermainstartdate+'&endDate='+filtermainenddate+'&rfcid='+filtermainrfcid+'&createdby='+filtermaincreatedby+'&page=0',
        				success:function(data) {
        					$("#loader").attr('class', 'loader collapse');
        					var attr = $("#m_form #existingmaintenance tbody tr").attr('data-mid');
        	                if (typeof attr !== typeof undefined && attr !== false) {
        	                	$("#m_form #existingmaintenance tbody tr[data-mid]").remove();
        	                }
        					showMaintenanceList(data);
        					tablePageNumber=1;
        					MaintenancePaginate();
        					$("#deleteModel").modal("hide");
        				}
        			});
    			}
    		});	
    	}
    	if($("#deleteModel").attr("data-ecid")){
    		var ecid = $("#deleteModel").attr("data-ecid");
    		$("#loader").attr('class', 'loader');
    		$.ajax({
    			cache: false,
    			url:"/Eventcatalog?p=deleteEvent",
    			data:{ecid:parseInt(ecid)},
    			success:function(data) {
    				$("#loader").attr('class', 'loader collapse');
    				$("#loader").attr('class', 'loader');
    				var url = '/Eventcatalog?p=getEventFilterList&filterSid='+filterSid+'&event_name='+filtereventname+'&affected_node='+filteraffectednode+'&department='+filterdepartment+'&source_ci_id='+filterciid+'&event_impact='+filtereventimpact+'&createdby='+filtercreatedby+'&page=0';
        			$.ajax({
        				cache: false,
        				//url:'/Eventcatalog?p=getEventFilterList&event_name=&affected_node=&department=&source_ci_id=&event_impact=0&createdby=0&page=0',
        		    	url:url,
        				success:function(data) {
        					$("#loader").attr('class', 'loader collapse');
        					var attr = $("#ec_form #existingeventcatalog tbody tr").attr('data-ecid');
        	                if (typeof attr !== typeof undefined && attr !== false) {
        	                	$("#ec_form #existingeventcatalog tbody tr[data-ecid]").remove();
        	                }
        					showEventcatalogList(data);
        					tablePageNumber=1;
        					EventcatalogPaginate();
        					$("#deleteModel").modal("hide");
        				}
        			});
    			}
    		});	
    	}
    	if($("#deleteModel").attr("data-eclist")){
    		$("#loader").attr('class', 'loader');
    		$.ajax({
    			cache: false,
    			url:"/Eventcatalog?p=deleteEventList&ecidlist="+removeEventIdList,
    			success:function(data) {
    				$("#loader").attr('class', 'loader collapse');
    				var url = '/Eventcatalog?p=getEventFilterList&filterSid='+filterSid+'&event_name='+filtereventname+'&affected_node='+filteraffectednode+'&department='+filterdepartment+'&source_ci_id='+filterciid+'&event_impact='+filtereventimpact+'&createdby='+filtercreatedby+'&page=0';
    				$("#loader").attr('class', 'loader');
        			$.ajax({
        				cache: false,
        		    	url:url,
        				success:function(data) {
        					$("#loader").attr('class', 'loader collapse');
        					var attr = $("#ec_form #existingeventcatalog tbody tr").attr('data-ecid');
        	                if (typeof attr !== typeof undefined && attr !== false) {
        	                	$("#ec_form #existingeventcatalog tbody tr[data-ecid]").remove();
        	                }
        					showEventcatalogList(data);
        					tablePageNumber=1;
        					EventcatalogPaginate();
        					$("#deleteModel").modal("hide");
        				}
        			});
    			}
    		});	
    	}
    });
        
});

function compareArrays(arr1, arr2) {
    return $(arr1).not(arr2).length == 0 && $(arr2).not(arr1).length == 0
};

function openRSB(){
	$('#page-content-wrapper .container-fluid').attr('class','container-fluid col-md-9');
	$('#rightsidebar').attr('class', 'col-md-3');
	console.log("Height:" + $("div#contentpage").height());
	$('#rightsidebar').height($("div#contentpage").height());
}

function openWRSB(){
	$('#page-content-wrapper .container-fluid').attr('class','container-fluid col-md-6');
	$('#rightsidebar').attr('class', 'col-md-6');
	console.log("Height:" + $("div#contentpage").height());
	$('#rightsidebar').height($("div#contentpage").height());
}

function closeRSB(){
	$('#page-content-wrapper .container-fluid').attr('class','container-fluid');
	$('#rightsidebar').attr('class', 'collapse');
}

function clearKPIRSB(){
	$("#rightsidebar").empty();
}

function ChangeUrl(title, url) {
    if (typeof (history.pushState) != "undefined") {
        var obj = { Title: title, Url: url };
        history.pushState(obj, obj.Title, obj.Url);
    } else {
        alert("Browser does not support HTML5.");
    }
}