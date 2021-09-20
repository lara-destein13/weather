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

function updateDay(dayNumber, data) {
    console.log(JSON.stringify(Object.keys(data)));
    var date = data.dt_txt.replace(/ .*/, '');
    var icon = 'xxx';
    var temp = data.main.temp;
    var wind = data.wind.speed;
    var humidity = data.main.humidity;
    console.log(`date: ${date}`);
    console.log(`icon: ${icon}`);
    console.log(`temp: ${temp}`);
    console.log(`wind: ${wind}`);
    console.log(`humidity: ${humidity}`);
}

async function getForecast(city, state, id) {
    var url = `http://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=${apiKey}&units=imperial`;
    var response = await fetch(url);
    response = await response.json();
    console.log('forecast:');
    console.log(JSON.stringify(response, null, 4));

    var list = response.list;
    for (var i = 0; i < list.length; i ++) {
        var listItem = list[i];
        var dateTime = listItem.dt_txt;
        if (dateTime.includes('12:00:00')) {
            updateDay(i, listItem);
        }
    }
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