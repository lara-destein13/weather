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
    var icon = 'icon';
    var temp = data.main.temp;
    var wind = data.wind.speed;
    var humidity = data.main.humidity;

    console.log(`date: ${date}`);
    console.log(`icon: ${icon}`);
    console.log(`temp: ${temp}`);
    console.log(`wind: ${wind}`);
    console.log(`humidity: ${humidity}`);

    var dateId = `day-${dayNumber}-date`
    var iconId = `day-${dayNumber}-icon`
    var tempId = `day-${dayNumber}-temp`
    var windId = `day-${dayNumber}-wind`
    var humidityId = `day-${dayNumber}-humidity`

    console.log(`dateId: ${dateId}`);
    console.log(`iconId: ${iconId}`);
    console.log(`tempId: ${tempId}`);
    console.log(`windId: ${windId}`);
    console.log(`humidityId: ${humidityId}`);
   
    setInnerHTML(dateId, date);
    setInnerHTML(iconId, icon);
    setInnerHTML(tempId, temp);
    setInnerHTML(windId, wind);
    setInnerHTML(humidityId, humidity);
}

async function getForecast(city, state, id) {
    var url = `http://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=${apiKey}&units=imperial`;
    var response = await fetch(url);
    response = await response.json();

    var list = response.list;
    var dayNumber = 0;
    for (var i = 0; i < list.length; i ++) {
        var listItem = list[i];
        var dateTime = listItem.dt_txt;
        if (dateTime.includes('12:00:00')) {
            updateDay(dayNumber, listItem);
            dayNumber += 1;
        }
    }
}

async function getCurrentWeather(city, state, id) {
    var url = `http://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}&units=imperial`;
    var response = await fetch(url);
    response = await response.json();
    console.log('current weather:');
    console.log(JSON.stringify(response, null, 4));

    var temp = response.main.temp;
    var wind = response.wind.speed;
    var humidity = response.main.humidity;
    var uv = 'uv';

    setInnerHTML('city', `${city}, ${state}`);
    setInnerHTML('temp', temp);
    setInnerHTML('wind', wind);
    setInnerHTML('humidity', humidity);
    setInnerHTML('uv', uv);
}

function updateButtons(cityAndState) {
    var cities = localStorage.getItem('cities')

    if (cities != null) {
        cities = JSON.parse(cities);
    } else {
        cities = [];
    }

    for (var i = 0; i < cities.length; i++) {
        if (cities[i] === cityAndState) {
            cities.splice(i, 1);
        }
    }

    cities.unshift(cityAndState);

    while (cities.length < 5) {
        cities.push('&nbsp;');
    }

    while (cities.length > 5) {
        cities.pop();
    }

    for (var i = 0; i < 5; i++) {
        var id = `button${i}`;
        setInnerHTML(id, cities[i]);
    }

    cities = JSON.stringify(cities);
    console.log(cities);

    localStorage.setItem('cities', cities);
}



function showWeatherForCity(selectedCityAndState) {
    updateButtons(selectedCityAndState);
    for (let i = 0; i < cities.length; i++) {
        var city = cities[i];
        var name = city.name;
        var id = city.id;
        var state = city.state;
        var cityAndState = `${name}, ${state}`;
        if (selectedCityAndState === cityAndState) {
            getCurrentWeather(name, state, id);
            getForecast(name, state, id);
        }
    }
}

function searchClicked() {
    var cityAndState = document.getElementById('search-input').value;
    showWeatherForCity(cityAndState);
}

function main() {
    createAutoCompleter();
    setOnClick('search-button', searchClicked);
    showWeatherForCity('Nashville, TN');
}

function buttonClicked(number) {
    var cities = localStorage.getItem('cities')
    cities = JSON.parse(cities);
    cityAndState = cities[number];
    showWeatherForCity(cityAndState);
}

function button0() {
    buttonClicked(0);
}

function button1() {
    buttonClicked(1);
}

function button2() {
    buttonClicked(2);
}

function button3() {
    buttonClicked(3);
}

function button4() {
    buttonClicked(4);
}

function main() {
    createAutoCompleter();
    setOnClick('search-button', searchClicked);
    setOnClick('button0', button0);
    setOnClick('button1', button1);
    setOnClick('button2', button2);
    setOnClick('button3', button3);
    setOnClick('button4', button4);
    showWeatherForCity('Nashville, TN');
}

main();