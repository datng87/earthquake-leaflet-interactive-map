//create map
var myMap = L.map("map", {
    center: [44.58, -103.46],
    zoom: 3,
});
//magnitude color
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
//magnitude size
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
//initiate variable to hold layers
var geojson;
var overlayMaps = {};
var baseMaps = {};
var control;
var check = 0;
// 1st data earthquakes
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function (data) {
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
    baseMaps = {
        Satellite: satellite,
        GreyScales: light,
        Outdoors: outdoors
    };

    // marker as circles
    var geojsonMarkerOptions = {
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    };

    //geojson layer
    geojson = L.geoJson(data, {
        //color and radius based on magnitude
        style: function (feature) {
            return {
                color: "white",
                radius: chooseRadius(feature.properties.mag),
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
                mouseover: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.5
                    });
                },
                mouseout: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.9
                    });
                },
            });
            // Giving each feature a pop-up with information pertinent to it
            layer.bindPopup("<h1>" + feature.properties.title + "</h1><h5>Time " + new Date(feature.properties.time) + "</h5>");
        }
    });

    // Overlays that may be toggled on or off
    overlayMaps.Earthquakes = geojson;

    // add default layers to map
    satellite.addTo(myMap);
    geojson.addTo(myMap);
    // if both data loaded , enable control button
    check += 1;
    if (check == 2) {
        L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    }
    // create legend layer
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
//add layer
    legend.addTo(myMap);

});
//color for legen layer
function getColor(d) {
    return d <= 1 ? '#32CD32' :
        d <= 2 ? '#ADFF2F' :
            d <= 3 ? '#FFD700' :
                d <= 4 ? '#FFA500' :
                    d <= 5 ? '#FF5C00' : '#8B0000';
}

//2nd data
var plates = "static/js/PB2002_steps.json";
var boundary = "static/js/PB2002_boundaries.json";
var orogens = "static/js/PB2002_orogens.json";
var step = "static/js/PB2002_steps.json";

//load tetonic plates data
d3.json(plates).then(function (data) {
    //geojson layers
    geojson = L.geoJson(data, {
        // Style each feature (in this case a country)
        style: {
            "color": "#ff7800",
            "weight": 2,
            "opacity": 0.65
        },
    });
    // add default layers to map
    overlayMaps.Fault_lines = geojson;
    geojson.addTo(myMap);
    //if both data loaded, add button control, othewise wait.
    check += 1;
    if (check == 2) {
        L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    }
});