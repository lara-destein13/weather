function setInnerHTML(id, value) {
    var element = document.getElementById(id);
    element.innerHTML = value;
}
  
function setOnClick(id, func) {
    var element = document.getElementById(id);
    element.onclick = func;
}
  
var apiKey = 'b671a94b0a5fb7d77df8e0def5fb933b';

function createAutoCompleter() {
    var cityAndStateArray = [];
    for (var i = 0; i < cities.length; i += 1) {
        var city = cities[i];
        var name = city.name;
        var state = city.state;
        var cityAndState = `${name}, ${state}`;
        cityAndStateArray.push(cityAndState);
    }

    var options = {
        source: cityAndStateArray,
    };

    $('#search-input').autocomplete(options);
}



function searchClicked() {
    var text = document.getElementById('search-input').value;
    for (let i = 0; i < cities.length; i++) {
        var city = cities[i];
        var name = city.name;
        var state = city.state;
        var cityAndState = `${name}, ${state}`;
        console.log(cityAndState);
        if (text === cityAndState) {
            alert('found-it');
        }
    }
}

function main() {
    setOnClick('search-button', searchClicked);
    //createAutoCompleter();
}

main();