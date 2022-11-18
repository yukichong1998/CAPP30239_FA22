(function literacy_age() {
  const width = 800,
  height = 300,
  margin = { top: 30, right: 0, bottom: 20, left: 70 };

  const svg = d3.select("#literacy-age")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

  d3.csv("data/digital_literacy_age.csv").then(data => {

    let x = d3.scaleLinear([0, 100], [margin.left, width - margin.right]);

    let y = d3.scaleBand(data.map(d => (d.age)), [margin.top, height - margin.bottom])
      .padding([0.1]);

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right))

    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("dx", "-0.5em")
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text("Age Group");

    const subgroups = data.columns.slice(1);

    const color = d3.scaleOrdinal(subgroups, ["#4e79a7", "#6C9DD1", "#90BBE9", "#C8E3FF"]);

    const stackedData = d3.stack()
      .keys(subgroups)(data)

    svg.append("g")
      .selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", d => color(d.key))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d.data.age))
      .attr("width", d => x(d[1]) - x(d[0]))
      .attr("height", y.bandwidth());

    let legendGroup = svg
      .selectAll(".legend-group")
      .data(subgroups)
      .join("g")
      .attr("class", "legend-group");

    legendGroup
      .append("circle")
      .attr("cx", (d, i) => (480 + (i * 90)))
      .attr("cy", 10)
      .attr("r", 5)
      .attr("fill", (d, i) => color(i)); // legend uses the color function
    
    legendGroup
      .append("text")
      .attr("x", (d, i) => (490 + (i * 90)))
      .attr("y", 15)
      .text((d, i) => subgroups[i]);

  })
})();

