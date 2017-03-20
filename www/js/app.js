// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.controller("PageCtrl", function($scope) {
  $scope.page = "map";
  $scope.setPage = function(page) {
    $scope.page = page;
  }
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller('MapCtrl', function($scope, $rootScope, $ionicLoading) {
    loadMap = function() {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            draggable: false,
            scrollwheel: false,
            panControl: false,
            styles: [{
                         featureType: "poi", //turns off default places display
                         stylers: [
                          { visibility: "off" }
                         ]   
                    }]
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });

        $scope.disableTap = function() {
            var container = document.getElementsByClassName('pac-container');
            angular.element(container).attr('data-tap-disabled', 'true');
            var backdrop = document.getElementsByClassName('backdrop');
            angular.element(backdrop).attr('data-tap-disabled', 'true');
            angular.element(container).on("click", function() {
                document.getElementById('pac-input').blur();
            });
        };



        var input = /** @type {HTMLInputElement} */ (document.getElementById('pac-input'));

        // Create the autocomplete helper, and associate it with
          // an HTML text input box.
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: map
        });
        google.maps.event.addListener(marker, 'click', function() {             // <-- Insert Restaurant Clicked Code in Here
            infowindow.open(map, marker);
        });



        // Get the full place details when the user selects a place from the
        // list of suggestions.
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            infowindow.close();
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(8);
            }

            // Restaurant Search
            var request = {
              bounds: map.getBounds(),
              types: ['restaurant']
            };

            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, callback);

            // Set the position of the marker using the place ID and location.
            marker.setPlace( /** @type {!google.maps.Place} */ ({
                placeId: place.place_id,
                location: place.geometry.location
            }));
            marker.setVisible(true);

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                'Place ID: ' + place.place_id + '<br>' +
                place.formatted_address + '</div>');
            infowindow.open(map, marker);
        });

        // Restaurant Search
        var request = {
          location: map.getCenter(),
          radius: '1000',
          types: ['restaurant']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);

        function callback(results, status) {
          console.log("workd");
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              var place = results[i];
              createMarker(results[i]);
            }
          }
        }

        function createMarker(place) {
          var placeLoc = place.geometry.location;
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
          });

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
          });
        }
 
        $rootScope.map = map;
        console.log($scope.page);
      }
 
    google.maps.event.addDomListener(window, 'load', loadMap());
 
})
/*.factory('RestaurantListSvc', function($scope) {
  return {
    getList: function(){
      console.log("work1");
      var request = {
        location: $scope.map.getCenter(),
        radius: '5000',
        types: ['restaurant']
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);

      function callback(results, status) {
        console.log("work2");
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          return results;
        }
      }
    }
  }
})*/
.controller('RestaurantListCtrl', function($scope, $rootScope){
  $scope.getList = function(){
    var request = {
      location: $scope.map.getCenter(),
      radius: '5000',
      types: ['restaurant'],
      rankby: 'distance'
    };

    service = new google.maps.places.PlacesService($scope.map);
    service.nearbySearch(request, callback);

    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        $scope.places = results;
        console.log(results);
      }
    }
  }
})