// Global Variables
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = 'ca1d7f1373a5f74197980b585f9eda3c'; 
const apiUrl = "http://localhost:3000/";

const zipCodeElement = document.getElementById('zip');
const feelingsElement = document.getElementById('feelings');
const dateElement = document.getElementById('date');
const tempElement = document.getElementById('temp');
const contentElement = document.getElementById('content');
const catchError = (error) => console.error('Error:', error);

// Event listener for the generate button
document.getElementById('generate').addEventListener('click', onGenerate);

function onGenerate() {
    const zipCode = zipCodeElement.value;
    const content = feelingsElement.value;

    if (!zipCode || !content) {
        return alert('Please enter both zip code and your feelings!');
    }

    const data = {
        zipCode,
        content,
        date: new Date().toLocaleString(),
    };

    // Fetch weather data and update UI
    getZipCodeInformation(zipCode)
        .then((zipInfo) => {
            if (zipInfo.cod != 200) {
                return alert(zipInfo.message);
            }

            data.temp = zipInfo.main.temp;
            return postDataToServer(data);
        })
        .then(updateUI)
        .catch(catchError);
}

async function getZipCodeInformation(zipCode) {
    const response = await fetch(`${baseURL}${zipCode}&appid=${apiKey}`);
    return await response.json();
}

async function postDataToServer(data) {
    const response = await fetch(`${apiUrl}add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to post data to server');
    }

    return await response.json();
}

async function updateUI() {
    const response = await fetch(`${apiUrl}data`);

    if (!response.ok) {
        throw new Error('Failed to fetch data from server');
    }

    const data = await response.json();
    dateElement.innerHTML = `Date: ${data.date}`;
    tempElement.innerHTML = `Temperature: ${data.temperature}`;
    contentElement.innerHTML = `Feelings: ${data.userResponse}`;
}
