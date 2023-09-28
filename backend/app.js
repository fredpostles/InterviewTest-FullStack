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

// API Endpoint for temperature requests
app.get('/getTemperature', async (req, res) => {
  const cityName = req.query.city;

   // if no cityName received, handle error
   if (!cityName) {
    return res.status(400).json({ error: "City name is required." });
  }

  // get city data from csv file
  const cityEntry = getCityData(cityName);

  // if no matching city, handle error
  if (!cityEntry || cityEntry === "undefined") {
    return res.status(404).json({ error: "City not found." });
}

// if city found
return res.status(200).json({cityEntry})

})

// find city in csv file
const getCityData = (cityName) => {
  const result = cityData.find((entry) => entry.city.toLowerCase() === cityName.toLowerCase());
// console.log("result of getCityData", result);
  return result;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
})