// Histogram & Joins

const height = 400,
    width = 600,
    margin = ({ top: 25, right: 10, bottom: 50, left: 10 }),
    padding = 1;

const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.json('climate.json').then((data) => {      
    console.log(data)

    const x = d3.scaleLinear()
        .range([margin.left, width - margin.right])
        .domain([0,65]);
  
    const y = d3.scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([0,10]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));

    const binGroups = svg.append("g")
        .attr("class", "bin-group");

    function updateChart(m) {
        const bins = d3.bin()
            .thresholds(10)
            .value(d => d.average)(data[m]); // subset data by month (m)

        binGroups.selectAll("g")
            .data(bins, d => d.x0)
        .join(
            enter => {
            let g = enter.append("g")

            g.append("rect")
                .attr("x", d => x(d.x0) + padding / 2)
                .attr("y", height - margin.bottom)
                .attr("width", d => x(d.x1) - x(d.x0) - padding)
                .attr("height", 0)
                .attr("fill", "steelblue")
                .transition()
                .duration(750)
                .attr("y", d => y(d.length))
                .attr("height", d => height - margin.bottom - y(d.length));

            g.append("text")
                .text(d => d.length)
                .attr("x", d => x(d.x0) + (x(d.x1) - x(d.x0)) / 2)
                .attr("y", height - margin.bottom - 5)
                .attr("text-anchor", "middle")
                .attr("fill", "#333")
                .transition()
                .duration(750)
                .attr("y", d => y(d.length) - 5);
            },
            update => { // animation up (without update, those overlapping bars won't move)
            update.select("rect")
                .transition()
                .duration(750)
                .attr("y", d => y(d.length)) // changing the height and data range
                .attr("height", d => height - margin.bottom - y(d.length));

            update.select("text")
                .text(d => d.length)
                .transition()
                .duration(750)
                .attr("y", d => y(d.length) - 5);
            },
            exit => { // animation down
            exit.select("rect")
                .transition()
                .duration(750)
                .attr("height", 0)
                .attr("y", height - margin.bottom);

            exit.select("text")
                .text("");

            exit.transition()
                .duration(750)
                .remove();
            }
        );

        svg.selectAll("foreignObject").remove();

        let temp = d3.mean(data[m], d => d.average).toFixed(1);
        let str = `The average temperature in 
                    <b style="text-transform:capitalize;">${m} 2020</b> was 
                    <b>${temp}℉</b>.`

        svg.append("foreignObject") // best way to add annotations
          .attr("x", 10)
          .attr("y", 100)
          .attr("width", 120)
          .attr("height", 100)
          .append('xhtml:div') // required for safari browswers
          .append("p")
          .html(str);
    }

    updateChart("january");

    d3.selectAll("select") // select the dropdown
        .on("change", function (event) { // event is when you change the dropdown option
            const m = event.target.value;
            updateChart(m); 
        });
});