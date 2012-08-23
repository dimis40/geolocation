var map = null;
var startPosition = null;
var lastPosition = null;
var route = [];
var routePolyline = null;
var geoConfiguration = { enableHighAccuracy:true,timeout:3000,maximumAge : 6000 };

var myOptions = {
  zoom: 15,
  mapTypeControl: false,
  navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
  mapTypeId: google.maps.MapTypeId.HYBRID
};

var calculateDistance = function ( lat1 , lon1 , lat2 , lon2 ) {
    var R = 6371; // km
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad(); 
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var d = R * c;
    return d;
};

var changePosition = function ( position ){
  console.log("changePosition");
  route.push( latLngFromPosition(position) );
  newMarker( position );
  newPolyline( route );
  lastPosition = position;
  document.querySelector('#status').innerHTML = "Distancia " +
            calculateDistance( lastPosition.coords.latitude , lastPosition.coords.longitude ,
                               startPosition.coords.latitude , startPosition.coords.longitude ) + "Km";
};

var createMap = function( ){

  navigator.geolocation.getCurrentPosition(
    function(position) {
      
      startPosition = position;
      
      myOptions.center = latLngFromPosition( startPosition );
      map = new google.maps.Map( document.getElementById("mapcanvas") , myOptions); 
      
      route.push( latLngFromPosition( startPosition ) );
      newMarker( startPosition );

      //Register watch
      navigator.geolocation.watchPosition( changePosition, error,  geoConfiguration );
    },
    error
  ); 
};

var error = function ( error ){
      console.log( error );
};

var latLngFromPosition = function ( position ){
  return new google.maps.LatLng( position.coords.latitude , position.coords.longitude );
};

var newPolyline = function( route ){

  if( routePolyline )
    routePolyline.setMap(null);

  routePolyline = new google.maps.Polyline({
      path: route,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
  });

  routePolyline.setMap(map);

};

var newMarker = function ( position ){
  var marker = new google.maps.Marker({
                   position: latLngFromPosition( position ) , 
                   animation: google.maps.Animation.DROP,
                   map: map
  });
  return marker;
};
  
Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }