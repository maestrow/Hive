/**
http://www.redblobgames.com/grids/hexagons/
*/
define(['underscore', 'app/logic/point'], function (_, Point) {

  // ====================================================================================
  // === Private Variables

  var configProps = ['hexEdgeLength', 'gridRadius', 'dx', 'dy'];


  // ====================================================================================
  // === Public API

  var Grid = function (config) {
    _.extend(this, _.pick(config, configProps));

    this.cellHeight = 2 * this.hexEdgeLength * Math.cos(Math.PI/6);
    var hexagonPoints = getHexagonPoints(0, 0, this.hexEdgeLength);
    var cellsCenters = getCellsCenters.call(this, this.dx, this.dy);

    this.getHexagonPoints = function () { return hexagonPoints; };
    this.getCellsCenters = function () { return cellsCenters; };
  };

  Grid.prototype.findNearestCell = function (point) {
    var p = Point.create(point).sub(this.dx, this.dy);
    var cell = Point.fromCube(hexRoundCube(pointToCell.call(this, p.toAxisX30()).toCube()));
    if (isCellInRadius.call(this, cell))
      return cell;
    return null;
  };

  // ====================================================================================
  // === Private Functions

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


  function getCellsCenters (dx, dy) {
    dx = dx || 0;
    dy = dy || 0;
    return getGridCells(this.gridRadius).map(function (cell) {
      var point = cellToPoint.call(this, cell).toAxisX0();
      return {
        cell: { x: cell.x, y: cell.y },
        x: point.x + dx,
        y: point.y + dy
      };
    }, this);
  }

  /**
  Возвращает координаты всеХ ячеек грида радиусом r
  r = gridRadius
  */
  function getGridCells (r) {
    var cells = [];
    for (var y = -r; y <= r; y++) {
      for (var x = Math.max(-r-y, -r); x <= Math.min(r-y,r); x++) {
        cells.push({x:x,y:y});
      }
    }
    return cells;
  }

  /**
   Округляет координаты ячейки в кубической системе координат
   */
  function hexRoundCube (point) {
    var rx = Math.round(point.x),
        ry = Math.round(point.y),
        rz = Math.round(point.z),
        x_diff = Math.abs(rx - point.x),
        y_diff = Math.abs(ry - point.y),
        z_diff = Math.abs(rz - point.z);

    if (x_diff > y_diff && x_diff > z_diff)
      rx = -ry-rz;
    else if (y_diff > z_diff)
      ry = -rx-rz;
    else
      rz = -rx-ry;

    return { x: rx, y: ry, z: rz };
  }

  /**
  cell - координаты ячейки
  возвращает координаты точки в наклонной системе координат
  */
  function cellToPoint (cell) {
    return Point.create(cell.x * this.cellHeight, cell.y * this.cellHeight);
  }

  /**
   * В наклонной системе координат по координате точки возвращает координаты ячейки
   * @param point
   */
  function pointToCell(point) {
    return Point.create(point.x / this.cellHeight, point.y / this.cellHeight);
  }

  function isCellInRadius(cell) {
    if (cell.x * cell.y > 0) {
      return Math.abs(cell.x) + Math.abs(cell.y) <= this.gridRadius;
    } else {
      return Math.abs(cell.x) <= this.gridRadius && Math.abs(cell.y) <= this.gridRadius;
    }
  }

  return Grid;
});
