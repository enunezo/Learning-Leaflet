var mymap = L.map('mapa',{
	center: [20.0, 5.0],
	minZoom: 2,
	zoom: 2
});

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
}).addTo( mymap );

L.featureGroup([]).addTo( mymap )

var myIcon = L.icon({
    iconUrl: 'resources/images/red-marker.png',
    iconRetinaUrl: 'my-icon@2x.png',
    iconSize: [30, 55],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    //shadowUrl: 'my-icon-shadow.png',
    //shadowRetinaUrl: 'my-icon-shadow@2x.png',
    //shadowSize: [68, 95],
    //shadowAnchor: [22, 94]
});



//Transformar esta funcion para que abra el geoJson que recibire
//se trabaja de la misma forma

//L.geoJson() acepta objetos em formato geojson (Como se recibira del back).
//coordsToLatLng() transforma las coordenadas del geoJson a latitud y longitud
//teniendo la lat y la long uso esta funcion
$.get('resources/markers.json', function (markers) {
	for ( var i=0; i < markers.length; ++i ) {
    L.marker( [markers[i].lat, markers[i].lng],{icon: myIcon} )
        .bindPopup( '<a href="' + markers[i].url + '" target="_blank">' + markers[i].name + '</a>' )
        .addTo( mymap );
  }
})

var capture = 0;
var capturedData = [];
var allPolygons = [];

//Usar un multipolygon para guardar todos los poligonos
//luego usar multipolygon.toGeoJson para obtener lo que se mandara al back.

function onMapClick(e) {
    if (capture) {
      capturedData.push(e.latlng);
      console.log('Data captured', e.latlng);
      capture--;
      if (!capture) {
        var p = L.polygon(capturedData)
        p.addTo( mymap );
        allPolygons.push(p)
        capturedData = [];
      }
      return;
    }
    console.log('Not capturing..')
}

function getPolygon(){
  capture = 4;
  console.log('Starting capture')  
}



mymap.on('click', onMapClick);

function send() {
  var finalGeoJSON = {
    type: 'MultiPolygon',
    coordinates: []
  };
  allPolygons.map(function (p) {
    return p.toGeoJSON();
  }).forEach(function (p) {
    finalGeoJSON.coordinates.push(p.geometry.coordinates)
  })
  console.log(finalGeoJSON);
}





