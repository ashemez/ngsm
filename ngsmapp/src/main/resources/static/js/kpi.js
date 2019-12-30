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

function ShowCron(){
	$('#cronselector').empty();
	$(document).ready(function() {
	    $('#cronselector').cron({
	        //initial: "0 0 1 1 * ?",
	        onChange: function() {
	            //$('#example1-val').text($(this).cron("value"));
	        	console.log("change"+$(this).cron("value"));
	        }
	    });
	});
}

$(document).ready(function() {
    if(urlParams["p"] === 'ds' || urlParams["p"] === 'ds#'){
        $("#mainmenu3 #mainmenu3a").trigger("click");
        $("#submenu-3 #kpi_li1 #data_source").trigger("click");
    	$("#submenu-3 #kpi_li1 #data_source").trigger("focus");
    	
    } else if(urlParams["p"] === 'kpi' || urlParams["p"] === 'kpi#') {
	    $("#mainmenu3 #mainmenu3a").trigger("click");
	    $("#submenu-3 #kpi_li2 #kpi").trigger("click");
		$("#submenu-3 #kpi_li2 #kpi").trigger("focus");
		
    }
    
	//Redirect jsp pages
	$("#submenu-1 #li_bs" ).on('click', 'a', function (){
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
    
    //KPI Run Query Enabled
    $("#keypi_form textarea[name='kpi_query']").change(function(){
        if($("#keypi_form input[name='kpi_name']").val() != '' && $("#keypi_form select[name='ds_list']").val() != '' && $("#keypi_form textarea[name='kpi_query']").val() != '') 
        {
        	$("#keypi_form #run_query").removeAttr('disabled');
        }
        else{
        	$("#keypi_form #run_query").attr('disabled','true');
        }
    });
    $("#keypi_form select[name='ds_list']").change(function(){
    	//console.log($("#keypi_form select[name='ds_list']").val());
        //if($("#keypi_form input[name='kpi_name']").val() != '' && $("#keypi_form select[name='ds_list']").val() != '' && $("#keypi_form textarea[name='kpi_query']").val() != '') 
        if($("#keypi_form input[name='kpi_name']").val() != '' && $("#keypi_form select[name='ds_list']").val() != '')	
        {
        	$("#keypi_form #run_query").removeAttr('disabled');
        }
        else{
        	$("#keypi_form #run_query").attr('disabled','true');
        }
    });
    $("#keypi_form input[name='kpi_name']").change(function(){
        if($("#keypi_form input[name='kpi_name']").val() != '' && $("#keypi_form select[name='ds_list']").val() != '' && $("#keypi_form textarea[name='kpi_query']").val() != '') 
        {
        	$("#keypi_form #run_query").removeAttr('disabled');
        }
        else{
        	$("#keypi_form #run_query").attr('disabled','true');
        }
    });
    
    //KPI Run Query Model Open
    $("#keypi_form #run_query").click(function(){
    	$("#rightsidebar").empty();
    	var kpiName = $("input[name=kpi_name]").val();
    	var dsName = $("select[name=ds_list]").val();
    	var query = $("textarea[name=kpi_query]").val();
    	showQueryRuleDivRSB(kpiName,dsName,query);
    	openWRSB();
    	
    });
    
    
    //Edit KPI Run Query Enabled
    $("#edit_keypi_form textarea[name='edit_kpi_query']").change(function(){
        if($("#edit_keypi_form select[name='edit_ds_list']").val() != '' && $("#edit_keypi_form textarea[name='edit_kpi_query']").val() != '') 
        {
        	$("#edit_keypi_form #edit_run_query").removeAttr('disabled');
        }
        else{
        	$("#edit_keypi_form #edit_run_query").attr('disabled','true');
        }
    });
    $("#edit_keypi_form select[name='edit_ds_list']").change(function(){
        if($("#edit_keypi_form textarea[name='edit_kpi_query']").val() != '' && $("#keypi_form select[name='edit_ds_list']").val() != '')	
        {
        	$("#edit_keypi_form #edit_run_query").removeAttr('disabled');
        }
        else{
        	$("#edit_keypi_form #edit_run_query").attr('disabled','true');
        }
    });
    
    //Edit KPI Run Query Model Open
    $("#edit_keypi_form #edit_run_query").click(function(){
    	$("#rightsidebar").empty();
    	var editkpiName = $('input[name="edit_kpi_name"]').val();
    	var editdsName = $('select[name="edit_ds_list"]').val();
    	var editquery = $('textarea[name="edit_kpi_query"]').val();
    	showEditQueryRuleDivRSB(editkpiName,editdsName,editquery);
    	openWRSB();
    	
    });
    
    $('#kpi_form_def_open_close').on('click', function () {
    	if ($('#kpi_form').is(":visible")){
    		$('#kpi_form').hide();
    		$('#kpi_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    	}
    	else{
			$("#kpi_srv_list option").remove();
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
						  option.appendTo($("#kpi_srv_list"));
					});
					console.log("Option is added");
					$("#kpi_srv_list").val("").trigger("chosen:updated");
					
					// server list search
					$('#kpi_srv_list').val(jData.service_instance_id).trigger("chosen:updated"); // Select the value before .chosen();
					var $chosen = $('#kpi_srv_list').chosen({
						max_selected_options: 1,
						width:'100%'
					});
					$chosen.change(function () {
					  var $this = $(this);
					  var chosen = $this.data('chosen');
					  var search = chosen.search_container.find('input[type="text"]');
					  
					  if($('#kpi_srv_list').val().length > 0){
						//$('#saverptbtn').attr('data-sid', $('#srv_list').val());
						console.log(JSON.parse($('#kpi_srv_list').val()));
					  }
					  console.log("Chosen Active Field:"+chosen.active_field);
					  if (chosen.active_field) {
						search.focus();
					  }
					});
					
					ShowCron();

				}
			});
    		$('#kpi_form').show();
    		$('#kpi_form_def_open_close').removeClass('fa-plus').addClass('fa-minus');
    	}
    	
    });
    $('#datasource_form_def_open_close').on('click', function () {
    	if ($('#ds_form').is(":visible")){
    		$('#ds_form').hide();
    		$('#datasource_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    	}
    	else{
    		$('#ds_form').show();
    		$('#datasource_form_def_open_close').removeClass('fa-plus').addClass('fa-minus');
    	}
    	
    });
    
    //Close Edit DataSource in Datasource Form
    $("#edit_ds_form").on('click','#close_edit_ds',function(){
    	$("#edit_datasource_form").attr('class', 'collapse');
    	$("#datasource_form").attr('class', '');
    });
    
    //Edited Data Source Form Set Values
    $("#existingdatasource").on('click','#dseditbtn',function(){
    	var dsid = $(this).attr("data-dsid");
    	console.log("Edit DS Form Opened!!!"+dsid);
    	$("#loader").attr('class', 'loader');
    	$.ajax({
			cache: false,
			url:'/DataSource?p=getDS&dsid=' + parseInt(dsid),
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				jsondata = JSON.parse(data);
				//$("#editDSModal h5").text(jsondata.dsname);			
				$('#edit_ds_form input[name="edit_ds_name"]').val(jsondata.dsname);
				$('#edit_ds_form input[name="edit_hostname"]').val(jsondata.host);	
				$('#edit_ds_form input[name="edit_port"]').val(jsondata.port);
				$('#edit_ds_form input[name="edit_db_name"]').val(jsondata.dbname);
				$('#edit_ds_form input[name="edit_username"]').val(jsondata.username);
				$('#edit_ds_form input[name="edit_password"]').val(jsondata.password);
				$('#edit_ds_form #edit_type').val(jsondata.dstype);
				$("#edit_ds_form #edit_type.selectpicker").trigger('change');
				
				$('#edit_ds_form #edit_savedsbtn').attr('data-dsid', dsid);
				$('#edit_ds_form #edit_savedsbtn').attr('onclick', 'EditDSSave(' + dsid + ');');
			}
		});
    	
    	$("#datasource_form").attr('class', 'collapse');
		$("#edit_datasource_form").attr('class', '');
    });
    
    //Close Edit KPI in Datasource Form
    $("#edit_kpi_form").on('click','#close_edit_kpi',function(){
    	$("#edit_keypi_form").attr('class', 'collapse');
    	$("#keypi_form").attr('class', '');
    });
    
    //Edited KPI Form Set Values
    $("#existingkpi").on('click','#kpieditbtn',function(){
    	var kpiid = $(this).attr("data-kpiid");
    	console.log("Edit KPI Form Opened!!!"+kpiid);
    	$("#edit_keypi_form #edit_keypi_ds_list option[id!='edit_defaultds']").remove();
		$("#edit_keypi_form #edit_ds_list_igroup ul li:not(:first-child)").remove();
        $.ajax({
			cache: false,
			url:'/DataSource?p=getDSList',
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				var i = 1;
				$.each(JSON.parse(data), function(key,value) {
					//console.log("***"+value.dsname+"***"+value.dsid+"******")
					$("<option></option>").text(value.dsname).val(value.dsid).appendTo($("#edit_keypi_form #edit_keypi_ds_list"));
					var lidiv = $("<li></li>").attr("data-original-index",i);
					var adiv = $("<a></a>").attr("tabindex","0").attr("style","").attr("data-tokens","null").addClass("");
					$("<span></span>").text(value.dsname).addClass("text").appendTo(adiv);
					$("<span></span>").addClass("glyphicon glyphicon-ok check-mark").appendTo(adiv);
					adiv.appendTo(lidiv);
					lidiv.appendTo("#edit_keypi_form #edit_ds_list_igroup ul");
					i = i + 1;
				});
				$("#edit_kpi_srv_list option").remove();
				$("#loader").attr('class', 'loader');
				$.ajax({
					cache: false,
					url:'/Kpi?p=getKPI&kpiId=' + parseInt(kpiid),
					success:function(data) {
						console.log(data);
						$("#loader").attr('class', 'loader collapse');
						
						jsondata = JSON.parse(data);
						$("#edit_keypi_form h5").text(jsondata.kpiname);			
						$('#edit_keypi_form input[name="edit_kpi_name"]').val(jsondata.kpiname);
						$('#edit_keypi_form textarea[name="edit_kpi_query"]').val(jsondata.kpiquery);
						$('#edit_keypi_form textarea[name="edit_thresholdmarginal"]').val(jsondata.thrsmarrule);
						$('#edit_keypi_form textarea[name="edit_thresholdbad"]').val(jsondata.thrsbadrule);
						$("#edit_keypi_form #edit_keypi_ds_list").val(jsondata.dsid);
						$("#edit_keypi_form #edit_keypi_ds_list.selectpicker").trigger('change');
						
						// cron schedule
						$('#edit_cronselector').empty();
						//console.log("jsondata.cron " + jsondata.cron);
						if (jsondata.cron != null)
							$('#edit_cronselector').cron({
								initial: jsondata.cron,
							});
						else
							$('#edit_cronselector').cron();

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
									  option.appendTo($("#edit_kpi_srv_list"));
								});
								console.log("Option is added");
								$('#edit_keypi_form #edit_kpi_srv_list').val(jsondata.sid);
								console.log("SID:"+jsondata.sid);
								
								// server list search
								$('#edit_kpi_srv_list').val(jsondata.sid).trigger("chosen:updated"); // Select the value before .chosen();
								var $chosen = $('#edit_kpi_srv_list').chosen({
									max_selected_options: 1,
									width:'100%'
								});
								
								$chosen.change(function () {
								  var $this = $(this);
								  var chosen = $this.data('chosen');
								  var search = chosen.search_container.find('input[type="text"]');
								  
								  if($('#edit_kpi_srv_list').val().length > 0){
									//$('#saverptbtn').attr('data-sid', $('#srv_list').val());
									//console.log(JSON.parse($('#edit_kpi_srv_list').val()));
								  }
								  console.log("Chosen Active Field:"+chosen.active_field);
								  if (chosen.active_field) {
									search.focus();
								  }
								});
								$("#edit_keypi_form #edit_run_query").attr("disabled","true");
								$('#edit_keypi_form #edit_savekpibtn').attr('data-kpiid', kpiid);
								$('#edit_keypi_form #edit_savekpibtn').attr('onclick', 'EditKPISave(' + kpiid + ');');
								
								$("#keypi_form").attr('class', 'collapse');
								$("#edit_keypi_form").attr('class', '');
							}
						});		
						
					}
				});
				
			}
		});
    	
    });
    
    $('#saveModal').on('hidden.bs.modal', function () {
    	console.log("KPI Hidden model!!!!!!!!!!!");
    	if($("#saveModal").attr("data-form_name") == "adddatasource"){
            var attr = $("#datasource_form #existingdatasource tbody tr").attr('data-sid');
            if (typeof attr !== typeof undefined && attr !== false) {
            	$("#datasource_form #existingdatasource tbody tr[data-sid]").remove();
            }
			$("#loader").attr('class', 'loader');
			$.ajax({
				cache: false,
				url:'/DataSource?p=isEditDSAuthorized',
				success:function(edata) {
					$.ajax({
						cache: false,
						url:'/DataSource?p=getDSList',
						success:function(data) {
							$("#loader").attr('class', 'loader collapse');
							showdataSourceList(data, edata);
						}
					});
				}
			});
			$('#ds_form').hide();
    		$('#datasource_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    	}
    	if($("#saveModal").attr("data-form_name") == "editdatasource"){
    		 var attr = $("#datasource_form #existingdatasource tbody tr").attr('data-sid');
	            if (typeof attr !== typeof undefined && attr !== false) {
	            	$("#datasource_form #existingdatasource tbody tr[data-sid]").remove();
	            }
				$("#loader").attr('class', 'loader');
				$.ajax({
					cache: false,
					url:'/DataSource?p=isEditDSAuthorized',
					success:function(edata) {
						$.ajax({
							cache: false,
							url:'/DataSource?p=getDSList',
							success:function(data) {
								$("#loader").attr('class', 'loader collapse');
								showdataSourceList(data, edata);
							}
						});
					}
				});
				$("#edit_datasource_form").attr('class', 'collapse');
	    		$('#datasource_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
	    		$('#ds_form').hide();
	    		$("#datasource_form").attr('class', '');
    	}
    	if($("#saveModal").attr("data-form_name") == "addkpi"){
    		var attr = $("#keypi_form #existingkpi tbody tr").attr('data-kpiid');
            if (typeof attr !== typeof undefined && attr !== false) {
            	$("#keypi_form #existingkpi tbody tr[data-kpiid]").remove();
            }
			$("#loader").attr('class', 'loader');
			$.ajax({
				cache: false,
				url:'/Kpi?p=isEditKPIAuthorized',
				success:function(edata) {
					$.ajax({
						cache: false,
						url:'/Kpi?p=getKPIList',
						success:function(data) {
							$("#loader").attr('class', 'loader collapse');
							showKpiList(data, edata);
						}
					});
				}
			});
			$('#kpi_form').hide();
    		$('#kpi_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    	}
    	if($("#saveModal").attr("data-form_name") == "editkpi"){
            var attr = $("#keypi_form #existingkpi tbody tr").attr('data-kpiid');
            if (typeof attr !== typeof undefined && attr !== false) {
            	$("#keypi_form #existingkpi tbody tr[data-kpiid]").remove();
            }
			$("#loader").attr('class', 'loader');
			$.ajax({
				cache: false,
				url:'/Kpi?p=isEditKPIAuthorized',
				success:function(edata) {
					$.ajax({
						cache: false,
						url:'/Kpi?p=getKPIList',
						success:function(data) {
							$("#loader").attr('class', 'loader collapse');
							showKpiList(data, edata);
						}
					});
				}
			});
    		$('#kpi_form_def_open_close').removeClass('fa-minus').addClass('fa-plus'); 	
    		$('#kpi_form').hide();
    		$("#edit_keypi_form").attr('class', 'collapse');
        	$("#keypi_form").attr('class', '');
    	}
    });

});

//Edit DataSource Save
function EditDSSave(dsid){	
	var dsname = $('#edit_ds_form input[name="edit_ds_name"]').val();
	var dstype = $('#edit_ds_form #edit_type').val();
	var host = $('#edit_ds_form input[name="edit_hostname"]').val();	
	var port = $('#edit_ds_form input[name="edit_port"]').val();
	var dbname = $('#edit_ds_form input[name="edit_db_name"]').val();
	var username = $('#edit_ds_form input[name="edit_username"]').val();
	var pwd = $('#edit_ds_form input[name="edit_password"]').val();
	
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/DataSource?p=saveDS&name=' + dsname+ '&dstype=' + dstype + '&host=' + host + '&port=' + port + '&dbname=' + dbname+ '&username=' + username+ '&pw=' + pwd,
		success:function(data) {
			$("#loader").attr('class', 'loader collapse');	
			var jData = JSON.parse(data);
			if(jData.state != undefined){
				if(jData.state == "SUCCESS"){
					$("#saveModal").attr("data-form_name","editdatasource");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
				}
				else{
					$("#saveModal").attr("data-form_name","editdatasource");
					$("#saveModal .modal-body p").text(jData.message + " !!!");
					$("#saveModal").modal("show");
				}
			}			
		}
	});
}

//Edit KPI Save
function EditKPISave(kpiid){	
	var kpiname = $('#edit_kpi_form input[name="edit_kpi_name"]').val();
	var sid = $("#edit_kpi_form #edit_kpi_srv_list").val();
	var kpiquery = $("#edit_kpi_form textarea[name='edit_kpi_query']").val();
	var thrsmarrule = $("#edit_kpi_form textarea[name='edit_thresholdmarginal']").val();
	thrsmarrule = thrsmarrule.split(">").join("greater");
	thrsmarrule = thrsmarrule.split("<").join("less");
	thrsmarrule = thrsmarrule.split("=").join("equal");
	var thrsbadrule = $("#edit_kpi_form textarea[name='edit_thresholdbad']").val();
	thrsbadrule = thrsbadrule.split(">").join("greater");
	thrsbadrule = thrsbadrule.split("<").join("less");
	thrsbadrule = thrsbadrule.split("=").join("equal");
	var cron = "";
	if($('#edit_cronselector').cron("value") != undefined)
		cron = $('#edit_cronselector').cron("value");
	var dsid = $("#edit_kpi_form #edit_keypi_ds_list").val();
	console.log("kpi_name:"+kpiname);
	console.log("kpi_query:"+kpiquery);
	console.log("kpi cron"+cron);
	console.log("kpi_thrsmarginal:"+thrsmarrule);
	console.log("kpi_thrsbad:"+thrsbadrule);
	console.log("kpi_dsid:"+dsid);
	console.log("kpi_sid:"+sid);
	$("#loader").attr('class', 'loader');
	
	if(cron === ""){
		alert("Please schedule the KPI");
	} else {
		console.log('/Kpi?p=saveKPI&name=' + kpiname+ '&sid=' + sid + '&query=' + kpiquery + '&cron=' + cron + '&thresholdMarginalRule=' + thrsmarrule+ '&thresholdBadRule=' + thrsbadrule+ '&dsid='+dsid);
		$.ajax({
			cache: false,
			url:'/Kpi?p=saveKPI&name=' + kpiname+ '&sid=' + sid + '&query=' + kpiquery + '&cron=' + cron + '&thresholdMarginalRule=' + thrsmarrule+ '&thresholdBadRule=' + thrsbadrule+ '&dsid='+dsid,
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				console.log("KPIDefinitionFuntion: "+data);
				var jData = JSON.parse(data);
				if(jData.state != undefined){
					if(jData.state == "SUCCESS"){
						$("#saveModal").attr("data-form_name","editkpi");
						$("#saveModal .modal-body p").text(jData.message + " !!!");
						$("#saveModal").modal("show");
					}
					else{
						$("#saveModal").attr("data-form_name","editkpi");
						$("#saveModal .modal-body p").text(jData.message + " !!!");
						$("#saveModal").modal("show");
					}
				}
			}
		});
	}
}
