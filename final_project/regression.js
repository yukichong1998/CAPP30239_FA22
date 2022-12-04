(function regression_race() {
  let height = 400,
  width = 600,
  margin = ({ top: 25, right: 30, bottom: 35, left: 30 });
  
  const svg = d3.select("#reg-race")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

  d3.csv('data/regression.csv').then(data => {
    for (let d of data) {
      d.black = +d.black;
      d.no_internet = +d.no_internet;
    }
    console.log(data)
    
    let x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.black)).nice()
      .range([margin.left+20, width - margin.right]);

    let y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.no_internet)).nice()
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("class", "x-axis")
      .call(d3.axisBottom(x).tickFormat(d => d + "%").tickSize(-height + margin.top + margin.bottom)) 

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).tickFormat(d => d + "%").tickSize(-width + margin.left + margin.right))

    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("dx", "-0.5em")
      .attr("y", -10)
      .attr("transform", "rotate(-90)")
      .text("% Households with No Internet");

    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      .attr("dx", "0.5em")
      .text("% Black Population");

    svg.append("g")
      .attr("fill", "#4e79a7")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", d => x(d.black)) 
      .attr("cy", d => y(d.no_internet))
      .attr("r", 3.5)
      .attr("opacity", 0.8);

    linearRegression = d3.regressionLinear()
      .x(d => d.black)
      .y(d => d.no_internet)
      .domain(x.domain());
  
    svg.append("g")
      .attr("class", "linearRegression")
      .append("line")
      .datum(linearRegression(data))
      .attr("x1", d => x(d[0][0]))
      .attr("x2", d => x(d[1][0]))
      .attr("y1", d => y(d[0][1]))
      .attr("y2", d => y(d[1][1]));

    const tooltip = d3.select("body").append("div")
      .attr("class", "svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    d3.selectAll("circle")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "#76b7b2");
        tooltip
          .style("visibility", "visible")
          .html(`Neighborhood: ${d.neighborhood}<br /><hr />% Black: ${d.black.toFixed(1)}%<br />% Households with No Internet: ${d.no_internet.toFixed(1)}%`);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "#4e79a7");
        tooltip.style("visibility", "hidden");
      })
    });
})();
