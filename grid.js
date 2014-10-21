(function () {
  var hexHeight,
      hexRadius,
      hexRectangleHeight,
      hexRectangleWidth,
      hexagonAngle = 0.523598776, // 30 degrees in radians
      sideLength = 36,
      boardWidth = 10,
      boardHeight = 10;

  hexHeight = Math.sin(hexagonAngle) * sideLength;
  hexRadius = Math.cos(hexagonAngle) * sideLength;
  hexRectangleHeight = sideLength + 2 * hexHeight;
  hexRectangleWidth = 2 * hexRadius;

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#CCCCCC";
  ctx.lineWidth = 1;

  drawBoard(ctx, boardWidth, boardHeight);
 
  function drawBoard(canvasContext, width, height) {
    var i,
        j;

    for(i = 0; i < width; ++i) {
      for(j = 0; j < height; ++j) {
        drawHexagon(
          ctx, 
          i * hexRectangleWidth + ((j % 2) * hexRadius), 
          j * (sideLength + hexHeight), 
          false
        );
      }
    }
  }

  function drawHexagon(canvasContext, x, y, fill) {           
      var fill = fill || false;

      canvasContext.beginPath();
      canvasContext.moveTo(x + hexRadius, y);
      canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight);
      canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight + sideLength);
      canvasContext.lineTo(x + hexRadius, y + hexRectangleHeight);
      canvasContext.lineTo(x, y + sideLength + hexHeight);
      canvasContext.lineTo(x, y + hexHeight);
      canvasContext.closePath();

      if(fill) {
          canvasContext.fill();
      } else {
          canvasContext.stroke();
      }
  }
})();