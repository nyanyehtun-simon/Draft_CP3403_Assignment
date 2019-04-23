var tableify = require('tableify');
var discretization = require('discretisation.js');
var statistics = require('statistics.js');

const fs = require('fs');
const path = require('path');

const csv_parser = require('csv-parser');

var express = require('express');
var router = express.Router();
const app = express();
var formidable = require('formidable');
var csv = require('csvtojson');
var Collection = require('dstools').Collection;

var csvContent_String;
var csvContentJson;
var csvBody;
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//GET home page.
router.get('/', function (req, res, next) {

    const directory = 'uploads';

    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            //console.log(path.join(directory, file));

            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });

        }
    });

    var table1 = '<h1>HungH1</h1>';
    res.render('index', {name: 'Waiting', tablet: table1, tableToShow: table1});
});

router.get('/download', function (req, res, next) {
    var file = './downloads/very_small_sample.csv';
    res.download(file); // Set disposition and send it.
});

router.get('/fetch-data', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    // we will accept one parameter from frontend named filename
    const filename = req.query.filename;

    res.end(JSON.stringify(csvContent_String));
    console.log(csvContent_String);
});

router.post('/submit-form', (req, res) => {

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

                    //THIS IS THE MAIN AND RAW CSV CONTENT THAT NEED TO BE PROCESSED:
                    csvBody = jsonObj;

                    //discretization here:


                    //CALC THE LIKELIHOOD:


                    //PARSE CSV RAW CONTENT TO STRING TO PRINT ON UI:
                    csvContent_String = JSON.stringify(jsonObj);

                    //CALC EACH ATTRIBUTE:
                    csvContentJson = gatherDataForEvidence(csvBody);

                    //Using TableIfy:
                    var html = tableify(csvContentJson);
                    console.log(html);

                    res.render('contingencytable.html', {
                        name: 'Uploaded',
                        tablet: csvContent_String,
                        tableToShow: html
                    }, (err, html) => {
                        //res.render('contingencytable.html', {name: 'Uploaded', tablet: csvContent_String}, (err, html) => {
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
    //return JSON.stringify(evidenceList);
    return evidenceList;
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
    poutcome: 'unknown',
    y: 'no'
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
        }
    });

    var evidenceKeys = Object.keys(EvidenceAttributeList);

    for (var i = 0; i < EvidenceAttributeList.length-1; i++) {
        //for (attribute in EvidenceAttributeList) {
        attribute = evidenceKeys[i];
        evidenceAttribute_value = EvidenceAttributeList[attribute];

        numerator = InstanceofFrequency(Data, attribute, evidenceAttribute_value, Class, ClassifierOutcome);
        probalityDenominator = ProbalityDenominator(Data, attribute, Class, ClassifierOutcome);

        finalLikelihood = numerator / probalityDenominator;
        total_finalLikelihood *= finalLikelihood;
    }
    total_finalLikelihood *= countClass;
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


//------------------------------------------------------------------------------------------------

//Using the training data set to test:
var getLikelihood_entire = function (Data) {
    var toReturn = Data;
    var attributeList = Object.keys(toReturn[1]);
    var classAttr = attributeList[attributeList.length - 1];
    var classList = [];
    toReturn.forEach((dict) => {
        classList.push(dict[classAttr])
    });
    classList = [...new Set(classList)];

    var result = [];
    var result_each = {
        'class_name': '',
        'likelihood': 0,
        'normalised_probability':0
    };
    var sum_likelihood = 0;
    var theHighestProbability = 0;
    var theHighestProbability_class = ''; //the class (yes or no) in order to assign to the class.

    //Classify each row of data set:
    var n =0;
    toReturn.forEach((dict) => {
        //Get result:
        classList.forEach((aClass) => {
            result_each.class_name = aClass;
            result_each.likelihood = getLikelihood(toReturn, classAttr, aClass, dict);
            result_each.likelihood = 0;
            sum_likelihood += result_each.likelihood;
            result.push(result_each);
        });
        //Get normalised probability:
        for(var i =0; i<result.length; i++){
            result[i].normalised_probability = result[i].likelihood / sum_likelihood;
        }
        //Get the highest probability:
        result.forEach((each) => {
            if (each.normalised_probability > theHighestProbability){
                theHighestProbability = each.normalised_probability;
                theHighestProbability_class = each.class_name;
            }
        });
        toReturn[n][classAttr] = theHighestProbability_class;
        n++;
    });
    return toReturn;
};