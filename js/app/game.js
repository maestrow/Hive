define(['d3', 'app/boardSetup', 'app/logic/boardlogic'], function(d3, boardSetup, boardlogic) {

  var svg = d3.select('#svg'),
      board = boardSetup.setupSvg(svg),
      hexSize = 20,
      gridSize = 8, // размер грида задается размером радиуса в ячейках
      grid,
      hexMaskId = 'hex-mask';

  return {
    setupBoard: function () {

      // Points
      var centers = boardlogic.getHexagonalGrid(hexSize, gridSize);
      centers = boardlogic.transformPoints(centers, board.width/2, board.height/2);
      var hexPoints = boardlogic.getHexagonPoints(0, 0, hexSize);

      // Draw
      addClipPath(svg, hexPoints, hexMaskId);
      grid = drawGrid(board.grid, centers, hexPoints);

      // Pieces
      piecesData = [{x: 100, y: 100, name: 'queenbee'}, {x: 200, y: 200, name: 'queenbee'}];
      pieces = drawPieces(board.pieces, piecesData, hexPoints, hexSize, hexMaskId);

      var drag = d3.behavior.drag()
        .origin(function (d) { return d; })
        .on('dragstart', dragStart)
        .on('drag', dragMove);

      pieces
        .call(drag)
        .on('mousedown', function () { d3.select(this).moveToFront(); });
    }
  };

  
  // ====================================================================================
  // === D3 Functions

  // Board

  function drawCenters (svg, points, radius) {
    svg.selectAll('circle').data(points).enter().append('circle')
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
      .attr('r', radius || 1);
  }

  function drawGrid (parent, centers, points) {
    var strPoints = pointsToString(points);
    return parent.selectAll('.cell')
      .data(centers)
      .enter()
        .append('polyline')
        .attr({
          'id': function (d, i) { return 'cell' + i; },
          'fill': 'white',
          'stroke': 'black',
          'points': strPoints,
          'transform': function (d) { return 'translate(' + d.x + ', ' + d.y + ')' }
        })
        .classed('cell', true);
  }

  function addClipPath (svg, points, id) {
    svg
      .insert('clipPath', ':first-child')
      .attr('id', id)
      .append('polygon')
      .attr('points', pointsToString(points));
  }

  function pointsToString(points) {
    return points.map(function (p) { 
      return p.x + ',' + p.y;
    }).join(' ');
  }


  // Pieces

  function drawPieces (parent, centers, points, edgeSize, hexMaskId) {
    var strPoints = pointsToString(points),
        coverSize = 2 * edgeSize * Math.cos(Math.PI/6);
    var pieces = parent
      .selectAll('.piece')
      .data(centers)
      .enter()
        .append('g')
        .classed('piece', true);

    pieces
      .append('polyline')
      .attr({
        'fill': 'white',
        'stroke': 'black',
        'points': strPoints,
      });

    pieces
      .append('image')
      .attr({
        'xlink:href': function (d) { return '/img/pieces/' + d.name + '.png'; },
        'x': -coverSize/2,
        'y': -coverSize/2,
        'height': coverSize,
        'width': coverSize,
        'clip-path': 'url(#' + hexMaskId + ')'
      });
    
    updatePieces(pieces);
    return pieces;
  }

  function updatePieces(selection) {
    
    selection.attr('transform', function (d) { 
      return 'translate (' + d.x + ', ' + d.y + ')';
    });
  }

  function dragStart () {
    d3.event.sourceEvent.stopPropagation();
  }

  function dragMove (d) {
    d.x = d3.event.x;
    d.y = d3.event.y;
    updatePieces(d3.select(this));
  }

});