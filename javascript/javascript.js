var bounds;
var locations;
var largeInfoWindow;
var filter;
var map;
var Markermodel;
var markers;
var List;
var list;
var i;

function myFunction(){
			var x = document.getElementById("myDIV");
			x.style.display = "block";
}
		
function myFunction1(){
			var x = document.getElementById("myDIV");
			x.style.display = "none";
}
	
function myFunction2(){
	var x = document.getElementById("myDIV2");
	if (x.style.display === "none")
		{
			x.style.display = "block";
		} 
	else
		{
			x.style.display = "none";
		}
}
		
function w3_open() {
	document.getElementById("mySidebar").style.display = "block";
}
		
function w3_close() {
	document.getElementById("mySidebar").style.display = "none";
}

function MarkerViewModel()	{
	var self = this;
	self.List = locations;
	self.list = ko.observable('');
	self.markers = ko.computed(e = function () {
            filter = self.list();
            if (filter !== '')
			{
				var t;
                t = self.List.slice();
                return t.filter(x = function (marker) {
                    return marker.title.toUpperCase().indexOf(filter.toUpperCase()) > -1;
                });
            }
            else
			{
               return self.List; 
            }
	});
	self.refresh = function () {
		refresh(self.markers);
	};
		
	self.itemClicked = function (markerIndex) {
        populateInfoWindow(markers[markerIndex], largeInfoWindow);
	};
}

function hiding(value) {
	for (var i = 0; i < value.length; i++)
	{
		value[i].setMap(null);
	}
}
	
// adding the markerslist to the various positions
function initMarkers() {
	for (var i = 0; i < locations.length; i++)
		{
			var marker = new google.maps.Marker({
				position: locations[i].location,
                map: map,
                title: locations[i].title,
                draggable: false,
                animation: google.maps.Animation.DROP,
                id: i
            });
            markers.push(marker);
			bounds.extend(marker.position);
			marker.addListener('click', content);
		}
		map.fitBounds(bounds);
}

var content = function ($this) {
	$this = this;
	populateInfoWindow(this, largeInfoWindow);
};
	
function refresh(markerList) {
	hiding(markers);
	markerList().forEach(function (data) {
		markers[data.index].setMap(map);
	});
}
	
function initMap()	{
// initializing the map with latitude and longitude positions
	map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 17.9948584, lng: 79.580594},
        zoom: 15
    });

// initializing the window
    largeInfoWindow = new google.maps.InfoWindow();

// adding the bounds
    bounds = new google.maps.LatLngBounds();
	
// adding good places of Gujrat and specifying its locations with latitude and longitudes
    locations = [
        {title: 'Kankaria Lake', location: {lat:  23.022505, lng: 72.5713621}, index: 0},
        {title: 'Akshardham',location: {lat:  23.2156354, lng: 72.6369415}, index: 1},
        {title: 'Sarthana National Park',location: {lat: 21.1702401, lng: 72.8310607}, index: 2},
        {title: 'Nazarbaugh Palace',location: {lat: 22.3071588, lng: 73.1812187}, index: 3},
		{title: 'Cinemax',location: {lat: 22.3038945, lng:  70.8021599}, index: 4},
		{title: 'Gandhidham Church',location: {lat:  23.075297, lng: 70.133673}, index: 5},
		{title: 'Star City',location: {lat: 23.6036268, lng: 72.9639461}, index: 6}];

    markers = [];
	initMarkers();
	model_obj = new MarkerViewModel();
	ko.applyBindings(model_obj);
	model_obj.list.subscribe(function () {
		model_obj.refresh();
	});	
}

function populateInfoWindow(marker, infowindow) {
	if (infowindow.marker != marker)
	{
		infowindow.marker = marker;
		LocationInfo(marker, infowindow);
		infowindow.open(map, marker);
		infowindow.addListener('closeclick', function () {
			infowindow.setMarker = null;
		});
	}
	if(marker.getAnimation() !== null)
		{
			marker.setAnimation(null);
		}
	else
		{
            marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function () {
				marker.setAnimation(null);
			},200);
		}
}
		
// handling error while loading map.
var mapError = function() {
  alert('failed to load ');
};

// use foursquareapi  to fetch data
function LocationInfo(marker, infowindow) {
	var location_url = 'https://api.foursquare.com/v2/venues/search?v=20161016';
	location_url += '&client_id=' + 'VUN4AOLK1UQME0SWW1MR0VDZZLFCQMMGIEBMNKVAZIIILG5I';
	location_url += '&client_secret=' + 'NZ51HKZPYNKPUIUG0JJYLG20J00ZBMB3C5IGPSCZBHONBGKF';
	location_url += '&ll=' + marker.getPosition().lat() + ',' + marker.getPosition().lng();
	location_url += '&query=' + marker.title;
	
	// ajax request used to add in the content
	$.getJSON(location_url, function (data){
		var response = data.response;
		if (response !== null)
		{
			var venues = data.response.venues;
			if (venues !== null)
			{
				var f_venue = venues[0];
				var address = "";
				var full_address = f_venue.location.formattedAddress;
				if (full_address === null)
				{
					address = "not found";
				} 
				else 
				{
					for (i in full_address)
						{
                            address += full_address[i] + ", ";
                        }
				}
				var marker_address = "<h3>"+marker.title+"</h3>";
				marker_address+= "<b>Address: </b>" + address + "<br>";
				infowindow.setContent(marker_address);
			} 
		}
	}).fail(function () {
            infowindow.setContent("something went wrong ");
	});
}	