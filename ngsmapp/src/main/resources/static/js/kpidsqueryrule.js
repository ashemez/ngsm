function InitKPIQueryRuleEditor(kpiName,dsid,query){
	//console.log("Init function entered!!!!");
	var columnarray = [];
	var headerdiv = $("<div></div>")
		.addClass("modal-header");
	var closediv = $("<div></div>").addClass("close").attr("id","closersbquery").text("x").appendTo(headerdiv);
	var hdiv = $("<h3></h3>").text("Create Marginal/Bad Rule").appendTo(headerdiv);
	
	var bodydiv = $("<div></div>")
		.addClass("modal-body");
		
	var innerdiv1 = $("<div></div>");
	var label1 = $("<label></label>")
		.addClass("control-label")
		.css("margin-top","20px")
		.css("color","white")
		.text("KPI Name:").appendTo(innerdiv1);
	$("<label></label>").attr("id","kpi_name_header").text(kpiName).appendTo(innerdiv1);
	
	innerdiv1.appendTo(bodydiv);

	var innerdiv2 = $("<div></div>");
	var label2 = $("<label></label>")
	.addClass("control-label")
	.css("margin-top","20px")
	.css("color","white")
	.text("KPI Marginal Rule:").appendTo(innerdiv2);
	
	var innerdiv3 = $("<div></div>");
	var label3 = $("<label></label>")
	.addClass("control-label")
	.css("margin-top","40px")
	.css("color","white")
	.attr("id","kpi_bad_rule_header")
	.text("KPI Bad Rule:").appendTo(innerdiv3);
	
	$("#loader").attr('class', 'loader');
	console.log("dsid:"+dsid);
	console.log("query:"+query);
	$.ajax({
		cache: false,
		url:'/DataSource?p=getDSKPIQueryColumn&dsid='+dsid+ '&query='+query,
		success:function(data) {
			console.log("Data:"+data);
			$("#loader").attr('class', 'loader collapse');
			var jsonData = JSON.parse(data);
			if(jsonData.error != undefined || data.error!= null){
				var errordiv = "";
				headerdiv.appendTo($("#rightsidebar"));
				var errordiv = $("<div></div>");
				var errorlabel = $("<label></label>")
					.addClass("control-label")
					.css("margin-top","20px")
					.css("color","white")
					.text("Query Error:").appendTo(errordiv);
				$("<label></label>").attr("id","error_header").text(jsonData.error).appendTo(errordiv);
				errordiv.appendTo(bodydiv);
				bodydiv.appendTo("#rightsidebar");
			}
			else{
				if(jsonData.length > 0){
					var qeditordivmarginal = $(
							"<div class=\"col-md-12 col-lg-10 col-lg-offset-1\">" +
							"<div id=\"builder-import_export_marginal\"></div>" +
							"<div class=\"btn-group\"><button class=\"btn btn-danger reset\" id=\"btn-reset_marginal\" data-target=\"import_export\">Reset</button>" +
							"<button class=\"btn btn-warning\" id=\"btn-save-rule_marginal\" data-target=\"import_export\">Save</button>" +
							"</div>" +
							"</div>" +
							"");
					var qeditordivbad = $(
							"<div class=\"col-md-12 col-lg-10 col-lg-offset-1\">" +
							"<div id=\"builder-import_export_bad\"></div>" +
							"<div class=\"btn-group\"><button class=\"btn btn-danger reset\" id=\"btn-reset_bad\" data-target=\"import_export\">Reset</button>" +
							"<button class=\"btn btn-warning\" id=\"btn-save-rule_bad\" data-target=\"import_export\">Save</button>" +
							"</div>" +
							"</div>" +
							"");
					headerdiv.appendTo($("#rightsidebar"));
					qeditordivmarginal.appendTo(innerdiv2);
					innerdiv2.appendTo(bodydiv);
					qeditordivbad.appendTo(innerdiv3);
					innerdiv3.appendTo(bodydiv);
					bodydiv.appendTo("#rightsidebar");
					DrawQBMarginal(jsonData);
					DrawQBBad(jsonData);
				} else {
					var innerdiv = "";
					headerdiv.appendTo($("#rightsidebar"));
					var innerdiv = $("<div></div>");
					var innerlabel = $("<label></label>")
						.addClass("control-label")
						.css("margin-top","20px")
						.css("color","white")
						.text("Query Error:").appendTo(innerdiv);
					$("<label></label>").attr("id","error_header").text("Please control the Query. No rules can be applied!").appendTo(innerdiv);
					innerdiv.appendTo(bodydiv);
					bodydiv.appendTo("#rightsidebar");
				}								
			}
			
		}
	});
}

