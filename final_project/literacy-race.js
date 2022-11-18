(function literacy_race() {
  let raceLiteracy = [ // How to line break for long category labels? 
    { race: "White", values: [{category: "Below Level 1", score: 20}, {category: "Level 1", score: 3}, {category: "Level 2", score: 35}, {category: "Level 3", score: 7}]},
    { race: "Black", values: [{category: "Below Level 1", score: 44}, {category: "Level 1", score: 38}, {category: "Level 2", score: 16}, {category: "Level 3", score: 2}]},
    { race: "Hispanic", values: [{category: "Below Level 1", score: 27}, {category: "Level 1", score: 37}, {category: "Level 2", score: 31}, {category: "Level 3", score: 5}]},
    { race: "Others", values: [{category: "Below Level 1", score: 21}, {category: "Level 1", score: 36}, {category: "Level 2", score: 34}, {category: "Level 3", score: 9}]}
  ];

  for (let d of raceLiteracy) {
    createRing(d);
  };

  function createRing({ race, values }) { 
    const height = 400,
      width = 400,
      innerRadius = 60,
      outerRadius = 110,
      labelRadius = 155;
  
    const arcs = d3.pie().value(d => d.score)(values);
  
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    const color = d3.scaleOrdinal(["#4e79a7", "#6C9DD1", "#90BBE9", "#C8E3FF"]);
  
    const svg = d3.select("#literacy-race")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", (d, i) => color(i)) //(d, i) => d3.schemeTableau10[i]
      .attr("d", arc);
  
    svg.append("g")
      .attr("font-size", 14)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .selectAll("tspan")
      .data(d => {
        return [d.data.category, d.data.score+"%"];
      })
      .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i) => `${i * 1.1}em`)
      .attr("font-weight", (d, i) => i ? null : "bold")
      .text(d => d)
      .style("font-size", 14);
  
    svg.append("text")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(race)
      .style("font-size", 18);
  }

})();