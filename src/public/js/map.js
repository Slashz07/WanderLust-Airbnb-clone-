
mapboxgl.accessToken =mapBoxToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 8 // starting zoom
});

const faIcon = document.createElement('div');
faIcon.className = 'marker-icon';

// Add the Font Awesome icon inside the marker element
const icon = document.createElement('i');
icon.className = 'fas fa-home'; // Font Awesome home icon
faIcon.appendChild(icon);



const marker1 = new mapboxgl.Marker(faIcon)
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup().setHTML(
        `<div class="popup-content">
        <h3><b>${listing.location}</b><h3/>
        <p class="popup-text">Exact location provided by WanderLust</p>
    </div>`
    ))
    .addTo(map);


faIcon.addEventListener('mouseenter', () => {
    icon.className = 'fas fa-compass'; // Change icon to compass on hover
    icon.style.transform = 'rotate(180deg)'; // Rotate the icon in place
    icon.style.transition = 'transform 0.7s';
});

faIcon.addEventListener('mouseleave', () => {
    icon.className = 'fas fa-home'; // Revert back to home icon when not hovering
    icon.style.transform = 'rotate(0deg)'; // Reset the rotation
    icon.style.transition = 'transform 0s';

});