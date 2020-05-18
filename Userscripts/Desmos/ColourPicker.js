// ==UserScript==
// @name         Desmos Colour Picker
// @namespace    http://tampermonkey.net/
// @match        *://www.desmos.com/calculator*
// @require      https://raw.githubusercontent.com/EastDesire/jscolor/master/jscolor.js
// ==/UserScript==

/*
How to use:
- Use chrome or firefox
- Install Tampermonkey
- Install the script
- Load desmos
- Reload until there's a box at the top that displays `FFFFFF
(if it displays `ffffff` it's broken)
- Click the box at the top to open the picker
- Move around and click to select colours
- Type/backspace and enter to change the colour directly
- Click the save box to the right to save the colour
- Saved colours appear when you press the cog icon at the top of expressions list and click the coloured circle for a given expression

When you save a desmos graph using custom colours the colours on the expressions will save!
(but they will need to be added to the colours list if you want to use them for new expressions after reloading)

The script also adds some special colours when loaded, if you don't want these, remove the lines from the script.

If having trouble getting it to load correctly, try changing the `0` at the bottom of the script to something else like `300`
*/

setTimeout(function() {
    'use strict';

    unsafeWindow.Calc.colors.SILVER = "#7f7f7f";
    unsafeWindow.Calc.colors.CLEAR = "rgba(0,0,0,0)";
    unsafeWindow.Calc.colors.COPY = "linear-gradient(rgba(0,0,0,0),currentcolor)";

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
    zNode.setAttribute ('class', "jscolor {mode:\"HVS\"}");
    zNode.setAttribute('value',"ffffff")
    zNode.setAttribute ('style',"position: relative; text-align: center; width:50%; top:-29.5%; height:30%; border:1px solid black");
    var x = document.getElementsByClassName("align-center-container");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].appendChild(zNode);
        break;
    }
    zNode = document.createElement ('span');
    zNode.setAttribute ('id', 'cstore');
    zNode.setAttribute ('role', 'button');
    zNode.setAttribute ('class', "dcg-btn-green");
    zNode.innerHTML = "<div style = \"font-size: 85%; position: relative; left:-40%; top:-30%\">Save</div>";
    zNode.setAttribute ('style',"position: relative; width:15%; left:55%; top:-58.5%; height:22.5%");
    x = document.getElementsByClassName("align-center-container");
    for (i = 0; i < x.length; i++) {
        x[i].appendChild(zNode);
        break;
    }
    var gp = document.getElementById('picker')
    document.getElementById('cstore').addEventListener("click", makeColour, false);
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
