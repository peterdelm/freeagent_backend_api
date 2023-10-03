require("dotenv").config();
const axios = require('axios');

exports.autocomplete = async (req, res) => {
  const apiKey = process.env.GEOCODER_API_KEY;
  console.log("Current text is: " + req.body.addressFragment);

  try {
    console.log("Address Autocomplete has been called");

    // fetch the addresses from mapquest      console.log("getGeocode has been called.");
    const baseUrl = process.env.ADDRESS_AUTOCOMPLETE_URL;
    console.log(" Base Geocoder URL is: " + baseUrl);

    const queryParams = {
      key: apiKey,
      limit: 5,
      collection: "address",
      q: req.body.addressFragment, // Replace with your location
    };
    const url = `${baseUrl}?${new URLSearchParams(queryParams)}`;
    console.log("Geocoder URL is: " + url);

    const headers = {
      "Content-Type": "application/json",
    };

    const requestOptions = {
      headers,
    };


    const response = await axios.get(url, { headers });


 
    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = response.data;
console.log("Data is: " + data.results[0].displayString)
    let potentialMatches = [];
  if (data.results && data.results.length > 0) {
      potentialMatches = data.results.map((result) => result.displayString);
    }

    const responseData = {
      success: true,
      addressList: potentialMatches,
      message: "These are potential addresses",
    };

    console.log(potentialMatches);

    res.status(200).json(responseData);
  } catch (err) {
    // Handle any errors that occur during the asynchronous operation
    console.error(err);
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
};
