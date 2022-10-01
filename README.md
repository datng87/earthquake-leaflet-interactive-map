In this activity, I used the leaflet library to visualise the worldwide earthquakes in the last 7 days. The up-to-date data was pulled from [United States Geological Survey](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php), (USGS) through an API call. The USGS is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.

This visualisation would help students easily understand where the earthquakes were occurring and why these places had a higher chance of earthquakes.

About the map:
- Mapbox was used to provide the layers of the world map. The magnitude and locations of earthquakes are visualised using circle markers; the bigger the circle, the higher the earthquake magnitude. 
- Detail of the earthquakes will be shown when the marker is clicked on.
- The tectonic plates are visualised using lines geometry geojson.

![alt text](images/leaflet.gif)

To generate this map:
- Firstly, I used Leaflet to create a base layer of the world map using leaflet
- Next, I used the earthquake geojson data from USGS API to create another layer for circles marker together with the legend.
- Then, I used another set of tectonic geojson data to generate the layer of the plate boundaries.
- Lastly, I added the option to toggle different map styles and layers.

We can see clearly that most earthquakes happen at the boundaries where the plates meet. Earthquakes still occur within plates, but the frequency is much lesser.

I hope you enjoy this simple but powerful visualisation.

Visit **https://datng87.github.io/earthquake-leaflet-interactive-map/** for a live demo website.
