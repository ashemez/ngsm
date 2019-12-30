var debug = false;

var visualLength = function(str){
	var ruler = document.createElement('span');
	ruler.style.visibility = 'hidden';
	ruler.style['white-space'] = 'nowrap';
	document.body.appendChild(ruler);
	ruler.innerHTML = str;
	var l =ruler.offsetWidth;
	document.body.removeChild(ruler);
	return l;
};

var td;
var createNodeFunc;
function ShowModal(_d)
{
	td = _d;
	//functions in Vodafone.js
	clearRSB();
	createAddNodeDivRSB(td);
	openRSB();
}

var renameNodeFunc;
function RenameNodeModal(_d)
{
	td = _d;
	//functions in Vodafone.js
	clearRSB();
	renameNodeDivRSB(td);
	openRSB();
}

var showAllParentFunc;
function showParentModal(_d)
{
	td = _d;
	//functions in Vodafone.js
	clearRSB();
	renameNodeDivRSB(td);
	openRSB();
}

function createGroupNodeFunc(_d){
	
}

var smRoot;
var mainServiceID = 0;
var mainServiceName = '';
var svgElement;
var svgWidth = 0;
var svgHeight = 0;
var dblclickTarget;
var bottomMost = 0;
var rightMost = 0;
var outerCenterNode;
var grpNodes = {};
var grpNodesName = {};
var activeGroupNodes = new Array();
var deactiveGroupNodes = new Array();
var activeGroupNodesName = new Array();
var deactiveGroupNodesName = new Array();
var treeUniqueSidList = new Array();
var rootNode;
var outer_update;
var outerUpdateStats;
var outer_mngGrpClose;
var outer_ShowParents;
var outer_MonthlyReport;
function getServiceTreeData(_sid) {
	treeUniqueSidList = [];

	$("#loader").attr('class', 'loader');
	mainServiceID = _sid;
	//mainServiceName = _sname;
	
	//if($.inArray(parseInt(_sid), treeUniqueSidList) < 0)
	//	treeUniqueSidList.push(parseInt(_sid));

    $.ajax({
        cache: false,
        url:'/ServiceStatOps?p=getServiceDiagram&sid=' + _sid,  
        success:function(data) {
        	//console.log(data);
            var smRootArr = JSON.parse(data);
            smRoot = smRootArr[0];
            treeUniqueSidList = smRootArr[1];
            $("#loader").attr('class', 'loader collapse');
            $("#divtree").attr('class', '');
            $("#servicesboxes").attr('class', 'row collapse');
            $("#checkboxdiv").attr('class', 'collapse'); 
            $("#contentpage .btn-group.row").css({"display":"table-footer-group"});
            $("#switchautozoom").css({"display":"none"});
            $("#paginationdiv").attr('class', 'row collapse');
            $("#contentheader .panel-heading").text("Dashboards > Service Tree > " + smRoot.name);
			DrawTree();
			
			//zoomFit(true, undefined, 500);
			
			//GetServiceAlarmList(_sid);
			buildAlarmTable(_sid);
			setInterval( function () {
				buildAlarmTable(_sid); // user paging is not reset on reload
			}, 30000 );
			//GetKPIList(_sid);
			buildKpiTable(_sid);
			$("#alarm-kpi-list").removeClass("collapse");
			
			var svgtimer = setTimeout(function() {
				zoomFit(false, undefined, 300);
			}, 600);
        }
    });
	
	function DrawTree() {
		// Calculate total nodes, max label length
		var totalNodes = 0;
		var maxLabelLength = 20;
		// variables for drag/drop
		var selectedNode = null;
		var draggingNode = null;
		// panning variables
		var panSpeed = 200;
		var panBoundary = 20; // Within 20px from edges will pan when dragging.
		// Misc. variables
		var i = 0;
		var duration = 750;
		var root;

		// new node initial values - for right click menu
		var newNodeBase = "New";
		var newNodeValue = 5;
		var nodeNoMax = 10000;
		var newNodeValue = 5;
		var newNodeStatus = "In";
		var newNodeType = "Medium";
		var newLinkWidth = 15;

		// size of the diagram
		var viewerWidth = $('#divtree').width();
		svgWidth = viewerWidth;
		var viewerHeight = $('#divtree').height();
		svgHeight = viewerHeight;

		// tree layout
		var radius = 40;
		var tree = d3.layout.tree()
			.size([viewerHeight, viewerWidth])
			.nodeSize([radius + 50, radius]);

		// define a d3 diagonal projection for use by the node paths later on.
		var diagonal = d3.svg.diagonal()
			.projection(function(d) {
				return [d.x, d.y];
			});

		var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<span style='color:#FFFFFF;font-size: 15px;background-color: #2c3846;'>" + d.name + "</span>";
		})
            
		// A recursive helper function for performing some setup by walking through all nodes
		function visit(parent, visitFn, childrenFn) {
			if (!parent) return;

			visitFn(parent);

			var children = childrenFn(parent);
			if (children) {
				var count = children.length;
				for (var i = 0; i < count; i++) {
					visit(children[i], visitFn, childrenFn);
				}
			}
		}

		// Call visit function to establish maxLabelLength
		visit(smRoot, function(d) {
				totalNodes++;
				maxLabelLength = Math.max(d.name.length, maxLabelLength);
				}, function(d) {
				return d.children && d.children.length > 0 ? d.children : null;
			});

		// sort the tree according to the node names
		function sortTree() {
			tree.sort(function(a, b) {
				return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
			});
		}
		// Sort the tree initially incase the JSON isn't in a sorted order.
		sortTree();

		// TODO: Pan function, can be better implemented.
		function pan(domNode, direction) {
			var speed = panSpeed;
			if (panTimer) {
				clearTimeout(panTimer);
				translateCoords = d3.transform(svgGroup.attr("transform"));
				if (direction == 'left' || direction == 'right') {
					translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
					translateY = translateCoords.translate[1];
				} else if (direction == 'up' || direction == 'down') {
					translateX = translateCoords.translate[0];
					translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
				}
				scaleX = translateCoords.scale[0];
				scaleY = translateCoords.scale[1];
				scale = zoomListener.scale();
				svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
				d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
				zoomListener.scale(zoomListener.scale());
				zoomListener.translate([translateX, translateY]);
				panTimer = setTimeout(function() {
					pan(domNode, speed, direction);
				}, 50);
			}
		}

		// Define the zoom function for the zoomable tree
		var initiated = false;
		function zoom() {
			if(!initiated){
				initiated = true;
			}
			if(root != null){
				svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
			}
			
			//DebugLog(d3.event.translate);
		}

		// define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
		var zoomListener = d3.behavior
		.zoom()
		.scaleExtent([0.1, 3])
		.on("zoom", zoom);
		
		outerZoom = zoomListener;

		function initiateDrag(d, domNode) {
			draggingNode = d;
			d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
			d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
			d3.select(domNode).attr('class', 'node activeDrag');

			svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
				if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
				else return -1; // a is the hovered element, bring "a" to the front
			});
			// if nodes has children, remove the links and nodes
			if (nodes.length > 1) {
				// remove link paths
				links = tree.links(nodes);
				nodePaths = svgGroup.selectAll("path.link")
					.data(links, function(d) {
						return d.target.id;
					}).remove();
				// remove child nodes
				nodesExit = svgGroup.selectAll("g.node")
					.data(nodes, function(d) {
						return d.id;
					}).filter(function(d, i) {
						if (d.id == draggingNode.id) {
							return false;
						}
						return true;
					}).remove();
			}

			// remove parent link
			parentLink = tree.links(tree.nodes(draggingNode.parent));
			svgGroup.selectAll('path.link').filter(function(d, i) {
				if (d.target.id == draggingNode.id) {
					return true;
				}
				return false;
			}).remove();

			dragStarted = null;
		}

		// define the baseSvg, attaching a class for styling and the zoomListener
		d3.select("svg").remove();
		d3.select("#treebuttonmenu").remove();
		var baseSvg = d3.select("#tree-container").append("svg")
			//.attr("width", viewerWidth)
			//.attr("height", viewerHeight)
			.attr("width", "100%")
			.attr("height", viewerHeight)
			.attr("class", "overlay")
			.call(zoomListener);
		
		//d3.select("#tree-container").append("div").attr("data-toggle","tooltip").attr("title","Zoom to Fit").attr("id",'treebuttonmenu').append("button").attr("style","background:url(resource/img/tree/fit.png);height:25px;width:25px;border:0px").on("click", changeZoomtoFit);
		d3.select("#tree-container").append("div").attr("id",'treebuttonmenu');
		$("<button></button>").addClass("btn btn-warning").attr("id","zoomtofit").text("Zoom to Fit").on("click", changeZoomtoFit).appendTo($("#treebuttonmenu"));
		//$("<button></button>").addClass("btn").attr("id","expandall").text("Expand All").on("click", expandAllTree).appendTo($("#treebuttonmenu"));
		$("<button></button>").addClass("btn").attr("id","collapseall").text("Collapse All").on("click", collapseAllTree).appendTo($("#treebuttonmenu"));
		//$("#treebuttonmenu").append("button").attr("id","expandall").attr("value","Expand All").on("click", expandAllTree);
		//$("#treebuttonmenu").append("button").attr("id","collapseall").attr("value","Collapse All").on("click", collapseAllTree);
		//d3.select("#tree-container").append("div").attr("data-toggle","tooltip").attr("title","Zoom to Fit").attr("id",'treebuttonmenu').append("input").attr("class","fit25").attr("type","button").on("click", changeZoomtoFit);

		//baseSvg.append("button").text("Zoom to Fit").attr("position","absolute").attr("bottom","1em").attr("left", "1em").on("click", changeZoomtoFit);

		// Define the drag listeners for drag/drop behaviour of nodes.
		dragListener = d3.behavior.drag()
			.on("dragstart", function(d) {
				/*if (d == root) {
					return;
				}
				dragStarted = true;
				nodes = tree.nodes(d);
				d3.event.sourceEvent.stopPropagation();
				*/
				// it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
			})
			.on("drag", function(d) {
				/*if (d == root) {
					return;
				}
				if (dragStarted) {
					domNode = this;
					initiateDrag(d, domNode);
				}

				// get coords of mouseEvent relative to svg container to allow for panning
				relCoords = d3.mouse($('svg').get(0));
				if (relCoords[0] < panBoundary) {
					panTimer = true;
					pan(this, 'left');
				} else if (relCoords[0] > ($('svg').width() - panBoundary)) {

					panTimer = true;
					pan(this, 'right');
				} else if (relCoords[1] < panBoundary) {
					panTimer = true;
					pan(this, 'up');
				} else if (relCoords[1] > ($('svg').height() - panBoundary)) {
					panTimer = true;
					pan(this, 'down');
				} else {
					try {
						clearTimeout(panTimer);
					} catch (e) {

					}
				}

				d.x0 += d3.event.dx;
				d.y0 += d3.event.dy;
				var node = d3.select(this);
				node.attr("transform", "translate(" + d.x0 + "," + d.y0 + ")");
				updateTempConnector();
				*/
			}).on("dragend", function(d) {
				/*
				if (d == root) {
					return;
				}
				domNode = this;
				if (selectedNode) {
					// now remove the element from the parent, and insert it into the new elements children
					var index = draggingNode.parent.children.indexOf(draggingNode);
					if (index > -1) {
						draggingNode.parent.children.splice(index, 1);
					}
					if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
						if (typeof selectedNode.children !== 'undefined') {
							selectedNode.children.push(draggingNode);
						} else {
							selectedNode._children.push(draggingNode);
						}
					} else {
						selectedNode.children = [];
						selectedNode.children.push(draggingNode);
					}
					// Make sure that the node being added to is expanded so user can see added node is correctly moved
					expand(selectedNode);
					sortTree();

					MoveRelation(selectedNode.name, draggingNode.name);
					endDrag();
				} else {
					endDrag();
				}
				*/
			});

		function endDrag() {
			selectedNode = null;
			d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
			d3.select(domNode).attr('class', 'node');
			// now restore the mouseover event or we won't be able to drag a 2nd time
			d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
			updateTempConnector();
			if (draggingNode !== null) {
				update(root);
				//centerNode(draggingNode);
				draggingNode = null;
			}
		}

		// Helper functions for collapsing and expanding nodes.

		function collapse(d) {
			if (d.children) {
				d._children = d.children;
				d._children.forEach(collapse);
				d.children = null;
			}
		}

		function expand(d) {
			if (d._children) {
				d.children = d._children;
				d.children.forEach(expand);
				d._children = null;
			}
		}
		
		
		function expandAllTree(){
			if (root.children){
				collapseAllTree();
			}
		    expand(root); 
		    update(root);
		}
		

		function collapseAllTree(){
		    root.children.forEach(collapse);
		    collapse(root);
		    update(root);
		}

		var overCircle = function(d) {
			selectedNode = d;
			updateTempConnector();
		};
		var outCircle = function(d) {
			selectedNode = null;
			updateTempConnector();
		};

		// Function to update the temporary connector indicating dragging affiliation
		var updateTempConnector = function() {
			var data = [];
			if (draggingNode !== null && selectedNode !== null) {
				// have to flip the source coordinates since we did this for the existing connectors on the original tree
				data = [{
					source: {
						x: selectedNode.x0,
						y: selectedNode.y0
					},
					target: {
						x: draggingNode.x0,
						y: draggingNode.y0
					}
				}];
			}
			var link = svgGroup.selectAll(".templink").data(data);

			link.enter().append("path")
				.attr("class", "templink")
				.attr("d", d3.svg.diagonal())
				.attr('pointer-events', 'none');

			link.attr("d", d3.svg.diagonal());

			link.exit().remove();
		};

		// Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

		function centerNode(source) {
			zoomFit(false, undefined, 500);
		    /*x = -source.x0;
		    y = -source.y0;

		    //DebugLog('rightMost: ' + rightMost + ' bottomMost: ' + bottomMost);
		    xScale = (svgWidth / 2 + rightMost / 2) / parseInt(d3.select("body").select("svg").style("width"), 10);
			yScale = (svgHeight / 2 + bottomMost / 2) / parseInt(d3.select("body").select("svg").style("height"), 10);
			
			//DebugLog(xScale + '  ' + yScale);
			
			if(xScale < yScale){
			    x = x * xScale + svgWidth / 2;
		    	y = y * xScale + 80;
			    d3.select('g').transition()
		        .duration(750)
		        .attr("transform", "translate(" + x + "," + y + ")scale(" + xScale + ")");		
			    
			    zoomListener.scale(xScale);
				zoomListener.translate([x, y]);
			}
			else
			{
			    x = x * yScale + svgWidth / 2;
		    	y = y * yScale + 80;
			    d3.select('g').transition()
		        .duration(750)
		        .attr("transform", "translate(" + x + "," + y + ")scale(" + yScale + ")");
			    
			    zoomListener.scale(yScale);
				zoomListener.translate([x, y]);
			}*/
			
			/*scale = zoomListener.scale();
			
			x = -source.x0;
			y = -source.y0;
			x = x * scale + viewerWidth / 2;
			//y = y * scale + viewerHeight / 2;
			y = y * scale + 80;
			
			d3.select('g').transition()
				.duration(duration)
				.attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
			zoomListener.scale(scale);
			zoomListener.translate([x, y]);*/
		}
		outerCenterNode = centerNode;

		var groupSelectEnabled = false;
		// Define a context (popup) menu
		var mngGrpItem = {
				title: 'Manage Groups',
				action: function(elm, d, i) {
					ManageGroups(d, this);
				}
			};

		/*var menu = [
			{
				title: "IMPORT",
				action: function(elm, d, i) {
					$("#loader").attr('class', 'loader');
					$.ajax({
						cache: false,
						url:'/Mxm?p=sdfsdfsdfsdfsdf',
						success:function(data) {
							$("#loader").attr('class', 'loader collapse');
						}
					});
				}
			},
			{
				title: "Rename",
				action: function(elm, d, i) {
					RenameNodeModal(d);
				}
			},
			{
				title: 'Add a node',
				action: function(elm, d, i) {
					ShowModal(d);
				}
			},
			{
				title: 'Delete the node',
				action: function(elm, d, i) {
					DeleteNode(d);
				}
			},
			{
				title: 'Update status to Bad',
				action: function(elm, d, i) {
					UpdateNodeStatus(d, 5);
				}
			},
			{
				title: 'Update status to Marginal',
				action: function(elm, d, i) {
					UpdateNodeStatus(d, 3);
				}
			},
			{
				title: 'Update status to Good',
				action: function(elm, d, i) {
					UpdateNodeStatus(d, 0);
				}
			},
			{
				title: 'Show all parents',
				action: function(elm, d, i) {
					ShowParents(d);
				}
			},
			mngGrpItem,
			{
				title: 'Manage output rules',
				action: function(elm, d, i) {
					ShowRuleDialog(d);
				}
			},
			{
				title: 'Last week daily availability chart',
				action: function(elm, d, i) {
					WeeklyChart(d, 1);
				}
			},
			{
				title: 'Last month availability report',
				action: function(elm, d, i) {
					MonthlyReport(d, 1);
				}
			}
			,
			{
				title: 'Run propagation for this node',
				action: function(elm, d, i) {
					RunPropagation(d.sid);
				}
			}
		];*/
		
		/*var menu = [
			{
				title: 'Show Parents',
				action: function(elm, d, i) {
					ShowParents(d);
				}
			},
			mngGrpItem,
			{
				title: 'Manage Output Rules',
				action: function(elm, d, i) {
					ShowRuleDialog(d);
				}
			},
			{
				title: 'Last 7 Days Availability Chart',
				action: function(elm, d, i) {
					WeeklyChart(d, "LAST_7_DAYS");
				}
			},
			{
				title: 'Last Month Availability Report',
				action: function(elm, d, i) {
					MonthlyReport(d, 1);
				}
			}
		];*/
		
		var menu = [
			{
				title: 'Show Details',
				action: function(elm, d, i) {
					ShowParents(d);
				}
			},
			{
				title: 'Last 7 Days Availability Chart',
				action: function(elm, d, i) {
					WeeklyChart(d, "LAST_7_DAYS");
				}
			},
			{
				title: 'Last Month Availability Report',
				action: function(elm, d, i) {
					MonthlyReport(d, 1);
				}
			}
		];
		
		var mainServiceMenu = [
			{
				title: 'Show Details',
				action: function(elm, d, i) {
					ShowParents(d);
				}
			},
			{
				title: 'Last 7 Days Availability Chart',
				action: function(elm, d, i) {
					WeeklyChart(d, "LAST_7_DAYS");
				}
			},
			{
				title: 'Last Month Availability Report',
				action: function(elm, d, i) {
					MonthlyReport(d, 1);
				}
			},
			{
				title: 'Assigned Maintenance Windows',
				action: function(elm, d, i) {
					window.open('/maintenance.jsp?filterSid=' + d.sid, '_top');
				}
			}
		];
		
		function ShowRuleDialog(d){
			CloseManageGroups();
			clearRSB();
			InitRuleEditor(d);
			openWRSB();
		}
		
		function LastWeekChart(d, queryType){
			WeeklyChart(d, queryType);
		}
		
		function MonthlyReport(d, lastMonthCount){
			window.open('/ReportViewer.jsp?p=getCalculatedOutageReportOfSingleService&queryType=LAST_MONTH&sid=' + d.sid, '_top');
			//window.location='/ReportViewer.jsp?p=getMonthlyReport&sid=' + d.sid;
		}
		outer_MonthlyReport = MonthlyReport;
		
		var groupingD = null;
		function ManageGroups(d, menuItem) {
			if(!groupSelectEnabled){
				if(typeof d.children !== 'undefined') {
					if(d.children.length > 1){
						
						$("#loader").attr('class', 'loader');
						$.ajax({
							cache: false,
							url:'/NodeGroups?p=getNodeGroupsOfCurrentFunctionalGroup&parentSid=' + d.sid,
							success:function(data) {
								$("#loader").attr('class', 'loader collapse');

								groupingD = d;
								menuItem.title = 'Close Group Management';
								groupSelectEnabled = true;
								
								// show manage group dialog
								clearRSB();
								showManageGroupsDivRSB(d, data);
								openRSB();
								
								DebugLog(groupSelectEnabled);
							}
						});
					}
				}
			} else {
				CloseManageGroups();
			}
		}
		
		function CloseManageGroups()
		{
			clearRSB();
			closeRSB();
			//groupingD = null;
			mngGrpItem.title = 'Manage Groups';
			groupSelectEnabled = false;
			
			deactiveGroupNodes = activeGroupNodes;
    		deactiveGroupNodesName = activeGroupNodesName;
    		activeGroupNodes = [];
    		activeGroupNodesName = [];
    		
		    if(deactiveGroupNodes.length > 0){
		    	for(i=0; i < deactiveGroupNodes.length; i++) {
		    		removeFromGroup(deactiveGroupNodesName[i],deactiveGroupNodes[i]);
		    	}
        	}
		    
			update(root);
		}
		outer_mngGrpClose = CloseManageGroups;
		
		function ShowParents(d){
			CloseManageGroups();
			$("#loader").attr('class', 'loader');
			$.ajax({
				cache: false,
				url:'/TreeOps?p=parentlist&sid=' + d.sid,
				success:function(data) {
					$("#loader").attr('class', 'loader collapse');
					clearRSB();
					showAllParentDivRSB(d,data);
					openWRSB();
					DebugLog('Retreived parent list: ' + data);
				}
			});
		}
		outer_ShowParents = ShowParents;
        
		function DeleteNode(d){
			delName = d.name;
			  if (d.parent && d.parent.children){ // cannot delete a root
				var nodeToDelete = _.where(d.parent.children, {name: delName});
				if (nodeToDelete) {
					if (confirm('Deleting this node will delete all its relations and related data! Confirm to delete?')) {
						$("#loader").attr('class', 'loader');
						$.ajax({
							cache: false,
							url:'/TreeOps?p=deletenode&sid=' + d.sid,
							success:function(data) {
								d.parent.children = _.without(d.parent.children, nodeToDelete[0]);
								DebugLog('Deleted node: "' + delName + '"');
								
								$("#loader").attr('class', 'loader collapse');
								update(root);
							}
						});
					}
				  /*if (nodeToDelete[0].children!=null || nodeToDelete[0]._children!=null) {
					if (confirm('Deleting this node will delete all its children too! Proceed?')) {
					  d.parent.children = _.without(d.parent.children, nodeToDelete[0]);
					  DebugLog('Deleted parent node "' + delName + '"');
					  update(root);
					}
					else {
						//DebugLog('Cancelled deleting the node "' + delName + '"');
					}
				  }
				  else {
					d.parent.children = _.without(d.parent.children, nodeToDelete[0]);
					DebugLog('Deleted end node "' + delName + '"');
				  }*/
				}
			  }
			// bar1data = [[0,0],[0,0],[0,0]];
		}
		
		function UpdateNodeStatus(d, status){
			$("#loader").attr('class', 'loader');
			//console.log("D.SID:" + d.sid);
			$.ajax({
				cache: false,
				url:'/TreeOps?p=setstatus&sid=' + d.sid + '&status=' + status,
				success:function(data) {
					d.status = status;
					$("#loader").attr('class', 'loader collapse');
					update(d);
				}
		  });
		}
		
		function RenameNode(d){
			/* old:
			 * var result = prompt('Change the name of the node', d.name);
			if (result) {
			  temp = d.name;
			  d.name = result;
			  update(root);
			  centerNode(d);
			  DebugLog('Renamed node name "' + temp + '" to "' + result + '"');
			}*/
			
			$("#loader").attr('class', 'loader');
			  var temp = d.name;
			  d.name = $("#rightsidebar #rename_node_name").val();
			  DebugLog('Renamed node name "' + temp + '" to "' + d.name + '"');
			  
			  $.ajax({
					cache: false,
					url:'/TreeOps?p=renamenode&sid=' + d.sid + '&nodeName=' + d.name,
					success:function(data) {
				$("#loader").attr('class', 'loader collapse');
						update(d);
						sortTree();
					}
			  });
			  
			  update(d);
			  //centerNode(d);
		}
		renameNodeFunc = RenameNode;
		
		function CreateNewNode(_d) {
			$("#loader").attr('class', 'loader');
			newNodeName = newNodeBase + parseInt(Math.round(10000*Math.random()));
			var enteredName = $("#rightsidebar #new_node_name").val();
			var citype = $("#rightsidebar #citype").val();
			if($.trim(enteredName) != '')
				newNodeName = enteredName;
			
			var newNode = {"name": newNodeName,
			"citype": citype,
			"nodeNo": nodeNoMax,
			"value": newNodeValue,
			"status": newNodeStatus,
			"type": newNodeType,
			"mainRoot": root.name,
			"nodeBefore": _d.name,
			"linkWidth": 15,
			"children": [],
			"sid":"-1"
			// "parent":d
			};

			/*
				  if (!d.children && !d._children)
					{
			//            d3.json("http://xxxx:2222/getChildNodes", function(error,response) {
			//          d.children.forEach(function(child){
						if (!tree.nodes(d)[0]._children){
						  tree.nodes(d)[0]._children = [];
						}
						d.children[0].x = d.x0;
						d.children[0].y = d.y0;
						tree.nodes(d)[0]._children.push(newNode);
			//          });
					  if (d.children) {
						d._children = d.children;
						d.children = null;
					  }
					  else {
						d.children = d._children;
						d._children = null;
					  }
					  update(d);
			//            });
					}
				  if (d.children) {
					d._children = d.children;
					d.children = null;
				  }
				  else {
					d.children = d._children;
					d._children = null;
				  }
			*/ 


			//Last working?
			var currentNode = tree.nodes(_d);
			//      var currentNode = _.where(d.parent.children, {name: d.name});
				  //var myJSONObject = {"name": "new Node","children": []}; 
			//console.log("first current Node:" + currentNode);
			DebugLog("currentNode=");
			DebugLog(currentNode);

			//  if (currentNode.children) curentNode.children.push(newNode); else currentNode.children = [newNode];
			//  nodes.push(newNode);
			//*
				  if (currentNode[0]._children!=null) {
			//window.alert("currentNode[0]._children!=null");
					currentNode[0]._children.push(newNode);
					DebugLog("_children != null");
					DebugLog(currentNode[0]._children);
					_d.children = _d._children;
					_d._children = null;
					//AddNewNode(currentNode[0].name, newNode.name);
				  }
				  else if (currentNode[0].children!=null) {
			//window.alert("currentNode[0]._children!=null && currentNode[0]._children!=null");
				   currentNode[0].children.push(newNode);
				   DebugLog("(_)children != null");
				   DebugLog(currentNode[0].children);
				   DebugLog("Current Node children: "+currentNode[0].children);
					//AddNewNode(currentNode[0].name, newNode.name);
				  }
				  else {
			//window.alert("else");
					currentNode[0].children=[]; // erases previous children!
					currentNode[0].children.push(newNode);
					currentNode[0].children.x = _d.x0;
					currentNode[0].children.y = _d.y0;
					DebugLog("children == null");
					DebugLog(currentNode[0].children);

					//AddRelation(currentNode[0].name, newNode.name);
				  };
				  
				  var yb;
				  var jsonData1;
				  $.ajax({
						cache: false,
						url:'/TreeOps?p=newnode&parentid=' + _d.sid + '&nodeName=' + newNodeName + '&citype=' + citype,
						success:function(data) {
							$("#loader").attr('class', 'loader collapse');
							update(root);
							expand(currentNode);
							sortTree();
							
							
							  $("#loader").attr('class', 'loader');
							  $.ajax({
									cache: false,
									url:'/TreeOps?p=getNodeSid&nodeName=' + newNodeName,
									success:function(data) {
										$("#loader").attr('class', 'loader collapse');
										if(JSON.parse(data) != null && JSON.parse(data) != '') {
											newNode.sid = JSON.parse(data).sid;
										}
									}
							  });
						}
				  });
				  /*console.log("YBData: "+jsonData1);
				  console.log("YB: "+yb);
				  console.log(currentNode[0].children);
				  console.log("Current node added children: " + currentNode[0].children[0].name);
				  currentNode[0].children.forEach(function(current_value) {
			            console.log(current_value);
			            if(current_value.name == newNodeName){
			            	console.log("SID:"+current_value.sid);
			            }			            	
			      });*/

			/*/
			//DebugLog("Current node added children: " + currentNode[0].children[0].name);

			/*
			// other way tested, not working
				  // repeating the code from moving the dragged node to other parent node ?
					var selectedNode = tree.nodes(d);
					if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
					  if (typeof selectedNode.children !== 'undefined') {
						selectedNode.children.push(newNode);
					  } else {
						selectedNode._children.push(newNode);
					  }
					} else {
					  selectedNode.children = [];
					  selectedNode.children.push(newNode);
					}

					// Make sure that the node being added to is expanded so user can see added node is correctly moved
			//        tree.links(selectedNode).push(selectedNode[selectedNode.length-1]);

			//      bar1data = [[0,0],[0,0],[0,0]];
			//      tree.links(currentNode).push(currentNode[currentNode.length-1]);
				  update(root);
				  expand(currentNode);
				  sortTree();
			*/
				  
				  DebugLog('Inserted a new node to "' + _d.name + '" with a node name "' + newNode.name + '" with a node sid "' + newNode.sid + '"');
		}

		createNodeFunc = CreateNewNode;

		// Toggle children function
		function toggleChildren(d) {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else if (d._children) {
				d.children = d._children;
				d._children = null;
			}
			return d;
		}

		
		function GetChildren(_d){

			if (d3.event.defaultPrevented) return; // click suppressed
			
			if((_d._children === undefined || _d._children === null || _d._children.length === 0) && (_d.children === undefined || _d.children === null || _d.children.length === 0)) {
				$("#loader").attr('class', 'loader');
				
				$.ajax({
			        cache: false,
			        url:'/ServiceStatOps?p=getNodeChildren&sid=' + _d.sid,  
			        success:function(data) {
			        	$("#loader").attr('class', '');
			        	//d.children = JSON.parse(data);

			        	var currentNode = tree.nodes(_d);

			        	//currentNode[0]._children = null;
			        	//currentNode[0].children = JSON.parse(data);
			        	
			        	_d._children = null;
			        	_d.children = JSON.parse(data);
			        	//console.log(data);
			        	$.each( JSON.parse(data), function( key, value ) {
			        		//console.log('value.sid: ' + value.sid);
			        		if(treeUniqueSidList.indexOf(parseInt(value.sid)) < 0)
			        			treeUniqueSidList.push(parseInt(value.sid));
			        		//console.log("treeUniqueSidList: " + treeUniqueSidList);
			        	});
			        	
			        	//outerUpdateStats();
			        	buildAlarmTable(mainServiceID);
			        	update(_d);
			        	//_d = toggleChildren(_d);
			        	
			        	/*_d.children = _d._children;
		        		_d._children = null;*/
			        	
			        	/*else if (currentNode[0].children!=null) {
			        		//window.alert("currentNode[0]._children!=null && currentNode[0]._children!=null");
			        		currentNode[0].children.push(newNode);
			        		DebugLog("(_)children != null");
			        		DebugLog(currentNode[0].children);
			        		DebugLog("Current Node children: "+currentNode[0].children);
			        		//AddNewNode(currentNode[0].name, newNode.name);
			        	}*/
			        	
			        	//d._children = JSON.parse(data);
	
			        	//d = toggleChildren(_d);
			        }
				});
			} else {
				_d = toggleChildren(_d);
			}
		}
		
		// Toggle children on click.
		var selectedNodes = {};
		function click(d) {
			svgW = document.getElementById("svgg").getBBox().width;
			if(groupSelectEnabled){
				if(typeof groupingD.children !== 'undefined') {
					DebugLog(groupingD);
					if(groupingD.children.length > 1 && d.parent === groupingD){
						if(!d.selected)
						{
							if(Object.keys(selectedNodes).length > 0)
							{
								if(selectedNodes[Object.keys(selectedNodes)[0]].parent == d.parent)
								{
									selectedNodes[d.sid] = d;
									d.selected = true;
									activeGroupNodes.push(parseInt(d.sid));
									activeGroupNodesName.push(d.name);
									addNode2Group(d.name, d.sid);
									
									DebugLog(d.selected);
								}
							}
							else {
								selectedNodes[d.sid] = d;
								d.selected = true;
								activeGroupNodes.push(parseInt(d.sid));
								activeGroupNodesName.push(d.name);
								addNode2Group(d.name, d.sid);
								
								DebugLog(d.selected);
							}

						}
						else
						{
							delete selectedNodes[d.sid];
							d.selected = false;
							activeGroupNodes.splice($.inArray(parseInt(d.sid), activeGroupNodes), 1);
							activeGroupNodesName.splice($.inArray(parseInt(d.name), activeGroupNodesName), 1);
							removeFromGroup(d.name,d.sid);
							
							DebugLog(d.selected);
						}
					}
				}
								
			} else {
				selectedNodes = {};
				//update(root);
				
				if(d.hasChild === "true"){
					GetChildren(d);
				}
				//d = toggleChildren(d);
			}

			//d3.select(this).attr('class', 'ghostCircle show');
			//if (d3.event.defaultPrevented) return; // click suppressed

			//d = toggleChildren(d);
			update(d);

			//centerNode(d);
			viewerWidth = $('#divtree').width();
			svgWidth = viewerWidth;
			viewerHeight = $('#divtree').height();
			svgHeight = viewerHeight;
			
			//centerNode(root);
		}
		
		function lapsedZoomFit(ticks, transitionDuration) {
			//for (var i = ticks || 200; i > 0; --i) force.tick();
			zoomFit(false, undefined, transitionDuration);
		}
		
		d3.select(window).on('resize', resize);
		function resize() {
			//var width = window.innerWidth, height = window.innerHeight;
			viewerWidth = $('#divtree').width();
			svgWidth = viewerWidth;
			viewerHeight = $('#divtree').height();
			svgHeight = viewerHeight;

			lapsedZoomFit(5, 0);
		}
		
		function collapseAll(d){
		    if (d.children){
		        d.children.forEach(collapseAll);
		        if(d != root){
			        d._children = d.children;
			        d.children = null;		        	
		        }
		    }
		    else if (d._children){
		        d._children.forEach(collapseAll);
		    }
		}

		function update(source) {
			// Compute the new tree layout.
			var nodes = tree.nodes(root).reverse(),
			  links = tree.links(nodes);
			// Normalize for fixed-depth.
			nodes.forEach(function (d) {
				d.y = d.depth * 100;
			}
			);
			
			// Declare the nodes…
			var node = svgGroup.selectAll("g.node")
			  .data(nodes, function (d) { return d.id || (d.id = ++i); });
			// Enter the nodes.
			var nodeEnter = node.enter().append("g")
			  //.call(dragListener)
			  .attr("class", "node")
			  .attr("transform", function (d) {
				  return "translate(" + source.x0 + "," + source.y0 + ")";
			  })
			  .on("mousedown", function() { d3.event.stopPropagation(); })
			  .on("click", click);

			nodeEnter.append("circle")
			.attr("r", radius)
			  .attr("stroke", function (d)
			  { return d.children || d._children ?
			  "steelblue" : "#00c13f"; })
			  .style("fill", function (d)
			  { return d.children || d._children ?
			  "lightsteelblue" : "#fff"; })
			  .on('contextmenu', d3.contextMenu2(null, function(d){}));

			//.attr("r", 10)
			//.style("fill", "#fff");

			// phantom node to give us mouseover in a radius around it
			nodeEnter.append("circle")
				.attr('class', 'ghostCircle')
				.attr("r", radius + 10)
				.attr("y", function(d){
					if(d.y > bottomMost) bottomMost = d.y;
				})
				.attr("x", function(d){
					if(d.x > rightMost) rightMost = d.x;
					//alert(rightMost + ' ' + viewerWidth);
				})
				.attr("opacity", 0.2) // change this to zero to hide the target area
				//.style("fill", "red")
				.attr('pointer-events', 'mouseover')
				.on("mouseover", function(node) {
					overCircle(node);
					tip.show;
				})
				.on("mouseout", function(node) {
					outCircle(node);
					tip.hide;
				});
			
			nodeEnter.append("image")
			.attr("xlink:href", function(d) {
				var imgDir = 'resource/img/tree/';
				//DebugLog(d.citype);
				switch(d.citype){
				case 'CI.BUSINESSMAINSERVICE':
					return imgDir + d.citype + '.png';
					break;
				case 'CI.BUSINESSSERVICE':
					return imgDir + d.citype + '.png';
					break;
				case 'CI.BUSINESSSUBSERVICE':
					return imgDir + d.citype + '.png';
					break;
				case 'CI.BUSINESSSYSTEM':
					return imgDir + d.citype + '.png';
					break;
				case 'CI.TRANSACTION':
					return imgDir + d.citype + '.png';
					break;
				case 'CI.DATABASE':
					return imgDir + d.citype + '.png';
					break;
				case 'CI.FUNCTIONALGROUP':
					return imgDir + d.citype + '.png';
					break;
				case 'CI.APPSERVERCLUSTER':
					return imgDir + d.citype + '.png';
					break;
				case 'CI.LOADBALANCER':
					return imgDir + d.citype + '.png';
					break;
				case 'CI.COMPUTERSYSTEM':
					return imgDir + d.citype + '.png';
					break;
				case 'CI.DATABASE':
					return imgDir + d.citype + '.png';
					break;
				case 'CI.OS':
					return imgDir + d.citype + '.png';
					break;
				case 'CI.APPSERVER':
					return imgDir + d.citype + '.png';
				default:
					return imgDir + 'cloud.png';
					break;
				}
			})
			.attr("x", "-20px")
			.attr("y", "-20px")
			.attr("width", "40px")
			.attr("height", "40px")
			.on("mouseover", tip.show)
			.on("mouseout", tip.hide)
			.on('contextmenu', d3.contextMenu2(null, function(d){}));

			nodeEnter.append("text")
			.attr("y", function (d) {
				return -50;
				  /*if(d == root)
					return 18;
				  else
					return -18*/
				  //return d.children || d._children ? -18 : 18;
			})
			.attr("dy", ".35em")
			.attr("text-anchor", "middle")
			.text(function (d) {
					if(d != root)
						return truncateString(d.name, 10);
					else
						return d.name; DebugLog('update: ' + d.name);
				})
			.style("fill-opacity", 1e-6);
				
			d3.selectAll("g").select("circle")
			  .style("stroke", function (d){ 
				  if(d.consistent == 0)
					  return "#000000";
				  //else
					  //return "#000";   
			  })
			  .style("stroke-dasharray", function (d){
				  //console.log(d);
				  if (d.children) {
					  //console.log(d.children.length);
				  } else if (d._children) {
						//console.log(d._children.length);
				  }

				  if(d.hasChild === "true")
				  {
				  	return ("10,3");
				  }
				  
				  if(d._children){
					  if(d._children.length > 0){
						  return ("10,3"); 
					  }
				  }
			  });

			var offset = 0;
			var strTemp;
			function truncateString(str, length)
			{
				strTemp = str;
				offset = str.length + 10;
				if(str.length > length)
					return str.substring(0, length) + '...';
	
				return str;
			}
			
			function handleMouseOver(d, i){ 
				d3.select(this).text(function (d) { return d.name; })
								.attr("y", function (d) {
									return -50;
								});
				/*tree = d3.layout.tree()
				.size([viewerHeight, viewerWidth])
				.nodeSize([radius + 50 + offset, radius]);
				update(root);*/
				//d3.select(this).text(function (d) { return d.name; });

			}
			function handleMouseOut(d, i){
				/*d3.select(this).text(function (d) { return truncateString(d.name, 10); })
								.style("fill", "black");
				tree = d3.layout.tree()
				.size([viewerHeight, viewerWidth])
				.nodeSize([radius + 50, radius]);
				update(root);*/
			}
			 
			var contains = function(needle) {
			    // Per spec, the way to identify NaN is that it is not equal to itself
			    var findNaN = needle !== needle;
			    var indexOf;

			    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
			        indexOf = Array.prototype.indexOf;
			    } else {
			        indexOf = function(needle) {
			            var i = -1, index = -1;

			            for(i = 0; i < this.length; i++) {
			                var item = this[i];

			                if((findNaN && item !== item) || item === needle) {
			                    index = i;
			                    break;
			                }
			            }

			            return index;
			        };
			    }

			    return indexOf.call(this, needle) > -1;
			};

			
			// Transition nodes to their new position.
			//horizontal tree
			var nodeUpdate = node.transition()
			  .duration(duration)
			  .attr("transform", function (d)
			  { return "translate(" + d.x +
			  "," + d.y + ")"; });
			nodeUpdate.select("circle")
			  .attr("r", radius)
			  .style("fill", function (d) {
					//alert(d.status);
				  	if(!groupSelectEnabled)
				  	{
				  		d.selected = false;
				  	}

				  	if(activeGroupNodes.length > 0)
			  		{
				  		DebugLog(groupingD.sid);
					  	if($.inArray(parseInt(d.sid), activeGroupNodes) !== -1)
				  		{
					  		if(d.parent.sid !== undefined)
					  			if(d.parent.sid == groupingD.sid)
					  				d.selected = true;
				  		}
			  		}
			  		if(deactiveGroupNodes.length > 0){
			  			DebugLog("Deactive Group Node Length:"+deactiveGroupNodes.length);
			  			DebugLog("groupingD " + groupingD);
			  			DebugLog("****" + d.sid +"----"+groupingD.sid+ "---" + $.inArray(parseInt(d.sid), deactiveGroupNodes));
			  			if($.inArray(parseInt(d.sid), deactiveGroupNodes) !== -1 && d.parent.sid == groupingD.sid)
				  		{
					  		d.selected = false;
					  		DebugLog("Deactive Node SID:"+d.sid);
				  		}
			  		}
				  	
			  		// new treestat update method
			  		//if($.inArray(parseInt(d.sid), treeUniqueSidList) < 0)
			  		//	treeUniqueSidList.push(parseInt(d.sid));
			  		
			  		//console.log("d.name: " + d.name + " d.status: " + d.status);
				  	if(d.selected)
				  	{
				  		return "#FAFAFA";
				  	}
				  	else if(output[d.sid] != undefined)
				  	{
				  		//console.log("d.name: " + d.name + " output[d.sid]: " + output[d.sid]);
					  	if(output[d.sid] == 3)
							return "#FE9A2E";
						else if (output[d.sid] == 5)
							return "#cb2529";
						else
							return "#1f9a0e";
				  	}
				  	else
				  	{
					  	if(d.status == 3)
							return "#FE9A2E";
						else if (d.status == 5)
							return "#cb2529";
						else
							return "#1f9a0e";
						}
				  	}

			  );
					
			nodeUpdate.select("text")
			  .style("fill-opacity", 1)
			  .text(function (d) {
					if(d != root)
						return truncateString(d.name, 10);
					else
						return d.name; DebugLog('update: ' + d.name);
				});

			// Transition exiting nodes to the parent's new position.
			var nodeExit = node.exit().transition()
			  .duration(duration)
			  .attr("transform", function (d)
			  { return "translate(" + source.x +
			  "," + source.y + ")"; })
			  .remove();
			nodeExit.select("circle")
			  .attr("r", 1e-6);
			nodeExit.select("text")
			  .style("fill-opacity", 1e-6);
			// Update the links…
			// Declare the links…
			var link = svgGroup.selectAll("path.link")
			  .data(links, function (d) { return d.target.id; });
			// Enter the links.
			link.enter().insert("path", "g")
			  .attr("class", "link")
			  .attr("d", function (d) {
				  var o = { x: source.x0, y: source.y0 };
				  return diagonal({ source: o, target: o });
			  });
			// Transition links to their new position.
			link.transition()
			  .duration(duration)
			.attr("d", diagonal);

			// Transition exiting nodes to the parent's new position.
			link.exit().transition()
			  .duration(duration)
			  .attr("d", function (d) {
				  var o = { x: source.x, y: source.y };
				  return diagonal({ source: o, target: o });
			  })
			  .remove();

			// Stash the old positions for transition.
			nodes.forEach(function (d) {
			  d.x0 = d.x;
			  d.y0 = d.y;
			});
			
			// size of the diagram
			viewerWidth = $('#divtree').width();
			svgWidth = viewerWidth;
			viewerHeight = $('#divtree').height();
			svgHeight = viewerHeight;
		}
		
		outer_update = update;

		var output = {};
		function updateStats() {
			//console.log('outerupdatestats called!');
			//console.log('/ServiceStatOps?p=getServiceTreeStat&sidList=' + treeUniqueSidList);
			output = {};
			$.ajax({
				cache: false,
				//url:'/ServiceStatOps?p=getServiceTreeStat&sid=' + mainServiceID,
				url:'/ServiceStatOps?p=getServiceTreeStat&sidList=' + treeUniqueSidList,
				success:function(data) {
					//console.log("ServiceTreeNodesStatus: " + data);
					treeStat = JSON.parse(data);
					if(treeStat.state === undefined){
						for(var i=0; i<treeStat.length; i++) 
						{
							for(var key in treeStat[i])
							{
								//console.log("** sid: " + key);
								output[key] = treeStat[i][key];
							}
						}
						
						d3.selectAll("g").select("circle")
						  .style("fill", function (d) {
							//DebugLog('d.sid: ' + d.sid + ' output[d.sid]: ' + output[d.sid]);
							
							if(d.selected)
							{
								d.status = output[d.sid];
						  		return "#FAFAFA";
							}
						  	else if(output[d.sid] === 5)
							{
								d.status = 5;
								docolor(d.name, "#cb2529");
							}
							else if(output[d.sid] === 3)
							{
								d.status = 3;
								docolor(d.name, "#FE9A2E");
							}
							else
							{
								d.status = 0;
								docolor(d.name, "#1f9a0e");
							}
							
							if(d.selected)
						  		return "#FAFAFA";
						  	else if(d.status == 5)
								return "#cb2529";
							else if (d.status == 3)
								return "#FE9A2E";
							else
								return "#1f9a0e";
						});
					} else {
						console.log("Err occurred while updating tree node stats: " + treeStat.message)
					}
				}
			});
		}
		outerUpdateStats = updateStats;
            
		function docolor(sname, data)
		{
			d3.selectAll("g").select("circle")
				.style("fill", function (d) {
					if(d.name === sname)
						return data;
					else
					{
						if(d.selected)
					  		return "#FAFAFA";
					  	else if(d.status == 5)
							return "#cb2529";
						else if (d.status == 3)
							return "#FE9A2E";
						else
							return "#1f9a0e";
					}
				});
		}

		/*var inter = setInterval(function() {
						updateStats();
					}, 30000);*/
                    
		// Append a group which holds all nodes and which the zoom Listener can act upon.
		baseSvg.attr("viewbox", "0 0 100 100");
		var svgGroup = baseSvg.append("g");
		svgGroup.attr("id", "svgg");
		svgElement = svgGroup;
		svgGroup.call(tip);

		// Define the root
		root = smRoot;
		root.x0 = 0;
		root.y0 = viewerHeight / 2;

		rootNode = root;

		collapseAll(root);
		
		// Layout the tree initially and center on the root node.
		update(root);
		//centerNode(root);
		svgW = document.getElementById("svgg").getBBox().width;

		zoomFit();

		//alert($('#divtree').height());
		//alert(parseInt(d3.select("body").select("svg").style("height"), 10));
	}
}

