mapboxgl.accessToken = 'pk.eyJ1IjoiYWlnNDUiLCJhIjoiY20xMmd6bGlpMTNsMzJwcHFyZXE1MnkyMiJ9.GPJ6SmABq15ut_GkP5dzRQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/aig45/cm12h1iv1006d01pcfwvg1ebc',
    zoom: 1,
    center: [-98.5795, 39.8283], // Geographic center of the contiguous US
    zoom: 3.5, // Zoomed out to show the whole country
    minZoom: 3.3,
    maxZoom: 7
});


const zoomThreshold = 4;

map.on('load', function () {
    // STATE layer
    map.addSource('states', {
        type: 'geojson',
        data: '/Link5/Data/us_states_income.geojson'
    });

    map.addLayer({
        id: 'state-fills',
        type: 'fill',
        source: 'states',
        layout: {
            visibility: 'visible'
        },
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'MedianIncome'],
                40000, '#fef0d9',
                60000, '#fdcc8a',
                80000, '#fc8d59',
                100000, '#d7301f'
            ],
            'fill-opacity': 0.8
        }
    });

    // COUNTY layer
    map.addSource('counties', {
        type: 'geojson',
        data: '/Link5/Data/us_counties_income.geojson'
    });

    map.addLayer({
        id: 'county-fills',
        type: 'fill',
        source: 'counties',
        layout: {
            visibility: 'none'
        },
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'MedianIncome'],
                40000, '#fef0d9',
                60000, '#fdcc8a',
                80000, '#fc8d59',
                100000, '#d7301f'
            ],
            'fill-opacity': 0.8
        }
    });

    // LEGEND SWITCHING
    const stateLegendEl = document.getElementById('state-legend');
    const countyLegendEl = document.getElementById('county-legend');

    const updateVisibility = () => {
        const zoom = map.getZoom();
        if (zoom > zoomThreshold) {
            map.setLayoutProperty('state-fills', 'visibility', 'none');
            map.setLayoutProperty('county-fills', 'visibility', 'visible');
            stateLegendEl.style.display = 'none';
            countyLegendEl.style.display = 'block';
        } else {
            map.setLayoutProperty('state-fills', 'visibility', 'visible');
            map.setLayoutProperty('county-fills', 'visibility', 'none');
            stateLegendEl.style.display = 'block';
            countyLegendEl.style.display = 'none';
        }
    };

    // Call once on load and then on every zoom event
    updateVisibility();
    map.on('zoom', updateVisibility);
});
