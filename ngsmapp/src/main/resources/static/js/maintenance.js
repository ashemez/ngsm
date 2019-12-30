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

var filtermaintitle = "";
var filtermainstartdate = "";
var filtermainenddate = "";
var filtermainrfcid = "";
var filtermaincreatedby = "";
var filtermainsid = "";

//Maintenance checkBox values
var removeMainIdList = [];

$(document).ready(function() {
	if(!$("#op_menu #li_maintenance").hasClass("faimagecolor")){
		$("#opmenu #opmenua").trigger("click");
		$("#op_menu #li_maintenance #maintenance_mode").trigger("click");
		$("#op_menu #li_maintenance #maintenance_mode").trigger("focus");
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
    $("#op_menu #li_eventcatalog").on('click', 'a', function (){
    	window.location.href ="/eventcatalog.jsp?statusFilter="+statusFilter+"&msbval="+minisideval;
    });
    
    $("#checkedAllMain").change(function(){
        if(this.checked){
          removeMainIdList = [];
          $(".checkSingleMain").each(function(){
            this.checked=true;
            removeMainIdList.push($(this).parent().parent().parent().attr("data-mid"));
          })
          $("#maintenance_delete_icon").css("display","inline-table");
          $("#m_form h2").css("width","80%");
        }else{
          $(".checkSingleMain").each(function(){
            this.checked=false;
          })
          removeMainIdList = [];
          $("#maintenance_delete_icon").css("display","none");
          $("#m_form h2").css("width","90%");
        }
        console.log("removeEventIdList:"+removeMainIdList);
    });

    $("#existingmaintenance").on('click','#mainselectlabel',function(){
    	var midval = $(this).parent().parent().attr("data-mid");
    	if ($(this).find('input[type="checkbox"]').is(":checked")){
    		removeMainIdList = [];
    		var isAllChecked = 0;
    		$(".checkSingleMain").each(function(){
    			if(!this.checked){
    				isAllChecked = 1;
    			}
    			else{
    				removeMainIdList.push($(this).parent().parent().parent().attr("data-mid"));
    			}
    		})              
    		if(isAllChecked == 0){ 
    			$("#checkedAllMain").prop("checked", true);
    		}     
    	}
        else{
        	$("#checkedAllMain").prop("checked", false);
        	if(removeMainIdList.length > 0){
        	    var index = removeMainIdList.indexOf(midval);
        	    if (index > -1) {
        	    	removeMainIdList.splice(index, 1);
        	    }
        	}
        }
    	if(removeMainIdList.length > 1){
    		$("#maintenance_delete_icon").css("display","inline-table");
            $("#m_form h2").css("width","80%");
    	}
    	else{
    		$("#maintenance_delete_icon").css("display","none");
            $("#m_form h2").css("width","90%");
    	}
    	console.log("removeMainIdList:"+removeMainIdList);
    });
    
    //Click Maintenance Filter (Modal Show)
    $("#maintenance_filter_icon .fa-filter").click(function(ev){
    	console.log("Maint filter Icon Clicked!!!");
    	mFilterDefFunc();
    	//mFilterModalShow();
    });
    

    $('#maintenance_form_def_open_close').on('click', function () {
    	if ($('#maintenance_form').is(":visible")){
    		$('#maintenance_form').hide();
    		$('#maintenance_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    	}
    	else{
			$("#maintenance_srv_list option").remove();
			$("#maintenance_title").val("");
			$("#maintenance_rfc").val("");
			$("#maintenance_query").val("");
			
			$('#crt_maintenanceStartDate').val("");
			$('#crt_maintenanceEndDate').val("");
			$('#crt_maintenanceStartDate').datetimepicker("destroy");
			$('#crt_maintenanceEndDate').datetimepicker("destroy");
			
			$("#loader").attr('class', 'loader');
			$.ajax({
				cache: false,
				url:'/Report?p=getAllServiceList',
				success:function(data) {
					$("#loader").attr('class', '');
					
					// service list data
					var jData = JSON.parse(data);
					$.each(jData, function(key,value) {
						  var option = $("<option value='" + value.service_instance_id + "' >" + value.service_instance_name + "</option>");
						  option.appendTo($("#maintenance_srv_list"));
					});
					console.log("Option is added");
					$("#maintenance_srv_list").val("").trigger("chosen:updated");
					
					$('#crt_maintenanceStartDate').datetimepicker();
					$('#crt_maintenanceEndDate').datetimepicker();
					
					// server list search
					$('#maintenance_srv_list').val(jData.service_instance_id).trigger("chosen:updated"); // Select the value before .chosen();
					var $chosen = $('#maintenance_srv_list').chosen({
						//max_selected_options: 1,
					});
					$chosen.change(function () {
					  var $this = $(this);
					  var chosen = $this.data('chosen');
					  var search = chosen.search_container.find('input[type="text"]');
					  
					  if($('#maintenance_srv_list').val().length > 0){
						$('#savemaintbtn').attr('data-mid', $('#maintenance_srv_list').val());
						//console.log(JSON.parse($('#maintenance_srv_list').val()));
					  }
					  console.log("Chosen Active Field:"+chosen.active_field);
					  if (chosen.active_field) {
						search.focus();
					  }
					});

				}
			});
    		$('#maintenance_form').show();
    		$('#maintenance_form_def_open_close').removeClass('fa-plus').addClass('fa-minus');
    		$('#m_form #savemaintbtn').attr('onclick', 'maintenanceDefFunc()');
    	}
    	
    });
    
    //Create maintenance hidden modal
    $('#saveModal').on('hidden.bs.modal', function () {
    	console.log("Maintenance Hidden model!!!!!!!!!!!");
    	if($("#saveModal").attr("data-form_name") == "addmaintenance"){
            var attr = $("#m_form #existingmaintenance tbody tr").attr('data-mid');
            if (typeof attr !== typeof undefined && attr !== false) {
            	$("#m_form #existingmaintenance tbody tr[data-mid]").remove();
            }
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
					showMaintenanceList(data);
					tablePageNumber=1;
    				MaintenancePaginate();
				}
			});
			$('#maintenance_form').hide();
    		$('#maintenance_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    	}
    	if($("#saveModal").attr("data-form_name") == "editmaintenance"){
            var attr = $("#m_form #existingmaintenance tbody tr").attr('data-mid');
            if (typeof attr !== typeof undefined && attr !== false) {
            	$("#m_form #existingmaintenance tbody tr[data-mid]").remove();
            }
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
					showMaintenanceList(data);
					tablePageNumber=1;
    				MaintenancePaginate();
				}
			});
			$("#edit_m_form").attr('class', 'collapse');
    		$('#maintenance_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    		$('#maintenance_form').hide();
    		$("#m_form").attr('class', '');
    	}
    });
    
    //Delete Maintenance in existing Form
    $("#existingmaintenance").on('click','#maindeletebtn',function(){
    	console.log("Delete Maintenance in existing Form: "+$(this).attr("data-mid"));
    	$("#loader").attr('class', 'loader');
    	deleteMaintModalShow($(this).attr("data-mid"));
    });
    
    //Delete Maintenance List in existing Form
    $("#maintenance_delete_icon .fa-trash-o").click(function(ev){
    //$("#madeleteallbtn").click(function(){
    	console.log("Deleted List "+removeMainIdList);
    	deleteMaintListModalShow();
    });
    
    //Edited Maintenance Form Set Values
    $("#existingmaintenance").on('click','#maineditbtn',function(){
    	console.log("Edit Maintenance in existing Form: "+$(this).attr("data-mid"));
    	var mid = $(this).attr("data-mid");

    	$("#edit_m_form #edit_crt_maintenanceStartDate").datetimepicker("reset");
    	$("#edit_m_form #edit_crt_maintenanceEndDate").datetimepicker("reset");
    	$("#edit_m_form #edit_crt_maintenanceStartDate").datetimepicker("destroy");
    	$("#edit_m_form #edit_crt_maintenanceEndDate").datetimepicker("destroy");
    	
    	$("#loader").attr('class', 'loader');
    	$.ajax({
    		cache: false,
    		url:'/Report?p=getAllServiceList',
    		success:function(data) {
    			$("#loader").attr('class', 'loader collapse');
    			
    			// service list data
    			var jData1 = JSON.parse(data);
    			
    			$('#edit_maintenance_srv_list option').remove();
    			$.each(jData1, function(key,value) {
    				  var option = $("<option value='" + value.service_instance_id + "' >" + value.service_instance_name + "</option>");
    				  option.appendTo($("#edit_maintenance_srv_list"));
    			})
    			
    	    	$("#loader").attr('class', 'loader');
    			$.ajax({
    				cache: false,
    				url:'/Maintenance?p=getMaintenance&mid=' + parseInt(mid),
    				success:function(data){
    					console.log(data);
    					$("#loader").attr('class', 'loader collapse');
    					jsondata = JSON.parse(data);
    					console.log("mid:"+jsondata.mid);
    					//console.log("sid:"+jsondata.serviceList);
    					var sidList = [];
    					$.each(jsondata.serviceList, function(key,value) {
    						sidList.push(value.sid);
    						console.log("value.service_instance_id " + value.sid);
	  					});
    					console.log("title:"+jsondata.title);
    					console.log("startDateStr:"+jsondata.startDateStr);
    					console.log("endDateStr:"+jsondata.endDateStr);
    					
    					$("#edit_m_form legend span").text(jsondata.sname);
    					$("#edit_m_form #edit_maintenance_title").val(jsondata.title);
    					$("#edit_m_form #edit_maintenance_rfc").val(jsondata.rfcid);
    					$("#edit_m_form #edit_maintenance_query").val(jsondata.description);
    					
    					$('#edit_m_form #edit_crt_maintenanceStartDate').datetimepicker();
    					$('#edit_m_form #edit_crt_maintenanceEndDate').datetimepicker();
    					$("#edit_m_form #edit_crt_maintenanceStartDate").val(isotodatetime(new Date(jsondata.startDate*1000)));
						$("#edit_m_form #edit_crt_maintenanceEndDate").val(isotodatetime(new Date(jsondata.endDate*1000)));
						$('#edit_m_form #edit_crt_maintenanceStartDate').datetimepicker({dateFormat: "yy-mm-dd HH:ii:ss"});
						$('#edit_m_form #edit_crt_maintenanceEndDate').datetimepicker({dateFormat: "yy-mm-dd HH:ii:ss"});
						
						$('#edit_m_form #edit_savemaintbtn').attr('data-sid', mid);
						// server list search
						$('#edit_m_form #edit_maintenance_srv_list').val(sidList).trigger("chosen:updated"); // Select the value before .chosen();
						
						var $chosen = $('#edit_m_form #edit_maintenance_srv_list').chosen({
							//max_selected_options: 1,
						});
						$chosen.change(function () {
						  var $this = $(this);
						  var chosen = $this.data('chosen');
						  var search = chosen.search_container.find('input[type="text"]');
						  
						  if (chosen.active_field) {
						    search.focus();
						    $('#edit_m_form #edit_savemaintbtn').attr('data-sid', mid);
						  }
						});
						
    					$("#edit_m_form").attr('data-mid', mid);
    					$('#edit_m_form #edit_savemaintbtn').attr('onclick', 'EditMaintenanceSave(' + mid + ');');
    		        	
    				}
    			});
    			$("#m_form").attr('class', 'collapse');
    			$("#edit_m_form").attr('class', ''); 	
    		}
    	}); 
    });
    
    //Close Edit Maintenace in Maintenace Form
    $("#edit_m_form").on('click','#close_edit_maint',function(){
    	$("#edit_m_form").attr('class', 'collapse');
    	$("#m_form").attr('class', '');
    }); 
    
    //Maintenance Filter Submit Event
    $("#mFilterBtn").click(function(){
    	console.log("Main Filter click Ok!!!");
    	var mTitle = $("#mFilter_form #mTitle").val();
    	var mService = $("#mFilter_form select[name='mService']").val();
    	var mStartDate = Date.parse($("#mFilter_form input[name='mStartDate']").val()) / 1000;
    	var mEndDate = Date.parse($("#mFilter_form input[name='mEndDate']").val()) / 1000;
		var mRfcid = $("#mFilter_form #mRfcid").val();
    	var createdby = $("#mFilter_form select[name='mCreatedBy']").val();
    	
    	if(isNaN(mStartDate))
    		mStartDate = 0;
    	if(isNaN(mEndDate))
    		mEndDate = 0;
    	
    	var url = '/Maintenance?p=getMaintenanceFilterList&title='+mTitle+'&sid='+mService+'&startDate='+mStartDate+'&endDate='+mEndDate+'&rfcid='+mRfcid+'&createdby='+createdby+'&page=0';
    	console.log("URL:"+url);
    	$("#loader").attr('class', 'loader');
    	$.ajax({
    		cache: false,
    		url:url,
    		success:function(data) {
    			$("#loader").attr('class', 'loader collapse');
    			var jsondata = JSON.parse(data);
    	    	filtermaintitle = mTitle;
    	    	filtermainsid = mService;
    	    	filtermainstartdate = mStartDate;
    	    	filtermainenddate = mEndDate;
    	    	filtermainrfcid = mRfcid;
    	    	filtermaincreatedby = createdby; 
    	    	console.log("filtermainsid:"+filtermainsid);
    	    	if ($("#checkedAllMain").is(":checked")){
    				$("#checkedAllMain").prop("checked", false);
    				$("#maintenance_delete_icon").css("display","none");
    		        $("#m_form h2").css("width","90%")
    			}
    	    	
    	    	var attr = $("#m_form #existingmaintenance tbody tr").attr('data-mid');
    			if (typeof attr !== typeof undefined && attr !== false) {
    				$("#m_form #existingmaintenance tbody tr[data-mid]").remove();
    			}
    			console.log(jsondata.length);
    			if(jsondata.length != undefined && jsondata.length > 0){
    				showMaintenanceList(data);
        			tablePageNumber=1;
    				MaintenancePaginate();
    				$("#mainpagidiv").css("display","block");
    			}
    			else{
    				$("#mainpagidiv").css("display","none");
    				var trdiv = $("<tr></tr>").attr("data-mid","-1");
    				$("<td></td>").text("No Maintenance Data Found!").appendTo(trdiv);
    				trdiv.appendTo($("#m_form #existingmaintenance tbody"));
    			}
    	    	
    		}
    	});
    	
    	$("#mFilterModal").modal("hide");
    	$("#maintenance_filter_icon i").css("color","red");
    });
    
    //Maintenance Filter Clear Event
    $("#mFilterClearBtn").click(function(){
    	console.log("Filter click Ok!!!");
    	$("#mFilter_form #mTitle").val("");
    	$("#mFilter_form select[name='mService']").val("");
    	$('#mstartDate').val("");
		$('#mstartDate').datetimepicker("destroy");
    	$('#mEndDate').val("");
		$('#mEndDate').datetimepicker("destroy");
		$("#mFilter_form #mRfcid").val("");
    	$("#mFilter_form select[name='mCreatedBy']").val("");
    	
		filtermaintitle = "";
    	filtermainsid = "";
    	filtermainstartdate = "";
    	filtermainenddate = "";
    	filtermainrfcid = "";
    	filtermaincreatedby = "";
    	
    	if(isNaN(filtermainstartdate) || filtermainstartdate == "")
    		filtermainstartdate = 0;
    	if(isNaN(filtermainenddate) || filtermainenddate == "")
    		filtermainenddate = 0;
    	
    	var url = '/Maintenance?p=getMaintenanceFilterList&title='+filtermaintitle+'&sid='+filtermainsid+'&startDate='+filtermainstartdate+'&endDate='+filtermainenddate+'&rfcid='+filtermainrfcid+'&createdby='+filtermaincreatedby+'&page=0';
    	$("#loader").attr('class', 'loader');
    	$.ajax({
    		cache: false,
    		url:url,
    		success:function(data) {
    			$("#loader").attr('class', 'loader collapse');
    			var jsondata = JSON.parse(data);
    			console.log(jsondata);
    			
    			if ($("#checkedAllMain").is(":checked")){
    				$("#checkedAllMain").prop("checked", false);
    				$("#maintenance_delete_icon").css("display","none");
    		        $("#m_form h2").css("width","90%")
    			}
    			
    			var attr = $("#m_form #existingmaintenance tbody tr").attr('data-mid');
    			if (typeof attr !== typeof undefined && attr !== false) {
    				$("#m_form #existingmaintenance tbody tr[data-mid]").remove();
    			}
    			showMaintenanceList(data);
    			tablePageNumber=1;
    			MaintenancePaginate();
    			
    			$("#mFilterModal").modal("hide");
    	    	$("#maintenance_filter_icon i").css("color","#333");
    		}
    	});
    	
    });    
    

});

