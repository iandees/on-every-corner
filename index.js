'use strict';

var tileReduce = require('tile-reduce');
var path = require('path');

tileReduce({
  bbox: [-87.8714, 41.7749, -87.4972, 41.9651],
  zoom: 12,
  map: path.join(__dirname, '/map.js'),
  sources: [{name: 'osm', mbtiles: path.join(__dirname, '/united_states_of_america.mbtiles')}]
})
.on('reduce', function(num) {
})
.on('end', function() {
});
