/* D3 Area Chart */

const height = 500,
    width = 700,
    margin = ({ top: 15, right: 0, bottom: 35, left: 20 });
    
const svg = d3.select("#telehealth-growth")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('data/telehealth_growth.csv').then(data => {
    let timeParse = d3.timeParse("%Y-%m");
    
    for (let d of data) {
        d.date = timeParse(d.date);
        d.total_eligible = +d.total_eligible;
        d.total_telehealth = +d.total_telehealth;
        d.pct_telehealth = +d.pct_telehealth;
    }

    let x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right]);
    
    let y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.pct_telehealth)]).nice()
      .range([height - margin.bottom, margin.top]);
    
    timeFormat = d3.timeFormat("%b-%Y")

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(timeFormat).tickValues(d3.timeMonth.range(x.domain()[0], x.domain()[1], 3)));

    
    svg.append("g")
      .attr("transform", `translate(${margin.left-5},0)`)
      .call(d3.axisLeft(y).tickFormat(d => d + "%").tickSizeOuter(0).tickSize(-width));
    
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("y", -40)
      .attr("transform", "rotate(-90)")
      .text("% of Medicare Users with a Telehealth Service");

    let area = d3.area()
      .x(d => x(d.date))
      .y0(y(0))
      .y1(d => y(d.pct_telehealth));
    
    svg.append("path")
      .datum(data)
      .attr("d", area)
      .attr("fill", "#f28e2c")
      .attr("stroke", "#f28e2c");

    let str = "National telehealth usage peaked in April 2020, with <strong>over 45%</strong> of Medicare users using at least one telehealth service."
    svg.append("foreignObject")
      .attr("x", 170)
      .attr("y", 30)
      .attr("width", 280)
      .attr("height", 100)
      .append('xhtml:div')
      .append("p")
      .style("font-size","1.1em")
      .html(str);
    
    svg.append("circle")
      .attr("cx", 107)
      .attr("cy", 45)
      .attr("r", 4)
      .attr("fill", "#4e79a7"); 
});