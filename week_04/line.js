/* D3 Line Chart */

// Create variables before data import since not dependent on data
const height = 500,
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('long-term-interest-monthly.csv').then(data => {

    let timeParse = d3.timeParse("%Y-%m"); // can reuse this function for each data point

    for (let d of data) {
        d.Value = +d.Value; // force Value to become a number
        d.Date = timeParse(d.Date) // force Date to become a date obj
    }
    console.log(data);

    let x = d3.scaleTime() // 2 arguments: domain (data), range (space it takes up)
        .domain(d3.extent(data, d => d.Date)).nice() // domain returns an array, d3.extent returns [min, max] in a single pass over the input
        .range([margin.left, width - margin.right]) // range is an array

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Value)]).nice() // start y-axis at 0, callback function loops through the row we are at
        .range([height - margin.bottom, margin.top]) // svg is built top-down

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x)
      .tickSizeOuter(0)); // tickSizeOuter(0) removes overhang on axis
    
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      //.attr("class", "y-axis") (to specify a selector)
      .call(d3.axisLeft(y) // must specify what scale we are using
      .tickSizeOuter(0) // removes top overhang on axis
      .tickFormat(d => d + "%") // appends % sign next to axis labels
      .tickSize(-width)); // -width draws the tick across the charts

    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em") 
      .text("Year");
    
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("dx", "-0.5em")
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text("Interest rate");

    let line = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.Value));
    
    svg.append("path")
        .datum(data) // one string to build a singular line ; .data for many points/lines
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue");
  });