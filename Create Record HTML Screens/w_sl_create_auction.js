/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
var AUCTION_HTML_CONTENT = '134331';
var ASSIGNED_STATUS = 2; //Assigned
var UNASSIGNED_STATUS = 1; //Unassigned

define(['N/record', 'N/file', 'N/search', 'N/url'],
    function (record, file, search, url) {
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

                    var stockIdMapping = getLicesePlateItems(consignmentId);
                    log.debug("stockIdMapping:", JSON.stringify(stockIdMapping))
                    var auctionPlatesLinesArr = getStockData(consignmentId, stockIdMapping);
                    var auctionDetailIdsArr = getAuctionDetailIds();
                    var suiteletUrl = getScriptUrl();


                    var fileContent = file.load({
                        id: AUCTION_HTML_CONTENT
                    }).getContents();
                    template = fileContent;
                    template = template.replace(/{{LPs}}/g, JSON.stringify(auctionPlatesLinesArr));
                    template = template.replace(/{{auctionsDataArr}}/g, JSON.stringify(auctionDetailIdsArr));
                    template = template.replace(/{{SUITELET_URL}}/g, suiteletUrl);
                    log.debug("onRequest:", "onRequest() GET gethod end");
                    context.response.write(template);

                } else {
                    log.debug("onRequest:", "onRequest() post method start");
                    var request = context.request;
                    var bodyData = request.body;
                    if (bodyData) {
                        var creationData = JSON.parse(bodyData);
                        createSingleAuctionLot(creationData);

                    }

                    var oResponse = {};
                    oResponse.type = "Success";
                    oResponse.detail = "Successfully completed process";
                    log.debug("onRequest:", "onRequest() post method end");
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

        function getStockData(consignmentId, stockIdMapping) {
            var auctionPlatesLinesArr = new Array();
            var consignor = search.lookupFields({
                type: 'customrecord_consignment',
                id: consignmentId,
                columns: 'custrecord_consignment_consignor'
            });

            var stockIdSearchObj = search.create({
                type: "customrecord_stockid",
                filters: [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custrecord_stockid_status", "anyof", UNASSIGNED_STATUS], //Unassigned
                    "AND",
                    ["custrecord_stockid_consignment", "anyof", consignmentId]
                ],
                columns: [

                    search.createColumn({
                        name: "internalid"
                    }),
                    search.createColumn({
                        name: "name"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_prelot_number"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_item"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_vintage"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_bttl_qty"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_est_low"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_est_high"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_country"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_region"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_type"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_appellation"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_producer"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_intended_sale"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_size"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_size_desc"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_varietal"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_quantity_band"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_vintage_band"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_pack_type"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_mixed_lot"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_reserve"
                    }),
                    search.createColumn({
                        name: "custrecord_stockid_photo_number"
                    })

                ]
            });


            var searchData = stockIdSearchObj.run().getRange(0, 1000);

            if (searchData) {
                for (var i = 0; i < searchData.length; i++) {
                    var obj = {};
                    var internalid = searchData[i].getValue({
                        name: 'internalid'
                    });
                    var itemId = searchData[i].getValue({
                        name: 'custrecord_stockid_item'
                    });
                    var name = searchData[i].getValue({
                        name: 'name'
                    });
                    var year = searchData[i].getText({
                        name: 'custrecord_stockid_vintage'
                    });
                    var yearId = searchData[i].getValue({
                        name: 'custrecord_stockid_vintage'
                    });
                    var lowPrice = searchData[i].getValue({
                        name: 'custrecord_stockid_est_low'
                    });
                    var highPrice = searchData[i].getValue({
                        name: 'custrecord_stockid_est_high'
                    });
                    var country = searchData[i].getText({
                        name: 'custrecord_stockid_country'
                    });
                    var countryId = searchData[i].getValue({
                        name: 'custrecord_stockid_country'
                    });
                    var region = searchData[i].getText({
                        name: 'custrecord_stockid_region'
                    });
                    var regionId = searchData[i].getValue({
                        name: 'custrecord_stockid_region'
                    });
                    var classWine = searchData[i].getText({
                        name: 'custrecord_stockid_type'
                    });
                    var classWineId = searchData[i].getValue({
                        name: 'custrecord_stockid_type'
                    });
                    var apellation = searchData[i].getText({
                        name: 'custrecord_stockid_appellation'
                    });
                    var apellationId = searchData[i].getValue({
                        name: 'custrecord_stockid_appellation'
                    });
                    var producer = searchData[i].getText({
                        name: 'custrecord_stockid_producer'
                    });
                    var producerId = searchData[i].getValue({
                        name: 'custrecord_stockid_producer'
                    });
                    var size = searchData[i].getText({
                        name: 'custrecord_stockid_size'
                    });
                    var sizeId = searchData[i].getValue({
                        name: 'custrecord_stockid_size'
                    });
                    var qty = searchData[i].getValue({
                        name: 'custrecord_stockid_bttl_qty'
                    });
                    var lot = searchData[i].getValue({
                        name: 'custrecord_stockid_prelot_number'
                    });
                    var auction = searchData[i].getText({
                        name: 'custrecord_stockid_intended_sale'
                    });
                    var sizedescription = searchData[i].getValue({
                        name: 'custrecord_stockid_size_desc'
                    });
                    var varietal = searchData[i].getText({
                        name: 'custrecord_stockid_varietal'
                    });
                    var varietalid = searchData[i].getValue({
                        name: 'custrecord_stockid_varietal'
                    });
                    var qtyband = searchData[i].getText({
                        name: 'custrecord_stockid_quantity_band'
                    });
                    var qtybandid = searchData[i].getValue({
                        name: 'custrecord_stockid_quantity_band'
                    });
                    var vintageband = searchData[i].getText({
                        name: 'custrecord_stockid_vintage_band'
                    });
                    var vintagebandid = searchData[i].getValue({
                        name: 'custrecord_stockid_vintage_band'
                    });
                    var packtype = searchData[i].getValue({
                        name: 'custrecord_stockid_pack_type'
                    });
                    var mixedlot = searchData[i].getValue({
                        name: 'custrecord_stockid_mixed_lot'
                    });
                    var reserve = searchData[i].getValue({
                        name: 'custrecord_stockid_reserve'
                    });
                    var photoNumber = searchData[i].getValue({
                        name: 'custrecord_stockid_photo_number'
                    });

                    obj.id = internalid ? internalid : '';
                    obj.itemId = itemId ? itemId : '';
                    obj.consignmentid = consignmentId;
                    obj.consignor = consignor.custrecord_consignment_consignor[0] ? consignor.custrecord_consignment_consignor[0].value : '';
                    obj.name = name
                    obj.vintage = year ? year : '';
                    obj.vintageId = yearId ? yearId : '';
                    obj.lowPrice = lowPrice ? lowPrice : '';
                    obj.highPrice = highPrice ? highPrice : '';
                    obj.lowPriceSort = lowPrice ? parseInt(lowPrice) : 0;
                    obj.highPriceSort = highPrice ? parseInt(highPrice) : 0;
                    obj.country = country ? country : '';
                    obj.countryId = countryId ? countryId : '';
                    obj.region = region ? region : '';
                    obj.regionId = regionId ? regionId : '';
                    obj.class = classWine ? classWine : '';
                    obj.classId = classWineId ? classWineId : '';
                    obj.apellation = apellation ? apellation : '';
                    obj.apellationId = apellationId ? apellationId : '';
                    obj.producer = producer ? producer : '';
                    obj.producerId = producerId ? producerId : '';
                    obj.size = size ? size : '';
                    obj.sizeId = sizeId ? sizeId : '';
                    obj.qty = qty ? qty : '';
                    obj.lot = lot ? lot : '';
                    obj.auction = auction ? auction : '';
                    obj.sizedescription = sizedescription ? sizedescription : '';
                    obj.varietal = varietal ? varietal : '';
                    obj.varietalid = varietalid ? varietalid : '';
                    obj.qtyband = qtyband ? qtyband : '';
                    obj.qtybandid = qtybandid ? qtybandid : '';
                    obj.vintageband = vintageband ? vintageband : '';
                    obj.vintagebandid = vintagebandid ? vintagebandid : '';
                    obj.packtype = packtype ? packtype : '';
                    obj.mixedlot = mixedlot ? mixedlot : false;
                    obj.reserve = reserve ? reserve : '';
                    obj.photoNumber = photoNumber ? photoNumber : '';
                    obj.wines = stockIdMapping[internalid] ? stockIdMapping[internalid] : [];
                    auctionPlatesLinesArr.push(obj);

                }
            }

            log.debug("auctionPlatesLinesArr:", JSON.stringify(auctionPlatesLinesArr));
            return auctionPlatesLinesArr;
        }

        function getLicesePlateItems(consignmentId) {
            var stockIdMapping = {};
            var auctionPlateItemsSearchObj = search.create({
                type: "customrecord_lp_item",
                filters: [
                    search.createFilter({
                        name: 'isinactive',
                        operator: search.Operator.IS,
                        values: ["F"]
                    }),
                    search.createFilter({
                        name: 'custrecord_auc_lp_consignment',
                        join: 'custrecord_lp_item_lp',
                        operator: search.Operator.ANYOF,
                        values: consignmentId
                    })
                ],
                columns: [
                    search.createColumn({
                        name: "internalid"
                    }),
                    search.createColumn({
                        name: "custrecord_lp_item_description"
                    }),
                    search.createColumn({
                        name: 'custrecord_auc_lp_stockid',
                        join: 'custrecord_lp_item_lp',
                        sort: search.Sort.ASC
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
                        name: "custrecord_lp_item_item"
                    }),
                    search.createColumn({
                        name: "custitem_vintage",
                        join: "custrecord_lp_item_item"
                    }),
                    search.createColumn({
                        name: "custitem_size",
                        join: "custrecord_lp_item_item"
                    })

                ]
            });

            var searchDataLine = auctionPlateItemsSearchObj.run().getRange(0, 1000);

            if (searchDataLine.length > 0) {
                var wines = [];
                var previousStockId;
                for (var j = 0; j < searchDataLine.length; j++) {
                    var platelineid = searchDataLine[j].getValue({
                        name: 'internalid'
                    });
                    var name = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_description'
                    });
                    var stockId = searchDataLine[j].getValue({
                        name: 'custrecord_auc_lp_stockid',
                        join: 'custrecord_lp_item_lp',
                        sort: search.Sort.ASC
                    });
                    var assessmentCodes = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_assessment_codes'
                    })
                    var assessmentFFT = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_assessment_fft'
                    })
                    var internalNotes = searchDataLine[j].getValue({
                        name: 'custrecord_lp_item_internal_notes'
                    });
                    var vintage = searchDataLine[j].getText({
                        name: "custitem_vintage",
                        join: "custrecord_lp_item_item"
                    });
                    var vintageid = searchDataLine[j].getValue({
                        name: "custitem_vintage",
                        join: "custrecord_lp_item_item"
                    });
                    var size = searchDataLine[j].getText({
                        name: "custitem_size",
                        join: "custrecord_lp_item_item"
                    });
                    var sizeid = searchDataLine[j].getValue({
                        name: "custitem_size",
                        join: "custrecord_lp_item_item"
                    });

                    if (j == 0) {
                        previousStockId = stockId;
                    } else if (previousStockId != stockId) {
                        stockIdMapping[previousStockId] = wines;
                        var wines = [];
                        previousStockId = stockId;
                    }

                    assessmentCodes = assessmentCodes ? assessmentCodes + ', ' : '';
                    assessmentFFT = assessmentFFT ? assessmentFFT + ', ' : '';
                    internalNotes = internalNotes ? internalNotes : '';
                    var allCodes = assessmentCodes + assessmentFFT + internalNotes;

                    var wineData = {
                        platelineid: platelineid ? platelineid : '',
                        name: name ? name : '',
                        vintage: vintage ? vintage : '',
                        vintageid: vintageid ? vintageid : '',
                        size: size ? size : '',
                        sizeid: sizeid ? sizeid : '',
                        assessmentcodes: assessmentCodes ? assessmentCodes : '',
                        assessmentfft: assessmentFFT ? assessmentFFT : '',
                        internalnotes: internalNotes ? internalNotes : '',
                        allcodes: allCodes ? allCodes : ''
                    };

                    wines.push(wineData);

                }

            }

            return stockIdMapping;

        }

        function getAuctionDetailIds() {
            var auctionsDataArr = [];
            var auctionsSearchObj = search.create({
                type: "customrecord_auction",
                filters: [
                    ["isinactive", "is", "F"]
                ],
                columns: [
                    search.createColumn({
                        name: "internalid"
                    }),
                    search.createColumn({
                        name: "name"
                    })
                ]
            });

            var searchData = auctionsSearchObj.run().getRange(0, 1000);

            if (searchData) {
                for (var i = 0; i < searchData.length; i++) {
                    var obj = {};
                    var id = searchData[i].getValue({
                        name: 'internalid'
                    });
                    var name = searchData[i].getValue({
                        name: 'name'
                    });

                    obj.name = name;
                    obj.id = id;

                    auctionsDataArr.push(obj);
                }
            }

            return auctionsDataArr;
        }

        function createSingleAuctionLot(creationData, context) {
            try {
                for (var i = 0; i < creationData.length; i++) {
                    var data = creationData[i];
                    var aucLotRec = record.create({
                        type: "customrecord_auction_lot",
                        isDynamic: true,
                    });
                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_auction",
                        value: data.auctioninternalid,
                        ignoreFieldChange: true
                    });
                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_lotnumber",
                        value: data.stocklotnumber,
                        ignoreFieldChange: true
                    });

                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_consignor",
                        value: data.consignor,
                        ignoreFieldChange: true
                    });
                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_consignment",
                        value: data.consignmentid,
                        ignoreFieldChange: true
                    });
                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_stockid",
                        value: data.stockinternalid,
                        ignoreFieldChange: true
                    });

                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_bttl_qty",
                        value: data.qty,
                        ignoreFieldChange: true
                    });

                    if (data.mixedlot != 'true') {
                        aucLotRec.setValue({
                            fieldId: "custrecord_auction_lot_quantity",
                            value: data.itemId,
                            ignoreFieldChange: true
                        });
                    }

                    if (data.mixedlot == 'true') {

                        aucLotRec.setValue({
                            fieldId: "custrecord_auction_lot_mixed_lot",
                            value: true,
                            ignoreFieldChange: true
                        });

                    }

                    var lowPrice = data.lowprice.replace('$', '').replace(/,/g, '');

                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_bottle_low",
                        value: lowPrice,
                        ignoreFieldChange: true
                    });

                    var highPrice = data.highprice.replace('$', '').replace(/,/g, '');
                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_estimate_high",
                        value: highPrice,
                        ignoreFieldChange: true
                    });

                    var reserve = data.reserve.replace('$', '').replace(/,/g, '');
                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_reserve",
                        value: reserve,
                        ignoreFieldChange: true
                    });

                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_class",
                        value: data.classid,
                        ignoreFieldChange: true
                    });
                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_country",
                        value: data.countryid,
                        ignoreFieldChange: true
                    });
                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_region",
                        value: data.regionid,
                        ignoreFieldChange: true
                    });
                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_varietal",
                        value: data.varietalid,
                        ignoreFieldChange: true
                    });
                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_producer",
                        value: data.producerid,
                        ignoreFieldChange: true
                    });
                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_appellation",
                        value: data.apellationid,
                        ignoreFieldChange: true
                    });
                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_vintage",
                        value: data.vintageid,
                        ignoreFieldChange: true
                    });
                    aucLotRec.setValue({
                        fieldId: "custrecord_auction_lot_size",
                        value: data.sizeid,
                        ignoreFieldChange: true
                    });

                    var aucLotInternalId = aucLotRec.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });

                    if (aucLotInternalId) {
                        var id = record.submitFields({
                            type: "customrecord_stockid",
                            id: data.stockinternalid,
                            values: {
                                custrecord_stockid_status: ASSIGNED_STATUS
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });
                    }

                    log.debug("aucLotInternalId:", aucLotInternalId);
                }

                return true;
            } catch (e) {
                log.error("ERROR IN :: createSingleAuctionLot", e.message);
                var oResponse = {};
                oResponse.type = "Error";
                oResponse.detail = e.message
                context.response.writeLine(JSON.stringify(oResponse));
            }

        }

        function getScriptUrl() {
            var outputUrl = url.resolveScript({
                scriptId: 'customscript_w_sl_create_auction',
                deploymentId: 'customdeploy_w_sl_create_auction'
            });

            log.debug("outputUrl:", outputUrl);
            return outputUrl;
        }

        return {
            onRequest: onRequest
        };
    });