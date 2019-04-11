var naivebayes = require('../naive_algorithm.js');

var express = require('express');
var router = express.Router();
const app = express();
var formidable = require('formidable');
var csv = require('csvtojson');
var Collection = require('dstools').Collection;

var csvContent;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
//const window = jsdom.jsdom("").defaultView;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//GET home page.
router.get('/', function (req, res, next) {
    var table1 = '<h1>HungH1</h1>';
    res.render('index', {name: 'Express', tablet: table1});
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
        console.log(file.path);

        csv()
            .fromFile(file.path)
            .then((jsonObj) => {
                console.log(jsonObj);
                csvContent = JSON.stringify(jsonObj);
                console.log("Plus de detailles: ");
                console.log("csvContent: " + csvContent);

                res.render('index', {name: 'Uploaded', tablet: csvContent}, (err, html) => {
                    res.status(200).send(html);
                });
            });
    });

    form.on('file', function (name, file) {
        console.log('Uploaded: ' + file.name);
    });


    //console.log("last one: " + JSON.parse(csvContent));
});

module.exports = router;