function zoomScale(_scale)
{
	//svgElement.attr("transform", "translate(" +  svgWidth + ", 200)scale(" + _scale + ")");
	
    x = -rootNode.x0;
    y = -rootNode.y0;
    x = x * scale + svgWidth / 2;
    //y = y * scale + viewerHeight / 2;
    y = y * scale + 80;
    d3.select('g').transition()
        .duration(750)
        .attr("transform", "translate(" + x + "," + y + ")scale(" + _scale + ")");
    
}

var gScale = 1;
function zoom2Fit()
{
	//outerCenterNode(rootNode);
    x = -rootNode.x0;
    y = -rootNode.y0;

    xScale = (svgWidth / 2 + rightMost / 2) / parseInt(d3.select("body").select("svg").style("width"), 10);
	yScale = (svgHeight / 2 + bottomMost / 2) / parseInt(d3.select("body").select("svg").style("height"), 10);
	
	if(xScale == 0) xScale = 1;
	if(yScale == 0) yScale = 1;
	
	/*DebugLog('viewerHeight:' + svgHeight + ' bottomMost:' + bottomMost + ' svgHeight:' + d3.select("body").select("svg").style("height"));
	DebugLog('ddviewerWidth:' + svgWidth + ' rightMost:' + rightMost + ' svgWidth:' + d3.select("body").select("svg").style("width"));
	DebugLog(xScale + '  ' + yScale);*/
	
	if(xScale < yScale){
	    x = x * xScale + svgWidth / 2;
    	y = y * xScale + 80;
	    d3.select('g').transition()
        .duration(750)
        .attr("transform", "translate(" + x + "," + y + ")scale(" + xScale + ")");
	    gScale = xScale;
	}
	else
	{
	    x = x * yScale + svgWidth / 2;
    	y = y * yScale + 80;
	    d3.select('g').transition()
        .duration(750)
        .attr("transform", "translate(" + x + "," + y + ")scale(" + yScale + ")");
	    gScale = yScale;
	}
}

