const express = require('express');
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// CORS middleware
app.use(cors());

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

// GET Endpoint for temperature data
app.get('/getTemperature', async (req, res) => {
  const cityName = req.query.city;
  console.log("cityName in backend:", cityName);

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

// if city && temp data found
return res.status(200).json({cityEntry, temperature: currentTemperature});
});

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

 const {data} = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m`)
  
 console.log("temperature data:", data);
return data;
}


const findCurrentTemperature = (temperatureData) => {
// Get the current time
const currentTime = new Date();

// Find the closest timestamp
const timestamps = temperatureData.hourly.time;
let closestTimestamp = timestamps[0]; // Initialize with the first timestamp
let closestTimeDifference = Math.abs(new Date(closestTimestamp) - currentTime);

for (const timestamp of timestamps) {
  const timeDifference = Math.abs(new Date(timestamp) - currentTime);
  if (timeDifference < closestTimeDifference) {
      closestTimestamp = timestamp;
      closestTimeDifference = timeDifference;
  }
}

// Find the temperature for the closest timestamp
const hourlyTempData = temperatureData.hourly.temperature_2m;
const indexOfClosestTimestamp = timestamps.indexOf(closestTimestamp);
const closestTemperature = hourlyTempData[indexOfClosestTimestamp];


return closestTemperature;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
})