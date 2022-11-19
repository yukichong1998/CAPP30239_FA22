(function regression_race() {
  const width = 800,
  height = 300,
  margin = { top: 30, right: 0, bottom: 20, left: 70 };

  const svg = d3.select("#reg-race")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

  d3.csv("data/chicago_internet.csv").then(data => {
    regPlot = addRegression(Plot)
    regPlot.plot({
      grid: true,
      marks: [
        Plot.dot(data, {
          x: "black",
          y: "no_internet",
          fill: "area_numbe"
        }),
        refPlot.line(
          data,
          Plot.regression({
            x: "black",
            y: "no_internet",
            strokeDasharray: [1.5, 4],
            strokeWidth: 1.5
          })
        ),
        Plot.line(
          data,
          Plot.regression({
            x: "black",
            y: "no_internet",
            // stroke: "species"
          })
        )
      ]
    })
})();

// import { Plot } from "@fil/plot-splom"
// reg = require("d3-regression@1")

function addRegression(Plot) {
  Plot.regression = function ({ x, y, type, bandwidth, order, ...options }) {
    type = String(type).toLowerCase();
    const regressor =
      type === "quad"
        ? reg.regressionQuad()
        : type === "poly"
        ? reg.regressionPoly()
        : type === "pow"
        ? reg.regressionPow()
        : type === "exp"
        ? reg.regressionExp()
        : type === "log"
        ? reg.regressionLog()
        : type === "loess"
        ? reg.regressionLoess()
        : reg.regressionLinear();
    if (bandwidth && regressor.bandwidth) regressor.bandwidth(bandwidth);
    if (order && regressor.order) regressor.order(order);

    const z = options.z || options.stroke; // maybeZ
    return Plot.transform(options, function (data, facets) {
      const X = Plot.valueof(data, x);
      const Y = Plot.valueof(data, y);
      const Z = Plot.valueof(data, z);
      regressor.x((i) => X[i]).y((i) => Y[i]);

      const regFacets = [];
      const points = [];
      for (const facet of facets) {
        const regFacet = [];
        for (const I of Z ? d3.group(facet, (i) => Z[i]).values() : [facet]) {
          const reg = regressor(I);
          for (const d of reg) {
            const j = points.push(d) - 1;
            if (z) d[z] = Z[I[0]];
            regFacet.push(j);
          }
        }
        regFacets.push(regFacet);
      }
      return { data: points, facets: regFacets };
    });
  };
  return Plot;
}})

