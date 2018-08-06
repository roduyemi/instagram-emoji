const cartogram = (data, d3) => {

  const width = window.innerWidth;;
  const height = window.innerHeight;

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

  let svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(0,0)')

  let radiusScale = d3.scaleSqrt().domain([100000, 2000000]).range([10, 80])

  let simulation = d3.forceSimulation()
    .force('x', d3.forceX(width / 2).strength(0.05))
    .force('y', d3.forceY(height / 2).strength(0.05))
    .force('collide', d3.forceCollide(d => radiusScale(d['media_count'])))

  let div = d3.select('body').append('div')	
    .attr('class', 'tooltip')

  let circles = svg.selectAll('.emojis')
    .data(dataArr)
    .enter().append('circle')
    .attr('class', 'emoji')
    .attr('r', d => radiusScale(d['media_count']))
    .attr('fill', 'black')
    .on('mouseover', d => {
      // d3.select(this).style('fill', d3.rgb(color(d.botName)).darker(2));
      div.transition()		
        .duration(200)		
        .style("opacity", .75);		
      div
        .html(d['name'] + "<br/>" + d['media_count'])
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");	
    })
    .on('mouseout', d => {
      // d3.select(this).style("fill", color(d.botName));
      div.transition()		
        .duration(500)		
        .style("opacity", 0);        
  });


  simulation
    .nodes(dataArr)
    .on('tick', ticked)

  function ticked() {
    circles
    .attr('cx', d =>  d.x)
    .attr('cy', d =>  d.y)
  }
}