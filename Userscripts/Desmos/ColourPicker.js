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

If having trouble getting it to load correctly, try changing the `0` at the bottom of the script to something else like `300`
*/

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

    function rgbaify(rgb,a) {
        if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return "rgba("+rgb[1]+','+rgb[2]+','+rgb[3]+','+Number(a)/100+')';
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

    var gp = document.getElementById('picker')
    var tr = "100";

    zNode = document.createElement ('span');
    zNode.setAttribute ('id', 'cstore');
    zNode.setAttribute ('role', 'button');
    zNode.setAttribute ('class', "dcg-btn-green");
    zNode.innerHTML = "<div style = \"font-size: 85%; position: relative; left:-40%; top:-30%\">Save</div>";
    zNode.setAttribute ('style',"position: relative; width:11.25%; left:2.5%; top:-22.5%; height:22.5%");
    x = document.getElementsByClassName("align-center-container");
    for (i = 0; i < x.length; i++) {
        x[i].appendChild(zNode);
        break;
    }

    zNode = document.createElement('input');
    zNode.setAttribute ('id', 'ctrans');
    zNode.type = 'range';
    zNode.min = 0;
    zNode.max = 100;
    zNode.value = 100;
    zNode.step = 1;
    zNode.setAttribute ('style',"position: relative; width:15%; left:55%; top:-58.5%; height:22.5%");
    zNode.oninput = function () {
        tr = this.value;
    }
    x = document.getElementsByClassName("align-center-container");
    for (i = 0; i < x.length; i++) {
        x[i].appendChild(zNode);
        break;
    }

    document.getElementById('cstore').addEventListener("click", makeColour, false);
    function makeColour(zEvent){
        if (gp.style.backgroundColor) {
            var col = tr+rgb2hex(gp.style.backgroundColor);
            var acol = rgbaify(gp.style.backgroundColor,tr);
            for (var c in unsafeWindow.Calc.colors) {
                if (unsafeWindow.Calc.colors[c] == acol) {
                    return;
                }
            }
            unsafeWindow.Calc.colors[col] = acol;
        }
    }
}, 0);
