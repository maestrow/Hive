define(['d3', 'underscore'], function (d3, _) {

  var defaults = {
    svgId: '#svg',
    boardId: '#board',
    zoomAreaId: '#zoom-area',
    gridId: '#grid',
    piecesId: '#pieces',
    infoId: '#info'
  };

  return {

    setup: function(config) {
      config = config || {};

      var cfg = _.extend({}, defaults, config);
      svg = d3.select(cfg.svgId);

      var width = cfg.width || svg.node().offsetWidth;
      var height = cfg.height || svg.node().offsetHeight;

      svg
        .attr('width', width)
        .attr('height', height);

      return {
        svg      : svg,
        width    : width,
        height   : height,
        board    : d3.select(cfg.boardId),
        zoomArea : d3.select(cfg.zoomAreaId),
        grid     : d3.select(cfg.gridId),
        pieces   : d3.select(cfg.piecesId),
        info     : d3.select(cfg.infoId)
      }
    }
  }
});