var svgW = 0;
var svgH = 0;
var autoZoom = true;
var inter = setInterval(function() {
	if(autoZoom){
		if(document.getElementById("svgg") != undefined)
			if(svgW < document.getElementById("svgg").getBBox().width - 10 || svgW > document.getElementById("svgg").getBBox().width + 10 
					|| svgH < document.getElementById("svgg").getBBox().height - 10 || svgH > document.getElementById("svgg").getBBox().height + 10
					){
				svgH = document.getElementById("svgg").getBBox().height;
				svgW = document.getElementById("svgg").getBBox().width;
				zoomFit(false, null, 500);
			}
	}
}, 1000);

function zoomFit(first, paddingPercent, transitionDuration) {
	var bb = document.getElementById("svgg").getBBox();
	
	var bounds = svgElement.node().getBBox();
	var parent = svgElement.node().parentElement;
	var fullWidth = svgWidth,
    	fullHeight = svgHeight;
	if(parent != undefined){
		fullWidth = parent.clientWidth;
		fullHeight = parent.clientHeight;
	}
	
	// firefox issue fixed
	if(fullWidth == 0){
		fullWidth = svgWidth;
		fullHeight = svgHeight;
	}
	
	var width = bounds.width,
	    height = bounds.height;
	width = bb.width;
	height = bb.height;
	
	var midX = bounds.x + width / 2,
	    midY = bounds.y + height / 2;
	midX = bb.x + width / 2;
	midY = bb.y + height / 2;
	
	if (width == 0 || height == 0) return; // nothing to fit
	var scale = (paddingPercent || 0.75) / Math.max(width / fullWidth, height / fullHeight);
	var translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

	DebugLog('fullWidth: ' + fullWidth);
	DebugLog('fullHeight: ' + fullHeight);
	DebugLog('width-height: ' + width + '-' + height);
	DebugLog('midY: ' + midY);
	DebugLog('rightMost: ' + rightMost);
	DebugLog('bottomMost: ' + bottomMost);
	DebugLog("Bounds: ", bounds);
	DebugLog('svgheight: ' + document.getElementById("svgg").getBBox().height);
	//console.trace("zoomFit translate: ", translate);
	//console.trace("zoomFit scale: ", scale);
	svgElement
		.transition()
		.duration(transitionDuration || 300) // milliseconds
		.call(outerZoom.translate(translate).scale(scale).event);
}

function RemoveRelation(parent, child) {
    //alert(parent + ' ' + child);
}
function MoveRelation(newParent, child){
    //alert(newParent + ' ' + child);
}
function UpdateNodeName(nodeName) {
    //alert(nodeName);
}
function GetCIList() {
    // todo
}

function changeZoomtoFit(){
	zoomFit(false, null, 500);
}

function DebugLog(_l){
	if(debug){
		console.log(_l);
	}
}
