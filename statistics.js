
module.exports = {

    calcCorectandIncorrectInstances: function (originalData, classifiedData) {
        var toReturn = {
            'Correct': 0,
            'Incorrect': 0
        };

        var originalAttributeList = Object.keys(originalData[1]);
        var classifiedAttributeList = Object.keys(classifiedData[1]);

        //console.log(originalAttributeList);
        //console.log(classifiedAttributeList);

        var originClassAttr = originalAttributeList[originalAttributeList.length - 1];
        var classifiedClassAttr = classifiedAttributeList[classifiedAttributeList.length - 1];

        var originalOne = {};
        var classifiedOne = {};

        //var i = 0;
        for (var i = 0; i < originalData.length; i++) {
            console.log(i);

            if (originalData[i]["y"] === classifiedData[i]["y"]) {
                toReturn.Correct++;
            } else {
                toReturn.Incorrect++;
            }
        }
        //console.log(toReturn);
        return toReturn;
    },


    //Calculate : TP Rate  FP Rate  Precision  Recall :
    getDetailedAccuracyByClass: function (originalData, classifiedData) {
        var detailedAccuracyByClass = [
            {
                'class_name': 'Weighted Average',
                'TP_Rate': 0,
                'FP_Rate': 0,
                'TN_Rate': 0,
                'FN_Rate': 0,
                'Precision': 0,
                'Recall': 0,
                'Sensitivity': 0,
                'Specificity': 0
            }
        ];

        var TP_Rate = 0;
        var FP_Rate = 0;
        var Precision = 0;
        var Recall = 0;
        var Sensitivity = 0;
        var Specificity = 0;

        //Make again a classlist:
        var toReturn = {
            'Correct': 0,
            'Incorrect': 0
        };

        var originalAttributeList = Object.keys(originalData[1]);
        var classifiedAttributeList = Object.keys(classifiedData[1]);

        console.log(originalAttributeList);
        console.log(classifiedAttributeList);

        var originClassAttr = originalAttributeList[originalAttributeList.length - 1]; //y
        var classifiedClassAttr = classifiedAttributeList[classifiedAttributeList.length - 1]; //y

        var classList = [];
        originalData.forEach((dict) => {
            classList.push(dict[originClassAttr])
        });
        classList = [...new Set(classList)];
        console.log(classList);

        var compar = false;
        var countOriginal;
        var countClassified;

        var currentDict;

        classList.forEach((aClass) => {
            var m;
            currentDict = {
                'class_name': aClass,
                'TP_Rate': 0,
                'FP_Rate': 0,
                'TN_Rate': 0,
                'FN_Rate': 0,
                'Precision': 0,
                'Recall': 0,
                'Sensitivity': 0,
                'Specificity': 0
            };

            //Getting TP Rate:
            for (m = 0; m < originalData.length; m++) {
                if (originalData[m][originClassAttr] === aClass
                    && classifiedData[m][originClassAttr] === aClass) {
                    currentDict['TP_Rate']++;
                }
            }

            //Getting FP Rate:
            for (m = 0; m < originalData.length; m++) {
                if (originalData[m][originClassAttr] !== aClass
                    && classifiedData[m][originClassAttr] === aClass) {
                    currentDict['FP_Rate']++;
                }
            }

            //Getting FN Rate:
            for (m = 0; m < originalData.length; m++) {
                if (originalData[m][originClassAttr] === aClass
                    && classifiedData[m][originClassAttr] !== aClass) {
                    currentDict['FN_Rate']++;
                }
            }

            //Getting TN Rate:
            for (m = 0; m < originalData.length; m++) {
                if (originalData[m][originClassAttr] !== aClass
                    && classifiedData[m][originClassAttr] !== aClass) {
                    currentDict['TN_Rate']++;
                }
            }

            //Getting Sensitivity:
            currentDict['Sensitivity']
                = currentDict['TP_Rate'] / (currentDict['TP_Rate'] + currentDict['FN_Rate']);

            currentDict['Specificity']
                = currentDict['TN_Rate'] / (currentDict['FP_Rate'] + currentDict['TN_Rate']);

            currentDict['Recall']
                = currentDict['TP_Rate'] / (currentDict['TP_Rate'] + currentDict['FN_Rate']);

            currentDict['Precision']
                = currentDict['TP_Rate'] / (currentDict['TP_Rate'] + currentDict['FP_Rate']);

            detailedAccuracyByClass.push(currentDict);
        });

        return detailedAccuracyByClass;
    }
};