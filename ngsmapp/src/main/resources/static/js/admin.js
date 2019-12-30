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
    if(urlParams["p"] === 'users' || urlParams["p"] === 'users#'){
        $("#adminmenu #adminmenua").trigger("click");
        $("#admin_menu #li_usr #user_source").trigger("click");
    	$("#admin_menu #li_usr #user_source").trigger("focus");
    } else if(urlParams["p"] === 'roles' || urlParams["p"] === 'roles#') {
	    $("#adminmenu #adminmenua").trigger("click");
	    $("#admin_menu #li_role #role_source").trigger("click");
		$("#admin_menu #li_role #role_source").trigger("focus");
    } else if(urlParams["p"] === 'groups' || urlParams["p"] === 'groups#') {
	    $("#adminmenu #adminmenua").trigger("click");
	    $("#admin_menu #li_grp #group_source").trigger("click");
		$("#admin_menu #li_grp #group_source").trigger("focus");
    }
    
	//Redirect jsp pages
	$("#submenu-1 #li_bs" ).on('click', 'a', function (){
    	window.location.href ="/index.jsp?msbval="+minisideval;
    });
    $("#submenu-1 #li_kpiover").on('click', 'a', function (){
    	window.location.href ="/kpioverall.jsp?msbval="+minisideval;
    });    
	$("#submenu-2 #li_rptlists" ).on('click', 'a', function (){
    	window.location.href ="/ReportViewer.jsp?p=reportlist&msbval="+minisideval;
    });
    $("#submenu-2 #li_rptjobs").on('click', 'a', function (){
    	window.location.href ="/ReportViewer.jsp?p=reportjobs&msbval="+minisideval;
    });	
    $("#submenu-3 #li_ds" ).on('click', 'a', function (){
    	window.location.href ="/kpi.jsp?p=ds&msbval="+minisideval;
    });
    $("#submenu-3 #li_kpi" ).on('click', 'a', function (){
    	window.location.href ="/kpi.jsp?p=kpi&msbval="+minisideval;
    });	
    $("#op_menu #li_maintenance").on('click', 'a', function (){
    	window.location.href ="/maintenance.jsp?page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval;
    });
    $("#op_menu #li_eventcatalog").on('click', 'a', function (){
    	window.location.href ="/eventcatalog.jsp?page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval;
    });
    
    $('#users_form_def_open_close').on('click', function () {
    	if ($('#usr_form').is(":visible")){
    		$('#usr_form').hide();
    		$('#users_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    		$("#users_form #user_form_role_list").css("display","none");
			$("#users_form #add_roles").text("Edit");
			$("#users_form #user_form_group_list").css("display","none");
			$("#users_form #add_groups").text("Edit");
    	}
    	else{
    		$('#usr_form').show();
    		$('#users_form_def_open_close').removeClass('fa-plus').addClass('fa-minus');
    	}
    	
    });
    $('#roles_form_def_open_close').on('click', function () {
    	if ($('#rls_form').is(":visible")){
    		$('#rls_form').hide();
    		$('#roles_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    		$("#roles_form #role_form_user_list").css("display","none");
			$("#roles_form #role_add_users").text("Edit");
			$("#roles_form #role_form_group_list").css("display","none");
			$("#roles_form #role_add_groups").text("Edit");
			$("#roles_form #role_form_perm_list").css("display","none");
			$("#roles_form #role_resource_permiss").text("Edit");
			$("#roles_form #role_form_srvper_list").css("display","none");
			$("#roles_form #role_service_permiss").text("Edit");
    	}
    	else{
    		$('#rls_form').show();
    		$('#roles_form_def_open_close').removeClass('fa-plus').addClass('fa-minus');
    	}
    	
    });
    $('#groups_form_def_open_close').on('click', function () {
    	if ($('#grps_form').is(":visible")){
    		$('#grps_form').hide();
    		$('#groups_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    		$("#groups_form #group_form_user_list").css("display","none");
			$("#groups_form #group_add_users").text("Edit");
			$("#groups_form #group_form_role_list").css("display","none");
			$("#groups_form #group_add_roles").text("Edit");
    	}
    	else{
    		$('#grps_form').show();
    		$('#groups_form_def_open_close').removeClass('fa-plus').addClass('fa-minus');
    	}
    	
    });
    
    $('#saveModal').on('hidden.bs.modal', function () {
    	console.log("Admin Hidden model!!!!!!!!!!!");
    	if($("#saveModal").attr("data-form_name") == "adduser"){
    		$('#usr_form').hide();
    		$('#users_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    		$("#users_form #user_form_role_list").css("display","none");
			$("#users_form #add_roles").text("Edit");
			$("#users_form #user_form_group_list").css("display","none");
			$("#users_form #add_groups").text("Edit");
			$('#users_form #role_list').multiSelect('deselect_all');
			$('#users_form #group_list').multiSelect('deselect_all');
			$("#usr_form ul.ms-list .ms-elem-selectable").removeClass("ms-hover");
    	}
    	if($("#saveModal").attr("data-form_name") == "edituser"){
           	$("#edit_users_form").attr('class', 'collapse');
        	$("#edit_users_form #edit_user_form_role_list").css("display","none");
    		$("#edit_users_form #edit_add_roles").text("Edit");
    		$("#edit_users_form #edit_user_form_group_list").css("display","none");
    		$("#edit_users_form #edit_add_groups").text("Edit");
        	$("#users_form").attr('class', '');
    	}
    	if($("#saveModal").attr("data-form_name") == "addrole"){
    		$('#rls_form').hide();
    		$('#roles_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    		$("#roles_form #role_form_user_list").css("display","none");
			$("#roles_form #role_add_users").text("Edit");
			$("#roles_form #role_form_group_list").css("display","none");
			$("#roles_form #role_add_groups").text("Edit");
			$("#roles_form #role_form_perm_list").css("display","none");
			$("#roles_form #role_resource_permiss").text("Edit");
			$("#roles_form #role_form_srvper_list").css("display","none");
			$("#roles_form #role_service_permiss").text("Edit");		
			$('#roles_form #role_form_select_user_list').multiSelect('deselect_all');
			$('#roles_form #role_form_select_group_list').multiSelect('deselect_all');
			$('#roles_form #role_form_select_srvperm_list').multiSelect('deselect_all');
			$("#roles_form ul.ms-list .ms-elem-selectable").removeClass("ms-hover");
    	}
    	if($("#saveModal").attr("data-form_name") == "editrole"){
        	$("#edit_roles_form").attr('class', 'collapse');
        	$("#edit_roles_form #edit_role_form_user_list").css("display","none");
			$("#edit_roles_form #edit_role_add_users").text("Edit");
			$("#edit_roles_form #edit_role_form_group_list").css("display","none");
			$("#edit_roles_form #edit_role_add_groups").text("Edit");
			$("#edit_roles_form #edit_role_form_perm_list").css("display","none");
			$("#edit_roles_form #edit_role_resource_permiss").text("Edit");
			$("#edit_roles_form #edit_role_form_srvper_list").css("display","none");
			$("#edit_roles_form #edit_role_service_permiss").text("Edit");
        	$("#roles_form").attr('class', '');
    	}
    	if($("#saveModal").attr("data-form_name") == "addgroup"){
    		$('#grps_form').hide();
    		$('#groups_form_def_open_close').removeClass('fa-minus').addClass('fa-plus');
    		$("#groups_form #group_form_user_list").css("display","none");
			$("#groups_form #group_add_users").text("Edit");
			$("#groups_form #group_form_role_list").css("display","none");
			$("#groups_form #group_add_roles").text("Edit");
			$('#groups_form #group_form_select_user_list').multiSelect('deselect_all');
			$('#groups_form #group_form_select_role_list').multiSelect('deselect_all');
			$("#groups_form ul.ms-list .ms-elem-selectable").removeClass("ms-hover");
    	}
    	if($("#saveModal").attr("data-form_name") == "editgroup"){
        	$("#edit_groups_form").attr('class', 'collapse');
        	$("#edit_groups_form #edit_group_form_user_list").css("display","none");
			$("#edit_groups_form #edit_grpadd_users").text("Edit");
			$("#edit_groups_form #edit_group_form_role_list").css("display","none");
			$("#edit_groups_form #edit_grpadd_roles").text("Edit");
        	$("#groups_form").attr('class', '');
    	}
    });
    
    $('#roleusersearch').on('click', function () {
    	var roleid = $(this).attr("data-roleid");
    	console.log("roleid:"+roleid);
    	var searchvalue = $("#edit_role_form_user_list input[name=search]").val();
    	var strurl = 'Roles?p=getRoleUnEnrolledUsersSearch&role_id='+parseInt(roleid)+'&searchPattern='+searchvalue;
    	console.log(strurl);
    	$("#loader").attr('class', 'loader');
    	$.ajax({
			cache: false,
			url:'Roles?p=getRoleUnEnrolledUsersSearch&role_id='+parseInt(roleid)+'&searchPattern='+searchvalue,
			success:function(data) {
				$("#loader").attr('class', 'loader collapse');
				console.log(JSON.parse(data).length);
				populateRoleUnEnrollUserForExistingRoleLDAP(data);
				$("#loader").attr('class', 'loader');
				$.ajax({
					cache: false,
					url:'/Roles?p=getRoleEnrolledUsers&role_id='+parseInt(roleid),
					success:function(data1) {
						$("#loader").attr('class', 'loader collapse');
						console.log(JSON.parse(data1).length);
						populateRoleEnrollUserForExistingroleLDAP(data1);
					}	
				});
			}	
		});
    });
    
    //Only Ldap Search User List disable enter key
    $('#edit_rls_form .search-container input').keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });
});