var apiKey = 'b671a94b0a5fb7d77df8e0def5fb933b'

function setInnerHTML(id, value) {
    var element = document.getElementById(id);
    element.innerHTML = value;
}
  
function setOnClick(id, func) {
    var element = document.getElementById(id);
    element.onclick = func;
}

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

async function getForecast(city, state, id) {
    var url = `http://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=${apiKey}&units=imperial`;
    var response = await fetch(url);
    response = await response.json();
    console.log('forecast:');
    console.log(JSON.stringify(response, null, 4));
}
    
async function getCurrentWeather(city, state, id) {
    var url = `http://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}&units=imperial`;
    var response = await fetch(url);
    response = await response.json();
    console.log('current weather:');
    console.log(JSON.stringify(response, null, 4));
}

function searchClicked() {
    var text = document.getElementById('search-input').value;
    for (let i = 0; i < cities.length; i++) {
        var city = cities[i];
        var name = city.name;
        var id = city.id;
        var state = city.state;
        var cityAndState = `${name}, ${state}`;
        if (text === cityAndState) {
            alert('found-it')
            // getCurrentWeather(city, state, id);
            getForecast(city, state, id);
        }
    }
}

function main() {
    createAutoCompleter();
    setOnClick('search-button', searchClicked);
}

main();