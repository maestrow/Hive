define(function () {
  return {

    transformPoints: function (points, dx, dy) {
      return points.map(function (p) {
        return { x: p.x+dx, y: p.y+dy };
      });
    },

    /**
    x, y - координаты центра
    size - расстояние от центра до любой вершины
    */
    getHexagonPoints: function (x, y, size) {
      var points = [];
      for (var i = 0; i <= 6; i++) {
        var dx = size * Math.cos(Math.PI/3 * i), // PI/3 = 60 град
            dy = size * Math.sin(Math.PI/3 * i);

        points.push({x:x+dx, y:y-dy});
      }
      return points;
    },

    getHexagonalGrid: function (edgeLength, size) {
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

  }
});