function maintenanceDefFunc(){			
	var mtitle = $("#maintenance_form input[name='maintenance_title']").val();
	var mservice = $("#maintenance_form select[name='maintenance_srv_list']").val();
	console.log(mservice);
	var mrfcid = $("#maintenance_form input[name='maintenance_rfc']").val();
	var mdesc = $("#maintenance_form textarea[name='maintenance_query']").val();
	var mstart=Date.parse($("#maintenance_form input[name='crt_maintenanceStartDate']").val()) / 1000;
	var mend=Date.parse($("#maintenance_form input[name='crt_maintenanceEndDate']").val()) / 1000;
	
	if(isNaN(mstart))
		mstart = 0;
	if(isNaN(mend))
		mend = 0;
	
	console.log('/Maintenance?p=createMaintenance&title=' + mtitle+ '&sid=' + mservice + '&startDate=' + mstart + '&endDate=' + mend + '&rfcid=' + mrfcid+ '&description=' + mdesc);
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/Maintenance?p=createMaintenance&title=' + mtitle+ '&sid=' + mservice + '&startDate=' + mstart + '&endDate=' + mend + '&rfcid=' + mrfcid+ '&description=' + mdesc,
		success:function(data) {
			$("#loader").attr('class', 'loader collapse');
			var jData = JSON.parse(data);
			console.log("maintenanceDefFunc: "+jData);
			if(jData.state != undefined){
				if(jData.state == "SUCCESS"){
					$("#saveModal").attr("data-form_name","addmaintenance");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
				}
				else{
					$("#saveModal").attr("data-form_name","addmaintenance");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
				}
			}
		}
	});	
}

//Open Delete Modal Show
function deleteMaintModalShow(mid){
	$.ajax({
		cache: false,
		url:'/Maintenance?p=getMaintenance&mid=' + parseInt(mid),
		success:function(data) {
			var jsondata = JSON.parse(data);
			$("#loader").attr('class', 'loader collapse');
			$("#deleteModel h5 b").text(jsondata.title);
			$("#deleteModel").attr("data-mid",mid);
		}
	});
	$("#deleteModel").modal("show");
}

//Open Delete List Modal Show
function deleteMaintListModalShow(){
	$("#deleteModel h5 b").text("Selected Maintenance");
	$("#deleteModel").attr("data-mlist","1");
	$("#deleteModel").modal("show");
}

//Edit Maintenance Save
function EditMaintenanceSave(mid){
	var edit_mnt_title = $('#edit_m_form #edit_maintenance_title').val();
	var edit_mnt_rfc = $('#edit_m_form #edit_maintenance_rfc').val();
	var edit_mnt_desc = $('#edit_m_form #edit_maintenance_query').val();
	var edit_mnt_sid = $('#edit_m_form #edit_maintenance_srv_list').val();
	var edit_mnt_startingDate=Date.parse($('#edit_m_form #edit_crt_maintenanceStartDate').val()) / 1000;
	var edit_mnt_endingDate=Date.parse($('#edit_m_form #edit_crt_maintenanceEndDate').val()) / 1000;
	
	if(isNaN(edit_mnt_startingDate))
		edit_mnt_startingDate = 0;
	if(isNaN(edit_mnt_endingDate))
		edit_mnt_endingDate = 0;
	
	console.log(edit_mnt_sid+' '+edit_mnt_title+' '+edit_mnt_rfc+' '+edit_mnt_desc+' '+edit_mnt_startingDate + ' ' + edit_mnt_endingDate);
	var uuu = '/Maintenance?p=updateMaintenance&mid=' + mid + '&title=' + edit_mnt_title + '&startDate=' + edit_mnt_startingDate + '&endDate=' + edit_mnt_endingDate + '&rfcid=' + edit_mnt_rfc + '&sid=' + edit_mnt_sid +'&description='+ edit_mnt_desc;
	console.log(uuu);
	$.ajax({
		cache: false,
		url:'/Maintenance?p=updateMaintenance&mid=' + mid + '&title=' + edit_mnt_title + '&startDate=' + edit_mnt_startingDate + '&endDate=' + edit_mnt_endingDate + '&rfcid=' + edit_mnt_rfc + '&sid=' + edit_mnt_sid +'&description='+ edit_mnt_desc,
		success:function(data) {
			var jData = JSON.parse(data);
			console.log("state:"+jData.state);
			if(jData.state != undefined){	
				if(jData.state == "SUCCESS"){
					$("#saveModal").attr("data-form_name","editmaintenance");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
					console.log(jData.message);
				}
				else{
					$("#saveModal").attr("data-form_name","editmaintenance");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
					console.log(jData.message);
				}
			}
		}
	});
}

