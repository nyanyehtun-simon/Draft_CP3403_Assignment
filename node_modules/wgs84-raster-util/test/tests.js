(function() {
  var WGS84RasterUtil, bounds, boundsCentroid, boundsExtent, boundsNECornerPoint, boundsNWCornerPoint, boundsSECornerPoint, boundsSWCornerPoint, cellSize, corner, expect, rasterHeight, rowBounds, turf;

  WGS84RasterUtil = require('../');

  expect = require('expect.js');

  turf = require('turf');

  rasterHeight = 650;

  cellSize = 30.769221037525757;

  bounds = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[-122.71082412, 37.834057], [-122.71082412, 38.01372], [-122.48306391, 38.01372], [-122.48306391, 37.834057], [-122.71082412, 37.834057]]]
    }
  };

  corner = {
    SW: 0,
    NW: 1,
    NE: 2,
    SE: 3
  };

  boundsCentroid = turf.centroid(bounds);

  boundsSWCornerPoint = null;

  boundsNWCornerPoint = null;

  boundsNECornerPoint = null;

  boundsSECornerPoint = null;

  rowBounds = null;

  boundsExtent = null;

  describe('WGS84RasterUtil', function() {
    beforeEach(function() {
      boundsSWCornerPoint = {
        "type": "Point",
        "coordinates": bounds.geometry.coordinates[0][corner.SW]
      };
      boundsNWCornerPoint = {
        "type": "Point",
        "coordinates": bounds.geometry.coordinates[0][corner.NW]
      };
      boundsNECornerPoint = {
        "type": "Point",
        "coordinates": bounds.geometry.coordinates[0][corner.NE]
      };
      boundsSECornerPoint = {
        "type": "Point",
        "coordinates": bounds.geometry.coordinates[0][corner.SE]
      };
      return boundsExtent = [bounds.geometry.coordinates[0][corner.SW][0], bounds.geometry.coordinates[0][corner.SW][1], bounds.geometry.coordinates[0][corner.NE][0], bounds.geometry.coordinates[0][corner.NE][1]];
    });
    describe('cellSize', function() {
      return it('should calculate correct cell size', function() {
        return expect(WGS84RasterUtil.cellSize(boundsNWCornerPoint, boundsSWCornerPoint, rasterHeight)).to.equal(cellSize);
      });
    });
    describe('rowBounds', function() {
      return it('should calculate correct row bounds', function() {
        rowBounds = WGS84RasterUtil.rowBounds(boundsNWCornerPoint, boundsNECornerPoint, cellSize, 1);
        expect(rowBounds[corner.SW][0]).to.equal(-122.71082412);
        expect(rowBounds[corner.SW][1]).to.equal(38.0131671908);
        expect(rowBounds[corner.NW][0]).to.equal(-122.71082412);
        expect(rowBounds[corner.NW][1]).to.equal(38.0134435954);
        expect(rowBounds[corner.NE][0]).to.equal(-122.48306391);
        expect(rowBounds[corner.NE][1]).to.equal(38.0134435954);
        expect(rowBounds[corner.SE][0]).to.equal(-122.48306391);
        return expect(rowBounds[corner.SE][1]).to.equal(38.0131671908);
      });
    });
    describe('cellBounds', function() {
      return it('should calculate correct cell bounds', function() {
        var cellBounds;
        cellBounds = WGS84RasterUtil.cellBounds({
          "coordinates": rowBounds[corner.NW]
        }, {
          "coordinates": rowBounds[corner.SW]
        }, cellSize, 1);
        expect(cellBounds[corner.SW][0]).to.equal(-122.7104732932);
        expect(cellBounds[corner.SW][1]).to.equal(38.0131671908);
        expect(cellBounds[corner.NW][0]).to.equal(-122.7104732932);
        expect(cellBounds[corner.NW][1]).to.equal(38.0134435954);
        expect(cellBounds[corner.NE][0]).to.equal(-122.7101224664);
        expect(cellBounds[corner.NE][1]).to.equal(38.0134435954);
        expect(cellBounds[corner.SE][0]).to.equal(-122.7101224664);
        return expect(cellBounds[corner.SE][1]).to.equal(38.0131671908);
      });
    });
    return describe('pointCell', function() {
      return it('should calculate correct cell coordinates', function() {
        var pointCell;
        pointCell = WGS84RasterUtil.pointCell(boundsExtent, {
          "width": rasterHeight,
          "height": rasterHeight
        }, boundsNWCornerPoint);
        expect(pointCell.coordinates[0]).to.equal(0);
        expect(pointCell.coordinates[1]).to.equal(0);
        pointCell = WGS84RasterUtil.pointCell(boundsExtent, {
          "width": rasterHeight,
          "height": rasterHeight
        }, boundsSWCornerPoint);
        expect(pointCell.coordinates[0]).to.equal(0);
        expect(pointCell.coordinates[1]).to.equal(rasterHeight);
        pointCell = WGS84RasterUtil.pointCell(boundsExtent, {
          "width": rasterHeight,
          "height": rasterHeight
        }, boundsNECornerPoint);
        expect(pointCell.coordinates[0]).to.equal(rasterHeight);
        expect(pointCell.coordinates[1]).to.equal(0);
        pointCell = WGS84RasterUtil.pointCell(boundsExtent, {
          "width": rasterHeight,
          "height": rasterHeight
        }, boundsSECornerPoint);
        expect(pointCell.coordinates[0]).to.equal(rasterHeight);
        expect(pointCell.coordinates[1]).to.equal(rasterHeight);
        pointCell = WGS84RasterUtil.pointCell(boundsExtent, {
          "width": rasterHeight,
          "height": rasterHeight
        }, boundsCentroid.geometry);
        expect(pointCell.coordinates[0]).to.equal(rasterHeight / 2);
        return expect(pointCell.coordinates[1]).to.equal(rasterHeight / 2);
      });
    });
  });

}).call(this);
