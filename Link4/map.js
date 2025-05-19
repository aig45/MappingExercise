mapboxgl.accessToken = 'pk.eyJ1IjoiYWlnNDUiLCJhIjoiY20xMmd6bGlpMTNsMzJwcHFyZXE1MnkyMiJ9.GPJ6SmABq15ut_GkP5dzRQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/aig45/cm8654erv00am01s53b8d2tjg',
    zoom: 1.2,
    center: [0, 20],
    maxZoom: 3,
    minZoom: 1,
});


    map.on('load', () => {
        map.addSource('migrationData', {
            type: 'geojson',
            data: 'Data/migration_data.geojson'  // Ensure this path is correct relative to your server
        });

        map.addLayer({
            id: 'migration-layer',
            type: 'fill',
            source: 'migrationData',
            paint: {
                'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'NET_MIGRATION_2012'],  // Change this to the correct property name from your file
                    -2000000, '#f1eef6',
                    -100000, '#bdc9e1',
                    0, '#74a9cf',
                    100000, '#2b8cbe',
                    2000000, '#045a8d'
                ],
                'fill-opacity': 0.8
            }
        });

        // Optional: Add borders
        map.addLayer({
            id: 'migration-borders',
            type: 'line',
            source: 'migrationData',
            paint: {
                'line-color': '#ffffff',
                'line-width': .1
            }
        });
    });

    // Create a popup but don't add it to the map yet
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

map.on('mousemove', 'migration-layer', (e) => {
    map.getCanvas().style.cursor = 'pointer';

    // Get feature properties
    const feature = e.features[0];
    const country = feature.properties.name || 'Unknown';
    const migrants = feature.properties.NET_MIGRATION_2012 || 0;


    // Set the popup content and position
    popup.setLngLat(e.lngLat)
         .setHTML(`<strong>${country}</strong><br/>Number of Migrants: ${migrants}`)
         .addTo(map);
});

map.on('mouseleave', 'migration-layer', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
});


    // Create the popup
map.on('click', 'migrationData', function (e) {
    let entriesDiff = e.features[0].properties.ENTRIES_DIFF;
    let entries_06 = e.features[0].properties.ENTRIES_06;
    let entries_20 = e.features[0].properties.ENTRIES_20;
    let stationName = e.features[0].properties.stationName;
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h4>' + stationName + '</h4>'
            + '<p><b>Friday, March 6th:</b> ' + entries_06 + ' entries<br>'
            + '<b>Friday, March 20th:</b> ' + entries_20 + ' entries<br>'
            + '<b>Change:</b> ' + Math.round(entriesDiff * 1000) / 10 + '%</p>')
        .addTo(map);
});
// Change the cursor to a pointer when the mouse is over the turnstileData layer.
map.on('mouseenter', 'migrationData', function () {
    map.getCanvas().style.cursor = 'pointer';
});
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'migrationData', function () {
    map.getCanvas().style.cursor = '';
});
