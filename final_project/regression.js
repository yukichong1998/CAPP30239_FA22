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
      // negative tickSize to draw all the way across to create grid

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).tickFormat(d => d + "%").tickSize(-width + margin.left + margin.right))

    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2 - 80)
      .attr("dx", "-0.5em")
      .attr("y", 0)
      .attr("transform", "rotate(-90)")
      .text("% Households with No Internet");

    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      // .attr("dx", "0.5em")
      .attr("dy", "-0.5em") 
      .text("% Black Population");

    svg.append("g")
      .attr("fill", "black")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", d => x(d.black)) // cx, cy is the positioning of circles
      .attr("cy", d => y(d.no_internet))
      .attr("r", 2) // r is radius
      .attr("opacity", 0.75);
    
    // linearRegression = d3.regressionLinear()
    //   .x(d => d.black)
    //   .y(d => d.no_internet)
    //   .domain(d3.extent(data, d => d.black));
    
    // svg.append("g")
    //   .attr("class", "linearRegression")
    //   .call(linearRegression)
    var lg = calcLinear(data, black, no_internet, d3.min(data, function(d){ return d.black}), d3.min(data, function(d){ return d.no_internet}));
    console.log(lg)

    svg.append("line")
      .attr("class", "regression")
      .attr("x1", x(lg.ptA.x))
      .attr("y1", y(lg.ptA.y))
      .attr("x2", x(lg.ptB.x))
      .attr("y2", y(lg.ptB.y))
      .attr("stroke", "#4e79a7");

    svg.append("g")
      .attr("fill", "black")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", d => x(d.black)) // cx, cy is the positioning of circles
      .attr("cy", d => y(d.no_internet))
      .attr("r", 2) // r is radius
      .attr("opacity", 0.75);

    const tooltip = d3.select("body").append("div")
      .attr("class", "svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

    d3.selectAll("circle")
      .on("mouseover", function(event, d) { // create an event that listens for mouseover
        d3.select(this).attr("fill", "red");
        tooltip
          .style("visibility", "visible")
          .html(`% Black: ${d.black.toFixed(1)}%<br />% Households with No Internet: ${d.no_internet.toFixed(1)}%`);
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



// Calculate a linear regression from the data
// Code obtained from https://bl.ocks.org/HarryStevens/be559bed98d662f69e68fc8a7e0ad097

		// Takes 5 parameters:
    // (1) Your data
    // (2) The column of data plotted on your x-axis
    // (3) The column of data plotted on your y-axis
    // (4) The minimum value of your x-axis
    // (5) The minimum value of your y-axis
// Returns an object with two points, where each point is an object with an x and y coordinate

function calcLinear(data, x, y, minX, minY){
  /////////
  //SLOPE//
  /////////

  // Let n = the number of data points
  var n = data.length;

  // Get just the points
  var pts = [];
  data.forEach(function(d,i){
    var obj = {};
    obj.x = d[x];
    obj.y = d[y];
    obj.mult = obj.x*obj.y;
    pts.push(obj);
  });

  // Let a equal n times the summation of all x-values multiplied by their corresponding y-values
  // Let b equal the sum of all x-values times the sum of all y-values
  // Let c equal n times the sum of all squared x-values
  // Let d equal the squared sum of all x-values
  var sum = 0;
  var xSum = 0;
  var ySum = 0;
  var sumSq = 0;
  pts.forEach(function(pt){
    sum = sum + pt.mult;
    xSum = xSum + pt.x;
    ySum = ySum + pt.y;
    sumSq = sumSq + (pt.x * pt.x);
  });
  var a = sum * n;
  var b = xSum * ySum;
  var c = sumSq * n;
  var d = xSum * xSum;

  // Plug the values that you calculated for a, b, c, and d into the following equation to calculate the slope
  // slope = m = (a - b) / (c - d)
  var m = (a - b) / (c - d);

  /////////////
  //INTERCEPT//
  /////////////

  // Let e equal the sum of all y-values
  var e = ySum;

  // Let f equal the slope times the sum of all x-values
  var f = m * xSum;

  // Plug the values you have calculated for e and f into the following equation for the y-intercept
  // y-intercept = b = (e - f) / n
  var b = (e - f) / n;

  // Print the equation below the chart
  document.getElementsByClassName("equation")[0].innerHTML = "y = " + m + "x + " + b;
  document.getElementsByClassName("equation")[1].innerHTML = "x = ( y - " + b + " ) / " + m;

  // return an object of two points
  // each point is an object with an x and y coordinate
  return {
    ptA : {
      x: minX,
      y: m * minX + b
    },
    ptB : {
      y: minY,
      x: (minY - b) / m
    }
  }

}