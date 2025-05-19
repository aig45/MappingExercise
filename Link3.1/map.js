mapboxgl.accessToken = 'pk.eyJ1IjoiYWlnNDUiLCJhIjoiY20xMmd6bGlpMTNsMzJwcHFyZXE1MnkyMiJ9.GPJ6SmABq15ut_GkP5dzRQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/aig45/cm12h1iv1006d01pcfwvg1ebc',
    zoom: 10.2,
    center: [-73.9, 40.725],
    maxZoom: 15,
    minZoom: 8,
    maxBounds: [[-74.45, 40.45], [-73.55, 41]]
});

map.on('load', () => {
  // 🔸 Layer 1: Intersections
  map.addSource('intersections', {
    type: 'geojson',
    data: '/Link3.1/VZV_SIP_Intersections_20250312.geojson'
  });

  map.addLayer({
    id: 'intersections-layer',
    type: 'circle',
    source: 'intersections',
    paint: {
      'circle-radius': 2,
      'circle-color': '#ff5722' // orange
    }
  });

  const intersectionsPopup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

  map.on('mouseenter', 'intersections-layer', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    const coordinates = e.features[0].geometry.coordinates.slice();
    const props = e.features[0].properties;
    const description = `<strong>${props.pjct_name}</strong><br>End Date: ${props.end_date}`;
    intersectionsPopup.setLngLat(coordinates).setHTML(description).addTo(map);
  });

  map.on('mouseleave', 'intersections-layer', () => {
    map.getCanvas().style.cursor = '';
    intersectionsPopup.remove();
  });

  // 🔹 Layer 2: Traffic Calming
  map.addSource('traffic-calming', {
    type: 'geojson',
    data: '/Link3.1/VZV_Turn_Traffic_Calming_20250313.geojson'
  });

  map.addLayer({
    id: 'traffic-calming-layer',
    type: 'circle',
    source: 'traffic-calming',
    paint: {
      'circle-radius': 2,
      'circle-color': '#FF8200' 
    }
  });

  const trafficPopup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

  map.on('mouseenter', 'traffic-calming-layer', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    const coordinates = e.features[0].geometry.coordinates.slice();
    const props = e.features[0].properties;
    const description = `<strong>${props.treatment_}</strong><br>Date: ${props.completion}`;
    trafficPopup.setLngLat(coordinates).setHTML(description).addTo(map);
  });

  map.on('mouseleave', 'traffic-calming-layer', () => {
    map.getCanvas().style.cursor = '';
    trafficPopup.remove();
  });

  // 🟢 Layer 3: Rent Regulated Housing
  map.addSource('rent-regulated', {
    type: 'geojson',
    data: '/Link3.1/rentregulated.json'
  });

  map.addLayer({
    id: 'rent-regulated-layer',
    type: 'circle',
    source: 'rent-regulated',
    paint: {
      'circle-radius': 1.5,
      'circle-color': '#007cbf', // 
      'circle-opacity': 0.1 // 👈 70% opacity
    }
}, 'intersections-layer'); // 👈 This places it below "intersections-layer

  });
