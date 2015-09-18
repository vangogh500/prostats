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
		
		var labels = svg.append('g').attr('class', 'labels');
		// add selector menu
		var selector = d3.select(element[0]).append('div').attr('id','team-selector');
		selector.append('h3').text('2015 Spring Split Teams');
		var selectorContainer = selector.append('div').attr('id', 'container');
		
		// adds defs for filters
		var defs = svg.append('defs');
		
		var lineContainer = svg.append('g').attr('class', 'line-container');
		var plotContainer = svg.append('g').attr('class', 'plot-container');
		
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
		
		var xLabel = labels.append("text")
			.attr("opacity", 0)
			.attr("class", "xLabel")
			.attr("text-anchor", "end")
			.attr("x", width)
			.attr("y", height - 6)
			.text("");
		var yLabel = labels.append("text")
			.attr("opacity", 0)
			.attr("class", "yLabel")
			.attr("text-anchor", "end")
			.attr("y", 6)
			.attr("dy", ".75em")
			.attr("transform", "rotate(-90)")
			.text("")
			.style("font-weight", "none");

		scope.$watch('ngModel', function(model) {
			var lbl = model.yLabel;
			var data = model.data;
			
			console.log("Updating scatter with: " + data);
			if(data) {
				var maxX = d3.max(data, function(d) { return d.plots.length; });
				// set x and y domains
				x.domain(d3.range(maxX));
				
				var yMax = d3.max(data, function(d) {return d3.max(d.plots, function(d) { return d.y; }); });
				var yMin = d3.min(data, function(d){return d3.min(d.plots, function(d) { return d.y; }); });
				var yDiff = yMax - yMin;
				y.domain([yMin - yDiff *0.1, yMax + yDiff*0.1]);
				
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
				
				xLabel.text("Week - Day").transition().duration(2000).attr("opacity", 1);
				yLabel.text(lbl).transition().duration(2000).transition().duration(2000).attr("opacity", 1);
				
				// add tooltip
				var tooltip = d3.select(element[0]).append('div').attr('id', 'tooltip').style('opacity', 0);
				
				// functioning defining line
				var line = d3.svg.line()
					.x(function(d, i) { return x(i) + (width / maxX)/2; })
					.y(function(d) { return y(d.y); })
					.interpolate("monotone");
				
				// render line
				lineContainer.selectAll('.team-line').data(data).exit().remove();
				var currPath = lineContainer.selectAll('.team-line').data(data)
					.attr('id', function(team) {
						return team.id; })
					.attr('fill', 'none')
					.attr("class", "team-line")
					.attr("d", function(team) {
						return line(team.plots); })
					.attr('pointer-events', 'none')
					.style('stroke', function(d, i) { return colors[i]; })
					.on("mouseover", function() {
						d3.select(this).transition().duration(200).style("stroke-width", 5);
					})
					.on("mouseout", function() {
						d3.select(this).transition().duration(200).style("stroke-width", 2);
					});
					
				var path = lineContainer.selectAll('.team-line').data(data).enter().append("path")
					.attr('id', function(team) {
						return team.id; })
					.attr('fill', 'none')
					.attr("class", "team-line")
					.attr("d", function(team) {
						return line(team.plots); })
					.attr('pointer-events', 'none')
					.style('stroke', function(d, i) { return colors[i]; })
					.on("mouseover", function() {
						d3.select(this).transition().duration(200).style("stroke-width", 5);
					})
					.on("mouseout", function() {
						d3.select(this).transition().duration(200).style("stroke-width", 2);
					});
				currPath.transition().delay(4000).attr('pointer-events', '');
				path.transition().delay(4000).attr('pointer-events', '');
				svg.selectAll('.team-line').each(function() {
					var pathLength = d3.select(this).node().getTotalLength();
					d3.select(this).attr("stroke-dasharray", pathLength + " " + pathLength)
						.attr("stroke-dashoffset", pathLength)
						.transition().delay(2000).duration(2000)
						.attr("stroke-dashoffset", 0).attr('stroke-width', 2);
				});
				
				// add category selectors
				var teamChoice = selectorContainer.selectAll('div').data(data, function(d) { return d.id; }).enter().append('div').attr('class', 'team').classed('select', true).style('pointer-events', 'none')
					.on("mouseover", function(d) {
						lineContainer.select('#' + d.id).style("stroke-width", 5);
					})
					.on("mouseout", function(d) {
						lineContainer.select('#' + d.id).style("stroke-width", 2);
					})
					.on('click', function(d, i) {
						// determines if selector is active or not
						var active = true;
						if(d3.select(this).classed('select')) { 
							d3.select(this).classed('select', false).classed('deselect', true);
							d3.select(this).select('.color-key').transition().duration(200).style('background', 'grey');
							this.parentNode.appendChild(this);
							lineContainer.select('#' + d.id).transition().attr('opacity', 0).attr('pointer-events', 'none');
							plotContainer.select('#' + d.id).transition().attr('opacity', 0).attr('pointer-events', 'none');
						}
						else {
							d3.select(this).classed('select', true).classed('deselect', false);
							d3.select(this).select('.color-key').transition().style('background', colors[i]);
							var firstChild = this.parentNode.firstChild;
							this.parentNode.insertBefore(this, firstChild);
							var thisLine = lineContainer.select('#' + d.id);
							var thisLength = thisLine.node().getTotalLength();
							
							thisLine.attr("opacity", 1).style('stroke-width', 2)
								.attr("stroke-dasharray", thisLength + " " + thisLength)
								.attr("stroke-dashoffset", thisLength)
								.transition().duration(1000)
								.attr("stroke-dashoffset", 0);
							plotContainer.selectAll('#' + d.id).transition().attr('opacity', 1).attr('pointer-events', '');
						}
					});
				
				teamChoice.append('div').attr('class', 'color-key').style('background', function(d,i) { return colors[i]; });
				teamChoice.append('div').attr('class', 'img-container').append('img').attr('src', function(team) { return team.img; });
				teamChoice.append('div').attr('class', 'info').append('span').text(function(team) { return team.id; });
				teamChoice.transition().delay(4200).style('pointer-events', '');
				
				plotContainer.selectAll('g').data(data, function(d){ return d.id }).enter().append('g').attr('id', function(d) { return d.id; });
				
				// add pattern used for circle background
				var patterns = defs.append('g').attr('class', 'patterns');
				
				var pattern = patterns.selectAll('pattern').data(data).enter().append('pattern')
						.attr('id', function(team) { return team.id; })
						.attr('height', 22)
						.attr('width', 22);
				pattern.append('rect')
					.attr('height', 22)
					.attr('width', 22)
					.attr('fill', 'skyblue');
				pattern.append('image')
					.attr('height', 22)
					.attr('width', 22)
					.attr('xlink:href', function(team) { return team.img; });
				
				// add patternLarge used for circle background
				var patternsLarge = defs.append('g').attr('class', 'patternsLarge');
				var patternLarge = patternsLarge.selectAll('pattern').data(data).enter().append('pattern')
					.attr('id', function(team) { return team.id + '-large'; })
					.attr('height', 40)
					.attr('width', 40);
				patternLarge.append('rect')
					.attr('height', 40)
					.attr('width', 40)
					.attr('fill', 'skyblue');
				patternLarge.append('image')
					.attr('height', 40)
					.attr('width', 40)
					.attr('xlink:href', function(team) { return team.img; });
			
				data.forEach(function(team, idx) {
					// add/render plot points
					plotContainer.select('#'+ team.id).selectAll("circle")
						.data(team.plots).exit().remove();
					var currPlt = plotContainer.select('#'+ team.id).selectAll("circle")
						.data(team.plots).attr('class', 'team-plots')
							.attr("r", 11)
							.attr("cx", function(d, i) { return x(i) + (width/maxX)/2; })
							.attr("cy", function(d) { return y(d.y); })
							.attr("fill", "url(#"+ team.id +")")
							.attr("opacity", 0)
							.attr('pointer-events', 'none')
						.on("mouseover", function(d) {
							d3.select(this).transition().duration(800).ease('elastic').attr('fill', 'url(#' + team.id + '-large)').attr('r', 20);
							lineContainer.select('#'+team.id+'.team-line').style("stroke-width", 5);
							var xPos = parseFloat(d3.select(this).attr("cx"));
							var yPos = parseFloat(d3.select(this).attr("cy"));
							this.parentNode.appendChild(this);
							tooltip.transition().duration(200).style("opacity", 1);		
							tooltip.html(d.label + "<br/>" + (new Date(d.x).getMonth() +1) + "/" + new Date(d.x).getDate())	
								.style("left", (xPos + 10) + "px")		
								.style("top", (yPos - 17) + "px");
						})
						.on("mouseout", function() {
							lineContainer.select('#'+team.id+'.team-line').style("stroke-width", 2);
							d3.select(this).transition().attr('fill', 'url(#' + team.id + ')').attr('r', 11);
							tooltip.transition().duration(200)		
								.style("opacity", 0);
						});
					var plt = plotContainer.select('#'+ team.id).selectAll("circle")
						.data(team.plots)
						.enter().append("circle")
							.attr('class', 'team-plots')
							.attr("r", 11)
							.attr("cx", function(d, i) { return x(i) + (width/maxX)/2; })
							.attr("cy", function(d) { return y(d.y); })
							.attr("fill", "url(#"+ team.id +")")
							.attr("opacity", 0)
							.attr('pointer-events', 'none')
						.on("mouseover", function(d) {
							d3.select(this).transition().duration(800).ease('elastic').attr('fill', 'url(#' + team.id + '-large)').attr('r', 20);
							lineContainer.select('#'+team.id+'.team-line').style("stroke-width", 5);
							var xPos = parseFloat(d3.select(this).attr("cx"));
							var yPos = parseFloat(d3.select(this).attr("cy"));
							this.parentNode.appendChild(this);
							tooltip.transition().duration(200).style("opacity", 1);		
							tooltip.html(d.label + "<br/>" + (new Date(d.x).getMonth() +1) + "/" + new Date(d.x).getDate())	
								.style("left", (xPos + 10) + "px")		
								.style("top", (yPos - 17) + "px");
						})
						.on("mouseout", function() {
							lineContainer.select('#'+team.id+'.team-line').style("stroke-width", 2);
							d3.select(this).transition().attr('fill', 'url(#' + team.id + ')').attr('r', 11);
							tooltip.transition().duration(200)		
								.style("opacity", 0);
						});
						
					currPlt.transition().duration(2000).delay(function(d,i) {return 2000+(1000/maxX)*i})
							.attr('opacity', 0.8);
					plt.transition().duration(2000).delay(function(d,i) {return 2000+(1000/maxX)*i})
							.attr('opacity', 0.8);
					// add in mouse events after load in
					currPlt.transition().delay(4200).attr('pointer-events', '');
					plt.transition().delay(4200).attr('pointer-events', '');
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