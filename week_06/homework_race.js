/* Bar chart for Police Shootings by Race in 2015 */

d3.json("a3cleanedonly2015.json").then(rawData => {

    const rollup = d3.rollup(rawData, v => v.length, d => d.Race);
    console.log(rollup)
    const arrayRollup = Array.from(rollup, ([key, value]) => ({key, value}));
    const data = arrayRollup.slice(0, -1)

    const height = 400,
          width = 600,
          margin = ({ top: 25, right: 30, bottom: 35, left: 50 });

    let svg = d3.select("#race-chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);
    
    let x = d3.scaleBand()
        .domain(data.map(d => d.key))
        .range([margin.left, width - margin.right])
        .padding(0.1);
    
    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top]);
    
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar") 
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    // let color = ["#005f73", "#0a9396", "#94d2bd", "#c9ada7", 
    //              "#ee9b00", "#ca6702", "#bb3e03", "#ae2012"] // create color var to iterate over
    
    bar.append("rect") // add rect to bar group
        .attr("fill", (d, i) => d3.schemeCategory10[i])
        .attr("x", d => x(d.key))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.value)) 
        .attr("height", d => y(0) - y(d.value)); 
    
    bar.append('text') // add labels
        .text(d => d.value)
        .attr("x", d => x(d.key) + (x.bandwidth()/2))
        .attr("y", d => y(d.value) - 10)
        .attr("text-anchor", "middle")
        .style("fill", "black");

    // bar.append("text") 
    //     .attr("x", width/2)
    //     .attr("y", 20)
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "18px")
    //     .text("Police Shootings by Race in 2015");

});