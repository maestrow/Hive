(function(){

  var svg = setupSvg('#svg'),
      xScale = getXScale(svg, 200),
      yScale = getYScale(svg, xScale),
      hexSize = 20
      gridSize = 1; // размер грида задается размером радиуса в ячейках

  var width = xScale.domain()[1],
      height = yScale.domain()[1];

  // Points
  var centers = getHexagonalGrid(hexSize, gridSize);
  var points = getHexagonPoints(0, 0, hexSize);

  // Draw
  centers = transform(centers, xScale, yScale, width/2, height/2);
  points = transform(points, xScale, yScale);
  drawHexagon(svg, centers, points);

  // Drag'n'Drop
  //d3.selectAll('.piece').call(d3.behavior.drag().on('drag', dragMove));
  var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on('dragstart', dragStart)
    .on('drag', dragMove)
  d3.select('#cell0').call(drag);


  // ====================================================================================
  // === D3 Functions

  function setupSvg(selector) {
    var svg = d3.select(selector);
        width = svg.node().offsetWidth,
        height = svg.node().offsetHeight;
    return svg
      .attr('width', width)
      .attr('height', height);
  }

  function getXScale (svg, maxValue) {
    return d3.scale.linear().domain([0, maxValue]).range([0, svg.node().offsetWidth]);
  }

  function getYScale (svg, xScale) {
    var h = svg.node().offsetHeight;
    return d3.scale.linear().domain([0, xScale.invert(h)]).range([0, h]);
  }

  function drawCenters (svg, points, radius) {
    svg.selectAll('circle').data(points).enter().append('circle')
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
      .attr('r', radius || 1);
  }

  function drawHexagon (svg, centers, points) {
    svg.selectAll('.cell')
      .data(centers)
      .enter()
        .append('polyline')
        .attr('id', function (d, i) { return 'cell' + i; })
        .classed('cell', true)
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('points', function (d) {
          return pointsToString(points);
        })
        .attr('transform', dataTranslate);
  }

  function dragMove(d) {
    var e = d3.event;
    d.x = e.x //- d.dragStart.dx;
    d.y = e.y //- d.dragStart.dy;
    d3.select(this).attr('transform', dataTranslate);
  }

  function dragStart(d) {
    var e = d3.event;
    d.dragStart = { dx: e.sourceEvent.clientX - d.x, dy: e.sourceEvent.clientY - d.y };
    //console.log(d3.event);
  }

  function dataTranslate (d) { 
    return 'translate(' + d.x + ', ' + d.y + ')' 
  }


  // ====================================================================================
  // === Logic Functions

  function transform(points, xScale, yScale, dx, dy) {
    dx = dx || 0;
    dy = dy || 0;
    return points.map(function (p) { 
      return { x: xScale(p.x + dx), y: yScale(p.y + dy) };
    });
  }

  function pointsToString(points) {
    return points.map(function (p) { 
      return p.x + ',' + p.y;
    }).join(' ');
  }

  /**
  x, y - координаты центра
  size - расстояние от центра до любой вершины
  */
  function getHexagonPoints (x, y, size) {
    var points = [];
    for (var i = 0; i <= 6; i++) {
      var dx = size * Math.cos(Math.PI/3 * i), // PI/3 = 60 град
          dy = size * Math.sin(Math.PI/3 * i);

      points.push({x:x+dx, y:y-dy});
    }
    return points;
  }

  function getHexagonalGrid(edgeLength, size) {
    var points = [{x:0, y:0}],
        height = edgeLength * 2,
        width = edgeLength * Math.cos(Math.PI/6) * 2;

    for (var r=1; r<=size; r++) {           // радиусы
      var angle = Math.PI/6; 
      for (var m=0; m<6; m++) {             // ребра
        var x = r * width * Math.cos(angle),
            y = r * width * Math.sin(angle);
        for (var k=1; k <= r; k++) {        // элементы на ребре
          points.push({x:x, y:y});
          x = x + width * Math.cos(angle + 2*Math.PI/3);
          y = y + width * Math.sin(angle + 2*Math.PI/3);
        }
        angle += Math.PI/3; // 60 град
      };
    }
    return points;
  }

})();