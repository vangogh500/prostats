app.directive('scatterChart', function(){
	// constants
	var margin = {top: 20, right: 20, bottom:60, left: 50};
	var width = 800 - margin.left - margin.right;
	var height = 520 - margin.top - margin.bottom;
	
	var colors = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#FFEB45"];

	function getDate(d) {
		return new Date(d.gameCreation);
	}
	
	function link(scope, element, attr) {
		// adds main svg element
		var svg = d3.select(element[0])
			.append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
			.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
		
		// add selector menu
		var selector = d3.select(element[0]).append('div').attr('id','team-selector');
		selector.append('h3').text('2015 Spring Split Teams');
		var selectorContainer = selector.append('div').attr('id', 'container');
		
		// adds defs for filters
		var defs = svg.append('defs');
		
		// defines x and y
		var x = d3.scale.ordinal().rangeRoundBands([0,width]);
		var y = d3.scale.linear().range([height,0]);
		
		// define x and y axis
		var xAxis = d3.svg.axis().scale(x)
			.orient("bottom")
			.ticks(5)
			.tickFormat(function(d,i){ 
				var lbl = Math.floor(i/2+1) + "-" + (i%2+1);
				if(lbl == "10-1") return "tiebreaker";
				else return lbl;
			});
		var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);
		
		// render x and y axi
		var xRender = svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")");
		xRender.call(xAxis);
    	var yRender = svg.append("g").attr("class", "y axis");
    	yRender.call(yAxis);
		
		// function for the x grid lines
		function make_x_axis() {
			return d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.ticks(5)
		}

		// function for the y grid lines
		function make_y_axis() {
		  return d3.svg.axis()
			  .scale(y)
			  .orient("left")
			  .ticks(5)
		}
		// render grid lines
		var xGridRender = svg.append("g")
			.attr("class", "grid")
			.attr("transform", "translate(0," + height + ")");
		xGridRender.call(make_x_axis()
			.tickSize(-height, 0, 0)
			.tickFormat("")
		);
		var yGridRender = svg.append("g")
			.attr("class", "grid");
		yGridRender.call(make_y_axis()
			.tickSize(-width, 0, 0)
			.tickFormat("")
		);
		
		
		scope.$watch('ngModel', function(data) {
			if(data) {
				var maxX = d3.max(data, function(d) { return d.plots.length; });
				// set x and y domains
				x.domain(d3.range(maxX));
				y.domain([300, d3.max(data, function(d) {return d3.max(d.plots, function(d) {return d.y}) + 100; })]);
				
				// render x and y axis
				xRender.transition().duration(2000).call(xAxis).selectAll("text")
    				.style("text-anchor", "end")
    				.attr('dx', '0em')
    				.attr('dy', '0.30em')
    				.attr("transform", "rotate(-40)");
				yRender.transition().duration(2000).call(yAxis);
				
				//render grid axis
				xGridRender.transition().duration(2000).call(make_x_axis()
					.tickSize(-height, 0, 0)
					.tickFormat("")
				);
				yGridRender.transition().duration(2000).call(make_y_axis()
					.tickSize(-width, 0, 0)
					.tickFormat("")
				);
				
				// render axis labels
				svg.append("text")
					.attr("opacity", 0)
					.attr("class", "x label")
					.attr("text-anchor", "end")
					.attr("x", width)
					.attr("y", height - 6)
					.text("Week - Day")
					.transition().duration(2000).attr("opacity", 1);
				svg.append("text")
					.attr("opacity", 0)
					.attr("class", "y label")
					.attr("text-anchor", "end")
					.attr("y", 6)
					.attr("dy", ".75em")
					.attr("transform", "rotate(-90)")
					.text("elo rating")
					.style("font-weight", "none")
					.transition().duration(2000).attr("opacity", 1);
				
				// add tooltip
				var tooltip = d3.select(element[0]).append('div').attr('id', 'tooltip').style('opacity', 0);
				
				data.forEach(function(team, idx) {
					// add pattern used for circle background
					var pattern = defs.append('pattern')
						.attr('id', team.id)
						.attr('height', 22)
						.attr('width', 22);
					pattern.append('rect')
						.attr('height', 22)
						.attr('width', 22)
						.attr('fill', 'skyblue');
					pattern.append('image')
						.attr('height', 22)
						.attr('width', 22)
						.attr('xlink:href', team.img);
						
					// add patternLarge used for circle background
					var patternLarge = defs.append('pattern')
						.attr('id', team.id + '-large')
						.attr('height', 40)
						.attr('width', 40);
					patternLarge.append('rect')
						.attr('height', 40)
						.attr('width', 40)
						.attr('fill', 'skyblue');
					patternLarge.append('image')
						.attr('height', 40)
						.attr('width', 40)
						.attr('xlink:href', team.img);
					
					// functioning defining line
					var line = d3.svg.line()
						.x(function(d, i) { return x(i) + (width / maxX)/2; })
						.y(function(d) { return y(d.y); })
						.interpolate("monotone");
					
					// render line
					var path = svg.append("path")
						.attr('fill', 'none')
						.attr("class", "line")
						.attr("d", line(team.plots))
						.attr('pointer-events', 'none')
						.style('stroke', colors[idx])
						.on("mouseover", function() {
							d3.select(this).transition().duration(200).style("stroke-width", 5);
						})
						.on("mouseout", function() {
							d3.select(this).transition().duration(200).style("stroke-width", 2);
						});
					var pathLength = path.node().getTotalLength();
					
					path.attr("stroke-dasharray", pathLength + " " + pathLength)
						.attr("stroke-dashoffset", pathLength)
						.transition().delay(2000).duration(2000)
						.attr("stroke-dashoffset", 0).attr('stroke-width', 2);

					
					// add/render plot points
					var plt = svg.selectAll("dot")
						.data(team.plots)
						.enter().append("circle")
							.attr("r", 11)
							.attr("cx", function(d, i) { return x(i) + (width/maxX)/2; })
							.attr("cy", function(d) { return y(d.y); })
							.attr("fill", "url(#"+ team.id +")")
							.attr("opacity", 0)
							.attr('pointer-events', 'none')
						.on("mouseover", function(d) {
								d3.select(this).transition().duration(800).ease('elastic').attr('fill', 'url(#' + team.id + '-large)').attr('r', 20);
								path.style("stroke-width", 5);
								var xPos = parseFloat(d3.select(this).attr("cx"));
								var yPos = parseFloat(d3.select(this).attr("cy"));
								this.parentNode.appendChild(this);
								tooltip.transition().duration(200).style("opacity", 1);		
								tooltip.html(d.label + "<br/>" + (new Date(d.x).getMonth() +1) + "/" + new Date(d.x).getDate())	
									.style("left", (xPos + 10) + "px")		
									.style("top", (yPos - 17) + "px");
						})
						.on("mouseout", function() {
							path.style("stroke-width", 2);
							d3.select(this).transition().attr('fill', 'url(#' + team.id + ')').attr('r', 11);
							tooltip.transition().duration(200)		
								.style("opacity", 0);
						});
					
					plt.transition().duration(2000).delay(function(d,i) {return 2000+(1000/maxX)*i})
							.attr('opacity', 0.8);
					
					// determines if selector is active or not
					var active = true;
					
					// add category selectors
					var teamChoice = selectorContainer.append('div').attr('class', 'team').classed('select', true).attr('height', 0).style('pointer-events', 'none')
						.on("mouseover", function() {
							path.style("stroke-width", 5);
						})
						.on("mouseout", function() {
							path.style("stroke-width", 2);
						})
						.on('click', function() {
							if(active) { 
								d3.select(this).classed('select', false).classed('deselect', true);
								d3.select(this).select('.color-key').transition().duration(200).style('background', 'grey');
								this.parentNode.appendChild(this);
								path.transition().attr('opacity', 0).attr('pointer-events', 'none');
								plt.transition().attr('opacity', 0).attr('pointer-events', 'none');
								active = false;
							}
							else {
								d3.select(this).classed('select', true).classed('deselect', false);
								d3.select(this).select('.color-key').transition().style('background', colors[idx]);
								var firstChild = this.parentNode.firstChild;
								this.parentNode.insertBefore(this, firstChild);
								path.attr("opacity", 1).style('stroke-width', 2)
									.attr("stroke-dasharray", pathLength + " " + pathLength)
									.attr("stroke-dashoffset", pathLength)
									.transition().duration(1000)
									.attr("stroke-dashoffset", 0);
								plt.transition().attr('opacity', 1).attr('pointer-events', '');
								active = true;
							}
						});
					
					teamChoice.append('div').attr('class', 'color-key').style('background', colors[idx]);
					teamChoice.append('div').attr('class', 'img-container').append('img').attr('src', team.img);
					teamChoice.append('div').attr('class', 'info').append('span').text(team.id);
					
					// add in mouse events after load in
					path.transition().delay(4000).attr('pointer-events', '');
					plt.transition().delay(4200).attr('pointer-events', '');
					teamChoice.transition().delay(4200).style('pointer-events', '');
				});
			}
		}, true);
	}
	
	return {
		link: link,
		restrict: 'E',
		scope: { ngModel: '=' }
	}
});