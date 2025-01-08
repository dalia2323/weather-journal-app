/* Global Variables */
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'ca1d7f1373a5f74197980b585f9eda3c'; 

// Create a new date instance dynamically with JS
let newDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
});

const userInfo = document.getElementById('userInfo');

// Event listener to add function to existing HTML DOM element
const generateBtn = document.getElementById('generate');
generateBtn.addEventListener('click', onGenerate);

/* Function called by event listener */
function onGenerate(e) {
    e.preventDefault();

    //get user input
    const zipCode = document.getElementById('zip').value;
    const content = document.getElementById('feelings').value;
    if (zipCode !== '') {
        generateBtn.classList.remove('invalid');
        getWeatherData(baseUrl, zipCode, apiKey)
            .then(function(data) {
                // add data to POST request
                postData('/add', { temp: convertKelvinToCelsius(data.main.temp), date: newDate, content: content });
            }).then(function() {
                // call updateUI to update browser content
                updateUI()
            }).catch(function(error) {
                console.log(error);
                alert('The zip code is invalid. Try again');

            });
        userInfo.reset();
    } else {
        generateBtn.classList.add('invalid');
    }


}

/* Function to GET Web API Data*/
const getWeatherData = async(baseUrl, zipCode, apiKey) => {
    // res equals to the result of fetch function
    const res = await fetch(`${baseUrl}?q=${zipCode}&appid=${apiKey}`);
    try {
        // data equals to the result of fetch function
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
};

/* Function to POST data */
const postData = async(url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            temp: data.temp,
            date: data.date,
            content: data.content
        })
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log(error);
    }
};

const updateUI = async() => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        console.log(allData);
        // update new entry values
        if (allData.date !== undefined && allData.temp !== undefined && allData.content !== undefined) {
            document.getElementById('date').innerHTML =`Date:${allData.date}`;
            document.getElementById('temp').innerHTML = `Temperature: ${allData.temp } degree C`;
            document.getElementById('content').innerHTML = `Feelings: ${allData.content}`;
        }
    } catch (error) {
        console.log('error', error);
    }
};

// helper function to convert temperature from Kelvin to Celsius
function convertKelvinToCelsius(kelvin) {
    if (kelvin < (0)) {
        return 'below absolute zero (0 K)';
    } else {
        return (kelvin - 273.15).toFixed(2);
    }
}