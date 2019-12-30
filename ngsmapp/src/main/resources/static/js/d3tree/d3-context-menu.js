d3.contextMenu = function (menu, openCallback) {

	// create the div element that will hold the context menu
	d3.selectAll('.d3-context-menu').data([1])
		.enter()
		.append('div')
		.attr('class', 'd3-context-menu');

	// close menu
	d3.select('body').on('click.d3-context-menu', function() {
		d3.select('.d3-context-menu').style('display', 'none');
	});

	// this gets executed when a contextmenu event occurs
	return function(data, index) {	
		var elm = this;
		
		d3.event.preventDefault();

		d3.selectAll('.d3-context-menu').html('');
		var list = d3.selectAll('.d3-context-menu').append('ul');
		list.selectAll('li').data(menu).enter()
			.append('li')
			.html(function(d) {
				return d.title;
			})
			.on('click', function(d, i) {
				d.action(elm, data, index);
				d3.select('.d3-context-menu').style('display', 'none');
			});

		// the openCallback allows an action to fire before the menu is displayed
		// an example usage would be closing a tooltip
		if (openCallback) openCallback(data, index);

		// display context menu
		d3.select('.d3-context-menu')
			.style('left', (d3.event.pageX - 2) + 'px')
			.style('top', (d3.event.pageY - 2) + 'px')
			.style('display', 'block');

	};
};

d3.contextMenu2 = function (dmenu, openCallback) {

	// create the div element that will hold the context menu
	d3.selectAll('.d3-context-menu').data([1])
		.enter()
		.append('div')
		.attr('class', 'd3-context-menu');

	// close menu
	d3.select('body').on('click.d3-context-menu', function() {
		d3.select('.d3-context-menu').style('display', 'none');
	});

	// this gets executed when a contextmenu event occurs
	return function(data, index) {	
		var elm = this;
		
		d3.event.preventDefault();
		
		// the openCallback allows an action to fire before the menu is displayed
		// an example usage would be closing a tooltip
		if (openCallback) openCallback(data, index);
		
		var conmenu = menu;
		if(data.citype === "CI.BUSINESSMAINSERVICE"){
			conmenu = mainServiceMenu;
		}
		
		d3.selectAll('.d3-context-menu').html('');
		var list = d3.selectAll('.d3-context-menu').append('ul');
		list.selectAll('li').data(conmenu).enter()
			.append('li')
			.html(function(d) {
				return d.title;
			})
			.on('click', function(d, i) {
				d.action(elm, data, index);
				d3.select('.d3-context-menu').style('display', 'none');
			});

		// display context menu
		d3.select('.d3-context-menu')
			.style('left', (d3.event.pageX - 2) + 'px')
			.style('top', (d3.event.pageY - 2) + 'px')
			.style('display', 'block');

	};
};

var menu = [
	{
		title: 'Show Details',
		action: function(elm, d, i) {
			outer_ShowParents(d);
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
			outer_MonthlyReport(d, 1);
		}
	},
	{
		title: 'Event Mapping',
		action: function(elm, d, i) {
			console.log(d.sid);
			window.open('/eventcatalog.jsp?p=getEventMappingOfSingleService&filterSid=' + d.sid, '_top');
		}
	}
];

var mainServiceMenu = [
	{
		title: 'Show Details',
		action: function(elm, d, i) {
			outer_ShowParents(d);
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
			outer_MonthlyReport(d, 1);
		}
	},
	{
		title: 'Event Mapping',
		action: function(elm, d, i) {
			console.log(d.sid);
			window.open('/eventcatalog.jsp?p=getEventMappingOfSingleService&filterSid=' + d.sid, '_top');
		}
	},
	{
		title: 'Assigned Maintenance Windows',
		action: function(elm, d, i) {
			window.open('/maintenance.jsp?filterSid=' + d.sid, '_top');
		}
	},
	{
		title: 'Service KPIs',
		action: function(elm, d, i) {
			window.open('/ServiceKPI.jsp?filterSid=' + d.sid, '_top');
		}
	}
];

/*var menu = [{
      title: 'Item #1',
      action: function(elm, d, i) {
        console.log('Item #1 clicked!');
        console.log('The data for this circle is: ' + d);
      }
    }, {
      title: 'Item #2',
      action: function(elm, d, i) {
        console.log('You have clicked the second item!');
        console.log('The data for this circle is: ' + d);
      }
    }]*/

    var data = [1, 2, 3];

    var g = d3.select('body').append('svg')
      .attr('width', 200)
      .attr('height', 400)
      .append('g');

    g.selectAll('circles')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', 30)
      .attr('fill', 'steelblue')
      .attr('cx', function(d) {
        return 100;
      })
      .attr('cy', function(d) {
        return d * 100;
      })
      .on('contextmenu', d3.contextMenu(menu));