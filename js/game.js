define(['d3', 'app/zoompan'], function(d3, zoompan) {

  var zoomer = zoompan.setupSvg(d3.select('#svg')),
      hexSize = 20,
      gridSize = 8, // размер грида задается размером радиуса в ячейках
      grid;

  return {
    setupBoard: setupBoard
  };

  function setupBoard () {
    // Points
    var centers = getHexagonalGrid(hexSize, gridSize);
    var points = getHexagonPoints(0, 0, hexSize);

    // Draw
    centers = transformPoints(centers, zoomer.width/2, zoomer.height/2);
    grid = drawGrid(zoomer.container, centers, points);
  }

  // ====================================================================================
  // === D3 Functions

  // Board

  function drawCenters (svg, points, radius) {
    svg.selectAll('circle').data(points).enter().append('circle')
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
      .attr('r', radius || 1);
  }

  function drawGrid (svg, centers, points) {
    var strPoints = pointsToString(points);
    return svg.selectAll('.cell')
      .data(centers)
      .enter()
        .append('polyline')
        .attr('id', function (d, i) { return 'cell' + i; })
        .classed('cell', true)
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('points', strPoints)
        .attr('transform', function (d) { return 'translate(' + d.x + ', ' + d.y + ')' });
  }

  function pointsToString(points) {
    return points.map(function (p) { 
      return p.x + ',' + p.y;
    }).join(' ');
  }


  // ====================================================================================
  // === Logic Functions

  function transformPoints(points, dx, dy) {
    return points.map(function (p) {
      return { x: p.x+dx, y: p.y+dy };
    });
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

});