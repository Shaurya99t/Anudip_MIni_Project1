const mapCityInput = document.getElementById('mapCityInput');
const mapSearchButton = document.getElementById('mapSearchButton');
const mapApiKey = '95ea0f05e5eee5a3da38e456a4cfd787';

let map;
let mapMarker;

// Background Image Logic
const totalImages = 6;
let currentImageIndex = 1;

function changeBackgroundImage() {
    currentImageIndex++;
    if (currentImageIndex > totalImages) {
        currentImageIndex = 1;
    }
    document.body.style.backgroundImage = `url('bg (${currentImageIndex}).png')`;
}

setInterval(changeBackgroundImage, 5000);


// Map search functionality
async function searchLocation(city) {
    if (!city) return;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${mapApiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Location not found.');
        }
        const data = await response.json();
        updateFullMap(data);

    } catch (error) {
        alert(error.message);
    }
}

function updateFullMap(data) {
    const lat = data.coord.lat;
    const lon = data.coord.lon;

    // Initialize the map on the first successful search
    if (!map) {
        map = L.map('full-map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        map.setView([lat, lon], 13);
    }
    
    if (mapMarker) {
        map.removeLayer(mapMarker);
    }
    
    mapMarker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${data.name}, ${data.sys.country}</b>`)
        .openPopup();
    
    // Ensure the map renders correctly after updating
    setTimeout(() => {
        if (map) {
            map.invalidateSize();
        }
    }, 100);
}

mapSearchButton.addEventListener('click', () => {
    searchLocation(mapCityInput.value);
});

mapCityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchLocation(mapCityInput.value);
    }
});
