// ==UserScript==
// @name         Desmos Colour Picker
// @namespace    http://tampermonkey.net/
// @match        *://www.desmos.com/calculator*
// @require      https://raw.githubusercontent.com/EastDesire/jscolor/master/jscolor.js
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
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
- Move the slider on the right of the save button to change the transparency.
- Click the save button to the right of the box to save the colour
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

    var target = document.getElementsByClassName("dcg-header-desktop")[0];
    var hold = document.createElement ('span');
    target.insertBefore(hold, target.childNodes[2])

    var zNode = document.createElement ('input');
    zNode.setAttribute ('id', 'picker');
    zNode.setAttribute('value',"ffffff");
    zNode.jscolor = new jscolor(zNode);
    console.log(zNode.jscolor);
    zNode.style.width = '25%';
    zNode.style.height = '45%';
    hold.appendChild(zNode);

    var gp = document.getElementById('picker')
    var tr = "100";

    zNode = document.createElement ('span');
    zNode.setAttribute ('id', 'cstore');
    zNode.setAttribute ('role', 'button');
    zNode.setAttribute ('class', "dcg-btn-green");
    zNode.innerHTML = "<div style = \"font-size: 85%; position: relative; left:-180%; top:-20%\">Save</div>";
    zNode.setAttribute ('style',"position: relative; width:11.25%; left:2.5%; top:10%; height:50%");
    hold.appendChild(zNode);

    zNode = document.createElement('input');
    zNode.setAttribute ('id', 'ctrans');
    zNode.type = 'range';
    zNode.min = 0;
    zNode.max = 100;
    zNode.value = 100;
    zNode.step = 1;
    zNode.setAttribute ('style',"position: relative; width:15%; left:5%; top:5%; height:22.5%");
    zNode.oninput = function () {
        tr = this.value;
    }
    hold.appendChild(zNode);

    document.getElementById('cstore').addEventListener("click", makeColour, false);
    function makeColour(zEvent){
        var gcol = gp.jscolor.toRGBString();
        if (gcol) {
            var col = tr+rgb2hex(gcol);
            var acol = rgbaify(gcol,tr);
            for (var c in unsafeWindow.Calc.colors) {
                if (unsafeWindow.Calc.colors[c] == acol) {
                    return;
                }
            }
            unsafeWindow.Calc.colors[col] = acol;
        }
    }

}, 0);
