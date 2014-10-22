(function(){

  var svg = setupSvg('#svg'),
      xScale = getX(svg, 200),
      yScale = getY(svg, xScale),
      hexSize = 5
      gridSize = 8; // размер грида задается размером радиуса в ячейках

  //var points = getHexagonPoints(5, 5, 3);

  var width = xScale.domain()[1];
  var height = yScale.domain()[1];
  var centers = getHexagonalGrid(hexSize, gridSize);
  
  var polylines = centers.map(function (c) { 
    return getHexagonPoints(width/2 + c.x, height/2 + c.y, hexSize); 
  });

  //drawCenters(svg, centers, xScale, yScale);
  drawHexagon(svg, polylines, xScale, yScale);


  // === D3 Functions

  function setupSvg(selector) {
    var svg = d3.select(selector);
        width = svg.node().offsetWidth,
        height = svg.node().offsetHeight;
    return svg
      .attr('width', width)
      .attr('height', height);
  }

  function getX (svg, maxValue) {
    return d3.scale.linear().domain([0, maxValue]).range([0, svg.node().offsetWidth]);
  }

  function getY (svg, xScale) {
    return d3.scale.linear().domain([0, xScale.invert(height)]).range([0, svg.node().offsetHeight]);
  }

  function drawCenters (svg, points, xScale, yScale) {
    var w = xScale.range()[1];
    var h = yScale.range()[1];
    svg.selectAll('circle').data(points).enter().append('circle')
      .attr('cx', function (d) { return w/2 + xScale(d.x); })
      .attr('cy', function (d) { return h/2 + yScale(d.y); })
      .attr('r', 1);
  }

  function drawHexagon (svg, polylines, xScale, yScale) {
    svg.selectAll('polyline').data(polylines).enter().append('polyline')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('points', function (d) {
        return pointsToString(d, xScale, yScale);
      });
  }


  // === Logic Functions

  function pointsToString(points, xScale, yScale) {
    return points.map(function (p) { 
      return xScale(p.x) + ',' +  yScale(p.y);
    }).join(' ');
  }

  /**
  x, y - координаты центра
  size - расстояние от центра до любой вершины
  */
  function getHexagonPoints (x, y, size) {
    var points = [];
    for (var i = 0; i <= 6; i++) {
      var dx = size * Math.sin(Math.PI/3 * i), // PI/3 = 60 град
          dy = size * Math.cos(Math.PI/3 * i);

      points.push({x:x+dx, y:y-dy});
    }
    return points;
  }

  function getHexagonalGrid(edgeLength, size) {
    var points = [{x:0, y:0}],
        height = edgeLength * 2,
        width = edgeLength * Math.cos(Math.PI/6) * 2;

    for (var r=1; r<=size; r++) {           // радиусы
      var angle = 0;
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