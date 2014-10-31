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
    var hexagonalGrid = getHexagonalGrid(this.hexEdgeLength, this.gridRadius);
    hexagonalGrid = transformPoints(hexagonalGrid, this.boardWidth/2, this.boardHeight/2);
    this.getHexagonPoints = function () { return hexagonPoints; };
    this.getHexagonalGrid = function () { return hexagonalGrid; };
  };


  Board.prototype.findNearestCenter = function (x, y) {
    x -= this.boardWidth/2;
    y -= this.boardHeight/2;
    var q = 2/3 * x / this.hexEdgeLength;
    var r = (-1/3 * x + 1/3*Math.sqrt(3) * y) / this.hexEdgeLength;

  };
  
  return Board;

  // ====================================================================================
  // === Private Functions

  function transformPoints (points, dx, dy) {
    return points.map(function (p) {
      return { x: p.x+dx, y: p.y+dy };
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

  function getHexagonalGrid (edgeLength, gridRadius) {
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

  /**
    Округляет координаты ячейки в кубической системе координат
  */
  function hexRoundCube (x, y, z) {
    var rx = Math.round(x)
        ry = Math.round(y),
        rz = Math.round(z),
        x_diff = Math.abs(rx - x),
        y_diff = Math.abs(ry - y),
        z_diff = Math.abs(rz - z);

    if (x_diff > y_diff && x_diff > z_diff)
        rx = -ry-rz;
    else if (y_diff > z_diff)
        ry = -rx-rz;
    else
        rz = -rx-ry;

    return { x: rx, y: ry, z: rz };
  }

  /**
    http://www.redblobgames.com/grids/hexagons/#coordinates
    Перевод в наклонную систему координат
    Ось x наклонена на 30 градусов.
  */
  function decartTo30 (x, y) {
    var angle = Math.PI/6, // 30 градусов
        xa = x / Math.cos(angle),
        ya = y - xa * Math.sin(angle);
    return { x:xa, y:ya };
  }

  /**
  x, y - координаты точны в наклонной системе координат
  */
  function pointToHex (x, y) {
    var height = 2 * this.hexEdgeLength * Math.cos(Math.PI/6),
        width = 2 * this.hexEdgeLength;

    return { x: x/width, y: y/height };
  }

});