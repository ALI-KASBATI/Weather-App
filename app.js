class WeatherApp {
    constructor() {
        this.access = document.getElementById('access');
        this.allDetails = null;
        this.city = null;
        this.icon = null;
    }

    getLocation() {
        if (navigator.geolocation) {
            this.access.innerHTML = "Allow to detect your location";
            navigator.geolocation.getCurrentPosition(this.onSuccess.bind(this), this.onError.bind(this));
        } else {
            this.access.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    onSuccess(position) {
        this.access.innerHTML = "Detecting your location...";
        let { latitude, longitude } = position.coords;

        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=e228ae2eaf8f4751afb78f864bdf52ea`)
            .then(response => response.json())
            .then(result => {
                this.allDetails = result.results[0].components;
                console.table(this.allDetails);
                this.city = this.allDetails.city;
                this.access.innerHTML = "";
                this.fetchWeather();
            });
    }

    onError(error) {
        console.log(error);
        if (error.code == 1) {
            this.access.innerHTML = "User denied the request for Geolocation.";
        } else if (error.code == 2) {
            this.access.innerHTML = "Location information is unavailable.";
        } else if (error.code == 3) {
            this.access.innerHTML = "Something went wrong.";
        }
    }

    fetchWeatherByCity(city) {
        axios.get(`https://api.weatherapi.com/v1/current.json?key=92203d8e3c314335b7462722223006&q=${city}`)
            .then(response => {
                console.log(response.data);
                this.updateWeatherDOM(response.data);
            })
            .catch(error => {
                console.error("Error fetching weather:", error);
                this.access.innerHTML = "Error fetching weather data.";
            });
    }

    fetchWeather() {
        if (this.city) {
            this.fetchWeatherByCity(this.city);
        } else {
            this.access.innerHTML = "City information not available.";
        }
    }

    updateWeatherDOM(data) {
        this.icon = data.current.condition.icon;
        this.icon.replace("/file// ");
        document.getElementById('icon').src = this.icon;
        document.getElementById('real-title').innerHTML = 'Real Feel';
        document.getElementById('humidity-title').innerHTML = 'Humidity';
        document.getElementById('visibility-title').innerHTML = 'Visibility';
        document.getElementById('wind-title').innerHTML = `${data.current.wind_dir} Wind`;
        document.getElementById('city').innerHTML = `<i id="city_location" class="fa-solid fa-location-dot"></i>${data.location.name}`;
        document.getElementById('temp-f').innerHTML = data.current.temp_c + "°C";
        document.getElementById('condition').innerHTML = data.current.condition.text;
        document.getElementById('feel').innerHTML = data.current.feelslike_c + '°C';
        document.getElementById('wind').innerHTML = data.current.wind_kph + " km/h";
        document.getElementById('humidity').innerHTML = data.current.humidity + "%";
        document.getElementById('visibility').innerHTML = data.current.vis_km + " km";
        this.access.innerHTML = "";
    }
}

// Usage
const weatherApp = new WeatherApp();
window.onload = function() {
    weatherApp.getLocation();
};

function getWeather() {
    let input_city = document.getElementById('input_city').value;
    weatherApp.fetchWeatherByCity(input_city);
}
