const express = require('express');
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// CORS middleware
app.use(cors());

// routes
const temperatureRoutes = require("./routes/temperature");
app.use("/", temperatureRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
})