(function broadband_line() {
    let height = 500,
    width = 800,
    margin = ({ top: 25, right: 40, bottom: 30, left: 40 })
    innerWidth = width - margin.left - margin.right;

    const svg = d3.select("#broadband-line")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    d3.csv("data/broadband_deployment.csv").then(data => {
      let timeParse = d3.timeParse("%Y");

      let categories = new Set();

      for (let d of data) {
        d.year = timeParse(d.year);
        d.broadband = +d.broadband;
        categories.add(d.category);
      }
      console.log(data);

      let x = d3.scaleTime()
        .domain(d3.extent(data, d => d.year)).nice()
        .range([margin.left+20, width - margin.right]);

      let y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.broadband)).nice()
        .range([height - margin.bottom, margin.top]);

      timeFormat = d3.timeFormat("%Y")
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(timeFormat).ticks(d3.timeYear.every(1)));

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(d => d + "%"));

      
      svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -margin.top/2)
        .attr("dx", "-0.5em")
        .attr("y", -10)
        .attr("transform", "rotate(-90)")
        .text("% Broadband Deployment");

      let line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.broadband));

      for (const [index, cat] of [...categories].entries()) {
        let catData = data.filter(d => d.category === cat);
        console.log(catData);

        let g = svg.append("g")
            .attr("class", "cat")
            .on('mouseover', function () { 
                d3.selectAll(".highlight").classed("highlight", false);
                d3.select(this).classed("highlight", true);
            });

        if (cat === "Rural") { 
            g.classed("highlight", true);
        }

        g.append("path")
          .datum(catData)
          .attr("fill", "none")
          .attr("stroke", "#4e79a7")
          .attr("d", line)

        let lastEntry = catData[catData.length - 1];

        g.append("text")
          .text(cat)
          .attr("x", x(lastEntry.year)+5)
          .attr("y", y(lastEntry.broadband))
          .attr("dominant-baseline", "middle")
          .attr("fill", "#4e79a7");
      }  
      
    const tooltip = d3.select("body").append("div")
      .attr("class", "svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    d3.selectAll("cat")
      .on("mouseover", function(event, d) { 
        d3.select(this).attr("fill", "red");
        tooltip
          .style("visibility", "visible")
          .html(`Year: ${d.year}<br />% Population with Broadband: ${d.broadband}%`);
      })
      .on("mousemove", function(event) { // create an event that listens for mousemove
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "black");
        tooltip.style("visibility", "hidden");
      })
    });
})();
