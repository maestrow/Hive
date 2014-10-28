require.config({
  baseUrl: 'js/lib', 
  paths: {
    d3: 'd3/d3',
    app: '..'  // relative to baseUrl
  }
});

require(['d3', 'app/game'], function(d3, game) {
  game.setupBoard();
});