define(['d3'], function (d3) {


  // ====================================================================================
  // === Private Variables

  var events = d3.dispatch('zoom'),
      zoomMin = 1, zoomMax = 4, zoomDelta = 0.1, // параметры масштабирования
      dx=0, dy=0, scale=1, // текущие значения смещения и масштаб
      transformArea,
      zoomBehavior;


  // ====================================================================================
  // === Public API

  return {

    setup: function (svg, pointerArea, transformArea_) {

      var width = svg.attr('width'),
          height = svg.attr('width'),
          scaleX = d3.scale.linear().domain([0, width]).range([0, width]),
          scaleY = d3.scale.linear().domain([0, height]).range([0, height]);

      // Module variables
      zoomBehavior = d3.behavior.zoom().x(scaleX).y(scaleY)
        .scaleExtent([zoomMin, zoomMax])
        .on('zoom', onZoom);
      transformArea = transformArea_;

      initZoomBehavior(svg, pointerArea, zoomBehavior);

      var api = {
        scaleX: scaleX,
        scaleY: scaleY,
        zoomBehavior: zoomBehavior,
        addZoomHandler: function (handler, name) {
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
    }
  };

  function zoomIn() {
    zoom (zoomBehavior.scale() + zoomDelta);
  }

  function zoomOut() {
    zoom (zoomBehavior.scale() - zoomDelta);
  }


  // ====================================================================================
  // === Private Functions

  function initZoomBehavior(svg, pointerArea, zoom) {
    pointerArea.call(zoom);

    pointerArea
      .insert('rect', ':first-child')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('width', svg.attr('width'))
      .attr('height', svg.attr('height'));
  }

  function onZoom() {
    dx = d3.event.translate[0];
    dy = d3.event.translate[1];
    scale = d3.event.scale;

    transformArea
      .attr('transform', 'translate(' + d3.event.translate + ') scale(' + scale + ')');

    events.zoom(dx, dy, scale);
    //console.log(scale);
  }

  function zoom(value) {
    value = checkZoomFactor(value);
    zoomBehavior.scale(value);
    zoomBehavior.event(container);
  }

  function checkZoomFactor (value) {
    if (value > zoomMax)
      value = zoomMax;
    if (value < zoomMin)
      value = zoomMin;
    return value;
  }

});
