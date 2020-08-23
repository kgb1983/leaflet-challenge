// Store our API endpoint inside queryurl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    // Console log data
    console.log(data.features)
});

 // Function to assign colors for legend and markers
 function getColor(d) {
    return d > 5 ? '#f06b6b':
    d > 4 ? '#f0936b':
    d > 3 ? '#f3ba4e':
    d > 2 ? 'f3db4c' :
    d > 1 ? '#e1f34c' :
    d > 1 ? '#e1f34c' :
            'b7f34d';
}


function createFeatures(earthquakeData) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.mag}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            let radius = feature.properties.mag * 2.5;

            if (feature.properties.mag > 5) {
                fillcolor = 'darkred';
            }
            else if (feature.properties.mag >= 4) {
                fillcolor = 'red';
            }
            else if (feature.properties.mag >= 3) {
                fillcolor = 'orange';
            }
            else if (feature.properties.mag >= 2) {
                fillcolor = 'lightcoral';
            }
            else if (feature.properties.mag >=1) {
                fillcolor = 'yellow';
            }
            else fillcolor = 'lightyellow';

            return L.circleMarker(latlng, {
                radius: radius,
                color: 'black',
                fillColor: fillcolor,
                fillOpacity: 1,
                weight: 1

            });
        }
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}


function createMap(earthquakes) {
    // Define streetmap layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });

    // Define a basemap object to hold base layer
    var baseMap = {
        "Street Map": streetmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes 
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMap, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}