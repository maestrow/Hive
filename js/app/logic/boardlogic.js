/**
http://www.redblobgames.com/grids/hexagons/
*/
define(['underscore'], function (_) {

  // ====================================================================================
  // === Private Variables

  var configProps = ['hexEdgeLength', 'gridRadius', 'boardWidth', 'boardHeight'];


  // ====================================================================================
  // === Public API



  var Board = function (config) {

    _.extend(this, _.pick(config, configProps));

    var hexagonPoints = getHexagonPoints(0, 0, this.hexEdgeLength);
    var cellsCenters = getCellsCenters.call(this);
    transformPoints(cellsCenters, this.boardWidth/2, this.boardHeight/2);
    this.getHexagonPoints = function () { return hexagonPoints; };
    this.getCellsCenters = function () { return cellsCenters; };
  };


  Board.prototype.findNearestCenter = function (point) {
    var x = point.x - this.boardWidth/2;
    var y = point.y - this.boardHeight/2;
    var q = 2/3 * x / this.hexEdgeLength;
    var r = (-1/3 * x + 1/3*Math.sqrt(3) * y) / this.hexEdgeLength;

    var hexAxialCoords = cubeToAxial(hexRoundCube(axialToCube({x:q, y:r})));
    return hexAxialCoords;
  };

  Board.sub = function (p1, p2) {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
  }

  Board.pointToObj = function (array) {
    return { x: array[0], y: array[1] };
  }

  return Board;


  // ====================================================================================
  // === Private Functions

  function transformPoints (points, dx, dy) {
    return points.forEach(function (p) {
      p.x += dx;
      p.y += dy;
    });
  };

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
  };


  function getCellsCenters () {

    return getGridCells(this.gridRadius).map(function (cell) {
      var point = axisX0(cellToPoint.call(this, cell));
      return {
        cell: cell,
        x: point.x,
        y: point.y
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
    var rx = Math.round(point.x)
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
    point {x, y}
  */
  function axialToCube (point) {
    return { x: point.x, y: -point.x-point.y, z: point.y };
  }

  /**
    point {x, y, z}
  */
  function cubeToAxial (point) {
    return { x: point.x, y: point.z };
  }

  /**
  cell - координаты ячейки
  возвращает координаты точки в наклонной системе координат
  */
  function cellToPoint (cell) {
    var height = 2 * this.hexEdgeLength * Math.cos(Math.PI/6);

    return { x: cell.x * height, y: cell.y * height };
  }

  /**
    point = {x, y}
    http://www.redblobgames.com/grids/hexagons/#coordinates
    Перевод в наклонную систему координат
    Ось x наклонена на 30 градусов.
  */
  function axisX30 (point) {
    var angle = Math.PI/6, // 30 градусов
        xa = point.x / Math.cos(angle),
        ya = point.y - xa * Math.sin(angle);
    return { x:xa, y:ya };
  }

  function axisX0 (point) {
    var angle = Math.PI/6, // 30 градусов
        x = Math.cos(angle) * point.x,
        y = point.y + Math.sin(angle) * point.x;
    return { x: x, y: y };
  }


  // ====================================================================================
  // === Неиспользуемые функции - черновики, кандидаты на удаление

  function getHexagonalGrid2 (edgeLength, gridRadius) {
    var points = [{x:0, y:0}],
        height = edgeLength * 2,
        width = edgeLength * Math.cos(Math.PI/6) * 2;

    for (var r=1; r<=gridRadius; r++) {           // радиусы
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
  };

});
