/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
 */
var NUM_OF_BOTTLE_IN_CASE = 0;
define(['N/currentRecord', 'N/record', 'N/url'],
    function (currentRecord, record, url) {
        function splitLinesTable() {
            try {
                jQuery('#btn_split_lines').prop('disabled', true);
                var currentRecordObj = currentRecord.get();
                var line = currentRecordObj.getLineCount({
                    sublistId: 'splitqtysublist'
                });
                if (line > 0) {
                    for (var k = line - 1; k >= 0; k--) {
                        currentRecordObj.removeLine({
                            sublistId: 'splitqtysublist',
                            line: k
                        });
                    }

                }
                var splitInto = currentRecordObj.getValue({
                    fieldId: 'item_split_into'
                });
                var itemId = currentRecordObj.getValue({
                    fieldId: 'item_name'
                });
                var itemDec = currentRecordObj.getValue({
                    fieldId: 'item_decsription'
                });
                var itemQty = currentRecordObj.getValue({
                    fieldId: 'item_qty'
                });
                if (!splitInto || parseInt(splitInto) <= 0) {
                    alert('Add split Into Value.');
                    return false;
                }
                for (var i = 0; i < splitInto; i++) {
                    currentRecordObj.selectNewLine({
                        sublistId: 'splitqtysublist',
                    });
                    currentRecordObj.setCurrentSublistValue({
                        sublistId: 'splitqtysublist',
                        fieldId: 'itemsublist',
                        value: itemId
                    });
                    currentRecordObj.setCurrentSublistValue({
                        sublistId: 'splitqtysublist',
                        fieldId: 'descriptionsublist',
                        value: itemDec
                    });
                    currentRecordObj.setCurrentSublistValue({
                        sublistId: 'splitqtysublist',
                        fieldId: 'qtysublist',
                        value: 1
                    });
                    currentRecordObj.commitLine({
                        sublistId: 'splitqtysublist'
                    });
                }
                jQuery('#btn_split_lines').prop('disabled', false);
            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);

            }
        }

        function createConsignLines(conLineRecId, conRecId, conBottleLow, conBottleHigh) {
            var title = "createConsignLines ():: ";
            try {
                log.debug('conLineRecId:: ', conLineRecId + ' ' + conRecId);
                var quantityLinesSum = 0;
                jQuery('#btn_submit').prop('disabled', true);
                var currentRecordObj = currentRecord.get();
                var line = currentRecordObj.getLineCount({
                    sublistId: 'splitqtysublist'
                });
                log.debug('line', line);

                for (var i = 0; i < line; i++) {
                    var ConsignmentQty = currentRecordObj.getSublistValue({
                        sublistId: 'splitqtysublist',
                        fieldId: 'qtysublist',
                        line: i
                    });
                    quantityLinesSum = quantityLinesSum + parseFloat(ConsignmentQty);

                }
                var itemQty = currentRecordObj.getValue({
                    fieldId: 'item_qty'
                });

                if (itemQty != quantityLinesSum) {
                    alert('Lines quatity sum must equal to Quantity');
                    jQuery('#btn_submit').prop('disabled', false);
                    return false;
                }


                for (var i = 0; i < line; i++) {
                    var ConsignmentQty = currentRecordObj.getSublistValue({
                        sublistId: 'splitqtysublist',
                        fieldId: 'qtysublist',
                        line: i
                    });
                    var ConsignmentLineType = currentRecordObj.getSublistValue({
                        sublistId: 'splitqtysublist',
                        fieldId: 'itemtypesublist',
                        line: i
                    });

                    log.debug('ConsignmentLineType :: ', ConsignmentLineType);
                    if (i == 0) {
                        record.submitFields({
                            type: 'customrecord_cl',
                            id: conLineRecId,
                            values: {
                                'custrecord_cl_qty_expected': ConsignmentQty,
                                'custrecord_cl_type': ConsignmentLineType,
                                'custrecord_cl_screener': 0,
                                'custrecord_cl_event': 0

                            }
                        });
                    } else {
                        log.debug('value of i', i);
                        var objRecord = record.copy({
                            type: 'customrecord_cl',
                            id: conLineRecId,
                            isDynamic: true
                        });
                        objRecord.setValue({
                            fieldId: 'custrecord_cl_qty_expected',
                            value: ConsignmentQty
                        });
                        objRecord.setValue({
                            fieldId: 'custrecord_cl_type',
                            value: ConsignmentLineType
                        });
                        objRecord.setValue({
                            fieldId: 'custrecord_cl_screener',
                            value: ""
                        });
                        objRecord.setValue({
                            fieldId: 'custrecord_cl_event',
                            value: ""
                        });
                        var newConCopyRec = objRecord.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });
                        log.debug('newConCopyRec', newConCopyRec);
                    }


                }
                jQuery('#btn_submit').prop('disabled', false);
                log.debug('conRecId:: ', conRecId);
                if (conRecId) {
                    var hostName = window.location.hostname;
                    var tempUrl = url.resolveRecord({
                        recordType: 'customrecord_consignment',
                        recordId: conRecId
                    });
                    var conRecUrl = 'https://' + hostName + tempUrl
                    log.debug('conRecUrl', conRecUrl);
                    window.open(conRecUrl, "_self");
                }
            } catch (e) {
                console.log('error :: message', e.message)
                log.error("ERROR IN:: " + title, e.message);

            }

        }

        function pageInit() {

        }
        return ({

            pageInit: pageInit,
            splitLinesTable: splitLinesTable,
            createConsignLines: createConsignLines
        });
    });