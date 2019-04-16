var naivebayes = require('../naive_algorithm.js');

const fs = require('fs');
const csv_parser = require('csv-parser');

var express = require('express');
var router = express.Router();
const app = express();
var formidable = require('formidable');
var csv = require('csvtojson');
var Collection = require('dstools').Collection;

var csvContent;
var csvBody;
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//GET home page.
router.get('/', function (req, res, next) {
    var table1 = '<h1>HungH1</h1>';
    res.render('index', {name: 'Waiting', tablet: table1});
});

router.get('/fetch-data', function (req, res, next) {
    res.setHeader('Content-Type','application/json');
    // we will accept one parameter from frontend named filename
    const filename = req.query.filename;

    res.end(JSON.stringify(csvContent));
    console.log(csvContent);
});

router.post('/submit-form', (req, res) => {
    const postBody = req.body;
    console.log(postBody.name);

    var form = new formidable.IncomingForm();
    form.encoding = "utf-8";

    form.parse(req);

    form.on('fileBegin', function (name, file) {

        var str = __dirname;
        var dir_name = str.substring(0, str.length - 7);

        file.path = dir_name + "/uploads/" + file.name;
        console.log("The file path is " + file.path);

        setTimeout(() => {
            csv()
                .fromFile(file.path)
                .then((jsonObj) => {
                    console.log(jsonObj);
                    csvBody = jsonObj;
                    csvContent = JSON.stringify(jsonObj);
                    console.log("Plus de detailles: ");
                    console.log("csvContent by string: " + csvContent);

                    res.render('index', {name: 'Uploaded', tablet: csvContent}, (err, html) => {
                    //res.render('contingencytable.html', {name: 'Uploaded', tablet: csvContent}, (err, html) => {
                        res.status(200).send(html);
                    });
                })
                .then( () => {
                        console.log('Uploaded: ' + file.name);
                    }
                );
        }, 500);
    });
});

//setTimeout(() => {
    //module.exports = router;
    module.exports = {router:router, csvBody:"OK"};
//}, 600);

