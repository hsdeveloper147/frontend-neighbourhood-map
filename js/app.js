//toggle menu-hidden class for sidenav
var menuIcon = $('.icon');
menuIcon.on('click',function() {
    $('body').toggleClass('menu-hidden');
});

var clickedItemName;
//location array
var locations = [
    {
        'name': 'Delhi Technological University',
        'latitude': 28.749987,
        'longitude': 77.118314
    },
    {
        'name': 'Jamia Millia Islamia',
        'latitude':  28.561031,
        'longitude': 77.284454
    },
    {
        'name': 'IIT Delhi',
        'latitude': 28.544976,
        'longitude': 77.192628
    },
    {
        'name': 'IIIT Delhi',
        'latitude':  28.545628,
        'longitude': 77.27315
    },
    {
        'name': 'Hans Raj College',
        'latitude':  28.679183,
        'longitude': 77.208189
    },
    {
        'name': 'Netaji Subhash Institute',
        'latitude':  28.609131,
        'longitude': 77.035069
    }
];

var filteredPlaces = locations;
var place = function (data) {
    var self = this;
    self.name = ko.observable(data.name);
    self.latitude = ko.observable(data.latitude);
    self.longitude = ko.observable(data.longitude);
};

var ViewModel = function() {
    var self = this;
    self.input = ko.observable();
    self.places = ko.observableArray([]);

    locations.forEach(function (location) {
        self.places.push(new place(location));
    });

    self.refine = function() {
        var fliter = self.input();
        filteredPlaces = [];
        self.places([]);
        locations.forEach(function(location) {
            if(location.name.toLowerCase().startsWith(fliter.toLowerCase())){
                self.places.push(new place(location));
                filteredPlaces.push(location);
            }
        });
        if(filteredPlaces.length === 0) {
            alert('No Such Location in database!!');
            self.input('');
            locations.forEach(function (location) {
            self.places.push(new place(location));
    });
        }
        refineMap(filteredPlaces);
    };

    self.enableMarker = function(selected) {
        $('body').toggleClass('menu-hidden');
        clickedItemName = selected.name();
        findMarker(clickedItemName);
    };
};

ko.applyBindings(new ViewModel());
