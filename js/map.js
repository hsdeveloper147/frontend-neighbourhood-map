var map;
var markers = [];
var findMarker;
var refineMap;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 28.695203, lng: 77.213938},
  zoom: 14
  });
  var bounds = new google.maps.LatLngBounds();
  var infoWindow = new google.maps.InfoWindow();

  filteredPlaces.forEach(function(place) {
    var marker = new google.maps.Marker({
      position: { lat: place.latitude, lng: place.longitude },
      title: place.name,
      map: map
  });
    markers.push(marker);
    marker.addListener('click', function () {
      var selectedMarker = this;
      animate(selectedMarker);
      displayInfoWindow(selectedMarker,infoWindow);
    });
    //Additional feature - If someone click on map where marker is not present marker will stop animating.
    map.addListener('click',function() {
      markers.forEach(function(marker) {
      marker.setAnimation(null);
      });
    });
    bounds.extend(marker.position);
  }, this);

  map.fitBounds(bounds);

  var animate = function(selectedMarker) {
    markers.forEach(function(marker) {
      marker.setAnimation(null);
    });
    selectedMarker.setAnimation(google.maps.Animation.BOUNCE);
  };


  findMarker = function(clickItemName) {
    markers.forEach(function(marker) {
      if(marker.getTitle() === clickItemName){
        animate(marker);
        displayInfoWindow(marker,infoWindow);
      }
    });
  };

  //refining map based on the filtered data
  refineMap = function(filteredPlaces) {
    markers.forEach(function(marker) {
      marker.setMap(null);
      filteredPlaces.forEach(function (place) {
        if(marker.getTitle() === place.name) {
          marker.setMap(map);
        }
      });
    });
  };

  //Dispays InfoWindow for the selected marker
  var displayInfoWindow = function(selectedMarker,infoWindow) {
    if(infoWindow.marker != selectedMarker) {
        infoWindow.marker = selectedMarker;
        var defaultText = "Loading data for ";
        infoWindow.setContent('<div>' + defaultText + selectedMarker.title + '...</div>');
        infoWindow.open(map, selectedMarker);
        infoWindow.addListener('closeclick',function(){
          if(infoWindow.marker !== null) {
            infoWindow.marker.setAnimation(null);
            infoWindow.marker =null;
          }
        });

        var placeUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+selectedMarker.title+"&format=json&callback=wikiCallback";

        //setTimeout for error handling
        var wikiRequestTimeOut =setTimeout(function(){
          $wikiElem.text('unable to load wiki !!');
        },8000);


        $.ajax({
          url: placeUrl,
          dataType:"jsonp"
        })
        .done(function(response) {
          var articleList = response[1];
          for(var i=0;i<articleList.length;i++){
            articleStr = articleList[i];
            var article = articleStr;
            while(articleStr.indexOf(" ")>-1){
              articleStr=articleStr.replace(" ","%20");
            }
            var url = 'https://en.wikipedia.org/wiki/'+articleStr;
            infoWindow.setContent(infoWindow.content + '<li><a href='+url+'>'+article+'</a></li>');
          }
          infoWindow.setContent(infoWindow.content + '<div>Source  : <em><a href="https://en.wikipedia.org">Wikipedia</a></em>');
        clearTimeout(wikiRequestTimeOut);

        })
        .fail(function(){
          alert('Error while fetching!!');
          infoWindow.setContent("Error occured while fetching data");
        });
    }
  };

}

function onMapError(){
  alert("Error loading map");
}
