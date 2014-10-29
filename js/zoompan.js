define(['d3'], function (d3) {


  // ====================================================================================
  // === Private Variables

  var events = d3.dispatch('zoom'),
      zoomMin = 1, zoomMax = 4, zoomDelta = 0.1, // параметры масштабирования
      dx=0, dy=0, scale=1, // текущие значения смещения и масштаб
      zoomBehavior,
      container; // контейнер, к которому применяется transtate и scale


  // ====================================================================================
  // === Public API

  return {
    setupSvg: main
  };


  // ====================================================================================
  // === Private Functions

  function main (svg, width, height) {
    
    width = width || svg.node().offsetWidth,
    height = height || svg.node().offsetHeight;
    svg
      .attr('width', width)
      .attr('height', height);

    var scaleX = d3.scale.linear().domain([0, width]).range([0, width]),
        scaleY = d3.scale.linear().domain([0, height]).range([0, height]);
    
    // Module variables
    zoomBehavior = d3.behavior.zoom().x(scaleX).y(scaleY)
      .scaleExtent([zoomMin, zoomMax])
      .on('zoom', onZoom);
    container = getContainer(svg, zoomBehavior);

    var api = {
      container: container,
      scaleX: scaleX,
      scaleY: scaleY,
      zoom: zoomBehavior,
      addHandler: function (handler, name) {
        var n = name ? '.' + name : '';
        events.on('zoom' + n, handler);
      },
      zoomIn: zoomIn,
      zooomOut: zoomOut
    };

    Object.defineProperties(api, {
      dx: { get: function () { return dx; } },
      dy: { get: function () { return dy; } },
      scale: { get: function () { return scale; } },
      width: { get: function () { return width; } },
      height: { get: function () { return height; } }
    });
    
    return api;
  };

  function getContainer(svg, zoom) {
    
    var container = svg
      .append('g')
        .call(zoom)
      .append('g')
        .attr('id', 'canvas');

    container.append('rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('width', svg.node().offsetWidth)
      .attr('height', svg.node().offsetHeight);
    
    return container;
  }

  function onZoom() {
    
    dx = d3.event.translate[0];
    dy = d3.event.translate[1];
    scale = d3.event.scale;
    
    container
      .attr('transform', 'translate(' + d3.event.translate + ') scale(' + scale + ')');
    
    events.zoom(dx, dy, scale);
    
    //console.log(scale);
  }

  function zoomIn() {
    zoom (zoomBehavior.scale() + zoomDelta);
  }

  function zoomOut() {
    zoom (zoomBehavior.scale() - zoomDelta);
  } 

  function zoom(value) {

    if (value > zoomMax)
      value = zoomMax;
    if (value < zoomMin)
      value = zoomMin;
    
    zoomBehavior.scale(value);
    zoomBehavior.event(container);
  }

});