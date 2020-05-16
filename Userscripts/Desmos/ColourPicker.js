// ==UserScript==
// @name         Desmos Colour Picker Test
// @namespace    http://tampermonkey.net/
// @match        *://www.desmos.com/calculator*
// @require      https://raw.githubusercontent.com/EastDesire/jscolor/master/jscolor.js
// ==/UserScript==

setTimeout(function() {
    'use strict';

    function rgb2hex(rgb) {
        if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
    var zNode = document.createElement ('input');
    zNode.setAttribute ('id', 'picker');
    zNode.setAttribute ('class', "jscolor");
    zNode.setAttribute('value',"ffffff")
    zNode.setAttribute ('style',"position: relative; text-align: center; width:50%; top:-45%; height:35%; border:1px solid black");
    var x = document.getElementsByClassName("align-center-container");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].appendChild(zNode);
        break;
    }
    var gp = document.getElementById('picker')
    gp.addEventListener("click", makeColour, false);
    function makeColour(zEvent){
        if (gp.style.backgroundColor) {
            var col = rgb2hex(gp.style.backgroundColor)
            for (var c in unsafeWindow.Calc.colors) {
                if (unsafeWindow.Calc.colors[c]==col) {
                    return;
                }
            }
            unsafeWindow.Calc.colors[col] = col;
        }
    }
}, 0);
