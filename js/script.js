// getting places from APIs
async function loadPlaces(position) {
	const params = {
		radius: 300,  // search places not farther than this value (in meters)
		clientId: 'ZDOZ0F0ISA02MVY51S020IVXIPJH4UMPF0TBSZHXKQSEEVTB',
		clientSecret: 'LUKLF4QUWOVWUBCMF3WVGKTKTAHJ3K0XSXQSP5NXQX4LYIRR',
		version: '20230827',  // Update this to the latest version
	};

	// Update the endpoint URL according to the latest API version
	const corsProxy = 'https://cors-anywhere.herokuapp.com/';
	const endpoint = `${corsProxy}https://api.foursquare.com/v3/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=30
        &v=${params.version}`;

	try {
		const res = await fetch(endpoint);
		if (!res.ok) {
			const text = await res.text();
			throw new Error(text);
		}
		const json = await res.json();
		alert('Successfully fetched places.');
		return json.response.venues;
	} catch (err) {
		console.error('Error with places API', err);
		alert('Error with places API: ' + err.message);
	}
}

window.onload = () => {
	const scene = document.querySelector('a-scene');

	// first get current user location
	return navigator.geolocation.getCurrentPosition(function (position) {

		// than use it to load from remote APIs some places nearby
		loadPlaces(position.coords)
			.then((places) => {
				places.forEach((place) => {
					const latitude = place.location.lat;
					const longitude = place.location.lng;

					// add place name
					const placeText = document.createElement('a-link');
					placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
					placeText.setAttribute('title', place.name);
					placeText.setAttribute('scale', '15 15 15');

					placeText.addEventListener('loaded', () => {
						window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
					});

					scene.appendChild(placeText);
				});
			})
	},
		(err) => {
			console.error('Error in retrieving position', err),
			alert('Error in retrieving position: ' + err.message);
		},
		{
			enableHighAccuracy: true,
			maximumAge: 0,
			timeout: 27000,
		}
	);
};