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
						.style('stroke', colors[idx])
						.on("mouseover", function() {
							d3.select(this).transition().duration(500).style("stroke-width", 5);
						})
						.on("mouseout", function() {
							d3.select(this).transition().duration(500).style("stroke-width", 2);
						});
					var pathLength = path.node().getTotalLength();
					
					path.attr("stroke-dasharray", pathLength + " " + pathLength)
						.attr("stroke-dashoffset", pathLength)
						.transition().delay(2000).duration(4000)
						.attr("stroke-dashoffset", 0);
					
					// add/render plot points
					var plt = svg.selectAll("dot")
						.data(team.plots)
						.enter().append("circle")
							.attr("r", 11)
							.attr("cx", function(d, i) { return x(i) + (width/maxX)/2; })
							.attr("cy", function(d) { return y(d.y); })
							.attr("fill", "url(#"+ team.id +")")
							.attr("opacity", 0)
						.on("mouseover", function(d) {
							d3.select(this).attr("opacity", 1);
							path.transition().duration(500).style("stroke-width", 5);
							var xPos = parseFloat(d3.select(this).attr("cx"));
							var yPos = parseFloat(d3.select(this).attr("cy"));
							this.parentNode.appendChild(this);
							tooltip.transition().duration(400).style("opacity", 1);		
							tooltip.html(d.label + "<br/>" + (new Date(d.x).getMonth() +1) + "/" + new Date(d.x).getDate())	
								.style("left", (xPos) + "px")		
								.style("top", (yPos - 30) + "px");
						})
						.on("mouseout", function() {
							path.transition().duration(500).style("stroke-width", 2);
							d3.select(this).attr("filter", null).attr("opacity", 0.7);
							tooltip.transition().duration(400)		
								.style("opacity", 0);
						})
						.transition().duration(2000).delay(function(d,i) {return 2000+(4000/maxX)*i})
							.attr('opacity', 0.8);
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