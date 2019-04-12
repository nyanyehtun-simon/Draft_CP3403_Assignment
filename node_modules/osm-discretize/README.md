[![NPM](https://nodei.co/npm/osm-discretize.png?downloads=true&stars=true)](https://nodei.co/npm/osm-discretize/)

Generate an array of OSM tag indices for discrete cells within a given geographic area

Installation
-------------
    $ npm install osm-discretize

Function
--------
    discretize(options, featureCollection)
> **options**:  *object*
> + bounds:  *object*, GeoJSON feature with a polygon that represents the geographic area
> + tagList:  *array*, List of OpenStreetMap [tags](http://taginfo.openstreetmap.org/tags)
> + tagWeight:  *array*, List of numeric weights for the given tag list
> + rasterDimensions:  *object*
>    + width:  *number*, discrete units for row size
>    + height:  *number*, discrete units for column size
>
> **featureCollection**:  *object*,  GeoJSON feature collection of OSM [elements](http://wiki.openstreetmap.org/wiki/Elements)
>
> **Returns**
>
> *array*, dominant tag list indices for each cell arranged in row-major order

Running Tests
--------------
Install the development dependencies:

    $ npm install

Then run the tests:

    $ npm test

Code Coverage
--------------
Install the development dependencies:

    $ npm install

Then run coverage

    $ npm run coverage

View coverage reports

    $ firefox coverage/lcov-report/index.html

Browser Bundle
---------------
    $ npm run build
