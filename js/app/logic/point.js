/**
 * Утилиты для работы с точками и координатами на гексагональном поле.
 */
define(['underscore'], function (_) {

  /**
   * Точка на гексагональном поле
   * @param x
   * @param y
   * @constructor
   */
  var Point = function (x, y) {
    if (x instanceof Array) {
      this.x = x[0];
      this.y = x[1];
    } else if (x instanceof Object) {
      _.extend(this, x);
    } else {
      this.x = x;
      this.y = y;
    }
  };

  /**
   * Смещает точку
   * @param x
   * @param y
   * @returns {Point}
   */
  Point.prototype.translate = function (x, y) {
    if (x instanceof Object) {
      this.x += x.x;
      this.y += x.y;
    } else {
      this.x += x;
      this.y += y;
    }
    return this;
  };

  /**
   * Инвертирует знак у координат точки
   */
  Point.prototype.invert = function () {
    this.x *= -1;
    this.y *= -1;
    return this;
  };

  Point.prototype.sub = function (x, y) {
    var p = new Point(x, y).invert();
    //noinspection JSCheckFunctionSignatures
    this.translate(p);
    return this;
  };

  /**
   http://www.redblobgames.com/grids/hexagons/#coordinates
   Перевод в наклонную систему координат
   Ось x наклонена на 30 градусов.
   */
  Point.prototype.toAxisX30 = function () {
    var angle = Math.PI/6,
        xa = this.x / Math.cos(angle),
        ya = this.y - xa * Math.sin(angle);
    return new Point(xa, ya);
  };

  Point.prototype.toAxisX0 = function () {
    var angle = Math.PI/6,
        x = Math.cos(angle) * this.x,
        y = this.y + Math.sin(angle) * this.x;
    return new Point(x, y);
  };

  /**
   point {x, y}
   */
  Point.prototype.toCube = function () {
    return { x: this.x, y: -this.x-this.y, z: this.y };
  };

  /**
   point {x, y, z}
   */

  // ====================================================================================
  // === Static

  Point.create = function (x, y) {
    return new Point(x, y);
  };

  Point.fromCube = function (point) {
    return new Point(point.x, point.z);
  };

  /**
   * Преобразует массив точек в строку для использования в атрибуте points директив svg.
   * @param points Массив виде [{x,y}, ...]
   * @returns {string}
   */
  Point.toString = function (points) {
    return points.map(function (p) {
      return p.x + ',' + p.y;
    }).join(' ');
  };

  return Point;
});