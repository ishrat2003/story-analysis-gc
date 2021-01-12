
function displayGcTopics(data){
  var divId = "#dailyTopic";

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  // set the ranges
  var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

  var x = d3.scaleLinear()
        .range([0, width]);

  var tooltip = d3.select(divId).append("div").attr("class", "toolTip");
      
  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select(divId).append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data in the domains
  x.domain([0, d3.max(data, function(d){ return d.count; })])
  y.domain(data.map(function(d) { return d.name; }));

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("width", function(d) {return x(d.count); } )
    .attr("y", function(d) { return y(d.name); })
    .attr("height", y.bandwidth())
    .on("mousemove", function(d){
      tooltip
        .style("left", d3.event.pageX + 50 + "px")
        .style("top", d3.event.pageY - 70 + "px")
        .style("display", "inline-block")
        .html((d.name) + "<br>" + (d.count));
    })
    .on("mouseout", function(d){ tooltip.style("display", "none");});

  // add the x Axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
    .call(d3.axisLeft(y));
}