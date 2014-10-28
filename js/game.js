define(['d3', 'app/zoompan'], function(d3, zoompan) {

  var svg = zoompan.setupSvg('#svg', 200),
      hexSize = 5,
      gridSize = 8, // размер грида задается размером радиуса в ячейках
      grid;

  zoompan.addHandler(zoom);

  return {
    setupBoard: setupBoard
  };

  function setupBoard () {
    // Points
    var centers = getHexagonalGrid(hexSize, gridSize);
    var points = getHexagonPoints(0, 0, hexSize);

    // Draw
    centers = transform(centers, svg.xScale, svg.yScale, svg.width/2, svg.height/2);
    points = transform(points, svg.xScale, svg.yScale);
    grid = drawGrid(svg.container, centers, points);

    // Pieces
    addPiece('#game-field', 0, 0, svg.xScale(hexSize), 'queenbee');

    // Drag'n'Drop
    var drag = d3.behavior.drag()
      .origin(function (d) { return d; })
      .on('drag', dragMove);
    d3.selectAll('.piece').call(drag);
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

  // Pieces

  function addPiece(parent, x, y, size, name) {
    var n = 'piece-' + name;
    
    var newPiece = d3.select(parent)
      .selectAll('#'+n)
      .data([{x: x, y: y}])
      .enter()
      .append('div')
        .attr('id', n)
        .classed('piece hexagon', true);

    newPiece
      .append('div')
        .classed('hexagon-in1', true)
      .append('div')
        .classed('hexagon-in2', true)
        .style('background-image', 'url(img/pieces/' + name + '.png)');

    updatePieces(newPiece);
  }

  function addPiece_test(parent, x, y, size, name) {
    var n = 'piece-' + name;
    
    var newPiece = d3.select(parent)
      .selectAll('#'+n)
      .data([{x: x, y: y}])
      .enter()
      .append('div')
        .attr('id', n)
        .classed('piece', true)
        .style('background-repeat', 'no-repeat')
        .style('background-color', 'lightgray')
        .style('background-size', 'cover')
        .style('background-image', 'url(img/pieces/' + name + '.png)');

    updatePieces(newPiece);
  }

  function updatePieces (selection) {

    var size = svg.xScale(hexSize),
        width = 2 * Math.cos(Math.PI/6) * size * zoompan.scale,
        height = 2 * size * zoompan.scale;

    selection
      .style('left', function (d) { 
        return svg.x(d.x) - height/2 + 'px'; 
      })
      .style('top', function (d) { 
        return svg.y(d.y) - width/2 + 'px'; 
      })
      .style('width', height + 'px')
      .style('height', width + 'px');
  }

  function dragMove(d) {
    d.x = d3.event.x;
    d.y = d3.event.y;

    updatePieces(d3.select(this));
    console.log(d);
  }

  function zoom() {

    //grid
    //  .attr('transform', function (d) { 
    //    return "translate(" + svg.x(d.x) + "," + svg.y(d.y) + ")"; 
    //  });

    updatePieces(d3.selectAll('.piece'));
  }


  // ====================================================================================
  // === Logic Functions

  function transform(points, xScale, yScale, dx, dy) {
    dx = dx || 0;
    dy = dy || 0;
    return points.map(function (p) { 
      return { x: xScale(p.x) + dx, y: yScale(p.y) + dy };
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

});