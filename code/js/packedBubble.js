function displayPackedBubbles(divId, boxWidth, boxHeight, cardColor, data, displayOnlyChildrenLabel){
    var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = boxWidth - margin.left - margin.right,
    height = boxHeight - margin.top - margin.bottom,
    zoomMargin = 20;

    var svg = d3.select(divId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var diameter = +svg.attr("width");
    var g = svg.append("g")
        .attr("transform", 
                "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var color = d3.scaleLinear()
        .domain([-1, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);

    var pack = d3.pack()
        .size([diameter - zoomMargin, diameter - zoomMargin])
        .padding(2);

    var root = d3.hierarchy(data)
        .sum(function(d) { return d.size; })
        .sort(function(a, b) { return b.value - a.value; });

    var focus = root,
        nodes = pack(root).descendants(),
        view;

    var circle = g.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
            .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
            .style("fill", function(d) { return d.children ? color(d.depth) : null; });

    //if(!displayOnlyChildrenLabel){
        g.selectAll("circle").on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });
    //}

    var text = g.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", "label")
        .style("fill-opacity", function(d) {
            //if(displayOnlyChildrenLabel){
                return (d.children && d.children.length) ? 0 : 1;
            //}
            //return d.parent === root ? 1 : 0; 
        })
        .style("display", function(d) { 
            //if(displayOnlyChildrenLabel){
                return (d.children && d.children.length) ? "none" : "inline";
            //}
            //return d.parent === root ? "inline" : "none"; 
        })
        .text(function(d) { return d.data.name; });

    var node = g.selectAll("circle,text");

    svg.style("background", cardColor);
    //if(!displayOnlyChildrenLabel){
        svg.on("click", function() { zoom(root); });
    //}

    zoomTo([root.x, root.y, root.r * 2 + zoomMargin]);

    function zoom(d) {
        var focus0 = focus; focus = d;
    
        var transition = d3.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", function(d) {
              var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + zoomMargin]);
              return function(t) { zoomTo(i(t)); };
            });
    
        // transition.selectAll("text")
        //   .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        //     .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        //     .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        //     .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }
    
    function zoomTo(v) {
        var k = diameter / v[2]; view = v;
        node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
        circle.attr("r", function(d) { return d.r * k; });
    }
}
