/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


var rasterUtil = require('wgs84-raster-util');
var filter = require('lodash.filter');
var within = require('turf-within');
var featurecollection = require('turf-featurecollection');
var intersectUtil = require('wgs84-intersect-util');

var matchTags = function(tags, tagList) {
   var matching = [];

   for (var key in tags) {
      if (tagList.indexOf(key) !== -1) {
         matching.push(key);
      }

      if (tagList.indexOf(tags[key]) !== -1) {
         matching.push(tags[key]);
      }
   }

   return matching;
};

var osmDiscretize = function(options, featureCollection) {
   var rasterDimensions = options.rasterDimensions;
   var bounds = options.bounds;
   var tagList = options.tagList;
   var tagWeight = options.tagWeight;
   var notagIndex = options.tagList.length;
   var corner = {
      SW: 0,
      NW: 1,
      NE: 2,
      SE: 3,
   };
   var coordinates = bounds.geometry.coordinates[0];
   var tagIndices = [];
   var rowBounds = {
      "type": "Feature",
      "properties": {},
      "geometry": {
         "type": "Polygon"
      }
   };
   var cellBounds = {
      "type": "Feature",
      "properties": {},
      "geometry": {
         "type": "Polygon"
      }
   };
   var boundsSWCorner = {
      "type": "Feature",
      "geometry": {
         "type": "Point",
         "coordinates": coordinates[corner.SW]
      },
      "properties": {}
   };
   var boundsNWCorner = {
      "type": "Feature",
      "geometry": {
         "type": "Point",
         "coordinates": coordinates[corner.NW]
      },
      "properties": {}
   };
   var boundsNECorner = {
      "type": "Feature",
      "geometry": {
         "type": "Point",
         "coordinates": coordinates[corner.NE]
      },
      "properties": {}
   };
   var cellSize = rasterUtil.cellSize(boundsNWCorner.geometry, boundsSWCorner.geometry, rasterDimensions.height);
   var points = filter(featureCollection.features, {
      geometry: {
         type: 'Point'
      }
   });
   var polygons = filter(featureCollection.features, {
      geometry: {
         type: 'Polygon'
      }
   });
   var lines = filter(featureCollection.features, {
      geometry: {
         type: 'LineString'
      }
   });

   var rowPoints;
   var rowPolygons;
   var rowLines;
   var cellBoundGeom;
   var intersectedPolygons;
   var pointsWithin;
   var tagCandidates;
   var heaviestIndex;
   var greatestWeight;

   for (var r = 0; r < rasterDimensions.height; r++) {
      rowBounds.geometry.coordinates = [rasterUtil.rowBounds(boundsNWCorner.geometry, boundsNECorner.geometry, cellSize, r)];

      try {
         rowPolygons = intersectUtil.intersectPolygons(rowBounds, polygons);
      } catch (e) {
         console.log(e);
      }

      try {
         rowPoints = within(featurecollection(points), featurecollection([rowBounds]));
      } catch (e) {
         console.log(e);
      }

      try {
         rowLines = intersectUtil.intersectLines(featurecollection([rowBounds]), lines);
      } catch (e) {
         console.log(e);
      }

      for (var c = 0; c < rasterDimensions.width; c++) {
         tagCandidates = [];
         cellBoundGeom = rasterUtil.cellBounds({
            "coordinates": rowBounds.geometry.coordinates[0][corner.NW]
         }, {
            "coordinates": rowBounds.geometry.coordinates[0][corner.SW]
         }, cellSize, c);

         cellBounds.geometry.coordinates = [cellBoundGeom];

         try {
            intersectedPolygons = intersectUtil.intersectPolygons(cellBounds, rowPolygons);
         } catch (e) {
            console.log(e);
         }

         try {
            pointsWithin = within(rowPoints, featurecollection([cellBounds]));
         } catch (e) {
            console.log(e);
         }
         /*jshint loopfunc:true */
         intersectUtil.intersectLines(featurecollection([cellBounds]), rowLines).forEach(function(line) {
            tagCandidates = tagCandidates.concat(matchTags(line.properties.tags, tagList));
         });

         for (var polygonIndex in intersectedPolygons) {
            tagCandidates = tagCandidates.concat(matchTags(intersectedPolygons[polygonIndex].properties.tags, tagList));
         }

         for (var pointIndex in pointsWithin.features) {
            tagCandidates = tagCandidates.concat(matchTags(pointsWithin.features[pointIndex].properties.tags, tagList));
         }

         if (tagCandidates.length > 1) {
            greatestWeight = 0;
            for (var tagIndex = 0; tagIndex < tagCandidates.length; tagIndex++) {
               if (tagWeight[tagList.indexOf(tagCandidates[tagIndex])] === "Infinity") {
                  heaviestIndex = tagList.indexOf(tagCandidates[tagIndex]);
                  break;
               } else {
                  if (greatestWeight <= tagWeight[tagList.indexOf(tagCandidates[tagIndex])]) {
                     greatestWeight = tagWeight[tagList.indexOf(tagCandidates[tagIndex])];
                     heaviestIndex = tagList.indexOf(tagCandidates[tagIndex]);
                  }
               }
            }
            tagIndices.push(heaviestIndex);
         } else if (tagCandidates.length === 1) {
            tagIndices.push(tagList.indexOf(tagCandidates[0]));
         } else {
            tagIndices.push(notagIndex);
         }
      }
   }

   return tagIndices;
};

/** @module osm-discretize */
module.exports = osmDiscretize;
