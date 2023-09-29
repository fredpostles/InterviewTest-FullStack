document.addEventListener("DOMContentLoaded", () => {
    // get DOM references
    const cityInput = document.getElementById("cityInput");
    const searchButton = document.getElementById("searchBtn");
    const output = document.getElementById("weatherData__container");

    searchButton.addEventListener("click", () => {
        // get city name from input
        const cityName = cityInput.value.trim();

        // if cityName is null or blank, display error message
        // otherwise fetch data
        if(!cityName || cityName === ""){
            output.innerHTML = `<p>Please enter a city name.</p>`;
        } else {
            try {
                axios.get(`http://localhost:3000/getTemperature?city=${cityName}`)
                .then((response)=> {
                    const data = response.data;
                    if(response.status === 200){
                        // temp data found for cityName
                        output.innerHTML = `<p>The current temperature in ${data.cityEntry.city} is ${data.temperature}ºC.</p>`;
                    }
                })
                .catch((error) => {
                    if (error.response){
                        // request made but server responded with non-2xx status code
                        if (error.response.status === 404){
                            // log the error from the server
                            console.error(error.response.data.error);
                            // handle "city not found" error in UI
                            output.innerHTML = `<p>Data for ${cityName} is unavailable. Please try another city.</p>`;
                        } else {
                            // any other HTTP status code errors
                            // log error message
                            console.error("Error status:", error.reponse.status);
                            console.error("Error message:", error.message);
                            output.innerHTML = `<p>An error occurred while fetching data for ${cityName}. Please try again later.</p>`;
                        }
                    } else if (error.request){
                        // request was made but no response received (e.g. network error)
                        console.error("Network error:", error.request);
                        output.innerHTML = `<p>A network error occurred. Please check your internet connection.</p>`
                    } else {
                        // some other error occurred while setting up the request
                        console.error("Request error:", error.message);
                        output.innerHTML = `<p>An error occurred. Please try again later.</p>`;
                    }
                });
            } catch(error) {
                console.error("An error occured fetching data:", error);
            }
        } 
    });
});