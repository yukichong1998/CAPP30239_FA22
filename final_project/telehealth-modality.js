(function telehealth_modality() {
  const width = 800,
    height = 500,
    margin = {top: 40, right: 20, bottom: 30, left: 50};
    
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
      .attr("y", 0)
      .attr("transform", "rotate(-90)")
      .text("% Utilization Among Telehealth Users");
    
    const subgroups = data.columns.slice(3); 

    const color = d3.scaleOrdinal(subgroups,['#f28e2c','#76b7b2']); 
  
    const stackedData = d3.stack()
      .keys(subgroups)(data);

    let g = svg.append("g")
      .selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", d => color(d.key))
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    let rectGroup = g.selectAll(".group")
      .data(d => d)
      .join("g")
      .attr("class","group")
      
    rectGroup.append("rect")
      .attr("x", d => x(d.data.race))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      
    rectGroup.append("text")
      .text(d => d[1] - d[0])
      .attr("fill","white")
      .attr("stroke","none")
      .attr("text-anchor","start")
      .attr("x", d => x(d.data.race) + x.bandwidth()/2 - 15)
      .attr("y", d => y(d[0]) - 20);

    let legendGroup = svg 
      .selectAll(".legend-group")
      .data(subgroups)
      .join("g")
      .attr("class", "legend-group");

    legendGroup
      .append("circle")
      .attr("cx", (d, i) => (640 + (i * 75)))
      .attr("cy", 10)
      .attr("r", 5)
      .attr("fill", (d, i) => color(i));
    
    legendGroup
      .append("text")
      .attr("x", (d, i) => (650 + (i * 75)))
      .attr("y", 15)
      .text((d, i) => subgroups[i]);

  });

})();