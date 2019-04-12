/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


var WGS84Util = require('wgs84-util');

/** @module wgs84-raster-util */
var WGS84RasterUtil = exports;

WGS84RasterUtil.cellSize = function(NWRowCornerCoord, SWRowCornerCoord, rasterHeight) {
   return WGS84Util.distanceBetween(SWRowCornerCoord, NWRowCornerCoord) / rasterHeight;
};

WGS84RasterUtil.rowBounds = function(NWRowCornerCoord, NERowCornerCoord, cellSize, rowIndex) {
   var rowBounds = [];
   var rowNWCornerLatLng = WGS84Util.destinationPoint(NWRowCornerCoord, 180, rowIndex * cellSize);
   var rowNECornerLatLng = WGS84Util.destinationPoint(NERowCornerCoord, 180, rowIndex * cellSize);

   var NW = rowNWCornerLatLng.coordinates;
   var NE = rowNECornerLatLng.coordinates;
   var SE = WGS84Util.destinationPoint({
      "coordinates": NE
   }, 180, cellSize).coordinates;
   var SW = WGS84Util.destinationPoint({
      "coordinates": NW
   }, 180, cellSize).coordinates;

   rowBounds.push(SW, NW, NE, SE, SW);

   return rowBounds;
};

WGS84RasterUtil.cellBounds = function(NWRowCornerCoord, SWRowCornerCoord, cellSize, colIndex) {
   var cellBounds = [];

   var NW = [WGS84Util.destinationPoint(NWRowCornerCoord, 90, colIndex * cellSize).coordinates[0],
   NWRowCornerCoord.coordinates[1]];
   var NE = [WGS84Util.destinationPoint({
      "coordinates": NW
   }, 90, cellSize).coordinates[0], NW[1]];
   var SE = [NE[0], SWRowCornerCoord.coordinates[1]];
   var SW = [NW[0], SWRowCornerCoord.coordinates[1]];

   cellBounds.push(SW, NW, NE, SE, SW);

   return cellBounds;
};

WGS84RasterUtil.pointCell = function(extent, rasterDimensions, pointCoord) {
   var SWCorner = {
      "coordinates": [extent[0], extent[1]]
   };
   var NWCorner = {
      "coordinates": [extent[0], extent[3]]
   };
   var NECorner = {
      "coordinates": [extent[2], extent[3]]
   };
   var pointCell = {
      "type": "Point"
   };
   var width;
   var height;
   var easting;
   var northing;

   width = WGS84Util.distanceBetween(NWCorner, NECorner);
   height = WGS84Util.distanceBetween(NWCorner, SWCorner);
   easting = WGS84Util.distanceBetween(NWCorner, {
      "coordinates": [pointCoord.coordinates[0], NWCorner.coordinates[1]]
   });
   northing = WGS84Util.distanceBetween(NWCorner, {
      "coordinates": [NWCorner.coordinates[0], pointCoord.coordinates[1]]
   });
   pointCell.coordinates = [
      Math.round(rasterDimensions.width / width * easting),
      Math.round(rasterDimensions.height / height * northing)
   ];

   return pointCell;
};
