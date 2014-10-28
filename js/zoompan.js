define(['d3'], function (d3) {

  var events = d3.dispatch('zoom'),
      maxzoom = 4,
      dx=0, dy=0, scale=1, // текущие значения смещения и масштаб
      container;

  var api = {
    setupSvg: setup,
    addHandler: function (handler) {
      events.on('zoom', handler);
    }
  };

  Object.defineProperties(api, {
    dx: { get: function () { return dx; } },
    dy: { get: function () { return dy; } },
    scale: { get: function () { return scale; } }
  });

  return api;


  // ====================================================================================
  // === Private Functions

  function setup (selector, domainWidth, width, height) {
    var svg = setupSvg(selector, width, height),
        xScale = getXScale(svg, domainWidth),
        yScale = getYScale(svg, xScale);

    container = getContainer(svg);

    return {
      container: container,
      xScale: xScale,
      yScale: yScale,
      x:x,
      y:y,
      domainWidth: xScale.domain()[1],
      domainHeight: yScale.domain()[1],
      width: svg.attr('width'),
      height: svg.attr('height')
    };
  };

  function setupSvg(selector, width, height) {
    var svg = d3.select(selector);
    
    width = width || svg.node().offsetWidth,
    height = height || svg.node().offsetHeight;
    
    return svg
      .attr('width', width)
      .attr('height', height);
  }

  function getContainer(svg) {
    var width = svg.node().offsetWidth;
    var height = svg.node().offsetHeight;
    
    x = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);

    y = d3.scale.linear()
        .domain([0, height])
        .range([0, height]);

    var z = d3.behavior.zoom().x(x).y(y).scaleExtent([1, maxzoom]).on('zoom', zoom);

    var container = svg
      .append('g')
        .call(z)
      .append('g');

    container.append('rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('width', svg.node().offsetWidth)
      .attr('height', svg.node().offsetHeight);
    
    return container;
  }

  function getXScale (svg, maxValue) {
    return d3.scale.linear().domain([0, maxValue]).range([0, svg.node().offsetWidth]);
  }

  function getYScale (svg, xScale) {
    var h = svg.node().offsetHeight;
    return d3.scale.linear().domain([0, xScale.invert(h)]).range([0, h]);
  }

  function zoom() {
    dx = d3.event.translate[0];
    dy = d3.event.translate[1];
    scale = d3.event.scale;
    container
      .attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
    events.zoom(dx, dy, scale);
    console.log(dx, dy, scale);
  }
});