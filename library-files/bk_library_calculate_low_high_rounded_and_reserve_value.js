/**
 *
 * @NModuleScope TargetAccount
 *
 */
var PERCENTAGE_OF_ROUNDED_UP = 0.75; // 75/100= 0.75
define(['N/search'], function (search) {
    function getRoundedValue(estimateValue, isNotRoundUp) {
        try {
            log.debug("library file getLowHighRounded()::", estimateValue);
            if (estimateValue) {
                var roundedValue;
                var searchObj = search.create({
                    type: "customrecord_bid_increment",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_bid", "lessthanorequalto", parseInt(estimateValue)],
                        "AND",
                        ["custrecord_bid_high", "greaterthanorequalto", parseInt(estimateValue)],
                    ],
                    columns: [

                        search.createColumn({
                            name: "custrecord_bid_increment"
                        })

                    ]
                });

                var binSearchData = searchObj.run().getRange(0, 1000);

                if (binSearchData.length > 0) {
                    var roundedIncrement = binSearchData[0].getValue({
                        name: 'custrecord_bid_increment'
                    });

                    if (parseInt(estimateValue) % parseInt(roundedIncrement) == 0) {
                        roundedValue = estimateValue;
                    } else {
                        var tempDevideValue = parseInt(estimateValue) / parseInt(roundedIncrement);

                        if (isNotRoundUp) {
                            var remainderValue = parseInt(estimateValue) % parseInt(roundedIncrement);
                            var percentageValueOfIncerement = PERCENTAGE_OF_ROUNDED_UP * parseInt(roundedIncrement);

                            if (parseInt(remainderValue) < parseInt(percentageValueOfIncerement)) {
                                roundedValue = parseInt(tempDevideValue) * parseInt(roundedIncrement);
                            } else {
                                roundedValue = getRoundedUpValue(tempDevideValue, roundedIncrement);

                            }


                        } else {
                            roundedValue = getRoundedUpValue(tempDevideValue, roundedIncrement);

                        }


                    }
                } else {
                    roundedValue = estimateValue;
                }

                return parseInt(roundedValue);
            }
            return null;
        } catch (e) {
            log.error("getLowHighRounded() :: Error: ", e.message)
        }
    }

    function getRoundedUpValue(devideValue, roundedIncrement) {
        return (parseInt(devideValue) * parseInt(roundedIncrement)) + parseInt(roundedIncrement);
    }

    return {
        getRoundedValue: getRoundedValue
    }

});