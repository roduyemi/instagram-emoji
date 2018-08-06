
// const d3 = require('d3');
// const scaleCluster = require('d3-scale-cluster');
// const select = require('d3-selection');

// let jsdom;
// try {
//   jsdom = require("jsdom/lib/old-api.js"); // jsdom >= 10.x
// } catch (e) {
//   jsdom = require("jsdom"); // jsdom <= 9.x
// }
// var doc = jsdom.jsdom();
// let doc = null;

// jsdom.env('//localhost:3000', function(error, window) {
//   if (error) throw error;
//   doc = d3.select(window.document);
// });;

// const options = { selector: 'body' }
// const d3n = new D3Node(options) // initializes D3 with container element
// const D3Node = require('d3-node')
// const d3n = new D3Node(options)
// const d3 = d3n.d3


// d3n.createSVG(1200,1000);
// d3.select(d3n.document.querySelector('svg')).append('span')


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
    
    // d3.csv("https://s3-eu-west-1.amazonaws.com/newslabs-geofacts/county_demo.csv", cartogram)
    
    const cartogram = (data, d3) => {
      console.log('data in cartogram', data);
      let dataKeys = Object.keys(data);
      let dataCount = data;
      
      // console.log('dataKeys', dataKeys);
      // data.forEach(d => {
        dataKeys.forEach(k => {
          dataCount[k] = parseInt(data[k]['media_count']);
        });
      // });
      let thisKeyValues = Object.values(dataCount);

      console.log(thisKeyValues);
    
      // var thisKeyValues = data.forEach((d, i) => d[i]);
      // console.log('keyValues', thisKeyValues);
    
      var extent = d3.extent(thisKeyValues);
    
      var scale = d3.scaleLinear().domain(extent).range(sizeRange)
      var colorScale = scaleCluster().domain(thisKeyValues).range(colors)
    
      var force = d3.forceSimulation()
      .force("collision", d3.forceCollide(d => scale(d['media_count'])).iterations(2))
      .force('x', d3.forceX(d => d['media_count']/200))
      .force('y', d3.forceY(d => d['media_count']/150))
      .nodes(data)
      .alphaMin(0.25)
      .on('tick', updateCartogram)
      .on('end', resetCartogram)
    
      // doc.select('svg')
      // d3.select('chart').append('svg')
      d3.select(doc.getElementById('chart')).append('svg')
        .selectAll('circle.node')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'node')
        .style('stroke-width', 2)
      // d3.select('svg').append('text')
      //   .style('text-anchor', 'middle')
      //   .attr('class', 'title')
      //   .text('Total Population')
      //   .style('font-size', '36px')
      //   .attr('x', 600)
      //   .attr('y', 50)
    
      redrawNodes()
    
      function updateCartogram() {
        d3.selectAll(doc.getElementById('circle.node'))
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
      }
    
      function resetCartogram() {
        if (notcarto) {
          // selectedIndex = selectedIndex === dataKeys.length ? 0 : selectedIndex + 1
          // selectedValue = dataKeys[selectedIndex]
          // d3.select(d3n.document.querySelector('text.title'))
          //   .text(keys['media_count'])
    
          // thisKeyValues = dataCount.forEach(d => d['media_count'])
          extent = d3.extent(thisKeyValues)
    
          scale = d3.scaleLinear().domain(extent).range(sizeRange)
          colorScale = scaleCluster().domain(thisKeyValues).range(colors)
    
          redrawNodes()
          force.force('collision', d3.forceCollide(d => {
            scale(d['media_count'])
          }).iterations(2))
          .force('x', d3.forceX(d => d['media_count']/200))
          .force('y', d3.forceY(d => d['media_count']/150))
          .alpha(1)
          .restart()
    
        }
        else {
          var positionScale = scaleCluster().domain(thisKeyValues).range([200,400,600,800,1000])
          force
          .force("x", d3.forceX(d => positionScale(d['media_count'])))
          .force("y", d3.forceY(400))
          .alpha(1)
          .restart()
        }
        notcarto = !notcarto
      }
    
      function redrawNodes() {
        d3.selectAll(doc.getElementById('circle.node'))
          .transition()
          .duration(500)
          .style('fill', d => colorScale(d['media_count']))
          .style('stroke', d => d3.hsl(colorScale(d['media_count'])).darker())
          .attr('r', d => scale(d['media_count']))
        }
    }

    module.exports = {
      cartogram
    }