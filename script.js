var apiKey = 'b671a94b0a5fb7d77df8e0def5fb933b'

// A simple utility function that finds a DOM element with id 'id', 
// and sets its innerHTML to the value in 'value';
function setInnerHTML(id, value) {
    var element = document.getElementById(id);
    element.innerHTML = value;
}

// A simple utility function that finds a DOM element with id 'id', 
// and assigns the click handler function 'func'.
function setOnClick(id, func) {
    var element = document.getElementById(id);
    element.onclick = func;
}

// Configure the JQuery UI Autocompleter. First create an array of 
// strings for the form 'City, ST'. Then tell JQuery to attach its 
// autocompleter functionality to our city search input element. 
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

// I have five days in my HTML. This function populates the five 
// field in one day (identified by dayNumber) with data returned from 
// the OpenWeather APIs.
function updateDay(dayNumber, data) {
    var date = data.dt_txt.replace(/ .*/, '');
    var icon = 'icon';
    var temp = data.main.temp;
    var wind = data.wind.speed;
    var humidity = data.main.humidity;

    var dateId = `day-${dayNumber}-date`
    var iconId = `day-${dayNumber}-icon`
    var tempId = `day-${dayNumber}-temp`
    var windId = `day-${dayNumber}-wind`
    var humidityId = `day-${dayNumber}-humidity`

    setInnerHTML(dateId, date);
    setInnerHTML(iconId, icon);
    setInnerHTML(tempId, `Temp: ${temp} F`);
    setInnerHTML(windId, `Wind: ${wind} MPH`);
    setInnerHTML(humidityId, `Humidity: ${humidity} %`);
}

// I have one div in my HTML that contains the curent weather date. This function
// makes an API call to the OpenWeather web service. The function then populates the 
// five fields in the current weather div with data returned from the OpenWeather
// API. Note that this function is diclared as 'async' so that I can use 'await' to
// stop and wait for the response to our API call. 
async function getCurrentWeather(city, state, id) {
    var url = `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}&units=imperial`;
    var response = await fetch(url);
    response = await response.json();
    console.log('current weather:');
    console.log(JSON.stringify(response, null, 4));

    var temp = response.main.temp;
    var wind = response.wind.speed;
    var humidity = response.main.humidity;
    var uv = 'uv';

    setInnerHTML('city', `${city}, ${state}`);
    setInnerHTML('temp', `Temp: ${temp} F`);
    setInnerHTML('wind', `Wind: ${wind} MPH`);
    setInnerHTML('humidity', `Humidity: ${humidity} %`);
    setInnerHTML('uv', `UV Index: ___`);
}

// This function makes an APU call to the OpenWeather web service. Note that this 
// function is declared as 'async' so that I can use 'await' to stop and wait for
// the response to our API call. 
async function getForecast(city, state, id) {
    var url = `https://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=${apiKey}&units=imperial`;
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

// This function is called when the user clicks the city 'search' button, or when
// the user clicks on one of the five city buttons. It manages our list of the five 
// most recently queried cities. I store that list in localStorage. I'm careful to make 
// sure that my list always contains five cities or the non-breaking space character 
// (&nbsp;). Note that before adding a new city to our list, I remove it from the list if 
// its already there. Once I have updated the list, I update the innerHTML of the five 
// city buttons. 
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


// This function is called when the user selects a city wither using the input
// element or one of the city buttons. It is passed a string of the form 
// 'City, ST'. It needs to find the corresponding city object in our cities 
// array so that I can know the ID for the selected city. Then it passes that
// ID to the functions that make the API calls to OpenWeather.
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

// This is the click handler function for our 'Search' button. It gets the city
// and state from the input field, and calls a function to get data for that
// city and state and update the DOM accordingly.
function searchClicked() {
    var cityAndState = document.getElementById('search-input').value;
    showWeatherForCity(cityAndState);
}

// function main() {
//     createAutoCompleter();
//     setOnClick('search-button', searchClicked);
//     showWeatherForCity('Nashville, TN');
// }

// This function is called when the user clicks on one of the five city buttons. 
// It gets the list of five 'City, ST' strings from local storage and calls a 
// function to get data for that city and state and update the DOM accordingly.
function buttonClicked(number) {
    var cities = localStorage.getItem('cities')
    cities = JSON.parse(cities);
    cityAndState = cities[number];
    showWeatherForCity(cityAndState);
}

// These are the click hanlers for the five city buttons. 
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
    // Initialize the JQuery autocompleter
    createAutoCompleter();

    // Attach some button click handler functions
    setOnClick('search-button', searchClicked);
    setOnClick('button0', button0);
    setOnClick('button1', button1);
    setOnClick('button2', button2);
    setOnClick('button3', button3);
    setOnClick('button4', button4);

    // Show Nashville weather to start with.
    showWeatherForCity('Nashville, TN');
}

main();