define(['d3', 'app/boardSetup', 'app/logic/boardlogic'], function(d3, boardSetup, BoardLogic) {

  var svg = d3.select('#svg'),
      board = boardSetup.setupSvg(svg),
      hexSize = 20,
      gridSize = 8, // размер грида задается размером радиуса в ячейках
      grid,
      hexMaskId = 'hex-mask',
      boardlogic = new BoardLogic({ hexEdgeLength: hexSize, gridRadius: gridSize, boardWidth: board.width, boardHeight: board.height }),
      lastCell,
      draggedPiece;

  return {
    setupBoard: function () {

      // Points
      var centers = boardlogic.getCellsCenters();
      var hexPoints = boardlogic.getHexagonPoints();

      // Draw
      addClipPath(svg, hexPoints, hexMaskId);
      grid = drawGrid(board.grid, centers, hexPoints);

      // Pieces
      piecesData = [
        {x: 100, y: 100, name: 'queenbee', fill: 'white' },
        {x: 100, y: 150, name: 'ant', fill: 'black' }
      ];
      pieces = drawPieces(board.pieces, piecesData, hexPoints, hexSize, hexMaskId);

      var drag = d3.behavior.drag()
        .origin(function (d) { return d; })
        .on('dragstart', dragStart)
        .on('drag', dragMove)
        .on('dragend', dragEnd);

      pieces
        .call(drag)
        .on('mousedown', function () { d3.select(this).moveToFront(); });

      //
      board.board.on('mousemove', mousemove);
      //d3.selectAll('.cell')
      //  .on('mouseover.x', mouseover)
      //  .on('mouseout.x', mouseout)
        //.on('mousemove', mousemove)
        ;
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
          'id': function (d, i) { return getCellId(d.cell) },
          'points': strPoints,
          //'display': 'none',
          'transform': function (d) { return 'translate(' + d.x + ', ' + d.y + ')' }
        })
        .classed('cell', true)
        .classed('cell-ordinal', true);
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
        'fill': function (d) { return d.fill; },
        'stroke': 'green',
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

  function dragStart (d) {
    d3.event.sourceEvent.stopPropagation();
    draggedPiece = this;
    var mouse = d3.mouse(d3.select('#board').node());
    d.origin = { x: d.x, y: d.y };
    d.mouseDelta = { x: mouse[0] - d.x, y: mouse[1] - d.y };
  }

  function dragMove (d) {
    d.x = d3.event.x;
    d.y = d3.event.y;
    updatePieces(d3.select(this));

  }

  function dragEnd (d) {
    //d.x = d.origin.x;
    //d.y = d.origin.y;
    if (lastCell) {
      var cellCenter = d3.select('#' + getCellId(lastCell)).datum();
      d.x = cellCenter.x;
      d.y = cellCenter.y;
    }

    updatePieces(d3.select(this));
    draggedPiece = null;
  }

  function mouseover () {
    d3.select(this)
      .classed('cell-highlited', true)
      .classed('cell-ordinal', false);
  }

  function mouseout () {
    d3.select(this)
      .classed('cell-highlited', false)
      .classed('cell-ordinal', true);
  }

  function mousemove () {
    var point = BoardLogic.pointToObj(d3.mouse(this));

    if (draggedPiece) {
      var mouseDelta = d3.select(draggedPiece).datum().mouseDelta;
      point = BoardLogic.sub(point, mouseDelta);
    }

    var cell = boardlogic.findNearestCenter(point);
    if (isCellChanged(cell)) {
      if (lastCell)
        d3.select('#' + getCellId(lastCell))
          .classed('cell-highlited', false)
          .classed('cell-ordinal', true);
      if (cell)
        d3.select('#' + getCellId(cell))
          .classed('cell-highlited', true)
          .classed('cell-ordinal', false);
      lastCell = cell;
      //console.log(lastCell);
    }

    //console.log(c[0] - board.width/2, c[1]- board.height/2);
  }

  function isCellChanged (cell) {
    if (lastCell && cell && lastCell.x == cell.x && lastCell.y == cell.y)
      return false;
    else if (!lastCell && !cell)
      return false;

    return true;
  }

  function getCellId(coords) {
    return 'cell_x' + coords.x + '_y' + coords.y;
  }
});
