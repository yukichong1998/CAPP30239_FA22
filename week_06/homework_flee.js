/* Donut chart for Police Shootings by Flee Status in 2015 */

d3.json("a3cleanedonly2015.json").then((rawData) => {

    const rollup = d3.rollup(rawData, v => v.length, d => d.Flee);
    const data = Array.from(rollup, ([key, value]) => ({key, value}));
    // const data = arrayRollup.slice(0, -1)

    const height = 600,
      width = 800,
      innerRadius = 120,
      outerRadius = 200,
      labelRadius = 230;
  
    const arcs = d3.pie().value(d => d.value)(data);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius); // inner radius = 0 is a pie chart
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
  
    const svg = d3.select("#flee-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g") // next 3 lines are building the white separators between the arcs
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", (d, i) => d3.schemeCategory10[i]) // d3.schemeCategory are colors r
      .attr("d", arc);
  
    svg.append("g")
      .attr("font-size", 16)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`) // centroid is the center of the arc
      .selectAll("tspan")
      .data(d => {
        return [d.data.key, d.data.value];
      })
      .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i) => `${i * 1.1}em`)
      .attr("font-weight", (d, i) => i ? null : "bold")
      .text(d => d);
  
    svg.append("text") // put "2015" in the center of the chart
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text("Did they flee?")
      .style("font-size", 30);
  });