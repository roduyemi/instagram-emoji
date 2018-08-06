
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
    
//     var selectedValue = "tot_pop"
//     var selectedIndex = 0
    var sizeRange = [1.5,50]
    var notcarto = true
    
//     // d3.csv("https://s3-eu-west-1.amazonaws.com/newslabs-geofacts/county_demo.csv", cartogram)
    
    const cartogram = (data, d3) => {
      const keys = Object.keys(data);
      let dataArr = [];
      keys.forEach(k => {
        dataArr.push(data[k])
      });

      console.log('data before', data);
      
      // console.log('dataKeys', dataKeys);
    //   data.forEach(d => {
    //     dataKeys.forEach(k => {
    //     //   data[k] = parseInt(data[k]['media_count']/5000);
    //     });
    //   });
      let thisKeyValues = Object.values(data);
      let values = []
      thisKeyValues.forEach(v => {
          console.log('v', v['media_count']);
        values.push(v['media_count'])
      });

      console.log('new data', dataArr);
    
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
    
      // doc.select('svg')
      // d3.select('chart').append('svg')
      d3.select('svg')
        .append("circle")
        .attr("class", "node")
        .style("stroke-width", 2)
        .style("stroke-color", 'black')
        .selectAll('circle.node')
        .data(dataArr)
        .enter()
        .append("circle")
        .attr("class", "node")
        .style("stroke-width", 2)
        

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
          .attr('cx', d => d.x/5000)
          .attr('cy', d => d.y/5000)
      }
    
      function resetCartogram() {
        if (notcarto) {
          // selectedIndex = selectedIndex === dataKeys.length ? 0 : selectedIndex + 1
          // selectedValue = dataKeys[selectedIndex]
          // d3.select(d3n.document.querySelector('text.title'))
          //   .text(keys['media_count'])
    
          // thisKeyValues = dataCount.forEach(d => d['media_count'])
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
          .force("y", d3.forceY(400))
          .alpha(1)
          .restart()
        }
        notcarto = !notcarto
      }
    
      function redrawNodes() {
        d3.selectAll('circle.node')
          .data(dataArr)
          .transition()
          .duration(500)
          .style('fill', d => colorScale(d['media_count']))
          .style('stroke', d => d3.hsl(colorScale(d['media_count'])).darker())
          .attr('r', d => scale(d['media_count']))
        }
    }

    // module.exports = {
    //   cartogram
    // }