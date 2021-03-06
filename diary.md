Цель данного документа - задокументировать процесс разработки игры от начала до конца. Это позволит сохранить:

- материалы
- технологии, движки, библиотеки, алгоритмы
- описания проблем и их решений


## Обзор технологий

- http://d3js.org/
- [D3 on AngularJS](http://www.ng-newsletter.com/posts/d3-on-angular.html)
- http://stackoverflow.com/questions/22238092/html5-2d-hex-board-game-tabletop-engine
- http://craftyjs.com/, http://buildnewgames.com/introduction-to-crafty/


## Гексагональный грид

- [Hexagonal Grids](http://www.redblobgames.com/grids/hexagons/) from Red Blob Games - статья содержит актуальные алгоритмы для игр на гексагональном поле.  


## DIV vs Canvas vs SVG

Нужно реализовать гексагональный грид с возможностью масштабирования и прокрутки.
Есть три принципиально разных варианта реализации, а именно - а именно есть три способа представить игровое поле и фишки: div, svg, canvas. 

- [SVG или Canvas: как выбрать](http://msdn.microsoft.com/ru-ru/library/gg193983(v=vs.85).aspx)

Наглядное сравннение производительности [SVG Swarm](http://bl.ocks.org/mbostock/2647924), [Canvas Swarm](http://bl.ocks.org/mbostock/2647922). SVG быстрее. Canvas перерисовывается, svg - более гибкий механизм: 
- Рисунок в svg - это примитивы, находящиеся в DOM, а значит ими удобно манипулировать с помощью js.
- Оформление примитивов можно изменять через CSS
- К примитивам можно применять атрибут transform. 


### DIV

- http://csshexagon.com/ - данная реализация мне не понравилась тем, что это именно генератор. И, чтобы изменить размер шестиугольника, нужно изменять несколько параметров css, при этом неизвестно как их рассчитывать в зависимости от размера шестиугольника.
- [CSS Hexagon Tutorial](http://jtauber.github.io/articles/css-hexagon.html) by James Tauber. В данной реализации нет возможности нарисовать границу у шестиугольника
- [Html Css Hexagon With Image Inside](http://stackoverflow.com/questions/7433454/html-css-hexagon-with-image-inside). Этот вариант меня всем устроил - простой и гибкий.

Если фишки делать из DIV, то есть проблема: при прокрутке колесиком мыши над фишкой событие не передается прямоугольнику в SVG, отвечающему за масштабирование.


### Canvas

- https://gist.github.com/zackthehuman/1867663
- https://github.com/mpalmerlee/HexagonTools
- https://github.com/rrreese/Hexagon.js
- [Zoom & pan over canvas](http://stackoverflow.com/questions/24907322/zoom-and-pan-html5-canvas-library)


### SVG

Если фишки делать из SVG, то при ее перемещении она может оказываться под другими элементами. Т.к. у SVG нет понятия z-index. Глубина элементов определяется порядком рисования. Решение: просто делать копию перемещаемого объекта. Примеры решений: 
- [Применение эффекта fade](http://bl.ocks.org/alignedleft/9612839). Для этого возникает необходимость клонирования исходного объекта. У меня возникли проблемы при совмещении клонирования и d'n'd.
- http://stackoverflow.com/questions/14167863/how-can-i-bring-a-circle-to-the-front-with-d3 - Лучшее решение. [Пример в живую](https://gist.github.com/trtg/3922684). 

Для создания изображения в шестиугольнике средствами svg есть варианты:

- [clip path](http://codepen.io/aleenabyrne/pen/zfmax)
- [pattern](http://stackoverflow.com/questions/3796025/fill-svg-path-element-with-a-background-image)

Но можно просто разместить шестиугольник и изображение в одной группе так, чтобы шестиугольник не перекрывал изображение.

[Drag + Zoom](http://bl.ocks.org/mbostock/6123708) - пример, демонстрирующий одновременное применение двух поведений: масштабирования и перемещения. 


## D3

- [Canvas Geometric Zooming](http://bl.ocks.org/mbostock/3680958) with D3
Статья содержит 4 типа zoom & pan с использованием [d3js](http://d3js.org): Canvas geometric, Canvas semantic, SVG geometric, SVG semantic 
- [Thinking with Joins](http://bost.ocks.org/mike/join/)
- [Interactive SVG + Canvas Plot](http://bl.ocks.org/sxv/4485778)


## Coffeescript

- http://brizzled.clapper.org/blog/2012/02/18/a-case-for-coffeescript-in-the-browser/
- http://forgivingworm.wordpress.com/2010/09/27/running-coffeescript-in-browser/
- http://stackoverflow.com/questions/17341122/link-and-execute-external-javascript-file-hosted-on-github
 
Coffeescript можно выполнять и загружать внутри тэга `<script type="text/coffeescript">`, но отлаживать в браузере возможности нет.


## Прочие how to & know how

- Как центрировать элемент по вертикали и горизонтали? См. в [статье](http://designshack.net/articles/css/how-to-center-anything-with-css/), раздел Dead Center an Element.
- http://stackoverflow.com/questions/12992351/how-to-update-elements-of-d3-force-layout-when-the-underlying-data-changes
- [Реализация гексагонального поля как плагина для crafty](https://github.com/matthewsimo/crafty.hexametric)