(function literacy_race() {
    const width = 900,
    height = 400,
    margin = { top: 30, right: 0, bottom: 30, left: 70 };
  
    const svg = d3.select("#literacy-race")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);
  
    d3.csv("data/digital_literacy_race.csv").then(data => {
  
      let x = d3.scaleLinear([0, 100], [margin.left, width - margin.right]);
  
      let y = d3.scaleBand(data.map(d => (d.race)), [margin.top, height - margin.bottom])
        .padding([0.1]);
  
      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right));

      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(d => d + "%"));
  
      svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -margin.top/2)
        .attr("dx", "-0.5em")
        .attr("y", 10)
        .attr("transform", "rotate(-90)")
        .text("Race");

      svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right)
        .attr("y", height)
        .attr("dx", "0.5em")
        .attr("dy", "2em") 
        .text("% distribution of U.S. adults across levels of proficiency");
  
      const subgroups = data.columns.slice(1);
  
      const color = d3.scaleOrdinal(subgroups, ["#2E4864", "#4A719B", "#6496CC", "#90BBE9"]);
  
      const stackedData = d3.stack()
        .keys(subgroups)(data)
    
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
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d.data.race))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth())
        
      rectGroup.append("text")
        .text(d => d[1] - d[0])
        .attr("fill","white")
        .attr("stroke","none")
        .attr("text-anchor","start")
        .attr("x", d => x(d[0]) + 5)
        .attr("y", d => y(d.data.race) + y.bandwidth()/2);
  
      let legendGroup = svg
        .selectAll(".legend-group")
        .data(subgroups)
        .join("g")
        .attr("class", "legend-group");
  
      legendGroup
        .append("circle")
        .attr("cx", (d, i) => (520 + (i * 100)))
        .attr("cy", 10)
        .attr("r", 5)
        .attr("fill", (d, i) => color(i));
      
      legendGroup
        .append("text")
        .attr("x", (d, i) => (530 + (i * 100)))
        .attr("y", 15)
        .text((d, i) => subgroups[i]);
    })
  })();

