document.addEventListener("DOMContentLoaded", () => {
    // get DOM references
    const cityInput = document.getElementById("cityInput");
    const searchButton = document.getElementById("searchBtn");
    const output = document.getElementById("weatherData__container");

    searchButton.addEventListener("click", () => {
        // get city name from input
        const cityName = cityInput.value.trim();

        // if cityname blank, display error message, otherwise fetch data
        if(!cityName || cityName === ""){
            output.innerHTML = `<p>Please enter a city name.</p>`
        } else {
            try {
                axios.get(`http://localhost:3000/getTemperature?city=${cityName}`)
                .then((response)=> {
                    console.log("response:", response)
                    const data = response.data;
                    console.log("data:", data)
                     if (data.temperature) {
                        output.innerHTML = `<p>The current temperature in ${cityName} is ${data?.temperature}.</p>`
                    } else {
                        console.log("no temp data")
                        output.innerHTML = `<p>The current temperature in ${data.cityEntry.city} is unavailable. Please try again later.</p>`
                        return;
                    }
                });
            } catch(error) {
                console.error("An error occured fetching data:", error);
            }
            output.innerHTML = `<p>Sorry, that city was not found. Please try another</p>`

        }
    });
});