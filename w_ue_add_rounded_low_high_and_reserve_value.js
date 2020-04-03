/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 *
 * @description This code simply populates the parent and section code when 
 * creating a project budget record.
 */

var PERCENTAGE_VALUE = 80;
define(['N/log', 'N/search', 'N/record', 'SuiteScripts/library-files/bk_library_calculate_low_high_rounded_and_reserve_value.js'], function (log, search, record, libraryMethods) {
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
        try {
            if (context.type != context.UserEventType.DELETE) {
                var rec = context.newRecord;
                var appLineId = rec.id;
                var rec = context.newRecord;
                var roundedEstimateLow = '';
                var roundedEstimateHigh = '';
                var roundedReserveValue = '';

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
                var reserveRoundedValue = rec.getValue({
                    fieldId: "custrecord_applines_ext_high_reserve"
                });
                var appraisalId = rec.getValue({
                    fieldId: "custrecord_applines_appraisal"
                });

                if (!appraisalId) {
                    appraisalId = getAppraisalId(appLineId);
                }

                if (!extEstimateLowRounded && extEstimateLow) {
                    var tempRoundedEstimateLow = libraryMethods.getRoundedValue(extEstimateLow, true);
                    roundedEstimateLow = tempRoundedEstimateLow ? tempRoundedEstimateLow : 0;
                    log.debug("roundedEstimateLow", roundedEstimateLow);

                }

                if (!extEstimatHighRounded && extEstimatHigh) {
                    var tempRoundedEstimateHigh = libraryMethods.getRoundedValue(extEstimatHigh, false);
                    roundedEstimateHigh = tempRoundedEstimateHigh ? tempRoundedEstimateHigh : 0;
                    log.debug("roundedEstimateHigh", roundedEstimateHigh);
                }

                var updatedRoundedEstimateLow = !extEstimateLowRounded ? roundedEstimateLow : extEstimateLowRounded;
                var updatedRoundedEstimateHigh = !extEstimatHighRounded ? roundedEstimateHigh : extEstimatHighRounded

                if (!reserveRoundedValue && updatedRoundedEstimateLow) {
                    var tempReserve;
                    var reservePercentage = getReservePercentage(appraisalId);
                    if (reservePercentage) {
                        tempReserve = parseFloat(updatedRoundedEstimateLow) * parseFloat(reservePercentage) / 100.0;
                    } else {
                        tempReserve = parseFloat(updatedRoundedEstimateLow) * parseFloat(PERCENTAGE_VALUE) / 100.0;
                    }
                    log.debug("tempReserve:", tempReserve);
                    var tempRoundedReserve = libraryMethods.getRoundedValue(tempReserve, true);
                    roundedReserveValue = tempRoundedReserve ? tempRoundedReserve : 0;
                    log.debug("roundedReserveValue:", roundedReserveValue);
                }
                var updatedRoundedReserveValue = !reserveRoundedValue ? roundedReserveValue : reserveRoundedValue

                if (updatedRoundedEstimateLow != extEstimateLowRounded || updatedRoundedEstimateHigh != extEstimatHighRounded || updatedRoundedReserveValue != reserveRoundedValue) {
                    record.submitFields({
                        type: 'customrecord_appraisal_lines',
                        id: appLineId,
                        values: {
                            custrecord_applines_ext_low_rounded: updatedRoundedEstimateLow,
                            custrecord_applines_ext_high_rounded: updatedRoundedEstimateHigh,
                            custrecord_applines_ext_high_reserve: updatedRoundedReserveValue
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });

                }

                if (appraisalId) {
                    updateAppraisalLowHigEstimate(appraisalId);
                }


            }

        } catch (e) {
            log.error("ERROR MESSAGE :: ", e.message);
        }

    }

    function getReservePercentage(appId) {
        if (appId) {
            var apptDataObj = search.lookupFields({
                type: 'customrecord_appraisal',
                id: appId,
                columns: ['custrecord_appraisal_reserve']
            });

            return apptDataObj.custrecord_appraisal_reserve ? apptDataObj.custrecord_appraisal_reserve.replace('%', '') : '';

        }

        return '';

    }

    function getAppraisalId(appLineId) {
        if (appLineId) {
            var apptLineDataObj = search.lookupFields({
                type: 'customrecord_appraisal_lines',
                id: appLineId,
                columns: ['custrecord_applines_appraisal']
            });

            return apptLineDataObj.custrecord_applines_appraisal[0] ? apptLineDataObj.custrecord_applines_appraisal[0].value : '';

        }

        return '';

    }


    function updateAppraisalLowHigEstimate(appraisalId, extEstimateLowRounded, extEstimatHighRounded) {
        extEstimateLowRounded = extEstimateLowRounded ? parseInt(extEstimateLowRounded) : 0;
        extEstimatHighRounded = extEstimatHighRounded ? parseInt(extEstimatHighRounded) : 0;
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
            appraisalBottleLowNew = parseInt(appraisalBottleLowNew) - parseInt(extEstimateLowRounded);
            var tempEstHighRoundedSum = appraisalLinesData[0].getValue({
                name: "custrecord_applines_ext_high_rounded",
                summary: "SUM"
            });
            var appraisalBottleHighNew = tempEstHighRoundedSum ? tempEstHighRoundedSum : 0;
            appraisalBottleHighNew = parseInt(appraisalBottleHighNew) - parseInt(extEstimatHighRounded);
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