// ==UserScript==
// @name        kunstwacht
// @namespace   kunstwacht
// @include     http://*.kunstwacht.nl/plattegrond
// @version     1
// @grant       none
// ==/UserScript==
$(document).ready(function() {
  var geocoder = new google.maps.Geocoder();
  var mymap = $('div#gmap');
  $('body')
    .find('div')
    .remove();
  $('body').append(mymap);
  mymap.css({
    width: $(window).width(),
    height: $(window).height(),
  });
  window.google.maps.visualRefresh = true;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      geocoder.geocode(
        {
          latLng: initialLocation,
        },
        function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              var marker = new google.maps.Marker({
                position: initialLocation,
                map: window.map,
                icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
              });
              /*var infowindow = */
              new google.maps.InfoWindow({
                content: results[0].formatted_address,
              }).open(window.map, marker);
            } else {
              alert('No results found');
            }
          } else {
            alert('Geocoder failed due to: ' + status);
          }
        },
      );
      window.map.setCenter(initialLocation);
      window.map.setZoom(15);
    });
  }
  /*for (var i = 0; i < window.gmarkers.length;i++){
window.gmarkers[i].setIcon('https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png');
}*/
});
