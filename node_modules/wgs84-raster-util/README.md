[![NPM](https://nodei.co/npm/wgs84-raster-util.png?downloads=true&stars=true)](https://nodei.co/npm/wgs84-raster-util/)

Geographic utilities for manipulating raster graphics using WGS84 datum

Installation
-------------
    $ npm install wgs84-raster-util

Methods
--------
    cellSize(NWRowCornerCoord, SWRowCornerCoord, rasterHeight)
> **NWRowCornerCoord**:  *object*,  GeoJSON point for the NW corner of the raster
>
> **SWRowCornerCoord**:  *object*,  GeoJSON point for the SW corner of the raster
>
> **rasterHeight**:  *number*, raster height in pixels
>
> **Returns**
>
> *number*, square size of a cell in meters

    rowBounds(NWRowCornerCoord, NERowCornerCoord, cellSize, rowIndex)
> **NWRowCornerCoord**:  *object*,  GeoJSON point for the NW corner of the raster
>
> **NERowCornerCoord**:  *object*,  GeoJSON point for the NE corner of the raster
>
> **cellSize**:  *number*, square size of a cell in meters
>
> **rowIndex**:  *number*, index of current row starting at 0
>
> **Returns**
>
> *array*, coordinates of a bounding polygon for the row

    cellBounds(NWRowCornerCoord, SWRowCornerCoord, cellSize, colIndex)
> **NWRowCornerCoord**:  *object*,  GeoJSON point for the NW corner of the row
>
> **SWRowCornerCoord**:  *object*,  GeoJSON point for the SW corner of the row
>
> **cellSize**:  *number*, square size of a cell in meters
>
> **colIndex**:  *number*, index of current column starting at 0
>
> **Returns**
>
> *array*, coordinates of a bounding polygon for the column

    pointCell(extent, rasterDimensions, pointCoord)
> **extent**:  *array*, bounding box coordinates in the form: [xLow, yLow, xHigh, yHigh]
>
> **rasterDimensions**:  *object*
>    + width:  *number*, discrete units for row size
>    + height:  *number*, discrete units for column size
>
> **pointCoord**:  *object*, GeoJSON point
>
> **Returns**
>
> *object*, GeoJSON point containing cell coordinates referenced by `pointCoord`

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
