//var mymap = L.map('mapa').setView([51.505, -0.09], 13);
//var markers = require('./resources/markers.json');



var mymap = L.map('mapa',{
	center: [20.0, 5.0],
	minZoom: 2,
	zoom: 2
});

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
}).addTo( mymap );


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


$.get('resources/markers.json', function (markers) {
	for ( var i=0; i < markers.length; ++i ) {
    L.marker( [markers[i].lat, markers[i].lng],{icon: myIcon} )
        .bindPopup( '<a href="' + markers[i].url + '" target="_blank">' + markers[i].name + '</a>' )
        .addTo( mymap );
  }
})

var capture = 0;
var capturedData = [];

function onMapClick(e) {
    if (capture) {
      capturedData.push(e.latlng);
      console.log('Data captured', e.latlng);
      capture--;
      if (!capture) {
        L.polygon(capturedData).addTo( mymap );
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