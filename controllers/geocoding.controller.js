require("dotenv").config();

exports.autocomplete = async (req, res) => {
  const apiKey = process.env.GEOCODER_API_KEY;

  const address = "482 Manning Avenue,Toronto,ON";

  const addressFragment = req.body.addressFragment;

  try {
    console.log("Address Autocomplete has been called");
    console.log("Current text is: " + req.body.address);

    // fetch the addresses from mapquest      console.log("getGeocode has been called.");
    const baseUrl = process.env.ADDRESS_AUTOCOMPLETE_URL;
    console.log(" Base Geocoder URL is: " + baseUrl);

    const queryParams = {
      key: apiKey,
      limit: 5,
      collection: "address",
      q: addressFragment, // Replace with your location
    };

    const queryString = new URLSearchParams(queryParams).toString();

    const url = `${baseUrl}?${queryString}`;
    console.log("Geocoder URL is: " + url);

    const headers = {
      "Content-Type": "application/json",
    };

    const requestOptions = {
      headers,
    };

    let potentialMatches = [];

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      potentialMatches = data.results.slice(0, 3);
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