function InitEditKPIQueryRuleEditor(kpiName,dsid,query){
	var columnarray = [];
	var headerdiv = $("<div></div>")
		.addClass("modal-header");
	var closediv = $("<div></div>").addClass("close").attr("id","closersbquery").text("x").appendTo(headerdiv);
	var hdiv = $("<h3></h3>").text("Edit Marginal/Bad Rule").appendTo(headerdiv);
	
	var bodydiv = $("<div></div>")
		.addClass("modal-body");
		
	var innerdiv1 = $("<div></div>");
	var label1 = $("<label></label>")
		.addClass("control-label")
		.css("margin-top","20px")
		.css("color","white")
		.text("KPI Name:").appendTo(innerdiv1);
	$("<label></label>").attr("id","kpi_name_header").text(kpiName).appendTo(innerdiv1);
	
	innerdiv1.appendTo(bodydiv);

	var innerdiv2 = $("<div></div>");
	var label2 = $("<label></label>")
	.addClass("control-label")
	.css("margin-top","20px")
	.css("color","white")
	.text("KPI Marginal Rule:").appendTo(innerdiv2);
	
	var innerdiv3 = $("<div></div>");
	var label3 = $("<label></label>")
	.addClass("control-label")
	.css("margin-top","40px")
	.css("color","white")
	.attr("id","kpi_bad_rule_header")
	.text("KPI Bad Rule:").appendTo(innerdiv3);
	
	$("#loader").attr('class', 'loader');
	console.log("dsid:"+dsid);
	console.log("query:"+query);
	$.ajax({
		cache: false,
		url:'/DataSource?p=getDSKPIQueryColumn&dsid='+dsid+ '&query='+query,
		success:function(data) {
			console.log("Data:"+data);
			$("#loader").attr('class', 'loader collapse');
			var jsonData = JSON.parse(data);
			if(jsonData.error != undefined || data.error!= null){
				var errordiv = "";
				headerdiv.appendTo($("#rightsidebar"));
				var errordiv = $("<div></div>");
				var errorlabel = $("<label></label>")
					.addClass("control-label")
					.css("margin-top","20px")
					.css("color","white")
					.text("Query Error:").appendTo(errordiv);
				$("<label></label>").attr("id","error_header").text(jsonData.error).appendTo(errordiv);
				errordiv.appendTo(bodydiv);
				bodydiv.appendTo("#rightsidebar");
			}
			else{
				if(jsonData.length > 0){
					var qeditordivmarginal = $(
							"<div class=\"col-md-12 col-lg-10 col-lg-offset-1\">" +
							"<div id=\"builder-import_export_marginal\"></div>" +
							"<div class=\"btn-group\"><button class=\"btn btn-danger reset\" id=\"btn-reset_marginal\" data-target=\"import_export\">Reset</button>" +
							"<button class=\"btn btn-warning\" id=\"edit_btn-save-rule_marginal\" data-target=\"import_export\">Save</button>" +
							"</div>" +
							"</div>" +
							"");
					var qeditordivbad = $(
							"<div class=\"col-md-12 col-lg-10 col-lg-offset-1\">" +
							"<div id=\"builder-import_export_bad\"></div>" +
							"<div class=\"btn-group\"><button class=\"btn btn-danger reset\" id=\"btn-reset_bad\" data-target=\"import_export\">Reset</button>" +
							"<button class=\"btn btn-warning\" id=\"edit_btn-save-rule_bad\" data-target=\"import_export\">Save</button>" +
							"</div>" +
							"</div>" +
							"");
					headerdiv.appendTo($("#rightsidebar"));
					qeditordivmarginal.appendTo(innerdiv2);
					innerdiv2.appendTo(bodydiv);
					qeditordivbad.appendTo(innerdiv3);
					innerdiv3.appendTo(bodydiv);
					bodydiv.appendTo("#rightsidebar");
					DrawQBMarginal(jsonData);
					DrawQBBad(jsonData);
				} else {
					var innerdiv = "";
					headerdiv.appendTo($("#rightsidebar"));
					var innerdiv = $("<div></div>");
					var innerlabel = $("<label></label>")
						.addClass("control-label")
						.css("margin-top","20px")
						.css("color","white")
						.text("Query Error:").appendTo(innerdiv);
					$("<label></label>").attr("id","error_header").text("Please control the Query. No rules can be applied!").appendTo(innerdiv);
					innerdiv.appendTo(bodydiv);
					bodydiv.appendTo("#rightsidebar");
				}								
			}
			
		}
	});
}


