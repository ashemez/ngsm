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

var filtereventname = "";
var filtereventimpact = "";
var filterdepartment = "";
var filtercreatedby = "";
var filterciid = "";
var filteraffectednode = "";

//Event Catalog cehckBox values
var removeEventIdList = [];

$(document).ready(function() { 
	
	if(!$("#op_menu #li_eventcatalog").hasClass("faimagecolor")){
		$("#opmenu #opmenua").trigger("click");
		$("#op_menu #li_eventcatalog #event_catalog").trigger("click");
		$("#op_menu #li_eventcatalog #event_catalog").trigger("focus");
	}
	
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
    $("#submenu-3 #kpi_li1" ).on('click', 'a', function (){
    	window.location.href ="/kpi.jsp?p=ds&msbval="+minisideval;
    });
    $("#submenu-3 #kpi_li2" ).on('click', 'a', function (){
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
    	window.location.href ="/maintenance.jsp?statusFilter="+statusFilter+"&msbval="+minisideval;
    });
    
	//Event Catalog Definition Page Load
	$('#opmenu').on('click','#event_catalog',function(){
		filterSid=0;
	    ChangeUrl('Business Service View',$(location).attr('origin')+'/eventcatalog.jsp?statusFilter='+statusFilter+'&msbval='+minisideval); 
		eventCatalogListFunction();     
	});
    
    $("#checkedAllEvent").change(function(){
        if(this.checked){
          removeEventIdList = [];
          $(".checkSingleEvent").each(function(){
            this.checked=true;
            removeEventIdList.push($(this).parent().parent().parent().attr("data-ecid"));
          })
          $("#event_delete_icon").css("display","inline-table");
          $("#ec_form h2").css("width","80%");
        }else{
          $(".checkSingleEvent").each(function(){
            this.checked=false;
          })
          removeEventIdList = [];
          $("#event_delete_icon").css("display","none");
          $("#ec_form h2").css("width","90%");
        }
        console.log("removeEventIdList:"+removeEventIdList);
    });

    $("#existingeventcatalog").on('click','#eventselectlabel',function(){
    	var ecidval = $(this).parent().parent().attr("data-ecid");
    	if ($(this).find('input[type="checkbox"]').is(":checked")){
    		removeEventIdList = [];
    		var isAllChecked = 0;
    		$(".checkSingleEvent").each(function(){
    			if(!this.checked){
    				isAllChecked = 1;
    			}
    			else{
    				removeEventIdList.push($(this).parent().parent().parent().attr("data-ecid"));
    			}
    		})              
    		if(isAllChecked == 0){ 
    			$("#checkedAllEvent").prop("checked", true);
    		}     
    	}
        else{
        	$("#checkedAllEvent").prop("checked", false);
        	if(removeEventIdList.length > 0){
        	    var index = removeEventIdList.indexOf(ecidval);
        	    if (index > -1) {
        	    	removeEventIdList.splice(index, 1);
        	    }
        	}
        }
    	if(removeEventIdList.length > 1){
    		$("#event_delete_icon").css("display","inline-table");
            $("#ec_form h2").css("width","80%");
    	}
    	else{
    		$("#event_delete_icon").css("display","none");
            $("#ec_form h2").css("width","90%");
    	}
    	console.log("removeEventIdList:"+removeEventIdList);
    });
    
    //Click Event Catalog Filter Event (Modal Show)
    $("#event_filter_icon .fa-filter").click(function(ev){
    	console.log("Event filter Icon Clicked!!!");
    	ecFilterDefFunc();
    });

    $('#eventcatalog_form_def_open_close').on('click', function () {
    	if ($('#eventcatalog_form').is(":visible")){
    		$('#eventcatalog_form').hide();
    		$('#eventcatalog_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    	}
    	else{
    		$("#event_ciid option").remove();
			$("#ec_form #event_name").val("");
			$("#ec_form #affected_node").val("");
			$("#ec_form #event_ciid").val("");
			$("#ec_form #event_department").val("");
			$("#ec_form #event_description").val("");
			$("#ec_form #event_impact").val("0");
			$("#ec_form #event_impact.selectpicker").trigger('change');
			console.log($("#ec_form #event_impact").val());
			$("#loader").attr('class', 'loader');
			$.ajax({
				cache: false,
				url:'/Report?p=getCIIDList',
				success:function(data) {
					$("#loader").attr('class', 'collapse');
					
					// service list data
					var jData = JSON.parse(data);
					$.each(jData, function(key,value) {
						  var option = $("<option value='" + value.source_ci_id + "' >" + value.source_ci_id + "</option>");
						  option.appendTo($("#event_ciid"));
					});
					console.log("Option is added");
					$("#event_ciid").val("").trigger("chosen:updated");
					
					// server list search
					$('#event_ciid').val(jData.source_ci_id).trigger("chosen:updated"); // Select the value before .chosen();
					var $chosen = $('#event_ciid').chosen({
						max_selected_options: 1,
					});
					$chosen.change(function () {
					  var $this = $(this);
					  var chosen = $this.data('chosen');
					  var search = chosen.search_container.find('input[type="text"]');
					  
					  if($('#event_ciid').val().length > 0){
						$('#saveeventbtn').attr('data-ecid', $('#event_ciid').val());
						//console.log(JSON.parse($('#maintenance_srv_list').val()));
					  }
					  console.log("Chosen Active Field:"+chosen.active_field);
					  if (chosen.active_field) {
						search.focus();
					  }
					});

				}
			});
    		
    		$('#eventcatalog_form').show();
    		$('#eventcatalog_form_def_open_close').removeClass('fa-plus').addClass('fa-minus');
    		$('#ec_form #saveeventbtn').attr('onclick', 'eventCatalogDefFunc()');
    	}
    	
    });
    
  // upload events catalog hidden modal
    $('#uploadModal').on('hidden.bs.modal', function () {
    	$("#loader").attr('class', 'loader');
		$.ajax({
			cache: false,
	    	url:'/Eventcatalog?p=getEventFilterList&filterSid='+filterSid+'&event_name='+filtereventname+'&affected_node='+filteraffectednode+'&department='+filterdepartment+'&source_ci_id='+filterciid+'&event_impact='+filtereventimpact+'&createdby='+filtercreatedby+'&page=0',
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
    });
    
    //Create event catalog hidden modal
    $('#saveModal').on('hidden.bs.modal', function () {
    	console.log("Event Catalog Hidden model!!!!!!!!!!!");
    	if($("#saveModal").attr("data-form_name") == "addevent"){
            var attr = $("#ec_form #existingeventcatalog tbody tr").attr('data-ecid');
            if (typeof attr !== typeof undefined && attr !== false) {
            	$("#ec_form #existingeventcatalog tbody tr[data-ecid]").remove();
            }
			$("#loader").attr('class', 'loader');
			$.ajax({
				cache: false,
				url:'/Eventcatalog?p=getEventFilterList&filterSid='+filterSid+'&event_name='+filtereventname+'&affected_node='+filteraffectednode+'&department='+filterdepartment+'&source_ci_id='+filterciid+'&event_impact='+filtereventimpact+'&createdby='+filtercreatedby+'&page=0',
				success:function(data) {
					$("#loader").attr('class', 'loader collapse');
					console.log("EventcatalogList data:"+data);
					showEventcatalogList(data);
					tablePageNumber=1;
					EventcatalogPaginate();
				}
			});
			$('#eventcatalog_form').hide();
    		$('#eventcatalog_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    	}
    	if($("#saveModal").attr("data-form_name") == "editevent"){
            var attr = $("#ec_form #existingeventcatalog tbody tr").attr('data-ecid');
            if (typeof attr !== typeof undefined && attr !== false) {
            	$("#ec_form #existingeventcatalog tbody tr[data-ecid]").remove();
            }
			$("#loader").attr('class', 'loader');
			$.ajax({
				cache: false,
				url:'/Eventcatalog?p=getEventFilterList&filterSid='+filterSid+'&event_name='+filtereventname+'&affected_node='+filteraffectednode+'&department='+filterdepartment+'&source_ci_id='+filterciid+'&event_impact='+filtereventimpact+'&createdby='+filtercreatedby+'&page=0',
				success:function(data) {
					$("#loader").attr('class', 'loader collapse');
					showEventcatalogList(data);
					tablePageNumber=1;
					EventcatalogPaginate();
				}
			});
			$("#edit_ec_form").attr('class', 'collapse');
    		$('#eventcatalog_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    		$("#eventcatalog_form").hide();
    		$("#ec_form").attr('class', '');
    	}
    });
    
    //Delete Event Catalog in existing Form
    $("#existingeventcatalog").on('click','#eventdeletebtn',function(){
    	console.log("Delete Event Catalog in existing Form: "+$(this).attr("data-ecid"));
    	$("#loader").attr('class', 'loader');
    	deleteEventModalShow($(this).attr("data-ecid"));
    });
    
    //Delete List Event Catalog in existing Form
    $("#event_delete_icon .fa-trash-o").click(function(ev){
    //$("#ecdeleteallbtn").click(function(){
    	console.log("Deleted List "+removeEventIdList);
    	deleteEventListModalShow();
    });
    
    //Edited Event Form Set Values
    $("#existingeventcatalog").on('click','#eventeditbtn',function(){
    	console.log("Edit Event Catalog in existing Form: "+$(this).attr("data-ecid"));
    	var ecid = $(this).attr("data-ecid");
    	
    	$("#loader").attr('class', 'loader');
    	$.ajax({
    		cache: false,
    		url:'/Report?p=getCIIDList',
    		success:function(data) {
    			$("#loader").attr('class', 'loader collapse');
    			
    			// service list data
    			var jData1 = JSON.parse(data);
    			
    			$('#edit_event_ciid option').remove();
    			$.each(jData1, function(key,value) {
    				  var option = $("<option value='" + value.source_ci_id + "' >" + value.source_ci_id + "</option>");
    				  option.appendTo($("#edit_event_ciid"));
    			})
    			
    	    	$("#loader").attr('class', 'loader');
    			$.ajax({
    				cache: false,
    				url:'/Eventcatalog?p=getEventInfo&ecid=' + parseInt(ecid),
    				success:function(data){
    					$("#loader").attr('class', 'loader collapse');
    					jsondata = JSON.parse(data);
    					console.log("ecid:"+jsondata.event_id);
    					console.log("ename:"+jsondata.event_name);
    					console.log("affectednode:"+jsondata.affected_node);
    					console.log("eimpact:"+jsondata.event_impact);
    					console.log("edesc:"+jsondata.description);
    					console.log("edep:"+jsondata.department);
    					console.log("ecreatedby:"+jsondata.createdby);
    					console.log("eci:"+jsondata.source_ci_id);
    					
    					$("#edit_ec_form legend span").text(jsondata.event_name);
    					$("#edit_ec_form #edit_event_name").val(jsondata.event_name);
    					$("#edit_ec_form #edit_affected_node").val(jsondata.affected_node);
    					$("#edit_ec_form #edit_event_impact").val(jsondata.event_impact);
    					$("#edit_ec_form #edit_event_impact.selectpicker").trigger('change');
    					$("#edit_ec_form #edit_event_description").val(jsondata.description);
    					$("#edit_ec_form #edit_event_department").val(jsondata.department);
						
						$('#edit_ec_form #edit_saveeventbtn').attr('data-ecid', jsondata.event_id);
						// server list search
						$('#edit_ec_form #edit_event_ciid').val(jsondata.source_ci_id).trigger("chosen:updated"); // Select the value before .chosen();
						
						var $chosen = $('#edit_ec_form #edit_event_ciid').chosen({
							max_selected_options: 1,
						});
						$chosen.change(function () {
						  var $this = $(this);
						  var chosen = $this.data('chosen');
						  var search = chosen.search_container.find('input[type="text"]');
						  
						  if (chosen.active_field) {
						    search.focus();
						    $('#edit_ec_form #edit_saveeventbtn').attr('data-ciid', $('#edit_event_ciid').val());
						  }
						});
						
    					$("#edit_ec_form").attr('data-ecid', ecid);
    					$('#edit_ec_form #edit_saveeventbtn').attr('onclick', 'EditEventSave(' + ecid + ');'); 	
    		        	
    				}
    			});
    			$("#ec_form").attr('class', 'collapse');
    			$("#edit_ec_form").attr('class', ''); 	
    		}
    	}); 
    });
    
    //Close Edit Event in Event Catalog Form
    $("#edit_ec_form").on('click','#close_edit_event',function(){
    	$("#edit_ec_form").attr('class', 'collapse');
    	$("#ec_form").attr('class', '');
    });
    
    //Event Catalog Filter Submit Event
    $("#ecFilterBtn").click(function(){
    	console.log("Filter click Ok!!!");
    	var eventname = $("#ecFilter_form #ecEventName").val();
    	var affectednode = $("#ecFilter_form #ecAffectedNode").val();
    	var eventimpact = $("#ecFilter_form select[name='ecEventImpact']").val();
    	var department = $("#ecFilter_form #ecDepartment").val();
    	var createdby = $("#ecFilter_form #ecCreatedBy").val();
    	var sourceciid = $("#ecFilter_form #ecCIId").val();
    	
    	var url = '/Eventcatalog?p=getEventFilterList&event_name='+eventname+'&affected_node='+affectednode+'&department='+department+'&source_ci_id='+sourceciid+'&event_impact='+eventimpact+'&createdby='+createdby+'&page=0';
    	console.log("URL:"+url);
    	$("#loader").attr('class', 'loader');
    	$.ajax({
    		cache: false,
    		url:url,
    		success:function(data) {
    			$("#loader").attr('class', 'loader collapse');
    			var jsondata = JSON.parse(data);
    			console.log(jsondata);
    	    	filtereventname = eventname;
    	    	filtereventimpact = eventimpact;
    	    	filterdepartment = department;
    	    	filtercreatedby = createdby;
    	    	filterciid = sourceciid;
    	    	filteraffectednode = affectednode;
    	    	
    	    	if ($("#checkedAllEvent").is(":checked")){
    				$("#checkedAllEvent").prop("checked", false);
    				$("#event_delete_icon").css("display","none");
    		        $("#ec_form h2").css("width","90%")
    			}
    	    	
    	    	var attr = $("#ec_form #existingeventcatalog tbody tr").attr('data-ecid');
    			if (typeof attr !== typeof undefined && attr !== false) {
    				$("#ec_form #existingeventcatalog tbody tr[data-ecid]").remove();
    			}
    			console.log(jsondata.length);
    			if(jsondata.length != undefined && jsondata.length > 0){
    				showEventcatalogList(data);
        			tablePageNumber=1;
    				EventcatalogPaginate();
    				$("#eventcatpagidiv").css("display","block");
    			}
    			else{
    				$("#eventcatpagidiv").css("display","none");
    				var trdiv = $("<tr></tr>").attr("data-ecid","-1");
    				$("<td></td>").text("No Event Catalog Data Found!").appendTo(trdiv);
    				trdiv.appendTo($("#ec_form #existingeventcatalog tbody"));
    			}
    	    	
    		}
    	});
    	
    	$("#ecFilterModal").modal("hide");
    	$("#event_filter_icon i").css("color","red");
    });
    
    //Event Catalog Filter Clear Event
    $("#ecFilterClearBtn").click(function(){
    	console.log("Filter click Ok!!!");
    	$("#ecFilter_form #ecEventName").val("");
    	$("#ecFilter_form #ecAffectedNode").val("");
    	$("#ecFilter_form #ecDepartment").val("");
    	$("#ecFilter_form #ecCreatedBy").val("");
    	$("#ecFilter_form #ecCIId").val("");
    	
    	$("#ecFilter_form #ecEventImpact").val("0");
		$("#ecFilter_form #ecEventImpact.selectpicker").trigger('change');
    	
    	filtereventname = "";
    	filtereventimpact = "";
    	filterdepartment = "";
    	filtercreatedby = "";
    	filterciid = "";
    	filteraffectednode = "";
    	var url = '/Eventcatalog?p=getEventFilterList&event_name=&affected_node=&department=&source_ci_id=&event_impact=&createdby=&page=0';
    	console.log("URL:"+url);
    	$("#loader").attr('class', 'loader');
    	$.ajax({
    		cache: false,
    		url:url,
    		success:function(data) {
    			$("#loader").attr('class', 'loader collapse');
    			var jsondata = JSON.parse(data);
    			console.log(jsondata);
    			
    			if ($("#checkedAllEvent").is(":checked")){
    				$("#checkedAllEvent").prop("checked", false);
    				$("#event_delete_icon").css("display","none");
    		        $("#ec_form h2").css("width","90%")
    			}
    			
    			var attr = $("#ec_form #existingeventcatalog tbody tr").attr('data-ecid');
    			if (typeof attr !== typeof undefined && attr !== false) {
    				$("#ec_form #existingeventcatalog tbody tr[data-ecid]").remove();
    			}
    			showEventcatalogList(data);
    			tablePageNumber=1;
				EventcatalogPaginate();
    			
    			$("#ecFilterModal").modal("hide");
    	    	$("#event_filter_icon i").css("color","#333");
    		}
    	});
    	
    });

});


function eventCatalogListFunction(){
	if(filterSid > 0){
		$("#contentheader .panel-heading").text('Operations Management > Event Catalog > '+filterSid);
	}
	else{
		$("#contentheader .panel-heading").text('Operations Management > Event Catalog');
	}
	
	var attr = $("#ec_form #existingeventcatalog tbody tr").attr('data-ecid');
    if (typeof attr !== typeof undefined && attr !== false) {
    	$("#ec_form #existingeventcatalog tbody tr[data-ecid]").remove();
    }
    $("#ec_form").attr('class', '');
    $("#loader").attr('class', 'loader');
    $.ajax({
		cache: false,
		url:'/Eventcatalog?p=getEventFilterList&filterSid='+filterSid+'&event_name=&affected_node=&department=&source_ci_id=&event_impact=0&createdby=0&page=0',
		success:function(data) {
			$("#loader").attr('class', 'loader collapse');
			showEventcatalogList(data);
			EventcatalogPaginate();
		}
	});
	$("#eventcatalog_form").hide();
    if($('#eventcatalog_form_def_open_close').hasClass('fa-minus')){
    	$('#eventcatalog_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    }    
}

function eventCatalogDefFunc(){		
	var ecname = $("#ec_form input[name='event_name']").val();
	var affectednode = $("#ec_form input[name='affected_node']").val();
	var ecciid = $("#ec_form select[name='event_ciid']").val();
	console.log(ecciid);
	var ecimpact = $("#ec_form select[name='event_impact']").val();
	var ecdept = $("#ec_form input[name='event_department']").val();
	var ecdesc = $("#ec_form textarea[name='event_description']").val();
	
	console.log('/Eventcatalog?p=createNewEvent&event_name=' + ecname + '&affected_node=' + affectednode + '&source_ci_id=' + ecciid + '&event_impact=' + ecimpact + '&department=' + ecdept + '&description=' + ecdesc);
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/Eventcatalog?p=createNewEvent&event_name=' + ecname + '&affected_node=' + affectednode + '&source_ci_id=' + ecciid + '&event_impact=' + ecimpact + '&department=' + ecdept + '&description=' + ecdesc,
		success:function(data) {
			$("#loader").attr('class', 'loader collapse');
			var jData = JSON.parse(data);
			console.log("eventDefFunc: "+jData);
			if(jData.state != undefined){
				if(jData.state == "SUCCESS"){
					$("#saveModal").attr("data-form_name","addevent");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
				}
				else{
					$("#saveModal").attr("data-form_name","addevent");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
				}
			}
		}
	});	
}

//Open Delete Modal Show
function deleteEventModalShow(ecid){
	console.log("ECID:"+ecid);
	$.ajax({
		cache: false,
		url:'/Eventcatalog?p=getEventInfo&ecid=' + parseInt(ecid),
		success:function(data) {
			var jsondata = JSON.parse(data);
			$("#loader").attr('class', 'loader collapse');
			$("#deleteModel h5 b").text(jsondata.event_name);
			$("#deleteModel").attr("data-ecid",parseInt(ecid));
		}
	});
	$("#deleteModel").modal("show");
}

//Open Delete List Modal Show
function deleteEventListModalShow(){
	$("#deleteModel h5 b").text("Selected Events");
	$("#deleteModel").attr("data-eclist","1");
	$("#deleteModel").modal("show");
}

//Edit Event Save
function EditEventSave(ecid){
	var edit_event_name = $('#edit_ec_form #edit_event_name').val();
	var edit_affected_node = $('#edit_ec_form #edit_affected_node').val();
	var edit_event_ci = $('#edit_ec_form #edit_event_ciid').val();
	var edit_event_impact = $("#edit_ec_form select[name='edit_event_impact']").val();
	var edit_event_dept = $('#edit_ec_form #edit_event_department').val();
	var edit_event_desc = $('#edit_ec_form #edit_event_description').val();
	
	console.log(ecid+' '+edit_event_name+' '+edit_event_ci+' '+edit_event_impact+' '+edit_event_dept+' '+edit_event_desc);
	var uuu = '/Eventcatalog?p=updateEvent&ecid=' + ecid + '&event_name=' + edit_event_name + '&affected_node=' + edit_affected_node + '&department=' + edit_event_dept + '&description=' + edit_event_desc + '&event_impact=' + edit_event_impact + '&source_ci_id=' + edit_event_ci;
	console.log(uuu);
	$.ajax({
		cache: false,
		url:'/Eventcatalog?p=updateEvent&ecid=' + ecid + '&event_name=' + edit_event_name + '&affected_node=' + edit_affected_node + '&department=' + edit_event_dept + '&description=' + edit_event_desc + '&event_impact=' + edit_event_impact + '&source_ci_id=' + edit_event_ci,
		success:function(data) {
			var jData = JSON.parse(data);
			console.log("state:"+jData.state);
			if(jData.state != undefined){	
				if(jData.state == "SUCCESS"){
					$("#saveModal").attr("data-form_name","editevent");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
					console.log(jData.message);
				}
				else{
					$("#saveModal").attr("data-form_name","editevent");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
					console.log(jData.message);
				}
			}
		}
	});
}

function Truncate(str, truncLength){
	if(str != undefined){
		var sstr = str.toString();
		if(sstr.length > truncLength)
			return $.trim(sstr.toString()).substring(0, truncLength) + "...";
	}
	return str;
}

function OnPageClickEventCat(event, page) {
	console.log("Page number:"+page);
	tablePageNumber = page-1;
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/Eventcatalog?p=getEventFilterList&filterSid='+filterSid+'&event_name='+filtereventname+'&affected_node='+filteraffectednode+'&department='+filterdepartment+'&source_ci_id='+filterciid+'&event_impact='+filtereventimpact+'&createdby='+filtercreatedby+'&page='+tablePageNumber,
		success:function(data) {
			$("#loader").attr('class', 'loader collapse');
			var attr = $("#ec_form #existingeventcatalog tbody tr").attr('data-ecid');
			if (typeof attr !== typeof undefined && attr !== false) {
				$("#ec_form #existingeventcatalog tbody tr[data-ecid]").remove();
			}
			//console.log("EventcatalogList data:"+data);
			if ($("#checkedAllEvent").is(":checked")){
				$("#checkedAllEvent").prop("checked", false);
				$("#event_delete_icon").css("display","none");
		        $("#ec_form h2").css("width","90%");
			}
			showEventcatalogList(data);
		}
	});
}

function EventcatalogPaginate(){
	var url = '/Eventcatalog?p=getEventCatalogCount&filterSid='+filterSid+'&event_name='+filtereventname+'&affected_node='+filteraffectednode+'&department='+filterdepartment+'&source_ci_id='+filterciid+'&event_impact='+filtereventimpact+'&createdby='+filtercreatedby;
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:url,
		success:function(data) {
			$("#loader").attr('class', 'loader collapse');
			var pageCount = Math.ceil(data / 25);
			console.log("PAGE COUNT:"+pageCount+" total services:"+data);
			var visiblePages = 4;
			if(pageCount == 0){
				pageCount=1;
				visiblePages=1;
			}
			if(pageCount < 4){
				visiblePages = pageCount;
			}
			if($('#pagination_eventcatalog').data("twbs-pagination"))
				  $('#pagination_eventcatalog').twbsPagination('destroy');
			console.log("Table Page Number:"+tablePageNumber);
			if(pageCount < tablePageNumber){
				tablePageNumber=1;
			}
			$('#pagination_eventcatalog').twbsPagination({
				totalPages: pageCount,
				visiblePages: visiblePages,
				startPage: tablePageNumber,
				next: 'Next',
				prev: 'Prev',
				onPageClick: OnPageClickEventCat
			});
			$("#eventcatpagidiv").css("display","block");
		}
	});
}

function ecFilterModalShow(){
	$("#ecFilterModal").modal("show");
}

function ecFilterDefFunc(){
	console.log("filterciid:"+filterciid);
	console.log("filterSID:"+filterSid);
	$("#ecCIId option").remove();
	$("#ecCreatedBy option").remove();
	
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/Report?p=getCIIDList',
		success:function(data) {
			$("#loader").attr('class', 'collapse');
			// service list data
			var jData = JSON.parse(data);
			
			if(filterSid == 0){
				$.each(jData, function(key,value) {
					  var option = $("<option value='" + value.source_ci_id + "' >" + value.source_ci_id + "</option>");
					  option.appendTo($("#ecCIId"));
				});
				console.log("Option is added");
				$("#ecCIId").val("").trigger("chosen:updated");
				
				// server list search
				$('#ecCIId').val("").trigger("chosen:updated"); // Select the value before .chosen();
				
				if(filterciid != ""){
					$('#ecCIId').val(filterciid).trigger("chosen:updated");
				}
				
				var $chosen = $('#ecCIId').chosen({
					max_selected_options: 1,
					width:'100%'
				});
				$chosen.change(function () {
				  var $this = $(this);
				  var chosen = $this.data('chosen');
				  var search = chosen.search_container.find('input[type="text"]');
				  
				  if($('#ecCIId').val().length > 0){
					//$('#saveeventbtn').attr('data-ecid', $('#event_ciid').val());
					//console.log(JSON.parse($('#maintenance_srv_list').val()));
				  }
				  console.log("Chosen Active Field:"+chosen.active_field);
				  if (chosen.active_field) {
					search.focus();
				  }
				});
			}
			else{
				var sourceciid = "";
				$.each(jData, function(key,value) {
					  if(value.sid ==  filterSid){
						  sourceciid = value.source_ci_id;
					  }
				});
				console.log(sourceciid);
				$('#ecCIId').val(sourceciid).trigger("chosen:updated");
				var $chosen = $('#ecCIId').chosen({
					max_selected_options: 1,
					width:'100%'
				});
			}
			
			
			$("#loader").attr('class', 'loader');
			$.ajax({
				cache: false,
				url:'/Users?p=getAllUsers',
				success:function(data) {
					$("#loader").attr('class', 'loader collapse');
					// user list data
					var juserData = JSON.parse(data);
					$.each(juserData, function(key,value) {
						  var option = $("<option value='" + value.userid + "' >" + value.username + "</option>");
						  option.appendTo($("#ecCreatedBy"));
					});
					console.log("Option is added");
					$("#ecCreatedBy").val("").trigger("chosen:updated");
					
					if(filtercreatedby != ""){
						$('#ecCreatedBy').val(filtercreatedby).trigger("chosen:updated");
					}
					
					var $chosenuser = $('#ecCreatedBy').chosen({
						max_selected_options: 1,
						width:'100%'
					});
					$chosenuser.change(function () {
					  var $this = $(this);
					  var chosen = $this.data('chosen');
					  var search = chosen.search_container.find('input[type="text"]');
					  
					  if($('#ecCreatedBy').val().length > 0){
					  }
					  console.log("User Chosen Active Field:"+chosen.active_field);
					  if (chosen.active_field) {
						search.focus();
					  }
					});
				}
				
			});
			
		}
	});
	ecFilterModalShow();
}
