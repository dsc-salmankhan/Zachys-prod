function clientPageInit() {
    nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_bottle_low', true);
    nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_bottle_high', true);
    nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_low', true);
    nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_high', true)
    var lineField = nlapiGetLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_high');
    lineField.setDisplayType('hidden');
}

function clientLineInit() {
    var lineNum = nlapiGetCurrentLineItemIndex('recmachcustrecord_applines_appraisal');
    var overWriteValue = nlapiGetLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_overwrite_ge', lineNum)
    if (overWriteValue == 'T') {
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_bottle_low', false);
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_bottle_high', false);
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_low', false);
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_high', false);

    } else {
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_bottle_low', true);
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_bottle_high', true);
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_low', true);
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_high', true);
    }

}

function clientFieldChanged() {
    var overWriteValue = nlapiGetCurrentLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_overwrite_ge');
    nlapiLogExecution('DEBUG', 'overWriteValue', overWriteValue);
    if (overWriteValue == 'T') {
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_bottle_low', false);
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_bottle_high', false);
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_low', false);
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_high', false);
    } else {
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_bottle_low', true);
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_bottle_high', true);
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_low', true);
        nlapiDisableLineItemField('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_high', true);
    }

}

function reCalculationLines1() {
    var title = 'reCalculationLines';
    try {
        console.log('context');
        var recordType = nlapiGetRecordType();
        var recordId = nlapiGetRecordId();
        console.log('recordType :: recordId', recordType + '  ' + recordId);
        var records = nlapiLoadRecord(recordType, recordId);
        console.log('records', JSON.stringify(records));
        var appLineCount = nlapiGetLineItemCount('recmachcustrecord_applines_appraisal');
        for (var i = 1; i <= appLineCount; i++) {
            console.log('appLineCount', appLineCount);
            var estRecValue = records.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_global_estimate', i);
            var overwriteGeVal = records.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_overwrite_ge', i);
            console.log('appLineCount', overwriteGeVal + ':' + estRecValue);
            nlapiLogExecution('DEBUG', 'overwriteGeVal :: estRecValue :: i', overwriteGeVal + ' : ' + estRecValue + ' : ' + i);
            if (overwriteGeVal != 'T') {
                if (estRecValue) {
                    var globalEstRec = nlapiLoadRecord('customrecord_global_estimate', estRecValue);
                    var NUM_OF_BOTTLE_IN_CASE = globalEstRec.getFieldValue('custrecord_global_est_bottleincase');
                    var lowBottleVal = globalEstRec.getFieldValue('custrecord_global_est_low_bttl_est');
                    var highBottleVal = globalEstRec.getFieldValue('custrecord_global_est_high_bttl_est');
                    nlapiSelectLineItem('recmachcustrecord_applines_appraisal', i);
                    var itemQuantity = globalEstRec.getFieldValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_quantity', i);
                    if (itemQuantity) {
                        if (lowBottleVal) {
                            nlapiSetCurrentLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_ext_low', parseFloat(itemQuantity * lowBottleVal));
                        }
                        if (highBottleVal) {
                            nlapiSetCurrentLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_ext_high', parseFloat(itemQuantity * highBottleVal));
                        }
                    }
                    nlapiLogExecution('DEBUG', 'lowBottleVal :: highBottleVal=', lowBottleVal + ' : ' + highBottleVal);
                    var cashHigh = NUM_OF_BOTTLE_IN_CASE * highBottleVal;
                    nlapiLogExecution('DEBUG', 'cashHigh', cashHigh);
                    nlapiSetCurrentLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_high', cashHigh);
                    var cashLow = NUM_OF_BOTTLE_IN_CASE * lowBottleVal;
                    nlapiLogExecution('DEBUG', 'cashLow', cashLow);
                    nlapiSetCurrentLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_low', cashLow);
                    var bottleLowChange = parseFloat(cashLow / NUM_OF_BOTTLE_IN_CASE);
                    nlapiLogExecution('DEBUG', 'bottleLowChange', bottleLowChange);
                    nlapiSetCurrentLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_bottle_low', bottleLowChange);
                    var bottleHighChange = parseFloat(cashHigh / NUM_OF_BOTTLE_IN_CASE);
                    nlapiLogExecution('DEBUG', 'bottleHighChange', bottleHighChange);
                    nlapiSetCurrentLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_bottle_high', bottleHighChange);
                    nlapiCommitLineItem('recmachcustrecord_applines_appraisal');
                    nlapiLogExecution('DEBUG', 'line committed successfully....');
                }
            }
        }
    } catch (e) {
        log.error("ERROR IN:: " + title, e.message);
    }
}