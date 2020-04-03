/**
 * @NApiVersion 	2.0
 * @NScriptType 	ScheduledScript
 * @NModuleScope 	SameAccount
 */
var SCREENER_TYPE = '5';
var EVENT_TYPE = '3';
define(['N/record', 'N/ui/message', 'N/search'],
    function (record, message, search) {
        function createConsignment(options) {
            var title = 'createConsignment';
            try {
                var consignmentInfoArr = searchConsignment();
                for (var i = 0; i < consignmentInfoArr.length; i++) {
                    log.debug(title + ' :: consignmentInfoArr', consignmentInfoArr[i].conId);
                    log.debug(title + ' :: appId', consignmentInfoArr[i].appraisalId);
                    var appRecFileds = searchAppraisals(consignmentInfoArr[i].appraisalId);

                    log.debug(title + 'appRecFileds.length :: appRecFileds', appRecFileds.length + ' :: ' + appRecFileds);
                    if (appRecFileds.length > 0) {
                        createConsignmentLines(consignmentInfoArr[i].conId, appRecFileds);

                    }
                }


            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);

            }
        }

        function searchAppraisals(appraisalId) {
            var title = 'searchAppraisals';
            try {
                var appraisalDataArr = [];
                var conSearchObj = search.create({
                    type: "customrecord_appraisal",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["internalid", "anyof", appraisalId]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custrecord_applines_item",
                            join: "custrecord_applines_appraisal" //"CUSTRECORD_APPLINES_APPRAISAL"
                        }),
                        search.createColumn({
                            name: "custrecord_applines_description",
                            join: "custrecord_applines_appraisal"
                        }),
                        search.createColumn({
                            name: "custrecord_applines_bottle_low",
                            join: "custrecord_applines_appraisal"
                        }),
                        search.createColumn({
                            name: "custrecord_applines_bottle_high",
                            join: "custrecord_applines_appraisal"
                        }),
                        search.createColumn({
                            name: "custrecord_applines_ext_low",
                            join: "custrecord_applines_appraisal"
                        }),
                        search.createColumn({
                            name: "custrecord_applines_ext_high",
                            join: "custrecord_applines_appraisal"
                        }),
                        search.createColumn({
                            name: "custrecord_applines_quantity",
                            join: "custrecord_applines_appraisal"
                        }),
                        search.createColumn({
                            name: "custrecord_applines_closed",
                            join: "custrecord_applines_appraisal"
                        }),
                        search.createColumn({
                            name: "custrecord_applines_consignor_location",
                            join: "custrecord_applines_appraisal"
                        }),
                        search.createColumn({
                            name: "custrecord_applines_screener",
                            join: "custrecord_applines_appraisal"
                        }),
                        search.createColumn({
                            name: "custrecord_applines_event",
                            join: "custrecord_applines_appraisal"
                        }),
                        search.createColumn({
                            name: "custrecord_applines_photo",
                            join: "custrecord_applines_appraisal"
                        })
                    ]
                });
                var appLinesSearchData = [];
                var count = 0;
                var pageSize = 1000;
                var start = 0;

                // run saved search
                do {
                    var tempAppLinesSearchData = conSearchObj.run().getRange({
                        start: start,
                        end: start + pageSize
                    });

                    appLinesSearchData = appLinesSearchData.concat(tempAppLinesSearchData);
                    count = appLinesSearchData.length;
                    start += pageSize;
                } while (count == pageSize);
                if (appLinesSearchData.length > 0) {
                    for (var s = 0; s < appLinesSearchData.length; s++) {
                        var obj = {};
                        var appLineSearchData = appLinesSearchData[s];
                        var appItem = appLineSearchData.getValue({
                            name: 'custrecord_applines_item',
                            join: "custrecord_applines_appraisal"
                        });
                        var appDescription = appLineSearchData.getValue({
                            name: 'custrecord_applines_description',
                            join: "custrecord_applines_appraisal"
                        });
                        var appBottleLow = appLineSearchData.getValue({
                            name: 'custrecord_applines_bottle_low',
                            join: "custrecord_applines_appraisal"
                        });
                        var appBottleHigh = appLineSearchData.getValue({
                            name: 'custrecord_applines_bottle_high',
                            join: "custrecord_applines_appraisal"
                        });
                        var appExtLow = appLineSearchData.getValue({
                            name: 'custrecord_applines_ext_low',
                            join: "custrecord_applines_appraisal"
                        });
                        var appExtHigh = appLineSearchData.getValue({
                            name: 'custrecord_applines_ext_high',
                            join: "custrecord_applines_appraisal"
                        });
                        var appQuantity = appLineSearchData.getValue({
                            name: 'custrecord_applines_quantity',
                            join: "custrecord_applines_appraisal"
                        });
                        var appClosed = appLineSearchData.getValue({
                            name: 'custrecord_applines_closed',
                            join: "custrecord_applines_appraisal"
                        });
                        var appConsignorLocation = appLineSearchData.getValue({
                            name: 'custrecord_applines_consignor_location',
                            join: "custrecord_applines_appraisal"
                        });
                        var appScreener = appLineSearchData.getValue({
                            name: 'custrecord_applines_screener',
                            join: "custrecord_applines_appraisal"
                        });
                        var appEvent = appLineSearchData.getValue({
                            name: 'custrecord_applines_event',
                            join: "custrecord_applines_appraisal"
                        });
                        var appPhoto = appLineSearchData.getValue({
                            name: 'custrecord_applines_photo',
                            join: "custrecord_applines_appraisal"
                        });

                        obj.appItem = appItem ? appItem : '';
                        obj.appDescription = appDescription ? appDescription : '';
                        obj.appBottleLow = appBottleLow ? appBottleLow : 0;
                        obj.appBottleHigh = appBottleHigh ? appBottleHigh : 0;
                        obj.appExtLow = appExtLow ? appExtLow : 0;
                        obj.appExtHigh = appExtHigh ? appExtHigh : 0;
                        obj.appQuantity = appQuantity ? appQuantity : 0;
                        obj.appClosed = appClosed ? appClosed : '';
                        obj.appConsignorLocation = appConsignorLocation ? appConsignorLocation : '';
                        obj.appScreener = appScreener ? appScreener : 0;
                        obj.appEvent = appEvent ? appEvent : 0;
                        obj.appPhoto = appPhoto ? appPhoto : 0;
                        appraisalDataArr.push(obj);

                    }

                }
                log.debug('appraisalDataArr :: ', JSON.stringify(appraisalDataArr));
                return appraisalDataArr;
            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);

            }

        }

        function searchConsignment() {
            var title = 'searchConsignment';
            try {
                var consignmentRecArray = [];
                var conSearchObj = search.create({
                    type: "customrecord_consignment",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_lines_created", "is", "F"]
                    ],
                    columns: [
                        search.createColumn({
                            name: "internalid"
                        }),
                        search.createColumn({
                            name: "custrecord_consignment_appraisal"
                        })
                    ]
                });
                var searchData = conSearchObj.run().getRange(0, 1000);

                if (searchData.length > 0) {
                    for (var s = 0; s < searchData.length; s++) {
                        var conObj = {};

                        conObj.conId = searchData[s].getValue('internalid') ? searchData[s].getValue('internalid') : '';
                        conObj.appraisalId = searchData[s].getValue('custrecord_consignment_appraisal') ? searchData[s].getValue('custrecord_consignment_appraisal') : '';
                        log.debug('conObj::', conObj);
                        consignmentRecArray.push(conObj);
                    }

                }
                return consignmentRecArray;

            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);

            }

        }

        function createConsignmentLines(consignmentId, appRecFileds) {
            var title = 'createConsignmentLines';
            try {

                var consignmentRec = record.load({
                    type: 'customrecord_consignment',
                    id: consignmentId,
                    isDynamic: true
                });
                var lineCount = consignmentRec.getLineCount({
                    sublistId: 'recmachcustrecord_cl_consignment'
                });
                if (lineCount == 0) {
                    for (var a = 0; a < appRecFileds.length; a++) {
                        createNewLine(appRecFileds[a], consignmentId, consignmentRec);
                        if (appRecFileds[a].appScreener) {
                            createNewLine(appRecFileds[a], consignmentId, consignmentRec, "screener");
                        } else if (appRecFileds[a].appEvent) {
                            createNewLine(appRecFileds[a], consignmentId, consignmentRec, "event");
                        }
                    }



                }
                consignmentRec.setValue({
                    fieldId: 'custrecord_lines_created',
                    value: true,
                    ignoreFieldChange: true
                });
                var consignmentRecId = consignmentRec.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
                var consignmentRec = record.load({
                    type: 'customrecord_consignment',
                    id: consignmentRecId
                });
                updateSplitUrl(consignmentRec);
                var consignmentRecId = consignmentRec.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
                log.debug('consignmentRecId', consignmentRecId);

            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);

            }

        }

        function createNewLine(lineObj, consignmentId, consignmentRec, type) {
            try {
                var title = 'createNewLine() :: ';
                lineObj.appEvent = lineObj.appEvent ? lineObj.appEvent : 0;
                lineObj.appScreener = lineObj.appScreener ? lineObj.appScreener : 0;
                lineObj.appQuantity = lineObj.appQuantity ? lineObj.appQuantity : 0;
                var actualQty = lineObj.appQuantity - lineObj.appEvent - lineObj.appScreener
                consignmentRec.selectNewLine({
                    sublistId: 'recmachcustrecord_cl_consignment'
                });
                consignmentRec.setCurrentSublistValue({
                    sublistId: 'recmachcustrecord_cl_consignment',
                    fieldId: 'custrecord_cl_consignment',
                    value: consignmentId,
                    ignoreFieldChange: true
                });

                if (lineObj.appItem) {
                    consignmentRec.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_item',
                        value: lineObj.appItem,
                        ignoreFieldChange: true
                    });
                }

                if (lineObj.appDescription) {
                    consignmentRec.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_item_description',
                        value: lineObj.appDescription,
                        ignoreFieldChange: true
                    });
                }
                if (lineObj.appBottleLow) {
                    consignmentRec.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_bottle_low',
                        value: lineObj.appBottleLow,
                        ignoreFieldChange: true
                    });
                }
                if (lineObj.appBottleHigh) {
                    consignmentRec.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_bottle_high',
                        value: lineObj.appBottleHigh,
                        ignoreFieldChange: true
                    });
                }

                if (actualQty != 0 && !type) {
                    consignmentRec.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_qty_expected',
                        value: actualQty,
                        ignoreFieldChange: true
                    });
                } else if (type == "screener" || type == "event") {
                    consignmentRec.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_qty_expected',
                        value: 1,
                        ignoreFieldChange: true
                    });
                }

                if (lineObj.appConsignorLocation) {
                    consignmentRec.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_consignor_location',
                        value: lineObj.appConsignorLocation,
                        ignoreFieldChange: true
                    });
                }
                if (lineObj.appScreener && type == "screener") {
                    consignmentRec.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_screener',
                        value: lineObj.appScreener,
                        ignoreFieldChange: true
                    });
                    consignmentRec.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_type',
                        value: SCREENER_TYPE,
                        ignoreFieldChange: true
                    });
                }
                if (lineObj.appEvent && type == "event") {
                    consignmentRec.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_event',
                        value: lineObj.appEvent,
                        ignoreFieldChange: true
                    });
                    consignmentRec.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_type',
                        value: EVENT_TYPE,
                        ignoreFieldChange: true
                    });
                }

                if (lineObj.appPhoto && !type) {
                    consignmentRec.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_photo',
                        value: lineObj.appPhoto,
                        ignoreFieldChange: true
                    });
                }

                consignmentRec.commitLine({
                    sublistId: 'recmachcustrecord_cl_consignment'
                });

            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);

            }
        }

        function updateSplitUrl(recObj) {
            try {
                var title = "updateSplitUrl() :: ";
                var line = recObj.getLineCount({
                    sublistId: 'recmachcustrecord_cl_consignment'
                });
                log.debug('line', line);
                for (var i = 0; i < line; i++) {
                    var tempConsignmentItemName = recObj.getSublistText({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_item',
                        line: i
                    });
                    var consignmentItemName = tempConsignmentItemName.replace(/ /g, '==');
                    var ConsignmentScreener = recObj.getSublistText({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_screener',
                        line: i
                    });
                    var consignmentBottleLow = recObj.getSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_bottle_low',
                        line: i
                    });
                    var ConsignmentBottleHigh = recObj.getSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_bottle_high',
                        line: i
                    });
                    var ConsignmentEvent = recObj.getSublistText({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_event',
                        line: i
                    });
                    var consignmentQty = recObj.getSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'custrecord_cl_qty_expected',
                        line: i
                    });
                    var consignmentLineId = recObj.getSublistValue({
                        sublistId: 'recmachcustrecord_cl_consignment',
                        fieldId: 'id',
                        line: i
                    });

                    log.debug('consignmentLineId', consignmentLineId);
                    if (consignmentQty && consignmentItemName) {
                        var suiteletUrl = '/app/site/hosting/scriptlet.nl?script=customscript_link_suitelet_split_lines&deploy=1&itemname=' + consignmentItemName + '&itemqty=' + consignmentQty + '&conlineid=' + consignmentLineId + '&consignrecid=' + recObj.id + '&screener=' + ConsignmentScreener + '&event=' + ConsignmentEvent + '&bottlelow=' + consignmentBottleLow + '&bottleHigh=' + ConsignmentBottleHigh
                        log.debug('suiteletUrl :: ', suiteletUrl);
                        recObj.setSublistValue({
                            sublistId: 'recmachcustrecord_cl_consignment',
                            fieldId: 'custrecord_cl_split_link',
                            line: i,
                            value: suiteletUrl
                        });

                    }
                }
            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);

            }
        }
        return {
            execute: createConsignment
        };

    });