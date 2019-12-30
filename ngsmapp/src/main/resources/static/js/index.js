//When Page Load Submenu1 open collapse 

$(document).ready(function() {
	// disable enter key
	$("form").keypress(function(e) {
	  if (e.which == 13) {
	    return false;
	  }
	});
	
	$("#contentheader .panel-heading").text('Dashboards > Business Services');
	if(!$("#submenu-1 #dash1").hasClass("faimagecolor")){
		$("#mainmenu1 a").trigger("click");
		$("#submenu-1 #dash1").trigger("focus");
	}
	outerPaginate(statusFilter, spattern);
	
	//List / Grid active button
	var container = document.getElementById("listgridcontainer");
	var btns = container.getElementsByClassName("btn");
	for (var i = 0; i < btns.length; i++) {
	  btns[i].addEventListener("click", function(){
	    var current = document.getElementsByClassName("active");
	    current[0].className = current[0].className.replace(" active", "");
		this.className += " active";
		console.log("Active chnage");
	  });
	}
	
	$("#listgridcontainer").on('click', '#listbtn', function (){
		listgridvalue=0;
		$("#servicesboxes div.col-md-3").each(function(){
			$(this).removeClass("col-md-3").addClass("col-md-12");
			$(this).find(".inner").css("display","none");
			var availabilty = $(this).find(".inner h3").text();
			var name = $(this).find(".inner p").text();
			$(this).find("#contenta").css("padding","0px");
			$(this).find(".small-box").css("margin-bottom","10px");
			$(this).find("#contenta").text("");
			var h3 = $("<h3></h3>").text(availabilty).appendTo($(this).find("#contenta"));
			var p = $("<p></p>").text(name).appendTo($(this).find("#contenta"));
			var icondiv = $("<div></div>").attr("id","icondiv").css("display","contents");
			if($(this).find(".inner #icondiv span").hasClass('fa-wrench')) {
				var p = $("<span></span>").attr("id","mainico").css("display","table-cell").css("padding-right","10px").css("text-align","right");
				p.addClass("fa fa-wrench");		
			}
			else{
				var p = $("<span></span>").attr("id","mainico").text("").css("display","table-cell").css("padding-right","10px").css("text-align","right");
			}
			p.appendTo(icondiv);
			var kpip = $("<span></span>").attr("id","kpiico").css("display","table-cell").css("padding-right","10px").css("text-align","right").css("width","30px").css("max-width","30px");
			kpip.addClass("fa fa-bar-chart");
			kpip.appendTo(icondiv);
			icondiv.appendTo($(this).find("#contenta"));
			
			$(this).find("#contenta").css("display","table").css("width","100%");
			$(this).find("#contenta h3").css("display","table-cell").css("padding-left","10px").css("text-align","left").css("width","100px").css("max-width","100px");
			$(this).find("#contenta p").css("display","table-cell").css("text-align","left");

			
		});

	});
	
	$("#listgridcontainer").on('click', '#gridbtn', function (){
		listgridvalue=1;
		$("#servicesboxes div.col-md-12").each(function(){
			$(this).removeClass("col-md-12").addClass("col-md-3");
			$(this).find("#contenta").css("padding","3px 0");
			$(this).find(".small-box").css("margin-bottom","20px");
			$(this).find("#contenta h3").remove();
			$(this).find("#contenta p").remove();
			
			$(this).find(".inner").css("display","block");
			$(this).find("#contenta").text("Go to Topology");
			$("<i></i>").addClass("fa fa-arrow-circle-right").appendTo($(this).find("#contenta"));
			
		});
	});
	
	
	//Redirect jsp pages
    $("#submenu-1 #li_kpiover").on('click', 'a', function (){
    	window.location.href ="/kpioverall.jsp?page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval;
    });    
	$("#submenu-2 #li_rptlists" ).on('click', 'a', function (){
    	window.location.href ="/ReportViewer.jsp?p=reportlist&page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval;
    });
    $("#submenu-2 #li_rptjobs").on('click', 'a', function (){
    	window.location.href ="/ReportViewer.jsp?p=reportjobs&page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval;
    });	
    $("#submenu-3 #li_ds" ).on('click', 'a', function (){
    	window.location.href ="/kpi.jsp?p=ds&page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval;
    });
    $("#submenu-3 #li_kpi" ).on('click', 'a', function (){
    	window.location.href ="/kpi.jsp?p=kpi&page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval;
    });
    $("#admin_menu #li_usr" ).on('click', 'a', function (){
    	window.location.href ="/admin.jsp?p=users&page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval;
    });
    $("#admin_menu #li_role" ).on('click', 'a', function (){
    	window.location.href ="/admin.jsp?p=roles&page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval;
    });
    $("#admin_menu #li_grp" ).on('click', 'a', function (){
    	window.location.href ="/admin.jsp?p=groups&page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval;
    });
    $("#op_menu #li_maintenance").on('click', 'a', function (){
    	window.location.href ="/maintenance.jsp?page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval;
    });
    $("#op_menu #li_eventcatalog").on('click', 'a', function (){
    	window.location.href ="/eventcatalog.jsp?page="+srvBoxPageNumber+"&statusFilter="+statusFilter+"&msbval="+minisideval;
    });
});
/*
function PopulateAllSearchedBoxes(spagenumber){
    $('.js-typeahead').typeahead({
        minLength: 0,
        maxItem: 0,
        order: "asc",
        hint: true,
        resultContainer: '#searchboxes',
        displayKey: 'service_instance_name',
        generateOnLoad: true,
		source: {
			ajax: {
                method: 'GET',
                url: "/PopulateSearchServicesBoxes?statusFilter=0,3,5",
                callback: {
                    done: function (data) {
                    	return data;
                    }
                }
            }
		},
	    template: function (query, item) {
	    	//console.log(item.current_status);
	    	var status = "orange";
	        if (item.current_status === 0) {
	            status = "green";
	        }else if(item.current_status === 5)
	        	status = "red";	        
	        return '<div>' +
	    		'<div class="small-box bg-'+status+'" id="{{service_instance_id}}" data-tag="'+status+'">' +
	    		'<div class="inner"><h3>{{availability_metric}}%</h3><p>{{service_instance_name}}</p></div>'+
	    		'<a id="contenta" href="javascript:;" serviceid="{{service_instance_id}}" servicename="{{service_instance_name}}" class="small-box-footer">Go to Topology<i class="fa fa-arrow-circle-right"></i></a></div>'+
	    		'</div>'
	    },
        emptyTemplate: function (query) {
            return 'No services found' + ((query) ? ' matching "' + query + '"' : '');
        },
        dynamicFilter: [{
            selector: '#paginationdiv',
            key: '|tags.Assassin'
        }],
        display: ["service_instance_name","current_status"],
        callback: {
        	onReady: function (node) {
                //$('#servicesboxes').addClass('collapse');
                $('#searchboxes').removeClass('collapse');
            },
        	onSubmit: function (node, a, item, event) {
                // href key gets added inside item from options.href configuration
                //console.log("After:"+node);
            },
            onLayoutBuiltBefore: function (node, query, result, resultHtmlList) {
            	srvidList = [];
            	srvidListTotal = [];
            	console.log("onLayoutBuiltBefore event");
            	//console.log(resultHtmlList + "****" + result.length);
            	//$("#checkboxdiv .btn-group input[type=checkbox]") .attr('disabled', true);
            	if(result.length > 0){
            		//var startsrv = (spagenumber-1)*12;
            		//var endsrv = (spagenumber-1)*12+11;
	            	$.each(resultHtmlList.find('li'), function (i, li) {
	        	        //if(i < startsrv || i > endsrv){
	        	        //	$(this).remove();
	        	        //}
	        	        //else{
	            	    //    $(this).addClass("col-md-3");
	            	    //    $(this).find('a:first-child').removeAttr("href");
	            	    //    srvidList[srvidList.length] = result[i].service_instance_id;
	        	        //}
	        	        //srvidListTotal[srvidListTotal.length] = result[i].service_instance_id;
	            		$(this).addClass("col-md-3");
            	        $(this).find('a:first-child').removeAttr("href");
            	        srvidListTotal[srvidListTotal.length] = result[i].service_instance_id;
	        	    });
	            	
	                //for (var i = 0; i < result.length; i++) {
	                //	srvidListTotal[srvidListTotal.length] = result[i].service_instance_id;
	                //	//roles = [];
	                //}
            	}
	            //console.log("SRVIDLIST:"+srvidList);
                outerPopulateSearchServicesCategoryCount();
                availabilityInterval = setInterval(updateAvailabilityInterval(wheelPaging), 10000);
                //console.log(statusFilter);
                return resultHtmlList;
 
            },

        },
        debug: true
    });

}*/

