//Globals
var map;

require([
  "esri/map",
  "esri/dijit/Search",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/graphic",
  "dojo",
  "dojo/domReady!"
 ],

function (
  mapDiv
){

  /* Map */
  map = mapDiv ("map", {
    center: [-93.5, 46.5],
    zoom: 6,
    attributionWidth: 0.15,
    logo: false
  });

  /* Search */
   var search = esri.dijit.Search({
     map: map
   }, "search");
   search.startup();


  /* Add Aerial Reference Tile Services */
  var aerialReference = esri.layers.ArcGISTiledMapServiceLayer("//services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer");
  var aerial = esri.layers.ArcGISTiledMapServiceLayer("//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
  map.addLayers([aerial, aerialReference]);

  //TODO: Move this outside the Esri JS Loop BS
  var latLngGraphic = esri.symbol.SimpleMarkerSymbol({
    "color": [255,0,0,100],
    "size": 8,
    "type": "esriSMS",
    "style": "esriSMSCircle",
    "outline": {
      "color": [255,0,0,255],
      "width": 1
    }
  });

  map.on("load", function() {
    map.on("click", showCoordinates);
    map.infoWindow.resize(200,100);
    //TODO: Move this outside the Esri JS Loop BS
    map.on("click", function(mapClick) {
      map.graphics.clear();
      map.graphics.add(esri.Graphic(mapClick.mapPoint, latLngGraphic));
    })
  });

});

function showCoordinates(event) {
  var latitude = event.mapPoint.getLatitude();
  var longitude = event.mapPoint.getLongitude();
  map.infoWindow.setTitle("Coordinates");
  map.infoWindow.setContent(
    "Latitude: " + latitude.toFixed(4) +
    "<br/>Longitude: " + longitude.toFixed(4) +
    "<br/><a href='mailto:anne.morris@state.mn.us?subject=Latitude/Longitude&body=Latitude: " + latitude.toFixed(4) + " %0D%0ALongitude: " + longitude.toFixed(4) + "'" +
    "<br/><br/>E-mail Coordinates</a>"
  );
  map.infoWindow.show(event.mapPoint, map.getInfoWindowAnchor(event.screenPoint));
}
