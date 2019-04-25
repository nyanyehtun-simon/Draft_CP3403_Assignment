
module.exports = {
    getNumericAttributes: function (Data) {

        var dataset = JSON.parse(JSON.stringify(Data));
        var returnDataset = [];

        var aDictForReturn = {};

        var keyList = Object.keys(data[1]);
        var keyListNumeric = [];
        var toReturn = null;

        keyList.forEach((key) => {
            data.forEach((object => {
                if ((typeof object[key]) == "number") {
                    keyListNumeric.push(key);
                }
            }));
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

