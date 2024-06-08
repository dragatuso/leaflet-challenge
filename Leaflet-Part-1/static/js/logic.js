function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options.
    let map = L.map("map", {
      center: [45.52, -122.67],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    //create legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

        for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
        '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(map)
  }

  function mapColor(depth) {
    if(depth > 90) {
        return "red";
    }
    else if(depth > 70) {
        return "orangered";
    }
    else if(depth > 50) {
        return "orange";
    }
    else if(depth > 30) {
        return "yellow";
    }
    else if(depth > 10) {
        return "lightgreen";
    }
    else {
        return "green";
    }
}


  function createMarkers(response) {

    // Pull the earthquakes.
    let earthquakes = response.features;
  
    // Initialize an array to hold earthquakes markers.
    let markers = [];
  
    // Loop through the markers array.
    for (let index = 0; index < earthquakes.length; index++) {
      let earthquake = earthquakes[index];
  
      // For each earthquake data, create a marker, and bind a popup with the earthquake's additional information.
      let marker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]],{
        stroke: false,
        fillOpacity: (earthquake.geometry.coordinates[2]/100)*2.5,
        fillColor: mapColor(earthquake.geometry.coordinates[2]),
        radius: earthquake.properties.mag*15000

      })
        .bindPopup("<h3>" + earthquake.properties.title + "</h3>");

        
  
      // Add the marker to the markers array.
      markers.push(marker);
    }
  
    // Create a layer group that's made from the earthquake markers array, and pass it to the createMap function.
    createMap(L.layerGroup(markers));
  }
  
  
  // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
  
  
  

  