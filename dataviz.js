
// const d3 = require('d3');
// const scaleCluster = require('d3-scale-cluster');
// const select = require('d3-selection');

var colors = [
    "#d0d9c4",
    "#dfa3ad",
    "#d0915b",
    "#a9573f",
    "#844e5e"
    ]
    
    var sizeRange = [1.5,50]
    var notcarto = true
    
    const cartogram = (data, d3) => {
      const keys = Object.keys(data);
      let dataArr = [];
      keys.forEach(k => {
        dataArr.push(data[k])
      });

      let thisKeyValues = Object.values(data);
      let values = []
      thisKeyValues.forEach(v => {
        values.push(v['media_count'])
      });
    
      // var thisKeyValues = data.forEach((d, i) => d[i]);
      // console.log('keyValues', thisKeyValues);
    
      var extent = d3.extent(values);
    
      var scale = d3.scaleLinear().domain(extent).range(sizeRange)
      var colorScale = d3.scaleCluster().domain(values).range(colors)
    
      var force = d3.forceSimulation()
      .force("collision", d3.forceCollide(d => scale(d['media_count'])).iterations(2))
      .force('x', d3.forceX(d => d['media_count']))
      .force('y', d3.forceY(d => d['media_count']))
      .nodes(dataArr)
      .alphaMin(0.25)
      .on('tick', updateCartogram)
      .on('end', resetCartogram)
    
      let g = d3.select("svg")
      .selectAll("circle.node")
      .data(dataArr)
      .enter()
      .append('g')
      // .attr("transform", "translate(0,0)")

      let circle = g.append("circle")
      .attr("class", "node")
      .style("stroke-width", 2)

      let text = g.append('text')
      .style("text-anchor", "middle")
      .text(d => d['name'])
      .style('font-size', '36px')

      // d3.select('svg').append('text')
      //   .style('text-anchor', 'middle')
      //   .attr('class', 'title')
      //   .text('Emojis')
      //   .style('font-size', '36px')
      //   .attr('x', 600)
      //   .attr('y', 50)
    
      redrawNodes()
    
      function updateCartogram() {
        d3.selectAll('circle.node')
          .data(dataArr)
          .attr('cx', d => d.x/3000)
          .attr('cy', d => d.y/3000)

          d3.selectAll('text')
          .attr('x', d => d.x/3000)
          .attr('y', d => d.y/3000)
      }
    
      function resetCartogram() {
        if (notcarto) {

          extent = d3.extent(values)
    
          scale = d3.scaleLinear().domain(extent).range(sizeRange)
          colorScale = d3.scaleCluster().domain(values).range(colors)
    
          redrawNodes()
          force.force('collision', d3.forceCollide(d => scale(d['media_count'])))
          .force('x', d3.forceX(d => d['media_count']))
          .force('y', d3.forceY(d => d['media_count']))
          .alpha(1)
          .restart()
        }
        else {
          var positionScale = d3.scaleCluster().domain(values).range([200,400,600,800,1000])
          force
          .force("x", d3.forceX(d => positionScale(d['media_count'])))
          .force("y", d3.forceY(200))
          .alpha(1)
          .restart()
        }
        notcarto = !notcarto
      }
    
      function redrawNodes() {
        d3.selectAll('circle.node')
          .data(dataArr)
          .transition()
          .duration('10s')
          // .style('fill', d => colorScale(d['media_count']))
          .style('fill', 'none')
          // .style('stroke', d => d3.hsl(colorScale(d['media_count'])).darker())
          .attr('r', d => scale(d['media_count']))
        }
    }

    // module.exports = {
    //   cartogram
    // }