function DrawQBMarginal(jsonData){
	$('#builder-import_export_marginal').queryBuilder({
		  plugins: [
		    'bt-tooltip-errors',
		    'not-group'
		  ],

		  filters: jsonData
	});

	$('#btn-reset_marginal').on('click', function() {
		  $('#builder-import_export_marginal').queryBuilder('reset');
		  $("#kpi_form #thmrule").val("");
	});

	$('#btn-save-rule_marginal').on('click', function() {
		var result = $('#builder-import_export_marginal').queryBuilder('getSQL');
		console.log("SQL:" + result);
		if (!$.isEmptyObject(result)){
			if (result.sql.length){
				console.log(result.sql);
				//var sql = result.sql.split(" ").join("$");
				//console.log(sql);
				$("#kpi_form #thmrule").val(result.sql);
				
			}			
		}
		
		/*$("#loader").attr('class', 'loader');
		  var result = $('#builder-import_export').queryBuilder('getSQL');
		     if (!$.isEmptyObject(result))
		    	 if (result.sql.length){
		    		 // console.log(result.sql);
		    		 var sql = result.sql.split("=").join("~");
		    		 sql = sql.split(" ").join("$");
		    		 var url = '/gbsm/OutputRules?p=saveOutputRule&parentSid=' + sid + '&condition=' + sql;
		    		 $.ajax({
		    				cache: false,
		    				url:url,
		    				success:function(data) {
		    					$("#loader").attr('class', 'loader collapse');
		    				}
		    			});
		    	 }
		  */  	
	});
	
	$('#edit_btn-reset_marginal').on('click', function() {
		  $('#builder-import_export_marginal').queryBuilder('reset');
		  $("#edit_kpi_form #edit_thmrule").val("");
	});

	$('#edit_btn-save-rule_marginal').on('click', function() {
		var result = $('#builder-import_export_marginal').queryBuilder('getSQL');
		console.log("SQL:" + result);
		if (!$.isEmptyObject(result)){
			if (result.sql.length){
				console.log(result.sql);
				$("#edit_kpi_form #edit_thmrule").val(result.sql);
				
			}			
		} 	
	});
		
	/*$('#btn-set-sql').on('click', function() {
	  $('#builder-import_export').queryBuilder('setRulesFromSQL', sql_import_export);
	});

	$('#btn-set-mongo').on('click', function() {
	  $('#builder-import_export').queryBuilder('setRulesFromMongo', mongo_import_export);
	});

	$('#btn-get-sql').on('click', function() {
	  //var result = $('#builder-import_export').queryBuilder('getSQL', 'question_mark');

	  var result = $('#builder-import_export').queryBuilder('getSQL');
	     if (!$.isEmptyObject(result))
	    	 if (result.sql.length)
	    		 console.log(result.sql);
	});*/

	/*$('#btn-get-mongo').on('click', function() {
	  var result = $('#builder-import_export').queryBuilder('getMongo');

	  if (!$.isEmptyObject(result)) {
		  console.log(JSON.stringify(result, null, 2));
	  }
	});*/
}

function DrawQBBad(jsonData){
	$('#builder-import_export_bad').queryBuilder({
		  plugins: [
		    'bt-tooltip-errors',
		    'not-group'
		  ],

		  filters: jsonData
	});

	$('#btn-reset_bad').on('click', function() {
		  $('#builder-import_export_bad').queryBuilder('reset');
		  $("#kpi_form #thbrule").val("");
	});

	$('#btn-save-rule_bad').on('click', function() {
		var result = $('#builder-import_export_bad').queryBuilder('getSQL');
		console.log("SQL:" + result);
		if (!$.isEmptyObject(result)){
			if (result.sql.length){
				console.log(result.sql);
				//var sql = result.sql.split("=").join("~");
				//console.log(sql);
				$("#kpi_form #thbrule").val(result.sql);
				
			}			
		}
		/*
		$("#loader").attr('class', 'loader');
		  var result = $('#builder-import_export').queryBuilder('getSQL');
		     if (!$.isEmptyObject(result))
		    	 if (result.sql.length){
		    		 // console.log(result.sql);
		    		 var sql = result.sql.split("=").join("~");
		    		 sql = sql.split(" ").join("$");
		    		 var url = '/gbsm/OutputRules?p=saveOutputRule&parentSid=' + sid + '&condition=' + sql;
		    		 $.ajax({
		    				cache: false,
		    				url:url,
		    				success:function(data) {
		    					$("#loader").attr('class', 'loader collapse');
		    				}
		    			});
		    	 }
		    	 */
	});
	
	$('#edit_btn-reset_bad').on('click', function() {
		  $('#builder-import_export_bad').queryBuilder('reset');
		  $("#edit_kpi_form #edit_thbrule").val("");
	});

	$('#edit_btn-save-rule_bad').on('click', function() {
		var result = $('#builder-import_export_bad').queryBuilder('getSQL');
		console.log("SQL:" + result);
		if (!$.isEmptyObject(result)){
			if (result.sql.length){
				console.log(result.sql);
				//var sql = result.sql.split("=").join("~");
				//console.log(sql);
				$("#edit_kpi_form #edit_thbrule").val(result.sql);
				
			}			
		}
	});
		
	/*$('#btn-set-sql').on('click', function() {
	  $('#builder-import_export').queryBuilder('setRulesFromSQL', sql_import_export);
	});

	$('#btn-set-mongo').on('click', function() {
	  $('#builder-import_export').queryBuilder('setRulesFromMongo', mongo_import_export);
	});

	$('#btn-get-sql').on('click', function() {
	  //var result = $('#builder-import_export').queryBuilder('getSQL', 'question_mark');

	  var result = $('#builder-import_export').queryBuilder('getSQL');
	     if (!$.isEmptyObject(result))
	    	 if (result.sql.length)
	    		 console.log(result.sql);
	});*/

	/*$('#btn-get-mongo').on('click', function() {
	  var result = $('#builder-import_export').queryBuilder('getMongo');

	  if (!$.isEmptyObject(result)) {
		  console.log(JSON.stringify(result, null, 2));
	  }
	});*/
}
