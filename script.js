var apiKey = 'b671a94b0a5fb7d77df8e0def5fb933b';
var localStorageKey = 'cities-4';
    
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
    var options = [];
    for (var i = 0; i < cities.length; i += 1) {
        var city = cities[i];
        var name = city.name;
        var state = city.state;
        var cityAndState = `${name}, ${state}`;
        options.push(cityAndState);
    }

    $('#search-input').autocomplete({ source: options });
}

// This function is called when the user clicks the city 'search' button, or when
// the user clicks on one of the five city buttons. It manages our list of the five 
// most recently queried cities. I store that list in localStorage. I'm careful to make 
// sure that my list always contains five cities or the non-breaking space character 
// (&nbsp;). Note that before adding a new city to our list, I remove it from the list if 
// its already there. Once I have updated the list, I update the innerHTML of the five 
// city buttons. 
function updateButtons(cityAndState) {
    // Get the list of five cities from localStorage.  If there are no cities in
    // local storage, create a list of five empty strings.

    var cities = localStorage.getItem(localStorageKey)
    if (cities != null) {
        cities = JSON.parse(cities);
    } else {
        cities = ['&nbsp', '&nbsp', '&nbsp', '&nbsp', '&nbsp' ];
    }

    // If the selected city is one of the five from local storage, remove it.

    for (var i = 0; i < cities.length; i++) {
        if (cities[i] === cityAndState) {
            cities.splice(i, 1);
            cities.push('&nbsp');
        }
    }

    cities.unshift(cityAndState);
    cities.pop();

    for (var i = 0; i < 5; i++) {
        var id = `button${i}`;
        setInnerHTML(id, cities[i]);
    }

    cities = JSON.stringify(cities);
    localStorage.setItem(localStorageKey, cities);
}

// This function updates the innerHTML in the current weather div.
function setCurrentWeather(city, state, weather) {
    var temp = weather.temp;
    var wind = weather.wind_speed;
    var humidity = weather.humidity;
    var uvi = weather.uvi;
    
    setInnerHTML('city', `${city}, ${state}`);
    setInnerHTML('temp', `Temp: ${temp} F`);
    setInnerHTML('wind', `Wind: ${wind} MPH`);
    setInnerHTML('humidity', `Humidity: ${humidity} %`);
    setInnerHTML('uv', `UV Index: ${uvi}`);
}

// The HTMl has five 'day' divs.  This function is called to update
// the InnerHTML in one of those divs.  The function is passed the
// day number (0 to 4), and the weather for that day.
function setDailyWeather(dayNumber, weather) {
    var date = new Date(weather.dt * 1000);
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var day = days[date.getDay()];
    
    var icon = 'icon';
    var temp = weather.temp.day;
    var wind = weather.wind_speed;
    var humidity = weather.humidity;

    var dateId = `day-${dayNumber}-date`
    var iconId = `day-${dayNumber}-icon`
    var tempId = `day-${dayNumber}-temp`
    var windId = `day-${dayNumber}-wind`
    var humidityId = `day-${dayNumber}-humidity`

    setInnerHTML(dateId, day);
    setInnerHTML(iconId, icon);
    setInnerHTML(tempId, `Temp: ${temp} F`);
    setInnerHTML(windId, `Wind: ${wind} MPH`);
    setInnerHTML(humidityId, `Humidity: ${humidity} %`);
}

// Make an API call to the OpenWeather OneCall service.  Note that this
// function is declared as 'async.'  This way I can use 'await' to stop
// and wait for the API call to complete.  When I get the response, I
// extract the current weather and forecast from the response.
async function getWeather(name, state, id, lat, lon) {
    var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`;
    var response = await fetch(url);
    response = await response.json();
    setCurrentWeather(name, state, response.current);
    for (var i = 0; i < 5; i ++) {
        setDailyWeather(i, response.daily[i]);
    }
}

// This function is called when the user selects a city wither using the input
// element or one of the city buttons. It is passed a string of the form 
// 'City, ST'. It needs to find the corresponding city object in our cities 
// array so that I can know the ID for the selected city. Then it passes that
// ID to the functions that make the API calls to OpenWeather.
function showWeatherForCity(selectedCityAndState) {
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];
        var id = city.id;
        var lat = city.coord.lat;
        var lon = city.coord.lon;
        var name = city.name;
        var state = city.state;
        var cityAndState = `${name}, ${state}`;
        if (selectedCityAndState === cityAndState) {
            getWeather(name, state, id, lat, lon);
            updateButtons(selectedCityAndState);
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

// This function is called when the user clicks on one of the five city buttons. 
// It gets the list of five 'City, ST' strings from local storage and calls a 
// function to get data for that city and state and update the DOM accordingly.
function buttonClicked(number) {
    var cities = localStorage.getItem(localStorageKey)
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
