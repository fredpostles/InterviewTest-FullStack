const axios = require("axios");
const fs = require("fs");
const csv = require("csv-parser");

// Read the CSV file into memory using csv-parser package
const cityData = [];
fs.createReadStream("../data/gb.csv")
    .pipe(csv())
    .on("error", (error) => {
      console.error("Error while processing CSV:", error);
  })
    .on("data", (row) => {
        cityData.push(row);
    })
    .on("end", () => {
        console.log("CSV file successfully processed.");
    });

// Controller function to get temperature data
const getTemperature = async (req, res) => {
  const cityName = req.query.city;

   // if no cityName received, handle error
   if (!cityName) {
    return res.status(400).json({ error: "City name is required." });
  }

  // get city data from csv file
  const cityEntry = getCityData(cityName);

  // if no matching city, handle error
  if (!cityEntry || cityEntry === "undefined") {
    console.log("City not found in CSV file in backend.");
    return res.status(404).json({ error: "City not found." });
}

  // otherwise, get temperature data for that city
  const temperatureData = await fetchTemperatureData(cityEntry);

  // process temp data and find closest temp to current time
  const currentTemperature = findCurrentTemperature(temperatureData);

// if temperature data found, return it with city info
  return res.status(200).json({cityEntry, temperature: currentTemperature});
};

// find city in csv file
const getCityData = (cityName) => {
  const result = cityData.find((entry) => entry.city.toLowerCase() === cityName.toLowerCase());
// console.log("result of getCityData", result);
  return result;
}

// fetch temperature data from Open Meteo
const fetchTemperatureData = async (cityEntry) => {
 // grab lat and long from city data
 const lat = cityEntry.lat;
 const long = cityEntry.lng;

 // fetch data from Open Meteo using lat & long
 const {data} = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m`)
  
// return the temperature data
return data;
}


const findCurrentTemperature = (temperatureData) => {
// Get the current time
const currentTime = new Date();

// Find the closest timestamp
const timestamps = temperatureData.hourly.time;
// Initialize with the first timestamp
let closestTimestamp = timestamps[0]; 
let closestTimeDifference = Math.abs(new Date(closestTimestamp) - currentTime);

// loop through timestamps to find closest to current time
for (const timestamp of timestamps) {
  // store the time difference while looping
  const timeDifference = Math.abs(new Date(timestamp) - currentTime);
  if (timeDifference < closestTimeDifference) {
      closestTimestamp = timestamp;
      closestTimeDifference = timeDifference;
  }
}

// Find the temperature for the closest timestamp
const hourlyTempData = temperatureData.hourly.temperature_2m; // array of hourly data
const indexOfClosestTimestamp = timestamps.indexOf(closestTimestamp); // get closest time
const closestTemperature = hourlyTempData[indexOfClosestTimestamp]; // get hourly data for current hour

return closestTemperature;
}

module.exports = {getTemperature};