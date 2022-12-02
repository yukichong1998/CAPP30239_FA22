(function telehealth_modality() {
  const width = 900,
    height = 500,
    margin = {top: 40, right: 20, bottom: 20, left: 50};
    
  const svg = d3.select("#modality")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);
  
  d3.csv("data/telehealth_modality.csv").then( data => {
    let x = d3.scaleBand(data.map(d => (d.race)),[margin.left, width - margin.right])  
      .padding([0.2]); 

    let y = d3.scaleLinear([0,100],[height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right).tickFormat(d => d + "%"));
    
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("dx", "-0.5em")
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text("% Utilization Among Telehealth Users");
    
    const subgroups = data.columns.slice(3); 

    const color = d3.scaleOrdinal(subgroups,['#4e79a7','#e15759']); 
  
    const stackedData = d3.stack()
      .keys(subgroups)(data);

    svg.append("g") 
      .selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect") 
      .attr("x", d => x(d.data.race))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width",x.bandwidth());

    // svg.append("text")
    //   .data(stackedData)
    //   .attr("x", d => x(d.race))
    //   .attr("y", d => y(d[1]))
    //   .attr("x", d => 0)
    //   .attr("y", d => 0)
    //   .text(d => d);

    let legendGroup = svg 
      .selectAll(".legend-group")
      .data(subgroups)
      .join("g")
      .attr("class", "legend-group");

    legendGroup
      .append("circle")
      .attr("cx", (d, i) => (660 + (i * 75)))
      .attr("cy", 10)
      .attr("r", 5)
      .attr("fill", (d, i) => color(i));
    
    legendGroup
      .append("text")
      .attr("x", (d, i) => (670 + (i * 75)))
      .attr("y", 15)
      .text((d, i) => subgroups[i]);

  });

})();