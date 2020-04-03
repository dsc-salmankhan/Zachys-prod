/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
var STOCKS_HTML_CONTENT = '134327';
var PACKAGE_TYPE = '1' //OWC
var TYPE = 101; //Mixed
var STATUS = 1; //Unassigned
var PRODUCER = 8101; //Mixed
var SIZE = 101; //Mixed
var SIZE_DESCRIPTION = 9; //Mixed Formats;
var REGION = 201; //Mixed
var APPLICATION = 601; //Mixed
var VARIETAL = 301; //Mixed
var VINTAGES = 201; //Mixed
var ITEM_TYPE = 101; //Mixed
var COUNTRY = 101; //Mixed
var RESERVE_PERCENTAGE = 80;
var CONSIGNMENT_LINE_TYPE = [1, 4, 6];

define(['N/record', 'N/file', 'N/search', 'N/url', 'SuiteScripts/library-files/bk_library_calculate_low_high_rounded_and_reserve_value.js'],
    function (record, file, search, url, librarFileObj) {
        function onRequest(context) {
            var title = "onRequest";
            try {
                if (context.request.method === 'GET') {
                    log.debug("onRequest:", "onRequest() GET gethod start");
                    var template = '';
                    var request = context.request;
                    var parameters = request.parameters;
                    var consignmentId = parameters.recid;

                    if (!consignmentId) {
                        context.response.write("<p>Invalid Record Id.</p>");
                    }

                    var auctionPlatesLinesArr = getConsignmentLinesData(consignmentId);
                    log.debug("auctionPlatesLinesArr:", JSON.stringify(auctionPlatesLinesArr))
                    var codesData = getCodesData();
                    var suiteletUrl = getScriptUrl();

                    var fileContent = file.load({
                        id: STOCKS_HTML_CONTENT
                    }).getContents();
                    template = fileContent;
                    template = template.replace(/{{LPs}}/g, JSON.stringify(auctionPlatesLinesArr));
                    template = template.replace(/{{SUITELET_URL}}/g, suiteletUrl);
                    template = template.replace(/{{CODES_DATA_OBJ}}/g, JSON.stringify(codesData));
                    context.response.write(template);

                } else {
                    log.debug("onRequest:", "onRequest() post method start");
                    var request = context.request;
                    var bodyData = request.body;
                    if (bodyData) {
                        log.debug("bodyData ::", bodyData)
                        var objData = JSON.parse(bodyData);
                        var isEachLine = objData.eachline;
                        var creationData = objData.data;
                        var isContainCombination = objData.isContainCombination;
                        if (creationData.length > 0) {
                            if (isContainCombination == true) {
                                createSingleLineSotckId(creationData[0].stockIdsDataSingle, context);
                                createSotckIdForMultiplData(creationData[0].stockIdsDataMixed, context);

                            } else if (isEachLine == true) {
                                createSingleLineSotckId(creationData, context);
                            } else {
                                createSotckIdForMultiplData(creationData, context);
                            }
                        }
                    }

                    var oResponse = {};
                    oResponse.type = "Success";
                    oResponse.detail = "Successfully completed process"
                    context.response.writeLine(JSON.stringify(oResponse));

                }

            } catch (e) {
                log.error("ERROR IN :: " + title, e.message);
                var oResponse = {};
                oResponse.type = "Error";
                oResponse.detail = e.message
                context.response.writeLine(JSON.stringify(oResponse));
            }

        }

        function getConsignmentLinesData(consignmentId) {
            var auctionPlatesLinesArr = new Array();
            var consignmentDataObj = search.lookupFields({
                type: 'customrecord_consignment',
                id: consignmentId,
                columns: ['custrecord_consignment_consignor', 'custrecord_consignment_reserve', 'custrecord_consignment_reserve_owc', 'custrecord_consignment_currency']
            });

            var sizeDataArr = getAllSizeDescription();



            var auctionPlateItemsSearchObj = search.create({
                type: "customrecord_lp_item",
                filters: [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custrecord_lp_item_lp.isinactive", "is", "F"],
                    "AND",
                    ["custrecord_lp_item_lp.custrecord_auc_lp_consignment", "anyof", consignmentId],
                    "AND",
                    ["custrecord_lp_item_lp.custrecord_auc_lp_stockid", "anyof", "@NONE@"],
                    "AND",
                    ["custrecord_lp_item_line_type", "anyof", CONSIGNMENT_LINE_TYPE],
                    "AND",
                    ["custrecord_lp_item_line_type", "noneof", "@NONE@"]
                ],
                columns: [

                    search.createColumn({
                        name: "internalid",
                        join: "custrecord_lp_item_lp"
                    }),
                    search.createColumn({
                        name: "name",
                        join: "custrecord_lp_item_lp"
                    }),
                    search.createColumn({
                        name: "internalid"
                    }),
                    search.createColumn({
                        name: "custrecord_lp_item_quantity"
                    }),
                    search.createColumn({
                        name: "custrecord_lp_item_description"
                    }),
                    search.createColumn({
                        name: "custrecord_lp_item_pack_type"
                    }),
                    search.createColumn({
                        name: "custrecord_lp_item_consignment_line"
                    }),
                    search.createColumn({
                        name: "custrecord_lp_item_item"
                    }),
                    search.createColumn({
                        name: "custitem_auction_display_name",
                        join: 'custrecord_lp_item_item'
                    }),
                    search.createColumn({
                        name: "custitem_vintage",
                        join: 'custrecord_lp_item_item'
                    }),
                    search.createColumn({
                        name: "custitem_size",
                        join: 'custrecord_lp_item_item'
                    }),
                    search.createColumn({
                        name: "custitem_producer",
                        join: 'custrecord_lp_item_item'
                    }),
                    search.createColumn({
                        name: "cseg_region",
                        join: 'custrecord_lp_item_item'
                    }),
                    search.createColumn({
                        name: "cseg_appellation",
                        join: 'custrecord_lp_item_item'
                    }),
                    search.createColumn({
                        name: "custitem_varietal",
                        join: 'custrecord_lp_item_item'
                    }),
                    search.createColumn({
                        name: "custitem_class",
                        join: 'custrecord_lp_item_item'
                    }),
                    search.createColumn({
                        name: "cseg_country",
                        join: 'custrecord_lp_item_item'
                    }),
                    search.createColumn({
                        name: "custitem_auction_tasting_note",
                        join: 'custrecord_lp_item_item'
                    }),
                    search.createColumn({
                        name: "custrecord_lp_item_ext_low"
                    }),
                    search.createColumn({
                        name: "custrecord_lp_item_ext_high"
                    }),
                    search.createColumn({
                        name: "custrecord_lp_item_assessment_codes"
                    }),
                    search.createColumn({
                        name: "custrecord_lp_item_assessment_fft"
                    }),
                    search.createColumn({
                        name: "custrecord_lp_item_internal_notes"
                    }),
                    search.createColumn({
                        name: "custrecord_lp_item_intended_sale"
                    }),
                    search.createColumn({
                        name: "custrecord_lp_item_pre_lot"
                    }),
                    search.createColumn({
                        name: "custrecord_lp_item_photo"
                    })

                ]
            });

            var searchDataLine = auctionPlateItemsSearchObj.run().getRange(0, 1000);
            if (searchDataLine.length > 0) {
                var body = {};
                var isSamePreLotNum = true;
                var previousPreLotNum = searchDataLine[0].getValue({
                    name: 'custrecord_lp_item_pre_lot'
                }) || "";

                for (var j = 0; j < searchDataLine.length; j++) {
                    var lpInternalId = searchDataLine[j].getValue({
                        name: "internalid",
                        join: "custrecord_lp_item_lp"
                    });
                    var lpName = searchDataLine[j].getValue({
                        name: "name",
                        join: "custrecord_lp_item_lp"
                    });

                    if (j == 0) {
                        body.internalid = lpInternalId ? lpInternalId : '';
                        body.id = lpName ? lpName : '';
                        body.consignor = consignmentDataObj.custrecord_consignment_consignor[0] ? consignmentDataObj.custrecord_consignment_consignor[0].value : '';
                        body.currency = consignmentDataObj.custrecord_consignment_currency[0] ? consignmentDataObj.custrecord_consignment_currency[0].value : '';
                        body.reserve = consignmentDataObj.custrecord_consignment_reserve ? consignmentDataObj.custrecord_consignment_reserve : 0;
                        body.reserveowc = consignmentDataObj.custrecord_consignment_reserve_owc ? consignmentDataObj.custrecord_consignment_reserve_owc : 0;
                        body.consignmentid = consignmentId;
                        body.wines = [];
                    } else if (body.internalid != lpInternalId) {

                        if (isSamePreLotNum) {
                            body.lot = previousPreLotNum;
                            previousPreLotNum = '';
                        } else {
                            body.lot = '';
                            isSamePreLotNum = true;
                            previousPreLotNum = '';
                        }
                        log.debug("body:", JSON.stringify(body))
                        auctionPlatesLinesArr.push(body);
                        var body = {};
                        body.internalid = lpInternalId ? lpInternalId : '';
                        body.id = lpName ? lpName : '';
                        body.consignor = consignmentDataObj.custrecord_consignment_consignor[0] ? consignmentDataObj.custrecord_consignment_consignor[0].value : '';
                        body.currency = consignmentDataObj.custrecord_consignment_currency[0] ? consignmentDataObj.custrecord_consignment_currency[0].value : '';
                        body.reserve = consignmentDataObj.custrecord_consignment_reserve ? consignmentDataObj.custrecord_consignment_reserve : 0;
                        body.reserveowc = consignmentDataObj.custrecord_consignment_reserve_owc ? consignmentDataObj.custrecord_consignment_reserve_owc : 0;
                        body.consignmentid = consignmentId;
                        body.wines = [];

                        var isSamePreLotNum = true;
                        var previousPreLotNum = searchDataLine[j].getValue({
                            name: 'custrecord_lp_item_pre_lot'
                        }) || "";
                    }

                    var platelineid = searchDataLine[j].getValue({
                        name: 'internalid'
                    });
                    var name = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_description'
                    });
                    var SKU = searchDataLine[j].getText({
                        name: 'custrecord_lp_item_item'
                    });
                    var packageTypeId = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_pack_type'
                    });
                    var qty = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_quantity'
                    });
                    var itemId = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_item'
                    });

                    var auctiondisplayname = searchDataLine[j].getValue({
                        name: 'custitem_auction_display_name',
                        join: 'custrecord_lp_item_item'
                    });
                    var vintage = searchDataLine[j].getText({
                        name: 'custitem_vintage',
                        join: 'custrecord_lp_item_item'
                    });
                    var vintageid = searchDataLine[j].getValue({
                        name: 'custitem_vintage',
                        join: 'custrecord_lp_item_item'
                    });
                    var size = searchDataLine[j].getText({
                        name: 'custitem_size',
                        join: 'custrecord_lp_item_item'
                    });
                    var sizeid = searchDataLine[j].getValue({
                        name: 'custitem_size',
                        join: 'custrecord_lp_item_item'
                    });
                    var producerName = searchDataLine[j].getText({
                        name: 'custitem_producer',
                        join: 'custrecord_lp_item_item'
                    });
                    var producer = searchDataLine[j].getValue({
                        name: 'custitem_producer',
                        join: 'custrecord_lp_item_item'
                    });
                    var regionName = searchDataLine[j].getText({
                        name: 'cseg_region',
                        join: 'custrecord_lp_item_item'
                    });
                    var region = searchDataLine[j].getValue({
                        name: 'cseg_region',
                        join: 'custrecord_lp_item_item'
                    });
                    var apellationName = searchDataLine[j].getText({
                        name: 'cseg_appellation',
                        join: 'custrecord_lp_item_item'
                    });
                    var apellation = searchDataLine[j].getValue({
                        name: 'cseg_appellation',
                        join: 'custrecord_lp_item_item'
                    });
                    var varietal = searchDataLine[j].getValue({
                        name: 'custitem_varietal',
                        join: 'custrecord_lp_item_item'
                    });
                    var itemclassname = searchDataLine[j].getText({
                        name: 'custitem_class',
                        join: 'custrecord_lp_item_item'
                    });
                    var itemclass = searchDataLine[j].getValue({
                        name: 'custitem_class',
                        join: 'custrecord_lp_item_item'
                    });
                    var countryName = searchDataLine[j].getText({
                        name: 'cseg_country',
                        join: 'custrecord_lp_item_item'
                    });
                    var country = searchDataLine[j].getValue({
                        name: 'cseg_country',
                        join: 'custrecord_lp_item_item'
                    });
                    var criticNote = searchDataLine[j].getValue({
                        name: 'custitem_auction_tasting_note',
                        join: 'custrecord_lp_item_item'
                    });
                    var lowPrice = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_ext_low'
                    })
                    var highPrice = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_ext_high'
                    })
                    var assessmentCodes = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_assessment_codes'
                    })
                    var assessmentFFT = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_assessment_fft'
                    })
                    var internalNotes = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_internal_notes'
                    });
                    var intendedSale = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_intended_sale'
                    });
                    var lpItemPreLotNumber = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_pre_lot'
                    });
                    var lpPhoto = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_photo'
                    });


                    if (j > 0) {
                        if (previousPreLotNum != lpItemPreLotNumber) {
                            isSamePreLotNum = false;
                        }
                    }

                    var foundValue;
                    if (sizeDataArr.length > 0) {
                        for (var jj = 0; jj < sizeDataArr.length; jj++) {
                            if (sizeDataArr[jj].internalid == sizeid) {
                                foundValue = sizeDataArr[jj];
                                break;
                            }
                        }
                    }

                    if (platelineid) {
                        var wineData = {
                            itemid: itemId ? itemId : '',
                            name: name ? name : '',
                            SKU: SKU ? SKU : '',
                            auctiondisplayname: auctiondisplayname,
                            vintage: vintage ? vintage : '',
                            vintageid: vintageid ? vintageid : '',
                            size: size ? size : '',
                            sizeid: sizeid ? sizeid : '',
                            sizeDescriptionid: foundValue ? foundValue.sizeDescriptionid : '',
                            qty: qty ? qty : '',
                            platelineid: platelineid ? platelineid : '',
                            producer: producer ? producer : '',
                            producername: producerName ? producerName : '',
                            region: region ? region : '',
                            regionname: regionName ? regionName : '',
                            apellation: apellation ? apellation : '',
                            apellationname: apellationName ? apellationName : '',
                            varietal: varietal ? varietal : '',
                            class: itemclass ? itemclass : '',
                            classnametext: itemclassname ? itemclassname : '',
                            country: country ? country : '',
                            countryname: countryName ? countryName : '',
                            criticnote: criticNote ? criticNote : '',
                            lowPrice: lowPrice ? lowPrice : '',
                            highPrice: highPrice ? highPrice : '',
                            assessmentcodes: assessmentCodes ? assessmentCodes : '',
                            assessmentfft: assessmentFFT ? assessmentFFT : '',
                            internalnotes: internalNotes ? internalNotes : '',
                            intendedsale: intendedSale ? intendedSale : '',
                            lpPhoto: lpPhoto ? lpPhoto : '',
                            packagetypeid: packageTypeId ? packageTypeId : ''
                        };

                        body.wines.push(wineData);

                    }

                    if (searchDataLine.length == j + 1) {
                        if (isSamePreLotNum) {
                            body.lot = previousPreLotNum;
                            previousPreLotNum = '';
                        } else {
                            body.lot = '';
                            isSamePreLotNum = true;
                            previousPreLotNum = '';
                        }
                        auctionPlatesLinesArr.push(body);
                    }

                }


            }



            return auctionPlatesLinesArr;
        }

        function createSingleLineSotckId(creationData, context) {
            try {


                for (var i = 0; i < creationData.length; i++) {
                    var data = creationData[i];
                    var stockIdRec = record.create({
                        type: "customrecord_stockid",
                        isDynamic: true,
                    });
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_consignor",
                        value: data.consignor,
                        ignoreFieldChange: true
                    });
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_consignment",
                        value: data.consignmentid,
                        ignoreFieldChange: true
                    });
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_currency",
                        value: data.currency,
                        ignoreFieldChange: true
                    });
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_pack_type",
                        value: data.packagetypeid,
                        ignoreFieldChange: true
                    });

                    if (data.assessmentNote) {
                        stockIdRec.setValue({
                            fieldId: "custrecord_stockid_assessment_note",
                            value: data.assessmentNote,
                            ignoreFieldChange: true
                        });
                    }

                    if (data.mixLotDeatils) {
                        stockIdRec.setValue({
                            fieldId: "custrecord_stockid_mix_lot_details",
                            value: data.mixLotDeatils,
                            ignoreFieldChange: true
                        });
                    }

                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_ext_high_not_rounded",
                        value: data.estematehigh,
                        ignoreFieldChange: true
                    });
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_ext_low_not_rounded",
                        value: data.estimatelow,
                        ignoreFieldChange: true
                    });

                    log.debug("data.estimatelow : data.estematehigh", data.estimatelow + ' : ' + data.estematehigh);
                    var roundedEstimateLow = 0;
                    if (data.estimatelow) {
                        var tempRoundedEstimateLow = librarFileObj.getRoundedValue(data.estimatelow, true);
                        roundedEstimateLow = tempRoundedEstimateLow ? tempRoundedEstimateLow : 0;
                        stockIdRec.setValue({
                            fieldId: "custrecord_stockid_est_low",
                            value: roundedEstimateLow,
                            ignoreFieldChange: true
                        });

                    }

                    if (data.estematehigh) {
                        var tempRoundedEstimateHigh = librarFileObj.getRoundedValue(data.estematehigh, false);
                        var roundedEstimateHigh = tempRoundedEstimateHigh ? tempRoundedEstimateHigh : 0;
                        stockIdRec.setValue({
                            fieldId: "custrecord_stockid_est_high",
                            value: roundedEstimateHigh,
                            ignoreFieldChange: true
                        });

                    }

                    if (data.packagetypeid == 1) { //OWC
                        var reserveOwcPercentage = data.reserveowc;
                        reserveOwcPercentage = (reserveOwcPercentage == 0 || !reserveOwcPercentage) ? RESERVE_PERCENTAGE : reserveOwcPercentage
                        log.debug("createSingleLineSotckId() :: reserveOwcPercentage:", reserveOwcPercentage);
                        var tempReserve = parseFloat(roundedEstimateLow) * parseFloat(reserveOwcPercentage) / 100.0;
                        log.debug("createSingleLineSotckId() :: tempReserve 1:", tempReserve);

                        if (tempReserve) {
                            var tempRoundedReserve = librarFileObj.getRoundedValue(tempReserve, true);
                            var roundedReserve = tempRoundedReserve ? tempRoundedReserve : 0;
                            log.debug("createSingleLineSotckId() :: roundedReserve 1:", roundedReserve);
                            stockIdRec.setValue({
                                fieldId: "custrecord_stockid_reserve",
                                value: roundedReserve,
                                ignoreFieldChange: true
                            });

                        }

                    } else {
                        var reservePercentage = data.reserve;
                        reservePercentage = (reservePercentage == 0 || !reservePercentage) ? RESERVE_PERCENTAGE : reservePercentage
                        log.debug("createSingleLineSotckId() :: reservePercentage:", reservePercentage);
                        var tempReserve = parseFloat(roundedEstimateLow) * parseFloat(reservePercentage) / 100.0;
                        log.debug("createSingleLineSotckId() :: tempReserve 2:", tempReserve);
                        if (tempReserve) {
                            var tempRoundedReserve = librarFileObj.getRoundedValue(tempReserve, true);
                            var roundedReserve = tempRoundedReserve ? tempRoundedReserve : 0;
                            log.debug("createSingleLineSotckId() :: roundedReserve 2:", roundedReserve);
                            stockIdRec.setValue({
                                fieldId: "custrecord_stockid_reserve",
                                value: roundedReserve,
                                ignoreFieldChange: true
                            });

                        }

                    }

                    log.debug("roundedEstimateLow : roundedEstimateHigh", roundedEstimateLow + ' : ' + roundedEstimateHigh);

                    if (data.linesdata.length > 0) {
                        if (data.linesdata.length > 1) {
                            var qtySum = 0;
                            for (var j = 0; j < data.linesdata.length; j++) {
                                qtySum += data.linesdata[j].quantity ? parseInt(data.linesdata[j].quantity) : 0;
                            }

                            if (data.country != -999 && data.country) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_country",
                                    value: data.country,
                                    ignoreFieldChange: true
                                });
                            } else {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_country",
                                    value: COUNTRY,
                                    ignoreFieldChange: true
                                });

                            }

                            if (data.itemclass != -999 && data.itemclass) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_type",
                                    value: data.itemclass,
                                    ignoreFieldChange: true
                                });
                            } else {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_type",
                                    value: TYPE,
                                    ignoreFieldChange: true
                                });

                            }

                            stockIdRec.setValue({
                                fieldId: "custrecord_stockid_mixed_lot",
                                value: true,
                                ignoreFieldChange: true
                            });
                            stockIdRec.setValue({
                                fieldId: "custrecord_stockid_status",
                                value: STATUS,
                                ignoreFieldChange: true
                            });
                            if (data.producer != -999 && data.producer) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_producer",
                                    value: data.producer,
                                    ignoreFieldChange: true
                                });
                            } else {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_producer",
                                    value: PRODUCER,
                                    ignoreFieldChange: true
                                });

                            }

                            if (data.sizeid != -999 && data.sizeid) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_size",
                                    value: data.sizeid,
                                    ignoreFieldChange: true
                                });
                            } else {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_size",
                                    value: SIZE,
                                    ignoreFieldChange: true
                                });

                            }

                            if (data.sizeDescriptionid != -999 && data.sizeDescriptionid) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_size_desc",
                                    value: data.sizeDescriptionid,
                                    ignoreFieldChange: true
                                });
                            } else {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_size_desc",
                                    value: SIZE_DESCRIPTION,
                                    ignoreFieldChange: true
                                });

                            }
                            if (data.itemclass != -999 && data.itemclass) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_type",
                                    value: data.itemclass,
                                    ignoreFieldChange: true
                                });
                            } else {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_type",
                                    value: TYPE,
                                    ignoreFieldChange: true
                                });

                            }

                            if (data.region != -999 && data.region) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_region",
                                    value: data.region,
                                    ignoreFieldChange: true
                                });
                            } else {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_region",
                                    value: REGION,
                                    ignoreFieldChange: true
                                });

                            }
                            if (data.apellation != -999 && data.apellation) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_appellation",
                                    value: data.apellation,
                                    ignoreFieldChange: true
                                });
                            } else {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_appellation",
                                    value: APPLICATION,
                                    ignoreFieldChange: true
                                });

                            }

                            if (data.varietal != -999 && data.varietal) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_varietal",
                                    value: data.varietal,
                                    ignoreFieldChange: true
                                });
                            } else {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_varietal",
                                    value: VARIETAL,
                                    ignoreFieldChange: true
                                });

                            }

                            if (data.vintageid != -999 && data.vintageid) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_vintage",
                                    value: data.vintageid,
                                    ignoreFieldChange: true
                                });
                            } else {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_vintage",
                                    value: VINTAGES,
                                    ignoreFieldChange: true
                                });

                            }
                            if (data.itemid != -999 && data.itemid) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_item",
                                    value: data.itemid,
                                    ignoreFieldChange: true
                                });
                            }

                            stockIdRec.setValue({
                                fieldId: "custrecord_stockid_bttl_qty",
                                value: qtySum,
                                ignoreFieldChange: true
                            });
                            stockIdRec.setValue({
                                fieldId: "custrecord_stockid_prelot_number",
                                value: data.lotnumber,
                                ignoreFieldChange: true
                            });

                        } else {

                            if (data.lotnumber) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_prelot_number",
                                    value: data.lotnumber,
                                    ignoreFieldChange: true
                                });
                            }

                            if (data.intendedsale) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_intended_sale",
                                    value: data.intendedsale,
                                    ignoreFieldChange: true
                                });
                            }

                            if (data.lpPhoto) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_photo_number",
                                    value: data.lpPhoto,
                                    ignoreFieldChange: true
                                });
                            }

                            if (data.linesdata[0].criticnote) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_critic_note",
                                    value: data.linesdata[0].criticnote,
                                    ignoreFieldChange: true
                                });
                            }

                            if (data.linesdata[0].itemid) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_item",
                                    value: data.linesdata[0].itemid,
                                    ignoreFieldChange: true
                                });
                            }

                            if (data.linesdata[0].sizeid) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_size",
                                    value: data.linesdata[0].sizeid,
                                    ignoreFieldChange: true
                                });

                            }

                            if (data.linesdata[0].vintageid) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_vintage",
                                    value: data.linesdata[0].vintageid,
                                    ignoreFieldChange: true
                                });

                            }

                            if (data.linesdata[0].sizeDescriptionid) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_size_desc",
                                    value: data.linesdata[0].sizeDescriptionid,
                                    ignoreFieldChange: true
                                });
                            }

                            if (data.linesdata[0].quantity) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_bttl_qty",
                                    value: data.linesdata[0].quantity,
                                    ignoreFieldChange: true
                                });
                            }

                            if (data.linesdata[0].itemclass) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_type",
                                    value: data.linesdata[0].itemclass,
                                    ignoreFieldChange: true
                                });

                            }

                            if (data.linesdata[0].country) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_country",
                                    value: data.linesdata[0].country,
                                    ignoreFieldChange: true
                                });

                            }

                            if (data.linesdata[0].region) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_region",
                                    value: data.linesdata[0].region,
                                    ignoreFieldChange: true
                                });

                            }

                            if (data.linesdata[0].apellation) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_appellation",
                                    value: data.linesdata[0].apellation,
                                    ignoreFieldChange: true
                                });

                            }

                            if (data.linesdata[0].varietal) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_varietal",
                                    value: data.linesdata[0].varietal,
                                    ignoreFieldChange: true
                                });

                            }

                            if (data.linesdata[0].producer) {
                                stockIdRec.setValue({
                                    fieldId: "custrecord_stockid_producer",
                                    value: data.linesdata[0].producer,
                                    ignoreFieldChange: true
                                });

                            }

                        }
                    }
                    var stockInternalId = stockIdRec.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });

                    if (stockInternalId) {
                        log.debug("data.aucplateinternalid:", JSON.stringify(data.aucplateinternalid));

                        if (data.isSameType == true) {
                            for (var kk = 0; kk < data.aucplateinternalid.length; kk++) {
                                record.submitFields({
                                    type: "customrecord_auc_lp",
                                    id: data.aucplateinternalid[kk],
                                    values: {
                                        custrecord_auc_lp_stockid: stockInternalId
                                    },
                                    options: {
                                        enableSourcing: false,
                                        ignoreMandatoryFields: true
                                    }
                                });

                            }

                        } else {
                            record.submitFields({
                                type: "customrecord_auc_lp",
                                id: data.aucplateinternalid,
                                values: {
                                    custrecord_auc_lp_stockid: stockInternalId
                                },
                                options: {
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                }
                            });

                        }
                    }

                }

                return true;
            } catch (e) {
                log.error("ERROR IN :: createSingleLineSotckId", e.message);
                var oResponse = {};
                oResponse.type = "Error";
                oResponse.detail = e.message
                context.response.writeLine(JSON.stringify(oResponse));
            }

        }

        function createSotckIdForMultiplData(creationData, context) {
            try {
                var data = creationData[0];
                var stockIdRec = record.create({
                    type: "customrecord_stockid",
                    isDynamic: true,
                });
                stockIdRec.setValue({
                    fieldId: "custrecord_stockid_consignor",
                    value: data.consignor,
                    ignoreFieldChange: true
                });
                stockIdRec.setValue({
                    fieldId: "custrecord_stockid_consignment",
                    value: data.consignmentid,
                    ignoreFieldChange: true
                });
                stockIdRec.setValue({
                    fieldId: "custrecord_stockid_pack_type",
                    value: data.packagetypeid,
                    ignoreFieldChange: true
                });
                stockIdRec.setValue({
                    fieldId: "custrecord_stockid_currency",
                    value: data.currency,
                    ignoreFieldChange: true
                });

                if (data.assessmentNote) {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_assessment_note",
                        value: data.assessmentNote,
                        ignoreFieldChange: true
                    });
                }

                if (data.mixLotDeatils) {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_mix_lot_details",
                        value: data.mixLotDeatils,
                        ignoreFieldChange: true
                    });
                }


                if (data.country != -999 && data.country) {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_country",
                        value: data.country,
                        ignoreFieldChange: true
                    });
                } else {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_country",
                        value: COUNTRY,
                        ignoreFieldChange: true
                    });

                }

                if (data.itemclass != -999 && data.itemclass) {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_type",
                        value: data.itemclass,
                        ignoreFieldChange: true
                    });
                } else {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_type",
                        value: TYPE,
                        ignoreFieldChange: true
                    });

                }

                stockIdRec.setValue({
                    fieldId: "custrecord_stockid_mixed_lot",
                    value: true,
                    ignoreFieldChange: true
                });
                stockIdRec.setValue({
                    fieldId: "custrecord_stockid_status",
                    value: STATUS,
                    ignoreFieldChange: true
                });

                if (data.producer != -999 && data.producer) {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_producer",
                        value: data.producer,
                        ignoreFieldChange: true
                    });
                } else {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_producer",
                        value: PRODUCER,
                        ignoreFieldChange: true
                    });

                }

                if (data.sizeid != -999 && data.sizeid) {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_size",
                        value: data.sizeid,
                        ignoreFieldChange: true
                    });
                } else {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_size",
                        value: SIZE,
                        ignoreFieldChange: true
                    });

                }

                if (data.sizeDescriptionid != -999 && data.sizeDescriptionid) {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_size_desc",
                        value: data.sizeDescriptionid,
                        ignoreFieldChange: true
                    });
                } else {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_size_desc",
                        value: SIZE_DESCRIPTION,
                        ignoreFieldChange: true
                    });

                }

                if (data.itemclass != -999 && data.itemclass) {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_type",
                        value: data.itemclass,
                        ignoreFieldChange: true
                    });
                } else {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_type",
                        value: TYPE,
                        ignoreFieldChange: true
                    });

                }
                if (data.region != -999 && data.region) {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_region",
                        value: data.region,
                        ignoreFieldChange: true
                    });
                } else {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_region",
                        value: REGION,
                        ignoreFieldChange: true
                    });

                }

                if (data.apellation != -999 && data.apellation) {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_appellation",
                        value: data.apellation,
                        ignoreFieldChange: true
                    });
                } else {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_appellation",
                        value: APPLICATION,
                        ignoreFieldChange: true
                    });

                }
                if (data.varietal != -999 && data.varietal) {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_varietal",
                        value: data.varietal,
                        ignoreFieldChange: true
                    });
                } else {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_varietal",
                        value: VARIETAL,
                        ignoreFieldChange: true
                    });

                }
                if (data.vintageid != -999 && data.vintageid) {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_vintage",
                        value: data.vintageid,
                        ignoreFieldChange: true
                    });
                } else {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_vintage",
                        value: VINTAGES,
                        ignoreFieldChange: true
                    });

                }

                if (data.itemid != -999 && data.itemid) {
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_item",
                        value: data.itemid,
                        ignoreFieldChange: true
                    });
                }

                stockIdRec.setValue({
                    fieldId: "custrecord_stockid_bttl_qty",
                    value: data.qtysum,
                    ignoreFieldChange: true
                });

                if (data.estimatelow) {
                    var tempRoundedEstimateLow = librarFileObj.getRoundedValue(data.estimatelow, true);
                    var roundedEstimateLow = tempRoundedEstimateLow ? tempRoundedEstimateLow : 0;
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_est_low",
                        value: roundedEstimateLow,
                        ignoreFieldChange: true
                    });

                }

                if (data.estematehigh) {
                    var tempRoundedEstimateHigh = librarFileObj.getRoundedValue(data.estematehigh, false);
                    roundedEstimateHigh = tempRoundedEstimateHigh ? tempRoundedEstimateHigh : 0;
                    stockIdRec.setValue({
                        fieldId: "custrecord_stockid_est_high",
                        value: roundedEstimateHigh,
                        ignoreFieldChange: true
                    });

                }


                if (data.packagetypeid == 1) { //OWC
                    var reserveOwcPercentage = data.reserveowc;
                    reserveOwcPercentage = (reserveOwcPercentage == 0 || !reserveOwcPercentage) ? RESERVE_PERCENTAGE : reserveOwcPercentage
                    log.debug("createSotckIdForMultiplData() :: reserveOwcPercentage:", reserveOwcPercentage);
                    var tempReserve = parseFloat(roundedEstimateLow) * (parseFloat(reserveOwcPercentage) / 100.0);
                    log.debug("createSotckIdForMultiplData() :: tempReserve 1:", tempReserve);
                    if (tempReserve) {
                        var tempRoundedReserve = librarFileObj.getRoundedValue(tempReserve, true);
                        var roundedReserve = tempRoundedReserve ? tempRoundedReserve : 0;
                        log.debug("createSotckIdForMultiplData() :: roundedReserve 1:", roundedReserve);
                        stockIdRec.setValue({
                            fieldId: "custrecord_stockid_reserve",
                            value: roundedReserve,
                            ignoreFieldChange: true
                        });



                    }

                } else {
                    var reservePercentage = data.reserve;
                    reservePercentage = (reservePercentage == 0 || !reservePercentage) ? RESERVE_PERCENTAGE : reservePercentage
                    log.debug("createSotckIdForMultiplData() :: reservePercentage:", reservePercentage);
                    var tempReserve = parseFloat(roundedEstimateLow) * (parseFloat(reservePercentage) / 100.0);
                    log.debug("createSotckIdForMultiplData() :: tempReserve 2:", tempReserve);
                    if (tempReserve) {
                        var tempRoundedReserve = librarFileObj.getRoundedValue(tempReserve, true);
                        var roundedReserve = tempRoundedReserve ? tempRoundedReserve : 0;
                        log.debug("createSotckIdForMultiplData() :: roundedReserve 2:", roundedReserve);
                        stockIdRec.setValue({
                            fieldId: "custrecord_stockid_reserve",
                            value: roundedReserve,
                            ignoreFieldChange: true
                        });

                    }


                }

                stockIdRec.setValue({
                    fieldId: "custrecord_stockid_ext_high_not_rounded",
                    value: data.estematehigh,
                    ignoreFieldChange: true
                });
                stockIdRec.setValue({
                    fieldId: "custrecord_stockid_ext_low_not_rounded",
                    value: data.estimatelow,
                    ignoreFieldChange: true
                });

                var stockInternalId = stockIdRec.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });

                if (stockInternalId) {
                    if (data.aucplateinternalidsarray.length > 0) {
                        for (var i = 0; i < data.aucplateinternalidsarray.length; i++) {
                            record.submitFields({
                                type: "customrecord_auc_lp",
                                id: data.aucplateinternalidsarray[i],
                                values: {
                                    custrecord_auc_lp_stockid: stockInternalId
                                },
                                options: {
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                }
                            });

                        }

                    }
                }

                return true;
            } catch (e) {
                log.error("ERROR IN :: createSotckIdForMultiplData", e);
                var oResponse = {};
                oResponse.type = "Error";
                oResponse.detail = e.message
                context.response.writeLine(JSON.stringify(oResponse));
            }

        }

        function getAllSizeDescription() {
            var sizeDataArr = [];
            var searchObj = search.create({
                type: "customrecord_size_list",
                filters: [
                    ["isinactive", "is", "F"]
                ],
                columns: [

                    search.createColumn({
                        name: "internalid"
                    }),
                    search.createColumn({
                        name: "name"
                    }),
                    search.createColumn({
                        name: "custrecord_size_description"
                    })

                ]
            });
            var searchData = searchObj.run().getRange(0, 1000);
            if (searchData) {
                for (var i = 0; i < searchData.length; i++) {
                    var obj = {};
                    var internalid = searchData[i].getValue({
                        name: 'internalid'
                    });
                    var name = searchData[i].getValue({
                        name: 'name'
                    });
                    var sizeDescription = searchData[i].getText({
                        name: 'custrecord_size_description'
                    });
                    var sizeDescriptionid = searchData[i].getValue({
                        name: 'custrecord_size_description'
                    });

                    obj.internalid = internalid ? internalid : '';
                    obj.name = name ? name : '';
                    obj.sizedescription = sizeDescription ? sizeDescription : '';
                    obj.sizeDescriptionid = sizeDescriptionid ? sizeDescriptionid : '';
                    sizeDataArr.push(obj);
                }
            }

            return sizeDataArr;
        }

        function getScriptUrl() {
            var outputUrl = url.resolveScript({
                scriptId: 'customscript_w_sl_create_stockids',
                deploymentId: 'customdeploy_w_sl_create_stockids'
            });

            log.debug("outputUrl:", outputUrl);
            return outputUrl;
        }

        function getCodesData() {
            try {
                var title = "getCodesData()";
                var dataObj = {};
                var codesDataObjArr = [];

                var codesSearch = search.create({
                    type: "customrecord_ac",
                    filters: [
                        ["isinactive", "is", "F"]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custrecord_ac_code"
                        }),
                        search.createColumn({
                            name: "internalid"
                        }),
                        search.createColumn({
                            name: "custrecord_ac_code_type"
                        }),
                        search.createColumn({
                            name: "custrecord_ac_long_description"
                        }),
                        search.createColumn({
                            name: "custrecord_ac_long_description_plural"
                        }),
                        search.createColumn({
                            name: "custrecord_ac_type"
                        }),
                        search.createColumn({
                            name: "custrecord_ac_pack_type"
                        })
                    ]
                });

                var searchData = [];
                var count = 0;
                var pageSize = 1000;
                var start = 0;
                do {
                    var searchObjArr = codesSearch.run().getRange(start, start + pageSize);

                    searchData = searchData.concat(searchObjArr);
                    count = searchObjArr.length;
                    start += pageSize;
                } while (count == pageSize);

                if (searchData) {
                    for (var i = 0; i < searchData.length; i++) {
                        var obj = {};
                        obj.internalid = searchData[i].getValue({
                            name: "internalid"
                        });

                        obj.code = searchData[i].getValue({
                            name: "custrecord_ac_code"
                        });

                        var typeId = searchData[i].getValue({
                            name: "custrecord_ac_code_type"
                        });
                        obj.typeId = typeId;

                        var typeText = searchData[i].getText({
                            name: "custrecord_ac_code_type"
                        });
                        obj.typeText = typeText;

                        obj.description = searchData[i].getValue({
                            name: "custrecord_ac_long_description"
                        });
                        obj.descriptionPlural = searchData[i].getValue({
                            name: "custrecord_ac_long_description_plural"
                        });
                        obj.orderingType = searchData[i].getValue({
                            name: "custrecord_ac_type"
                        });
                        obj.packType = searchData[i].getValue({
                            name: "custrecord_ac_pack_type"
                        });
                        obj.packTypeText = searchData[i].getText({
                            name: "custrecord_ac_pack_type"
                        });

                        codesDataObjArr.push(obj);
                    }
                }

                var codesTypeObjArray = getAssessmentCodeTypeList();
                dataObj.codesDataObjArr = codesDataObjArr ? codesDataObjArr : [];
                dataObj.codesTypeObjArray = codesTypeObjArray ? codesTypeObjArray : [];

                return dataObj;


            } catch (e) {
                log.error("Error in " + title, e.message);
            }
        }

        function getAssessmentCodeTypeList() {
            var codesTypejArr = [];

            var codesSearch = search.create({
                type: "customrecord_code_type",
                filters: [
                    ["isinactive", "is", "F"]
                ],
                columns: [
                    search.createColumn({
                        name: "name"
                    }),
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.ASC
                    }),
                ]
            });

            var searchData = [];
            var count = 0;
            var pageSize = 1000;
            var start = 0;
            do {
                var searchObjArr = codesSearch.run().getRange(start, start + pageSize);

                searchData = searchData.concat(searchObjArr);
                count = searchObjArr.length;
                start += pageSize;
            } while (count == pageSize);

            if (searchData) {
                for (var i = 0; i < searchData.length; i++) {
                    var obj = {};
                    obj.typeId = searchData[i].getValue({
                        name: "internalid"
                    });

                    obj.typeName = searchData[i].getValue({
                        name: "name"
                    });
                    codesTypejArr.push(obj);
                }
            }

            return codesTypejArr;
        }


        return {
            onRequest: onRequest
        };
    });