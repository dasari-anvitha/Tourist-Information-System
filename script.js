// SEARCH LOCATION
async function searchLocation() {

    let location = document.getElementById("cityInput").value;

    if (!location) {
        alert("Please enter a location ❌");
        return;
    }

    try {
        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
        let response = await fetch(url);
        let data = await response.json();

        if (data.length === 0) {
            document.getElementById("heroResult").innerHTML =
                "<p class='text-danger'>Location not found ❌</p>";
            return;
        }

        let lat = data[0].lat;
        let lon = data[0].lon;

        showResult(lat, lon, location);

    } catch {
        alert("Error fetching location ❌");
    }
}

// CURRENT LOCATION
async function getCurrentLocation() {

    if (!navigator.geolocation) {
        alert("Geolocation not supported ❌");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {

            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            try {
                let url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
                let response = await fetch(url);
                let data = await response.json();

                let addr = data.address;

                let placeName =
                    addr.city ||
                    addr.town ||
                    addr.village ||
                    addr.state_district ||
                    addr.state ||
                    addr.country;

                showResult(lat, lon, placeName);

            } catch {
                showResult(lat, lon, "Your Current Location 📍");
            }

        },
        () => {
            alert("Please allow location access ❌");
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// SHOW RESULT
function showResult(lat, lon, name) {

    document.getElementById("heroResult").innerHTML = `
        <div class="result-card">
            <h4>${name}</h4>
            <p>Select what you want:</p>

            <div class="d-flex justify-content-center flex-wrap">

                <button class="btn custom-btn option-btn"
                    onclick="openNearby(${lat}, ${lon}, 'tourist attractions')">
                    🗺️ Tourist Places
                </button>

                <button class="btn custom-btn option-btn"
                    onclick="openNearby(${lat}, ${lon}, 'hotels')">
                    🏨 Hotels
                </button>

            </div>
        </div>
    `;
}

// OPEN GOOGLE MAPS
function openNearby(lat, lon, type) {

    let url = `https://www.google.com/maps/search/${type}/@${lat},${lon},15z?hl=en-IN&gl=IN`;

    window.open(url, "_blank");
}