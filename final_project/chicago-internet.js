(function chicago_internet() {
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

  const height = 600,
    width = 500;

  const svg = d3.select("#chicago-internet")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  Promise.all([
    d3.json("data/chicago_internet.json"),
    d3.json("data/chicago.json")
  ]).then(([data, chicagoTopology]) => {
    const communities = topojson.feature(chicagoTopology, chicagoTopology.objects.chicago);
    const mesh = topojson.mesh(chicagoTopology, chicagoTopology.objects.chicago);
    const projection = d3.geoAlbers()
      .fitSize([width, height], mesh);
    const path = d3.geoPath().projection(projection);
    
    const color = d3.scaleQuantize()
      .domain([0, 40]).nice()
      .range(d3.schemeReds[9]);
    
    d3.select("#legend")
      .node()
      .appendChild(
        Legend(
          d3.scaleOrdinal(
            ["4", "8", "12", "16", "20", "24", "28", "32", "36+"],
            d3.schemeReds[9]), 
          { title: "% Households with No Internet" }
        ));
    
    /* Alternate Legend */
    // const color = d3.scaleLinear()
    //   .domain([0, 30]).nice()
    //   .range(["#fff7ec", "#7f0000"]);

    // svg.append("g")
    //   .attr("class", "legendLinear")
    //   .attr("transform", "translate(80, 540)")
    //   .attr("y", 200);

    // var legendLinear = d3.legendColor()
    //   .shapeWidth(30)
    //   .cells([5, 10, 15, 20, 25, 30, 35, 40])
    //   .title("Households with No Internet (%)")
    //   .orient('horizontal')
    //   .scale(color);
    
    // svg.select(".legendLinear")
    //   .call(legendLinear);

    svg.append("g")
      .selectAll("path")
      .data(communities.features)
      .join("path")
      .attr("stroke", '#ccc')
      .attr("fill", d => color(data[d.properties.area_numbe].no_internet))
      .attr("d", path)
      .on("mousemove", function (event, d) { 
        let info = data[d.properties.area_numbe];
        tooltip
          .style("visibility", "visible")
          .html(`${info.comm_name}<br>${info.no_internet}%`)
          .style("top", (event.pageY - 30) + "px")
          .style("left", (event.pageX + 30) + "px");
        d3.select(this).attr("fill", "#59a14f");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("fill", d => color(data[d.properties.area_numbe].no_internet));
      });
  })
})();