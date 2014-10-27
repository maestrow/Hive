Цель данного документа - задокументировать процесс разработки игры от начала до конца. Это позволит сохранить:

- материалы
- технологии, движки, библиотеки, алгоритмы
- описания проблем и их решений


## Выбор технологий

- http://d3js.org/
- [D3 on AngularJS](http://www.ng-newsletter.com/posts/d3-on-angular.html)
- http://stackoverflow.com/questions/22238092/html5-2d-hex-board-game-tabletop-engine
- http://craftyjs.com/, http://buildnewgames.com/introduction-to-crafty/

### DIV vs Canvas vs SVG

- [SVG или Canvas: как выбрать](http://msdn.microsoft.com/ru-ru/library/gg193983(v=vs.85).aspx)
- Наглядное сравннение производительности [SVG Swarm](http://bl.ocks.org/mbostock/2647924), [Canvas Swarm](http://bl.ocks.org/mbostock/2647922). SVG быстрее.


## Гексагональный грид

- [Hexagonal Grids](http://www.redblobgames.com/grids/hexagons/) from Red Blob Games.

Нужно реализовать гексагональный грид с возможностью масштабирования и прокрутки.
Есть два принципиальных варианта реализации: на div'ах vs canvas.

1. DIV

- http://csshexagon.com/

2. Canvas

- https://gist.github.com/zackthehuman/1867663
- https://github.com/mpalmerlee/HexagonTools
- https://github.com/rrreese/Hexagon.js

Кроме того есть реализация гексагонального поля [как плагина для crafty](https://github.com/matthewsimo/crafty.hexametric)


## Zoom & pan over canvas

- http://stackoverflow.com/questions/24907322/zoom-and-pan-html5-canvas-library

### [Canvas Geometric Zooming](http://bl.ocks.org/mbostock/3680958)

Статья содержит 4 типа zoom & pan с использованием [d3js](http://d3js.org).
- Canvas geometric zooming
- Canvas semantic zooming
- SVG geometric zooming
- SVG semantic zooming

Статья - это часть оффициальной документации по d3, на нее дается ссылка [отсюда](https://github.com/mbostock/d3/wiki/Zoom-Behavior).


## D3

- [Thinking with Joins](http://bost.ocks.org/mike/join/)
- [Interactive SVG + Canvas Plot](http://bl.ocks.org/sxv/4485778)

## Drag & drop

Over canvas vs over svg.


## Прочие how to & know how

- Как центрировать элемент по вертикали и горизонтали? См. в [статье](http://designshack.net/articles/css/how-to-center-anything-with-css/), раздел Dead Center an Element.
- http://csshexagon.com/
- http://stackoverflow.com/questions/12992351/how-to-update-elements-of-d3-force-layout-when-the-underlying-data-changes