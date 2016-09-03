'use strict';

// var createRuler = require('cheap-ruler');
var gju = require('geojson-utils');
var G = require('generatorics');

module.exports = function(data, tile, writeData, done) {
    var highway_only = data.osm.osm.features.filter(function(f) {
        return f.properties.highway && (
            f.properties.highway == 'residential' ||
            f.properties.highway == 'secondary' ||
            f.properties.highway == 'primary' ||
            f.properties.highway == 'tertiary')
    });

    var intersections = [];
    var points = new Set();
    for (var perm of G.permutation(highway_only, 2)) {
        var ints = gju.lineStringsIntersect(perm[0].geometry, perm[1].geometry);

        if (!ints) {
            continue;
        }

        ints = ints.filter(function(pt) {
            var hash = pt.coordinates[0] + pt.coordinates[1];
            if (points.has(hash)) {
                return false;
            } else {
                points.add(hash);
                return true;
            }
        });

        if (ints.length == 0) {
            continue;
        }

        // geojson-utils seems to reverse the order of the coordinates arrays
        var geometry = {};
        if (ints.length > 1) {
            geometry.type = "MultiPoint";
            geometry.coordinates = [];
            ints.forEach(function(i) {
                geometry.coordinates.push([i.coordinates[1], i.coordinates[0]]);
            });
        } else {
            geometry.type = "Point";
            geometry.coordinates = [ints[0].coordinates[1], ints[0].coordinates[0]];
        }

        // Skip intersections where the names are the same (bridges and self-abutting ways)
        if (perm[0].properties.name && perm[1].properties.name && perm[0].properties.name == perm[1].properties.name) {
            continue;
        }

        // Skip intersections where one of them is a bridge
        if ((perm[0].properties.bridge && perm[0].properties.bridge == 'yes') || (perm[1].properties.bridge && perm[1].properties.bridge == 'yes')) {
            continue;
        }

        var int_feature = {
            type: "Feature",
            properties: {
                "from_id": perm[0].properties['@id'],
                "to_id": perm[1].properties['@id'],
                "from_name": perm[0].properties.name,
                "to_name": perm[1].properties.name,
            },
            geometry: geometry
        }
        writeData(JSON.stringify(int_feature) + '\n');
    }

    done(null, []);
};
