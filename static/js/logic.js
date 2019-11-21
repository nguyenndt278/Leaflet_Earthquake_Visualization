
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
// Once we get a response, send the data.features object to the createFeatures function
createFeatures(data.features);

});

function createFeatures(earthquakeData) {

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
function onEachFeature(feature, layer) {
  layer.bindPopup("<h3> Magnitude: "+ feature.properties.mag+ "</h3>"+"<h3><hr><p>"+"<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

// Creating circle markers

function size(mag) {
    return mag * 26000;
  }

  function circleColor(mag) {
    if (mag < 1) {
      return "#ffe6e6"
    }
    else if (mag < 2) {
      return "#ffb3b3"
    }
    else if (mag < 3) {
      return "#ff6666"
    }
    else if (mag < 4) {
      return "#ff1a1a"
    }
    else if (mag < 5) {
        return "#cc0000"
      }
    else {
      return "#800000"
    }
  };

// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (earthquakeData, latlng) {
        return L.circle(latlng, { radius: size(earthquakeData.properties.mag) });
      },
  
      style: function (geoJsonFeature) {
        return {
          fillColor: circleColor(geoJsonFeature.properties.mag),
          fillOpacity: 0.75,
          weight: 0.5,
          color: 'black'
        }
      },

  onEachFeature: onEachFeature
});

// Sending our earthquakes layer to the createMap function
createMap(earthquakes);
}

function createMap(earthquakes) {

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
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

// Creating a legend

function legendColor(d) {
  if (d < 1) {
    return "#ffe6e6"
  }
  else if (d < 2) {
    return "#ffb3b3"
  }
  else if (d < 3) {
    return "#ff6666"
  }
  else if (d < 4) {
    return "#ff1a1a"
  }
  else if (d < 5) {
      return "#cc0000"
    }
  else {
    return "#800000"
  }
};

var info = L.control({ position: "bottomright" });

info.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'legend'),
        magnitude = [0, 1, 2, 3, 4, 5],
        labels = [];

    div.innerHTML += "<h4 style='margin:4px'>Magnitudes</h4>"

    for (var i = 0; i < magnitude.length; i++) {
      div.innerHTML +=
        magnitude[i]  + (magnitude[i + 1] ? '&ndash;'+  magnitude[i + 1] + ''
        +'<i style= "background-color:' + legendColor(magnitude[i] + 1) + '; color: transparent;'  + '">'
        + 'jonathan'+'</i>'
        +'<br>' : '+'
        +'<i style= "background-color:' + legendColor(magnitude[i] + 1) + ';color: transparent;'  + '">'
        + 'jonathan'+'</i>');
    }
    return div;
  };

  info.addTo(myMap);

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
}