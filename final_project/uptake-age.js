(function uptake_age() {
    let height = 500,
    width = 800,
    margin = ({ top: 25, right: 40, bottom: 35, left: 40 })
    innerWidth = width - margin.left - margin.right;

    const svg = d3.select("#uptake-age")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    d3.csv("data/telehealth_uptake_age.csv").then(data => {
      let timeParse = d3.timeParse("%Y-%m");

      let ages = new Set();

      for (let d of data) {
        d.Date = timeParse(d.Date);
        d.pctTelehealth = +d.pctTelehealth;
        ages.add(d.ageGroup);
      }

      let x = d3.scaleTime()
        .domain(d3.extent(data, d => d.Date))
        .range([margin.left, width - margin.right]);

      let y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.pctTelehealth)).nice()
        .range([height - margin.bottom, margin.top]);

      timeFormat = d3.timeFormat("%b-%Y")
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(timeFormat));

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(d => d + "%"));

      svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right)
        .attr("y", height)
        .attr("dx", "0.5em")
        .attr("dy", "-0.5em") 
        .text("Period (Month-Year)");
      
      svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -margin.top/2)
        .attr("dx", "-0.5em")
        .attr("y", 10)
        .attr("transform", "rotate(-90)")
        .text("% of Medicare Users with a Telehealth Service");

      let line = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.pctTelehealth));

      for (const [index, age] of [...ages].entries()) {
        let ageData = data.filter(d => d.ageGroup === age);

        let g = svg.append("g")
            .attr("class", "age")
            .on('mouseover', function () { 
                d3.selectAll(".highlight").classed("highlight", false);
                d3.select(this).classed("highlight", true);
            });

        if (age === "0-64") {  // default highlight
            g.classed("highlight", true);
        }

        g.append("path")
            .datum(ageData)
            .attr("fill", "none")
            .attr("stroke", "#4e79a7")
            .attr("d", line)

        let lastEntry = ageData[ageData.length - 1];

        g.append("text")
            .text(age)
            .attr("x", x(lastEntry.Date) + 3)
            .attr("y", y(lastEntry.pctTelehealth))
            .attr("dominant-baseline", "middle")
            .attr("fill", "#4e79a7");
      }   
    });
})();
