window.onload = () => {
	const scene = document.querySelector('a-scene');

	// 最初に現在のユーザーの位置を取得
	return navigator.geolocation.getCurrentPosition(function (position) {

		// Firebase Cloud FunctionのURL
		const functionUrl = `https://us-central1-webar-app-398016.cloudfunctions.net/getPlaces?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;

		// Firebase Cloud Functionを呼び出す
		fetch(functionUrl)
			.then(response => response.json())
			.then((places) => {
				places.forEach((place) => {
					const latitude = place.location.lat;
					const longitude = place.location.lng;

					// 場所の名前を追加
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
			.catch((err) => {
				console.error('Error in retrieving places', err);
				alert('Error in retrieving places: ' + err.message);
			});
	},
		(err) => {
			console.error('Error in retrieving position', err);
			alert('Error in retrieving position: ' + err.message);
		},
		{
			enableHighAccuracy: true,
			maximumAge: 0,
			timeout: 27000,
		});
};