function OnPageClickMainCat(event, page) {
	console.log("Page number:"+page);
	tablePageNumber = page-1;
	var url = '/Maintenance?p=getMaintenanceFilterList&title='+filtermaintitle+'&sid='+filtermainsid+'&startDate='+filtermainstartdate+'&endDate='+filtermainenddate+'&rfcid='+filtermainrfcid+'&createdby='+filtermaincreatedby+'&page='+tablePageNumber;
	console.log(url);
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:url,		
		success:function(data) {
			$("#loader").attr('class', 'loader collapse');
			var attr = $("#m_form #existingmaintenance tbody tr").attr('data-mid');
			if (typeof attr !== typeof undefined && attr !== false) {
				$("#m_form #existingmaintenance tbody tr[data-mid]").remove();
			}
			//console.log("EventcatalogList data:"+data);
			if ($("#checkedAllMain").is(":checked")){
				$("#checkedAllMain").prop("checked", false);
				$("#maintenance_delete_icon").css("display","none");
		        $("#m_form h2").css("width","90%")
			}
			showMaintenanceList(data);
		}
	});
}

function MaintenancePaginate(){
	if(isNaN(filtermainstartdate) || filtermainstartdate == "")
		filtermainstartdate = 0;
	if(isNaN(filtermainenddate) || filtermainenddate == "")
		filtermainenddate = 0;
	var url = '/Maintenance?p=getMaintenanceCount&title='+filtermaintitle+'&sid='+filtermainsid+'&startDate='+filtermainstartdate+'&endDate='+filtermainenddate+'&rfcid='+filtermainrfcid+'&createdby='+filtermaincreatedby;
	console.log(url);
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:url,
		success:function(data) {
			$("#loader").attr('class', 'loader collapse');
			var pageCount = Math.ceil(data / 3);
			console.log("PAGE COUNT:"+pageCount+" total services:"+data);
			var visiblePages = 4;
			if(pageCount == 0){
				pageCount=1;
				visiblePages=1;
			}
			if(pageCount < 4){
				visiblePages = pageCount;
			}
			if($('#pagination_maintenance').data("twbs-pagination"))
				  $('#pagination_maintenance').twbsPagination('destroy');
			console.log("Table Page Number:"+tablePageNumber);
			if(pageCount < tablePageNumber){
				tablePageNumber=1;
			}
			$('#pagination_maintenance').twbsPagination({
				totalPages: pageCount,
				visiblePages: visiblePages,
				startPage: tablePageNumber,
				next: 'Next',
				prev: 'Prev',
				onPageClick: OnPageClickMainCat
			});
			$("#mainpagidiv").css("display","block");
		}
	});
}