//outerPopulateAllSearchedBoxes = PopulateAllSearchedBoxes;

/*function updateAvailabilityInterval(wheelPaging){
	if(!wheelPaging) {
		console.log(srvidList);
		if(srvidList.length > 0){
			console.log('/Chart?p=getAvailabilityMetricList&sidlist=' + srvidList + '&queryType=TODAY');
			$.ajax({
				cache: false,
				url:'/Chart?p=getAvailabilityMetricList&sidlist=' + srvidList + '&queryType=TODAY',
				success:function(data) {
					console.log("Data:"+data);
					dashMetric = JSON.parse(data);
					for(var i=0; i<dashMetric.length; i++)
					{
						for(var key in dashMetric[i])
						{
							var ms = dashMetric[i][key].split(':');
							$("#searchboxes #" + key + " h3").text(ms[0] + '%');
							$("#searchboxes #" + key).removeClass();
							$("#searchboxes #" + key).addClass("small-box bg-"+getServiceStatusColor(ms[1]));
							$("#searchboxes #" + key).attr("data-tag", getServiceStatusValue(ms[1]));
						}
					}
				}
			});
		}
	}
}

function getSearchServiceData(page){
	$.ajax({
		cache: false,
		url:"/PopulateServicesBoxes?page="+page+"&statusFilter=0,3,5",
		success:function(data) {
			var newData = [];
			//$.each(data, function(){
			//	newData.push(this.service_instance_name);
			//});
			//var jsonval = JSON.stringify(newData)
			//console.log(jsonval);
			//return jsonval;
			return data;
		} 
	});
}

*/