//Extract csv get from the index page:
var indexPage = require("./index.js");

var express = require('express');
var router = express.Router();
const app = express();

router.get('/', function (req, res, next) {

        var csvBody = indexPage.csvBody;
        console.log("Contingency Table page is now in control");

});

module.exports = router;