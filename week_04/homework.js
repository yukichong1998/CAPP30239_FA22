/* D3 Line Chart on Monthly Interest Rates in 2020 (Canada) */

const height = 500,
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.csv('long-term-interest-canada.csv').then(data => {

    let timeParse = d3.timeParse("%Y-%m");

    for (let d of data) {
        d.Num = +d.Num; // force Num to become a number
        d.Month = timeParse(d.Month) // force Month to become a date obj
    }

    console.log(data);

    // Construct scales
    let x = d3.scaleTime() 
        .domain(d3.extent(data, d => d.Month)).nice() // domain returns an array, d3.extent returns [min, max] in a single pass over the input
        .range([margin.left, width - margin.right]) // range is an array

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Num)]).nice() // start y-axis at 0, callback function loops through the row we are at
        .range([height - margin.bottom, margin.top]) 

    // Construct axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%B"))
        .tickSizeOuter(0)); // remove overhang on axis
    
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y) // specify what scale we are using
        .tickSizeOuter(0) // removes top overhang on axis
        .tickFormat(d => d + "%") // append % sign next to axis labels
        .tickSize(-width + margin.right + margin.left)); // modified to meet at end of axis

    // Construct labels
    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em") 
      .text("Month");
    
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("dx", "-0.5em")
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text("Interest rate");

    // Construct a line generator
    let line = d3.line()
        .x(d => x(d.Month))
        .y(d => y(d.Num))
        .curve(d3.curveNatural);
    
    svg.append("path")
        .datum(data) // one string to build a singular line
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue");
        
  });