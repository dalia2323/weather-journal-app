/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();
// Personal API Key for OpenWeatherMap API

/* Global Variables */
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '44dce7841e81feaac7678e130b79be8e';

// Function to fetch weather data from OpenWeatherMap API
const getWeatherData = async (zip) => {
    const res = await fetch(`${baseURL}${zip}&appid=${apiKey}`);
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("Error fetching weather data:", error);
    }
};

// Function to post data to the server
const postData = async (url = '', data = {}) => {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    try {
        const newData = await res.json();
        return newData;
    } catch (error) {
        console.log("Error posting data:", error);
    }
};

// Function to update the UI
const updateUI = async () => {
    const res = await fetch('/all');
    try {
        const data = await res.json();
        document.getElementById('date').innerHTML = `Date: ${data.date}`;
        document.getElementById('temp').innerHTML = `Temperature: ${data.temperature}°C`;
        document.getElementById('content').innerHTML = `Feeling: ${data.userResponse}`;
    } catch (error) {
        console.log("Error updating UI:", error);
    }
};

// Event listener for the generate button
document.getElementById('generate').addEventListener('click', async () => {
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    const weatherData = await getWeatherData(zip);
    if (weatherData && weatherData.main) {
        const { temp } = weatherData.main;
        const date = new Date().toLocaleDateString();

        await postData('/add', { temperature: temp, date, userResponse: feelings });
        updateUI();
    } else {
        console.log("Invalid zip code or no data available.");
    }
});

