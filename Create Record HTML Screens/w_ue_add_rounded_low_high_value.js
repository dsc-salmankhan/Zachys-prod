/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 *
 * @description This code simply populates the parent and section code when 
 * creating a project budget record.
 */
define(['N/log', 'N/search', 'N/record'], function (log, search, record) {
    function beforeSubmit(context) {
        var rec = context.newRecord;
        if (context.type == context.UserEventType.DELETE) {
            var appraisalId = rec.getValue({
                fieldId: "custrecord_applines_appraisal"
            });
            var extEstimateLowRounded = rec.getValue({
                fieldId: "custrecord_applines_ext_low_rounded"
            });
            var extEstimatHighRounded = rec.getValue({
                fieldId: "custrecord_applines_ext_high_rounded"
            });

            if (appraisalId) {
                updateAppraisalLowHigEstimate(appraisalId, extEstimateLowRounded, extEstimatHighRounded);

            }

        }

    }


    function afterSubmit(context) {
        if (context.type != context.UserEventType.DELETE) {
            var rec = context.newRecord;
            var appLineId = rec.id;
            var rec = context.newRecord;
            var roundedEstimateLow = '';
            var roundedEstimateHigh = '';

            var extEstimateLow = rec.getValue({
                fieldId: "custrecord_applines_ext_low"
            });
            var extEstimatHigh = rec.getValue({
                fieldId: "custrecord_applines_ext_high"
            });
            var extEstimateLowRounded = rec.getValue({
                fieldId: "custrecord_applines_ext_low_rounded"
            });
            var extEstimatHighRounded = rec.getValue({
                fieldId: "custrecord_applines_ext_high_rounded"
            });

            if (!extEstimateLowRounded && extEstimateLow) {
                var tempRoundedEstimateLow = getLowHighRounded(extEstimateLow);
                roundedEstimateLow = tempRoundedEstimateLow ? tempRoundedEstimateLow : 0;
                log.debug("roundedEstimateLow", roundedEstimateLow);

            }

            if (!extEstimatHighRounded && extEstimatHigh) {
                var tempRoundedEstimateHigh = getLowHighRounded(extEstimatHigh);
                roundedEstimateHigh = tempRoundedEstimateHigh ? tempRoundedEstimateHigh : 0;
                log.debug("roundedEstimateHigh", roundedEstimateHigh);
            }

            var updatedRoundedEstimateLow = !extEstimateLowRounded ? roundedEstimateLow : extEstimateLowRounded;
            var updatedRoundedEstimateHigh = !extEstimatHighRounded ? roundedEstimateHigh : extEstimatHighRounded


            record.submitFields({
                type: 'customrecord_appraisal_lines',
                id: appLineId,
                values: {
                    custrecord_applines_ext_low_rounded: updatedRoundedEstimateLow,
                    custrecord_applines_ext_high_rounded: updatedRoundedEstimateHigh
                },
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                }
            });



            var appraisalId = rec.getValue({
                fieldId: "custrecord_applines_appraisal"
            });

            if (appraisalId) {
                updateAppraisalLowHigEstimate(appraisalId);
            }


        }

    }

    function getLowHighRounded(estimateValue) {
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

                roundedValue = parseInt(tempDevideValue) * parseInt(roundedIncrement);

            }
        } else {
            roundedValue = estimateValue;
        }

        return roundedValue;
    }


    function updateAppraisalLowHigEstimate(appraisalId, extEstimateLowRounded, extEstimatHighRounded) {
        extEstimateLowRounded = extEstimateLowRounded ? extEstimateLowRounded : 0;
        extEstimatHighRounded = extEstimatHighRounded ? extEstimatHighRounded : 0;
        var appraisalLinesSearchObj = search.create({
            type: "customrecord_appraisal_lines",
            filters: [
                ["isinactive", "is", "F"],
                "AND",
                ["custrecord_applines_appraisal", "anyof", appraisalId]
            ],
            columns: [
                search.createColumn({
                    name: "custrecord_applines_ext_low_rounded",
                    summary: "SUM"
                }),
                search.createColumn({
                    name: "custrecord_applines_ext_high_rounded",
                    summary: "SUM"
                })

            ]
        });

        var appraisalLinesData = appraisalLinesSearchObj.run().getRange(0, 10);
        if (appraisalLinesData) {
            var tempEstLowRoundedSum = appraisalLinesData[0].getValue({
                name: "custrecord_applines_ext_low_rounded",
                summary: "SUM"
            });
            var appraisalBottleLowNew = tempEstLowRoundedSum ? tempEstLowRoundedSum : 0;
            appraisalBottleLowNew = parseFloat(appraisalBottleLowNew) - parseFloat(extEstimateLowRounded);
            var tempEstHighRoundedSum = appraisalLinesData[0].getValue({
                name: "custrecord_applines_ext_high_rounded",
                summary: "SUM"
            });
            var appraisalBottleHighNew = tempEstHighRoundedSum ? tempEstHighRoundedSum : 0;
            appraisalBottleHighNew = parseFloat(appraisalBottleHighNew) - parseFloat(extEstimatHighRounded);
            log.debug("appraisalBottleLowNew : appraisalBottleHighNew", appraisalBottleLowNew + ' : ' + appraisalBottleHighNew)
            record.submitFields({
                type: 'customrecord_appraisal',
                id: appraisalId,
                values: {
                    custrecord_app_low_est: appraisalBottleLowNew,
                    custrecord_app_high_est: appraisalBottleHighNew
                },
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                }
            });
        }
    }
    return {
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
});