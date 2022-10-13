/* Bar chart for COVID country cases */

d3.csv("covid.csv").then(data => {
    for (let d of data) {
        d.cases = +d.cases; //+ sign force a number
    };

    const height = 600,
          width = 800,
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 });

     let svg = d3.select("#chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    // domain is the data to be used (array), range is the space it takes up
    let x = d3.scaleBand()
        .domain(data.map(d => d.country)) // returns an array
        .range([margin.left, width - margin.right])
        .padding(0.1);
    
    // function(d) { return d.cases }
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cases)]).nice() 
        .range([height - margin.bottom, margin.top]);
    
    // g creates a group, .call automatically runs the function
    const xAxis = g => g
        .attr("transform", `translate(0, ${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x)) // builds the x axis 

    const yAxis = g => g
        .attr("transform", `translate(${margin.left - 5}, 0)`)
        .call(d3.axisLeft(y)) // builds the y axis 

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    let bar = svg.selectAll(".bar") // select all elements with "bar" tag
        .append("g") //
        .data(data) 
        .join("g") // joining the data to an element on the page
        .attr("class", "bar"); // labeling it with the "bar" tag

    bar.append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => x(d.country)) // stating the x position, where does x-axis end
        .attr("width", x.bandwidth()) // width of each band based on scaleBand from above
        .attr("y", d => y(d.cases)) // stating the y position, where does the y-axis end
        .attr("height", d => y(0) - y(d.cases));

});