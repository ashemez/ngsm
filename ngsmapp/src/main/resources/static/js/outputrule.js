function InitRuleEditor(d){
	var headerdiv = $("<div></div>")
	.addClass("modal-header");
	var closediv = $("<div></div>").addClass("close").attr("id","closersb").text("x").appendTo(headerdiv);
	var hdiv = $("<h3></h3>").text("Output Rules").appendTo(headerdiv);
	$("<label></label>").attr("id","chart_node_name").text(d.name).appendTo(headerdiv);
	$("#loader").attr('class', 'loader');
	$.ajax({
		cache: false,
		url:'/NodeGroups?p=getNodeGroupsAndNonGroupedNodesOfCurrentFunctionalGroup&parentSid=' + d.sid,
		success:function(data) {
			//$("#loader").attr('class', 'loader collapse');

			var filterData = JSON.parse(data);
			if(filterData.length > 0){
				var bodydiv = $(
						"<div class=\"modal-body col-md-12 col-lg-10 col-lg-offset-1\">" +
						"<div id=\"builder-import_export\"></div>" +
						/*"<div class=\"btn-group\">" +
						"<button class=\"btn btn-warning reset\" data-target=\"import_export\">Reset</button>" +
						"</div>" +
						"<div class=\"btn-group\">" +
						"<button class=\"btn btn-success set-sql\" data-target=\"import_export\">Set rules from SQL</button>" +
						"<button class=\"btn btn-success set-mongo\" data-target=\"import_export\">Set rules from MongoDB</button>" +
						"</div>" +
						"<div class=\"btn-group\">" +
						"<button class=\"btn btn-primary parse-sql\" data-target=\"import_export\" data-stmt=\"question_mark\">SQL statement" +
						"(?)" +
						"</button>" +
						"<button class=\"btn btn-primary parse-sql\" data-target=\"import_export\" data-stmt=\"named\">SQL statement (named)" +
						"</button>" +
						"<button class=\"btn btn-primary parse-mongo\" data-target=\"import_export\">MongoDB</button> </div>" + */
						//"<button id=\"btn-get-sql\" class=\"btn btn-primary parse-sql\" data-target=\"import_export\" data-stmt=\"false\">SQL</button>" +
						"<div class=\"btn-group\"><button class=\"btn btn-danger reset\" id=\"btn-reset\" data-target=\"import_export\">Reset</button>" +
						"<button class=\"btn btn-warning\" id=\"btn-save-rule\" data-target=\"import_export\">Save</button>" +
						"</div>" +
						"</div>" +
						"");
				headerdiv.appendTo($("#rightsidebar"));
				bodydiv.appendTo($("#rightsidebar"));
				var rowdiv = $("<div class=\"row\"></div>");
				rowdiv.appendTo($("#rightsidebar"));
				var footerdiv = $("<div id=\"qb_resultmsg\" class=\"collapse alert alert-success\"></div>");
				footerdiv.appendTo($("#rightsidebar"));
				
				DrawQB(d.sid, filterData);
			} else {
				var bodydiv = $(
						"<div class=\"col-md-12 col-lg-10 col-lg-offset-1\">" +
						d.name + " doesn't have any children, no rules can be applied!" +
						"</div>" +
						"");
				headerdiv.appendTo($("#rightsidebar"));
				bodydiv.appendTo($("#rightsidebar"));
			}

			$.ajax({
				cache: false,
				url:'/OutputRules?p=getOutputRule&parentSid=' + d.sid,
				success:function(sql) {
					$("#loader").attr('class', 'loader collapse');
					console.log(sql);
					if(sql != ""){
						ImportSQLRule(sql);
					}
				}
			});
		}
	});
}


function DrawQB(sid, filterData){
	$('#builder-import_export').queryBuilder({
		plugins:{
			'bt-selectpicker': { width: 100 }
		},
		filters: filterData
	});

	$('#btn-reset').on('click', function() {
		  $('#builder-import_export').queryBuilder('reset');
	});

	$('#btn-save-rule').on('click', function() {
		  //var result = $('#builder-import_export').queryBuilder('getSQL', 'question_mark');
		
		$("#loader").attr('class', 'loader');
		  var result = $('#builder-import_export').queryBuilder('getSQL');
		     if (!$.isEmptyObject(result))
		    	 if (result.sql.length){
		    		 //console.log(result.sql);
		    		 var sql = result.sql.split("=").join("~");
		    		 sql = sql.split(" ").join("$");
		    		 var url = '/OutputRules?p=saveOutputRule&parentSid=' + sid + '&condition=' + sql;
		    		 $.ajax({
		    				cache: false,
		    				url:url,
		    				success:function(data) {
		    					$("#loader").attr('class', 'loader collapse');
		    					var outputdat = JSON.parse(data);
		    					$('#qb_resultmsg').text(outputdat.message);
		    					$('#qb_resultmsg').removeClass('collapse');
		    					$('#qb_resultmsg').attr('style', "display: block;");
		    					$('#qb_resultmsg').delay(2000).slideUp({ opacity: "show" }, "slow");
		    				}
		    			});
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

function ImportSQLRule(sql_import) {
	// import condition of selected output rule to be edited
	$('#builder-import_export').queryBuilder('setRulesFromSQL', sql_import);
}
 