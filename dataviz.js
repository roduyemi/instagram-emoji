const cartogram = (data, d3) => {

  const width = window.innerWidth;;
  const height = window.innerHeight;
  let moodForce = true;

  const keys = Object.keys(data);
  let dataArr = [];
  keys.forEach(key => {
    dataArr.push(data[key])
  });

  let keyValues = Object.values(data);
  let values = []
  keyValues.forEach(value => {
    values.push(value['media_count'])
  });

  let svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(0,0)')

  let defs = svg.append('defs')
    .data(dataArr)

  defs.append('pattern')

  let radiusScale = d3.scaleSqrt().domain([100000, 2000000]).range([10, 80])

  defs.selectAll('.emoji-pattern')
  .data(dataArr)
  .enter().append('pattern')
  .attr('id', d => d['name'])
  .attr('height', '100%')
  .attr('width', '100%')
  .attr('patternContentUnits', 'objectBoundingBox')
  .append('image')
  .attr('height', 0.85)
  .attr('width', 0.85)
  .attr('preserveAspectRatio', 'none')
  .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  .attr('xlink:href', d => 'https://s3-eu-west-1.amazonaws.com/newslabs-geofacts/emojis/' + d['type']+ '.png')

  let forceXMood = d3.forceX(d => {
    moodForce = true
    if (d['mood'] === 'positive') {
      return 300
    }
    else {
      return 800
    }
  }).strength(0.1);

  let forceX = d3.forceX(d => {
    moodForce = false
    return width / 2
  }).strength(0.1);
  let forceY = d3.forceY(d => height / 2).strength(0.1);
  let forceCollide = d3.forceCollide(d => radiusScale(d['media_count']) + 1);

  let simulation = d3.forceSimulation()
    .force('x', forceXMood)
    .force('y', forceY)
    .force('collide', forceCollide)

  let div = d3.select('body').append('div')	
    .attr('class', 'tooltip')

  let circles = svg.selectAll('.emojis')
    .data(dataArr)
    .enter().append('circle')
    .attr('class', 'emoji')
    .attr('r', d => radiusScale(d['media_count']))
    .attr('fill', d => 'url(#' + d['name'] + ')')
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
    // .on('end', end)

  function ticked() {
    circles
    .attr('cx', d =>  d.x)
    .attr('cy', d =>  d.y)
  }

  d3.select('body').on('click', () => {
    if(moodForce) {
      simulation
      .force('x', forceX)
      .alphaTarget(0.25)
      .restart()
    } else {
      simulation
      .force('x', forceXMood)
      .alphaTarget(0.5)
      .restart()
    }
  })
}