

function chooseColor(magnitude) {
    if (magnitude < 1) {
        return "#32CD32";
    }
    else if (magnitude >= 1 && magnitude < 2) {
        return "#ADFF2F";
    }
    else if (magnitude >= 2 && magnitude < 3) {
        return "#FFD700";
    }
    else if (magnitude >= 3 && magnitude < 4) {
        return "#FFA500";
    }
    else if (magnitude >= 4 && magnitude < 5) {
        return "#FF5C00";
    }
    else {
        return "#8B0000";
    }
}

function chooseRadius(magnitude) {
    if (magnitude < 1) {
        return 3;
    }
    else if (magnitude >= 1 && magnitude < 2) {
        return 6;
    }
    else if (magnitude >= 2 && magnitude < 3) {
        return 8;
    }
    else if (magnitude >= 3 && magnitude < 4) {
        return 10;
    }
    else if (magnitude >= 4 && magnitude < 5) {
        return 12;
    }
    else {
        return 15;
    }
}
var geojson;
// Grabbing our GeoJSON data..
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function (data) {
    // Creating a geoJSON layer with the retrieved data


    // Define variables for our tile layers
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
    });

    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v11",
        accessToken: API_KEY
    });

    // Only one base layer can be shown at a time
    var baseMaps = {
        Satellite: satellite,
        GreyScales: light,
        Outdoors: outdoors
    };


    var geojsonMarkerOptions = {
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    };


    geojson = L.geoJson(data, {
        // Style each feature (in this case a country)

        style: function (feature) {
            return {
                color: "white",
                radius: chooseRadius(feature.properties.mag),
                // Call the chooseColor function to decide which color to color our country (color based on country)
                fillColor: chooseColor(feature.properties.mag),
                fillOpacity: 0.7,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.9
            };
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        // Called on each feature
        onEachFeature: function (feature, layer) {
            // Set mouse events to change map styling
            layer.on({
                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                mouseover: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.5
                    });
                },
                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                mouseout: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.9
                    });
                },
                // When a feature (country) is clicked, it is enlarged to fit the screen
                click: function (event) {

                }
            });
            // Giving each feature a pop-up with information pertinent to it
            layer.bindPopup("<h1>" + feature.properties.title + "</h1><h5>Time " + new Date(feature.properties.time) + "</h5>");

        }
    });

    // Overlays that may be toggled on or off
    var overlayMaps = {
        Earthquakes: geojson
    };

    // Creating map object
    var myMap = L.map("map", {
        center: [44.58, -103.46],
        zoom: 3,
        layers: [satellite, geojson]
    });

    L.control.layers(baseMaps, overlayMaps).addTo(myMap);



    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

});

function getColor(d) {
    return d <= 1 ? '#32CD32' :
        d <= 2 ? '#ADFF2F' :
            d <= 3 ? '#FFD700' :
                d <= 4 ? '#FFA500' :
                    d <= 5 ? '#FF5C00' : '#8B0000';
}
