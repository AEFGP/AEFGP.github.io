var state = false;

function toggleHelp() {
    var elem = document.getElementById("helpmsg");
    console.log(state)
    if (!state) {
        elem.style.setProperty('display', 'inline');

    } else {
        elem.style.setProperty('display', 'none');

    }
    state = !state;
}


//toggle();