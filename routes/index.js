var tableify = require('tableify');

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
    res.setHeader('Content-Type', 'application/json');
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
                    //console.log(jsonObj);
                    csvBody = jsonObj;

                    csvContent = JSON.stringify(jsonObj);

                    //console.log("Plus de detailles: ");
                    //console.log("csvContent by string: " + csvContent);

                    //Render here:
                    csvContentJson = gatherDataForEvidence(csvBody);

                    //Using TableIfy:
                    var html = tableify(csvContentJson);

                    res.render('index', {name: 'Uploaded', tablet: html}, (err, html) => {
                        //res.render('contingencytable.html', {name: 'Uploaded', tablet: csvContent}, (err, html) => {
                        res.status(200).send(html);
                    });
                })
                .then(() => {
                        console.log('Uploaded: ' + file.name);
                        console.log(addFunction(2));
                    }
                );
        }, 500);
    });
});

//setTimeout(() => {
//module.exports = router;
module.exports = {router: router, csvBody: "OK"};
//}, 600);

var addFunction = function (aNum) {
    return aNum + 1;
};


//------------------------------------------------------------------------------------------------

//The grande collection of naive bayes functions:
var exportClass = function (Data) {
    var finalColName = Object.keys(Data[0])[Object.keys(Data[0]).length - 1];
    return finalColName
};

var exportClassList = function (Data) {
    var finalColName = Object.keys(Data[0])[Object.keys(Data[0]).length - 1];
    var classifierOutcomeList = [];
    Data.forEach((element) => {
        classifierOutcome = element[finalColName];
        classifierOutcomeList.push(classifierOutcome);
    });
    return classifierOutcomeList;
};

var gatherDataForEvidence = function (Data) {
    var evidenceList = {};
    var keysOfData = Object.keys(Data[0]);
    var evidenceAttributeList = {};
    var anEvidenceAttribute = "";

    var value;

    var classifierOutcomeList;
    var classCol = "";

    var laplace = false;

    classCol = exportClass(Data);
    classifierOutcomeList = exportClassList(Data);

    //classifierOutcomeList.forEach((aClass) => {

    keysOfData.forEach((aKey) => {
        evidenceAttributeList = {};
        Data.forEach((element) => {
            anEvidenceAttribute = (element[aKey]);
            evidenceAttributeList[anEvidenceAttribute] = "";

            value = {};
            classifierOutcomeList.forEach((aClass) => {
                value[aClass] = (InstanceofFrequency(Data, aKey, anEvidenceAttribute, classCol, aClass, laplace)
                    + "/"
                    + ProbalityDenominator(Data, aKey, classCol, aClass, laplace));
            });
            evidenceAttributeList[anEvidenceAttribute] = value;

        });
        evidenceList[aKey] = evidenceAttributeList;
    });
    console.log(evidenceList);
    //});
    return JSON.stringify(evidenceList);
};

var InstanceofFrequency = function (Data, Evidence, EvidenceAttribute, Class, ClassifierOutcome, laplace) {
    var count = 0;
    Data.forEach(function (element) {
        if (element[Evidence] == EvidenceAttribute && element[Class] == ClassifierOutcome) {
            count++;
        }
    });
    //Applying La Place:
    if (laplace == true) {
        count++;
    }
    return count;
};

var ProbalityDenominator = function (Data, Evidence, Class, ClassifierOutcome, laplace) {
    var count = 0;
    var instanceofFrequency = 0;
    //Build a collection of Evidence Attribute:
    var evidenceAttribute_List = [];
    Data.forEach(function (element) {
        evidenceAttribute_List.push(element[Evidence]);
        let x = (names) => names.filter((v, i) => names.indexOf(v) === i);
        //Remove duplicates:
        evidenceAttribute_List = x(evidenceAttribute_List);
        //console.log(evidenceAttribute_List);
    });

    evidenceAttribute_List.forEach(function (element) {
        instanceofFrequency = InstanceofFrequency(Data, Evidence, element, Class, ClassifierOutcome, laplace);
        count = count + instanceofFrequency;
        instanceofFrequency = 0;
    });
    return count;
};

var list_to_test_wo_class = {
    job: 'unemployed',
    marital: 'married',
    education: 'primary',
    default: 'no',
    housing: 'no',
    loan: 'no',
    contact: 'cellular',
    month: 'oct',
    poutcome: 'unknown'
};

//THE LAPLACE will applied in this function:
var getLikelihood = function (Data, Class, ClassifierOutcome, EvidenceAttributeList) {
    var countClass = 0;
    var singleLikelihood = 0;
    var evidenceAttribute_value;
    var finalLikelihood = 0;
    var total_finalLikelihood = 1;
    var numerator = 0;
    var probalityDenominator = 0;

    Data.forEach(function (element) {
        if (element[Class] == ClassifierOutcome) {
            countClass++;
            console.log(countClass);
        }
    });

    for (attribute in EvidenceAttributeList) {
        evidenceAttribute_value = EvidenceAttributeList[attribute];

        numerator = InstanceofFrequency(Data, attribute, evidenceAttribute_value, Class, ClassifierOutcome);
        probalityDenominator = ProbalityDenominator(Data, attribute, Class, ClassifierOutcome);


        finalLikelihood = numerator / probalityDenominator;

        //console.log(finalLikelihood);
        total_finalLikelihood *= finalLikelihood;
    }
    total_finalLikelihood *= countClass;
    //console.log(total_finalLikelihood);
    return total_finalLikelihood;
};

var calculateNormalisedProbability = function (LikelihoodTrue, LikelihoodFalse, ClassifierOutcome) {
    //This function helps to convert from Likelihood ro Probability
    //Yes = True, No = False and vice versa
    if (ClassifierOutcome == true) {
        return LikelihoodTrue / (LikelihoodTrue + LikelihoodFalse);
    } else {
        return LikelihoodFalse / (LikelihoodTrue + LikelihoodFalse);
    }

};