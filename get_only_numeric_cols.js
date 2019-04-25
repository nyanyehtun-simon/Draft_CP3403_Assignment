
module.exports = {
    getNumericAttributesNormalised: function (Data) {

        var dataset = JSON.parse(JSON.stringify(Data));
        var returnDataset = [];

        var aDictForReturn = {};

        var keyList = Object.keys(dataset[1]);
        var keyListNumeric = [];

        keyList.forEach((key) => {
            dataset.forEach((object) => {
                if (isNaN(object[key]) === false) {
                    if ((typeof parseInt(object[key])) == "number") {
                        keyListNumeric.push(key);
                    }
                }
            });
        });

        dataset.forEach((dict) => {
            aDictForReturn = {};
            keyListNumeric.forEach((key) => {
                aDictForReturn[key] = dict[key];
            });
            returnDataset.push(aDictForReturn);
        });

        var aMax = 0;
        var tempList = [];
        var n =0;
        keyListNumeric.forEach((key) => {
            tempList =[];
            returnDataset.forEach((dict) => {
                tempList.push(dict[key]);
            });
            aMax = Math.max(...tempList);
            n =0;
            returnDataset.forEach((dict) => {
                returnDataset[n][key] = (returnDataset[n][key] * 1)/aMax;
                n++;
            });
        });

        if (returnDataset === []){
            return null;
        }else {
            return returnDataset;}
    },
    getNumericAttributes: function (Data) {

        var dataset = JSON.parse(JSON.stringify(Data));
        var returnDataset = [];

        var aDictForReturn = {};

        var keyList = Object.keys(dataset[1]);
        var keyListNumeric = [];

        keyList.forEach((key) => {
            dataset.forEach((object) => {
                if (isNaN(object[key]) === false) {
                    if ((typeof parseInt(object[key])) == "number") {
                        keyListNumeric.push(key);
                    }
                }
            });
        });

        dataset.forEach((dict) => {
            aDictForReturn = {};
            keyListNumeric.forEach((key) => {
                aDictForReturn[key] = dict[key];
            });
            returnDataset.push(aDictForReturn);
        });

        if (returnDataset === []){
            return null;
        }else {
            return returnDataset;}
    }
};

