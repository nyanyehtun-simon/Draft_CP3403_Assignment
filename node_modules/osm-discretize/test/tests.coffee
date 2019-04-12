discretize = require('../')
expect = require('expect.js')
bounds =
   "type": "Feature"
   "properties": {}
   "geometry":
      "type": "Polygon"
      "coordinates": [
         [
            [-122.7151611898,37.8910505415],
            [-122.7151611898,37.9449494585],
            [-122.6468388102,37.9449494585],
            [-122.6468388102,37.8910505415],
            [-122.7151611898,37.8910505415]
         ]
      ]

rasterDimensions =
   "width": 200
   "height": 200

tagList = [
   "water",
   "wetland",
   "cliff",
   "rock",
   "tree",
   "glacier",
   "peak",
   "ridge",
   "scree",
   "coastline",
   "wood",
   "beach",
   "sand",
   "scrub",
   "grassland"]

tagWeight = [
   "Infinity",
   "Infinity",
   "Infinity",
   "Infinity",
   "Infinity",
   "Infinity",
   2,
   1.9,
   1.8,
   1.7,
   1.6,
   1.4,
   1.3,
   1.1,
   1]

sampleFeatures = require('./sample.json')
results = require('./results.json')

describe 'geojson-discretize', ->
   debugger
   tagIndices = discretize({
      bounds: bounds
      tagList: tagList
      tagWeight: tagWeight
      rasterDimensions: rasterDimensions
   }, sampleFeatures)

   it 'should return an array', ->
      expect(tagIndices).to.be.an('array')

   it 'should return an array with the correct size', ->
      expect(tagIndices).to.have.length(rasterDimensions.width * rasterDimensions.height)

   it 'should return the correct tag indices', ->
      foundMismatch = false
      for tagIndex, index in tagIndices
         if tagIndex isnt results.data[index]
            foundMismatch = true
            break

      expect(foundMismatch).to.be(false)
