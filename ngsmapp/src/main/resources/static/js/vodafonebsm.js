var idList = [];
var srvidList = [];
var srvidListTotal = [];
var outerPopulateAllServiceBoxes;
var outerPopulateServicesCategoryCount;
var outerPopulateAllSearchedBoxes;
var outerPopulateSearchServicesCategoryCount;
var outerPageCount;
var outerPaginate;
var outerSearchPaginate;
var availabilityInterval;
//Administration role selection arrays 
var enrollroleid = [];
var unenrollroleid = [];
var changeenrollroleid = [];
//Administration group selection arrays
var enrollgroupid = [];
var unenrollgroupid = [];
var changeenrollgroupid = [];
//Administration user selection arrays
var enrolluserid = [];
var unenrolluserid = [];
var changeenrolluserid = [];

var urlParams = {};
//Administration Resource Permission selection arrays
var respermsrv = [];
var respermds = [];
var respermkpi = [];
var respermrep = [];
var respermadm = [];
var respertotal = [];

//Administration Service Permission selection arrays
var srvpertotal = [];
var enrollservices=[]; 
var unenrollservices=[]; 

	$(function() {
		
		$(function() {
	        pairs = document.URL.split('?')
	               .pop()
	               .split('&');

		    for (var i = 0, p; i < pairs.length; i++) {
		           p = pairs[i].split('=');
		           urlParams[ p[0] ] =  p[1];
		    }
		});
		
		
		$('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
	        $($.fn.dataTable.tables(true)).DataTable().columns.adjust().draw();
	    });
	    	 
	    /*$('#kpitable').DataTable( {
	        ajax: 'resource/kpilist.json',
	        scrollY: 200,
	        scrollCollapse: true,
			"bPaginate": false,
			lengthChange: false,
		    "bFilter": true,
		    "bInfo": false,
		    "bAutoWidth": false,
		    "createdRow": function( row, data, dataIndex ) {       
		    	$(row).css('backgroundColor', getKPIStatusColor(data[3]));
		    	}
	    });*/
			
		$('[data-toggle="tooltip"]').tooltip({ trigger:'hover'});
		$("#sidebar-nav .collapse").on("hide.bs.collapse", function() {                   
			$(this).prev().find("#pull").eq(0).removeClass("fa-angle-right").addClass("fa-angle-down");
			
		});
		$('#sidebar-nav .collapse').on("show.bs.collapse", function() {
			$(this).prev().find("#pull").eq(0).removeClass("fa-angle-down").addClass("fa-angle-right"); 
			$(this).parent().siblings().find('.collapse.in').collapse('hide');
		});
		
		//Tree Zoom Button Mouser Over Mouse Out
		$("#treebuttonmenu").mouseenter(function() {
		    $(this).find("button").css({'background' : 'url(resource/img/tree/fit20.png)','height':'20px','width':'20px','border':'0px'});
		    console.log("Mouse over ok");
		});

		$("#treebuttonmenu").mouseleave(function(){
			$(this).find("button").css({'background' : 'url(resource/img/tree/fit.png)','height':'25px','width':'25px','border':'0px'}); 
			console.log("Mouse out ok");
		});
		
		
		$(".modal-content").on('click','#closemodal',function(){
			$("#myModal").hide();
		});
		
		$(".modal-footer").on('click','h3',function(){
			console.log("Save Click");
			console.log($(".modal-body #node_name5").val());
			createNewNode();
			$("#myModal").hide();
		});
		
		
		//Right sidebar Add Node Save Button
		$("#rightsidebar").on('click','#saveaddbutton',function(){
			saveAddNodeRSB();
			closeRSB();
			clearRSB();
		});
		
		//Right sidebar Rename Node Save Button
		$("#rightsidebar").on('click','#saverenamebutton',function(){
			saveRenameNodeRSB();
			closeRSB();
			clearRSB();
		});
		
		//Right sidebar Node New Group Save Button
		$("#rightsidebar").on('click','#savenewgroup',function(){
			savenewNodeGroupRSB();
		});
		
		//Right sidebar Node Existing Group Save Button
		$("#rightsidebar").on('click','#saveexistinggroup',function(){
			console.log($(this).parent().parent().siblings().data("gid"));
			gid = $(this).parent().parent().siblings().data("gid");
			saveExistingNodeGroupRSB(gid);
		});
		
		//Right sidebar Node Existing Group Delete Button
		$("#rightsidebar").on('click','#deleteexistinggroup',function(){
			deleteNodeGroupRSB();
		});
		
		//Right Side Bar Create group Collapse
		$("#rightsidebar").on('click','#addCreateNewGroup .headercollapse',function(){
			/*deactiveGroupNodes = activeGroupNodes;
			activeGroupNodes = [];
			outer_update(rootNode);
			*/
		    $headercollapse = $(this);
		    //getting the next element
		    $contentcollapse = $headercollapse.next();
		    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
		    $contentcollapse.slideToggle(500, function () {
		        //execute this after slideToggle is done
		        //change text of header based on visibility of content div
		        $headercollapse.text(function () {
		            //change text based on condition
		            return $contentcollapse.is(":visible") ? "New Group" : "Create a New Group";
		        });
		        if($contentcollapse.is(":visible")){
		        	if(activeGroupNodes.length > 0){
		        		deactiveGroupNodes = activeGroupNodes;
		        		deactiveGroupNodesName = activeGroupNodesName;
		        	}
		        	activeGroupNodes = [];
		        	activeGroupNodesName = [];
		    		outer_update(rootNode);
				    console.log("ActiveNew: " +activeGroupNodes);
				    console.log("DeactiveNew: " +deactiveGroupNodes);
				    if(activeGroupNodes.length > 0){
				    	for(i=0; i < activeGroupNodes.length; i++) {
				    		removeFromGroup(activeGroupNodesName[i],activeGroupNodes[i]);
				    	}
		        	}
				    if(deactiveGroupNodes.length > 0){
				    	for(i=0; i < deactiveGroupNodes.length; i++) {
				    		removeFromGroup(deactiveGroupNodesName[i],deactiveGroupNodes[i]);
				    	}
		        	}
		    	}
		    	else{
		    		deactiveGroupNodes = activeGroupNodes;
		    		deactiveGroupNodesName = activeGroupNodesName;
		    		activeGroupNodes = [];
		    		activeGroupNodesName = [];
				    console.log("ActiveNew: " +activeGroupNodes);
				    console.log("DeactiveNew: " +deactiveGroupNodes);
				    outer_update(rootNode);
				    if(deactiveGroupNodes.length > 0){
				    	for(i=0; i < deactiveGroupNodes.length; i++) {
				    		removeFromGroup(deactiveGroupNodesName[i],deactiveGroupNodes[i]);
				    	}
		        	}
		    	}
		        
		    });
		    $(this).parent().siblings().find('.contentcollapse:visible').slideToggle(500, function (){});
		});
		
		//Right Side Bar Existing group Collapse
		//var activeGroupNodesClone = [];
		$("#rightsidebar").on('click','.headercollapse[data-header]',function(){
		    $headercollapse = $(this);
		    
		    //getting the next element
		    $contentcollapse = $headercollapse.next();
		    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
		    $contentcollapse.slideToggle(500, function () {
		    	console.log($contentcollapse.is(":visible"));
			    if($contentcollapse.is(":visible")){
			    	deactiveGroupNodes = [];
			    	deactiveGroupNodesName = [];
			    	if(activeGroupNodes.length > 0){
		        		deactiveGroupNodes = activeGroupNodes;
		        		deactiveGroupNodesName = activeGroupNodesName;
		        	}
			    	console.log('Grp Sids: ' + grpNodes[$headercollapse.attr('data-header')]);
			    	
		    		grpNodes[$headercollapse.attr('data-header')] = [];
		    		grpNodesName[$headercollapse.attr('data-header')] = [];
		    		var i = 0;
		    		var length = grpNodesClone[$headercollapse.attr('data-header')].length;
		    		for(i=0; i < length; i++) {
		    			grpNodes[$headercollapse.attr('data-header')].push(grpNodesClone[$headercollapse.attr('data-header')][i]);
		    			grpNodesName[$headercollapse.attr('data-header')].push(grpNodesNameClone[$headercollapse.attr('data-header')][i]);
		    		}
		    		activeGroupNodes = grpNodes[$headercollapse.attr('data-header')];
		    		activeGroupNodesName = grpNodesName[$headercollapse.attr('data-header')];
		    		activeGroupId = $headercollapse.attr('data-gid');
		    		
		    		console.log("ActiveGroup: " + activeGroupId);
				    console.log("Active: " +activeGroupNodes);
				    console.log("Deactive: " +deactiveGroupNodes);
				    outer_update(rootNode);
				    console.log("00000000000000:" + grpNodesClone[$headercollapse.attr('data-header')].length);
				    if(deactiveGroupNodes.length > 0){
				    	for(i=0; i < deactiveGroupNodes.length; i++) {
				    		removeFromGroup(deactiveGroupNodesName[i],deactiveGroupNodes[i]);
				    	}
		        	}
				    if(grpNodes[$headercollapse.attr('data-header')].length > 0){
				    	for(i=0; i < grpNodes[$headercollapse.attr('data-header')].length; i++) {
				    		addNode2Group(grpNodesName[$headercollapse.attr('data-header')][i],grpNodes[$headercollapse.attr('data-header')][i]);
				    	}
		        	}
		    	}
		    	else{
		    		deactiveGroupNodes = activeGroupNodes;
		    		deactiveGroupNodesName = activeGroupNodesName;
		    		activeGroupNodes = [];
		    		activeGroupNodesName = [];
		    		activeGroupId = 0;
				    console.log("Active: " +activeGroupNodes);
				    console.log("Deactive: " +deactiveGroupNodes);
				    outer_update(rootNode);
				    console.log("GRPPPPPPP:" + grpNodes[$headercollapse.attr('data-header')].length);
				    if(deactiveGroupNodes.length > 0){
				    	for(i=0; i < deactiveGroupNodes.length; i++) {
				    		removeFromGroup(deactiveGroupNodesName[i],deactiveGroupNodes[i]);
				    	}
		        	}
				    
		    	}
			   
		    });
		    $(this).parent().siblings().find('.contentcollapse:visible').slideToggle(500, function (){});
		});
		
		//Business Services Dashboard Click
		$("#submenu-1 #dash1").click(function(){
			if(!$("#submenu-1 #dash1").hasClass("faimagecolor")){
            	$("#submenu-1 #dash1").trigger("focus");
            };
			$("#contentheader .panel-heading").text('Dashboards > Business Services');
			//if($("#servicesboxes").has(".col-md-3")){
			$("#servicesboxes .col-md-3").remove();
			//}
            $("#loader").attr('class', '');
            $("#divtree").attr('class', 'row collapse');
            $("#servicesboxes").attr('class', 'row');
            $("#checkboxdiv").attr('class', 'well well-sm text-center'); 
            $("#contentpage .btn-group.row").css({"display":"none"});
            $("#switchautozoom").css({"display":"none"});
            $("#paginationdiv").attr('class', 'row');
            if(!$("#datasource_form").hasClass("row collapse")){
            	$("#datasource_form").attr('class', 'row collapse');
            };
            if(!$("#keypi_form").hasClass("row collapse")){
            	$("#keypi_form").attr('class', 'row collapse');
            };
            if(!$("#users_form").hasClass("row collapse")){
            	$("#users_form").attr('class', 'row collapse');
            };
            if(!$("#roles_form").hasClass("row collapse")){
            	$("#roles_form").attr('class', 'row collapse');
            };
            if(!$("#groups_form").hasClass("row collapse")){
            	$("#groups_form").attr('class', 'row collapse');
            };
            if(!$("#rightsidebar").hasClass("collapse")){
            	closeRSB();
            	clearRSB();
            };
            var attr = $("#datasource_form #existingdatasource tbody tr").attr('data-sid');
            if (typeof attr !== typeof undefined && attr !== false) {
            	$("#datasource_form #existingdatasource tbody tr[data-sid]").remove();
            }      
            var attr = $("#keypi_form #existingkpi tbody tr").attr('data-kpiid');
            if (typeof attr !== typeof undefined && attr !== false) {
            	$("#keypi_form #existingkpi tbody tr[data-kpiid]").remove();
            }
            var attrusr = $("#users_form #existingusers tbody tr").attr('data-userid');
            if (typeof attrusr !== typeof undefined && attrusr !== false) {
            	$("#users_form #existingusers tbody tr[data-userid]").remove();
            	//$('#kpi_form').bootstrapValidator('resetForm', true);
            } 
            var attrrole = $("#roles_form #existingroles tbody tr").attr('data-roleid');
            if (typeof attrrole !== typeof undefined && attrrole !== false) {
            	$("#roles_form #existingroles tbody tr[data-userid]").remove();
            	//$('#kpi_form').bootstrapValidator('resetForm', true);
            } 
            var attrgroup = $("#groups_form #existinggroups tbody tr").attr('data-groupid');
            if (typeof attrgroup !== typeof undefined && attrgroup !== false) {
            	$("#groups_form #existinggroups tbody tr[data-groupid]").remove();
            } 
			PopulateServicesCategoryCount();
			srvBoxPageNumber = 1;
			statusFilter='0,3,5';
			spatter='';
			PopulateAllServiceBoxes(srvBoxPageNumber,statusFilter,spattern);
		});
		
		//Right Sidebar Close
		$("#rightsidebar").on('click','#closersb',function(){
			//closeRSB();
			//clearRSB();
			outer_mngGrpClose();
		});
		
		//Right Sidebar KPI Query Close
		$("#rightsidebar").on('click','#closersbquery',function(){
			closeRSB();
			$("#rightsidebar").empty();
		});
		
		//Data Source Definition Page Load
		$('#mainmenu3').on('click','#data_source',function(){
			$("#contentheader .panel-heading").text('KPI Management > Data Sources');
			var attr = $("#datasource_form #existingdatasource tbody tr").attr('data-sid');
            if (typeof attr !== typeof undefined && attr !== false) {
            	$("#datasource_form #existingdatasource tbody tr[data-sid]").remove();
            }
            $("#datasource_form").attr('class', '');
            $("#edit_datasource_form").attr('class', 'collapse');
            $("#edit_keypi_form").attr('class', 'collapse');
            $("#loader").attr('class', 'loader');
            $.ajax({
				cache: false,
				url:'/DataSource?p=isEditDSAuthorized',
				success:function(edata) {
					$.ajax({
						cache: false,
						url:'/DataSource?p=getDSList',
						success:function(data) {
							showdataSourceList(data, edata);
						}
					});
				}
			});

            $("#loader").attr('class', 'loader collapse');
            if(!$("#keypi_form").hasClass("row collapse")){
            	$("#keypi_form").attr('class', 'row collapse');
            };
            if(!$("#rightsidebar").hasClass("collapse")){
            	closeRSB();
            	clearRSB();
            };
            var attr = $("#keypi_form #existingkpi tbody tr").attr('data-kpiid');
            if (typeof attr !== typeof undefined && attr !== false) {
            	$("#keypi_form #existingkpi tbody tr[data-kpiid]").remove();
            }
        	$("#ds_form").hide();
            if($('#datasource_form_def_open_close').hasClass('fa-minus')){
            	$('#datasource_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
            }
            ChangeUrl('Business Service View',$(location).attr('origin')+'/kpi.jsp?p=ds');          
		});

		//KPI Definition Page Load
		$('#mainmenu3').on('click','#kpi',function(){
			$("#keypi_form #keypi_ds_list option[id!='defaultds']").remove();
			$("#keypi_form #ds_list_igroup ul li:not(:first-child)").remove();
			$("#contentheader .panel-heading").text('KPI Management > KPI');
            var attr = $("#keypi_form #existingkpi tbody tr").attr('data-kpiid');
            if (typeof attr !== typeof undefined && attr !== false) {
            	$("#keypi_form #existingkpi tbody tr[data-kpiid]").remove();
            }
			$("#keypi_form #run_query").attr("disabled","true");
            $("#keypi_form").attr('class', '');
            $("#edit_datasource_form").attr('class', 'collapse');
            $("#edit_keypi_form").attr('class', 'collapse');
            $("#loader").attr('class', 'loader');
            dsKPISelectFunc();
            $("#loader").attr('class', 'loader');
            $.ajax({
				cache: false,
				url:'/Kpi?p=isEditKPIAuthorized',
				success:function(edata) {
					$.ajax({
						cache: false,
						url:'/Kpi?p=getKPIList',
						success:function(data) {
							showKpiList(data, edata);
						}
					});
				}
			});

            $("#loader").attr('class', 'loader collapse');
            if(!$("#datasource_form").hasClass("row collapse")){
            	$("#datasource_form").attr('class', 'row collapse');
            };
            if(!$("#rightsidebar").hasClass("collapse")){
            	closeRSB();
            	clearRSB();
            };
            var attr = $("#datasource_form #existingdatasource tbody tr").attr('data-sid');
            if (typeof attr !== typeof undefined && attr !== false) {
            	$("#datasource_form #existingdatasource tbody tr[data-sid]").remove();
            }
        	$("#kpi_form").hide();
            if($('#kpi_form_def_open_close').hasClass('fa-minus')){
            	$('#kpi_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
            }
            ChangeUrl('Business Service View',$(location).attr('origin')+'/kpi.jsp?p=kpi');
		});
		
		//Maintenance Definition Page Load
		$('#opmenu').on('click','#maintenance_mode',function(){
			$("#contentheader .panel-heading").text('Operations Management > Maintenance'); 
			var attr = $("#m_form #existingmaintenance tbody tr").attr('data-mid');
            if (typeof attr !== typeof undefined && attr !== false) {
            	$("#m_form #existingmaintenance tbody tr[data-mid]").remove();
            }
            $("#m_form").attr('class', '');
            $("#loader").attr('class', 'loader');
            $.ajax({
				cache: false,
				url:'/Maintenance?p=getMaintenanceList&filterSid=' + filterSid,
				success:function(data) {
					$("#loader").attr('class', 'loader collapse');
					showMaintenanceList(data);
					MaintenancePaginate();
				}
			});
        	$("#maintenance_form").hide();
            if($('#maintenance_form_def_open_close').hasClass('fa-minus')){
            	$('#maintenance_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
            }
            //ChangeUrl('Business Service View',$(location).attr('origin')+'/maintenance.jsp');          
		});
		
		
		
		//Administrator User Page Load
		$('#adminmenu').on('click','#user_source',function(){
			$("#contentheader .panel-heading").text('Administrator > Users');
            var attrusr = $("#users_form #existingusers tbody tr").attr('data-userid');
            if (typeof attrusr !== typeof undefined && attrusr !== false) {
            	$("#users_form #existingusers tbody tr[data-userid]").remove();
            	//$('#kpi_form').bootstrapValidator('resetForm', true);
            }
            $("#loader").attr('class', 'loader');
            $.ajax({
				cache: false,
				url:'/Users?p=getAllUsers',
				success:function(data) {
					$("#loader").attr('class', 'loader collapse');
					showUserList(data);
				}
			});     
            $("#loader").attr('class', 'loader');
            $.ajax({
				cache: false,
				url:'/Roles?p=getAllRoles',
				success:function(data) {
					$("#loader").attr('class', 'loader collapse');
					populateUserRoleForNewUser(data);
				}
			});
            
            $("#loader").attr('class', 'loader');
            $.ajax({
				cache: false,
				url:'/Groups?p=getAllGroups',
				success:function(data) {
					$("#loader").attr('class', 'loader collapse');
					populateUserGroupsForNewUser(data);
				}
			});
			$("#users_form").attr('class', '');
			if(!$("#roles_form").hasClass("collapse")){
            	$("#roles_form").attr('class', 'collapse');
            };
            if(!$("#groups_form").hasClass("collapse")){
            	$("#groups_form").attr('class', 'collapse');
            };
            if(!$("#edit_users_form").hasClass("collapse")){
            	$("#edit_users_form").attr('class', 'collapse');
            };
            if(!$("#edit_roles_form").hasClass("collapse")){
            	$("#edit_roles_form").attr('class', 'collapse');
            };
            if(!$("#edit_groups_form").hasClass("collapse")){
            	$("#edit_groups_form").attr('class', 'collapse');
            };
            if(!$("#rightsidebar").hasClass("collapse")){
            	closeRSB();
            	clearRSB();
            };
            var attrrole = $("#roles_form #existingroles tbody tr").attr('data-roleid');
            if (typeof attrrole !== typeof undefined && attrrole !== false) {
            	$("#roles_form #existingroles tbody tr[data-userid]").remove();
            	//$('#kpi_form').bootstrapValidator('resetForm', true);
            }
            var attrgroup = $("#groups_form #existinggroups tbody tr").attr('data-groupid');
            if (typeof attrgroup !== typeof undefined && attrgroup !== false) {
            	$("#groups_form #existinggroups tbody tr[data-groupid]").remove();
            }
            $("#usr_form").hide();
            if($('#users_form_def_open_close').hasClass('fa-minus')){
            	$('#users_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
            }
            
            if($("#users_form #user_form_role_list").css('display') == 'block'){
            	$("#users_form #user_form_role_list").css("display","none");
            	$("#users_form #add_roles").text("Edit");
            }
            if($("#users_form #user_form_group_list").css('display') == 'block'){
            	$("#users_form #user_form_group_list").css("display","none");
            	$("#users_form #add_groups").text("Edit");
            }
            
            if($("#edit_users_form #edit_user_form_role_list").css('display') == 'block'){
    			$("#edit_users_form #edit_user_form_role_list").css("display","none");
    			$("#edit_users_form #edit_add_roles").text("Edit");
            }
            if($("#edit_users_form #edit_user_form_group_list").css('display') == 'block'){
            	$("#edit_users_form #edit_user_form_group_list").css("display","none");
            	$("#edit_users_form #edit_add_groups").text("Edit");
            }
            
            ChangeUrl('Business Service View',$(location).attr('origin')+'/admin.jsp?p=users');
            
		});
		
		//Administrator Role Page Load
		$('#adminmenu').on('click','#role_source',function(){
			$("#contentheader .panel-heading").text('Administrator > Roles');
            var attrrole = $("#roles_form #existingroles tbody tr").attr('data-roleid');
            if (typeof attrrole !== typeof undefined && attrrole !== false) {
            	$("#roles_form #existingroles tbody tr[data-roleid]").remove();
            }
            $("#loader").attr('class', 'loader');
            $.ajax({
				cache: false,
				url:'/Roles?p=getAllRoles',
				success:function(data) {
					$("#loader").attr('class', 'loader collapse');
					showRoleList(data);
				}
			});
            $("#loader").attr('class', 'loader');
            $.ajax({
				cache: false,
				url:'/Report?p=getMainServiceList',
				success:function(data) {
					$("#loader").attr('class', 'loader collapse');
					populateServicesForNewRole(data);
				}
			});
            $("#loader").attr('class', 'loader');
            $.ajax({
				cache: false,
				url:'/Users?p=getAllUsers',
				success:function(data) {
					$("#loader").attr('class', 'loader collapse');
					populateUsersForNewRole(data);
				}
			});
            $("#loader").attr('class', 'loader');
            $.ajax({
				cache: false,
				url:'/Groups?p=getAllGroups',
				success:function(data) {
					$("#loader").attr('class', 'loader collapse');
					populateGroupsForNewRole(data);
				}
			});
            uncheckAllRolePerm();
			$("#roles_form").attr('class', '');
			if(!$("#users_form").hasClass("collapse")){
            	$("#users_form").attr('class', 'collapse');
            };
			if(!$("#groups_form").hasClass("collapse")){
            	$("#groups_form").attr('class', 'collapse');
            }; 
            if(!$("#edit_users_form").hasClass("collapse")){
            	$("#edit_users_form").attr('class', 'collapse');
            };
            if(!$("#edit_roles_form").hasClass("collapse")){
            	$("#edit_roles_form").attr('class', 'collapse');
            };
			if(!$("#edit_groups_form").hasClass("collapse")){
            	$("#edit_groups_form").attr('class', 'collapse');
            };         
            if(!$("#rightsidebar").hasClass("collapse")){
            	closeRSB();
            	clearRSB();
            };
            
            var attruser = $("#users_form #existingusers tbody tr").attr('data-userid');
            if (typeof attruser !== typeof undefined && attruser !== false) {
            	$("#users_form #existingusers tbody tr[data-userid]").remove();
            }
			var attrgroup = $("#groups_form #existinggroups tbody tr").attr('data-groupid');
            if (typeof attrgroup !== typeof undefined && attrgroup !== false) {
            	$("#groups_form #existinggroups tbody tr[data-groupid]").remove();
            }
            $("#rls_form").hide();
            if($('#roles_form_def_open_close').hasClass('fa-minus')){
            	$('#roles_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
            }
            
            if($("#roles_form #role_form_perm_list").css('display') == 'block'){
            	$("#roles_form #role_form_perm_list").css({"display":"none"});
            	$("#roles_form #role_resource_permiss").text("Edit");
            }
            if($("#roles_form #role_form_user_list").css('display') == 'block'){
				$("#roles_form #role_form_user_list").css("display","none");
				$("#roles_form #role_add_users").text("Edit");
            }
            if($("#roles_form #role_form_group_list").css('display') == 'block'){
				$("#roles_form #role_form_group_list").css("display","none");
				$("#roles_form #role_add_groups").text("Edit");
            }
            if($("#roles_form #role_form_srvper_list").css('display') == 'block'){
				$("#roles_form #role_form_srvper_list").css("display","none");
				$("#roles_form #role_service_permiss").text("Edit");
            }
            
            if($("#edit_roles_form #edit_role_form_perm_list").css('display') == 'block'){
				$("#edit_roles_form #edit_role_form_perm_list").css("display","none");
				$("#edit_roles_form #edit_role_resource_permiss").text("Edit");
            }
            if($("#edit_roles_form #edit_role_form_user_list").css('display') == 'block'){
				$("#edit_roles_form #edit_role_form_user_list").css("display","none");
				$("#edit_roles_form #edit_role_add_users").text("Edit");
            }
            if($("#edit_roles_form #edit_role_form_group_list").css('display') == 'block'){
				$("#edit_roles_form #edit_role_form_group_list").css("display","none");
				$("#edit_roles_form #edit_role_add_groups").text("Edit");
            }
            if($("#edit_roles_form #edit_role_form_srvper_list").css('display') == 'block'){
				$("#edit_roles_form #edit_role_form_srvper_list").css("display","none");
				$("#edit_roles_form #edit_role_service_permiss").text("Edit");
            }
              
            ChangeUrl('Business Service View',$(location).attr('origin')+'/admin.jsp?p=roles');
            
		});
		
		//Administrator Group Page Load
		$('#adminmenu').on('click','#group_source',function(){
			$("#contentheader .panel-heading").text('Administrator > Groups');
            var attrgroup = $("#groups_form #existinggroups tbody tr").attr('data-groupid');
            if (typeof attrgroup !== typeof undefined && attrgroup !== false) {
            	$("#groups_form #existinggroups tbody tr[data-groupid]").remove();
            }
            $("#loader").attr('class', 'loader');
            $.ajax({
				cache: false,
				url:'/Groups?p=getAllGroups',
				success:function(data) {
					showGroupList(data);
				}
			});
            $("#loader").attr('class', 'loader collapse');
            $("#loader").attr('class', 'loader');
            $.ajax({
				cache: false,
				url:'/Users?p=getAllUsers',
				success:function(data) {
					populateUsersForNewGroup(data);
				}
			});
            $("#loader").attr('class', 'loader collapse');
            $("#loader").attr('class', 'loader');
            $.ajax({
				cache: false,
				url:'/Roles?p=getAllRoles',
				success:function(data) {
					populateRolesForNewGroup(data);
				}
			});
            $("#loader").attr('class', 'loader collapse');
			$("#groups_form").attr('class', '');
			if(!$("#users_form").hasClass("collapse")){
            	$("#users_form").attr('class', 'collapse');
            };
			if(!$("#roles_form").hasClass("collapse")){
            	$("#roles_form").attr('class', 'collapse');
            };
            if(!$("#edit_users_form").hasClass("collapse")){
            	$("#edit_users_form").attr('class', 'collapse');
            };
			if(!$("#edit_roles_form").hasClass("collapse")){
            	$("#edit_roles_form").attr('class', 'collapse');
            };
            if(!$("#edit_groups_form").hasClass("collapse")){
            	$("#edit_groups_form").attr('class', 'collapse');
            };
            if(!$("#rightsidebar").hasClass("collapse")){
            	closeRSB();
            	clearRSB();
            };
            var attruser = $("#users_form #existingusers tbody tr").attr('data-userid');
            if (typeof attruser !== typeof undefined && attruser !== false) {
            	$("#users_form #existingusers tbody tr[data-userid]").remove();
            }
			var attrrole = $("#roles_form #existingroles tbody tr").attr('data-roleid');
            if (typeof attrrole !== typeof undefined && attrrole !== false) {
            	$("#roles_form #existingroles tbody tr[data-roleid]").remove();
            }
            $("#grps_form").hide();
            if($('#groups_form_def_open_close').hasClass('fa-minus')){
            	$('#groups_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
            }
            
            if($("#groups_form #group_form_user_list").css('display') == 'block'){
            	$("#groups_form #group_form_user_list").css({"display":"none"});
            	$("#groups_form #group_add_users").text("Edit");
            }
            if($("#groups_form #group_form_role_list").css('display') == 'block'){
				$("#groups_form #group_form_role_list").css("display","none");
				$("#groups_form #group_add_roles").text("Edit");
            }
            
            if($("#edit_groups_form #edit_group_form_user_list").css('display') == 'block'){
				$("#edit_groups_form #edit_group_form_user_list").css("display","none");
				$("#edit_groups_form #edit_grpadd_users").text("Edit");
            }
            if($("#edit_groups_form #edit_group_form_role_list").css('display') == 'block'){
				$("#edit_groups_form #edit_group_form_role_list").css("display","none");
				$("#edit_groups_form #edit_grpadd_roles").text("Edit");
            }
            
            ChangeUrl('Business Service View',$(location).attr('origin')+'/admin.jsp?p=groups');
            
		});

		//Create User Page Change Role Select Box
		$('#user_form_role_list #role_list').change(function(){
			changeenrollroleid=[];
			changeenrollroleid = $(this).val().slice();
			console.log(changeenrollroleid);
		});
		
		//Create User Page Change Group Select Box
		$('#user_form_group_list #group_list').change(function(){
			changeenrollgroupid=[];
			changeenrollgroupid = $(this).val().slice();
			console.log(changeenrollgroupid);
		});
			
		//Edit User Page Change Role Select Box
		$('#edit_user_form_role_list #edit_role_list').change(function(){
			changeenrollroleid=[];
			changeenrollroleid = $(this).val().slice();
			console.log(changeenrollroleid);
		});
		
		//Edit User Page Change Group Select Box
		$('#edit_user_form_group_list #edit_group_list').change(function(){
			changeenrollgroupid=[];
			changeenrollgroupid = $(this).val().slice();
			console.log(changeenrollgroupid);
		});
		
		//Create Role Page Change User Select Box
		$('#role_form_user_list #role_form_select_user_list').change(function(){
			changeenrolluserid=[];
			changeenrolluserid = $(this).val().slice();
			console.log(changeenrolluserid);
		});
		
		//Create Role Page Change Group Select Box
		$('#role_form_group_list #role_form_select_group_list').change(function(){
			changeenrollgroupid=[];
			changeenrollgroupid = $(this).val().slice();
			console.log(changeenrollgroupid);
		});
		
		//Create Role Page Change Service Permission Select Box
		$('#role_form_srvper_list #role_form_select_srvperm_list').change(function(){
			srvpertotal=[];
			srvpertotal = $(this).val().slice();
			console.log(srvpertotal);
		});
		
		//Edit Role Page Change User Select Box
		$('#edit_role_form_user_list #edit_role_form_select_user_list').change(function(){
			changeenrolluserid=[];
			changeenrolluserid = $(this).val().slice();
			console.log(changeenrolluserid);
		});
		
		//Edit Role Page Change Group Select Box
		$('#edit_role_form_group_list #edit_role_form_select_group_list').change(function(){
			changeenrollgroupid=[];
			changeenrollgroupid = $(this).val().slice();
			console.log(changeenrollgroupid);
		})
		
		//Edit Role Page Change Service Permission Select Box
		$('#edit_role_form_srvper_list #edit_role_form_select_srvperm_list').change(function(){
			srvpertotal=[];
			srvpertotal = $(this).val().slice();
			console.log(srvpertotal);
		});
		
		//Create Group Page Change User Select Box
		$('#group_form_user_list #group_form_select_user_list').change(function(){
			changeenrolluserid=[];
			changeenrolluserid = $(this).val().slice();
			console.log(changeenrolluserid);
		});
		
		//Create Group Page Change Role Select Box
		$('#group_form_role_list #group_form_select_role_list').change(function(){
			changeenrollroleid=[];
			changeenrollroleid = $(this).val().slice();
			console.log(changeenrollroleid);
		});
		
		//Edit Group Page Change User Select Box
		$('#edit_group_form_user_list #edit_grpuser_list').change(function(){
			changeenrolluserid=[];
			changeenrolluserid = $(this).val().slice();
			console.log(changeenrolluserid);
		});
		
		//Edit Group Page Change Role Select Box
		$('#edit_group_form_role_list #edit_grprole_list').change(function(){
			changeenrollroleid=[];
			changeenrollroleid = $(this).val().slice();
			console.log(changeenrollroleid);
		});
		
		//Role Resorce Permission Radio button Change Event		
		$('#roles_form input[name="srvradio"]').on('change', function() {
			if($('input[name="srvradio"]:checked').val() == 1){
				respermsrv=[];
				respermsrv.push("1");
				console.log(respermsrv);
			}
			else{
				respermsrv=[];
				respermsrv.push("2");
				console.log(respermsrv);
			}
		});
		$('#roles_form input[name="dsradio"]').on('change', function() {
			if($('input[name="dsradio"]:checked').val() == 1){
				respermds=[];
				respermds.push("1");
				console.log(respermds);
			}
			else{
				respermds=[];
				respermds.push("2");
				console.log(respermds);
			}
		});
		$('#roles_form input[name="kpiradio"]').on('change', function() {
			if($('input[name="kpiradio"]:checked').val() == 1){
				respermkpi=[];
				respermkpi.push("1");
				console.log(respermkpi);
			}
			else{
				respermkpi=[];
				respermkpi.push("2");
				console.log(respermkpi);
			}
		});
		
		$('#roles_form input[name="rptradio"]').on('change', function() {
			if($('input[name="rptradio"]:checked').val() == 1){
				respermrep=[];
				respermrep.push("1");
				console.log(respermrep);
			}
			else{
				respermrep=[];
				respermrep.push("2");
				console.log(respermrep);
			}
		});
		
		var radioState;
		$('#roles_form #inlineCheckboxadmv').on('click', function(e) {
            if (radioState === this) {
                this.checked = false;
                radioState = null;
                respermadm=[]
                console.log(respermadm);
            } else {
                radioState = this;
                respermadm.push("2");
                console.log(respermadm);
            }
        });
		
		//Edit Role Resorce Permission Radio button Change Event		
		$('#edit_roles_form input[name="edit_srvradio"]').on('change', function() {
			if($('input[name="edit_srvradio"]:checked').val() == 1){
				respermsrv=[];
				respermsrv.push("1");
				console.log(respermsrv);
			}
			else{
				respermsrv=[];
				respermsrv.push("2");
				console.log(respermsrv);
			}
		});
		$('#edit_roles_form input[name="edit_dsradio"]').on('change', function() {
			if($('input[name="edit_dsradio"]:checked').val() == 1){
				respermds=[];
				respermds.push("1");
				console.log(respermds);
			}
			else{
				respermds=[];
				respermds.push("2");
				console.log(respermds);
			}
		});
		$('#edit_roles_form input[name="edit_kpiradio"]').on('change', function() {
			if($('input[name="edit_kpiradio"]:checked').val() == 1){
				respermkpi=[];
				respermkpi.push("1");
				console.log(respermkpi);
			}
			else{
				respermkpi=[];
				respermkpi.push("2");
				console.log(respermkpi);
			}
		});
		
		$('#edit_roles_form input[name="edit_rptradio"]').on('change', function() {
			if($('input[name="edit_rptradio"]:checked').val() == 1){
				respermrep=[];
				respermrep.push("1");
				console.log(respermrep);
			}
			else{
				respermrep=[];
				respermrep.push("2");
				console.log(respermrep);
			}
		});
		
		var editradioState;
		$('#edit_roles_form #edit_inlineCheckboxadmv').on('click', function(e) {
            if (editradioState === this) {
                this.checked = false;
                editradioState = null;
                respermadm=[];
                console.log(respermadm);
            } else {
            	editradioState = this;
            	respermadm=[];
                respermadm.push("2");
                console.log(respermadm);
            }
        });
		
		function PopulateAllServiceBoxes(page,statusFilter, pattern){
			idList = [];
			$("#loader").attr('class', 'loader');
			if(statusFilter != undefined){
				if(statusFilter.length < 1){
					statusFilter = 10;
				}
			} else {
				statusFilter = 10;
			}
			$.get('/GetFilteredServices?page='+page+'&statusFilter='+statusFilter+'&spattern=' + pattern,function(responseJson) {
				if(listgridvalue == 0){
					$("#servicesboxes .col-md-12").remove();
				}
				else{
					$("#servicesboxes .col-md-3").remove();
				}
				//console.log("***"+page+",,,"+responseJson.length);
				if(page == 1 && responseJson.length != 12){
					$("#paginationdiv").css("display","none");
				}
				else{
					$("#paginationdiv").css("display","block");
				}
				if(responseJson!=null){
					$.each(responseJson, function(key,value){
						if(listgridvalue == 0){
							var divmain = $("<div></div>")
								.addClass("col-md-12");
							var divbox = $("<div></div>")
								.addClass("small-box bg-"+getServiceStatusColor(value["current_status"]))
								.css("margin-bottom","10px")
								.attr("id", value["service_instance_id"])
								.attr("data-tag",getServiceStatusValue(value["current_status"])).appendTo(divmain);
							var divinner = $("<div></div>").css("display","none")
								.addClass("inner").appendTo(divbox);
							var iconinnerdiv = $("<div></div>").attr("id","icondiv");
							var iconadiv = $("<div></div>").attr("id","icondiv").css("display","contents");
							//Add KPI Icon to Inner
							var spankpiinner = $("<span></span>").attr("id","kpiico").css("display","table-cell").css("float","right");
							spankpiinner.addClass("fa fa-bar-chart");
							spankpiinner.appendTo(iconinnerdiv);
							//Add Maintenance Icon
							if(value["hasMaintenance"]){
								var spanmaninner = $("<span></span>").attr("id","mainico").css("display","table-cell").css("padding-right","10px").css("float","right");
								var spanmaina = $("<span></span>").attr("id","mainico").css("display","table-cell").css("padding-right","10px").css("text-align","right").css("width","30px").css("max-width","30px");
								spanmaninner.addClass("fa fa-wrench");
								spanmaina.addClass("fa fa-wrench");
								spanmaninner.appendTo(iconinnerdiv);
								spanmaina.appendTo(iconadiv);
							}
							else{
								var spanmaninner = $("<span></span>").attr("id","mainico").text("").css("display","table-cell").css("padding-right","10px").css("float","right");
								var spanmaina = $("<span></span>").attr("id","mainico").text("").css("display","table-cell").css("padding-right","10px").css("text-align","right").css("width","30px").css("max-width","30px");
								spanmaninner.appendTo(iconinnerdiv);
								spanmaina.appendTo(iconadiv);
							}
							//Add KPI Icon to a link
							var spankpia = $("<span></span>").attr("id","kpiico").css("display","table-cell").css("padding-right","10px").css("text-align","right").css("width","30px").css("max-width","30px");
							spankpia.addClass("fa fa-bar-chart");
							spankpia.appendTo(iconadiv);
							
							iconinnerdiv.appendTo(divinner);

							var h = $("<h3></h3>").appendTo(divinner);
							var ametric = 100;
							if(value["availability_metric"] != undefined)
								ametric = value["availability_metric"];
							h.text(ametric + '%');
							idList[idList.length] = value["service_instance_id"];
							$("<p></p>").text(value["service_instance_displayname"]).appendTo(divinner);
							var a = $("<a></a>")
								.text("")
								.css("padding","0px")
								.css("width","100%")
								.css("display","table")
								.attr("id","contenta")
								.attr("href","#")
								.attr("serviceid",value["service_instance_id"])
								.attr("servicename",value["service_instance_name"])
								.addClass("small-box-footer");
							a.appendTo(divbox);
							var h3 = $("<h3></h3>").text(ametric + '%').css("display","table-cell").css("padding-left","10px").css("text-align","left").css("width","100px").css("max-width","100px").appendTo(a);
							var p = $("<p></p>").text(value["service_instance_name"]).css("display","table-cell").css("text-align","left").appendTo(a);
							iconadiv.appendTo(a);
							divmain.appendTo($("#servicesboxes"));
						}
						else{
							var divmain = $("<div></div>")
								.addClass("col-md-3");
							var divbox = $("<div></div>")
								.addClass("small-box bg-"+getServiceStatusColor(value["current_status"]))
								.attr("id", value["service_instance_id"])
								.attr("data-tag",getServiceStatusValue(value["current_status"])).appendTo(divmain);
							var divinner = $("<div></div>")
								.addClass("inner").appendTo(divbox);
							var icondiv = $("<div></div>").attr("id","icondiv");
							
							//Add KPI Icon
							var kpip = $("<span></span>").attr("id","kpiico").css("display","table-cell").css("float","right");
							kpip.addClass("fa fa-bar-chart");
							kpip.appendTo(icondiv);
							
							//Add Maintenance Icon
							if(value["hasMaintenance"]){						
								var p = $("<span></span>").attr("id","mainico").text("").css("display","table-cell").css("float","right").css("padding-right","10px");
								p.addClass("fa fa-wrench");
								p.appendTo(icondiv);
							}
							else{
								var p = $("<span></span>").attr("id","mainico").text("").css("display","table-cell").css("float","right").css("padding-right","10px");
								p.appendTo(icondiv);
								
							}
							
							icondiv.appendTo(divinner);							
							var h = $("<h3></h3>").appendTo(divinner);
							var ametric = 100;
							if(value["availability_metric"] != undefined)
								ametric = value["availability_metric"];
							h.text(ametric + '%');
							idList[idList.length] = value["service_instance_id"];
							
							//var s = $("<span></span>").text("%").appendTo(h);
							$("<p></p>").text(value["service_instance_displayname"]).appendTo(divinner);
							var a = $("<a></a>")
								.text("Go to Topology")
								.attr("id","contenta")
								.attr("href","#")
								.attr("serviceid",value["service_instance_id"])
								.attr("servicename",value["service_instance_name"])
								.addClass("small-box-footer");
							a.appendTo(divbox);
							$("<i></i>").addClass("fa fa-arrow-circle-right").appendTo(a);
							divmain.appendTo($("#servicesboxes"));
						}
					});
					console.log("IDLIST:"+idList);
					$("#loader").attr('class', 'loader collapse');
					//get all availability metrics of the loaded service list
					availabilityInterval = setInterval( function () {
						if(!wheelPaging) {
							console.log("/Chart?p=getAvailabilityMetricList&sidlist=" + idList + "&queryType=TODAY");
							console.log(idList);
							$.ajax({
								cache: false,
								url:'/Chart?p=getAvailabilityMetricList&sidlist=' + idList + '&queryType=TODAY',
								success:function(data) {
									dashMetric = JSON.parse(data);
									for(var i=0; i<dashMetric.length; i++)
									{
										for(var key in dashMetric[i])
										{
											var ms = dashMetric[i][key].split(':');
											$("#servicesboxes #" + key + " h3").text(ms[0] + '%');
											// console.log($("#servicesboxes #" + key).attr("data-tag") + " * " + ms[1]);
											$("#servicesboxes #" + key).removeClass();
											$("#servicesboxes #" + key).addClass("small-box bg-"+getServiceStatusColor(ms[1]));
											$("#servicesboxes #" + key).attr("data-tag", getServiceStatusValue(ms[1]));
										}
									}
								}
							});
						}
					}, 180000 );
				}
			});
		}
		outerPopulateAllServiceBoxes = PopulateAllServiceBoxes;
		
		function PopulateServicesCategoryCount(){
			$.get('/PopulateServicesCategoryCount?spattern=' + spattern, function(responseJson) {
				$("#checkboxdiv .btn-success .badge").text(responseJson[0]);
				$("#checkboxdiv .btn-warning .badge").text(responseJson[1]);
				$("#checkboxdiv .btn-danger .badge").text(responseJson[2]);
				$('#checkboxdiv .btn-group label').each(function(e){
		    		   indexVal = jQuery.inArray(getServiceStatusNumber($(this).find("input").val()), statusFilter)
		    		   if(indexVal != -1){
		    			   $(this).addClass("active");
		    		   }
		    	});
			});
		}
		outerPopulateServicesCategoryCount = PopulateServicesCategoryCount;
		
		/*function PopulateSearchServicesCategoryCount(){
			//console.log("Populate Search Category Count");
			//console.log(srvidListTotal);
			if(srvidListTotal.length>0){
				$.get('PopulateSearchServicesCategoryCount?srvidlist='+srvidListTotal, function(responseJson) {
					$("#checkboxdiv .btn-success .badge").text(responseJson[0]);
					$("#checkboxdiv .btn-warning .badge").text(responseJson[1]);
					$("#checkboxdiv .btn-danger .badge").text(responseJson[2]);
					$('#checkboxdiv .btn-group label').each(function(e){
			    		   indexVal = jQuery.inArray(getServiceStatusNumber($(this).find("input").val()), statusFilter)
			    		   if(indexVal != -1){
			    			   $(this).addClass("active");
			    		   }		    		   
			    	});
					outerSearchPaginate(statusFilter);
				});
			}
			else{
				$("#checkboxdiv .btn-success .badge").text("0");
				$("#checkboxdiv .btn-warning .badge").text("0");
				$("#checkboxdiv .btn-danger .badge").text("0");
				$('#checkboxdiv .btn-group label').each(function(e){
		    		   indexVal = jQuery.inArray(getServiceStatusNumber($(this).find("input").val()), statusFilter)
		    		   if(indexVal != -1){
		    			   $(this).addClass("active");
		    		   }		    		   
		    	});
				outerSearchPaginate(statusFilter);
			}
		}*/
		
		//outerPopulateSearchServicesCategoryCount=PopulateSearchServicesCategoryCount;
		/*
		$("#searchboxes").on('click', '#contenta', function (){
			var sid = $(this).attr('serviceid');
			var sname = $(this).attr('servicename');
			//console.log("SID:"+sid+" ,servicename:"+sname);
			window.location.href ="ServiceViewer.jsp?sid="+sid+"&statusFilter="+statusFilter+"&msbval="+minisideval+"&lgval="+listgridvalue;
			//getServiceTreeData($(this).attr('serviceid'));
			//$('#contentpage').load('demo_test.txt');
			// $('#contentpage').load('testtree.jsp');
		});*/
		
		$( "#servicesboxes" ).on('click', 'a', function (){
			var sid = $(this).attr('serviceid');
			var sname = $(this).attr('servicename');
			window.location.href ="ServiceViewer.jsp?sid="+sid+"&page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval+"&lgval="+listgridvalue+"&spattern="+spattern;
			//getServiceTreeData($(this).attr('serviceid'));
			//$('#contentpage').load('demo_test.txt');
			// $('#contentpage').load('testtree.jsp');
		});

		$('#checkboxdiv .btn-group .btn').click(function () {
			   var category = $(this).find("input").val();
		       console.log($(this).find("input").val()+"******"+getServiceStatusNumber($(this).find("input").val()));
		       if (!$(this).hasClass('active')) {
		    	   statusFilter.push(getServiceStatusNumber($(this).find("input").val()));
		    	   console.log("statusfilter:"+statusFilter)
		    	   /*$('#servicesboxes .col-md-3').each(function(e){
		    		   console.log($(this).find(".small-box").attr("data-tag"));
		    		   if(category == $(this).find(".small-box").attr("data-tag"))
		    			   $(this).show();
		    	   });*/
		    	   if(statusFilter.length > 0){
		    		   ChangeUrl('Business Service View', $(location).attr('origin')+'/index.jsp?page=' + srvBoxPageNumber+'&statusFilter='+statusFilter+'&spattern=' + spattern);
			    	   Paginate(statusFilter,spattern);
			           $('#pagination_servicesboxes').twbsPagination('show', 1);
		    		   PopulateAllServiceBoxes(srvBoxPageNumber,statusFilter,spattern);
		    		   console.log("45678");
		    	   }
		    	   else{
		    		   ChangeUrl('Business Service View', $(location).attr('origin')+'/index.jsp?page=' + srvBoxPageNumber+'&statusFilter='+10+'&spattern=' + spattern);
		    		   Paginate(statusFilter,spattern);
		    		   $('#pagination_servicesboxes').twbsPagination('show', 1);
		    		   PopulateAllServiceBoxes(srvBoxPageNumber,[10],spattern);
		    		   console.log("875443");	    		   
		    	   }
		       }
		       else{
		    	   var index = statusFilter.indexOf(getServiceStatusNumber($(this).find("input").val()));
		    	   console.log("Index:"+index)
		    	   if (index > -1) {
		    		   statusFilter.splice(index, 1);
		    	   }
		    	   console.log("statusfilter:"+statusFilter)
				   /*$('#servicesboxes .col-md-3').each(function(e){
					   console.log($(this).find(".small-box").attr("data-tag"));
					   if(category == $(this).find(".small-box").attr("data-tag"))
						   $(this).hide();
				   });*/  
		    	   console.log("Length:"+statusFilter.length);
		    	   if(statusFilter.length > 0){
		    		   ChangeUrl('Business Service View', $(location).attr('origin')+'/index.jsp?page=' + srvBoxPageNumber+'&statusFilter='+statusFilter+'&spattern=' + spattern);
		    		   Paginate(statusFilter,spattern);
		    		   $('#pagination_servicesboxes').twbsPagination('show', 1);
		    		   PopulateAllServiceBoxes(srvBoxPageNumber,statusFilter,spattern);
		    	   }
		    	   else{
		    		   ChangeUrl('Business Service View', $(location).attr('origin')+'/index.jsp?page=' + srvBoxPageNumber+'&statusFilter='+10+'&spattern=' + spattern);
		    		   Paginate(statusFilter,spattern);
		    		   $('#pagination_servicesboxes').twbsPagination('show', 1);
		    		   PopulateAllServiceBoxes(srvBoxPageNumber,[10],spattern);
		       
		    	   }
		       }
		});
		
		//Back Services Button Click
		$("#contentpage .btn-group.row").click(function(){
			$("#contentheader .panel-heading").text('Dashboards > Business Services');
			if($("#submenu-1 #dash1 .fa").hasClass("faimagecolor")){
				$("#servicesboxes .col-md-3").remove();
				//console.log("srvpagenumber:"+srvBoxPageNumber);			
				//window.location.href ="/index.jsp?page="+srvBoxPageNumber+"&statusFilter="+statusFilter;
				//PopulateServicesCategoryCount();
				//PopulateAllServiceBoxes(srvBoxPageNumber,statusFilter);
            };
            window.location.href ="/index.jsp?page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval+"&lgval="+listgridvalue+"&spattern="+spattern;
            /*if(!$("#submenu-1").hasClass("collapse in")){
    			$("#mainmenu1 a").trigger("click");
    			$("#submenu-1 #dash1").trigger("focus");
            };
            if(!$("#submenu-1 #dash1").hasClass("faimagecolor")){
            	$("#submenu-1 #dash1").trigger("focus");
            };*/
            $("#loader").attr('class', '');
            $("#servicesboxes").attr('class', 'row');
            $("#checkboxdiv").attr('class', 'well well-sm text-center'); 
            $("#paginationdiv").attr('class', 'row');
            if(!$("#rightsidebar").hasClass("collapse")){
            	closeRSB();
            	clearRSB();
            };
		});
		
		
		//Data Source Form Validation
		$('#ds_form').bootstrapValidator({
	        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
	        feedbackIcons: {
	            valid: 'fa fa-check',
	            invalid: 'fa fa-times',
	            validating: 'fa fa-refresh'
	        },
	        fields: {
	            ds_name: {
	                validators: {
	                        stringLength: {
	                        min: 2,
	                    },
	                        notEmpty: {
	                        message: 'Please supply datasource name'
	                    }
	                }
	            },
	            hostname: {
	                validators: {
	                     stringLength: {
	                        min: 2,
	                    },
	                    notEmpty: {
	                        message: 'Please supply datasource hostname'
	                    }
	                }
	            },
				port: {
	                validators: {
	                     between: {
	                        min: 1024 ,
							max:65535 ,
							message: 'Please supply correct port number'
	                    },
	                    notEmpty: {
	                        message: 'Please supply datasource port'
	                    }
	                }
	            },
	            db_name: {
	                validators: {
	                     stringLength: {
	                        min: 2,
	                    },
	                    notEmpty: {
	                        message: 'Please supply database name'
	                    }
	                }
	            },
	            username: {
	                validators: {
	                     stringLength: {
	                        min: 3,
	                    },
	                    notEmpty: {
	                        message: 'Please supply database username'
	                    }
	                }
	            },
	            type: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please select Datasource Type'
	                    }
	                }
	            },
				password:{
					validators:{
	                     stringLength: {
	                        min: 6,
							message: 'Please supply min 6 character database password'
	                    },
	                    notEmpty: {
	                        message: 'Please supply database password'
	                    }					
					
					}
				}
	            }
	        })
	        .on('success.form.bv', function(e) {
	        	dsDefFunc();
	            //$('#ds_form #success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
	            //console.log(data);
				

	            //Prevent form submission
	            e.preventDefault();

	            //Get the form instance
	            var $form = $(e.target),
	            validator = $form.data('bootstrapValidator');
	            //console.log("Data: " + $form.serialize());
                

	            // Get the BootstrapValidator instance
	            //var bv = $form.data('bootstrapValidator');
				//console.log(bv);
				//$('#ds_form').toggle('500');
	            // Use Ajax to submit form data
	            //$.post($form.attr('action'), $form.serialize(), function(result) {
	            //    console.log(result);
	            //}, 'json');
	            
	            //$('#ds_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow");
	            //$('#ds_form').bootstrapValidator('resetField', 'type');
	            //$('#ds_form').bootstrapValidator('resetForm', true);
	            
	            $form
                .bootstrapValidator('disableSubmitButtons', false)  // Enable the submit buttons
                .bootstrapValidator('resetForm', true);             // Reset the form
	        });
		
		
		//KPI Form Validation
	    $('#kpi_form').bootstrapValidator({
	        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
	        feedbackIcons: {
	            valid: 'fa fa-check',
	            invalid: 'fa fa-remove',
	            validating: 'fa fa-refresh'
	        },
	        fields: {
	            kpi_name: {
	                validators: {
	                        stringLength: {
	                        min: 2,
	                    },
	                        notEmpty: {
	                        message: 'Please supply kpi name'
	                    }
	                }
	            },
	            ds_list: {
					validators: {
	                    notEmpty: {
	                        message: 'Please supply datasource'
	                    }
					}
	            },
				kpi_query: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply kpi query',
	                    }
	                }
	            },
	            "cron-period": {
	            	validators: {
	                    notEmpty: {
	                        message: 'Please select a valid cron expression'
	                    }
	                }
	            },
	            /*timeunit: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply time unit'
	                    }
	                }
	            },
	            interval: {
	                validators: {
	                	integer: {
                            message: 'The value is not an integer',
                            // The default separators
                            thousandsSeparator: '',
                            decimalSeparator: '.'
                        },
	                    notEmpty: {
	                        message: 'Please supply interval'
	                    }
	                }
	            },*/
	            thresholdmarginal: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply Threshold Marginal rule'
	                    }
	                }
	            },
	            thresholdbad: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply Threshold Bad rule'
	                    }
	                }
	            }
			}
	        })
	        .on('success.form.bv', function(e) {
	        	kpiDefFunc();
	            //$('#kpi_form #success_message').slideDown({ opacity: "show" }, "slow"); // Do something ...
	           
	            //Prevent form submission
	            e.preventDefault();

	            //Get the form instance
	            var $form = $(e.target);
	            //console.log("Data: " + $form.serialize());

	            // Get the BootstrapValidator instance
	            //var bv = $form.data('bootstrapValidator');

	            // Use Ajax to submit form data
	            /*$.post($form.attr('action'), $form.serialize(), function(result) {
	                console.log(result);
	            }, 'json');*/
	            //$('#kpi_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow");
	            $('#kpi_form').bootstrapValidator('resetForm', true);
	            $("#keypi_form #run_query").attr('disabled','true');
	        });
	    
	    //Administrator User Form Validation
	    $('#users_form').bootstrapValidator({
	        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
	        feedbackIcons: {
	            valid: 'fa fa-check',
	            invalid: 'fa fa-remove',
	            validating: 'fa fa-refresh'
	        },
	        fields: {
	        	user_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply username'
	                    }
	                }
	            },
	            first_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply firstname'
	                    }
	                }
	            },
	        	last_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply lastname'
	                    }
	                }
	            },
	            user_password: {
	            	validators:{
	                     stringLength: {
	                        min: 6,
							message: 'Please supply min 6 character password'
	                    },
	                    notEmpty: {
	                        message: 'Please supply new password'
	                    }					
					
					}
	            },
	            user_repassword: {
	            	validators:{
	                     stringLength: {
	                        min: 6,
							message: 'Please supply min 6 character password'
	                    },
	                    notEmpty: {
	                        message: 'Please supply confirmation password'
	                    },
	                    identical: {
	                        field: 'user_password',
	                        message: 'The password and its confirm are not the same'
	                    }
					}
	            }
	            
	        }
	    	}).on('success.form.bv', function(e) {
	    		var userid = -1;
	    		var username = $("#users_form #user_name").val();
	    		var firstname = $("#users_form #first_name").val();
	    		var lastname = $("#users_form #last_name").val();
	    		var password = $("#users_form #user_password").val();
	    		$("#loader").attr('class', 'loader');
	    		$.ajax({
	    			cache: false,
	    			url:"/Users?p=addUser",
	    			data:{username:username,firstname:firstname,lastname:lastname,pass:password},
	    			success:function(data) {
	    				$("#loader").attr('class', 'loader collapse');
	    				//$('#users_form #success_message').slideDown({ opacity: "show" }, "slow");
	    				//$('#users_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow");
	    				var jData = JSON.parse(data);
    					$("#loader").attr('class', 'loader');
    					$.ajax({
	    					cache: false,
	    					url:'/Users?p=getUserAfterInsert',
	    					data:{username:username,firstname:firstname,lastname:lastname},
	    					success:function(data) {
	    						jsondata = JSON.parse(data);
	    						$("#loader").attr('class', 'loader collapse');
	    						userid = jsondata.userid;
	    						console.log("ADD USER USERID:"+userid);
	    						
	    	    				if(!compareArrays(enrollroleid.map(function(e){return e.toString()}),changeenrollroleid)){
	    	    					console.log("Call update user roles!!!!");
	    		    				$("#loader").attr('class', 'loader');
	    				    	    $.ajax({
	    				    	    	cache: false,
	    				    	    	url:'/Users?p=updateUserRoles&userid='+userid+'&roleList='+changeenrollroleid,
	    				    			success:function(data) {
	    				    				$("#loader").attr('class', 'loader collapse');
	    				    			}
	    				    		});	    					
	    	    				}
	    	    				if(!compareArrays(enrollgroupid.map(function(e){return e.toString()}),changeenrollgroupid)){
	    	    					console.log("Call update user groups!!!!");
	    		    				$("#loader").attr('class', 'loader');
	    				    	    $.ajax({
	    				    	    	cache: false,
	    				    	    	url:'/Users?p=updateUserGroups&userid='+userid+'&groupList='+changeenrollgroupid,
	    				    			success:function(data) {
	    				    				$("#loader").attr('class', 'loader collapse');
	    				    			}
	    				    		});   					
	    	    				}	    						
	    					}
	    				});
	    				

	    				var attrusr = $("#users_form #existingusers tbody tr").attr('data-userid');
	    	            if (typeof attrusr !== typeof undefined && attrusr !== false) {
	    	            	$("#users_form #existingusers tbody tr[data-userid]").remove();
	    	            	//$('#kpi_form').bootstrapValidator('resetForm', true);
	    	            }
	    	            $("#loader").attr('class', 'loader');
	    	            $.ajax({
	    					cache: false,
	    					url:'/Users?p=getAllUsers',
	    					success:function(data) {
	    						 $("#loader").attr('class', 'loader collapse');
	    						showUserList(data);
	    					}
	    				});
	    	            if(jData.state != undefined){
	    					if(jData.state == "SUCCESS"){
	    						$("#saveModal").attr("data-form_name","adduser");
	    						$("#saveModal .modal-body p").text(jData.message + " !!!");
	    						$("#saveModal").modal("show");
	    					}
	    					else{
	    						$("#saveModal").attr("data-form_name","adduser");
	    						$("#saveModal .modal-body p").text(jData.message + " !!!");
	    						$("#saveModal").modal("show");
	    					}
	    				}
	    			}
	    		});

	            //Prevent form submission
	            e.preventDefault();

	            //Get the form instance
	            var $form = $(e.target);
	            //console.log("Data: " + $form.serialize());

	            // Get the BootstrapValidator instance
	            //var bv = $form.data('bootstrapValidator');
				//console.log(bv);
				//$('#ds_form').toggle('500');
	            // Use Ajax to submit form data
	            //$.post($form.attr('action'), $form.serialize(), function(result) {
	            //    console.log(result);
	            //}, 'json');
	            
	            //$('#users_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow");
	            $('#users_form').bootstrapValidator('resetForm', true);
	        
	    });
	    
		//Administrator Last Edit User Form Validation
	    $('#edit_users_form').bootstrapValidator({
	        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
	        feedbackIcons: {
	            valid: 'fa fa-check',
	            invalid: 'fa fa-remove',
	            validating: 'fa fa-refresh'
	        },
	        fields: {
	        	edit_user_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply username'
	                    }
	                }
	            },
	            edit_first_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply firstname'
	                    }
	                }
	            },
	        	edit_last_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply lastname'
	                    }
	                }
	            },
	            edit_user_password: {
	            	validators:{
	                     stringLength: {
	                        min: 6,
							message: 'Please supply min 6 character password'
	                    },
	                    notEmpty: {
	                        message: 'Please supply new password'
	                    }					
					
					}
	            },
	            edit_user_repassword: {
	            	validators:{
	                     stringLength: {
	                        min: 6,
							message: 'Please supply min 6 character password'
	                    },
	                    notEmpty: {
	                        message: 'Please supply confirmation password'
	                    },
	                    identical: {
	                        field: 'user_password',
	                        message: 'The password and its confirm are not the same'
	                    }
					}
	            }
	            
	        }
	    	}).on('success.form.bv', function(e) {
	    		$("#loader").attr('class', 'loader');
	    		$.ajax({
	    			cache: false,
	    			url:"/Users?p=updateUser",
	    			data:{userid:$("#edit_users_form").attr("data-userid"),username:$("#edit_users_form #edit_user_name").val(),firstname:$("#edit_users_form #edit_first_name").val(),lastname:$("#edit_users_form #edit_last_name").val(),pass:$("#edit_users_form #edit_user_password").val()},
	    			success:function(data) {
	    				$("#loader").attr('class', 'loader collapse');
	    				var jData = JSON.parse(data);
	    				//$('#edit_users_form #success_message').slideDown({ opacity: "show" }, "slow");
	    				//$('#edit_users_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow");
	    				
	    				var edtuserid = $("#edit_users_form").attr("data-userid");
						$("#loader").attr('class', 'loader');
						$.ajax({
							cache: false,
							url:'/Users?p=getUser&userid=' + parseInt(edtuserid),
							success:function(data){
								$("#loader").attr('class', 'loader collapse');
								jsondata = JSON.parse(data);
								$("#edit_users_form legend span").text(jsondata.username);
								$("#edit_users_form #edit_user_name").val(jsondata.username);			
								$("#edit_users_form #edit_first_name").val(jsondata.firstName);
								$("#edit_users_form #edit_last_name").val(jsondata.lastName);
								$("#edit_users_form #edit_user_password").val(jsondata.password);	
								$("#edit_users_form #edit_user_repassword").val(jsondata.password);
															
								if(!compareArrays(enrollroleid.map(function(e){return e.toString()}),changeenrollroleid)){
									console.log("Call update user roles!!!!");
									$("#loader").attr('class', 'loader');
									$.ajax({
										cache: false,
										url:'/Users?p=updateUserRoles&userid='+$("#edit_users_form").attr("data-userid")+'&roleList='+changeenrollroleid,
										success:function(data) {
											 $("#loader").attr('class', 'loader collapse');
											 if(!compareArrays(enrollgroupid.map(function(e){return e.toString()}),changeenrollgroupid)){
												console.log("Call update user groups!!!!");
												$("#loader").attr('class', 'loader');
												$.ajax({
													cache: false,
													url:'/Users?p=updateUserGroups&userid='+$("#edit_users_form").attr("data-userid")+'&groupList='+changeenrollgroupid,
													success:function(data) {
														$("#loader").attr('class', 'loader collapse');
														var attrusr = $("#users_form #existingusers tbody tr").attr('data-userid');
														if (typeof attrusr !== typeof undefined && attrusr !== false) {
															$("#users_form #existingusers tbody tr[data-userid]").remove();
															//$('#kpi_form').bootstrapValidator('resetForm', true);
														}
														$("#loader").attr('class', 'loader');
														$.ajax({
															cache: false,
															url:'/Users?p=getAllUsers',
															success:function(data) {
																$("#loader").attr('class', 'loader collapse');
																showUserList(data);
														        if(jData.state != undefined){
											    					if(jData.state == "SUCCESS"){
											    						$("#saveModal").attr("data-form_name","edituser");
											    						$("#saveModal .modal-body p").text(jData.message + " !!!");
											    						$("#saveModal").modal("show");
											    					}
											    					else{
											    						$("#saveModal").attr("data-form_name","edituser");
											    						$("#saveModal .modal-body p").text(jData.message + " !!!");
											    						$("#saveModal").modal("show");
											    					}
											    				}
															}
														});
													}
												});	    					
											}
											 else{
												$("#saveModal").attr("data-form_name","edituser");
						    					$("#saveModal .modal-body p").text(jData.message + " !!!");
						    					$("#saveModal").modal("show");
											 }
										}
									});	    					
								}
								else{
									if(!compareArrays(enrollgroupid.map(function(e){return e.toString()}),changeenrollgroupid)){
										console.log("Call update user groups!!!!");
										$("#loader").attr('class', 'loader');
										$.ajax({
											cache: false,
											url:'/Users?p=updateUserGroups&userid='+$("#edit_users_form").attr("data-userid")+'&groupList='+changeenrollgroupid,
											success:function(data) {
												$("#loader").attr('class', 'loader collapse');
												var attrusr = $("#users_form #existingusers tbody tr").attr('data-userid');
												if (typeof attrusr !== typeof undefined && attrusr !== false) {
													$("#users_form #existingusers tbody tr[data-userid]").remove();
													//$('#kpi_form').bootstrapValidator('resetForm', true);
												}
												$("#loader").attr('class', 'loader');
												$.ajax({
													cache: false,
													url:'/Users?p=getAllUsers',
													success:function(data) {
														$("#loader").attr('class', 'loader collapse');
														showUserList(data);
														if(jData.state != undefined){
															if(jData.state == "SUCCESS"){
																$("#saveModal").attr("data-form_name","edituser");
										    					$("#saveModal .modal-body p").text(jData.message + " !!!");
										    					$("#saveModal").modal("show");
										    				}
										    				else{
										    					$("#saveModal").attr("data-form_name","edituser");
										    					$("#saveModal .modal-body p").text(jData.message + " !!!");
										    					$("#saveModal").modal("show");
										    				}
										    			}
													}
												});
											}
										});	    					
									}
									else{
										var attrusr = $("#users_form #existingusers tbody tr").attr('data-userid');
										if (typeof attrusr !== typeof undefined && attrusr !== false) {
											$("#users_form #existingusers tbody tr[data-userid]").remove();
										}
										$("#loader").attr('class', 'loader');
										$.ajax({
											cache: false,
											url:'/Users?p=getAllUsers',
											success:function(data) {
												$("#loader").attr('class', 'loader collapse');
												showUserList(data);
												if(jData.state != undefined){
													if(jData.state == "SUCCESS"){
														$("#saveModal").attr("data-form_name","edituser");
								    					$("#saveModal .modal-body p").text(jData.message + " !!!");
								    					$("#saveModal").modal("show");
								    				}
								    				else{
								    					$("#saveModal").attr("data-form_name","edituser");
								    					$("#saveModal .modal-body p").text(jData.message + " !!!");
								    					$("#saveModal").modal("show");
								    				}
								    			}
											}
										});
									}
								}
							}
						});
	    			}
	    		});

	            //Prevent form submission
	            e.preventDefault();

	            //Get the form instance
	            var $form = $(e.target);
	            console.log("Data: " + $form.serialize());

	            // Get the BootstrapValidator instance
	            //var bv = $form.data('bootstrapValidator');
				//console.log(bv);
				//$('#ds_form').toggle('500');
	            // Use Ajax to submit form data
	            //$.post($form.attr('action'), $form.serialize(), function(result) {
	            //    console.log(result);
	            //}, 'json');
	            
	            //$('#edit_users_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow")
	            $('#edit_users_form').bootstrapValidator('resetForm', true);
	        
	    });
	    
		//Administrator Edit User Form Validation
	    /*$('#edit_users_form').bootstrapValidator({
	        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
	        feedbackIcons: {
	            valid: 'fa fa-check',
	            invalid: 'fa fa-remove',
	            validating: 'fa fa-refresh'
	        },
	        fields: {
	        	edit_user_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply username'
	                    }
	                }
	            },
	            edit_first_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply firstname'
	                    }
	                }
	            },
	        	edit_last_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply lastname'
	                    }
	                }
	            },
	            edit_user_password: {
	            	validators:{
	                     stringLength: {
	                        min: 6,
							message: 'Please supply min 6 character password'
	                    },
	                    notEmpty: {
	                        message: 'Please supply new password'
	                    }					
					
					}
	            },
	            edit_user_repassword: {
	            	validators:{
	                     stringLength: {
	                        min: 6,
							message: 'Please supply min 6 character password'
	                    },
	                    notEmpty: {
	                        message: 'Please supply confirmation password'
	                    },
	                    identical: {
	                        field: 'user_password',
	                        message: 'The password and its confirm are not the same'
	                    }
					}
	            }
	            
	        }
	    	}).on('success.form.bv', function(e) {
	    		$("#loader").attr('class', 'loader');
	    		$.ajax({
	    			cache: false,
	    			url:"/Users?p=updateUser",
	    			data:{userid:$("#edit_users_form").attr("data-userid"),username:$("#edit_users_form #edit_user_name").val(),firstname:$("#edit_users_form #edit_first_name").val(),lastname:$("#edit_users_form #edit_last_name").val(),pass:$("#edit_users_form #edit_user_password").val()},
	    			success:function(data) {
	    				$("#loader").attr('class', 'loader collapse');
	    				$('#edit_users_form #success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
	    				$('#edit_users_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow")
	    				$("#loader").attr('class', 'loader');
	    				setEditUserFormValue($("#edit_users_form").attr("data-userid"));
	    				
	    				if(!compareArrays(enrollroleid.map(function(e){return e.toString()}),changeenrollroleid)){
	    					console.log("Call update user roles!!!!");
	    					$("#loader").attr('class', 'loader');
		    	            $.ajax({
		    					cache: false,
		    					url:'/Users?p=updateUserRoles&userid='+$("#edit_users_form").attr("data-userid")+'&roleList='+changeenrollroleid,
		    					success:function(data) {
		    						 $("#loader").attr('class', 'loader collapse');
		    					}
		    				});	    					
	    				}
	    				
	    				if(!compareArrays(enrollgroupid.map(function(e){return e.toString()}),changeenrollgroupid)){
	    					console.log("Call update user groups!!!!");
	    					$("#loader").attr('class', 'loader');
		    	            $.ajax({
		    					cache: false,
		    					url:'/Users?p=updateUserGroups&userid='+$("#edit_users_form").attr("data-userid")+'&groupList='+changeenrollgroupid,
		    					success:function(data) {
		    						 $("#loader").attr('class', 'loader collapse');
		    					}
		    				});	    					
	    				}
	    				
	    				var attrusr = $("#users_form #existingusers tbody tr").attr('data-userid');
	    	            if (typeof attrusr !== typeof undefined && attrusr !== false) {
	    	            	$("#users_form #existingusers tbody tr[data-userid]").remove();
	    	            	//$('#kpi_form').bootstrapValidator('resetForm', true);
	    	            }
	    	            $("#loader").attr('class', 'loader');
	    	            $.ajax({
	    					cache: false,
	    					url:'/Users?p=getAllUsers',
	    					success:function(data) {
	    						showUserList(data);
	    					}
	    				});
	    	            $("#loader").attr('class', 'loader collapse');
	    			}
	    		});

	            //Prevent form submission
	            e.preventDefault();

	            //Get the form instance
	            var $form = $(e.target);
	            console.log("Data: " + $form.serialize());

	            // Get the BootstrapValidator instance
	            //var bv = $form.data('bootstrapValidator');
				//console.log(bv);
				//$('#ds_form').toggle('500');
	            // Use Ajax to submit form data
	            //$.post($form.attr('action'), $form.serialize(), function(result) {
	            //    console.log(result);
	            //}, 'json');
	            
	            $('#edit_users_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow")
	            $('#edit_users_form').bootstrapValidator('resetForm', true);
	        
	    });*/
	    
	    //Administrator Role Form Validation
	    $('#roles_form').bootstrapValidator({
	        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
	        feedbackIcons: {
	            valid: 'fa fa-check',
	            invalid: 'fa fa-remove',
	            validating: 'fa fa-refresh'
	        },
	        fields: {
	        	role_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply role name'
	                    }
	                }
	            }
	            
	        }
	    	}).on('success.form.bv', function(e) {
				var roleid=-1;
	    		var rolename = $("#roles_form #role_name").val();
	    		$("#loader").attr('class', 'loader');
				setResourcePermission();
				console.log(respertotal);
				$.ajax({
					cache: false,
					url:'/Report?p=getMainServiceCount',
					success:function(data) {
						$("#loader").attr('class', 'loader collapse');
						console.log(respertotal);
						jsondata = JSON.parse(data);
						var countvalue = jsondata.count;
						console.log(countvalue);
						var srvpermlength = srvpertotal.length;
						if(countvalue == srvpermlength)
							srvpertotal = ["0"];
						console.log("Userlist:"+changeenrolluserid);
						console.log("GroupList:"+changeenrollgroupid);
						console.log("ResourceList:"+respertotal);
						console.log("ServiceList:"+srvpertotal);
						console.log("ServiceListLength:"+srvpertotal.length);
						$("#loader").attr('class', 'loader');
			    		$.ajax({
			    			cache: false,
			    			url:"/Roles?p=createNewRole&role_name="+rolename+"&srvPermList="+srvpertotal+"&resPermList="+respertotal,
			    			success:function(data) {
			    				$("#loader").attr('class', 'loader collapse');
			    				var jData = JSON.parse(data);
			    				//$('#roles_form #success_message').slideDown({ opacity: "show" }, "slow");
			    				//$('#roles_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow");
			    				console.log("url"+"/Roles?p=createNewRole&role_name="+rolename+"&srvPermList="+srvpertotal+"&resPermList="+respertotal);
		    					$("#loader").attr('class', 'loader');
		    					$.ajax({
			    					cache: false,
			    					url:'/Roles?p=getRoleAfterInsert',
			    					data:{role_name:rolename},
			    					success:function(data) {
			    						jsondata = JSON.parse(data);
			    						$("#loader").attr('class', 'loader collapse');
			    						roleid = jsondata.role_id;
										$("#loader").attr('class', 'loader');
										$.ajax({
		    				    	    	cache: false,
		    				    	    	url:'/Roles?p=updateRoleMembers&role_id='+roleid+'&userList='+changeenrolluserid+'&groupList='+changeenrollgroupid,
		    				    			success:function(data) {
		    				    				$("#loader").attr('class', 'loader collapse');
		    				    				var attrrole = $("#roles_form #existingroles tbody tr").attr('data-roleid');
		    				    	            if (typeof attrrole !== typeof undefined && attrrole !== false) {
		    				    	            	$("#roles_form #existingroles tbody tr[data-roleid]").remove();
		    				    	            }
		    				    	            $("#loader").attr('class', 'loader');
		    				    	            $.ajax({
		    				    					cache: false,
		    				    					url:'/Roles?p=getAllRoles',
		    				    					success:function(data) {
		    				    						showRoleList(data);
		    				    						if(jData.state != undefined){
		    				    	    					if(jData.state == "SUCCESS"){
		    				    	    						$("#saveModal").attr("data-form_name","addrole");
		    				    	    						$("#saveModal .modal-body p").text(jData.message + " !!!");
		    				    	    						$("#saveModal").modal("show");
		    				    	    					}
		    				    	    					else{
		    				    	    						$("#saveModal").attr("data-form_name","addrole");
		    				    	    						$("#saveModal .modal-body p").text(jData.message + " !!!");
		    				    	    						$("#saveModal").modal("show");
		    				    	    					}
		    				    	    				}
		    				    					}
		    				    				});
		    				    	            $("#loader").attr('class', 'loader collapse');
		    				    	            uncheckAllRolePerm();
		    				    			}
			    				    	});	    						
			    					}
			    				});
			    			}
			    		});
					}
				});
	            //Prevent form submission
	            e.preventDefault();

	            var $form = $(e.target);
	            
	            //$('#roles_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow");
	            $('#roles_form').bootstrapValidator('resetForm', true);
	        
	    });
	    
	    //Administrator Edit Role Form Validation
	    $('#edit_roles_form').bootstrapValidator({
	        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
	        feedbackIcons: {
	            valid: 'fa fa-check',
	            invalid: 'fa fa-remove',
	            validating: 'fa fa-refresh'
	        },
	        fields: {
	        	edit_role_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply role name'
	                    }
	                }
	            }
	            
	        }
	    	}).on('success.form.bv', function(e) {
	    		var roleid = $("#edit_roles_form").attr("data-roleid");
	    		var rolename = $("#edit_roles_form #edit_role_name").val();
	    		//$("#loader").attr('class', 'loader');
				console.log(roleid + " -*-*- " + rolename);
				setResourcePermission();
				console.log(respertotal);
				console.log(srvpertotal);
				$.ajax({
					cache: false,
					url:'/Report?p=getMainServiceCount',
					success:function(data) {
						$("#loader").attr('class', 'loader collapse');
						jsondata = JSON.parse(data);
						var countvalue = jsondata.count;
						console.log(countvalue);
						var srvpermlength = srvpertotal.length;
						if(countvalue == srvpermlength)
							srvpertotal = ["0"];
						console.log("Userlist:"+changeenrolluserid);
						console.log("GroupList:"+changeenrollgroupid);
						console.log("ResourceList:"+respertotal);
						console.log("ServiceList:"+srvpertotal);
						console.log("ServiceListLength:"+srvpertotal.length);
						$("#loader").attr('class', 'loader');
			    		$.ajax({
			    			cache: false,
			    			url:"/Roles?p=updateRole&role_id="+roleid+"&role_name="+rolename+"&srvPermList="+srvpertotal+"&resPermList="+respertotal,
			    			success:function(data) {
			    				$("#loader").attr('class', 'loader collapse');
			    				var jData = JSON.parse(data);
			    				//$('#edit_roles_form #success_message').slideDown({ opacity: "show" }, "slow");
			    				//$('#edit_roles_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow");
			    				console.log("url"+"/Roles?p=updateRole&role_id="+roleid+"&role_name="+rolename+"&srvPermList="+srvpertotal+"&resPermList="+respertotal);
		    					$("#loader").attr('class', 'loader');
		    					$.ajax({
    				    	    	cache: false,
    				    	    	url:'/Roles?p=updateRoleMembers&role_id='+roleid+'&userList='+changeenrolluserid+'&groupList='+changeenrollgroupid,
    				    			success:function(data) {
    				    				$("#loader").attr('class', 'loader collapse');
    				    				console.log("/Roles?p=updateRoleMembers&role_id="+roleid+"&userList="+changeenrolluserid+'&groupList='+changeenrollgroupid);
    				    				
    				    				$("#loader").attr('class', 'loader');
    				    	            $.ajax({
    				    					cache: false,
    				    					url:'/Roles?p=getAllRoles',
    				    					success:function(data) {
    				    						$("#loader").attr('class', 'loader collapse');
    				    						
    				    						showRoleList(data);
    				    						if(jData.state != undefined){
    				    	    					if(jData.state == "SUCCESS"){
    				    	    						$("#saveModal").attr("data-form_name","editrole");
    				    	    						$("#saveModal .modal-body p").text(jData.message + " !!!");
    				    	    						$("#saveModal").modal("show");
    				    	    					}
    				    	    					else{
    				    	    						$("#saveModal").attr("data-form_name","editrole");
    				    	    						$("#saveModal .modal-body p").text(jData.message + " !!!");
    				    	    						$("#saveModal").modal("show");
    				    	    					}
    				    	    				}
    				    					}
    				    				});
    				    			}
	    				    	});
			    				
		
			    				var attrrole = $("#roles_form #existingroles tbody tr").attr('data-roleid');
			    	            if (typeof attrrole !== typeof undefined && attrrole !== false) {
			    	            	$("#roles_form #existingroles tbody tr[data-roleid]").remove();
			    	            }

			    	            uncheckAllRoleEditPerm();
			    			}
			    		});
					}
				});
	            //Prevent form submission
	            e.preventDefault();

	            var $form = $(e.target);
	            
	            //$('#edit_roles_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow");
	            $('#edit_roles_form').bootstrapValidator('resetForm', true);
	        
	    });
	    
	    //Administrator Group Form Validation
	    $('#groups_form').bootstrapValidator({
	        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
	        feedbackIcons: {
	            valid: 'fa fa-check',
	            invalid: 'fa fa-remove',
	            validating: 'fa fa-refresh'
	        },
	        fields: {
	        	group_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply group name'
	                    }
	                }
	            }
	            
	        }
	    	})
	    	.on('success.form.bv', function(e) {
	    		var groupname = $("#groups_form #group_name").val();
	    		$("#loader").attr('class', 'loader');
	    		$.ajax({
	    			cache: false,
	    			url:"/Groups?p=createNewGroup&group_name="+groupname+"&grpRoleList="+changeenrollroleid+"&memberList="+changeenrolluserid,
	    			success:function(data) {
	    				$("#loader").attr('class', 'loader collapse');
	    				var jData = JSON.parse(data);
	    				//$('#groups_form #success_message').slideDown({ opacity: "show" }, "slow");
	    				//$('#groups_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow");
	    				//console.log("/Groups?p=createNewGroup&group_name="+groupname+"&grpRoleList="+changeenrollroleid+"&memberList="+changeenrolluserid);
    					$("#loader").attr('class', 'loader');

	    				var attrrole = $("#groups_form #existinggroups tbody tr").attr('data-groupid');
	    	            if (typeof attrrole !== typeof undefined && attrrole !== false) {
	    	            	$("#groups_form #existinggroups tbody tr[data-groupid]").remove();
	    	            }
	    	            $("#loader").attr('class', 'loader');
	    	            $.ajax({
	    					cache: false,
	    					url:'/Groups?p=getAllGroups',
	    					success:function(data) {
	    						showGroupList(data);
	    						if(jData.state != undefined){
	    	    					if(jData.state == "SUCCESS"){
	    	    						$("#saveModal").attr("data-form_name","addgroup");
	    	    						$("#saveModal .modal-body p").text(jData.message + " !!!");
	    	    						$("#saveModal").modal("show");
	    	    					}
	    	    					else{
	    	    						$("#saveModal").attr("data-form_name","addgroup");
	    	    						$("#saveModal .modal-body p").text(jData.message + " !!!");
	    	    						$("#saveModal").modal("show");
	    	    					}
	    	    				}
	    					}
	    				});
	    	            $("#loader").attr('class', 'loader collapse');
	    			}
	    		});

	            //Prevent form submission
	            e.preventDefault();

	            var $form = $(e.target);
	            
	            //$('#groups_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow");
	            $('#groups_form').bootstrapValidator('resetForm', true);
	        
	    });
	    
		//Administrator Edit Group Form Validation
	    $('#edit_groups_form').bootstrapValidator({
	        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
	        feedbackIcons: {
	            valid: 'fa fa-check',
	            invalid: 'fa fa-remove',
	            validating: 'fa fa-refresh'
	        },
	        fields: {
	        	edit_group_name: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please supply group name'
	                    }
	                }
	            }            
	        }
	    	}).on('success.form.bv', function(e) {
	    		$("#loader").attr('class', 'loader');
	    		var groupid = $("#edit_groups_form").attr("data-groupid");
	    		var groupname = $("#edit_groups_form #edit_group_name").val();
	    		console.log(changeenrollroleid);
	    		console.log(changeenrolluserid);
	    		//console.log("url:/Groups?p=updateGroup&group_id="+groupid+"&group_name="+groupname+"&grpRoleList="+changeenrollroleid+"&memberList="+changeenrolluserid);
	    		console.log("/Groups?p=updateGroup&group_id="+groupid+"&group_name="+groupname+"&grpRoleList="+changeenrollroleid+"&memberList="+changeenrolluserid);
	    		$.ajax({
	    			cache: false,
	    			url:"/Groups?p=updateGroup&group_id="+groupid+"&group_name="+groupname+"&grpRoleList="+changeenrollroleid+"&memberList="+changeenrolluserid,
	    			success:function(data) {
	    				$("#loader").attr('class', 'loader collapse');
	    				var jData = JSON.parse(data);
	    				//$('#edit_users_form #success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
	    				//$('#edit_users_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow")
	    				$("#loader").attr('class', 'loader');
	    				$.ajax({
	    					cache: false,
	    					url:'/Groups?p=getGroup&group_id=' + parseInt($("#edit_groups_form").attr("data-groupid")),
	    					success:function(data){
	    						$("#loader").attr('class', 'loader collapse');
	    						jsondata = JSON.parse(data);
	    						//console.log("groupid:"+jsondata.group_id);
	    						//console.log("groupname:"+jsondata.group_name);
	    						$("#edit_groups_form legend span").text(jsondata.group_name);
	    						$("#edit_groups_form #edit_group_name").val(jsondata.group_name);
	    						
	    						var attrgrp = $("#groups_form #existinggroups tbody tr").attr('data-groupid');
	    	    	            if (typeof attrgrp !== typeof undefined && attrgrp !== false) {
	    	    	            	$("#groups_form #existinggroups tbody tr[data-groupid]").remove();
	    	    	            	//$('#kpi_form').bootstrapValidator('resetForm', true);
	    	    	            }
	    	    	            
	    	    	            $("#loader").attr('class', 'loader');
	    	    	            $.ajax({
	    	    					cache: false,
	    	    					url:'/Groups?p=getAllGroups',
	    	    					success:function(data) {
	    	    						$("#loader").attr('class', 'loader collapse');
	    	    						showGroupList(data);
	    	    						if(jData.state != undefined){
	    	    	    					if(jData.state == "SUCCESS"){
	    	    	    						$("#saveModal").attr("data-form_name","editgroup");
	    	    	    						$("#saveModal .modal-body p").text(jData.message + " !!!");
	    	    	    						$("#saveModal").modal("show");
	    	    	    					}
	    	    	    					else{
	    	    	    						$("#saveModal").attr("data-form_name","editgroup");
	    	    	    						$("#saveModal .modal-body p").text(jData.message + " !!!");
	    	    	    						$("#saveModal").modal("show");
	    	    	    					}
	    	    	    				}
	    	    					}
	    	    				});
	    					}
	    				});
	    				
	    				
	    			}
	    		});

	            //Prevent form submission
	            e.preventDefault();

	            //Get the form instance
	            var $form = $(e.target);
	            console.log("Data: " + $form.serialize());

	            // Get the BootstrapValidator instance
	            //var bv = $form.data('bootstrapValidator');
				//console.log(bv);
				//$('#ds_form').toggle('500');
	            // Use Ajax to submit form data
	            //$.post($form.attr('action'), $form.serialize(), function(result) {
	            //    console.log(result);
	            //}, 'json');
	            
	            //$('#edit_groups_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow");
	            $('#edit_groups_form').bootstrapValidator('resetForm', true);
	        
	    });
	    
	    
	    //User Form MultiSelect 
		$('#role_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Roles</div>",
			selectionHeader: "<div class='custom-header'>Selected Roles</div>",
		});
		
		$('#group_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Groups</div>",
			selectionHeader: "<div class='custom-header'>Selected Groups</div>",
		});
		
	    //Edit User Form MultiSelect 
		$('#edit_role_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Roles</div>",
			selectionHeader: "<div class='custom-header'>Selected Roles</div>",
		});
		
		$('#edit_group_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Groups</div>",
			selectionHeader: "<div class='custom-header'>Selected Groups</div>",
		});
		
		//Create Role Service Permissions Select / Deselect All
		$('#role_srv_select-all').click(function(){
			$('#role_form_select_srvperm_list').multiSelect('select_all');
				return false;
		});
		$('#role_srv_deselect-all').click(function(){
			$('#role_form_select_srvperm_list').multiSelect('deselect_all');
				return false;
		});
		
		//Existing Role Service Permissions Select / Deselect All
		$('#edit_role_srv_select-all').click(function(){
			$('#edit_role_form_select_srvperm_list').multiSelect('select_all');
				return false;
		});
		$('#edit_role_srv_deselect-all').click(function(){
			$('#edit_role_form_select_srvperm_list').multiSelect('deselect_all');
				return false;
		});
		
		//User Form Create User Add Role Button
		$("#users_form #add_roles").click(function(){
			if($("#users_form #user_form_role_list").css('display') == 'none'){
				$("#users_form #user_form_role_list").css("display","block");
				$("#users_form #add_roles").text("Close");
			}
			else{
				$("#users_form #user_form_role_list").css("display","none");
				$("#users_form #add_roles").text("Edit");
				var selectedValues = [];
			    $.each($("#users_form #user_form_role_list .ms-selection li.ms-selected"), function() {
			    	var textvalue = $(this).find("span").text();
			    	console.log("Textval: "+textvalue);
			    	console.log("Value: " + $(this).parent().parent().parent().parent().find('option[text="Operator"]').val());
			    	
			    	//$('#test').find('option[text="B"]').val()
			    	selectedValues.push($(this).parent().parent().siblings("select").find('option[text=\''+textvalue+'\']').val());
			    });
			    console.log("Selected:"+selectedValues);
			}
		});

		//User Form Create User Add Group Button
		$("#users_form #add_groups").click(function(){			
			if($("#users_form #user_form_group_list").css('display') == 'none'){
				$("#users_form #user_form_group_list").css("display","block");
				$("#users_form #add_groups").text("Close");
			}
			else{
				$("#users_form #user_form_group_list").css("display","none");
				$("#users_form #add_groups").text("Edit");
			}
		});
		
		//Edit User Form Edit Role Button
		$("#edit_users_form #edit_add_roles").click(function(){
			if($("#edit_users_form #edit_user_form_role_list").css('display') == 'none'){
				$("#edit_users_form #edit_user_form_role_list").css("display","block");
				$("#edit_users_form #edit_add_roles").text("Close");
				console.log("TTTTT:"+$('select#edit_role_list').val());
			}
			else{
				$("#edit_users_form #edit_user_form_role_list").css("display","none");
				$("#edit_users_form #edit_add_roles").text("Edit");
			}
		});

		//Edit User Form Edit Group Button
		$("#edit_users_form #edit_add_groups").click(function(){			
			if($("#edit_users_form #edit_user_form_group_list").css('display') == 'none'){
				$("#edit_users_form #edit_user_form_group_list").css("display","block");
				$("#edit_users_form #edit_add_groups").text("Close");
			}
			else{
				$("#edit_users_form #edit_user_form_group_list").css("display","none");
				$("#edit_users_form #edit_add_groups").text("Edit");
			}
		});
		
		//Role Form Add User Button
		$("#roles_form #role_add_users").click(function(){			
			if($("#roles_form #role_form_user_list").css('display') == 'none'){
				$("#roles_form #role_form_user_list").css("display","block");
				$("#roles_form #role_add_users").text("Close");
			}
			else{
				$("#roles_form #role_form_user_list").css("display","none");
				$("#roles_form #role_add_users").text("Edit");
			}
		});
		
		//Role Form Add Group Button
		$("#roles_form #role_add_groups").click(function(){			
			if($("#roles_form #role_form_group_list").css('display') == 'none'){
				$("#roles_form #role_form_group_list").css("display","block");
				$("#roles_form #role_add_groups").text("Close");
			}
			else{
				$("#roles_form #role_form_group_list").css("display","none");
				$("#roles_form #role_add_groups").text("Edit");
			}
		});
		
		//Role Form Add Service Permission Button
		$("#roles_form #role_service_permiss").click(function(){			
			if($("#roles_form #role_form_srvper_list").css('display') == 'none'){
				$("#roles_form #role_form_srvper_list").css("display","block");
				$("#roles_form #role_service_permiss").text("Close");
			}
			else{
				$("#roles_form #role_form_srvper_list").css("display","none");
				$("#roles_form #role_service_permiss").text("Edit");
			}
		});
		
		//Edit Role Form Edit User Button
		$("#edit_roles_form #edit_role_add_users").click(function(){			
			if($("#edit_roles_form #edit_role_form_user_list").css('display') == 'none'){
				$("#edit_roles_form #edit_role_form_user_list").css("display","block");
				$("#edit_roles_form #edit_role_add_users").text("Close");
			}
			else{
				$("#edit_roles_form #edit_role_form_user_list").css("display","none");
				$("#edit_roles_form #edit_role_add_users").text("Edit");
			}
		});
		
		//Edit Role Form Edit Group Button
		$("#edit_roles_form #edit_role_add_groups").click(function(){			
			if($("#edit_roles_form #edit_role_form_group_list").css('display') == 'none'){
				$("#edit_roles_form #edit_role_form_group_list").css("display","block");
				$("#edit_roles_form #edit_role_add_groups").text("Close");
			}
			else{
				$("#edit_roles_form #edit_role_form_group_list").css("display","none");
				$("#edit_roles_form #edit_role_add_groups").text("Edit");
			}
		});
		
		//Edit Role Form Edit Resource Button
		$("#edit_roles_form #edit_role_resource_permiss").click(function(){			
			if($("#edit_roles_form #edit_role_form_perm_list").css('display') == 'none'){
				$("#edit_roles_form #edit_role_form_perm_list").css("display","block");
				$("#edit_roles_form #edit_role_resource_permiss").text("Close");
			}
			else{
				$("#edit_roles_form #edit_role_form_perm_list").css("display","none");
				$("#edit_roles_form #edit_role_resource_permiss").text("Edit");
			}
		});
		
		//Edit Role Form Edit Service Button
		$("#edit_roles_form #edit_role_service_permiss").click(function(){			
			if($("#edit_roles_form #edit_role_form_srvper_list").css('display') == 'none'){
				$("#edit_roles_form #edit_role_form_srvper_list").css("display","block");
				$("#edit_roles_form #edit_role_service_permiss").text("Close");
			}
			else{
				$("#edit_roles_form #edit_role_form_srvper_list").css("display","none");
				$("#edit_roles_form #edit_role_service_permiss").text("Edit");
			}
		});
		
		//Group Form Add User Button
		$("#groups_form #group_add_users").click(function(){			
			if($("#groups_form #group_form_user_list").css('display') == 'none'){
				$("#groups_form #group_form_user_list").css("display","block");
				$("#groups_form #group_add_users").text("Close");
			}
			else{
				$("#groups_form #group_form_user_list").css("display","none");
				$("#groups_form #group_add_users").text("Edit");
			}
		});
		
		//Group Form Add Role Button
		$("#groups_form #group_add_roles").click(function(){			
			if($("#groups_form #group_form_role_list").css('display') == 'none'){
				$("#groups_form #group_form_role_list").css("display","block");
				$("#groups_form #group_add_roles").text("Close");
			}
			else{
				$("#groups_form #group_form_role_list").css("display","none");
				$("#groups_form #group_add_roles").text("Edit");
			}
		});
		
		//Edit Group Form Edit User Button
		$("#edit_groups_form #edit_grpadd_users").click(function(){
			if($("#edit_groups_form #edit_group_form_user_list").css('display') == 'none'){
				$("#edit_groups_form #edit_group_form_user_list").css("display","block");
				$("#edit_groups_form #edit_grpadd_users").text("Close");
			}
			else{
				$("#edit_groups_form #edit_group_form_user_list").css("display","none");
				$("#edit_groups_form #edit_grpadd_users").text("Edit");
			}
		});

		//Edit Group Form Edit Role Button
		$("#edit_groups_form #edit_grpadd_roles").click(function(){			
			if($("#edit_groups_form #edit_group_form_role_list").css('display') == 'none'){
				$("#edit_groups_form #edit_group_form_role_list").css("display","block");
				$("#edit_groups_form #edit_grpadd_roles").text("Close");
			}
			else{
				$("#edit_groups_form #edit_group_form_role_list").css("display","none");
				$("#edit_groups_form #edit_grpadd_roles").text("Edit");
			}
		});
		
		//Open-Close Resource Permission div in Roles Form
		$("#roles_form #role_resource_permiss").click(function(){			
			if($("#roles_form #role_form_perm_list").css('display') == 'none'){
				$("#roles_form #role_form_perm_list").css("display","block");
				$("#roles_form #role_resource_permiss").text("Close");
			}
			else{
				$("#roles_form #role_form_perm_list").css("display","none");
				$("#roles_form #role_resource_permiss").text("Edit");
			}
		});
		
		//Edited User Form Open
        /*$("#existingusers").on('click','#usreditbtn',function(){
        	var userid = $(this).attr("data-userid");
        	console.log("Edited User Form Open");
        	$("#users_form").attr('class', 'collapse');
        	$("#loader").attr('class', 'loader');
        	setEditUserFormValue(userid);
        	$("#edit_users_form").attr('data-userid', userid);
        	$("#edit_users_form #save_edit_usr").attr('data-userid', userid);
        	$("#loader").attr('class', 'loader');
        	$.ajax({
				cache: false,
				url:'/Users?p=getUserUnEnrolledRoles&userid='+parseInt(userid),
				success:function(data1) {
					console.log(JSON.parse(data1).length);
					if((JSON.parse(data1).length) !== 0){
						populateUserUnEnrollRoleForExistingUser(data1);
						$.ajax({
							cache: false,
							url:'/Users?p=getUserEnrolledRoles&userid='+parseInt(userid),
							success:function(data2) {
								populateUserEnrollRoleForExistingUser(data2);
								
							}	
						});
					}
					else{
						populateUserUnEnrollRoleForExistingUser("[]");
						$.ajax({
							cache: false,
							url:'/Roles?p=getAllRoles',
							success:function(data) {
								populateUserEnrollRoleForExistingUser(data);
								
							}	
						});
					}
				}
			});
            $("#loader").attr('class', 'loader collapse');
        	$("#loader").attr('class', 'loader');
        	$.ajax({
				cache: false,
				url:'/Users?p=getUserUnEnrolledGroups&userid='+parseInt(userid),
				success:function(data3) {
					console.log(JSON.parse(data3).length);
					if((JSON.parse(data3).length) !== 0){
						populateUserUnEnrollGroupForExistingUser(data3);
						$.ajax({
							cache: false,
							url:'/Users?p=getUserEnrolledGroups&userid='+parseInt(userid),
							success:function(data4) {
								populateUserEnrollGroupForExistingUser(data4);
								
							}	
						});
					}
					else{
						populateUserUnEnrollGroupForExistingUser("[]");
						$.ajax({
							cache: false,
							url:'/Groups?p=getAllGroups',
							success:function(data5) {
								populateUserEnrollGroupForExistingUser(data5);
								
							}	
						});
					}
				}
			});
            $("#loader").attr('class', 'loader collapse');
        	$("#edit_users_form").attr('class', '');
        });*/
        
		//Last Edited User Form Open
        $("#existingusers").on('click','#usreditbtn',function(){
        	var userid = $(this).attr("data-userid");
        	console.log("Edited User Form Open");
        	$("#users_form").attr('class', 'collapse');
        	$("#loader").attr('class', 'loader');
        	//setEditUserFormValue(userid);
    		$.ajax({
    			cache: false,
    			url:'/Users?p=getUser&userid=' + parseInt(userid),
    			success:function(data){
    				$("#loader").attr('class', 'loader collapse');
    				jsondata = JSON.parse(data);
    				console.log("userid:"+jsondata.userid);
    				console.log("firstname:"+jsondata.firstName);
    				console.log("lastname:"+jsondata.lastName);
    				console.log("username:"+jsondata.username);
    				console.log("password:"+jsondata.password);

    				$("#edit_users_form legend span").text(jsondata.username);
    				$("#edit_users_form #edit_user_name").val(jsondata.username);			
    				$("#edit_users_form #edit_first_name").val(jsondata.firstName);
    				$("#edit_users_form #edit_last_name").val(jsondata.lastName);
    				$("#edit_users_form #edit_user_password").val(jsondata.password);	
    				$("#edit_users_form #edit_user_repassword").val(jsondata.password);
    				
    				$("#edit_users_form").attr('data-userid', userid);
    	        	$("#edit_users_form #save_edit_usr").attr('data-userid', userid);
    	        	$("#loader").attr('class', 'loader');
    	        	$.ajax({
    					cache: false,
    					url:'/Users?p=getUserUnEnrolledRoles&userid='+parseInt(userid),
    					success:function(data1) {
    						$("#loader").attr('class', 'loader collapse');
    						console.log(JSON.parse(data1).length);
    						if((JSON.parse(data1).length) !== 0){
    							populateUserUnEnrollRoleForExistingUser(data1);
    							$("#loader").attr('class', 'loader');
    							$.ajax({
    								cache: false,
    								url:'/Users?p=getUserEnrolledRoles&userid='+parseInt(userid),
    								success:function(data2) {
    									$("#loader").attr('class', 'loader collapse');
    									populateUserEnrollRoleForExistingUser(data2);
    									$("#loader").attr('class', 'loader');
    									$.ajax({
    										cache: false,
    										url:'/Users?p=getUserUnEnrolledGroups&userid='+parseInt(userid),
    										success:function(data3) {
    											$("#loader").attr('class', 'loader collapse');
    											console.log(JSON.parse(data3).length);
    											if((JSON.parse(data3).length) !== 0){
    												populateUserUnEnrollGroupForExistingUser(data3);
    												$("#loader").attr('class', 'loader');
    												$.ajax({
    													cache: false,
    													url:'/Users?p=getUserEnrolledGroups&userid='+parseInt(userid),
    													success:function(data4) {
    														$("#loader").attr('class', 'loader collapse');
    														populateUserEnrollGroupForExistingUser(data4);
    														
    													}	
    												});
    											}
    											else{
    												populateUserUnEnrollGroupForExistingUser("[]");
    												$("#loader").attr('class', 'loader');
    												$.ajax({
    													cache: false,
    													url:'/Groups?p=getAllGroups',
    													success:function(data5) {
    														$("#loader").attr('class', 'loader collapse');
    														populateUserEnrollGroupForExistingUser(data5);
    														
    													}	
    												});
    											}
    										}
    									});
    									
    								}	
    							});
    						}
    						else{
    							populateUserUnEnrollRoleForExistingUser("[]");
    							$("#loader").attr('class', 'loader');
    							$.ajax({
    								cache: false,
    								url:'/Roles?p=getAllRoles',
    								success:function(data) {
    									$("#loader").attr('class', 'loader collapse');
    									populateUserEnrollRoleForExistingUser(data);
    									$("#loader").attr('class', 'loader');
    									$.ajax({
    										cache: false,
    										url:'/Users?p=getUserUnEnrolledGroups&userid='+parseInt(userid),
    										success:function(data3) {
    											$("#loader").attr('class', 'loader collapse');
    											console.log(JSON.parse(data3).length);
    											if((JSON.parse(data3).length) !== 0){
    												populateUserUnEnrollGroupForExistingUser(data3);
    												$("#loader").attr('class', 'loader');
    												$.ajax({
    													cache: false,
    													url:'/Users?p=getUserEnrolledGroups&userid='+parseInt(userid),
    													success:function(data4) {
    														$("#loader").attr('class', 'loader collapse');
    														populateUserEnrollGroupForExistingUser(data4);												
    													}	
    												});
    											}
    											else{
    												populateUserUnEnrollGroupForExistingUser("[]");
    												$("#loader").attr('class', 'loader');
    												$.ajax({
    													cache: false,
    													url:'/Groups?p=getAllGroups',
    													success:function(data5) {
    														$("#loader").attr('class', 'loader collapse');
    														populateUserEnrollGroupForExistingUser(data5);
    														
    													}	
    												});
    											}
    										}
    									});
    								}	
    							});
    						}
    					}
    				});
    			
    			}
    		});
        	$("#edit_users_form").attr('class', '');
        });
        
		//Edited Role Form Open
        /*$("#existingroles").on('click','#roleeditbtn',function(){
        	var roleid = $(this).attr("data-roleid");
        	console.log("Edited Role Form Open");
        	$("#roles_form").attr('class', 'collapse');
        	$("#loader").attr('class', 'loader');
        	setEditRoleFormValue(roleid);
        	$("#edit_roles_form").attr('data-roleid', roleid);
        	$("#edit_roles_form #save_edit_role").attr('data-roleid', roleid);
        	$("#edit_roles_form #roleusersearch").attr('data-roleid', roleid);
        	$("#loader").attr('class', 'loader');
        	
        	//$.ajax({
			//	cache: false,
			//	url:'/Roles?p=getRoleUnEnrolledUsers&role_id='+parseInt(roleid),
			//	success:function(data1) {
			//		console.log(JSON.parse(data1).length);
			//		if((JSON.parse(data1).length) !== 0){
			//			populateRoleUnEnrollUserForExistingRole(data1);
			//			$.ajax({
			//				cache: false,
			//				url:'/Roles?p=getRoleEnrolledUsers&role_id='+parseInt(roleid),
			//				success:function(data2) {
			//					console.log(JSON.parse(data2).length);
			//					populateRoleEnrollUserForExistingrole(data2);							
			//				}	
			//			});
			//		}
			//		else{
			//			populateRoleUnEnrollUserForExistingRole("[]");
			//			$.ajax({
			//				cache: false,
			//				url:'/Users?p=getAllUsers',
			//				success:function(data) {
			//					populateRoleEnrollUserForExistingrole(data);								
			//				}	
			//			});
			//		}
			//	}
			//});
        
			populateRoleUnEnrollUserForExistingRole("[]");
			$.ajax({
				cache: false,
				url:'/Roles?p=getRoleEnrolledUsers&role_id='+parseInt(roleid),
				success:function(data2) {
					console.log(JSON.parse(data2).length);
					populateRoleEnrollUserForExistingrole(data2);	
				}
			});	
            $("#loader").attr('class', 'loader collapse');
        	$("#loader").attr('class', 'loader');
        	$.ajax({
				cache: false,
				url:'/Roles?p=getRoleUnEnrolledGroups&role_id='+parseInt(roleid),
				success:function(data3) {
					console.log(data3);
					if((JSON.parse(data3).length) !== 0){
						populateRoleUnEnrollGroupForExistingRole(data3);
						$.ajax({
							cache: false,
							url:'/Roles?p=getRoleEnrolledGroups&role_id='+parseInt(roleid),
							success:function(data4) {
								console.log(data3);
								populateRoleEnrollGroupForExistingRole(data4);
								
							}	
						});
					}
					else{
						populateRoleUnEnrollGroupForExistingRole("[]");
						$.ajax({
							cache: false,
							url:'/Groups?p=getAllGroups',
							success:function(data5) {
								populateRoleEnrollGroupForExistingRole(data5);
								
							}	
						});
					}
				}
			});
            $("#loader").attr('class', 'loader collapse');
        	$("#loader").attr('class', 'loader');
        	$.ajax({
				cache: false,
				url:'/Roles?p=getRoleUnEnrolledServices&role_id='+parseInt(roleid),
				success:function(data3) {
					if((JSON.parse(data3).length) !== 0){
						populateRoleUnEnrollServiceForExistingRole(data3);
						$.ajax({
							cache: false,
							url:'/Roles?p=getRoleEnrolledServices&role_id='+parseInt(roleid),
							success:function(data4) {
								populateRoleEnrollServiceForExistingRole(data4);
								
							}	
						});
					}
					else{
						populateRoleUnEnrollServiceForExistingRole("[]");
						$.ajax({
							cache: false,
							url:'/Report?p=getMainServiceList',
							success:function(data5) {
								populateRoleEnrollServiceForExistingRole(data5);
								
							}	
						});
					}
				}
			});
            $("#loader").attr('class', 'loader collapse');
            setEditRoleResPermValues(roleid);
        	$("#edit_roles_form").attr('class', '');
        });*/
        
        
		//Last Edited Role Form Open
        $("#existingroles").on('click','#roleeditbtn',function(){
        	var roleid = $(this).attr("data-roleid");
        	console.log("Edited Role Form Open");
        	$("#roles_form").attr('class', 'collapse');
        	$("#loader").attr('class', 'loader');
        	//setEditRoleFormValue(roleid);
        	$.ajax({
    			cache: false,
    			url:'/Roles?p=getRole&role_id=' + parseInt(roleid),
    			success:function(data){
    				jsondata = JSON.parse(data);
    				$("#loader").attr('class', 'loader collapse');
    				console.log("role id:"+jsondata.role_id);
    				console.log("role name:"+jsondata.role_name);

    				$("#edit_roles_form legend span").text(jsondata.role_name);
    				$("#edit_roles_form #edit_role_name").val(jsondata.role_name);	
    				
    				$("#edit_roles_form").attr('data-roleid', roleid);
    	        	$("#edit_roles_form #save_edit_role").attr('data-roleid', roleid);
    	        	$("#edit_roles_form #roleusersearch").attr('data-roleid', roleid);
    	        	$("#loader").attr('class', 'loader');
    				populateRoleUnEnrollUserForExistingRole("[]");
    				$("#loader").attr('class', 'loader');
    				$.ajax({
    					cache: false,
    					url:'/Roles?p=getRoleEnrolledUsers&role_id='+parseInt(roleid),
    					success:function(data2) {
    						$("#loader").attr('class', 'loader collapse');
    						console.log('data2 length: ' + JSON.parse(data2).length);
    						populateRoleEnrollUserForExistingrole(data2);
    						$("#loader").attr('class', 'loader');
    						$.ajax({
    							cache: false,
    							url:'/Roles?p=getRoleUnEnrolledGroups&role_id='+parseInt(roleid),
    							success:function(data3) {
    								$("#loader").attr('class', 'loader collapse');
    								console.log('data3: ' + data3);
    								if((JSON.parse(data3).length) !== 0){
    									populateRoleUnEnrollGroupForExistingRole(data3);
    									$("#loader").attr('class', 'loader');
    									$.ajax({
    										cache: false,
    										url:'/Roles?p=getRoleEnrolledGroups&role_id='+parseInt(roleid),
    										success:function(data4) {
    											$("#loader").attr('class', 'loader collapse');
    											console.log(data3);
    											populateRoleEnrollGroupForExistingRole(data4);
    											$("#loader").attr('class', 'loader');
    											$.ajax({
    												cache: false,
    												url:'/Roles?p=getRoleUnEnrolledServices&role_id='+parseInt(roleid),
    												success:function(data3) {
    													$("#loader").attr('class', 'loader collapse');
    													console.log('/Roles?p=getRoleEnrolledServices&role_id='+parseInt(roleid));
    													if((JSON.parse(data3).length) !== 0){
    														populateRoleUnEnrollServiceForExistingRole(data3);
    														$("#loader").attr('class', 'loader');
    														$.ajax({
    															cache: false,
    															url:'/Roles?p=getRoleEnrolledServices&role_id='+parseInt(roleid),
    															success:function(data4) {
    																console.log('data4: ' + data4);
    																$("#loader").attr('class', 'loader collapse');
    																populateRoleEnrollServiceForExistingRole(data4);
    																setEditRoleResPermValues(roleid);
    																
    															}	
    														});
    													}
    													else{
    														populateRoleUnEnrollServiceForExistingRole("[]");
    														$("#loader").attr('class', 'loader');
    														$.ajax({
    															cache: false,
    															url:'/Report?p=getMainServiceList',
    															success:function(data5) {
    																$("#loader").attr('class', 'loader collapse');
    																populateRoleEnrollServiceForExistingRole(data5);
    																setEditRoleResPermValues(roleid);
    															}	
    														});
    													}
    												}
    											});
    											
    										}	
    									});
    								}
    								else{
    									populateRoleUnEnrollGroupForExistingRole("[]");
    									$("#loader").attr('class', 'loader');
    									$.ajax({
    										cache: false,
    										url:'/Groups?p=getAllGroups',
    										success:function(data5) {
    											$("#loader").attr('class', 'loader collapse');
    											populateRoleEnrollGroupForExistingRole(data5);
    											$("#loader").attr('class', 'loader');
    											$.ajax({
    												cache: false,
    												url:'/Roles?p=getRoleUnEnrolledServices&role_id='+parseInt(roleid),
    												success:function(data3) {
    													$("#loader").attr('class', 'loader collapse');
    													if((JSON.parse(data3).length) !== 0){
    														populateRoleUnEnrollServiceForExistingRole(data3);
    														$("#loader").attr('class', 'loader');
    														$.ajax({
    															cache: false,
    															url:'/Roles?p=getRoleEnrolledServices&role_id='+parseInt(roleid),
    															success:function(data4) {
    																$("#loader").attr('class', 'loader collapse');
    																populateRoleEnrollServiceForExistingRole(data4);
    																setEditRoleResPermValues(roleid);
    															}	
    														});
    													}
    													else{
    														populateRoleUnEnrollServiceForExistingRole("[]");
    														$("#loader").attr('class', 'loader');
    														$.ajax({
    															cache: false,
    															url:'/Report?p=getMainServiceList',
    															success:function(data5) {
    																$("#loader").attr('class', 'loader collapse');
    																populateRoleEnrollServiceForExistingRole(data5);
    																setEditRoleResPermValues(roleid);
    															}	
    														});
    													}
    												}
    											});
    											
    										}	
    									});
    								}
    							}
    						});					
    					}
    				});	
    				
    			
    			}
    		});
        	
        	$("#edit_roles_form").attr('class', '');
        });
        
		//Edited Group Form Open
        $("#existinggroups").on('click','#groupeditbtn',function(){
        	var groupid = $(this).attr("data-groupid");
        	console.log("Edited Group Form Open"+groupid);
        	$("#groups_form").attr('class', 'collapse');
        	$("#loader").attr('class', 'loader');
        	//setEditGroupFormValue(groupid);
        	$.ajax({
    			cache: false,
    			url:'/Groups?p=getGroup&group_id=' + parseInt(groupid),
    			success:function(data){
    				$("#loader").attr('class', 'loader collapse');
    				jsondata = JSON.parse(data);
    				console.log("groupid:"+jsondata.group_id);
    				console.log("groupname:"+jsondata.group_name);

    				$("#edit_groups_form legend span").text(jsondata.group_name);
    				$("#edit_groups_form #edit_group_name").val(jsondata.group_name);	
    				
    	        	$("#edit_groups_form").attr('data-groupid', groupid);
    	        	//$("#edit_groups_form #save_edit_grp").attr('data-groupid', groupid);
    	        	$("#loader").attr('class', 'loader');
    	        	$.ajax({
    					cache: false,
    					url:'/Groups?p=getGroupUnEnrolledUsers&group_id='+parseInt(groupid),
    					success:function(data1) {
    						$("#loader").attr('class', 'loader collapse');
    						console.log(JSON.parse(data1).length);
    						if((JSON.parse(data1).length) !== 0){
    							populateGroupUnEnrollUserForExistingGroup(data1);
    							$("#loader").attr('class', 'loader');
    							$.ajax({
    								cache: false,
    								url:'/Groups?p=getGroupEnrolledUsers&group_id='+parseInt(groupid),
    								success:function(data2) {
    									$("#loader").attr('class', 'loader collapse');
    									populateGroupEnrollUserForExistingGroup(data2);
    									$("#loader").attr('class', 'loader');
    				    	        	$.ajax({
    				    					cache: false,
    				    					url:'/Groups?p=getGroupUnEnrolledRoles&group_id='+parseInt(groupid),
    				    					success:function(data3) {
    				    						$("#loader").attr('class', 'loader collapse');
    				    						console.log(JSON.parse(data3).length);
    				    						if((JSON.parse(data3).length) !== 0){
    				    							populateGroupUnEnrollRolesForExistingGroup(data3);
    				    							$("#loader").attr('class', 'loader');
    				    							$.ajax({
    				    								cache: false,
    				    								url:'/Groups?p=getGroupEnrolledRoles&group_id='+parseInt(groupid),
    				    								success:function(data4) {
    				    									$("#loader").attr('class', 'loader collapse');
    				    									populateGroupEnrollRolesForExistingGroup(data4);
    				    									
    				    								}	
    				    							});
    				    						}
    				    						else{
    				    							populateGroupUnEnrollRolesForExistingGroup("[]");
    				    							$("#loader").attr('class', 'loader');
    				    							$.ajax({
    				    								cache: false,
    				    								url:'/Roles?p=getAllRoles',
    				    								success:function(data5) {
    				    									$("#loader").attr('class', 'loader collapse');
    				    									populateGroupEnrollRolesForExistingGroup(data5);
    				    									
    				    								}	
    				    							});
    				    						}
    				    					}
    				    				});
    									
    								}	
    							});
    						}
    						else{
    							populateGroupUnEnrollUserForExistingGroup("[]");
    							$("#loader").attr('class', 'loader');
    							$.ajax({
    								cache: false,
    								url:'/Users?p=getAllUsers',
    								success:function(data) {
    									$("#loader").attr('class', 'loader collapse');
    									populateGroupEnrollUserForExistingGroup(data);
    									$("#loader").attr('class', 'loader');
    									$.ajax({
    				    					cache: false,
    				    					url:'/Groups?p=getGroupUnEnrolledRoles&group_id='+parseInt(groupid),
    				    					success:function(data3) {
    				    						$("#loader").attr('class', 'loader collapse');
    				    						console.log(JSON.parse(data3).length);
    				    						if((JSON.parse(data3).length) !== 0){
    				    							populateGroupUnEnrollRolesForExistingGroup(data3);
    				    							$("#loader").attr('class', 'loader');
    				    							$.ajax({
    				    								cache: false,
    				    								url:'/Groups?p=getGroupEnrolledRoles&group_id='+parseInt(groupid),
    				    								success:function(data4) {
    				    									$("#loader").attr('class', 'loader collapse');
    				    									populateGroupEnrollRolesForExistingGroup(data4);
    				    									
    				    								}	
    				    							});
    				    						}
    				    						else{
    				    							populateGroupUnEnrollRolesForExistingGroup("[]");
    				    							$("#loader").attr('class', 'loader');
    				    							$.ajax({
    				    								cache: false,
    				    								url:'/Roles?p=getAllRoles',
    				    								success:function(data5) {
    				    									$("#loader").attr('class', 'loader collapse');
    				    									populateGroupEnrollRolesForExistingGroup(data5);
    				    									
    				    								}	
    				    							});
    				    						}
    				    					}
    				    				});
    									
    								}	
    							});
    						}
    					}
    				});
    			}
    		});
        	
        	$("#edit_groups_form").attr('class', '');
        });
        
        //Close Edit Report Job Form 
        $("#edit_rptjobdiv").on('click','#close_edit_report_job',function(){
        	console.log("Close Edit Report Job");
        	$("#edit_rpt_report_job_div").attr('class', 'collapse');
        	$("#rpt_report_job_div").attr('class', '');
        });
        
        //Close Edit User Form 
        $("#edit_usr_form").on('click','#close_edit_usr',function(){
        	console.log("Close Edit Btn");
        	//$('#edt_users_form').bootstrapValidator('resetForm', true);
        	$("#edit_users_form").attr('class', 'collapse');
        	//$("#loader").attr('class', 'loader');
        	//editDSModalShow($(this).data('dsid'));
        	$("#edit_users_form #edit_user_form_role_list").css("display","none");
			$("#edit_users_form #edit_add_roles").text("Edit");
			$("#edit_users_form #edit_user_form_group_list").css("display","none");
			$("#edit_users_form #edit_add_groups").text("Edit");
        	$("#users_form").attr('class', '');
        });
        
        //Close Edit Role Form 
        $("#edit_rls_form").on('click','#close_edit_rls',function(){
        	console.log("Close Edit Btn");
        	//$('#edt_users_form').bootstrapValidator('resetForm', true);
        	$("#edit_roles_form").attr('class', 'collapse');
        	//$("#loader").attr('class', 'loader');
        	//editDSModalShow($(this).data('dsid'));
        	$("#edit_roles_form #edit_role_form_user_list").css("display","none");
			$("#edit_roles_form #edit_role_add_users").text("Edit");
			$("#edit_roles_form #edit_role_form_group_list").css("display","none");
			$("#edit_roles_form #edit_role_add_groups").text("Edit");
			$("#edit_roles_form #edit_role_form_perm_list").css("display","none");
			$("#edit_roles_form #edit_role_resource_permiss").text("Edit");
			$("#edit_roles_form #edit_role_form_srvper_list").css("display","none");
			$("#edit_roles_form #edit_role_service_permiss").text("Edit");
        	$("#roles_form").attr('class', '');
        	uncheckAllRoleEditPerm();
        	changeenrolluserid = [];
        	changeenrollgroupid = [];
        	respertotal = [];
        	srvpertotal = [];
        });
        
        //Close Edit Group Form 
        $("#edit_grp_form").on('click','#close_edit_grp',function(){
        	console.log("Close Edit Btn");
        	//$('#edt_users_form').bootstrapValidator('resetForm', true);
        	$("#edit_groups_form").attr('class', 'collapse');
        	//$("#loader").attr('class', 'loader');
        	//editDSModalShow($(this).data('dsid'));
        	$("#edit_groups_form #edit_group_form_user_list").css("display","none");
			$("#edit_groups_form #edit_grpadd_users").text("Edit");
			$("#edit_groups_form #edit_group_form_role_list").css("display","none");
			$("#edit_groups_form #edit_grpadd_roles").text("Edit");
        	$("#groups_form").attr('class', '');
        });

		//Delete User in User Form
        $("#existingusers").on('click','#usrdeletebtn',function(){
        	console.log("Delete User in User Form: "+$(this).attr("data-userid"));
        	$("#loader").attr('class', 'loader');
        	deleteUserModalShow($(this).attr("data-userid"));
        	//setEditUserFormValue($(this).attr("data-userid"));
        	//$("#edit_users_form").attr('data-userid', $(this).attr("data-userid"));
        	//$("#edit_users_form").attr('class', 'row');
        });
        
        
		//Delete Role in Role Form
        $("#existingroles").on('click','#roledeletebtn',function(){
        	console.log("Delete Role in Role Form: "+$(this).attr("data-roleid"));
        	$("#loader").attr('class', 'loader');
        	deleteRoleModalShow($(this).attr("data-roleid"));
        	//setEditUserFormValue($(this).attr("data-userid"));
        	//$("#edit_users_form").attr('data-userid', $(this).attr("data-userid"));
        	//$("#edit_users_form").attr('class', 'row');
        });
        
		//Delete Group in Group Form
        $("#existinggroups").on('click','#groupdeletebtn',function(){
        	//console.log("Delete Group in Group Form: "+$(this).attr("data-groupid"));
        	$("#loader").attr('class', 'loader');
        	deleteGroupModalShow($(this).attr("data-groupid"));
        	//setEditUserFormValue($(this).attr("data-userid"));
        	//$("#edit_users_form").attr('data-userid', $(this).attr("data-userid"));
        	//$("#edit_users_form").attr('class', 'row');
        });
        
	    
	    //Change Password Form
	    $('#changepass_form').bootstrapValidator({
	        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
	        feedbackIcons: {
	            valid: 'fa fa-check',
	            invalid: 'fa fa-remove',
	            validating: 'fa fa-refresh'
	        },
	        fields: {
	        	changePassOld: {
	                validators: {
	                    stringLength: {
	                    	min: 6,
	                    	message: 'Please supply min 6 character password'
		                },
	                    notEmpty: {
	                        message: 'Please supply current password'
	                    }
	                }
	            },
	            changePassNew: {
	            	validators:{
	                     stringLength: {
	                        min: 6,
							message: 'Please supply min 6 character password'
	                    },
	                    notEmpty: {
	                        message: 'Please supply new password'
	                    }					
					
					}
	            },
	            changePassNewRep: {
	            	validators:{
	                     stringLength: {
	                        min: 6,
							message: 'Please supply min 6 character password'
	                    },
	                    notEmpty: {
	                        message: 'Please supply confirmation password'
	                    },
	                    identical: {
	                        field: 'changePassNew',
	                        message: 'The password and its confirm are not the same'
	                    }
					}
	            }
	            
	        }
	    	}).on('success.form.bv', function(e) {
	    		$("#loader").attr('class', 'loader');
	    		$.ajax({
	    			cache: false,
	    			url:"/Users?p=changePassw",
	    			data:{pass:$("#changepass_form #changePassNewRep").val()},
	    			success:function(data) {
	    				$("#loader").attr('class', 'loader collapse');
	    				$('#changepass_form #success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
	    				$('#changepass_form #success_message').delay(2000).slideUp({ opacity: "show" }, "slow")
	    			}
	    		});

	            //Prevent form submission
	            e.preventDefault();

	            //Get the form instance
	            var $form = $(e.target);
	            console.log("Data: " + $form.serialize());

	            // Get the BootstrapValidator instance
	            //var bv = $form.data('bootstrapValidator');
				//console.log(bv);
				//$('#ds_form').toggle('500');
	            // Use Ajax to submit form data
	            //$.post($form.attr('action'), $form.serialize(), function(result) {
	            //    console.log(result);
	            //}, 'json');
	            
	            $('#changepass_form #success_message').delay(1000).slideUp({ opacity: "show" }, "slow")
	            $('#changepass_form').bootstrapValidator('resetForm', true);
	        
	    });
        
    	//DataSource Delete-Confirmation Modal Open 
        $("#existingdatasource").on('click','#dsdeletebtn',function(){
        	$("#deleteModel").attr("data-dsid",$(this).data('dsid'));
        	$("#loader").attr('class', 'loader');
        	deleteDSModalShow($(this).data('dsid'));
        });
        
    	//Edit DataSource Confirmation Modal Open 
        /*$("#existingdatasource").on('click','#dseditbtn',function(){
        	$("#editDSModal").attr("data-dsid",$(this).data('dsid'));
        	$("#loader").attr('class', 'loader');
        	editDSModalShow($(this).data('dsid'));
        });*/
        
        //DataSource Edit Save and Edit-Confirmation Model Close
        $("#editDSModal #dsmodaleditbtn").click(function(){
        	$("#loader").attr('class', 'loader');
        	var dsid = $("#editDSModal").attr("data-dsid");
        	$("#editDSModal").modal("hide");
        	dsEditFunc();
        	//$("#editDSModal").modal("hide");
        	console.log("Editedddd!!!!");
          
        });
        
        //Change Password Modal Show Click
        $("#changePassword").click(function(){
        	changePasswModalShow();
        });
        
    	//KPI Delete-Confirmation Modal Open 
        $("#existingkpi").on('click','#kpideletebtn',function(){
        	$("#deleteModel").attr("data-kpiid",$(this).data('kpiid'));
        	$("#loader").attr('class', 'loader');
        	deleteKPIModalShow($(this).data('kpiid'));
        });
               
    	//Edit KPI Confirmation Modal Open 
        /*$("#existingkpi").on('click','#kpieditbtn',function(){
        	$("#editKPIModal").attr("data-kpiid",$(this).data('kpiid'));
        	$("#loader").attr('class', 'loader');
        	editKPIModalShow($(this).data('kpiid'));
        });*/
        
        //KPI Edit Save and Edit-Confirmation Model Close
        $("#editKPIModal #kpimodaleditbtn").click(function(){
        	$("#loader").attr('class', 'loader');
        	var kpiid = $("#editKPIModal").attr("data-kpiid");
        	$("#editKPIModal").modal("hide");
        	kpiEditFunc();
        	//$("#editKPIModal").modal("hide");
        	console.log("Editedddd KPI!!!!");
          
        });
        
        //KPI Start/Stop Event
        $("#existingkpi").on('change', 'input[type="checkbox"]', function(){
        	var kpiId = $(this).parent().parent().parent().attr("data-kpiid");
        	console.log("kpiId:"+kpiId);
        	var isrunning = 0;
        	if($(this).prop("checked") == true){
        		console.log("Checked Inactive");
        		isrunning = 0;
        	}else{
        		console.log("Checked Active"); 
        		isrunning = 1;
        	}
            $("#loader").attr('class', 'loader');
            $.ajax({
				cache: false,
				url:'/Kpi?p=updateRunKpi&kpiId=' + kpiId+ '&isrunning=' + isrunning,
				success:function(data) {
					$("#loader").attr('class', 'loader collapse');
				}
			});
            
        });
        
    	//Report Delete-Confirmation Modal Open 
        $("#rptlisttbl").on('click','#rptdeletebtn',function(){
        	$("#deleteModel").attr("data-reportid",$(this).data('reportid'));
        	$("#loader").attr('class', 'loader');
        	deleteReportModalShow($(this).data('reportid'));
        });
        
    	//Report Delete-Confirmation Modal Open 
        $("#rptjoblisttbl").on('click','#rptjobdeletebtn',function(){
        	$("#deleteModel").attr("data-reportjobid",$(this).data('reportjobid'));
        	$("#loader").attr('class', 'loader');
        	deleteReportJobModalShow($(this).data('reportjobid'));
        });
        

	    function Paginate(statusFilter, pattern){
	    	if(statusFilter != undefined && statusFilter.length > 0){
	    		//console.log("URL:"+"/ServiceStatOps?p=getServiceCount&statusFilter="+statusFilter);
	    		var xurl = '/GetServiceCount?statusFilter='+statusFilter+'&spattern=' + pattern;
		    	$.ajax({
		    		cache: false,
		    		url:xurl,
		    		success:function(data) {
		    			var pageCount = Math.ceil(data / 12);
		    			//console.log("PAGE COUNT:"+pageCount);
		    			//console.log("srvBoxPageNumber:"+srvBoxPageNumber);
		    			//console.log(xurl);
		    			var visiblePages = 8;
		    			if(pageCount == 0){
		    				pageCount=1;
		    				visiblePages=1;
		    			}
		    			outerPageCount = pageCount;
		    			//console.log("Pag Total Pages:"+outerPageCount);
		    			if(pageCount < 8){
		    				visiblePages = pageCount;
		    			}
		    			if($('#pagination_servicesboxes').data("twbs-pagination"))
		    				  $('#pagination_servicesboxes').twbsPagination('destroy');
		    			if(pageCount < srvBoxPageNumber){
		    				srvBoxPageNumber=1;
		    			}

		    			$('#pagination_servicesboxes').twbsPagination({
		    				totalPages: pageCount,
		    				visiblePages: visiblePages,
		    				startPage: srvBoxPageNumber,
		    				next: 'Next',
		    				prev: 'Prev',
		    				onPageClick: OnPageClick
		    			});
		    			$("#paginationdiv").css("display","block");
		    			wheelPaging = false;
		    		}
		    	});
	    	}
	    	else{
    			if($('#pagination_servicesboxes').data("twbs-pagination"))
  				  $('#pagination_servicesboxes').twbsPagination('destroy');
	    		$('#pagination_servicesboxes').twbsPagination({
    				totalPages: 1,
    				visiblePages: 1,
    				startPage: 1,
    				next: 'Next',
    				prev: 'Prev',
    				onPageClick: OnPageClick
    			});
	    		$("#paginationdiv").css("display","none");
    			wheelPaging = false;
	    	}
	    }
	    outerPaginate = Paginate;
	    //Paginate(statusFilter);
	    
	    function SearchPaginate(statusFilter){
	    	if(statusFilter.length > 0){
	    		//console.log("URL:"+"/ServiceStatOps?p=getServiceCount&statusFilter="+statusFilter);
	    		var good = $("#checkboxdiv .btn-success .badge").text();
				var marginal = $("#checkboxdiv .btn-warning .badge").text();
				var bad = $("#checkboxdiv .btn-danger .badge").text();
				console.log("--"+good+"--"+marginal+"--"+bad);
				var countTotal = parseInt(good); 
				countTotal += parseInt(marginal);
				countTotal += parseInt(bad);
				var pageCount = Math.ceil(countTotal / 12)
    			console.log("PAGE COUNT:"+pageCount);
    			var visiblePages = 8;
    			if(pageCount == 0){
    				pageCount=1;
    				visiblePages=1;
    			}
    			outerPageCount = pageCount;
    			//console.log("Pag Total Pages:"+outerPageCount);
    			if(pageCount < 8){
    				visiblePages = pageCount;
    			}
    			if($('#pagination_servicesboxes').data("twbs-pagination"))
    				  $('#pagination_servicesboxes').twbsPagination('destroy');
    			$('#pagination_servicesboxes').twbsPagination({
    				totalPages: pageCount,
    				visiblePages: visiblePages,
    				startPage: srvBoxPageNumber,
    				next: 'Next',
    				prev: 'Prev',
    				onPageClick: OnPageClick
    			});
    			$("#paginationdiv").css("display","block");
    			wheelPaging = false;
	    	}
	    	else{
    			if($('#pagination_servicesboxes').data("twbs-pagination"))
  				  $('#pagination_servicesboxes').twbsPagination('destroy');
	    		$('#pagination_servicesboxes').twbsPagination({
    				totalPages: 1,
    				visiblePages: 1,
    				startPage: 1,
    				next: 'Next',
    				prev: 'Prev',
    				onPageClick: OnPageClick
    			});
	    		$("#paginationdiv").css("display","none");
    			wheelPaging = false;
	    	}
	    }
	    
	    outerSearchPaginate = SearchPaginate;
        
    //Page Load Definition End
	});
	
	function OnPageClick(event, page) {
        //console.log("Page number:"+page);
        srvBoxPageNumber = page;
        //$("#servicesboxes .col-md-3").remove();
        $("#searchboxes .col-md-3").remove();
        ClearIntervals();
        ChangeUrl('Business Service View', $(location).attr('origin')+'/index.jsp?page=' + srvBoxPageNumber+'&statusFilter='+statusFilter+'&spattern=' + spattern);
        outerPopulateAllServiceBoxes(srvBoxPageNumber,statusFilter,spattern);
        //$('.js-typeahead').typeahead('destroy');
        //outerPopulateAllSearchedBoxes(srvBoxPageNumber);
    }
	
	var wheelPaging = false;
	function pageOnWheel(event){
		ClearIntervals();
		if(!wheelPaging) {
			if(event.deltaY < 0 && srvBoxPageNumber > 1){
				srvBoxPageNumber--;
				wheelPaging = true;
				//console.log("IF");
			}
			else if(event.deltaY > 0 && outerPageCount > srvBoxPageNumber){
				srvBoxPageNumber++;
				wheelPaging = true;
				//console.log("ELSE");
			}
			else if(event.deltaY < 0 && srvBoxPageNumber > 1){
				wheelPaging = true;
			}
			if(wheelPaging){
				$("#servicesboxes .col-md-3").remove();
		        outerPopulateAllServiceBoxes(srvBoxPageNumber,statusFilter);
				outerPaginate(statusFilter,spattern);
				ChangeUrl('Business Service View', $(location).attr('origin')+'/index.jsp?page=' + srvBoxPageNumber+'&statusFilter='+statusFilter+'&spattern=' + spattern);
				$('#pagination_servicesboxes').twbsPagination('show', srvBoxPageNumber);
			}
		}
		
	}
	
	function ClearIntervals(){
		for (var i = 1; i < availabilityInterval; i++)
	        window.clearInterval(i);
	}
	
	var alarmTable;
	function GetServiceAlarmList(sid){
		$.fn.dataTable.ext.errMode = 'none';

		if ( $.fn.dataTable.isDataTable('#alarmtable')){
			alarmTable.destroy();
			
			alarmTable = $('#alarmtable').DataTable( {
				"processing": false,
				"serverSide": true,
		        //ajax: 'resource/alarmlist.json',
				"ajax": {
					"url":  '/AlarmOps?p=getAlarmList&sid=' + sid,
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
			    	$(row).css('backgroundColor', getAlarmStatusColor(data[4]));
			    },
			    "fnServerData": function ( sUrl, aoData, fnCallback, oSettings ) {
			        oSettings.jqXHR = $.ajax( {
			           "url":  '/AlarmOps?p=getAlarmList&sid=' + sid,
			           "data": aoData,
			           "success": function (json) {
			              if ( json.sError ) {
			                 oSettings.oApi._fnLog( oSettings, 0, json.sError );
			              }

			              console.log(json);
			              $(oSettings.oInstance).trigger('xhr', [oSettings, json]);
			              fnCallback( json );
			              
			              outerUpdateStats();
			              
			           },
			           "dataType": "json",
			           "cache": false,
			           "type": oSettings.sServerMethod,
			           "error": function (xhr, error, thrown) {
			              if ( error == "parsererror" ) {
			                 oSettings.oApi._fnLog( oSettings, 0, "DataTables warning: JSON data from "+
			                    "server could not be parsed. This is caused by a JSON formatting error." );
			              }
			           }
			        } );
			     }
		    } );
		} else {
			alarmTable = $('#alarmtable').DataTable( {
				"processing": false,
				"serverSide": true,
		        //ajax: 'resource/alarmlist.json',
				"ajax": {
					"url":  '/AlarmOps?p=getAlarmList&sid=' + sid,
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
			    	$(row).css('backgroundColor', getAlarmStatusColor(data[4]));
			    },
			    "fnServerData": function ( sUrl, aoData, fnCallback, oSettings ) {
			        oSettings.jqXHR = $.ajax( {
			           "url":  '/AlarmOps?p=getAlarmList&sid=' + sid,
			           "data": aoData,
			           "success": function (json) {
			              if ( json.sError ) {
			                 oSettings.oApi._fnLog( oSettings, 0, json.sError );
			              }
	
			              console.log(json);
			              $(oSettings.oInstance).trigger('xhr', [oSettings, json]);
			              fnCallback( json );

			              outerUpdateStats();
			           },
			           "dataType": "json",
			           "cache": false,
			           "type": oSettings.sServerMethod,
			           "error": function (xhr, error, thrown) {
			              if ( error == "parsererror" ) {
			                 oSettings.oApi._fnLog( oSettings, 0, "DataTables warning: JSON data from "+
			                    "server could not be parsed. This is caused by a JSON formatting error." );
			              }
			           }
			        } );
			     }
		    } );
		}
		
		setInterval( function () {
			alarmTable.ajax.reload(); // user paging is not reset on reload
		}, 30000 );
	}
	
	function buildAlarmTable(sid){
        $.ajax({
               cache: false,
               url:'/AlarmOps?p=getAlarmList&sid=' + sid,
               success:function(data) {
                 //console.log(data);
                 var alarmtbody = $('#alarmtable tbody');
                 alarmtbody.empty();
                 alarmListJson = JSON.parse(data);
                 if(alarmListJson.state === undefined){
                	 alarmtbody.empty();
                        $.each(alarmListJson.data, function( key, value ) {
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
                          td5.appendTo(tr);
                          var td6 = $('<td>' + value[5] + '</td>');
                          td6.appendTo(tr);
                          var td7 = $('<td>' + value[6] + '</td>');
                          td7.appendTo(tr);
                          var td8 = $('<td>' + value[7] + '</td>');
                          td8.appendTo(tr);
                          tr.css('backgroundColor', getAlarmStatusColor(value[4]));
                          tr.appendTo(alarmtbody);
                     });
                        outerUpdateStats();
                 }

               }
        });

  }
	
	function getServiceStatusValue(value){
		if(value == 0)
			return "good";
		else if(value == 5)
			return "bad";
		else
			return "marginal";
	}
	
	function getServiceStatusNumber(value){
		if(value == "good")
			return 0;
		else if(value == "bad")
			return 5;
		else
			return 3;
	}
	
	function getServiceStatusColor(value){
		if(value == 0 || value == "0")
			return "green";
		else if(value == 5 || value == "5")
			return "red";
		else
			return "orange";		
	}
	
	function getKPIStatusColor(value){
		if(value == "Good")
			return "green";
		else if(value == "Bad")
			return "red";
		else
			return "orange";
	}
	
	function getAlarmStatusColor(value){
		if(value == "Clear")
			return "green";
		else if(value == "Indeterminate")
			return "lightblue";
		else if(value == "Warning")
			return "purple";
		else if(value == "Minor")
			return "yellow";
		else if(value == "Major")
			return "orange";
		else
			return "red";
	}
	
	function openRSB(){
		//$('#page-content-wrapper .container-fluid').attr('class','container-fluid col-md-12');
		//$('#rightsidebar').attr('class', 'col-md-3');
		console.log("Height:" + $("div#contentpage").height());
		//$('#rightsidebar').height($("div#contentpage").height());
        
		// open sidebar
        $('#rightsidebar').addClass('active');
        // fade in the overlay
        //$('.contentoverlay').addClass('active');
	}
	
	function openWRSB(){
		//$('#page-content-wrapper .container-fluid').attr('class','container-fluid col-md-6');
		//$('#rightsidebar').attr('class', 'col-md-6');
		console.log("Height:" + $("div#contentpage").height());
		//$('#rightsidebar').height($("div#contentpage").height());
		
		// open sidebar
        $('#rightsidebar').removeClass('collapse').addClass('active');
        // fade in the overlay
        //$('.contentoverlay').removeClass('collapse').addClass('active');
	}
	
	function closeRSB(){
		//$('#page-content-wrapper .container-fluid').attr('class','container-fluid');
		//$('#rightsidebar').attr('class', 'collapse');
        // hide sidebar
        $('#rightsidebar').removeClass('active').addClass('collapse');
        // hide overlay
        //$('.contentoverlay').removeClass('active').addClass('collapse');
	}
	
	function clearRSB(){
		grpNodes = {};
		grpNodesName = {};
		grpNodesClone = {};
		grpNodesNameClone = {};

		activeGroupNodes = [];
		activeGroupNodesName = [];
		deactiveGroupNodes = [];
		deactiveGroupNodesName = [];

		$("#rightsidebar").empty();
	}
	
	function saveRenameNodeRSB(){
		renameNodeFunc(nodeD);
		console.log("Save Rename Node");
		console.log($("#rightsidebar #rename_node_name").val());		
	}
	
	function saveAddNodeRSB(){
		createNodeFunc(nodeD);
		console.log("Save Add Node"+nodeD.sid);
		console.log($("#rightsidebar #new_node_name").val());
		console.log($("#rightsidebar #citype").val());
	}
	
	function savenewNodeGroupRSB(){
		console.log($("#rightsidebar #new_group_name").val());
		console.log($("#rightsidebar #addweight").val());
		var groupname = $("#rightsidebar #new_group_name").val();
		var weight = $("#rightsidebar #addweight").val()

		//console.log(addNodegroupMember);
		console.log(activeGroupNodes);
		
		
		$("#loader").attr('class', 'loader');
		$.ajax({
			cache: false,
			url:'/NodeGroups?p=createNodeGroup&groupName=' + groupname + '&badweight=' + weight +'&members=' + activeGroupNodes +'&parentSid=' + nodeD.sid,
			success:function(data) {

				$.ajax({
					cache: false,
					url:'/NodeGroups?p=getNodeGroupsOfCurrentFunctionalGroup&parentSid=' + nodeD.sid,
					success:function(data1) {
						$("#loader").attr('class', 'loader collapse');
						// show manage group dialog
						
						deactiveGroupNodes = activeGroupNodes;
			    		deactiveGroupNodesName = activeGroupNodesName;
			    		activeGroupNodes = [];
			    		activeGroupNodesName = [];
			    		activeGroupId = 0;
			    		outer_update(rootNode);
						
						clearRSB();
						showManageGroupsDivRSB(nodeD, data1);
						openRSB();
				
					}
				});
			}
		});
		
	}
	
	function saveExistingNodeGroupRSB(gid){
		console.log($("#rightsidebar #update_groupname_"+gid+"").val());
		console.log($("#rightsidebar #update_badweight_"+gid+"").val());
		var groupname = $("#rightsidebar #update_groupname_"+gid+"").val();
		var weight = $("#rightsidebar #update_badweight_"+gid+"").val();

		//console.log(addNodegroupMember);
		console.log(activeGroupNodes);
		
		
		$("#loader").attr('class', 'loader');
		var updateurl = '/NodeGroups?p=updateNodeGroup&groupName=' + groupname + '&badweight=' + weight +'&members=' + activeGroupNodes +'&groupId=' + activeGroupId+'&parentSid=' + nodeD.sid;
		console.log(updateurl);
		$.ajax({
			cache: false,
			url:updateurl,
			success:function(data) {

				$.ajax({
					cache: false,
					url:'/NodeGroups?p=getNodeGroupsOfCurrentFunctionalGroup&parentSid=' + nodeD.sid,
					success:function(data1) {
						$("#loader").attr('class', 'loader collapse');
						console.log("ggggggggggggggggggggggg");
						// show manage group dialog
						
						deactiveGroupNodes = activeGroupNodes;
			    		deactiveGroupNodesName = activeGroupNodesName;
			    		activeGroupNodes = [];
			    		activeGroupNodesName = [];
			    		activeGroupId = 0;
			    		outer_update(rootNode);
						
						clearRSB();
						showManageGroupsDivRSB(nodeD, data1);
						openRSB();
						console.log("lllllllllllllllllllllll");
						
					}
				});
			}
		});
	}
	
	function deleteNodeGroupRSB(){
		console.log($("#rightsidebar #new_group_name").val());
		console.log($("#rightsidebar #addweight").val());
		var groupname = $("#rightsidebar #new_group_name").val();
		var weight = $("#rightsidebar #addweight").val()

		//console.log(addNodegroupMember);
		console.log(activeGroupNodes);

		$("#loader").attr('class', 'loader');
		$.ajax({
			cache: false,
			url:'/NodeGroups?p=deleteNodeGroup&groupId=' + activeGroupId,
			success:function(data) {

				$.ajax({
					cache: false,
					url:'/NodeGroups?p=getNodeGroupsOfCurrentFunctionalGroup&parentSid=' + nodeD.sid,
					success:function(data1) {
						$("#loader").attr('class', 'loader collapse');
						// show manage group dialog
						
						deactiveGroupNodes = activeGroupNodes;
			    		deactiveGroupNodesName = activeGroupNodesName;
			    		activeGroupNodes = [];
			    		activeGroupNodesName = [];
			    		activeGroupId = 0;
			    		outer_update(rootNode);
			    		
						clearRSB();
						showManageGroupsDivRSB(nodeD, data1);
						openRSB();
					}
				});
			}
		});
	}
	
	var nodeD;
	function createAddNodeDivRSB(d){
		nodeD = d;
		var headerdiv = $("<div></div>")
			.addClass("modal-header");
		var closediv = $("<div></div>").addClass("close").attr("id","closersb").text("x").appendTo(headerdiv);
		var hdiv = $("<h3></h3>").text("Add a Node").appendTo(headerdiv);
		
		var bodydiv = $("<div></div>")
			.addClass("modal-body");
		var innerdiv1 = $("<div></div>");
		var label1 = $("<label></label>")
			.addClass("control-label")
			.text("Parent Node Name:").appendTo(innerdiv1);
		$("<label></label>").attr("id","addNode_parentid").text(d.name).appendTo(innerdiv1);
		var innerdiv2 = $("<div></div>");
		var label2 = $("<label></label>")
			.addClass("control-label")
			.text("New Node Name:").appendTo(innerdiv2);
		$("<input>").attr("id","new_node_name").attr("placeholder","Enter Node Name").attr("type","text").appendTo(innerdiv2);
		var innerdiv3 = $("<div></div>");
		var label3 = $("<label></label>")
			.addClass("control-label")
			.text("Node CI Type:").appendTo(innerdiv3);
		var selectdiv = $("<select></select>")
			.attr("id","citype")
			.attr("class","control-label");
		selectdiv.append('<option value="">Select a CI Type</option><option value="CI.BUSINESSMAINSERVICE">CI.BUSINESSMAINSERVICE</option><option value="CI.BUSINESSSUBSERVICE">CI.BUSINESSSUBSERVICE</option>'+
			'<option value="CI.BUSINESSSERVICE">CI.BUSINESSSERVICE</option><option value="CI.BUSINESSSYSTEM">CI.BUSINESSSYSTEM</option><option value="CI.COMPUTERSYSTEM">CI.COMPUTERSYSTEM</option>'+
			'<option value="CI.IPINTERFACE">CI.IPINTERFACE</option><option value="CI.OS">CI.OS</option><option value="CI.APPSERVERCLUSTER">CI.APPSERVERCLUSTER</option>'+
			'<option value="CI.FUNCTIONALGROUP">CI.FUNCTIONALGROUP</option><option value="CI.DATABASE">CI.DATABASE</option><option value="CI.SUBNET">CI.SUBNET</option>'+
			'<option value="CI.APPSERVER">CI.APPSERVER</option><option value="CI.TRANSACTION">CI.TRANSACTION</option><option value="CI.LOADBALANCER">CI.LOADBALANCER</option>');
		selectdiv.appendTo(innerdiv3);
		innerdiv1.appendTo(bodydiv);
		innerdiv2.appendTo(bodydiv);
		innerdiv3.appendTo(bodydiv);
		
		var footerdiv = $("<div></div>")
			.addClass("modal-footer");
		$("<button></button>").addClass("btn btn-warning").attr("type","submit").attr("id","saveaddbutton").text("Save").appendTo(footerdiv);
		
		headerdiv.appendTo($("#rightsidebar"));
		bodydiv.appendTo($("#rightsidebar"));
		footerdiv.appendTo($("#rightsidebar"));		
	}
	
	function renameNodeDivRSB(d){
		nodeD = d;
		var headerdiv = $("<div></div>")
		.addClass("modal-header");
		var closediv = $("<div></div>").addClass("close").attr("id","closersb").text("x").appendTo(headerdiv);
		var hdiv = $("<h3></h3>").text("Rename Node").appendTo(headerdiv);
		
		var bodydiv = $("<div></div>")
			.addClass("modal-body");
		var innerdiv1 = $("<div></div>");
		var label1 = $("<label></label>")
			.addClass("control-label")
			.text("Node Name:").appendTo(innerdiv1);
		$("<label></label>").attr("id","current_node_name").text(d.name).appendTo(innerdiv1);
		var innerdiv2 = $("<div></div>");
		var label2 = $("<label></label>")
			.addClass("control-label")
			.text("Rename:").appendTo(innerdiv2);
		$("<input>").attr("id","rename_node_name").attr("type","text").val(d.name).appendTo(innerdiv2);
		innerdiv1.appendTo(bodydiv);
		innerdiv2.appendTo(bodydiv);
		
		var footerdiv = $("<div></div>")
			.addClass("modal-footer");
		$("<button></button>").addClass("btn btn-warning").attr("id","saverenamebutton").attr("type","submit").text("Save").appendTo(footerdiv);
		
		headerdiv.appendTo($("#rightsidebar"));
		bodydiv.appendTo($("#rightsidebar"));
		footerdiv.appendTo($("#rightsidebar"));		
	}
	
	function showAllParentDivRSB(d,data){
		console.log(d);
		$.ajax({
			cache: false,
			url:'/TreeOps?p=isEditServiceAuthorized',
			success:function(edata) {
				nodeD = d;
				var headerdiv = $("<div></div>")
				.addClass("modal-header");
				var closediv = $("<div></div>").addClass("close").attr("id","closersb").text("x").appendTo(headerdiv);
				var hdiv = $("<h3></h3>").text("CI Details").appendTo(headerdiv);

				var bodydiv = $("<div></div>")
				.addClass("modal-body");
				
				if(edata === "true") {
					var buttondiv = $("<div></div>").attr("id","savenodeweights").attr("style", "float: right;padding:10px;");
					var btn = $("<button></button>").addClass("btn btn-warning").attr("id","savenodeweightsbtn").attr("type","submit").text("Save");
					btn.appendTo(buttondiv);

					buttondiv.appendTo(bodydiv);
					
					var msgdiv = $("<div id=\"up_resultmsg\" class=\"collapse alert alert-success\"></div>").attr("style", "float: left;padding:2px;");
					msgdiv.appendTo(bodydiv);
				}

				var innerdiv1 = $("<div></div>");
				var netbl = $("<table class=\"table table-bordered\"></table>");
				var netr = $("<tr></tr>");
				$("<td class=\"bg-primary\" nowrap><label style=\"width:100px;\" nowrap>Node Name</label></td><td style=\"width:100%;\" nowrap><label nowrap>" + d.name + "</label></td>").appendTo(netr);
				netr.appendTo(netbl);
				netbl.appendTo(innerdiv1);
				
				var innerdiv15 = $("<div></div>");
				var sourcetbl = $("<table class=\"table table-bordered\"></table>");
				var sourcetr = $("<tr></tr>");
				$("<td class=\"bg-primary\" nowrap><label style=\"width:100px;\" nowrap>CI ID</label></td><td nowrap style=\"width:100%;\"><label nowrap>" + d.source_ci_id + "</label></td>").appendTo(sourcetr);
				sourcetr.appendTo(sourcetbl);
				sourcetbl.appendTo(innerdiv15);

				var innerdiv2 = $("<div></div>");
				var citbl = $("<table class=\"table table-bordered\"></table>");
				var citr = $("<tr></tr>");
				$("<td class=\"bg-primary\" nowrap><label style=\"width:100px;\" nowrap>CI Type</label></td><td nowrap style=\"width:100%;\"><label nowrap>" + d.citype + "</label></td>").appendTo(citr);
				citr.appendTo(citbl);
				citbl.appendTo(innerdiv2);
				
				
				var modetbl = $("<table class=\"table table-bordered\"></table>");
				var modetr = $("<tr></tr>");
				var compmodel = d.compmodel;
				if(compmodel === null || compmodel === "null")
					compmodel = "STANDARD";
				
				if(compmodel === "STANDART")
					compmodel = "STANDARD";
				if(compmodel === "WEIGHTED_CLUSTER")
					compmodel = "CLUSTER";
				
				var compselect = $('<select class=\"bg-warning-weightselect\" id="compmodel" class="input"></select>');
				$('<option value="STANDARD">STANDARD</option>').appendTo(compselect);
				$('<option value="CLUSTER">CLUSTER</option>').appendTo(compselect);
				compselect.val(compmodel);
				
				var comptd1 = $('<td nowrap class="bg-primary"><label style=\"width:100px;\" nowrap>Comp.Model</label></td>');
				var comptd2 = $('<td style=\"width:100%;\"></td>');
				
				if(edata === "true") {
					compselect.appendTo(comptd2);
				}
				else{
					$('<label>' + compmodel + '</label>').appendTo(comptd2);
				}
				
				comptd1.appendTo(modetr);
				comptd2.appendTo(modetr);
				modetr.appendTo(modetbl);
				modetbl.appendTo(innerdiv2);
				
				var outputruletbl = $("<table class=\"table table-bordered\"></table>");
				var outputheader = $("<tr class=\"bg-primary\"></tr>");
				$("<td nowrap><label style=\"width:150px;\" nowrap>Output Rules</label></td><td nowrap><label style=\"width:150px;\" nowrap>Child Weight</label></td>").appendTo(outputheader);
				outputheader.appendTo(outputruletbl);
				
				var badbadtd = $('<td></td>');
				var badmarginaltd = $('<td></td>');
				var marginalbadtd = $('<td></td>');
				var marginalmarginaltd = $('<td></td>');
				if(edata === "true") {
					$('<input class=\"bg-warning-weightinput\" type="text" id="badbad" value="' + parseInt(d.badbad) + '" />').appendTo(badbadtd);
					$('<input class=\"bg-warning-weightinput\" type="text" id="badmarginal" value="' + parseInt(d.badmarginal) + '" />').appendTo(badmarginaltd);
					$('<input class=\"bg-warning-weightinput\" type="text" id="marginalbad" value="' + parseInt(d.marginalbad) + '" />').appendTo(marginalbadtd);
					$('<input class=\"bg-warning-weightinput\" type="text" id="marginalmarginal" value="' + parseInt(d.marginalmarginal) + '" />').appendTo(marginalmarginaltd);
				}
				else{
					$('<label id="badbad">' + parseInt(d.badbad) + '</label>').appendTo(badbadtd);
					$('<label id="badmarginal">' + parseInt(d.badmarginal) + '</label>').appendTo(badmarginaltd);
					$('<label id="marginalbad">' + parseInt(d.marginalbad) + '</label>').appendTo(marginalbadtd);
					$('<label id="marginalmarginal">' + parseInt(d.marginalmarginal) + '</label>').appendTo(marginalmarginaltd);
				}

				console.log(d.marginalmarginal);
				var rtr1 = $("<tr></tr>");
				$("<td nowrap><label nowrap class=\"info\">Bad-Bad</label></td>").appendTo(rtr1);
				badbadtd.appendTo(rtr1);
				
				var rtr2 = $("<tr></tr>");
				$("<td nowrap><label nowrap>Bad-Marginal</label></td>").appendTo(rtr2);
				badmarginaltd.appendTo(rtr2);
				
				var rtr3 = $("<tr></tr>");
				$("<td nowrap><label nowrap>Marginal-Bad</label></td>").appendTo(rtr3);
				marginalbadtd.appendTo(rtr3);
				
				var rtr4 = $("<tr></tr>");
				$("<td nowrap><label nowrap>Marginal-Marginal</label></td>").appendTo(rtr4);
				marginalmarginaltd.appendTo(rtr4);
				
				rtr1.appendTo(outputruletbl);
				rtr2.appendTo(outputruletbl);
				rtr3.appendTo(outputruletbl);
				rtr4.appendTo(outputruletbl);

				outputruletbl.appendTo(innerdiv2);

				var label2 = $("<label></label>")
				.addClass("control-label")
				.text("Parent List:").appendTo(innerdiv2);
				
				var parenttbl = $("<table class=\"table table-bordered\"></table>");
				var parentheader = $("<tr class=\"bg-primary\"></tr>");
				$("<td nowrap><label nowrap>Impact Weight</label></td><td nowrap><label nowrap>Parent</label></td>").appendTo(parentheader);
				parentheader.appendTo(parenttbl);
				$.each( JSON.parse(data), function( key, value ) {
					var ttr = $("<tr></tr>");
					if(d.parent != undefined) {
						if(edata === "true") {
							if(parseInt(value.id) === parseInt(d.parent.sid)){
								$("<td><input class=\"bg-warning-weightinput\" type=\"text\" id=\"relation_weight\" value=\"" + value.relation_weight + "\" /></td><td><label>" + value.name + "</label></td>").appendTo(ttr);
							}
							else{
								$("<td><label>" + value.relation_weight + "</label></td><td><label>" + value.name + "</label></td>").appendTo(ttr);
							}
						}
						else{
							$("<td><label>" + value.relation_weight + "</label></td><td><label>" + value.name + "</label></td>").appendTo(ttr);
						}
					}
					ttr.appendTo(parenttbl);
					//$("<label></label>").attr("data-id",value.id).text(value.relation_weight + " " + value.name).appendTo(innerdiv2);
					  console.log( value.name + ": " + value );
				});
				parenttbl.appendTo(innerdiv2);
				innerdiv1.appendTo(bodydiv);
				innerdiv15.appendTo(bodydiv);
				innerdiv2.appendTo(bodydiv);

				headerdiv.appendTo($("#rightsidebar"));
				bodydiv.appendTo($("#rightsidebar"));
				//footerdiv.appendTo($("#rightsidebar"));

				if(edata === "true") {
					$('#savenodeweightsbtn').click(function(){
						var psid = 0;
						var relationweight = 0;
						if(d.parent != undefined)
							psid = d.parent.sid;
						
						if($('#relation_weight').val() != undefined)
							relationweight = $('#relation_weight').val();
						
						var uuu = '/TreeOps?p=updateNodeOutputWeights&sid=' + d.sid + '&compmodel=' + $('#compmodel').val() + '&badbad=' + $('#badbad').val() + '&badmarginal=' + $('#badmarginal').val() + '&marginalbad=' + $('#marginalbad').val() + '&marginalmarginal=' + $('#marginalmarginal').val() + '&relationweight=' + relationweight + '&parentsid=' + psid;
						console.log(uuu);
						
						$("#loader").attr('class', 'loader');
						$.ajax({
							cache: false,
							url:uuu,
							success:function(udata) {
								$("#loader").attr('class', 'loader collapse');
								
								d.badbad = $('#badbad').val();
								d.badmarginal = $('#badmarginal').val();
								d.marginalbad = $('#marginalbad').val();
								d.marginalmarginal = $('#marginalmarginal').val();
								d.compmodel = $('#compmodel').val();
								console.log(udata);
								var outputdat = JSON.parse(udata);
								$('#up_resultmsg').text(outputdat.message);
								$('#up_resultmsg').removeClass('collapse');
								$('#up_resultmsg').attr('style', "display: block;");
								$('#up_resultmsg').delay(2000).slideUp({ opacity: "show" }, "slow");
							}
						});
					});
				}
				
			}
		});
		
	}
	
	var grpNodesClone = {};
	var grpNodesNameClone = {};
	var activeGroupId = 0;
	function showManageGroupsDivRSB(d, data){
		console.log("showmanagedgroupDivs");
		nodeD=d;
		var jsonData = JSON.parse(data);
		
		var headerdiv = $("<div></div>")
		.addClass("modal-header");
		var closediv = $("<div></div>").addClass("close").attr("id","closersb").text("x").appendTo(headerdiv);
		var hdiv = $("<h2></h2>").text("Group Management").appendTo(headerdiv);
		
		var bodydiv = $("<div></div>")
		.addClass("modal-body");
		var innerdiv1 = $("<div></div>");
		var label1 = $("<label></label>")
			.addClass("control-label")
			.text("Node Name:").appendTo(innerdiv1);
		$("<label></label>").attr("id","current_node_name").text(d.name).appendTo(innerdiv1);
		innerdiv1.appendTo(bodydiv);
		//console.log("Relation data:"+data);
		//console.log("Relation Member Lenght:"+jsonData.length);
		if(jsonData.length !== 0){
			var groupdiv = $("<div></div>");
			var h2div = $("<label></label>").text("Group List:").appendTo(groupdiv);
			$.each(jsonData, function(key,value){
				var containerdivcurrent = $("<div></div>").addClass("containerGRSB");
				var headercollapsecurrent = $("<div></div>").addClass("headercollapse").attr("data-header",value.group_name).attr("data-gid", value.node_group_id);
				$("<span></span>").text(value.group_name).appendTo(headercollapsecurrent);
				headercollapsecurrent.appendTo(containerdivcurrent);
				var contentcollapsedivcurrent = $("<div></div>").addClass("contentcollapse");
				var label11 = $("<label></label>")
					.addClass("control-label")
					.text("Group Name:").appendTo(contentcollapsedivcurrent);
				$("<input>").attr("id","update_groupname_"+value.node_group_id).attr("placeholder",value.group_name).attr("type","text").val(value.group_name).appendTo(contentcollapsedivcurrent);
				var label21 = $("<label></label>")
				.addClass("control-label")
				.text("Weight:").appendTo(contentcollapsedivcurrent);
				$("<input>").attr("id","update_badweight_"+value.node_group_id).attr("placeholder",value.bad_weight).attr("type","text").val(value.bad_weight).appendTo(contentcollapsedivcurrent);
				contentcollapsedivcurrent.appendTo(containerdivcurrent);
				var innerdivcurrent = $("<div></div>").attr("id","groupmemberdiv");
				var label31 = $("<label></label>")
				.addClass("control-label")
				.text("Members:").appendTo(innerdivcurrent);
				$.each(value.members, function(key,value2){
					if(grpNodes[value.group_name] === undefined){
						grpNodes[value.group_name] = [];
					}
					grpNodes[value.group_name].push(parseInt(value2.sid));
					
					if(grpNodesClone[value.group_name] === undefined){
						grpNodesClone[value.group_name] = [];
					}
					grpNodesClone[value.group_name].push(parseInt(value2.sid));
					
					if(grpNodesName[value.group_name] === undefined){
						grpNodesName[value.group_name] = [];
					}
					grpNodesName[value.group_name].push(value2.servicename);
					
					if(grpNodesNameClone[value.group_name] === undefined){
						grpNodesNameClone[value.group_name] = [];
					}
					grpNodesNameClone[value.group_name].push(value2.servicename);

					/*var label41 = $("<label></label>")
					.addClass("control-label")
					.attr("node-name",value2.servicename)
					.attr("node-id",value2.sid)
					.text(value2.servicename).appendTo(innerdivcurrent);*/
					
				});
				innerdivcurrent.appendTo(contentcollapsedivcurrent);
				var buttondivcurrent = $("<div></div>").attr("id","existinggroupbutton");
				$("<button></button>").addClass("btn btn-warning").attr("id","saveexistinggroup").attr("type","submit").text("Save").appendTo(buttondivcurrent);
				$("<button></button>").addClass("btn btn-danger").attr("id","deleteexistinggroup").attr("type","submit").text("Delete").appendTo(buttondivcurrent);
				
				buttondivcurrent.appendTo(contentcollapsedivcurrent);
				contentcollapsedivcurrent.appendTo(containerdivcurrent);
				containerdivcurrent.appendTo(groupdiv);
		   });
			
			groupdiv.appendTo(bodydiv);
			
		}
		
		else{
			$("<label></label>")
			.addClass("control-label")
			.text("There are no groups created on this node!").appendTo(bodydiv);
		}
		
		var containerdiv = $("<div></div>").addClass("containerGRSB").attr("id","addCreateNewGroup");
		var headercollapse = $("<div></div>").addClass("headercollapse");
		$("<span></span>").text("Create a New Group").appendTo(headercollapse);
		headercollapse.appendTo(containerdiv);
		var contentcollapsediv = $("<div></div>").addClass("contentcollapse");
		var label2 = $("<label></label>")
			.addClass("control-label")
			.text("Group Name:").appendTo(contentcollapsediv);
		$("<input>").attr("id","new_group_name").attr("placeholder","Enter Group Name").attr("type","text").appendTo(contentcollapsediv);
		var label3 = $("<label></label>")
		.addClass("control-label")
		.text("Weight:").appendTo(contentcollapsediv);
		$("<input>").attr("id","addweight").attr("placeholder","Enter Weight").attr("type","text").appendTo(contentcollapsediv);
		contentcollapsediv.appendTo(containerdiv);
		var innerdiv2 = $("<div></div>").attr("id","groupmemberdiv");
		var label4 = $("<label></label>")
		.addClass("control-label")
		.text("Selected Members:").appendTo(innerdiv2);
		var buttondiv = $("<div></div>").attr("id","savegroupbutton");
		$("<button></button>").addClass("btn btn-warning").attr("id","savenewgroup").attr("type","submit").text("Save").appendTo(buttondiv);

		
		innerdiv2.appendTo(contentcollapsediv);
		buttondiv.appendTo(contentcollapsediv);
		contentcollapsediv.appendTo(containerdiv);
		containerdiv.appendTo(bodydiv);
		
		headerdiv.appendTo($("#rightsidebar"));
		bodydiv.appendTo($("#rightsidebar"));
		
	}
	
	function showdailyChartDivRSB(d,queryType){
		//Chart.defaults.global.defaultFontFamily = "Lato";
		//Chart.defaults.global.defaultFontSize = 18;
		
		nodeD = d;
		var headerdiv = $("<div></div>")
		.addClass("modal-header");
		var closediv = $("<div></div>").addClass("close").attr("id","closersb").text("x").appendTo(headerdiv);
		var hdiv = $("<h3></h3>").text("Daily Availability (Last 7 Days)").appendTo(headerdiv);
		
		var bodydiv = $("<div></div>")
			.addClass("modal-body");
		var innerdiv1 = $("<div></div>");
		$("<label></label>").text("Node Name:").appendTo(innerdiv1);
		$("<label></label>").attr("id","chart_node_name").text(d.name).appendTo(innerdiv1);
		var innerdiv2 = $("<div></div>");
		var chart = $("<canvas></canvas>")
			.attr("id","dailychart")
			.attr("width","400")
			.attr("height","200").appendTo(innerdiv2);

		innerdiv1.appendTo(bodydiv);
		innerdiv2.appendTo(bodydiv);
		
		headerdiv.appendTo($("#rightsidebar"));
		bodydiv.appendTo($("#rightsidebar"));	
		
		var chartData = {
				  label: '(%)',
				  data: [90, 99, 100, 95, 97,95,90],
		            backgroundColor: "#EEE",
		            borderWidth: 1,
		            hoverBackgroundColor: "rgba(232,105,90,0.8)",
		            hoverBorderColor: "orange",
		            scaleStepWidth: 1,
		};

		$("#loader").attr('class', 'loader');
		$.ajax({
			cache: false,
			url:'/Chart?p=getChart&sid=' + d.sid + '&queryType=' + queryType,
			success:function(data) {
				console.log(data);
				$("#loader").attr('class', 'loader collapse');
				var barChart = new Chart($("#dailychart"), JSON.parse(data));
			}
		});

	}
	
	function showdataSourceList(data, isEditDSAuthorized){
		console.log("isEditDSAuthorized " + isEditDSAuthorized);
		
		if(isEditDSAuthorized === "false") {
			$('#datasource_form_def_open_close').attr('style', 'display:none;');
		} else {
			$('#datasource_form_def_open_close').attr('style', '');
		}
		
		$.each(JSON.parse(data), function(key,value) {
			  var trdiv = $("<tr></tr>").attr("data-sid",value.dsid);
			  $("<td></td>").text(value.dsname).appendTo(trdiv);
			  $("<td></td>").text(value.dstype).appendTo(trdiv);
			  $("<td></td>").text(value.host).appendTo(trdiv);
			  $("<td></td>").text(value.port).appendTo(trdiv);
			  $("<td></td>").text(value.dbname).appendTo(trdiv);
			  $("<td></td>").text(value.username).appendTo(trdiv);
			  var actioncol = $("<td></td>");
			  
			  if(isEditDSAuthorized === "true") {
				  //var btn1 = $("<button></button>").addClass("btn btn-primary btn-xs").attr("btn-type","edit").attr('onClick', 'dsEditFunc(\''+value.dsid+'\');');
				  var btn1 = $("<button></button>").addClass("btn btn-primary").attr("id","dseditbtn").attr("btn-type","edit").attr("data-dsid",value.dsid);
				  $("<span></span>").addClass("fa fa-edit").appendTo(btn1);
				  btn1.appendTo(actioncol);
				  actioncol.append(" ");
				  //var btn2 = $("<button></button>").addClass("btn btn-danger btn-xs").attr("btn-type","delete").attr('onClick', 'dsDeleteFunc(\''+value.dsid+'\');');
				  var btn2 = $("<button></button>").addClass("btn btn-danger").attr("id","dsdeletebtn").attr("btn-type","delete").attr("data-dsid",value.dsid);
				  $("<span></span>").addClass("fa fa-trash-o").appendTo(btn2);
				  btn2.appendTo(actioncol);
				  actioncol.append(" ");
			  }
			  
			  actioncol.appendTo(trdiv);
			  trdiv.appendTo($("#datasource_form #existingdatasource tbody"));
		});
	}
	
	function showMaintenanceList(data){
		$.each(JSON.parse(data), function(key,value) {
			  var trdiv = $("<tr></tr>").attr("data-mid",value.mid);
			  
			  var delselectcol = $("<td><label id=\"mainselectlabel\"><input type=\"checkbox\" name=\"checkAll\" class=\"checkSingleMain\" /></label></td>");
			  delselectcol.appendTo(trdiv);
			  
			  var titletd = $("<td></td>").text(value.title + " ");
			  
			  var srvNames = "";
			  var srvList = value.serviceList;
			  $.each(srvList, function(key,srvval) {
					srvNames = srvNames + srvval.sname + "\n";
			  });
			  var sharedsrvSpan = $('<span title=\"' + srvNames + '\"></span>').attr('class', 'fa fa-share-alt');
			  sharedsrvSpan.appendTo(titletd);
			  titletd.appendTo(trdiv);
			  //$("<td></td>").text(value.sname).appendTo(trdiv);
			  $("<td></td>").text(value.startDateStr).appendTo(trdiv);
			  $("<td></td>").text(value.endDateStr).appendTo(trdiv);
			  $("<td></td>").text(value.rfcid).appendTo(trdiv);
			  $("<td></td>").text(value.createdby).appendTo(trdiv);
			  var actioncol = $("<td></td>");
			  
			  var divedit = $('<span id="maineditbtn" class=\"btn btn-success fa fa-edit\" />');
			  divedit.attr("data-mid",value.mid);
			  divedit.appendTo(actioncol);
			  actioncol.append(" ");
			  var divdelete = $('<span id="maindeletebtn" class=\"btn btn-danger fa fa-trash-o\" />');
			  divdelete.attr("data-mid",value.mid);
			  divdelete.appendTo(actioncol);
			  
			  actioncol.appendTo(trdiv);
			  trdiv.appendTo($("#m_form #existingmaintenance tbody"));
		});
		//console.log($("#maintenance_delete_icon").css('display'));
		if( $("#maintenance_delete_icon").css('display').toLowerCase() == 'inline-table') {
			$("#maintenance_delete_icon").css("display","none");
            $("#m_form h2").css("width","90%");
		}
		console.log("Show List ok!!!!");
	}
	
	function showEventcatalogList(data){
		$.each(JSON.parse(data), function(key,value) {
		  var trdiv = $("<tr></tr>").attr("data-ecid",value.event_id);
		  
		  /*var divselect = $("<span></span>").attr("id","eventselectbtn");
		  divselect.addClass("custcheckbox");
		  divselect.attr("data-ecid",value.event_id);
		  var selectlabel = $("<label></label>");
		  $("<input></input>").attr("type","checkbox").attr("id","selecteventcheckbox").appendTo(selectlabel);
		  $('<span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>').appendTo(selectlabel);
		  selectlabel.appendTo(divselect);
		  var delselectcol = $("<td></td>");
		  divselect.appendTo(delselectcol);
		  delselectcol.appendTo(trdiv);*/
		  
		  /*var labelselect = $("<label></label>").attr("id","eventselectlabel");
		  var checkinput = $("<input></input>").attr("type","checkbox").attr("name","checkAll");
		  checkinput.addClass("checkSingle");
		  checkinput.appendTo(labelselect);
		  var delselectcol = $("<td></td>");
		  labelselect.appendTo(delselectcol);*/
		  var delselectcol = $("<td><label id=\"eventselectlabel\"><input type=\"checkbox\" name=\"checkAll\" class=\"checkSingleEvent\" /></label></td>");
		  delselectcol.appendTo(trdiv);
		  
		  $("<td><span title=\"" + value.event_name + "\">" + Truncate(value.event_name, 30) + "</span></td>").appendTo(trdiv);
		  $("<td><span title=\"" + value.affected_node + "\">" + Truncate(value.affected_node, 30) + "</span></td>").appendTo(trdiv);
		  $("<td><span title=\"" + value.source_ci_id + "\">" + value.source_ci_id + "</span></td>").appendTo(trdiv);
		  if(value.event_impact == "43"){
			  $("<td></td>").text("Marginal").appendTo(trdiv);
		  }
		  else if(value.event_impact == "63"){
			  $("<td></td>").text("Bad").appendTo(trdiv);
		  }
		  else{
			  $("<td></td>").text("Undefined").appendTo(trdiv);
		  }
		  $("<td></td>").text(value.department).appendTo(trdiv);
		  $("<td></td>").text(value.createdby).appendTo(trdiv);
		  var actioncol = $("<td></td>");
		  
		  var divedit = $('<span id="eventeditbtn" class=\"btn btn-success fa fa-edit\" />');
		  divedit.attr("data-ecid",value.event_id);
		  divedit.appendTo(actioncol);
		  actioncol.append(" ");
		  
		  var divdelete = $('<span id="eventdeletebtn" class=\"btn btn-danger fa fa-trash-o\" />');
		  divdelete.attr("data-ecid",value.event_id);
		  divdelete.appendTo(actioncol);
		  
		  actioncol.appendTo(trdiv);
		  
		  trdiv.appendTo($("#ec_form #existingeventcatalog tbody"));
		});
		if( $("#event_delete_icon").css('display').toLowerCase() == 'inline-table') {
			$("#event_delete_icon").css("display","none");
            $("#ec_form h2").css("width","90%");
		}
		console.log("Show List ok!!!!");
	}
	
	function showUserList(data){
		$.each(JSON.parse(data), function(key,value) {
			  var trdiv = $("<tr></tr>").attr("data-userid",value.userid);
			  $("<td></td>").text(value.username).appendTo(trdiv);
			  $("<td></td>").text(value.firstName).appendTo(trdiv);
			  $("<td></td>").text(value.lastName).appendTo(trdiv);
			  var editcol = $("<td></td>");
			  var btn1 = $("<button></button>").addClass("btn btn-primary btn-xs").attr("id","usreditbtn").attr("btn-type","edit").attr("data-userid",value.userid);
			  $("<span></span>").addClass("fa fa-edit").appendTo(btn1);
			  btn1.appendTo(editcol);
			  var deletecol = $("<td></td>");
			  var btn2 = $("<button></button>").addClass("btn btn-danger btn-xs").attr("id","usrdeletebtn").attr("btn-type","delete").attr("data-userid",value.userid);
			  $("<span></span>").addClass("fa fa-trash-o").appendTo(btn2);
			  btn2.appendTo(deletecol);
			  
			  editcol.appendTo(trdiv);
			  deletecol.appendTo(trdiv);
			  trdiv.appendTo($("#users_form #existingusers tbody"));
		});
	}
	
	function populateUserRoleForNewUser(data){
		$('#users_form #user_form_role_list #role_list option').remove();
		$.each(JSON.parse(data),function(key,value){
			$("<option></option>").text(value.role_name).val(value.role_id).appendTo($("#users_form #user_form_role_list #role_list"));			
		});
		$('#user_form_role_list #role_list').multiselect('destroy');
		$('#user_form_role_list #role_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Roles</div>",
			selectionHeader: "<div class='custom-header'>Selected Roles</div>",
		});	
	}
	
	//Create user populate groups in selection box
	function populateUserGroupsForNewUser(data){
		$('#users_form #user_form_group_list #group_list option').remove();
		$.each(JSON.parse(data),function(key,value){
			$("<option></option>").text(value.group_name).val(value.group_id).appendTo($("#users_form #user_form_group_list #group_list"));			
		});
		$('#user_form_group_list #group_list').multiselect('destroy');
		$('#user_form_group_list #group_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Groups</div>",
			selectionHeader: "<div class='custom-header'>Selected Groups</div>",
		});
		
	}
	
	//Existing user populate enrolled roles in selection box
	function populateUserEnrollRoleForExistingUser(data){
		enrollroleid = [];
		var jsonData = JSON.parse(data);
		console.log("jsondataenrolled:"+jsonData);
		$.each(jsonData,function(key,value){
			var rolename = value.role_name;
			var roleid = value.role_id;
			$("<option></option>").text(rolename).val(roleid).appendTo($("#edit_users_form #edit_user_form_role_list #edit_role_list"));
			enrollroleid.push(roleid);
			//$('#edit_user_form_role_list #edit_role_list').multiSelect('select',['\''+roleid+'\'']);
		});
		//$('#edit_user_form_role_list #edit_role_list').multiSelect('refresh');
		$('#edit_user_form_role_list #edit_role_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Roles</div>",
			selectionHeader: "<div class='custom-header'>Selected Roles</div>",
			//select:enrollroleid.map(function(e){return e.toString()}),
			//deselect:unenrollroleid.map(function(e){return e.toString()}),
		});
		$('#edit_user_form_role_list #edit_role_list').multiSelect("select",enrollroleid.map(function(e){return e.toString()})); 
		//console.log("Enrolled:"+enrollroleid);
		//console.log("UnEnrolled:"+unenrollroleid);
		
	}
	
	//Existing user populate unerrolled roles in selection box
	function populateUserUnEnrollRoleForExistingUser(data){
		unenrollroleid = [];
		$('#edit_user_form_role_list #edit_role_list').multiselect('destroy');
		$('#edit_users_form #edit_user_form_role_list #edit_role_list option').remove();
		var jsonData = JSON.parse(data)
		$.each(jsonData,function(key,value){
			var rolename = value.role_name;
			var roleid = value.role_id;
			$("<option></option>").text(rolename).val(roleid).appendTo($("#edit_users_form #edit_user_form_role_list #edit_role_list"));
			unenrollroleid.push(roleid);
			//$('#edit_user_form_role_list #edit_role_list').multiSelect('deselect',['\''+roleid+'\'']);
			//$('#edit_user_form_role_list #edit_role_list').multiSelect('refresh');
		});
		/*$('#edit_user_form_role_list #edit_role_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Roles</div>",
			selectionHeader: "<div class='custom-header'>Selected Roles</div>",
			deselect:unenrollroleid,
		});*/
	}
	
	//Existing user populate errolled groups in selection box
	function populateUserEnrollGroupForExistingUser(data){
		enrollgroupid = [];
		var jsonData = JSON.parse(data)
		console.log("jsondataenrolledgroup:"+jsonData);
		$.each(jsonData,function(key,value){
			var groupname = value.group_name;
			var groupid = value.group_id;
			$("<option></option>").text(groupname).val(groupid).appendTo($("#edit_users_form #edit_user_form_group_list #edit_group_list"));
			enrollgroupid.push(groupid);
			//$('#edit_user_form_role_list #edit_role_list').multiSelect('select',['\''+roleid+'\'']);
		});
		//$('#edit_user_form_role_list #edit_role_list').multiSelect('refresh');
		$('#edit_user_form_group_list #edit_group_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Groups</div>",
			selectionHeader: "<div class='custom-header'>Selected Groups</div>",
		});
		$('#edit_user_form_group_list #edit_group_list').multiSelect("select",enrollgroupid.map(function(e){return e.toString()})); 
		
	}

	//Existing user populate unerrolled groups in selection box
	function populateUserUnEnrollGroupForExistingUser(data){
		unenrollgroupid = [];
		$('#edit_user_form_group_list #edit_group_list').multiselect('destroy');
		$('#edit_users_form #edit_user_form_group_list #edit_group_list option').remove();
		var jsonData = JSON.parse(data)
		$.each(jsonData,function(key,value){
			var groupname = value.group_name;
			var groupid = value.group_id;
			$("<option></option>").text(groupname).val(groupid).appendTo($("#edit_users_form #edit_user_form_group_list #edit_group_list"));
			unenrollgroupid.push(groupid);
		});
	}
	
	//Existing role populate unenrolled users in selection box
	function populateRoleUnEnrollUserForExistingRole(data){
		unenrolluserid = [];
		$('#edit_role_form_user_list #edit_role_form_select_user_list').multiselect('destroy');
		$('#edit_roles_form #edit_role_form_user_list #edit_role_form_select_user_list option').remove();
		var jsonData = JSON.parse(data)
		$.each(jsonData,function(key,value){
			var username = value.username;
			var userid = value.userid;
			$("<option></option>").text(username).val(userid).appendTo($("#edit_roles_form #edit_role_form_user_list #edit_role_form_select_user_list"));
			unenrolluserid.push(userid);
		});
	}
	
	//Existing role populate enrolled users in selection box
	function populateRoleEnrollUserForExistingrole(data){
		enrolluserid = [];
		var jsonData = JSON.parse(data);
		$.each(jsonData,function(key,value){
			var username = value.username;
			var userid = value.userid;
			$("<option></option>").text(username).val(userid).appendTo($("#edit_roles_form #edit_role_form_user_list #edit_role_form_select_user_list"));
			enrolluserid.push(userid);
		});
		$('#edit_role_form_user_list #edit_role_form_select_user_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Users</div>",
			selectionHeader: "<div class='custom-header'>Selected Users</div>",
		});
		$('#edit_role_form_user_list #edit_role_form_select_user_list').multiSelect("select",enrolluserid.map(function(e){return e.toString()})); 
		
	}
	
	//Existing role populate unenrolled users in selection box with ldap
	function populateRoleUnEnrollUserForExistingRoleLDAP(data){
		unenrolluserid = [];
		$('#edit_role_form_user_list #edit_role_form_select_user_list').multiselect('destroy');
		$('#edit_roles_form #edit_role_form_user_list #edit_role_form_select_user_list option').remove();
		var jsonData = JSON.parse(data);
		$.each(jsonData,function(key,value){
			var username = value.username;
			var userid = value.userid;
			$("<option></option>").text(username).val(userid).appendTo($("#edit_roles_form #edit_role_form_user_list #edit_role_form_select_user_list"));
			unenrolluserid.push(userid);
		});
		//$("<option></option>").text("testname").val(6666).appendTo($("#edit_roles_form #edit_role_form_user_list #edit_role_form_select_user_list"));
		console.log("Unenrrolll:"+unenrolluserid);
	 
	}
	
	//Existing role populate enrolled users in selection box
	function populateRoleEnrollUserForExistingroleLDAP(data){
		enrolluserid = [];
		var jsonData = JSON.parse(data);
		$.each(jsonData,function(key,value){
			var username = value.username;
			var userid = value.userid;
			$("<option></option>").text(username).val(userid).appendTo($("#edit_roles_form #edit_role_form_user_list #edit_role_form_select_user_list"));
			enrolluserid.push(userid);
		});
		console.log("Enrolll:"+enrolluserid);
		$('#edit_role_form_user_list #edit_role_form_select_user_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Users</div>",
			selectionHeader: "<div class='custom-header'>Selected Users</div>",
		});
		$('#edit_role_form_user_list #edit_role_form_select_user_list').multiSelect("select",enrolluserid.map(function(e){return e.toString()}));
		$("#edit_role_form_user_list .search-container input").val("");
		
	}
	
	//Existing role populate enrolled groups in selection box
	function populateRoleEnrollServiceForExistingRole(data){
		//console.log('populateRoleEnrollServiceForExistingRole ' + data);
		enrollservices = [];
		var jsonData = JSON.parse(data)
		$.each(jsonData,function(key,value){
			var sname = value.service_instance_name;
			var sid = value.service_instance_id;
			
			if(sid === 0){
				$('#edit_role_form_select_srvperm_list').multiSelect('select_all');
				return false;
			}
			
			$("<option></option>").text(sname).val(sid).appendTo($("#edit_roles_form #edit_role_form_srvper_list #edit_role_form_select_srvperm_list"));
			enrollservices.push(sid);
		});
		$('#edit_role_form_srvper_list #edit_role_form_select_srvperm_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Services</div>",
			selectionHeader: "<div class='custom-header'>Selected Services</div>",
		});
		$('#edit_role_form_srvper_list #edit_role_form_select_srvperm_list').multiSelect("select",enrollservices.map(function(e){return e.toString()})); 
		
	}

	//Existing role populate unenrolled groups in selection box
	function populateRoleUnEnrollServiceForExistingRole(data){
		//console.log('populateRoleUnEnrollServiceForExistingRole ' + data);
		unenrollservices = [];
		$('#edit_role_form_srvper_list #edit_role_form_select_srvperm_list').multiselect('destroy');
		$('#edit_roles_form #edit_role_form_srvper_list #edit_role_form_select_srvperm_list option').remove();
		var jsonData = JSON.parse(data)
		$.each(jsonData,function(key,value){
			var sname = value.service_instance_name;
			var sid = value.service_instance_id;
			$("<option></option>").text(sname).val(sid).appendTo($("#edit_roles_form #edit_role_form_srvper_list #edit_role_form_select_srvperm_list"));
			unenrollservices.push(sid);
		});
	}
	
	//Existing role populate enrolled groups in selection box
	function populateRoleEnrollGroupForExistingRole(data){
		enrollgroupid = [];
		var jsonData = JSON.parse(data)
		$.each(jsonData,function(key,value){
			var groupname = value.group_name;
			var groupid = value.group_id;
			$("<option></option>").text(groupname).val(groupid).appendTo($("#edit_roles_form #edit_role_form_group_list #edit_role_form_select_group_list"));
			enrollgroupid.push(groupid);
		});
		$('#edit_role_form_group_list #edit_role_form_select_group_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Groups</div>",
			selectionHeader: "<div class='custom-header'>Selected Groups</div>",
		});
		$('#edit_role_form_group_list #edit_role_form_select_group_list').multiSelect("select",enrollgroupid.map(function(e){return e.toString()})); 
		
	}

	//Existing role populate unenrolled groups in selection box
	function populateRoleUnEnrollGroupForExistingRole(data){
		unenrollgroupid = [];
		$('#edit_role_form_group_list #edit_role_form_select_group_list').multiselect('destroy');
		$('#edit_roles_form #edit_role_form_group_list #edit_role_form_select_group_list option').remove();
		var jsonData = JSON.parse(data)
		$.each(jsonData,function(key,value){
			var groupname = value.group_name;
			var groupid = value.group_id;
			$("<option></option>").text(groupname).val(groupid).appendTo($("#edit_roles_form #edit_role_form_group_list #edit_role_form_select_group_list"));
			unenrollgroupid.push(groupid);
		});
	}
	
	//Existing group populate errolled users in selection box
	function populateGroupEnrollUserForExistingGroup(data){
		enrolluserid = [];
		var jsonData = JSON.parse(data);
		console.log("Groupjsondataenrolleduser:"+jsonData);
		$.each(jsonData,function(key,value){
			var username = value.username;
			var userid = value.userid;
			$("<option></option>").text(username).val(userid).appendTo($("#edit_groups_form #edit_group_form_user_list #edit_grpuser_list"));
			enrolluserid.push(userid);
			//$('#edit_user_form_role_list #edit_role_list').multiSelect('select',['\''+roleid+'\'']);
		});
		//$('#edit_user_form_role_list #edit_role_list').multiSelect('refresh');
		$('#edit_group_form_user_list #edit_grpuser_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Users</div>",
			selectionHeader: "<div class='custom-header'>Selected Users</div>",
			//select:enrollroleid.map(function(e){return e.toString()}),
			//deselect:unenrollroleid.map(function(e){return e.toString()}),
		});
		$('#edit_group_form_user_list #edit_grpuser_list').multiSelect("select",enrolluserid.map(function(e){return e.toString()})); 
		//console.log("Enrolled:"+enrollroleid);
		//console.log("UnEnrolled:"+unenrollroleid);
		
	}
	
	//Existing group populate unerrolled users in selection box
	function populateGroupUnEnrollUserForExistingGroup(data){
		unenrolluserid = [];
		$('#edit_group_form_user_list #edit_grpuser_list').multiselect('destroy');
		$('#edit_groups_form #edit_group_form_user_list #edit_grpuser_list option').remove();
		var jsonData = JSON.parse(data);
		console.log("GroupjsondataUnenrolleduser:"+jsonData);
		$.each(jsonData,function(key,value){
			var username = value.username;
			var userid = value.userid;
			$("<option></option>").text(username).val(userid).appendTo($("#edit_groups_form #edit_group_form_user_list #edit_grpuser_list"));
			unenrolluserid.push(userid);
			//$('#edit_user_form_role_list #edit_role_list').multiSelect('deselect',['\''+roleid+'\'']);
			//$('#edit_user_form_role_list #edit_role_list').multiSelect('refresh');
		});
		/*$('#edit_user_form_role_list #edit_role_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Roles</div>",
			selectionHeader: "<div class='custom-header'>Selected Roles</div>",
			deselect:unenrollroleid,
		});*/
	}
	
	//Existing group populate errolled roles in selection box
	function populateGroupEnrollRolesForExistingGroup(data){
		enrollroleid = [];
		var jsonData = JSON.parse(data);
		console.log("GroupjsondataenrolledRoles:"+jsonData);
		$.each(jsonData,function(key,value){
			var rolename = value.role_name;
			var roleid = value.role_id;
			$("<option></option>").text(rolename).val(roleid).appendTo($("#edit_groups_form #edit_group_form_role_list #edit_grprole_list"));
			enrollroleid.push(roleid);
			//$('#edit_user_form_role_list #edit_role_list').multiSelect('select',['\''+roleid+'\'']);
		});
		//$('#edit_user_form_role_list #edit_role_list').multiSelect('refresh');
		$('#edit_group_form_role_list #edit_grprole_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Roles</div>",
			selectionHeader: "<div class='custom-header'>Selected Roles</div>",
			//select:enrollroleid.map(function(e){return e.toString()}),
			//deselect:unenrollroleid.map(function(e){return e.toString()}),
		});
		$('#edit_group_form_role_list #edit_grprole_list').multiSelect("select",enrollroleid.map(function(e){return e.toString()})); 
		//console.log("Enrolled:"+enrollroleid);
		//console.log("UnEnrolled:"+unenrollroleid);
		
	}
	
	//Existing group populate unerrolled roles in selection box
	function populateGroupUnEnrollRolesForExistingGroup(data){
		unenrollroleid = [];
		$('#edit_group_form_role_list #edit_grprole_list').multiselect('destroy');
		$('#edit_groups_form #edit_group_form_role_list #edit_grprole_list option').remove();
		var jsonData = JSON.parse(data);
		console.log("GroupjsondataUnenrolledRoles:"+jsonData);
		$.each(jsonData,function(key,value){
			var rolename = value.role_name;
			var roleid = value.role_id;
			$("<option></option>").text(rolename).val(roleid).appendTo($("#edit_groups_form #edit_group_form_role_list #edit_grprole_list"));
			unenrollroleid.push(roleid);
			//$('#edit_user_form_role_list #edit_role_list').multiSelect('deselect',['\''+roleid+'\'']);
			//$('#edit_user_form_role_list #edit_role_list').multiSelect('refresh');
		});
		/*$('#edit_user_form_role_list #edit_role_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Roles</div>",
			selectionHeader: "<div class='custom-header'>Selected Roles</div>",
			deselect:unenrollroleid,
		});*/
	}
	
	function showRoleList(data){
		$.each(JSON.parse(data), function(key,value) {
			  var trdiv = $("<tr></tr>").attr("data-roleid",value.role_id);
			  $("<td></td>").text(value.role_name).appendTo(trdiv);
			  var editcol = $("<td></td>");
			  var btn1 = $("<button></button>").addClass("btn btn-primary btn-xs").attr("id","roleeditbtn").attr("btn-type","edit").attr("data-roleid",value.role_id);
			  $("<span></span>").addClass("fa fa-edit").appendTo(btn1);
			  btn1.appendTo(editcol);
			  var deletecol = $("<td></td>");
			  var btn2 = $("<button></button>").addClass("btn btn-danger btn-xs").attr("id","roledeletebtn").attr("btn-type","delete").attr("data-roleid",value.role_id);
			  $("<span></span>").addClass("fa fa-trash-o").appendTo(btn2);
			  btn2.appendTo(deletecol);
			  
			  editcol.appendTo(trdiv);
			  deletecol.appendTo(trdiv);
			  trdiv.appendTo($("#roles_form #existingroles tbody"));
		});
	}
	
	function populateUsersForNewRole(data){
		$('#roles_form #role_form_user_list #role_form_select_user_list option').remove();
		$.each(JSON.parse(data),function(key,value){
			$("<option></option>").text(value.username).val(value.userid).appendTo($("#roles_form #role_form_user_list #role_form_select_user_list"));			
		});
		$('#role_form_user_list #role_form_select_user_list').multiselect('destroy');
		$('#role_form_user_list #role_form_select_user_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Users</div>",
			selectionHeader: "<div class='custom-header'>Selected Users</div>",
		});
		
	}
	
	function populateGroupsForNewRole(data){
		$('#roles_form #role_form_group_list #role_form_select_group_list option').remove();
		$.each(JSON.parse(data),function(key,value){
			$("<option></option>").text(value.group_name).val(value.group_id).appendTo($("#roles_form #role_form_group_list #role_form_select_group_list"));			
		});
		$('#role_form_group_list #role_form_select_group_list').multiselect('destroy');
		$('#role_form_group_list #role_form_select_group_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Groups</div>",
			selectionHeader: "<div class='custom-header'>Selected Groups</div>",
		});
		
	}
	
	function populateServicesForNewRole(data){
		$('#roles_form #role_form_srvper_list #role_form_select_srvperm_list option').remove();
		$.each(JSON.parse(data),function(key,value){
			$("<option></option>").text(value.service_instance_name).val(value.service_instance_id).appendTo($("#roles_form #role_form_srvper_list #role_form_select_srvperm_list"));			
		});
		$('#role_form_srvper_list #role_form_select_srvperm_list').multiselect('destroy');
		$('#role_form_srvper_list #role_form_select_srvperm_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Services</div>",
			selectionHeader: "<div class='custom-header'>Selected Services</div>",
		});
		
	}
	
	function showGroupList(data){
		$.each(JSON.parse(data), function(key,value) {
			  var trdiv = $("<tr></tr>").attr("data-groupid",value.group_id);
			  $("<td></td>").text(value.group_name).appendTo(trdiv);
			  var editcol = $("<td></td>");
			  var btn1 = $("<button></button>").addClass("btn btn-primary btn-xs").attr("id","groupeditbtn").attr("btn-type","edit").attr("data-groupid",value.group_id);
			  $("<span></span>").addClass("fa fa-edit").appendTo(btn1);
			  btn1.appendTo(editcol);
			  var deletecol = $("<td></td>");
			  var btn2 = $("<button></button>").addClass("btn btn-danger btn-xs").attr("id","groupdeletebtn").attr("btn-type","delete").attr("data-groupid",value.group_id);
			  $("<span></span>").addClass("fa fa-trash-o").appendTo(btn2);
			  btn2.appendTo(deletecol);
			  
			  editcol.appendTo(trdiv);
			  deletecol.appendTo(trdiv);
			  trdiv.appendTo($("#groups_form #existinggroups tbody"));
		});
	}
	
	function populateUsersForNewGroup(data){
		$('#groups_form #group_form_user_list #group_form_select_user_list option').remove();
		$.each(JSON.parse(data),function(key,value){
			$("<option></option>").text(value.username).val(value.userid).appendTo($("#groups_form #group_form_user_list #group_form_select_user_list"));			
		});
		$('#group_form_user_list #group_form_select_user_list').multiselect('destroy');
		$('#group_form_user_list #group_form_select_user_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Users</div>",
			selectionHeader: "<div class='custom-header'>Selected Users</div>",
		});
		
	}
	
	function populateRolesForNewGroup(data){
		$('#groups_form #group_form_role_list #group_form_select_role_list option').remove();
		$.each(JSON.parse(data),function(key,value){
			$("<option></option>").text(value.role_name).val(value.role_id).appendTo($("#groups_form #group_form_role_list #group_form_select_role_list"));			
		});
		$('#group_form_role_list #group_form_select_role_list').multiselect('destroy');
		$('#group_form_role_list #group_form_select_role_list').multiSelect({
			selectableHeader: "<div class='custom-header'>Available Roles</div>",
			selectionHeader: "<div class='custom-header'>Selected Roles</div>",
		});
		
	}
	
	function showKpiList(data, isEditAuthorized){
		//console.log("isEditAuthorized " + isEditAuthorized);
		
		if(isEditAuthorized === "false"){
			$('#kpi_form_def_open_close').attr('style', 'display:none;');
		} else {
			$('#kpi_form_def_open_close').attr('style', '');
		}
		
		$.each(JSON.parse(data), function(key,value) {
			  var trdiv = $("<tr></tr>").attr("data-kpiid",value.kpiid);
			  $("<td></td>").text(value.kpiname).appendTo(trdiv);
			  $("<td></td>").text(value.dsname).appendTo(trdiv);
			  $("<td></td>").text(value.service_instance_name).appendTo(trdiv);
			  $("<td></td>").text(value.createdby).appendTo(trdiv);
			  //$("<td></td>").text(value.kpiquery).appendTo(trdiv);
			  
			  //$("<td></td>").text(value.interval).appendTo(trdiv);
			  //$("<td></td>").text(value.timeunit).appendTo(trdiv);
			  
			  //$("<td></td>").text(value.thrsmarrule).appendTo(trdiv);
			  //$("<td></td>").text(value.thrsbadrule).appendTo(trdiv);
			  var sscol = $("<td></td>");
			  if(isEditAuthorized === "true"){
				  var btn1 = $("<button></button>").addClass("btn btn-primary").attr("id","kpieditbtn").attr("btn-type","edit").attr("data-kpiid",value.kpiid);
				  $("<span></span>").addClass("fa fa-edit").appendTo(btn1);
				  btn1.appendTo(sscol);
				  sscol.append(" ");
			  }
			  if(isEditAuthorized === "true"){
				  var btn2 = $("<button></button>").addClass("btn btn-danger").attr("id","kpideletebtn").attr("btn-type","delete").attr("data-kpiid",value.kpiid);
				  $("<span></span>").addClass("fa fa-trash-o").appendTo(btn2);
				  btn2.appendTo(sscol);
				  sscol.append(" ");
			  }
		  
			  /*
			  var divinput = $("<div></div>").addClass("toggle btn btn-xs btn-success").attr("data-toggle","toggle").css("width","56.3125px").css("height","21.6px");

			  var ssinput = $("<input></input>").attr("type","checkbox").attr("data-size","mini").attr("data-toggle","toggle").attr("data-onstyle","success").attr("data-offstyle","danger").addClass("bsswitch");
			  var dataonval = "<i class='fa fa-play'></i> Start";
			  var dataoffval = "<i class='fa fa-pause'></i> Stop";
			  ssinput.attr("data-on",dataonval);
			  ssinput.attr("data-off",dataoffval);
			  console.log("*****:"+value.isrunning);
			  if(parseInt(value.isrunning)){
			    ssinput.bootstrapToggle('on');
			  }
			  else{
			    ssinput.bootstrapToggle('off');
			  }

			  var divlabel = $("<div></div>").addClass("toggle-group");
			  var label1 = $("<label></label>").addClass("btn btn-success btn-xs toggle-on").text("Start");
			  $("<i></i>").addClass("fa fa-play").appendTo(label1);
			  var label2 = $("<label></label>").addClass("btn btn-danger btn-xs active toggle-off").text("Stop");
			  $("<i></i>").addClass("fa fa-pause").appendTo(label2);
			  label1.appendTo(divlabel);
			  label2.appendTo(divlabel);
			  $("<span></span>").addClass("toggle-handle btn btn-default btn-xs").appendTo(divlabel);
			  
			  ssinput.appendTo(sscol);
			  */
			  //divlabel.appendTo(divinput);
			  //divinput.appendTo(sscol);
			  
			  
			  var divinput = $("<input type='checkbox' data-toggle='toggle' data-onstyle='success' data-size='mini' data-offstyle='danger' data-on='<i class=\"fa fa-play\"></i> Start' data-off='<i class=\"fa fa-pause\"></i> Stop'>");
			  /*var divlabel = $("<div class='toggle-group'><label class='btn btn-success btn-xs toggle-on'><i class=\"fa fa-play\"></i> Start</label><label class='btn btn-danger btn-xs active toggle-off'><i class=\"fa fa-pause\"></i> Stop</label><span class='toggle-handle btn btn-default btn-xs'></span></div>");
			  divinput.appendTo(sscol);
			  divlabel.appendTo(sscol);*/
			  
			  if(parseInt(value.isrunning)){
				  divinput.attr('checked',false);
			  }
			  else{
				  divinput.attr('checked',true);
			  }
			  //divinput.bootstrapToggle();
			  if(isEditAuthorized === "true"){
				  divinput.appendTo(sscol);
			  }
			  sscol.appendTo(trdiv);
			  trdiv.appendTo($("#keypi_form #existingkpi tbody"));
			  $("[data-toggle='toggle']").bootstrapToggle('destroy')                 
			  $("[data-toggle='toggle']").bootstrapToggle();
		});
	}
	
	//var addNodegroupMember = [];
	function addNode2Group(name, sid){
		console.log("ADD Member"+name+" SID:" + sid);
		var label = $("<label></label>")
		.addClass("control-label")
		.attr("node-name",name)
		.attr("node-id",sid)
		.text(name).appendTo("#rightsidebar #groupmemberdiv");
		// Add member to an array
		//addNodegroupMember.push(parseInt(d.sid));
		//activeGroupNodes.push(parseInt(d.sid));
		console.log("Active: " + activeGroupNodes);
	    console.log("Deactive: " + deactiveGroupNodes);
	}
	function removeFromGroup(name,sid){
		console.log("Remove Member"+name);
		$("#rightsidebar #groupmemberdiv label[node-id='" + sid + "']").remove();

		// Find and remove member from an array
		/*var i = activeGroupNodes.indexOf(d.sid);
		if(i != -1) {
			activeGroupNodes.splice(i, 1);
		}
		*/
		//console.log(addNodegroupMember);
		//update
		console.log("Active: " +activeGroupNodes);
	    console.log("Deactive: " +deactiveGroupNodes);
	}
	
	function WeeklyChart(d, queryType){
		clearRSB();
		showdailyChartDivRSB(d,queryType);
		openWRSB();
	}
	
	//KPI DataSource Select List
	function dsKPISelectFunc(){
        $.ajax({
			cache: false,
			url:'/DataSource?p=getDSList',
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				var i = 1;
				$.each(JSON.parse(data), function(key,value) {
					//console.log("***"+value.dsname+"***"+value.dsid+"******")
					$("<option></option>").text(value.dsname).val(value.dsid).appendTo($("#keypi_form #keypi_ds_list"));
					var lidiv = $("<li></li>").attr("data-original-index",i);
					var adiv = $("<a></a>").attr("tabindex","0").attr("style","").attr("data-tokens","null").addClass("");
					$("<span></span>").text(value.dsname).addClass("text").appendTo(adiv);
					$("<span></span>").addClass("glyphicon glyphicon-ok check-mark").appendTo(adiv);
					adiv.appendTo(lidiv);
					lidiv.appendTo("#keypi_form #ds_list_igroup ul");
					i = i + 1;
				});
			}
		});		
	}
	
	//KPI Edit DataSource Select List
	function dsKPIEditSelectFunc(){
		console.log("DS KPI Edit Function Edited DS List");
        $.ajax({
			cache: false,
			url:'/DataSource?p=getDSList',
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				var i = 1;
				$.each(JSON.parse(data), function(key,value) {
					//console.log("***"+value.dsname+"***"+value.dsid+"******")
					$("<option></option>").text(value.dsname).val(value.dsid).appendTo($("#editKPIModal #kpiformdatasource"));
					/*var lidiv = $("<li></li>").attr("data-original-index",i);
					var adiv = $("<a></a>").attr("tabindex","0").attr("style","").attr("data-tokens","null").addClass("");
					$("<span></span>").text(value.dsname).addClass("text").appendTo(adiv);
					$("<span></span>").addClass("glyphicon glyphicon-ok check-mark").appendTo(adiv);
					adiv.appendTo(lidiv);
					lidiv.appendTo("#editKPIModal #kpiformgroupds ul");
					i = i + 1;*/
				});
			}
		});		
	}
	
	//KPI DataSource Edit Modal Option Delete element
	function dsKPIEditDeleteFunc(){
		$("#editKPIModal #kpiformdatasource option").remove();
	}
	
	//Datasource delete list row 
	function dsDeleteFunc(dsid){
		$.ajax({
			cache: false,
			url:'/DataSource?p=deleteDS&dsid=' + parseInt(dsid),
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
			}
		});	
	}
	
	function dsEditFunc(){			
		var dsname = $("#editDSModal #dsformname").val();
		var dstype = $("#editDSModal #dsformtype").val();
		var host = $("#editDSModal #dsformhostname").val();	
		var port = $("#editDSModal #dsformport").val();
		var dbname = $("#editDSModal #dsformdbname").val();
		var username = $("#editDSModal #dsformusername").val();
		var pwd = $("#editDSModal #dsformpassword").val();
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
	
	function dsDefFunc(){			
		var dsname = $("#datasource_form input[name='ds_name']").val();
		var dstype = $("#datasource_form select[name='type']").val();
		console.log(dstype);
		var host = $("#datasource_form input[name='hostname']").val();
		var port = $("#datasource_form input[name='port']").val();
		var dbname = $("#datasource_form input[name='db_name']").val();
		var username = $("#datasource_form input[name='username']").val();
		var pwd = $("#datasource_form input[name='password']").val();
		$("#loader").attr('class', 'loader');
		$.ajax({
			cache: false,
			url:'/DataSource?p=saveDS&name=' + dsname+ '&dstype=' + dstype + '&host=' + host + '&port=' + port + '&dbname=' + dbname+ '&username=' + username+ '&pw=' + pwd,
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				var jData = JSON.parse(data);
				console.log("DSDefinitionFuntion: "+jData);
				if(jData.state != undefined){
					if(jData.state == "SUCCESS"){
						$("#saveModal").attr("data-form_name","adddatasource");
						$("#saveModal .modal-body p").text(jData.message + " !!!");
						$("#saveModal").modal("show");
					}
					else{
						$("#saveModal").attr("data-form_name","adddatasource");
						$("#saveModal .modal-body p").text(jData.message + " !!!");
						$("#saveModal").modal("show");
					}
				}
			}
		});	
	}
	

	
	//KPI delete list row 
	function kpiDeleteFunc(kpiid){
		$.ajax({
			cache: false,
			url:'/Kpi?p=deleteKPI&kpiId=' + parseInt(kpiid),
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
			}
		});	
	}

	function kpiEditFunc(){	
		var kpiname = $("#editKPIModal #kpiformname").val();
		var sid = $("#editKPIModal #edit_kpi_srv_list").val();
		var kpiquery = $("#editKPIModal #kpiformquery").val();
		//var timeunit = $("#editKPIModal #kpiformtimeunit").val();
		//var interval = $("#editKPIModal #kpiforminterval").val();
		var thrsmarrule = $("#editKPIModal #kpiformmarginal").val();
		thrsmarrule = thrsmarrule.split(">").join("greater");
		thrsmarrule = thrsmarrule.split("<").join("less");
		thrsmarrule = thrsmarrule.split("=").join("equal");
		var thrsbadrule = $("#editKPIModal #kpiformbad").val();
		thrsbadrule = thrsbadrule.split(">").join("greater");
		thrsbadrule = thrsbadrule.split("<").join("less");
		thrsbadrule = thrsbadrule.split("=").join("equal");
		var cron = "";
		if($('#edit_cronselector').cron("value") != undefined)
			cron = $('#edit_cronselector').cron("value");
		var dsid = $("#editKPIModal #kpiformdatasource").val();
		console.log("kpi_name:"+kpiname);
		console.log("kpi_query:"+kpiquery);
		//console.log("kpi_interval:"+interval);
		//console.log("kpi_timeunit:"+timeunit);
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

	
	function kpiDefFunc(){
		var kpiname = $("#keypi_form input[name='kpi_name']").val();
		var sid = 0;
		console.log($('#keypi_form #kpi_srv_list').val());
		if ($('#keypi_form #kpi_srv_list').val().length != 0){
			sid = $('#keypi_form #kpi_srv_list').val();
		}
		var kpiquery = $("#keypi_form textarea[name='kpi_query']").val();
		//var timeunit = $("#keypi_form select[name='timeunit']").val();
		//var interval = $("#keypi_form input[name='interval']").val();
		var thrsmarrule = $("#keypi_form textarea[name='thresholdmarginal']").val();
		var cron = "";
		if($('#cronselector').cron("value") != undefined)
			cron = $('#cronselector').cron("value");
		thrsmarrule = thrsmarrule.split(">").join("greater");
		thrsmarrule = thrsmarrule.split("<").join("less");
		thrsmarrule = thrsmarrule.split("=").join("equal");
		console.log("\\\\\\\\\\\\\\\\\\\:"+thrsmarrule);
		var thrsbadrule = $("#keypi_form textarea[name='thresholdbad']").val();
		thrsbadrule = thrsbadrule.split(">").join("greater");
		thrsbadrule = thrsbadrule.split("<").join("less");
		thrsbadrule = thrsbadrule.split("=").join("equal");
		console.log("\\\\\\\\\\\\\\\\\\\:"+thrsbadrule);
		var dsid = $("#keypi_form select[name='ds_list']").val();
		console.log("kpi_name:"+kpiname);
		console.log("kpi_query:"+kpiquery);
		//console.log("kpi_interval:"+interval);
		//console.log("kpi_timeunit:"+timeunit);
		console.log("kpi cron:"+cron);
		console.log("kpi_thrsmarginal:"+thrsmarrule);
		console.log("kpi_thrsbad:"+thrsbadrule);
		console.log("kpi_dsid:"+dsid);
		
		if(cron === ""){
			
			alert("Please schedule the KPI");
			
		} else {
			$("#loader").attr('class', 'loader');
			
			$.ajax({
				cache: false,
				url:'/Kpi?p=saveKPI&name=' + kpiname+ '&sid=' + sid + '&query=' + kpiquery + '&thresholdMarginalRule=' + thrsmarrule+ '&thresholdBadRule=' + thrsbadrule + '&cron=' + cron + '&dsid='+dsid,
				success:function(data) {
					$("#loader").attr('class', 'loader collapse');
					console.log("KPIDefinitionFuntion: "+data);
					var jData = JSON.parse(data);
					if(jData.state != undefined){
						if(jData.state == "SUCCESS"){
							$("#saveModal").attr("data-form_name","addkpi");
							$("#saveModal .modal-body p").text(jData.message + " !!!");
							$("#saveModal").modal("show");
						}
						else{
							$("#saveModal").attr("data-form_name","addkpi");
							$("#saveModal .modal-body p").text(jData.message + " !!!");
							$("#saveModal").modal("show");
						}
					}
					
				}
			});
		}
	}
	
	//Kpi Query Rule Editor Right Side Bar 
	function showQueryRuleDivRSB(kpiName,dsid,query){
		$("#loader").attr('class', 'loader');
		/*
		$.ajax({
			cache: false,
			url:'/DataSource?p=getDS&dsid=' + parseInt(dsid),
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				jsondata = JSON.parse(data);
				var dsname = jsondata.dsname;
				var dstype = jsondata.dstype;
				var host = jsondata.host;
				var port = jsondata.port;
				var dbname = jsondata.dbname;
				var username = jsondata.username;
				var password = jsondata.password;
				console.log(dsname+"*****" + dstype +"*****"+host+"*****"+port+"*****");
			}
		});
		var headerdiv = $("<div></div>")
		.addClass("modal-header");
		var closediv = $("<div></div>").addClass("close").attr("id","closersbquery").text("x").appendTo(headerdiv);
		var hdiv = $("<h3></h3>").text("Create Marginal/Bad Rule").appendTo(headerdiv);
		
		var bodydiv = $("<div></div>")
			.addClass("modal-body");
		var innerdiv1 = $("<div></div>");
		var label1 = $("<label></label>")
			.addClass("control-label")
			.text("Kpi Name:").appendTo(innerdiv1);
		$("<label></label>").attr("id","current_node_name").text(kpiName).appendTo(innerdiv1);
		
		var innerdiv11 = $("<div></div>");
		var label11 = $("<label></label>")
			.addClass("control-label")
			.text("Query:").appendTo(innerdiv11);
		$("<label></label>").attr("id","current_node_name").text(query).appendTo(innerdiv11);
		var innerdiv2 = $("<div></div>");
		var label2 = $("<label></label>")
		.addClass("control-label")
		.text("KPI Marginal Rule:").appendTo(innerdiv2);
		
		var innerdiv3 = $("<div></div>");
		var label3 = $("<label></label>")
		.addClass("control-label")
		.text("KPI Bad Rule:").appendTo(innerdiv3);
		*/
		
		
		/*$.each( JSON.parse(data), function( key, value ) {
			$("<label></label>").attr("data-id",value.id).text(value.name).appendTo(innerdiv2);
			  console.log( value.name + ": " + value );		
		});*/
		
		/*
		innerdiv1.appendTo(bodydiv);
		innerdiv11.appendTo(bodydiv);
		innerdiv2.appendTo(bodydiv);
		innerdiv3.appendTo(bodydiv);
			
	
		headerdiv.appendTo($("#rightsidebar"));
		bodydiv.appendTo($("#rightsidebar"));
		*/		
		InitKPIQueryRuleEditor(kpiName,dsid,query);
	}
	
	//Edit Kpi Query Rule Editor Right Side Bar 
	function showEditQueryRuleDivRSB(editkpiName,editdsid,editquery){
		$("#loader").attr('class', 'loader');		
		InitEditKPIQueryRuleEditor(editkpiName,editdsid,editquery);
	}
	
	function deleteDSModalShow(dsid){
		$.ajax({
			cache: false,
			url:'/DataSource?p=getDS&dsid=' + parseInt(dsid),
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				jsondata = JSON.parse(data);
				$("#deleteModel h5 b").text(jsondata.dsname);
			}
		});
		$("#deleteModel").modal("show");
	}
	
	function editDSModalShow(dsid){
		$.ajax({
			cache: false,
			url:'/DataSource?p=getDS&dsid=' + parseInt(dsid),
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				jsondata = JSON.parse(data);
				$("#editDSModal h5").text(jsondata.dsname);			
				$("#editDSModal #dsformname").val(jsondata.dsname);
				$("#editDSModal #dsformtype").val(jsondata.dstype);
				$("#editDSModal #dsformhostname").val(jsondata.host);	
				$("#editDSModal #dsformport").val(jsondata.port);
				$("#editDSModal #dsformdbname").val(jsondata.dbname);
				$("#editDSModal #dsformusername").val(jsondata.username);
				$("#editDSModal #dsformpassword").val(jsondata.password);
			}
		});
		$("#editDSModal").modal("show");
	}
	
	function deleteKPIModalShow(kpiid){
		$.ajax({
			cache: false,
			url:'/Kpi?p=getKPI&kpiId=' + parseInt(kpiid),
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				jsondata = JSON.parse(data);
				$("#deleteModel h5 b").text(jsondata.kpiname);
			}
		});
		$("#deleteModel").modal("show");
	}
	
	function deleteReportModalShow(reportid){
		$.ajax({
			cache: false,
			url:'/Report?p=getReport&report_id=' + parseInt(reportid),
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				jsondata = JSON.parse(data);
				$("#deleteModel h5 b").text(jsondata.report_name);
			}
		});
		$("#deleteModel").modal("show");
	}
	
	function deleteReportJobModalShow(reportjobid){
		$.ajax({
			cache: false,
			url:'/ReportJob?p=getReportJob&report_job_id=' + parseInt(reportjobid),
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				jsondata = JSON.parse(data);
				console.log(jsondata);
				$("#deleteModel h5 b").text(jsondata.report_job_name);
			}
		});
		$("#deleteModel").modal("show");
	}

	function editKPIModalShow(kpiid){
		dsKPIEditDeleteFunc();
		dsKPIEditSelectFunc();
		
		$("#edit_kpi_srv_list option").remove();
		$("#loader").attr('class', 'loader');
		
		$.ajax({
			cache: false,
			url:'/Kpi?p=getKPI&kpiId=' + parseInt(kpiid),
			success:function(data) {
				console.log(data);
				$("#loader").attr('class', 'loader collapse');
				
				jsondata = JSON.parse(data);
				$("#editKPIModal h5").text(jsondata.kpiname);			
				$("#editKPIModal #kpiformname").val(jsondata.kpiname);
				$("#editKPIModal #kpiformquery").val(jsondata.kpiquery);
				//$("#editKPIModal #kpiforminterval").val(jsondata.interval);
				//$("#editKPIModal #kpiformtimeunit").val(jsondata.timeunit);
				$("#editKPIModal #kpiformmarginal").val(jsondata.thrsmarrule);
				$("#editKPIModal #kpiformbad").val(jsondata.thrsbadrule);
				$("#editKPIModal #kpiformdatasource").val(jsondata.dsid);
				
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
						$('#editKPIModal #edit_kpi_srv_list').val(jsondata.sid);
						console.log("SID:"+jsondata.sid);
						
						// server list search
						//$('#edit_kpi_srv_list').val(jsondata.sid).trigger("chosen:updated"); // Select the value before .chosen();
						/*var $chosen = $('#edit_kpi_srv_list').chosen({
							max_selected_options: 1,
						});*/
						
						//console.log("Option is addedkjhkh");
						
						/*$chosen.change(function () {
						  var $this = $(this);
						  var chosen = $this.data('chosen');
						  var search = chosen.search_container.find('input[type="text"]');
						  
						  if($('#edit_kpi_srv_list').val().length > 0){
							//$('#saverptbtn').attr('data-sid', $('#srv_list').val());
							console.log(JSON.parse($('#edit_kpi_srv_list').val()));
						  }
						  console.log("Chosen Active Field:"+chosen.active_field);
						  if (chosen.active_field) {
							search.focus();
						  }
						});*/

					}
				});
				
			}
		});
		
		$("#editKPIModal").modal("show");
		
	}
	
	//Edit User Form Fill Value Fields
	function setEditUserFormValue(userid){
		$.ajax({
			cache: false,
			url:'/Users?p=getUser&userid=' + parseInt(userid),
			success:function(data){
				jsondata = JSON.parse(data);
				$("#loader").attr('class', 'loader collapse');
				console.log("userid:"+jsondata.userid);
				console.log("firstname:"+jsondata.firstName);
				console.log("lastname:"+jsondata.lastName);
				console.log("username:"+jsondata.username);
				console.log("password:"+jsondata.password);

				$("#edit_users_form legend span").text(jsondata.username);
				$("#edit_users_form #edit_user_name").val(jsondata.username);			
				$("#edit_users_form #edit_first_name").val(jsondata.firstName);
				$("#edit_users_form #edit_last_name").val(jsondata.lastName);
				$("#edit_users_form #edit_user_password").val(jsondata.password);	
				$("#edit_users_form #edit_user_repassword").val(jsondata.password);
				/*$("#editDSModal #dsformdbname").val(jsondata.dbname);
				$("#editDSModal #dsformusername").val(jsondata.username);
				$("#editDSModal #dsformpassword").val(jsondata.password);
			*/}
		});
	}
	
	//Edit User Form Fill Value Fields
	function setEditRoleFormValue(roleid){
		$.ajax({
			cache: false,
			url:'/Roles?p=getRole&role_id=' + parseInt(roleid),
			success:function(data){
				jsondata = JSON.parse(data);
				$("#loader").attr('class', 'loader collapse');
				console.log("role id:"+jsondata.role_id);
				console.log("role name:"+jsondata.role_name);

				$("#edit_roles_form legend span").text(jsondata.role_name);
				$("#edit_roles_form #edit_role_name").val(jsondata.role_name);			}
		});
	}
	
	//Edit Role form Fill Resource Permission Value
	/*function setEditRoleResPermValues(roleid){
		respermsrv = [];
		respermds = [];
		respermkpi = [];
		respermrep = [];
		respermadm = [];
       	$("#loader").attr('class', 'loader');
        $.ajax({
			cache: false,
			url:'/Roles?p=getRoleResourcePermissions&role_id='+parseInt(roleid),
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				//console.log(data.ResourcePermissions[1].resource_type_id);
				var jsonData = JSON.parse(data);
				var resper = jsonData.ResourcePermissions[0];
				for(var i=0;i<jsonData.ResourcePermissions.length;i++){
					var resper = jsonData.ResourcePermissions[i];
					console.log("Resper:"+resper);
					if(resper.resource_type_id == 1){
						respermsrv.push(resper.permission_type_id);
						console.log("****"+resper.permission_type_id);
						if(resper.permission_type_id == 1){
							$('input:radio[name="edit_srvradio"]').filter('[value="1"]').prop('checked', true);
						}
						else if(resper.permission_type_id == 2){
							$('input:radio[name="edit_srvradio"]').filter('[value="2"]').prop('checked', true);
						}
						else{
							$('#edit_roles_form input[name="srvradio"]').attr('checked', false);
						}

					}
					else if(resper.resource_type_id == 2){
						respermds.push(resper.permission_type_id);
						if(resper.permission_type_id == 1){
							$('input:radio[name="edit_dsradio"]').filter('[value="1"]').prop('checked', true);
						}
						else if(resper.permission_type_id == 2){
							$('input:radio[name="edit_dsradio"]').filter('[value="2"]').prop('checked', true);
						}
						else{
							$('#edit_roles_form input[name="dsradio"]').attr('checked', false);
						}
					}
					else if(resper.resource_type_id == 3){
						respermkpi.push(resper.permission_type_id);
						if(resper.permission_type_id == 1){
							$('input:radio[name="edit_kpiradio"]').filter('[value="1"]').prop('checked', true);
						}
						else if(resper.permission_type_id == 2){
							$('input:radio[name="edit_kpiradio"]').filter('[value="2"]').prop('checked', true);
						}
						else{
							$('#edit_roles_form input[name="kpiradio"]').attr('checked', false);
						}
					}
					else if(resper.resource_type_id == 4){
						respermrep.push(resper.permission_type_id);
						if(resper.permission_type_id == 1){
							$('input:radio[name="edit_rptradio"]').filter('[value="1"]').prop('checked', true);
						}
						else if(resper.permission_type_id == 2){
							$('input:radio[name="edit_rptradio"]').filter('[value="2"]').prop('checked', true);
						}
						else{
							$('#edit_roles_form input[name="rptradio"]').attr('checked', false);
						}
					}
					else if(resper.resource_type_id == 5){
						respermadm.push(resper.permission_type_id);
						if(resper.permission_type_id == 2){
							$('input:radio[name="edit_admradio"]').filter('[value="2"]').prop('checked', true);
						}
						else{
							$('edit_roles_form input[name="edit_admradio"]').attr('checked', false);
						}
					}
				}
				console.log(respermsrv);
				console.log(respermds);
				console.log(respermkpi);
				console.log(respermrep);
				console.log(respermadm);
			}
		});
	}*/
	
	//Edit New Role form Fill Resource Permission Value
	function setEditRoleResPermValues(roleid){
		respermsrv = [];
		respermds = [];
		respermkpi = [];
		respermrep = [];
		respermadm = [];
       	$("#loader").attr('class', 'loader');
        $.ajax({
			cache: false,
			url:'/Roles?p=getRoleResourcePermissions&role_id='+parseInt(roleid),
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				//console.log(data.ResourcePermissions[1].resource_type_id);
				var jsonData = JSON.parse(data);
				//var resper = jsonData.ResourcePermissions[0];
				for(var i=0;i<jsonData.ResourcePermissions.length;i++){
					var resper = jsonData.ResourcePermissions[i];
					console.log("Resper:"+resper);
					if(resper.resource_type == "Service"){
						respermsrv.push(resper.permission_type_id);
						console.log("****"+resper.permission_type_id);
						if(resper.permission_type == "VIEW"){
							$('input:radio[name="edit_srvradio"]').filter('[value="1"]').prop('checked', true);
						}
						else if(resper.permission_type == "EDIT"){
							$('input:radio[name="edit_srvradio"]').filter('[value="2"]').prop('checked', true);
						}
						else{
							$('#edit_roles_form input[name="srvradio"]').attr('checked', false);
						}

					}
					else if(resper.resource_type == "Datasource"){
						respermds.push(resper.permission_type_id);
						if(resper.permission_type == "VIEW"){
							$('input:radio[name="edit_dsradio"]').filter('[value="1"]').prop('checked', true);
						}
						else if(resper.permission_type == "EDIT"){
							$('input:radio[name="edit_dsradio"]').filter('[value="2"]').prop('checked', true);
						}
						else{
							$('#edit_roles_form input[name="dsradio"]').attr('checked', false);
						}
					}
					else if(resper.resource_type == 'KPI'){
						respermkpi.push(resper.permission_type_id);
						if(resper.permission_type == "VIEW"){
							$('input:radio[name="edit_kpiradio"]').filter('[value="1"]').prop('checked', true);
						}
						else if(resper.permission_type == "EDIT"){
							$('input:radio[name="edit_kpiradio"]').filter('[value="2"]').prop('checked', true);
						}
						else{
							$('#edit_roles_form input[name="kpiradio"]').attr('checked', false);
						}
					}
					else if(resper.resource_type == "Report"){
						respermrep.push(resper.permission_type_id);
						if(resper.permission_type == "VIEW"){
							$('input:radio[name="edit_rptradio"]').filter('[value="1"]').prop('checked', true);
						}
						else if(resper.permission_type == "EDIT"){
							$('input:radio[name="edit_rptradio"]').filter('[value="2"]').prop('checked', true);
						}
						else{
							$('#edit_roles_form input[name="rptradio"]').attr('checked', false);
						}
					}
					else if(resper.resource_type == "Administration"){
						respermadm.push(resper.permission_type_id);
						if(resper.permission_type == "EDIT"){
							$('input:radio[name="edit_admradio"]').filter('[value="2"]').prop('checked', true);
						}
						else{
							$('edit_roles_form input[name="edit_admradio"]').attr('checked', false);
						}
					}
				}
				console.log(respermsrv);
				console.log(respermds);
				console.log(respermkpi);
				console.log(respermrep);
				console.log(respermadm);
			}
		});
	}
	
	//Edit Group Form Fill Value Fields
	function setEditGroupFormValue(groupid){
		$.ajax({
			cache: false,
			url:'/Groups?p=getGroup&group_id=' + parseInt(groupid),
			success:function(data){
				jsondata = JSON.parse(data);
				$("#loader").attr('class', 'loader collapse');
				console.log("groupid:"+jsondata.group_id);
				console.log("groupname:"+jsondata.group_name);

				$("#edit_groups_form legend span").text(jsondata.group_name);
				$("#edit_groups_form #edit_group_name").val(jsondata.group_name);			
			}
		});
	}
	
	function deleteUserModalShow(userid){
		$.ajax({
			cache: false,
			url:'/Users?p=getUser&userid=' + parseInt(userid),
			success:function(data) {
				var jsondata = JSON.parse(data);
				$("#loader").attr('class', 'loader collapse');
				$("#deleteModel h5 b").text(jsondata.username);
				$("#deleteModel").attr("data-userid",userid);
			}
		});
		$("#deleteModel").modal("show");
	}
	
	function deleteRoleModalShow(roleid){
		$.ajax({
			cache: false,
			url:'/Roles?p=getRole&role_id=' + parseInt(roleid),
			success:function(data) {
				var jsondata = JSON.parse(data);
				$("#loader").attr('class', 'loader collapse');
				$("#deleteModel h5 b").text(jsondata.role_name);
				$("#deleteModel").attr("data-roleid",jsondata.role_id);
			}
		});
		$("#deleteModel").modal("show");
	}
	
	function deleteGroupModalShow(groupid){
		$.ajax({
			cache: false,
			url:'/Groups?p=getGroup&group_id=' + parseInt(groupid),
			success:function(data) {
				var jsondata = JSON.parse(data);
				$("#loader").attr('class', 'loader collapse');
				$("#deleteModel h5 b").text(jsondata.group_name);
				$("#deleteModel").attr("data-groupid",jsondata.group_id);
			}
		});
		$("#deleteModel").modal("show");
	}
	
	//User delete list row 
	function userDeleteFunc(userid){
		$.ajax({
			cache: false,
			url:"/Users?p=deleteUser",
			data:{userid:userid},
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
			}
		});	
	}
	
	//Role delete list row 
	function roleDeleteFunc(roleid){
		$.ajax({
			cache: false,
			url:"/Roles?p=deleteRole",
			data:{role_id:roleid},
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
			}
		});	
	}
	
	//Group delete list row 
	function groupDeleteFunc(groupid){
		$.ajax({
			cache: false,
			url:"/Groups?p=deleteGroup",
			data:{group_id:groupid},
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
			}
		});	
	}
	
	//Report delete list row 
	function reportDeleteFunc(reportid){
		$.ajax({
			cache: false,
			url:"/Report?p=deleteReport",
			data:{report_id:reportid},
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
			}
		});	
	}
	
	//ReportJob delete list row 
	function reportJobDeleteFunc(reportjobid){
		$.ajax({
			cache: false,
			url:"/ReportJob?p=deleteReportJob",
			data:{report_job_id:reportjobid},
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
			}
		});	
	}
	
	function changePasswModalShow(){
		$("#changePassModal").modal("show");
	}
	
	function getKPITimeUnitId(value){
		if(value == "Second")
			return 0;
		else if(value == "Minute")
			return 1;
		else if(value == "Hour")
			return 2;
		else if(value == "Day")
			return 3;
		else //Week
			return 4;
	}

	function getKPIIntervalValue(iid){
		if(iid == 0)
			return "Second";
		else if(iid == 1)
			return "Minute";
		else if(iid == 2)
			return "Hour";
		else if(iid == 3)
			return "Day";
		else //4
			return "Week";
	}
	
	function compareArrays(arr1, arr2) {
	    return $(arr1).not(arr2).length == 0 && $(arr2).not(arr1).length == 0
	};

	function setResourcePermission(){
		if(respermsrv.length == 0){
			respertotal.push("0");
		}
		else if(respermsrv.length == 1){
			var index = respermsrv.indexOf("1");
			if (index > -1) {
				respertotal.push("1");
			}
			else{
				respertotal.push("2");
			}
		}
		else{
			respertotal.push("-1");
		}
		
		if(respermds.length == 0){
			respertotal.push("0");
		}
		else if(respermds.length == 1){
			var index = respermds.indexOf("1");
			if (index > -1) {
				respertotal.push("1");
			}
			else{
				respertotal.push("2");
			}
		}
		else{
			respertotal.push("-1");
		}
		
		if(respermkpi.length == 0){
			respertotal.push("0");
		}
		else if(respermkpi.length == 1){
			var index = respermkpi.indexOf("1");
			if (index > -1) {
				respertotal.push("1");
			}
			else{
				respertotal.push("2");
			}
		}
		else{
			respertotal.push("-1");
		}
		
		if(respermrep.length == 0){
			respertotal.push("0");
		}
		else if(respermrep.length == 1){
			var index = respermrep.indexOf("1");
			if (index > -1) {
				respertotal.push("1");
			}
			else{
				respertotal.push("2");
			}
		}
		else{
			respertotal.push("-1");
		}
		
		if(respermadm.length == 0){
			respertotal.push("0");
		}
		else if(respermadm.length == 1){
			respertotal.push("2");
		}
		else{
			respertotal.push("-1");
		}
		
	};
	
	function uncheckAllRolePerm(){
		$('#roles_form input[name="srvradio"]').prop('checked', false);
		$('#roles_form input[name="dsradio"]').prop('checked', false);
		$('#roles_form input[name="kpiradio"]').prop('checked', false);
		$('#roles_form input[name="rptradio"]').prop('checked', false);
		$('#roles_form input[name="admradio"]').prop('checked', false);
		respermsrv = [];
		respermds = [];
		respermkpi = [];
		respermrep = [];
		respermadm = [];
		respertotal = [];
	}
	
	function uncheckAllRoleEditPerm(){
		$('#edit_roles_form input[name="edit_srvradio"]').prop('checked', false);
		$('#edit_roles_form input[name="edit_dsradio"]').prop('checked', false);
		$('#edit_roles_form input[name="edit_kpiradio"]').prop('checked', false);
		$('#edit_roles_form input[name="edit_rptradio"]').prop('checked', false);
		$('#edit_roles_form input[name="edit_admradio"]').prop('checked', false);
		respermsrv = [];
		respermds = [];
		respermkpi = [];
		respermrep = [];
		respermadm = [];
		respertotal = [];
	}
