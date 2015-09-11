var margin = {top: 20, right: 20, bottom:60, left: 50};
var width = 800 - margin.left - margin.right;
var height = 520 - margin.top - margin.bottom;

var colors = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#FFEB45"];

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

var x = d3.scale.ordinal().rangeRoundBands([0,width]);
var y = d3.scale.linear().range([height,0]);

var xAxis = d3.svg.axis().scale(x)
	.orient("bottom")
	.ticks(5)
	.tickFormat(function(d,i){ 
		var lbl = Math.floor(i/2+1) + "-" + (i%2+1);
		if(lbl == "10-1") return "tiebreaker";
		else return lbl;
	});
var yAxis = d3.svg.axis().scale(y).orient("left").ticks(4);

function getDate(event) {
	return new Date(event.gameCreation);
}



d3.json("../../data/elo.json", function(err,dataset) {
	var example = dataset[0].events;
	var line = d3.svg.line()
		.x(function(d, i) { return x(i) + (width/example.length)/2; })
		.y(function(d) { return y(d.elo); })
		.interpolate("monotone");
	
	var svg = d3.select('.main-chart')
		.append('svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left +"," + margin.top + ")");
				
	var defs = svg.append('defs');
	var filter = defs.append('filter')
		.attr('id', 'shadow')
		.attr('x', '-20%')
		.attr('y', '-20%')
		.attr('width', '200%')
		.attr('height', '200%')
	
	filter.append('feGaussianBlur')
		.attr('in', 'SourceAlpha')
		.attr('stdDeviation', 3);
	filter.append('feOffset')
		.attr('dx', '2')
		.attr('dy', '4');
	var merge = filter.append('feMerge')
	merge.append('feMergeNode');
	merge.append('feMergeNode')
		.attr('in', 'SourceGraphic');
	
	
	x.domain(d3.range(example.length));
	y.domain([300, d3.max(dataset, function(d) {return d3.max(d.events, function(d) {return d.elo}) + 100; })]);
	
	//grid
	svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_axis()
            .tickSize(-height, 0, 0)
            .tickFormat("")
        );
    svg.append("g")
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        );
    //axis labels
    svg.append("text")
    	.attr("class", "x label")
    	.attr("text-anchor", "end")
    	.attr("x", width)
    	.attr("y", height - 6)
    	.text("Week - Day");
    svg.append("text")
    	.attr("class", "y label")
    	.attr("text-anchor", "end")
    	.attr("y", 6)
    	.attr("dy", ".75em")
    	.attr("transform", "rotate(-90)")
    	.text("elo rating");
    //axis
    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis)
    	.selectAll("text")
    	.style("text-anchor", "end")
    	.attr('dx', '0em')
    	.attr('dy', '0.30em')
    	.attr("transform", "rotate(-40)");
    
	svg.append("g").attr("class", "y axis").call(yAxis);

	var tooltip = d3.select('.main-chart').append('div').attr('id', 'tooltip').style('opacity', 0);

	dataset.forEach(function(team, idx) {
		var data = team.events;
	
		var pattern = defs.append('pattern')
			.attr('id', team.acronym)
			.attr('height', 20)
			.attr('width', 20);

		pattern.append('rect')
				.attr('height', 20)
				.attr('width', 20)
				.attr('fill', 'skyblue');
		pattern.append('image')
				.attr('height', 20)
				.attr('width', 20)
				.attr('xlink:href', team.logoUrl);			
		var path = svg.append("path")
			.attr("class", "line")
			.attr("d", line(data))
   			.style('stroke', colors[idx])
   			.on("mouseover", function() {
   				d3.select(this).style("stroke-width", 4);
   			})
   			.on("mouseout", function() {
   				d3.select(this).style("stroke-width", 2);
   			});
   	
   		// plot points
		svg.selectAll("dot")
			.data(data)
			.enter().append("circle")
				.attr("stroke", "black")
				.attr("r", 10)
				.attr("cx", function(d, i) { return x(i) + (width/data.length)/2; })
				.attr("cy", function(d) { return y(d.elo); })
				.attr("fill", "url(#"+ team.acronym +")")
				.attr("opacity", 0.7)
				.attr("cursor", "pointer")
				.on("mouseover", function(d) {
					d3.select(this).attr("opacity", 1);
					path.style("stroke-width", 4);
					var xPos = parseFloat(d3.select(this).attr("cx"));
					var yPos = parseFloat(d3.select(this).attr("cy"));
					this.parentNode.appendChild(this);
					tooltip.transition()		
						.duration(400)		
						.style("opacity", 1);		
					tooltip.html(d.acronym + "<br/>" + (new Date(d.gameCreation).getMonth() +1) + "/" + new Date(d.gameCreation).getDate())	
						.style("left", (xPos) + "px")		
						.style("top", (yPos - 20) + "px");	
				})
				.on("mouseout", function() {
					path.style("stroke-width", 2);
					d3.select(this).attr("filter", null).attr("opacity", 0.7);
					tooltip.transition()		
						.duration(400)		
						.style("opacity", 0);	
				})
				.text(function(d) {
					return "test";
				});
				
	});
	
	
	
	
});