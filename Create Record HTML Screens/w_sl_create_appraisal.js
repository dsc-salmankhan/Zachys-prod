/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
var ITEM_BASE_URL = '/app/common/item/item.nl?id=';

var APPRAISAL_HTML_CONTENT = '5326';
define(['N/record', 'N/file', 'N/search', 'N/url', 'N/runtime'],
    function (record, file, search, url, runtime) {
        function onRequest(context) {
            var title = "onRequest";
            try {
                if (context.request.method === 'GET') {
                    log.debug("onRequest:", "onRequest() GET gethod start");
                    var template = '';
                    var request = context.request;
                    var parameters = request.parameters;
                    var appraisalId = parameters.recid;
                    var requestType = parameters.requestType;
                    var itemInternalId = parameters.itemInternalId;
                    if (requestType == "hammerprice") {
                        var hammerPriceArr = getHammerPriceData(itemInternalId);
                        var oResponse = {};
                        oResponse.type = "Success";
                        oResponse.hammerPriceArr = hammerPriceArr;
                        context.response.writeLine(JSON.stringify(oResponse));

                    } else {
                        if (appraisalId) {
                            var appraisalInfoData = getAppraisalRecordInfo(appraisalId);
                            var itemsDataArr = getItemsDetails();
                            var suiteletUrl = getScriptUrl();
                            var appraisalLinesDataArr = getExistingAppraisalLines(appraisalId);
                            if (!appraisalId) {
                                context.response.write("<p>Invalid Record Id.</p>");
                            }

                            var fileContent = file.load({
                                id: APPRAISAL_HTML_CONTENT
                            }).getContents();
                            template = fileContent;
                            template = template.replace(/{{WINES_CATALOG}}/g, JSON.stringify(itemsDataArr));
                            template = template.replace(/{{APPRAISAL_INFO_DATA}}/g, JSON.stringify(appraisalInfoData));
                            template = template.replace(/{{SUITELET_URL}}/g, suiteletUrl);
                            template = template.replace(/{{APP_LINES_DATA}}/g, JSON.stringify(appraisalLinesDataArr));
                            context.response.write(template);
                        } else {
                            context.response.write("<p>Invalid Record Id.</p>");
                        }

                    }

                } else {
                    log.debug("onRequest:", "onRequest() post method start");
                    var request = context.request;
                    var parameters = request.parameters;
                    var requestType = parameters.requestType;
                    var bodyData = request.body;
                    if (bodyData) {
                        var objData = JSON.parse(bodyData);
                        if (requestType == "addAppraisalLine") {
                            var objAppraisalData = objData.objAppraisal;
                            var appLineObjData = objData.appraisalLinesData;
                            var globalEstObjData = getGlobalEstimate(appLineObjData.internalId, objAppraisalData.appraisalCurrency);

                            appLineObjData.lowPrice = globalEstObjData.bottleLow ? globalEstObjData.bottleLow : '';
                            appLineObjData.highPrice = globalEstObjData.bottleHigh ? globalEstObjData.bottleHigh : '';
                            appLineObjData.defaultLowPrice = globalEstObjData.bottleLow ? globalEstObjData.bottleLow : '';
                            appLineObjData.defaultHightPrice = globalEstObjData.bottleHigh ? globalEstObjData.bottleHigh : '';
                            appLineObjData.case = globalEstObjData.numOfBottleInCase ? globalEstObjData.numOfBottleInCase : '';
                            appLineObjData.lastUpdated = globalEstObjData.lastModified ? globalEstObjData.lastModified : '';
                            appLineObjData.lastUsed = globalEstObjData.modifiedBy ? globalEstObjData.modifiedBy : '';
                            appLineObjData.globalEstimateInternalId = globalEstObjData.internalid ? globalEstObjData.internalid : '';

                            var createdAppLineObjData = createAppraisalLine(appLineObjData, objAppraisalData)
                            var oResponse = {};
                            oResponse.type = "Success";
                            oResponse.createdAppLineObjData = createdAppLineObjData;
                            context.response.writeLine(JSON.stringify(oResponse));
                        } else if (requestType == "updateAppraisalLine") {
                            if (objData.objAppraisal && objData.appraisalLinesData) {
                                var creationData = objData.appraisalLinesData;
                                var objAppraisalData = objData.objAppraisal;
                                var appraisalLinesToRemove = objData.appraisalLinesToRemove;

                                log.debug("appraisalLinesToRemove:", JSON.stringify(appraisalLinesToRemove));
                                log.debug("creationData:", JSON.stringify(creationData));
                                removeAppraisalLines(appraisalLinesToRemove);
                                updateAppraisalLines(creationData, objAppraisalData);


                            }

                        }
                    }
                }

            } catch (e) {
                log.error("ERROR IN :: " + title, e.message);
                var oResponse = {};
                oResponse.type = "Error";
                oResponse.detail = e.message
                context.response.writeLine(JSON.stringify(oResponse));
            }

        }

        function getItemsDetails() {
            var itemsDataArr = [];
            var lotItemsSearch = search.create({
                type: search.Type.INVENTORY_ITEM,
                filters: [
                    ["isinactive", "is", "F"]
                ],
                columns: [{
                    name: 'internalid'
                }, {
                    name: 'itemid'
                }, {
                    name: 'displayname'
                }, {
                    name: 'custitem_size'
                }, {
                    name: 'custitem_vintage'
                }, {
                    name: 'custitem_last_update'
                }, {
                    name: 'custitem_producer'
                }, {
                    name: 'custitem_varietal'
                }, {
                    name: 'cseg_region'
                }, {
                    name: 'cseg_country'
                }, {
                    name: 'cseg_appellation'
                }]
            });

            var searchData = [];
            var count = 0;
            var pageSize = 1000;
            var start = 0;
            do {
                var searchObjArr = lotItemsSearch.run().getRange(start, start + pageSize);

                searchData = searchData.concat(searchObjArr);
                count = searchObjArr.length;
                start += pageSize;
            } while (count == pageSize);
            if (searchData) {
                log.debug("searchData.length:", searchData.length);
                for (var i = 0; i < searchData.length; i++) {
                //for (var i = 0; i < 40; i++) {
                    var internalid = searchData[i].getValue({
                        name: 'internalid'
                    });
                    var name = searchData[i].getValue({
                        name: 'displayname'
                    });
                    var sizeId = searchData[i].getValue({
                        name: 'custitem_size'
                    });
                    var size = searchData[i].getText({
                        name: 'custitem_size'
                    });
                    var vintageId = searchData[i].getValue({
                        name: 'custitem_vintage'
                    });
                    var vintage = searchData[i].getText({
                        name: 'custitem_vintage'
                    });
                    var lastUpdated = '';
                    var tempLastUpdated = searchData[i].getValue({
                        name: 'custitem_last_update'
                    });
                    var SKU = searchData[i].getValue({
                        name: 'itemid'
                    });
                    var producer = searchData[i].getText({
                        name: 'custitem_producer'
                    });
                    var producerId = searchData[i].getValue({
                        name: 'custitem_producer'
                    });
                    var varietal = searchData[i].getText({
                        name: 'custitem_varietal'
                    });
                    var varietalId = searchData[i].getValue({
                        name: 'custitem_varietal'
                    });
                    var region = searchData[i].getText({
                        name: 'cseg_region'
                    });
                    var regionId = searchData[i].getValue({
                        name: 'cseg_region'
                    });
                    var country = searchData[i].getText({
                        name: 'cseg_country'
                    });
                    var countryId = searchData[i].getValue({
                        name: 'cseg_country'
                    });
                    var appellation = searchData[i].getValue({
                        name: 'cseg_appellation'
                    });

                    var itemUrl = ITEM_BASE_URL + internalid;

                    if (tempLastUpdated) {
                        lastUpdated = tempLastUpdated.split(' ')[0]
                    }

                    var data = {
                        lineId: i,
                        internalId: internalid,
                        name: name.replace(/'/g, "---").replace(/"/g, '####'),
                        size: size,
                        sizeId: sizeId,
                        vintage: vintage,
                        vintageId: vintageId,
                        lowPrice: '',
                        highPrice: '',
                        defaultLowPrice: '',
                        defaultHightPrice: '',
                        estType: '',
                        class: '',
                        apellation: '',
                        producer: producer.replace(/'/g, "---").replace(/"/g, '####'),
                        producerId: producerId,
                        case: '',
                        qty: 0,
                        SKU: SKU,
                        type: '',
                        cage: '',
                        photo: '',
                        lastUpdated: lastUpdated,
                        lastUsed: '',
                        varietal: varietal.replace(/'/g, "---").replace(/"/g, '####'),
                        varietalId: varietalId,
                        region: region.replace(/'/g, "---").replace(/"/g, '####'),
                        regionId: regionId,
                        country: country.replace(/'/g, "---").replace(/"/g, '####'),
                        countryId: countryId,
                        consignorLocation: '',
                        provenance: '',
                        screener: '',
                        event: '',
                        photoNumber: '',
                        appLineId: '',
                        appellation: appellation,
                        itemUrl: itemUrl,
                        isAppLineEdited: false
                    }

                    itemsDataArr.push(data)
                }
            }

            return itemsDataArr;
        }

        function getAppraisalRecordInfo(recId) {
            var objData = {};
            var appraisalSearchObj = search.create({
                type: "customrecord_appraisal",
                filters: [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["internalid", "anyof", recId]
                ],
                columns: [
                    search.createColumn({
                        name: "internalid",
                        summary: "GROUP"
                    }),
                    search.createColumn({
                        name: "name",
                        summary: "GROUP"
                    }),
                    search.createColumn({
                        name: "custrecord_appraisal_consignment",
                        summary: "GROUP"
                    }),
                    search.createColumn({
                        name: "custrecord_app_currency",
                        summary: "GROUP"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_quantity",
                        join: 'custrecord_applines_appraisal',
                        summary: "SUM"
                    }),
                    search.createColumn({
                        name: "companyname",
                        join: 'custrecord_app_consignor',
                        summary: "GROUP"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_ext_low_rounded",
                        join: 'custrecord_applines_appraisal',
                        summary: "SUM"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_ext_high_rounded",
                        join: 'custrecord_applines_appraisal',
                        summary: "SUM"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_bottle_in_case",
                        join: 'custrecord_applines_appraisal',
                        summary: "SUM"
                    })

                ]
            });

            var appraisalData = appraisalSearchObj.run().getRange(0, 1000);
            if (appraisalData) {
                log.debug("appraisalData:", JSON.stringify(appraisalData));
                var appraisalInternalid = appraisalData[0].getValue({
                    name: "internalid",
                    summary: "GROUP"
                });
                var appraisalName = appraisalData[0].getValue({
                    name: "name",
                    summary: "GROUP"
                });
                var appraisalConsignmentId = appraisalData[0].getValue({
                    name: "custrecord_appraisal_consignment",
                    summary: "GROUP"
                });
                var appraisalCurrency = appraisalData[0].getValue({
                    name: "custrecord_app_currency",
                    summary: "GROUP"
                });
                var appraisalQtySum = appraisalData[0].getValue({
                    name: "custrecord_applines_quantity",
                    join: 'custrecord_applines_appraisal',
                    summary: "SUM"
                });
                var appraisalConsignor = appraisalData[0].getValue({
                    name: "companyname",
                    join: 'custrecord_app_consignor',
                    summary: "GROUP"
                });
                var appraisalLinesExtBottleLowRoundedSum = appraisalData[0].getValue({
                    name: "custrecord_applines_ext_low_rounded",
                    join: 'custrecord_applines_appraisal',
                    summary: "SUM"
                });
                var appraisalLinesExtBottleHighRoundedSum = appraisalData[0].getValue({
                    name: "custrecord_applines_ext_high_rounded",
                    join: 'custrecord_applines_appraisal',
                    summary: "SUM"
                });
                var appraisalBottleInCase = appraisalData[0].getValue({
                    name: "custrecord_applines_bottle_in_case",
                    join: 'custrecord_applines_appraisal',
                    summary: "SUM"
                });

                objData.appraisalInternalid = appraisalInternalid;
                objData.appraisalConsignor = appraisalConsignor ? appraisalConsignor : '';
                objData.appraisalName = appraisalName ? appraisalName : '';
                objData.appraisalBottleInCase = appraisalBottleInCase ? appraisalBottleInCase : '';
                objData.appraisalLinesExtBottleLowRoundedSum = appraisalLinesExtBottleLowRoundedSum ? appraisalLinesExtBottleLowRoundedSum : '';
                objData.appraisalLinesExtBottleHighRoundedSum = appraisalLinesExtBottleHighRoundedSum ? appraisalLinesExtBottleHighRoundedSum : '';
                objData.appraisalCurrency = appraisalCurrency ? appraisalCurrency : '';
                objData.appraisalConsignmentId = appraisalConsignmentId ? appraisalConsignmentId : '';
                objData.appraisalQtySum = appraisalQtySum ? appraisalQtySum : '';

            }

            return objData;
        }

        function getScriptUrl() {
            var outputUrl = url.resolveScript({
                scriptId: 'customscript_w_sl_create_appraisal',
                deploymentId: 'customdeploy_w_sl_create_appraisal',
                //returnExternalUrl: true
            });

            log.debug("outputUrl:", outputUrl);
            return outputUrl;
        }

        function getGlobalEstimate(itemId, currency) {
            try {
                var title = 'getGlobalEstimate() ';
                var globalSearch = search.create({
                    type: 'customrecord_global_estimate',

                    filters: [
                        ["custrecord_global_est_currency", search.Operator.ANYOF, currency],
                        'AND',
                        ["custrecord_global_est_item", search.Operator.ANYOF, itemId]
                    ],
                    columns: [{
                        name: "internalid"
                    }, {
                        name: "custrecord_global_est_item"
                    }, {
                        name: "custrecord_global_est_high_bttl_est"
                    }, {
                        name: "custrecord_global_est_low_bttl_est"
                    }, {
                        name: "custrecord_global_est_bottleincase"
                    }, {
                        name: "custrecord_global_est_caselowest"
                    }, {
                        name: "custrecord_global_est_casehighest"
                    }, {
                        name: "name"
                    }, {
                        name: "custrecord_global_est_modified_by"
                    }, {
                        name: "custrecord_global_est_last_modified"
                    }]
                });
                var searchGlobalEst = globalSearch.run().getRange({
                    start: 0,
                    end: 500
                });

                var estObj = {};
                if (searchGlobalEst.length > 0) {
                    estObj.internalid = searchGlobalEst[0].getValue('internalid');
                    estObj.numOfBottleInCase = searchGlobalEst[0].getValue('custrecord_global_est_bottleincase');
                    estObj.bottleLow = searchGlobalEst[0].getValue('custrecord_global_est_low_bttl_est');
                    estObj.bottleHigh = searchGlobalEst[0].getValue('custrecord_global_est_high_bttl_est');
                    estObj.bottleLowCash = searchGlobalEst[0].getValue('custrecord_global_est_caselowest');
                    estObj.bottleHigCash = searchGlobalEst[0].getValue('custrecord_global_est_casehighest');
                    estObj.lastModified = searchGlobalEst[0].getValue('custrecord_global_est_last_modified');
                    estObj.modifiedBy = searchGlobalEst[0].getText('custrecord_global_est_modified_by');
                    estObj.modifiedById = searchGlobalEst[0].getValue('custrecord_global_est_modified_by');

                    return estObj;
                }
                return estObj;
            } catch (e) {
                var estObj = {};
                log.error(title + "Error ::", e.message);
                estObj.type = "error";
                estObj.message = e.message;
                context.response.writeLine(JSON.stringify(estObj));
            }
        }

        function getExistingAppraisalLines(recId) {
            var linesData = [];
            var appraisalLinesSearchObj = search.create({
                type: "customrecord_appraisal_lines",
                filters: [
                    ["custrecord_applines_closed", "is", "F"],
                    "AND",
                    ["custrecord_applines_appraisal", "anyof", recId]
                ],
                columns: [

                    search.createColumn({
                        name: "internalid"
                    }),
                    search.createColumn({
                        name: "name",
                        sort: search.Sort.DESC
                    }),
                    search.createColumn({
                        name: "custrecord_applines_item"
                    }),
                    search.createColumn({
                        name: "itemid",
                        join: "custrecord_applines_item"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_description"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_quantity"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_global_estimate"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_last_modified"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_modified_by"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_bottle_low"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_bottle_high"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_case_low"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_case_high"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_ext_low"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_ext_high"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_vintage"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_size"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_producer"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_varietal"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_country"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_region"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_bottle_in_case"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_overwrite_ge"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_consignor_location"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_provenance"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_screener"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_event"
                    }),
                    search.createColumn({
                        name: "custrecord_applines_photo"
                    })

                ]
            });

            var appraisalLinesData = appraisalLinesSearchObj.run().getRange(0, 1000);
            if (appraisalLinesData) {
                for (var i = 0; i < appraisalLinesData.length; i++) {
                    var appraisalLineInternalId = appraisalLinesData[i].getValue({
                        name: "internalid"
                    });
                    var appraisalLineIdName = appraisalLinesData[i].getValue({
                        name: "name"
                    });
                    var appraisalLineItem = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_item"
                    });
                    var appraisalLineDescription = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_description"
                    });
                    var appraisalLineQty = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_quantity"
                    });
                    var appraisalLineGlobalEstimate = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_global_estimate"
                    });
                    var appraisalLineLstModified = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_last_modified"
                    });
                    var appraisalLineModifiedBy = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_modified_by"
                    });
                    var appraisalLineBottleLow = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_bottle_low"
                    });
                    var appraisalLineBottleHigh = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_bottle_high"
                    });
                    var appraisalLineExtLow = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_ext_low"
                    });
                    var appraisalLineExtHigh = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_ext_high"
                    });
                    var appraisalLineVintage = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_vintage"
                    });
                    var appraisalLineSizeId = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_size"
                    });
                    var appraisalLineSize = appraisalLinesData[i].getText({
                        name: "custrecord_applines_size"
                    });
                    var appraisalLineProducer = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_producer"
                    });
                    var appraisalLineVarietal = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_varietal"
                    });
                    var appraisalLineCountry = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_country"
                    });
                    var appraisalLineRegion = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_region"
                    });
                    var appraisalLineBottleInCase = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_bottle_in_case"
                    });
                    var isGlobalEstimateCustom = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_overwrite_ge"
                    });
                    var appraisalLineConsignorLocation = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_consignor_location"
                    });
                    var appraisalLineProvenance = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_provenance"
                    });
                    var appraisalLineScreener = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_screener"
                    });
                    var appraisalLineEvent = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_event"
                    });
                    var appraisalLinePhoto = appraisalLinesData[i].getValue({
                        name: "custrecord_applines_photo"
                    });
                    var sku = appraisalLinesData[i].getValue({
                        name: "itemid",
                        join: "custrecord_applines_item"
                    });

                    var itemUrl = ITEM_BASE_URL + appraisalLineItem;


                    var estimateType = isGlobalEstimateCustom ? 'custom' : '';
                    var data = {
                        lineId: i,
                        appraisalLineInternalId: appraisalLineInternalId,
                        internalId: appraisalLineItem,
                        name: appraisalLineDescription.replace(/'/g, "---").replace(/"/g, '####'),
                        size: appraisalLineSize,
                        sizeId: appraisalLineSizeId,
                        vintage: appraisalLineVintage,
                        vintageId: '',
                        lowPrice: appraisalLineBottleLow,
                        highPrice: appraisalLineBottleHigh,
                        defaultLowPrice: appraisalLineBottleLow,
                        defaultHightPrice: appraisalLineBottleHigh,
                        estType: '',
                        existinEstType: estimateType,
                        class: '',
                        apellation: '',
                        producer: appraisalLineProducer.replace(/'/g, "---").replace(/"/g, '####'),
                        producerId: '',
                        case: appraisalLineBottleInCase,
                        qty: appraisalLineQty,
                        SKU: sku,
                        type: '',
                        cage: '',
                        photo: '',
                        lastUpdated: appraisalLineLstModified,
                        lastUsed: appraisalLineModifiedBy,
                        varietal: appraisalLineVarietal.replace(/'/g, "---").replace(/"/g, '####'),
                        varietalId: '',
                        region: appraisalLineRegion.replace(/'/g, "---").replace(/"/g, '####'),
                        regionId: '',
                        country: appraisalLineCountry.replace(/'/g, "---").replace(/"/g, '####'),
                        countryId: '',
                        globalEstimateInternalId: appraisalLineGlobalEstimate,
                        extLowEstimate: appraisalLineExtLow,
                        extHighEstimate: appraisalLineExtHigh,
                        consignorLocation: appraisalLineConsignorLocation,
                        provenance: appraisalLineProvenance,
                        screener: appraisalLineScreener,
                        event: appraisalLineEvent,
                        photoNumber: appraisalLinePhoto,
                        appLineId: appraisalLineIdName,
                        appellation: '',
                        itemUrl: itemUrl,
                        isAppLineEdited: false

                    }

                    linesData.push(data);
                }
            }

            return linesData;
        }

        function createAppraisalLine(appLineObjData, objAppraisalData) {
            var data = appLineObjData;

            var appLineRecObj = record.create({
                type: "customrecord_appraisal_lines",
                isDynamic: true,
            });
            appLineRecObj.setValue({
                fieldId: "custrecord_applines_appraisal",
                value: objAppraisalData.appraisalId,
                ignoreFieldChange: true
            });
            if (data.name) {
                var description = data.name.replace(/\\/g, "")
                appLineRecObj.setValue({
                    fieldId: "custrecord_applines_description",
                    value: description,
                    ignoreFieldChange: true
                });

            }

            if (data.region) {
                var regionValue = data.region.replace(/---/g, "'").replace(/####/g, '"');
                appLineRecObj.setValue({
                    fieldId: "custrecord_applines_region",
                    value: regionValue,
                    ignoreFieldChange: true
                });

            }
            if (data.varietal) {
                var varietalValue = data.varietal.replace(/---/g, "'").replace(/####/g, '"')
                appLineRecObj.setValue({
                    fieldId: "custrecord_applines_varietal",
                    value: varietalValue,
                    ignoreFieldChange: true
                });

            }

            if (data.country) {
                var countryValue = data.country.replace(/---/g, "'").replace(/####/g, '"')
                appLineRecObj.setValue({
                    fieldId: "custrecord_applines_country",
                    value: countryValue,
                    ignoreFieldChange: true
                });

            }

            var dataBottleInCase = data.case;
            appLineRecObj.setValue({
                fieldId: "custrecord_applines_bottle_in_case",
                value: dataBottleInCase,
                ignoreFieldChange: true
            });
            appLineRecObj.setValue({
                fieldId: "custrecord_applines_item",
                value: data.internalId,
                ignoreFieldChange: true
            });
            appLineRecObj.setValue({
                fieldId: "custrecord_applines_quantity",
                value: data.qty,
                ignoreFieldChange: true
            });

            var globalEstIdValue = data.globalEstimateInternalId;
            appLineRecObj.setValue({
                fieldId: "custrecord_applines_global_estimate",
                value: globalEstIdValue,
                ignoreFieldChange: true
            });

            var modifiedDate = data.lastUpdated ? new Date(data.lastUpdated) : '';
            if (modifiedDate) {
                appLineRecObj.setValue({
                    fieldId: "custrecord_applines_last_modified",
                    value: modifiedDate,
                    ignoreFieldChange: true
                });

            }

            var modifiedByName = data.lastUsed;
            if (modifiedByName) {
                appLineRecObj.setValue({
                    fieldId: "custrecord_applines_modified_by",
                    value: modifiedByName,
                    ignoreFieldChange: true
                });

            }

            if (data.estType == 'custom') {
                appLineRecObj.setValue({
                    fieldId: "custrecord_applines_overwrite_ge",
                    value: true,
                    ignoreFieldChange: true
                });

            }
            appLineRecObj.setValue({
                fieldId: "custrecord_applines_bottle_low",
                value: data.lowPrice,
                ignoreFieldChange: true
            });
            appLineRecObj.setValue({
                fieldId: "custrecord_applines_bottle_high",
                value: data.highPrice,
                ignoreFieldChange: true
            });
            appLineRecObj.setValue({
                fieldId: "custrecord_applines_case_low",
                value: data.caseLowPrice,
                ignoreFieldChange: true
            });
            appLineRecObj.setValue({
                fieldId: "custrecord_applines_case_high",
                value: data.caseHighPrice,
                ignoreFieldChange: true
            });
            appLineRecObj.setValue({
                fieldId: "custrecord_applines_ext_low",
                value: data.extLowPrice,
                ignoreFieldChange: true
            });
            appLineRecObj.setValue({
                fieldId: "custrecord_applines_ext_high",
                value: data.extHighPrice,
                ignoreFieldChange: true
            });
            appLineRecObj.setValue({
                fieldId: "custrecord_applines_vintage",
                value: data.vintage,
                ignoreFieldChange: true
            });
            appLineRecObj.setValue({
                fieldId: "custrecord_applines_size",
                value: data.sizeId,
                ignoreFieldChange: true
            });
            if (data.producer) {
                var producerValue = data.producer.replace(/---/g, "'").replace(/####/g, '"')
                appLineRecObj.setValue({
                    fieldId: "custrecord_applines_producer",
                    value: producerValue,
                    ignoreFieldChange: true
                });

            }
            if (data.consignorLocation) {
                appLineRecObj.setValue({
                    fieldId: "custrecord_applines_consignor_location",
                    value: data.consignorLocation,
                    ignoreFieldChange: true
                });
            }
            if (data.provenance) {
                appLineRecObj.setValue({
                    fieldId: "custrecord_applines_provenance",
                    value: data.provenance,
                    ignoreFieldChange: true
                });
            }
            if (data.screener) {
                appLineRecObj.setValue({
                    fieldId: "custrecord_applines_screener",
                    value: data.screener,
                    ignoreFieldChange: true
                });
            }
            if (data.event) {
                appLineRecObj.setValue({
                    fieldId: "custrecord_applines_event",
                    value: data.event,
                    ignoreFieldChange: true
                });
            }
            if (data.photoNumber) {
                appLineRecObj.setValue({
                    fieldId: "custrecord_applines_photo",
                    value: data.photoNumber,
                    ignoreFieldChange: true
                });
            }

            appLineId = appLineRecObj.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });

            data.appraisalLineInternalId = appLineId;
            log.debug("Appraisal line created", appLineId);

            return data;

        }

        function updateAppraisalLines(creationData, objAppraisalData) {
            var userObj = runtime.getCurrentUser();
            for (var i = 0; i < creationData.length; i++) {
                var data = creationData[i];
                var globalEstimateId = '';
                var botteInCaseValue = '';
                if (data.estType == 'updateestimate') {
                    var objGlobalEstData = createCustomGlobalEstimate(data, objAppraisalData);
                    globalEstimateId = objGlobalEstData.globalEstId ? objGlobalEstData.globalEstId : '';
                    botteInCaseValue = objGlobalEstData.bottleIncase ? objGlobalEstData.bottleIncase : '';
                }

                if (data.isAppLineEdited == true && data.appraisalLineInternalId) {
                    var dataBottleInCase = botteInCaseValue ? botteInCaseValue : data.case;
                    var globalEstIdValue = globalEstimateId ? globalEstimateId : data.globalEstimateInternalId;
                    var modifiedByName = globalEstimateId ? userObj.name : data.lastUsed;
                    var overwriteGe = data.estType == 'custom' ? true : false;
                    var tempDateObj = new Date();
                    var modifiedDate = globalEstimateId ? tempDateObj : data.lastUpdated ? new Date(data.lastUpdated) : '';
                    var producerValue = data.producer ? data.producer.replace(/---/g, "'").replace(/####/g, '"') : '';
                    data.consignorLocation = data.consignorLocation ? data.consignorLocation : '';
                    data.provenance = data.provenance ? data.provenance : '';
                    data.screener = data.screener ? data.screener : '';
                    data.event = data.event ? data.event : '';
                    data.photoNumber = data.photoNumber ? data.photoNumber : '';

                    record.submitFields({
                        type: 'customrecord_appraisal_lines',
                        id: data.appraisalLineInternalId,
                        values: {
                            custrecord_applines_bottle_in_case: dataBottleInCase,
                            custrecord_applines_quantity: data.qty,
                            custrecord_applines_global_estimate: globalEstIdValue,
                            custrecord_applines_last_modified: modifiedDate,
                            custrecord_applines_modified_by: modifiedByName,
                            custrecord_applines_overwrite_ge: overwriteGe,
                            custrecord_applines_bottle_low: data.lowPrice,
                            custrecord_applines_bottle_high: data.highPrice,
                            custrecord_applines_case_low: data.caseLowPrice,
                            custrecord_applines_case_high: data.caseHighPrice,
                            custrecord_applines_ext_low: data.extLowPrice,
                            custrecord_applines_ext_high: data.extHighPrice,
                            custrecord_applines_producer: producerValue,
                            custrecord_applines_consignor_location: data.consignorLocation,
                            custrecord_applines_provenance: data.provenance,
                            custrecord_applines_screener: data.screener,
                            custrecord_applines_event: data.event,
                            custrecord_applines_photo: data.photoNumber

                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });

                }
            }
        }


        function removeAppraisalLines(appraisalLinesToRemove) {
            try {
                for (var i = 0; appraisalLinesToRemove.length; i++) {
                    log.debug("appraisalLinesToRemove", appraisalLinesToRemove[i])
                    var featureRecord = record.delete({
                        type: 'customrecord_appraisal_lines',
                        id: appraisalLinesToRemove[i],
                    });
                }

            } catch (e) {
                log.error("Error message:", e.message);
            }
        }

        function createCustomGlobalEstimate(data, objAppraisalData) {
            var bottleIncase;
            if (data.sizeId) {
                var sizeRecObj = search.lookupFields({
                    type: 'customrecord_size_list',
                    id: data.sizeId,
                    columns: 'custrecord_size_bottleincase'
                });
                bottleIncase = sizeRecObj.custrecord_size_bottleincase ? sizeRecObj.custrecord_size_bottleincase : '';
            }
            var globalEstObj = record.create({
                type: "customrecord_global_estimate",
                isDynamic: true,
            });

            if (data.internalId) {
                globalEstObj.setValue({
                    fieldId: "custrecord_global_est_item",
                    value: data.internalId,
                    ignoreFieldChange: true
                });
            }

            if (bottleIncase) {
                globalEstObj.setValue({
                    fieldId: "custrecord_global_est_bottleincase",
                    value: bottleIncase,
                    ignoreFieldChange: true
                });

            }
            if (objAppraisalData.appraisalCurrency) {
                globalEstObj.setValue({
                    fieldId: "custrecord_global_est_currency",
                    value: objAppraisalData.appraisalCurrency,
                    ignoreFieldChange: true
                });

            }
            if (data.lowPrice && bottleIncase) {
                var estLowPrice = parseFloat(data.lowPrice) / parseFloat(bottleIncase);
                globalEstObj.setValue({
                    fieldId: "custrecord_global_est_low_bttl_est",
                    value: estLowPrice,
                    ignoreFieldChange: true
                });
            }
            if (data.highPrice && bottleIncase) {
                var estHighPrice = parseFloat(data.highPrice) / parseFloat(bottleIncase);
                globalEstObj.setValue({
                    fieldId: "custrecord_global_est_high_bttl_est",
                    value: estHighPrice,
                    ignoreFieldChange: true
                });

            }

            if (data.lowPrice) {
                globalEstObj.setValue({
                    fieldId: "custrecord_global_est_caselowest",
                    value: data.lowPrice,
                    ignoreFieldChange: true
                });

            }

            if (data.highPrice) {
                globalEstObj.setValue({
                    fieldId: "custrecord_global_est_casehighest",
                    value: data.highPrice,
                    ignoreFieldChange: true
                });

            }
            if (data.name) {
                globalEstObj.setValue({
                    fieldId: "custrecord_global_est_description",
                    value: data.name.replace(/'/g, "---").replace(/"/g, '####'),
                    ignoreFieldChange: true
                });

            }

            if (data.sizeId) {
                globalEstObj.setValue({
                    fieldId: "custrecord_global_est_size",
                    value: data.sizeId,
                    ignoreFieldChange: true
                });

            }

            if (data.SKU) {
                globalEstObj.setValue({
                    fieldId: "custrecord_global_est_item_name",
                    value: data.SKU,
                    ignoreFieldChange: true
                });

            }

            var todayDate = new Date();
            if (data.SKU) {
                globalEstObj.setValue({
                    fieldId: "custrecord_global_est_last_modified",
                    value: todayDate,
                    ignoreFieldChange: true
                });

            }

            var globalEstId = globalEstObj.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });

            var objData = {};
            objData.globalEstId = globalEstId;
            objData.bottleIncase = bottleIncase;
            return objData;
        }

        function getHammerPriceData(itemInternalId) {
            log.debug("itemInternalId:", itemInternalId);
            var dataArr = [];
            var auctionLotSearch = search.create({
                type: "customrecord_auction_lot",
                filters: [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custrecord_auction_lot_quantity", "anyof", itemInternalId]
                ],
                columns: [{
                    name: 'name'
                }, {
                    name: 'custrecord_auction_lot_bttl_qty'
                }, {
                    name: 'custrecord_auction_lot_hammer'
                }, {
                    name: 'custrecord_auction_lot_bottle_low'
                }, {
                    name: 'custrecord_auction_lot_estimate_high'
                }, {
                    name: 'custrecord_auction_lot_hammer_bottle'
                }, {
                    name: 'custrecord_auction_lot_auction'
                }, {
                    name: 'custrecord_auction_lot_auction_date'
                }]
            });

            var searchData = [];
            var count = 0;
            var pageSize = 1000;
            var start = 0;
            do {
                var searchObjArr = auctionLotSearch.run().getRange(start, start + pageSize);

                searchData = searchData.concat(searchObjArr);
                count = searchObjArr.length;
                start += pageSize;
            } while (count == pageSize);
            if (searchData) {
                for (var i = 0; i < searchData.length; i++) {
                    var objData = {};
                    var name = searchData[i].getValue({
                        name: 'name'
                    });
                    var auctionDate = searchData[i].getValue({
                        name: 'custrecord_auction_lot_auction_date'
                    });
                    var bottlesQty = searchData[i].getValue({
                        name: 'custrecord_auction_lot_bttl_qty'
                    });
                    var hammer = searchData[i].getValue({
                        name: 'custrecord_auction_lot_hammer'
                    });
                    var bottleLowPrice = searchData[i].getValue({
                        name: 'custrecord_auction_lot_bottle_low'
                    });
                    var bottlerHighPrice = searchData[i].getValue({
                        name: 'custrecord_auction_lot_estimate_high'
                    });
                    var hammerPerBottle = searchData[i].getValue({
                        name: 'custrecord_auction_lot_hammer_bottle'
                    });
                    var auctionName = searchData[i].getText({
                        name: 'custrecord_auction_lot_auction'
                    });

                    objData.name = name ? name : '';
                    objData.auctionDate = auctionDate ? auctionDate : '';
                    objData.bottlesQty = bottlesQty ? bottlesQty : '';
                    objData.hammer = hammer ? hammer : '';
                    objData.bottleLowPrice = bottleLowPrice ? bottleLowPrice : '';
                    objData.bottlerHighPrice = bottlerHighPrice ? bottlerHighPrice : '';
                    objData.hammerPerBottle = hammerPerBottle ? hammerPerBottle : '';
                    objData.auctionName = auctionName ? auctionName : '';

                    dataArr.push(objData);
                }
            }

            log.debug("dataArr:", JSON.stringify(dataArr))
            return dataArr;
        }
        return {
            onRequest: onRequest
        };
    });