function mFilterModalShow(){
	$("#mFilterModal").modal("show");
}

function mFilterDefFunc(){
	$("#mService option").remove();
	$("#mCreatedBy option").remove();
	$('#mStartDate').val("");
	$('#mStartDate').datetimepicker("destroy");	
	$('#mEndDate').val("");
	$('#mEndDate').datetimepicker("destroy");

	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/Report?p=getAllServiceList',
		success:function(data) {
			$("#loader").attr('class', 'loader collapse');
			
			// service list data
			var jData = JSON.parse(data);
			$.each(jData, function(key,value) {
				  var option = $("<option value='" + value.service_instance_id + "' >" + value.service_instance_name + "</option>");
				  option.appendTo($("#mService"));
			});
			$("#mService").val("").trigger("chosen:updated");
			
			$('#mStartDate').datetimepicker();	
			$('#mEndDate').datetimepicker();
			if(filtermainstartdate > 0){
				$("#mStartDate").val(isotodatetime(new Date(filtermainstartdate*1000)));
				$('#mStartDate').datetimepicker({dateFormat: "yy-mm-dd HH:ii:ss"});
			}
			if(filtermainenddate > 0){
				$("#mEndDate").val(isotodatetime(new Date(filtermainenddate*1000)));		
				$('#mEndDate').datetimepicker({dateFormat: "yy-mm-dd HH:ii:ss"});
			}
			
			if(filtermainsid != ""){
				$('#mService').val(filtermainsid).trigger("chosen:updated");
			}
			
			// server list search
			//$('#mService').val(jData.service_instance_id).trigger("chosen:updated"); // Select the value before .chosen();
			var $chosen = $('#mService').chosen({
				width:'100%'
			});
			$chosen.change(function () {
			  var $this = $(this);
			  var chosen = $this.data('chosen');
			  var search = chosen.search_container.find('input[type="text"]');
			  
			  if($('#mService').val().length > 0){
				//$('#savemaintbtn').attr('data-mid', $('#maintenance_srv_list').val());
				//console.log(JSON.parse($('#maintenance_srv_list').val()));
			  }
			  console.log("Chosen Active Field:"+chosen.active_field);
			  if (chosen.active_field) {
				search.focus();
			  }
			});
			
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
						  option.appendTo($("#mCreatedBy"));
					});
					console.log("Option is added");
					$("#mCreatedBy").val("").trigger("chosen:updated");
					
					if(filtermaincreatedby != ""){
						$('#mCreatedBy').val(filtermaincreatedby).trigger("chosen:updated");
					}
					
					var $chosenuser = $('#mCreatedBy').chosen({
						max_selected_options: 1,
						width:'100%'
					});
					$chosenuser.change(function () {
					  var $this = $(this);
					  var chosen = $this.data('chosen');
					  var search = chosen.search_container.find('input[type="text"]');
					  
					  if($('#mCreatedBy').val().length > 0){
						//$('#savemaintbtn').attr('data-mid', $('#maintenance_srv_list').val());
						//console.log(JSON.parse($('#maintenance_srv_list').val()));
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
	mFilterModalShow();
}

