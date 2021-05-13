
// Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoibHVpc3ByaXZhcyIsImEiOiJja29qZW1mcTIxNGpuMnZwbmttd3UyMG4zIn0.8sP3KfEm0fDsCHbvIESDpw';

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-118.369206, 34.061453],
  zoom: 12
});

async function run() {
    // get bus data    
	const vehicles = await getBusLocations();
    
    startTimer();
    update(vehicles);
    console.log(vehicles)

	// timer
	setTimeout(run, 15000);
}

// Request bus data from LA Metro
async function getBusLocations() {
	const url = 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=lametro&r=4&t=0';
	const response = await fetch(url);
	const json = await response.json();
	return json.vehicle;
}

// Map animation
let markers = [];
function update(vehicles) {
    markers.forEach(marker => {
        marker.remove();
    });
    vehicles.forEach(vehicle => {
        let popup = new mapboxgl.Popup().setText(
            `Bus ID: ${vehicle.id}, Speed: ${vehicle.speedKmHr} Km/Hr, LastUpdate: ${vehicle.secsSinceReport} seconds ago.`
        );

        markers.push(
            new mapboxgl.Marker()
            .setLngLat([vehicle.lon, vehicle.lat])
            .setPopup(popup)
            .addTo(map)
        );
    });
}

function startTimer() {
    let counter = 15;
    let timer = setInterval(() => {
        if (counter <= 1) {
            clearInterval(timer);
        }
        document.getElementById("timer").innerHTML = `Updates in ${counter} seconds.`;
        counter -= 1;
    }, 1000);
}