/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 *
 * @description This code simply populates the parent and section code when 
 * creating a project budget record.
 */
/**
 * Version   Date            Author          Change/Issue#	    Remarks  						
 * 1.00      1/22/2020       Dev2 	         ZAC-115           Initial Version 
 */


var PERCENTAGE_VALUE = 80;
define(['N/log', 'N/search', 'N/record', 'SuiteScripts/library-files/bk_library_calculate_low_high_rounded_and_reserve_value.js'], function (log, search, record, libraryMethods) {

    function beforeSubmit(context) {
        if (context.type != context.UserEventType.DELETE) {
            var newRec = context.newRecord;
            var oldRec = context.oldRecord;

            var extendedLow = '';
            var extendedHigh = '';
            var roundedExtendedLow = '';
            var roundedExtendedHigh = '';
            var roundedReserveValue = '';

            var consignmentId = newRec.getValue({
                fieldId: "custrecord_cl_consignment"
            });
            var oldRecDataObj = {};
            if (context.type != context.UserEventType.CREATE) {
                oldRecDataObj = getRecordFiledValue(oldRec);
            }
            var newRecDataObj = getRecordFiledValue(newRec);

            if (!newRecDataObj.qtyReceived) {
                return true;
            }

            var roundedLow = libraryMethods.getRoundedValue(newRecDataObj.extEstimateLow, true);
            if ((newRecDataObj.qtyReceived != oldRecDataObj.qtyReceived && newRecDataObj.bottleLow) || (newRecDataObj.bottleLow != oldRecDataObj.bottleLow && newRecDataObj.qtyReceived && newRecDataObj.bottleLow)) {
                extendedLow = parseFloat(newRecDataObj.qtyReceived) * parseFloat(newRecDataObj.bottleLow);
            }

            if ((newRecDataObj.qtyReceived != oldRecDataObj.qtyReceived && newRecDataObj.bottleHigh) || (newRecDataObj.bottleHigh != oldRecDataObj.bottleHigh && newRecDataObj.qtyReceived && newRecDataObj.bottleHigh)) {
                extendedHigh = parseFloat(newRecDataObj.qtyReceived) * parseFloat(newRecDataObj.bottleHigh);
            }

            if ((newRecDataObj.roundedExtendedLow != oldRecDataObj.roundedExtendedLow && extendedLow) || (newRecDataObj.extendedLow != oldRecDataObj.extendedLow) || (!newRecDataObj.roundedExtendedLow) || (extendedLow)) {
                var tempExtLow = extendedLow ? extendedLow : newRecDataObj.extendedLow;
                roundedExtendedLow = libraryMethods.getRoundedValue(tempExtLow, true);
            }

            if ((newRecDataObj.roundedExtendedHigh != oldRecDataObj.roundedExtendedHigh && extendedHigh) || (newRecDataObj.extendedHigh != oldRecDataObj.extendedHigh) || (!newRecDataObj.roundedExtendedHigh) || (extendedHigh)) {
                var tempExtHigh = extendedHigh ? extendedHigh : newRecDataObj.extendedHigh;
                roundedExtendedHigh = libraryMethods.getRoundedValue(tempExtHigh, false);
            }

            if (!roundedReserveValue && roundedExtendedLow) {
                var tempReserve;
                var tempRoundedExtLow = roundedExtendedLow ? roundedExtendedLow : newRecDataObj.roundedExtendedLow;
                var reservePercentage = getReservePercentage(consignmentId);
                if (reservePercentage) {
                    tempReserve = parseFloat(tempRoundedExtLow) * parseFloat(reservePercentage) / 100.0;
                } else {
                    tempReserve = parseFloat(tempRoundedExtLow) * parseFloat(PERCENTAGE_VALUE) / 100.0;
                }
                roundedReserveValue = libraryMethods.getRoundedValue(tempReserve, true);
            }

            if (!newRecDataObj.bottleLow || !newRecDataObj.qtyReceived) {
                newRec.setValue({
                    fieldId: 'custrecord_cl_extended_low',
                    value: 0
                });
                newRec.setValue({
                    fieldId: 'custrecord_cl_reserve',
                    value: 0
                });
                newRec.setValue({
                    fieldId: 'custrecord_cl_ext_low_rounded',
                    value: 0
                });
            }
            if (!newRecDataObj.bottleHigh || !newRecDataObj.qtyReceived) {
                newRec.setValue({
                    fieldId: 'custrecord_cl__ext_high_rounded',
                    value: 0
                })
                newRec.setValue({
                    fieldId: 'custrecord_cl_extended_high',
                    value: 0
                })
            }


            if (extendedLow) {
                newRec.setValue({
                    fieldId: 'custrecord_cl_extended_low',
                    value: extendedLow
                })

            }
            if (extendedHigh) {
                newRec.setValue({
                    fieldId: 'custrecord_cl_extended_high',
                    value: extendedHigh
                })

            }
            if (roundedExtendedLow) {
                newRec.setValue({
                    fieldId: 'custrecord_cl_ext_low_rounded',
                    value: roundedExtendedLow
                })

            }
            if (roundedExtendedHigh) {
                newRec.setValue({
                    fieldId: 'custrecord_cl__ext_high_rounded',
                    value: roundedExtendedHigh
                })

            }
            if (roundedReserveValue) {
                newRec.setValue({
                    fieldId: 'custrecord_cl_reserve',
                    value: roundedReserveValue
                })

            }
            log.debug("extendedLow:", extendedLow);
            log.debug("extendedHigh:", extendedHigh);
            log.debug("roundedExtendedLow:", roundedExtendedLow);
            log.debug("roundedExtendedHigh:", roundedExtendedHigh);
            log.debug("roundedReserveValue:", roundedReserveValue);

        }

    }

    function getReservePercentage(consignmentId) {
        if (consignmentId) {
            var apptDataObj = search.lookupFields({
                type: 'customrecord_consignment',
                id: consignmentId,
                columns: ['custrecord_consignment_reserve']
            });

            return apptDataObj.custrecord_consignment_reserve ? apptDataObj.custrecord_consignment_reserve.replace('%', '') : '';

        }

        return '';

    }

    function getRecordFiledValue(record) {
        var obj = {};
        obj.qtyReceived = record.getValue({
            fieldId: "custrecord_cl_qty_received"
        });
        obj.bottleLow = record.getValue({
            fieldId: "custrecord_cl_bottle_low"
        });
        obj.bottleHigh = record.getValue({
            fieldId: "custrecord_cl_bottle_high"
        });
        obj.extendedLow = record.getValue({
            fieldId: "custrecord_cl_extended_low"
        });
        obj.extendedHigh = record.getValue({
            fieldId: "custrecord_cl_extended_high"
        });
        obj.roundedExtendedLow = record.getValue({
            fieldId: "custrecord_cl_ext_low_rounded"
        });
        obj.roundedExtendedHigh = record.getValue({
            fieldId: "custrecord_cl__ext_high_rounded"
        });
        obj.roundedReserveValue = record.getValue({
            fieldId: "custrecord_cl_reserve"
        });


        return obj;
    }

    return {
        beforeSubmit: beforeSubmit
    }
});