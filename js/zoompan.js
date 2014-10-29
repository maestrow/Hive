define(['d3'], function (d3) {


  // ====================================================================================
  // === Private Variables

  var events = d3.dispatch('zoom'),
      maxzoom = 4,
      dx=0, dy=0, scale=1, // текущие значения смещения и масштаб
      zoomBehavior,
      container; // контейнер, к которому применяется transtate и scale


  // ====================================================================================
  // === Public API

  var api = {
    setupSvg: setup,
    addHandler: function (handler, name) {
      var n = name ? '.' + name : '';
      events.on('zoom' + n, handler);
    },
    zoom: zoom
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
        yScale = getYScale(svg, xScale),
        width = svg.attr('width'),
        height = svg.attr('height'),
        x = d3.scale.linear().domain([0, width]).range([0, width]),
        y = d3.scale.linear().domain([0, height]).range([0, height]);
    
    // Module variables
    zoomBehavior = d3.behavior.zoom().x(x).y(y).scaleExtent([1, maxzoom]).on('zoom', onZoom);
    container = getContainer(svg, zoomBehavior);

    return {
      container: container,
      xScale: xScale,
      yScale: yScale,
      x:x,
      y:y,
      zoom: zoomBehavior,
      domainWidth: xScale.domain()[1],
      domainHeight: yScale.domain()[1],
      width: width,
      height: height
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

  function getContainer(svg, zoom) {
    
    var container = svg
      .append('g')
        .call(zoom)
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

  function onZoom() {
    
    dx = d3.event.translate[0];
    dy = d3.event.translate[1];
    scale = d3.event.scale;
    
    container
      .attr('transform', 'translate(' + d3.event.translate + ')scale(' + scale + ')');
    
    events.zoom(dx, dy, scale);
    
    console.log(scale);
  }

  function zoom (delta) {

    scale = zoomBehavior.scale() + delta;
    var extent = zoomBehavior.scaleExtent();

    if (scale > extent[1])
      scale = extent[1];
    if (scale < extent[0])
      scale = extent[0];
    
    zoomBehavior.scale(scale);
    zoomBehavior.event(container);
  }

});