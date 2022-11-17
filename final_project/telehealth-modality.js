(function telehealth_modality() {
  const width = 860,
    height = 400,
    margin = {top: 40, right: 40, bottom: 20, left: 40};
    
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

    let legendGroup = svg //how to position legend on top left corner?
      .selectAll(".legend-group")
      .data(subgroups)
      .join("g")
      .attr("class", "legend-group");

    legendGroup
      .append("circle")
      .attr("cx", (d, i) => (700 + (i * 75)))
      .attr("cy", 10)
      .attr("r", 3)
      .attr("fill", (d, i) => color(i));
    
    legendGroup
      .append("text")
      .attr("x", (d, i) => (710 + (i * 75)))
      .attr("y", 15)
      .text((d, i) => subgroups[i]);

  });

})();