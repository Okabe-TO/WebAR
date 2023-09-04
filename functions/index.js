const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.getPlaces = functions.https.onRequest(async (req, res) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  // Google Places API key
  const apiKey = functions.config().googleplaces.key;

  // Google Places API endpoint
  const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=300&key=${apiKey}`;

  try {
    const apiResponse = await fetch(endpoint);
    const data = await apiResponse.json();

    // Extract only the necessary data
    const places = data.results.map((place) => ({
      name: place.name,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
    }));

    res.status(200).send(places);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error);
  }
});
