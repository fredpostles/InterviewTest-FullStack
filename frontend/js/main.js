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
                    console.log("response.data:", response.data);
                    console.log("response status:", response.status);

                    const data = response.data;

                    if(data.error === "City not found."){
                        output.innerHTML = `<p>Data for ${cityName} is unavailable. Please try another city.</p>`;
                    } else if(response.status === 200){
                        // city found but no temp data available
                        if(data.cityEntry && !data.temperature) {
                            console.log("Temperature data not available for this city. Check spelling or try another city.");
                            output.innerHTML = `<p>Sorry, temperature data is not currently available for ${cityName}. Please try another city.</p>`;
                        } else if(data.temperature) {
                            // temp data found for cityName
                            output.innerHTML = `<p>The current temperature in ${data.cityEntry.city} is ${data.temperature}ºC.</p>`;
                        } else {
                            console.log("City not found - inside 200 status code response");
                            output.innerHTML = `<p>Data for ${cityName} is unavailable. Please try again later.</p>`;
                        }
                    } 
                
                    })
                    .catch((error) => {
                        console.error("Axios error:", error);
                        output.innerHTML = `<p>An error occurred while fetching data for ${cityName}. Please try again later.</p>`;
                    });
            } catch(error) {
                console.log("here");
                console.error("An error occured fetching data:", error);
            }
        } 
    });
});