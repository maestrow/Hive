require.config({
  baseUrl: 'js/lib', 
  paths: {
    d3: 'd3/d3',
    app: '../app'  // relative to baseUrl
  }
});

require(['d3', 'app/d3patch', 'app/game'], function(d3, undefined, game) {
  game.setupBoard();
});