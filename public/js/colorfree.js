/*
 * Sucka Free! Dev Process Visualizer
 * brez!
 * The Barbarian Group v. SRM
 */

/*jslint indent: 2, newcap: true, browser: true */

(function () {
  "use strict";
  var context = $('#colors')[0].getContext("2d");
  context.strokeStyle = "red";
  context.moveTo(100,100);
  context.lineTo(300,100);
  context.lineTo(200,200);
  context.lineTo(100,100);
  context.stroke();
}());
