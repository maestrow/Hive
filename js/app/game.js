define([
  'd3',
  'app/boardSetup',
  'app/logic/grid',
  'app/logic/point'],
  function(d3, boardSetup, GridLogic, Point) {

  var svg = d3.select('#svg'),
      board = boardSetup.setupSvg(svg),
      hexSize = 20,
      gridSize = 8, // размер грида задается размером радиуса в ячейках
      grid,
      hexMaskId = 'hex-mask',
      gridLogic = new GridLogic({ hexEdgeLength: hexSize, gridRadius: gridSize, dx: board.width/2, dy: board.height/2 }),
      lastCell,
      draggedPiece;

  return {
    setupBoard: function () {

      // Points
      var centers = gridLogic.getCellsCenters();
      var hexPoints = gridLogic.getHexagonPoints();

      // Draw
      addClipPath(svg, hexPoints, hexMaskId);
      grid = drawGrid(board.grid, centers, hexPoints);

      // Pieces
      var piecesData = [
        {x: 100, y: 100, name: 'queenbee', fill: 'white' },
        {x: 100, y: 150, name: 'ant', fill: 'black' }
      ];
      var pieces = drawPieces(board.pieces, piecesData, hexPoints, hexSize, hexMaskId);

      var drag = d3.behavior.drag()
        .origin(function (d) { return d; })
        .on('dragstart', dragStart)
        .on('drag', dragMove)
        .on('dragend', dragEnd);

      pieces
        .call(drag)
        .on('mousedown', function () { d3.select(this).moveToFront(); });

      board.board.on('mousemove', mousemove);
    }
  };


  // ====================================================================================
  // === D3 Functions

  // Board

  //noinspection JSUnusedLocalSymbols
  function drawCenters (svg, points, radius) {
    svg.selectAll('circle').data(points).enter().append('circle')
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
      .attr('r', radius || 1);
  }

  function drawGrid (parent, centers, points) {
    var strPoints = Point.toString(points);
    return parent.selectAll('.cell')
      .data(centers)
      .enter()
        .append('polyline')
        .attr({
          'id': function (d) { return getCellId(d.cell) },
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
      .attr('points', Point.toString(points));
  }


  // Pieces

  function drawPieces (parent, centers, points, edgeSize, hexMaskId) {
    var strPoints = Point.toString(points),
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
        'points': strPoints
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
    if (lastCell) {
      var cellCenter = d3.select('#' + getCellId(lastCell)).datum();
      d.x = cellCenter.x;
      d.y = cellCenter.y;
    } else {
      d.x = d.origin.x;
      d.y = d.origin.y;
    }

    updatePieces(d3.select(this));
    draggedPiece = null;
  }

  function mousemove () {
    var point = Point.create(d3.mouse(this));

    if (draggedPiece) {
      var mouseDelta = d3.select(draggedPiece).datum().mouseDelta;
      point = point.sub(mouseDelta);
    }

    var cell = gridLogic.findNearestCell(point);
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
