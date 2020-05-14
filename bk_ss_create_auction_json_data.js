/**
 * @NApiVersion 	2.0
 * @NScriptType 	ScheduledScript
 * @NModuleScope 	SameAccount
 */
var FOLDER_ID = -20;

define(['N/record', 'N/search', 'N/file'],
    function (record, search, file) {
        function getAuctionLOtIds() {
            var title = 'getAuctionLOtIds() :: ';
            try {
                ///var temAuctionId = [156];
                var auctionRecIds = searchAuctionLotIds();
                var auctionInternalids = [];
                if (auctionRecIds.length > 0) {
                    log.debug(title + 'auctionRecIds', JSON.stringify(auctionRecIds));
                    for (var i = 0; i < auctionRecIds.length; i++) {
                        var object = auctionRecIds[i];
                        log.debug(title + "object:", JSON.stringify(object));
                        auctionInternalids.push(object.internalId);
                        if (!object.isJsonCreated || object.isJsonCreated) {
                            var auctionLotRecObj = getAuctionLotObjData(object.internalId);
                            var auctionLotRecObjData = auctionLotRecObj.auctionLotRecObjData;
                            var stockIds = auctionLotRecObj.stockIds;
                            var auctionLpIsds = getAucLicensePlate(stockIds);
                            var lpitemsData = [];
                            if (auctionLpIsds.length > 0) {
                                var lpitemsData = getJsonAucLicensePlateItemsData(auctionLpIsds);
                                log.debug(title + 'lpitemsData:', JSON.stringify(lpitemsData))
                            }
                            if (auctionLotRecObjData.length > 0) {
                                log.debug(title + 'auctionLotRecObjData', JSON.stringify(auctionLotRecObjData));
                                var jsonObjData = getJsonFormatData(auctionLotRecObjData, lpitemsData);
                                var updateObj = {};
                                updateObj.jsonFieldId = 'custrecord_auction_json_data';
                                updateObj.checkBoxFieldId = 'custrecord_auction_is_json_created';

                                updateAuctionRecord(jsonObjData, object.internalId, updateObj);
                                log.debug(title + 'jsonObjData', JSON.stringify(jsonObjData));
                            }

                        }

                        var auctionLpIsds;
                        var mappingLotNumber;
                        if (!object.isCatalogJsonCreated || object.isCatalogJsonCreated) { // || object.isCatalogJsonCreated
                            var objStockInfo = getAllStockIds(object.internalId);
                            var stockIds = objStockInfo.stockIds;
                            mappingLotNumber = objStockInfo.mappingLotNumber ? objStockInfo.mappingLotNumber : {};
                            if (stockIds.length > 0) {
                                log.debug(title + "stockIds case 1:", JSON.stringify(stockIds));
                                log.debug(title + "mappingLotNumber case 1:", JSON.stringify(mappingLotNumber));
                                auctionLpIsds = getAucLicensePlate(stockIds);
                                if (auctionLpIsds.length > 0) {
                                    log.debug(title + "auctionLpIsds case 1:", JSON.stringify(auctionLpIsds));

                                    var lpitemsData = getAucLicensePlateItemsData(auctionLpIsds);

                                    if (lpitemsData.length > 0) {
                                        log.debug(title + "lpitemsData case 1:", JSON.stringify(lpitemsData));

                                        var catalogJsonData = createCatalogIndexesJson(lpitemsData, mappingLotNumber);
                                        if (catalogJsonData) {
                                            log.debug(title + "catalogJsonData:", JSON.stringify(catalogJsonData))
                                            var updateObj = {};
                                            updateObj.jsonFieldId = 'custrecord_auction_catalog_indexes_json';
                                            updateObj.checkBoxFieldId = 'custrecord_auction_is_json_catalog';

                                            updateAuctionRecord(catalogJsonData, object.internalId, updateObj);
                                        }

                                    }

                                }
                            }
                        }

                        if (!object.isCatalogByProducerJsonCreated || object.isCatalogByProducerJsonCreated) { // || object.isCatalogByProducerJsonCreated
                            var producerJsonData;
                            if (auctionLpIsds && auctionLpIsds.length > 0) {
                                log.debug(title + "auctionLpIsds case 2:", JSON.stringify(auctionLpIsds));
                                var lpitemsData = getByProducerAucLicensePlateItemsData(auctionLpIsds);

                                if (lpitemsData.length > 0) {
                                    var mappingMixedLot = objStockInfo.mappingMixedLot ? objStockInfo.mappingMixedLot : {};
                                    log.debug(title + "lpitemsData case 2:", JSON.stringify(lpitemsData));
                                    producerJsonData = createProducerIndexesJson(lpitemsData, mappingLotNumber, mappingMixedLot);

                                }

                            } else {
                                var objStockInfo = getAllStockIds(object.internalId);
                                var stockIds = objStockInfo.stockIds;
                                var mappingLotNumber = objStockInfo.mappingLotNumber ? objStockInfo.mappingLotNumber : {};
                                var mappingMixedLot = objStockInfo.mappingMixedLot ? objStockInfo.mappingMixedLot : {};
                                if (stockIds.length > 0) {
                                    log.debug(title + "stockIds case 2:", JSON.stringify(stockIds));
                                    log.debug(title + "mappingLotNumber case 2:", JSON.stringify(mappingLotNumber));
                                    var auctionLpIsds = getAucLicensePlate(stockIds);
                                    if (auctionLpIsds.length > 0) {
                                        log.debug(title + "auctionLpIsds case 2:", JSON.stringify(auctionLpIsds));

                                        var lpitemsData = getByProducerAucLicensePlateItemsData(auctionLpIsds);

                                        if (lpitemsData.length > 0) {
                                            log.debug(title + "lpitemsData case 2:", JSON.stringify(lpitemsData));

                                            producerJsonData = createProducerIndexesJson(lpitemsData, mappingLotNumber, mappingMixedLot);

                                        }

                                    }
                                }
                            }


                            if (producerJsonData) {
                                log.debug(title + "producerJsonData:", JSON.stringify(producerJsonData))
                                var updateObj = {};
                                updateObj.jsonFieldId = 'custrecord_auction_cat_index_by_producer';
                                updateObj.checkBoxFieldId = 'custrecord_auction_is_json_producer';

                                updateAuctionRecord(producerJsonData, object.internalId, updateObj);
                            }

                        }

                    }

                    // if (object.isAuctionDesign) {

                    var objStockInfo = getAllStockIds(auctionInternalids);
                    var stockIds = objStockInfo.stockIds;
                    var mappingLotNumber = objStockInfo.mappingLotNumber ? objStockInfo.mappingLotNumber : {};
                    var mappingAuction = objStockInfo.mappingAuction ? objStockInfo.mappingAuction : {};
                    if (stockIds.length > 0) {
                        log.debug(title + "stockIds case 3:", JSON.stringify(stockIds));
                        log.debug(title + "mappingLotNumber case 3:", JSON.stringify(mappingLotNumber));
                        log.debug(title + "mappingAuction case 3:", JSON.stringify(mappingAuction));
                        var auctionLpIsds = getAucLicensePlate(stockIds);
                        if (auctionLpIsds.length > 0) {
                            log.debug(title + "auctionLpIsds case 3:", JSON.stringify(auctionLpIsds));

                            var lpitemsData = getAllAucLicensePlateItemsData(auctionLpIsds, mappingAuction);

                            if (lpitemsData.length > 0) {
                                sortList(lpitemsData);
                                log.debug(title + "lpitemsData case 3:", JSON.stringify(lpitemsData));
                                var updatedData = groupItemsData(lpitemsData);
                                log.debug(title + "updatedData case 3:", JSON.stringify(updatedData));

                                var allCatalogrJsonData = createAllCatalogJson(updatedData);

                                if (allCatalogrJsonData) {
                                    log.debug(title + "allCatalogrJsonData:", JSON.stringify(allCatalogrJsonData));

                                    var fileObj = file.create({
                                        name: 'all_auctions_catalog_search_criteria.json',
                                        fileType: file.Type.JSON,
                                        contents: JSON.stringify(allCatalogrJsonData),
                                        description: 'This is a all auction search criteria file..',
                                        folder: FOLDER_ID,
                                        isOnline: true
                                    });

                                    log.debug(title + "fileObj:", JSON.stringify(fileObj));
                                    var id = fileObj.save();
                                    log.debug(title + "file id:", id);

                                }

                            }

                        }
                    }

                    // }

                }




            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);

            }
        }

        function searchAuctionLotIds(acutionId) {
            var title = 'searchAuctionLotId() :: ';
            try {
                var auctionRecIds = [];
                var auctionRecData = [];
                var aucSearchObj = search.create({
                    type: "customrecord_auction",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        [
                            ["custrecord_auction_is_json_created", "is", "F"],
                            "OR",
                            ["custrecord_auction_is_json_catalog", "is", "F"],
                            "OR",
                            ["custrecord_auction_is_json_producer", "is", "F"],
                        ],
                        "AND",
                        ["custrecord_auction_indesign", "is", "T"]
                        // "AND",
                        // ["internalid", "anyof", acutionId]
                    ],
                    columns: [
                        search.createColumn({
                            name: "internalid"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_is_json_created"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_is_json_catalog"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_is_json_producer"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_indesign"
                        })
                    ]
                });
                var tempAuctionRecData = [];
                var count = 0;
                var pageSize = 1000;
                var start = 0;

                // run saved search
                do {
                    var tempAuctionRecData = aucSearchObj.run().getRange({
                        start: start,
                        end: start + pageSize
                    });

                    auctionRecData = auctionRecData.concat(tempAuctionRecData);
                    count = auctionRecData.length;
                    start += pageSize;
                } while (count == pageSize);

                if (auctionRecData.length > 0) {
                    for (var i = 0; i < auctionRecData.length; i++) {
                        var obj = {};
                        obj.internalId = auctionRecData[i].getValue({
                            name: 'internalid'
                        });
                        obj.isJsonCreated = auctionRecData[i].getValue({
                            name: 'custrecord_auction_is_json_created'
                        }) || "";
                        obj.isCatalogJsonCreated = auctionRecData[i].getValue({
                            name: 'custrecord_auction_is_json_catalog'
                        }) || "";
                        obj.isCatalogByProducerJsonCreated = auctionRecData[i].getValue({
                            name: 'custrecord_auction_is_json_producer'
                        }) || "";
                        obj.isAuctionDesign = auctionRecData[i].getValue({
                            name: 'custrecord_auction_indesign'
                        }) || "";
                        auctionRecIds.push(obj);
                    }
                }
                log.debug(title + "auctionRecIds:", JSON.stringify(auctionRecIds))

                return auctionRecIds;
            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);

            }

        }

        function getAuctionLotObjData(auctionId) {
            var title = 'getAuctionLotObjData() :: ';
            try {
                var stockIds = [];
                var auctionLotRecObjData = [];
                var auctionLotRecData = [];
                var aucLotSearchObj = search.create({
                    type: "customrecord_auction_lot",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_auction_lot_auction", "anyof", auctionId]
                    ],
                    columns: [
                        search.createColumn({
                            name: "internalid"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_auction"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_title"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_size"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_lotnumber",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_size_desc"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_bttl_qty"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_vintage"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_cru"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_appellation"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_bottle_low"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_estimate_high"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_assessment_note"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_critic_notes"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_currency"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_mixed_lot"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_stockid"
                        })
                    ]
                });
                var tempAuctionLotRecData = [];
                var count = 0;
                var pageSize = 1000;
                var start = 0;

                // run saved search
                do {
                    var tempAuctionLotRecData = aucLotSearchObj.run().getRange({
                        start: start,
                        end: start + pageSize
                    });

                    auctionLotRecData = auctionLotRecData.concat(tempAuctionLotRecData);
                    count = auctionLotRecData.length;
                    start += pageSize;
                } while (count == pageSize);

                if (auctionLotRecData.length > 0) {
                    for (var i = 0; i < auctionLotRecData.length; i++) {
                        var obj = {};
                        obj.internalId = auctionLotRecData[i].getValue({
                            name: 'internalid'
                        }) || "";
                        obj.auction = auctionLotRecData[i].getText({
                            name: 'custrecord_auction_lot_auction'
                        }) || "";
                        obj.lotNumber = auctionLotRecData[i].getValue({
                            name: 'custrecord_auction_lot_lotnumber',
                            sort: search.Sort.ASC
                        }) || "";
                        var parcelInfo = auctionLotRecData[i].getText({
                            name: 'custrecord_auction_lot'
                        }) || "";
                        var parcel = auctionLotRecData[i].getValue({
                            name: 'custrecord_auction_lot_lotnumber'
                        }) || "";
                        obj.parcel = parcelInfo ? parcel : '';
                        obj.title = auctionLotRecData[i].getValue({
                            name: 'custrecord_auction_lot_title'
                        }) || "";
                        obj.size = auctionLotRecData[i].getText({
                            name: 'custrecord_auction_lot_size'
                        });
                        obj.sizeDescription = auctionLotRecData[i].getValue({
                            name: "custrecord_auction_lot_size_desc"
                        }) || "";
                        obj.bottleQuantity = auctionLotRecData[i].getValue({
                            name: 'custrecord_auction_lot_bttl_qty'
                        });
                        obj.vintage = auctionLotRecData[i].getText({
                            name: 'custrecord_auction_lot_vintage'
                        }) || "";
                        obj.cru = auctionLotRecData[i].getText({
                            name: 'custrecord_auction_lot_cru'
                        }) || "";
                        obj.region = auctionLotRecData[i].getText({
                            name: 'custrecord_auction_lot_appellation'
                        }) || "";
                        obj.estimateLow = auctionLotRecData[i].getValue({
                            name: 'custrecord_auction_lot_bottle_low'
                        }) || "";
                        obj.estimateHigh = auctionLotRecData[i].getValue({
                            name: 'custrecord_auction_lot_estimate_high'
                        }) || "";
                        obj.assessmentNote = auctionLotRecData[i].getValue({
                            name: 'custrecord_auction_lot_assessment_note'
                        }) || "";
                        obj.criticNotes = auctionLotRecData[i].getValue({
                            name: 'custrecord_auction_lot_critic_notes'
                        }) || "";
                        obj.isMixedLot = auctionLotRecData[i].getValue({
                            name: 'custrecord_auction_lot_mixed_lot'
                        }) || "";
                        var stockId = auctionLotRecData[i].getValue({
                            name: 'custrecord_auction_lot_stockid'
                        }) || "";
                        if (obj.isMixedLot) {
                            stockIds.push(stockId);
                        }
                        var currencyId = auctionLotRecData[i].getValue({
                            name: "custrecord_auction_lot_currency"
                        }) || "";
                        obj.currencySymbol = "";
                        obj.localeText = "";
                        if (currencyId) {
                            var currencyRec = record.load({
                                type: record.Type.CURRENCY,
                                id: currencyId
                            });
                            var currencySymbol = currencyRec.getValue("displaysymbol");
                            var localeText = currencyRec.getValue("locale") ? currencyRec.getValue("locale").split("_")[1] : "";
                            obj.currencySymbol = currencySymbol || "";
                            obj.localeText = localeText || "";

                        }
                        auctionLotRecObjData.push(obj);
                    }
                }

                return {
                    auctionLotRecObjData: auctionLotRecObjData,
                    stockIds: stockIds
                };
            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);

            }

        }

        function getJsonAucLicensePlateItemsData(lpIds) {
            try {
                var title = 'getJsonAucLicensePlateItemsData() :: ';
                var dataArr = [];
                var validateItems = {};
                var lpSearch = search.create({
                    type: "customrecord_lp_item",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_lp_item_lp", "anyof", lpIds]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custitem_auction_display_name",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "custitem_size",
                            join: "custrecord_lp_item_item"
                        }),
                        search.createColumn({
                            name: "custitem_vintage",
                            join: "custrecord_lp_item_item"
                        })
                    ]
                });
                var searchResults = [];
                var count = 0;
                var pageSize = 1000;
                var start = 0;

                // run saved search
                do {
                    var tempArr = lpSearch.run().getRange({
                        start: start,
                        end: start + pageSize
                    });

                    searchResults = searchResults.concat(tempArr);
                    count = searchResults.length;
                    start += pageSize;
                } while (count == pageSize);
                log.debug(title + "searchResults:", JSON.stringify(searchResults))

                if (searchResults.length > 0) {
                    for (var i = 0; i < searchResults.length; i++) {
                        var obj = {};
                        obj.auctionDisplayName = searchResults[i].getValue({
                            name: "custitem_auction_display_name",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        }) || "";
                        obj.sizeId = searchResults[i].getValue({
                            name: "custitem_size",
                            join: "custrecord_lp_item_item"
                        }) || "";
                        obj.sizeName = searchResults[i].getText({
                            name: "custitem_size",
                            join: "custrecord_lp_item_item"
                        }) || "";

                        obj.vintageId = searchResults[i].getValue({
                            name: "custitem_vintage",
                            join: "custrecord_lp_item_item"
                        }) || "";
                        obj.vintageName = searchResults[i].getText({
                            name: "custitem_vintage",
                            join: "custrecord_lp_item_item"
                        }) || "";

                        var tempStr = obj.sizeId + obj.vintageId + obj.auctionDisplayName.replace(/ /g, '');
                        if (!validateItems[tempStr]) {
                            dataArr.push(obj);
                            validateItems[tempStr] = true;
                        }

                    }
                }

                return dataArr;

            } catch (e) {
                log.error("ERROR IN: " + title, e.message);
            }
        }

        function getJsonFormatData(auctionLotRecObjData, lpitemsData) {
            var funcTitle = 'getJsonFormatData() :: ';
            try {
                var fomartObjData = [];
                var body = {};
                var parcelArr = [];
                var conditionsArr = [];
                var sizeMappingData = getAllSizeDescriptionInfo();
                log.debug(funcTitle + 'sizeMappingData:', JSON.stringify(sizeMappingData))
                var mixedLotFlag = false;
                for (var i = 0; i < auctionLotRecObjData.length; i++) {
                    var mixedDetails = [];
                    var lotInfoObj = {};
                    var lotNumber = auctionLotRecObjData[i].lotNumber;
                    var parcel = auctionLotRecObjData[i].parcel;
                    var title = auctionLotRecObjData[i].title;
                    var size = auctionLotRecObjData[i].size;
                    var sizeDescription = auctionLotRecObjData[i].sizeDescription;
                    var bottleQuantity = auctionLotRecObjData[i].bottleQuantity;
                    var vintage = auctionLotRecObjData[i].vintage;
                    var cruName = auctionLotRecObjData[i].cru;
                    var region = auctionLotRecObjData[i].region;
                    var estimateLow = auctionLotRecObjData[i].estimateLow;
                    var estimateHigh = auctionLotRecObjData[i].estimateHigh;
                    var assessmentNote = auctionLotRecObjData[i].assessmentNote;
                    var criticNotes = auctionLotRecObjData[i].criticNotes;
                    var currencySymbol = auctionLotRecObjData[i].currencySymbol
                    var localeText = auctionLotRecObjData[i].localeText;
                    var isMixedLot = auctionLotRecObjData[i].isMixedLot;



                    if (isMixedLot) {
                        var assessmentMapping = {};
                        assessmentNote = assessmentNote ? assessmentNote.replace(/\r\n\r\n/g, '<BR>') : "";
                        assessmentNote = assessmentNote ? assessmentNote.replace(/\r\n/g, '<BR>') : "";
                        assessmentNote = assessmentNote ? assessmentNote.replace(/<br>/g, '<BR>') : "";
                        var assessmentNotArr = assessmentNote ? assessmentNote.split('<BR>') : [];
                        if (assessmentNotArr.length > 0) {
                            log.debug(funcTitle + 'assessmentNotArr:', JSON.stringify(assessmentNotArr))
                            log.debug(funcTitle + 'lpitemsData:', JSON.stringify(lpitemsData))
                            for (var jj = 0; jj < lpitemsData.length; jj++) {
                                for (var kk = 0; kk < assessmentNotArr.length; kk++) {
                                    if (assessmentNotArr[kk].indexOf(lpitemsData[jj].auctionDisplayName) != -1) {
                                        assessmentMapping[assessmentNotArr[kk]] = true;
                                    }

                                }
                            }
                            log.debug(funcTitle + 'assessmentMapping:', JSON.stringify(assessmentMapping));
                            for (var kk = 0; kk < assessmentNotArr.length; kk++) {
                                for (var jj = 0; jj < lpitemsData.length; jj++) {
                                    if (assessmentNotArr[kk].indexOf(lpitemsData[jj].auctionDisplayName) != -1 && assessmentNotArr[kk].indexOf(lpitemsData[jj].sizeName) != -1 && assessmentNotArr[kk].indexOf(lpitemsData[jj].vintageName) != -1) {
                                        if (assessmentNotArr[kk].length != kk + 1 && !assessmentMapping[assessmentNotArr[kk + 1]]) {
                                            var mixQty = assessmentNotArr[kk] ? assessmentNotArr[kk].split(' ')[0] : "";
                                            var sizeType = (parseInt(mixQty) > 1) ? sizeMappingData[lpitemsData[jj].sizeId + 'plural'] : sizeMappingData[lpitemsData[jj].sizeId + 'singular']
                                            mixedDetails.push({
                                                "__type": "MixedLotInfo:#CatalogWebService",
                                                "Condition": assessmentNotArr[kk + 1],
                                                "Description": lpitemsData[jj].auctionDisplayName,
                                                "LotNo": lotNumber,
                                                "Qty": mixQty,
                                                "Size": lpitemsData[jj].sizeName,
                                                "SizeType": sizeType ? sizeType : "",
                                                "Vintage": lpitemsData[jj].vintageName
                                            });

                                        }
                                    }
                                }
                            }

                            log.debug(funcTitle + 'mixedDetails:', JSON.stringify(mixedDetails));
                        }
                    }

                    if (i == 0) {
                        body.__type = "CatalogItem:#CatalogWebService";
                        body.Class = null;
                        body.ConditionText = null;
                        body.Conditions = [];
                        body.Copy = criticNotes;
                        body.Description = title;
                        body.LotInfos = [];
                        // var mixedLotNumber = lotNumber ? '(' + lotNumber + ')' : "";
                        body.LotNo = lotNumber ? lotNumber : "";
                        body.MixedLotInfos = (isMixedLot && mixedDetails.length > 0) ? mixedDetails : null;
                        body.ParcelInfo = "";
                        body.Region = region;
                        body.StockId = null;
                        body.Vintage = vintage;
                        body.Class = cruName;
                        mixedLotFlag = isMixedLot ? true : false;

                    } else if (body.Description != title) {
                        var ParcelInfo = "";
                        if (parcelArr.length == 1) {
                            ParcelInfo = parcelArr[0];
                        }
                        if (parcelArr.length == 2) {
                            parcelArr.sort(function (a, b) {
                                return a - b;
                            });
                            ParcelInfo = parcelArr.join(" & ");
                        } else if (parcelArr.length > 2) {
                            parcelArr.sort(function (a, b) {
                                return a - b;
                            });

                            var l1 = parcelArr[0];
                            var l2 = parcelArr[parcelArr.length - 1];
                            ParcelInfo = l1 + '-' + l2;

                        }
                        body.ParcelInfo = ParcelInfo ? [ParcelInfo] : "";
                        body.Conditions = !mixedLotFlag ? conditionsArr : "";
                        fomartObjData.push(body);
                        var body = {};
                        body.__type = "CatalogItem:#CatalogWebService";
                        body.Class = null;
                        body.ConditionText = null;
                        body.Conditions = [];
                        body.Copy = criticNotes;
                        body.Description = title;
                        body.LotInfos = [];

                        body.LotNo = lotNumber ? lotNumber : "";
                        body.MixedLotInfos = (isMixedLot && mixedDetails.length > 0) ? mixedDetails : null;
                        body.ParcelInfo = "";
                        body.Region = region;
                        body.StockId = null;
                        body.Vintage = vintage;
                        body.Class = cruName;
                        conditionsArr = [];
                        var parcelArr = [];
                        mixedLotFlag = isMixedLot ? true : false;
                    }

                    lotInfoObj.__type = "LotInfo:#CatalogWebService";
                    lotInfoObj.Condition = assessmentNote;
                    lotInfoObj.Copy = null;
                    lotInfoObj.CurrencySymbol = localeText + currencySymbol;
                    lotInfoObj.LotNo = lotNumber;
                    lotInfoObj.OtherPrice = "";
                    lotInfoObj.Price = localeText + currencySymbol + parseInt(estimateLow) + '-' + parseInt(estimateHigh);
                    lotInfoObj.Qty = bottleQuantity;
                    lotInfoObj.SizeEnum = null;
                    var sizeText = size ? " (" + size + ")" : "";
                    lotInfoObj.SizeType = sizeDescription.toLowerCase() != "bottle" ? sizeDescription + sizeText : sizeDescription;

                    body.LotInfos.push(lotInfoObj);
                    if (parcel) {
                        parcelArr.push(parcel);
                    }

                    conditionsArr.push({
                        "__type": "Condition:#CatalogWebService",
                        "LotNo": null,
                        "LotNoTxt": lotNumber,
                        "Text": assessmentNote
                    });

                    if (auctionLotRecObjData.length == i + 1) {
                        var ParcelInfo = "";
                        if (parcelArr.length == 1) {
                            ParcelInfo = parcelArr[0];
                        }
                        if (parcelArr.length == 2) {
                            parcelArr.sort(function (a, b) {
                                return a - b;
                            });
                            ParcelInfo = parcelArr.join(" & ");
                        } else if (parcelArr.length > 2) {
                            parcelArr.sort(function (a, b) {
                                return a - b;
                            });

                            var l1 = parcelArr[0];
                            var l2 = parcelArr[parcelArr.length - 1];
                            ParcelInfo = l1 + '-' + l2;

                        }
                        body.ParcelInfo = ParcelInfo ? [ParcelInfo] : "";
                        body.Conditions = !mixedLotFlag ? conditionsArr : "";
                        fomartObjData.push(body);
                    }
                }

                return fomartObjData;
            } catch (e) {
                log.error("ERROR IN:: " + funcTitle, e.message);

            }

        }

        function updateAuctionRecord(jsonObjData, auctionId, obj) {
            var title = "updateAuctionRecord() :: ";
            try {
                log.debug(title + "obj:", JSON.stringify(obj))
                var jsonFieldId = obj.jsonFieldId;
                var checkBoxFieldId = obj.checkBoxFieldId;
                var data = {};
                data[jsonFieldId] = JSON.stringify(jsonObjData);
                data[checkBoxFieldId] = 'T';


                record.submitFields({
                    type: "customrecord_auction",
                    id: auctionId,
                    values: data,
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                });
                return true;
            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);
            }
        }

        function getAllStockIds(auctionIds) {
            var title = 'getAllStockIds() :: ';
            try {
                var dataArr = [];
                var mappingLotNumber = {};
                var mappingAuction = {};
                var mappingMixedLot = {};
                var aucLotSearchObj = search.create({
                    type: "customrecord_auction_lot",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_auction_lot_auction", "anyof", auctionIds]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custrecord_auction_lot_stockid"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_lotnumber"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_auction"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_mixed_lot"
                        })
                    ]
                });

                var auctionLotRecData = [];
                var tempAuctionLotRecData = [];
                var count = 0;
                var pageSize = 1000;
                var start = 0;

                // run saved search
                do {
                    var tempAuctionLotRecData = aucLotSearchObj.run().getRange({
                        start: start,
                        end: start + pageSize
                    });

                    auctionLotRecData = auctionLotRecData.concat(tempAuctionLotRecData);
                    count = auctionLotRecData.length;
                    start += pageSize;
                } while (count == pageSize);

                if (auctionLotRecData.length > 0) {
                    for (var i = 0; i < auctionLotRecData.length; i++) {
                        var obj = {};
                        var id = auctionLotRecData[i].getValue({
                            name: 'custrecord_auction_lot_stockid'
                        }) || "";
                        var lotNumber = auctionLotRecData[i].getValue({
                            name: 'custrecord_auction_lot_lotnumber'
                        }) || "";
                        var mixedLot = auctionLotRecData[i].getValue({
                            name: 'custrecord_auction_lot_mixed_lot'
                        }) || "";
                        obj.auctionId = auctionLotRecData[i].getValue({
                            name: "custrecord_auction_lot_auction"
                        }) || "";
                        obj.auctionName = auctionLotRecData[i].getText({
                            name: "custrecord_auction_lot_auction"
                        }) || "";

                        if (id) {
                            dataArr.push(id);
                            mappingAuction[id] = obj;

                            if (lotNumber) {
                                mappingLotNumber[id] = lotNumber;
                                mappingMixedLot[lotNumber] = mixedLot ? true : false;
                            }
                        }
                    }
                }

                return {
                    stockIds: dataArr,
                    mappingLotNumber: mappingLotNumber,
                    mappingAuction: mappingAuction,
                    mappingMixedLot: mappingMixedLot
                };
            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);

            }

        }

        function getAucLicensePlate(stockIds) {
            try {
                var title = 'getAucLicensePlate() :: ';
                var dataArr = [];
                var lpSearch = search.create({
                    type: 'customrecord_auc_lp',
                    filters: [
                        search.createFilter({
                            name: 'custrecord_auc_lp_stockid',
                            operator: search.Operator.ANYOF,
                            values: stockIds
                        })
                    ],
                    columns: [
                        search.createColumn({
                            name: 'internalid'
                        })
                    ]
                });
                var searchResults = [];
                var count = 0;
                var pageSize = 1000;
                var start = 0;

                // run saved search
                do {
                    var tempArr = lpSearch.run().getRange({
                        start: start,
                        end: start + pageSize
                    });

                    searchResults = searchResults.concat(tempArr);
                    count = searchResults.length;
                    start += pageSize;
                } while (count == pageSize);
                log.debug(title + "searchResults:", JSON.stringify(searchResults))

                if (searchResults.length > 0) {
                    for (var i = 0; i < searchResults.length; i++) {
                        dataArr.push(searchResults[i].id);
                    }
                }

                return dataArr;

            } catch (e) {
                log.error("ERROR IN: " + title, e.message);
            }
        }

        function getAucLicensePlateItemsData(lpIds) {
            try {
                var title = 'getAucLicensePlateItemsData() :: ';
                var dataArr = [];
                var lpSearch = search.create({
                    type: "customrecord_lp_item",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_lp_item_lp", "anyof", lpIds]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custrecord_lp_item_lp"
                        }),
                        search.createColumn({
                            name: "custrecord_auc_lp_stockid",
                            join: "custrecord_lp_item_lp"
                        }),
                        search.createColumn({
                            name: "custitem_class",
                            join: "custrecord_lp_item_item"
                        }),
                        search.createColumn({
                            name: "cseg_country",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "cseg_region",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "custitem_size",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "custitem_vintage",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "custitem_auction_display_name",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        })
                    ]
                });
                var searchResults = [];
                var count = 0;
                var pageSize = 1000;
                var start = 0;

                // run saved search
                do {
                    var tempArr = lpSearch.run().getRange({
                        start: start,
                        end: start + pageSize
                    });

                    searchResults = searchResults.concat(tempArr);
                    count = searchResults.length;
                    start += pageSize;
                } while (count == pageSize);
                log.debug(title + "searchResults:", JSON.stringify(searchResults))

                if (searchResults.length > 0) {
                    var body = {};
                    for (var i = 0; i < searchResults.length; i++) {
                        var auctionLpId = searchResults[i].getValue({
                            name: "custrecord_lp_item_lp"
                        });
                        var stockId = searchResults[i].getValue({
                            name: "custrecord_auc_lp_stockid",
                            join: "custrecord_lp_item_lp"
                        });

                        var itemId = searchResults[i].getValue({
                            name: "custrecord_lp_item_item"
                        });
                        var classId = searchResults[i].getValue({
                            name: "custitem_class",
                            join: "custrecord_lp_item_item"
                        });
                        var className = searchResults[i].getText({
                            name: "custitem_class",
                            join: "custrecord_lp_item_item"
                        }) || null;
                        var countryId = searchResults[i].getValue({
                            name: "cseg_country",
                            join: "custrecord_lp_item_item"
                        });
                        var countryName = searchResults[i].getText({
                            name: "cseg_country",
                            join: "custrecord_lp_item_item"
                        }) || null;
                        var regionId = searchResults[i].getValue({
                            name: "cseg_region",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        });
                        var regionName = searchResults[i].getText({
                            name: "cseg_region",
                            join: "custrecord_lp_item_item"
                        }) || null;
                        var sizeId = searchResults[i].getValue({
                            name: "custitem_size",
                            join: "custrecord_lp_item_item"
                        });
                        var sizeName = searchResults[i].getText({
                            name: "custitem_size",
                            join: "custrecord_lp_item_item"
                        }) || null;
                        var vintageId = searchResults[i].getValue({
                            name: "custitem_vintage",
                            join: "custrecord_lp_item_item"
                        });
                        var vintageName = searchResults[i].getText({
                            name: "custitem_vintage",
                            join: "custrecord_lp_item_item"
                        }) || null;
                        var auctionDisplayName = searchResults[i].getValue({
                            name: "custitem_auction_display_name",
                            join: "custrecord_lp_item_item"
                        }) || null;
                        var auctionSubStr = (auctionDisplayName && auctionDisplayName != null && auctionDisplayName.length > 4) ? auctionDisplayName.substr(auctionDisplayName.length - 4, 4) : '';
                        if (auctionSubStr) {
                            var isSubStrYear = isYearExist(auctionSubStr);
                            auctionDisplayName = isSubStrYear ? auctionDisplayName.substr(0, auctionDisplayName.length - 4).trim() : auctionDisplayName
                        }

                        if (i == 0) {
                            body.auctionLpId = auctionLpId;
                            body.classId = classId;
                            body.className = className;
                            body.countryId = countryId;
                            body.countryName = countryName;
                            body.regionId = regionId;
                            body.regionName = regionName;
                            body.sizeId = sizeId;
                            body.sizeName = sizeName;
                            body.lines = [];

                        } else if (body.countryId != countryId || body.regionId != regionId || body.sizeId != sizeId || body.classId != classId) {
                            dataArr.push(body);
                            var body = {};
                            body.auctionLpId = auctionLpId;
                            body.classId = classId;
                            body.className = className;
                            body.countryId = countryId;
                            body.countryName = countryName;
                            body.regionId = regionId;
                            body.regionName = regionName;
                            body.sizeId = sizeId;
                            body.sizeName = sizeName;
                            body.lines = [];
                        }

                        var obj = {};
                        obj.description = auctionDisplayName
                        obj.itemId = itemId;
                        obj.stockId = stockId;
                        obj.auctionLpItemId = searchResults[i].id;
                        obj.vintageId = vintageId;
                        obj.vintageName = vintageName;

                        body.lines.push(obj);

                        if (searchResults.length == i + 1) {
                            dataArr.push(body);
                        }

                    }
                }

                return dataArr;

            } catch (e) {
                log.error("ERROR IN: " + title, e.message);
            }
        }

        function getByProducerAucLicensePlateItemsData(lpIds) {
            try {
                var title = 'getByProducerAucLicensePlateItemsData() :: ';
                var dataArr = [];
                var lpSearch = search.create({
                    type: "customrecord_lp_item",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_lp_item_lp", "anyof", lpIds]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custrecord_lp_item_lp"
                        }),
                        search.createColumn({
                            name: "custrecord_auc_lp_stockid",
                            join: "custrecord_lp_item_lp"
                        }),
                        search.createColumn({
                            name: "cseg_region",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "custitem_producer",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "custitem_vintage",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "custitem_auction_display_name",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "custitem_size",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        }),
                    ]
                });
                var searchResults = [];
                var count = 0;
                var pageSize = 1000;
                var start = 0;

                // run saved search
                do {
                    var tempArr = lpSearch.run().getRange({
                        start: start,
                        end: start + pageSize
                    });

                    searchResults = searchResults.concat(tempArr);
                    count = searchResults.length;
                    start += pageSize;
                } while (count == pageSize);
                log.debug(title + "searchResults:", JSON.stringify(searchResults))

                if (searchResults.length > 0) {
                    var body = {};
                    for (var i = 0; i < searchResults.length; i++) {
                        var auctionLpId = searchResults[i].getValue({
                            name: "custrecord_lp_item_lp"
                        });
                        var stockId = searchResults[i].getValue({
                            name: "custrecord_auc_lp_stockid",
                            join: "custrecord_lp_item_lp"
                        });

                        var itemId = searchResults[i].getValue({
                            name: "custrecord_lp_item_item"
                        });
                        var producerId = searchResults[i].getValue({
                            name: "custitem_producer",
                            join: "custrecord_lp_item_item"
                        });
                        var producerName = searchResults[i].getText({
                            name: "custitem_producer",
                            join: "custrecord_lp_item_item"
                        }) || null;

                        var regionId = searchResults[i].getValue({
                            name: "cseg_region",
                            join: "custrecord_lp_item_item"
                        });
                        var regionName = searchResults[i].getText({
                            name: "cseg_region",
                            join: "custrecord_lp_item_item"
                        }) || null;

                        var sizeId = searchResults[i].getValue({
                            name: "custitem_size",
                            join: "custrecord_lp_item_item"
                        });
                        var sizeName = searchResults[i].getText({
                            name: "custitem_size",
                            join: "custrecord_lp_item_item"
                        }) || null;
                        var vintageId = searchResults[i].getValue({
                            name: "custitem_vintage",
                            join: "custrecord_lp_item_item"
                        });
                        var vintageName = searchResults[i].getText({
                            name: "custitem_vintage",
                            join: "custrecord_lp_item_item"
                        }) || null;
                        var auctionDisplayName = searchResults[i].getValue({
                            name: "custitem_auction_display_name",
                            join: "custrecord_lp_item_item"
                        }) || null;
                        var auctionSubStr = (auctionDisplayName && auctionDisplayName != null && auctionDisplayName.length > 4) ? auctionDisplayName.substr(auctionDisplayName.length - 4, 4) : '';
                        if (auctionSubStr) {
                            var isSubStrYear = isYearExist(auctionSubStr);
                            auctionDisplayName = isSubStrYear ? auctionDisplayName.substr(0, auctionDisplayName.length - 4).trim() : auctionDisplayName
                        }


                        if (i == 0) {
                            body.auctionLpId = auctionLpId;
                            body.producerId = producerId;
                            body.producerName = producerName;
                            body.regionId = regionId;
                            body.regionName = regionName;
                            body.lines = [];

                        } else if (body.producerId != producerId || body.regionId != regionId) {
                            dataArr.push(body);
                            var body = {};
                            body.auctionLpId = auctionLpId;
                            body.producerId = producerId;
                            body.producerName = producerName;
                            body.regionId = regionId;
                            body.regionName = regionName;
                            body.lines = [];
                        }

                        var obj = {};
                        obj.description = auctionDisplayName || null;
                        obj.itemId = itemId;
                        obj.stockId = stockId;
                        obj.auctionLpItemId = searchResults[i].id;
                        obj.vintageId = vintageId;
                        obj.vintageName = vintageName;
                        obj.sizeId = sizeId;
                        obj.sizeName = sizeName;

                        body.lines.push(obj);

                        if (searchResults.length == i + 1) {
                            dataArr.push(body);
                        }

                    }
                }

                return dataArr;

            } catch (e) {
                log.error("ERROR IN: " + title, e.message);
            }
        }

        function getAllAucLicensePlateItemsData(lpIds, mappingAuction) {
            try {
                var title = 'getAllAucLicensePlateItemsData() :: ';
                var dataArr = [];
                var lpSearch = search.create({
                    type: "customrecord_lp_item",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_lp_item_lp", "anyof", lpIds]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custrecord_lp_item_lp"
                        }),
                        search.createColumn({
                            name: "custrecord_auc_lp_stockid",
                            join: "custrecord_lp_item_lp"
                        }),
                        search.createColumn({
                            name: "cseg_country",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "cseg_region",
                            join: "custrecord_lp_item_item",
                            sort: search.Sort.ASC
                        })
                    ]
                });
                var searchResults = [];
                var count = 0;
                var pageSize = 1000;
                var start = 0;

                // run saved search
                do {
                    var tempArr = lpSearch.run().getRange({
                        start: start,
                        end: start + pageSize
                    });

                    searchResults = searchResults.concat(tempArr);
                    count = searchResults.length;
                    start += pageSize;
                } while (count == pageSize);
                log.debug(title + "searchResults:", JSON.stringify(searchResults))

                if (searchResults.length > 0) {
                    for (var i = 0; i < searchResults.length; i++) {
                        var body = {};
                        var auctionLpId = searchResults[i].getValue({
                            name: "custrecord_lp_item_lp"
                        });
                        var stockId = searchResults[i].getValue({
                            name: "custrecord_auc_lp_stockid",
                            join: "custrecord_lp_item_lp"
                        });

                        var countryId = searchResults[i].getValue({
                            name: "cseg_country",
                            join: "custrecord_lp_item_item"
                        });
                        var countryName = searchResults[i].getText({
                            name: "cseg_country",
                            join: "custrecord_lp_item_item"
                        }) || null;

                        var regionId = searchResults[i].getValue({
                            name: "cseg_region",
                            join: "custrecord_lp_item_item"
                        });
                        var regionName = searchResults[i].getText({
                            name: "cseg_region",
                            join: "custrecord_lp_item_item"
                        }) || null;

                        body.auctionId = mappingAuction[stockId] ? parseInt(mappingAuction[stockId].auctionId) : "";
                        body.auctionName = mappingAuction[stockId] ? mappingAuction[stockId].auctionName : "";
                        body.auctionLpId = auctionLpId;
                        body.countryId = countryId ? parseInt(countryId) : 0;
                        body.countryName = countryName;
                        body.regionId = regionId ? parseInt(regionId) : 0;
                        body.regionName = regionName;
                        dataArr.push(body);

                    }
                }

                return dataArr;

            } catch (e) {
                log.error("ERROR IN: " + title, e.message);
            }
        }

        function createCatalogIndexesJson(lpitemsData, mappingLotNumber) {
            var title = "createCatalogIndexesJson() :: ";
            try {
                var objData = {};
                objData.d = [];

                for (var i = 0; i < lpitemsData.length; i++) {
                    var obj = lpitemsData[i];
                    var lines = lpitemsData[i].lines;
                    var bodyObj = {};
                    bodyObj.__type = "IndexItem:#CatalogWebService"
                    bodyObj.Class = obj.className;
                    bodyObj.Country = obj.countryName;
                    bodyObj.Region = obj.regionName;
                    bodyObj.Size = obj.sizeName;
                    bodyObj.Vintages = [];

                    var previosVintageId;
                    var previosVintageName;
                    var previosItemId;
                    var lineObj = {};
                    var wines = [];
                    for (var j = 0; j < lines.length; j++) {
                        var vintageId = lines[j].vintageId;
                        var vintageName = lines[j].vintageName;
                        var currentItemId = lines[j].itemId;
                        var stockId = lines[j].stockId
                        if (j == 0) {
                            previosVintageName = vintageName;
                            previosVintageId = vintageId;
                            previosItemId = currentItemId;
                            lineObj.__type = "Wine:#CatalogWebService";
                            lineObj.CatIndex = stockId ? mappingLotNumber[stockId] : "";
                            lineObj.Description = lines[j].description;
                            lineObj.Size = null;
                        } else if (previosVintageId != vintageId) {
                            var tempObj = {};
                            tempObj.__type = "Vintage:#CatalogWebService"
                            tempObj.Wines = wines;
                            tempObj.Year = previosVintageName;
                            previosVintageId = vintageId;
                            previosVintageName = vintageName;
                            wines = [];
                            bodyObj.Vintages.push(tempObj);
                        }


                        if (previosItemId != currentItemId) {
                            var tempIndex = lineObj.CatIndex ? lineObj.CatIndex.split(',') : [];
                            var updatedIndex = tempIndex.sort(function (a, b) {
                                return a - b;
                            });
                            lineObj.CatIndex = updatedIndex.length > 0 ? updatedIndex.join(", ") : "";
                            wines.push(lineObj);
                            lineObj = {}
                            lineObj.__type = "Wine:#CatalogWebService";
                            lineObj.CatIndex = stockId ? mappingLotNumber[stockId] : "";;
                            lineObj.Description = lines[j].description;
                            lineObj.Size = null;
                            previosItemId = currentItemId;
                        } else if (j != 0) {
                            if (lineObj.CatIndex && lineObj.CatIndex.indexOf(mappingLotNumber[stockId]) == -1) {
                                lineObj.CatIndex += stockId ? "," + mappingLotNumber[stockId] : "";
                            } else {
                                if (!lineObj.CatIndex) {
                                    lineObj.CatIndex += stockId ? mappingLotNumber[stockId] : "";

                                }
                            }
                        }

                        if (lines.length == j + 1) {
                            var tempIndex = lineObj.CatIndex ? lineObj.CatIndex.split(',') : [];
                            var updatedIndex = tempIndex.sort(function (a, b) {
                                return a - b;
                            });
                            lineObj.CatIndex = updatedIndex.length > 0 ? updatedIndex.join(", ") : "";
                            wines.push(lineObj);
                            var tempObj = {};
                            tempObj.__type = "Vintage:#CatalogWebService"
                            tempObj.Wines = wines;
                            tempObj.Year = vintageName;

                            bodyObj.Vintages.push(tempObj);
                        }
                    }

                    objData.d.push(bodyObj)
                }

                return objData;

            } catch (e) {
                log.error("ERROR IN: " + title, e.message);
            }

        }

        function createProducerIndexesJson(lpitemsData, mappingLotNumber, mappingMixedLot) {
            var title = "createProducerIndexesJson() :: ";
            try {
                log.debug(title + "mappingMixedLot:", JSON.stringify(mappingMixedLot))
                var objData = {};
                objData.d = [];

                var previosRegionId;
                var gruopObj = {};
                for (var i = 0; i < lpitemsData.length; i++) {
                    var obj = lpitemsData[i];
                    var lines = lpitemsData[i].lines;
                    var bodyObj = {};
                    bodyObj.__type = "Producer:#CatalogWebService.Models"
                    bodyObj.Name = obj.producerName;
                    bodyObj.Vintages = [];

                    var previosVintageId;
                    var previosVintageName;
                    var previosItemId;
                    var previosSizeId;
                    var previosSizeName;
                    var lineObj = {};
                    var wines = [];
                    for (var j = 0; j < lines.length; j++) {
                        var vintageId = lines[j].vintageId;
                        var vintageName = lines[j].vintageName;
                        var sizeId = lines[j].sizeId;
                        var sizeName = lines[j].sizeName;

                        var currentItemId = lines[j].itemId;
                        var stockId = lines[j].stockId
                        if (j == 0) {
                            previosVintageId = vintageId;
                            previosVintageName = vintageName;
                            previosSizeId = sizeId;
                            previosSizeName = sizeName;
                            previosItemId = currentItemId;
                            lineObj.__type = "Wine:#CatalogWebService";
                            var lotNumberValue = stockId ? mappingLotNumber[stockId] : "";
                            var mixedLotNumber = lotNumberValue ? mappingMixedLot[lotNumberValue] : "";
                            lineObj.CatIndex = mixedLotNumber ? '(' + lotNumberValue + ')' : lotNumberValue;
                            lineObj.Description = lines[j].description;
                            lineObj.Size = sizeName;
                        } else if (previosVintageId != vintageId) {
                            var tempIndex = lineObj.CatIndex ? lineObj.CatIndex.split(',') : [];
                            var updatedIndex = tempIndex.sort(function (a, b) {
                                return a - b;
                            });
                            lineObj.CatIndex = updatedIndex.length > 0 ? updatedIndex.join(", ") : "";
                            wines.push(lineObj);

                            var tempObj = {};
                            tempObj.__type = "Vintage:#CatalogWebService"
                            tempObj.Wines = wines;
                            tempObj.Year = previosVintageName;
                            bodyObj.Vintages.push(tempObj);
                            wines = [];
                            previosVintageId = vintageId;
                            previosVintageName = vintageName;
                            previosSizeName = sizeName;

                            lineObj = {}
                            lineObj.__type = "Wine:#CatalogWebService";
                            var lotNumberValue = stockId ? mappingLotNumber[stockId] : "";
                            var mixedLotNumber = lotNumberValue ? mappingMixedLot[lotNumberValue] : "";
                            lineObj.CatIndex = mixedLotNumber ? '(' + lotNumberValue + ')' : lotNumberValue;
                            lineObj.Description = lines[j].description;
                            lineObj.Size = previosSizeName;
                            previosItemId = currentItemId;
                            previosSizeId = sizeId
                            previosSizeName = sizeName;
                        }

                        if (previosVintageId == vintageId) {
                            if (previosItemId != currentItemId) {
                                var tempIndex = lineObj.CatIndex ? lineObj.CatIndex.split(',') : [];
                                var updatedIndex = tempIndex.sort(function (a, b) {
                                    return a - b;
                                });
                                lineObj.CatIndex = updatedIndex.length > 0 ? updatedIndex.join(", ") : "";
                                wines.push(lineObj);
                                lineObj = {}
                                lineObj.__type = "Wine:#CatalogWebService";
                                var lotNumberValue = stockId ? mappingLotNumber[stockId] : "";
                                var mixedLotNumber = lotNumberValue ? mappingMixedLot[lotNumberValue] : "";
                                lineObj.CatIndex = mixedLotNumber ? '(' + lotNumberValue + ')' : lotNumberValue;
                                lineObj.Description = lines[j].description;
                                lineObj.Size = sizeName;
                                previosItemId = currentItemId;
                                previosSizeId = sizeId
                                previosSizeName = sizeName;
                            } else if (j != 0) {
                                if (lineObj.CatIndex && lineObj.CatIndex.indexOf(mappingLotNumber[stockId]) == -1) {
                                    lineObj.CatIndex += stockId ? "," + mappingLotNumber[stockId] : "";
                                } else {
                                    if (!lineObj.CatIndex) {
                                        var lotNumberValue = stockId ? mappingLotNumber[stockId] : "";
                                        var mixedLotNumber = lotNumberValue ? mappingMixedLot[lotNumberValue] : "";
                                        lineObj.CatIndex += mixedLotNumber ? '(' + lotNumberValue + ')' : lotNumberValue;

                                    }
                                }
                            }
                        }



                        if (lines.length == j + 1) {
                            var tempIndex = lineObj.CatIndex ? lineObj.CatIndex.split(',') : [];
                            var updatedIndex = tempIndex.sort(function (a, b) {
                                return a - b;
                            });
                            lineObj.CatIndex = updatedIndex.length > 0 ? updatedIndex.join(", ") : "";
                            wines.push(lineObj);
                            var tempObj = {};
                            tempObj.__type = "Vintage:#CatalogWebService"
                            tempObj.Wines = wines;
                            tempObj.Year = vintageName;

                            bodyObj.Vintages.push(tempObj);
                        }
                    }

                    if (i == 0) {
                        gruopObj = {
                            "__type": "IndexByProdItem:#CatalogWebService.Models",
                            "Producers": [bodyObj],
                            "Region": obj.regionName
                        }

                        previosRegionId = obj.regionId;
                    } else if (previosRegionId != obj.regionId) {
                        objData.d.push(gruopObj);
                        gruopObj = {};
                        gruopObj = {
                            "__type": "IndexByProdItem:#CatalogWebService.Models",
                            "Producers": [bodyObj],
                            "Region": obj.regionName
                        }
                        previosRegionId = obj.regionId;

                    } else {
                        gruopObj.Producers.push(bodyObj);
                    }

                    if (lpitemsData.length == i + 1) {
                        objData.d.push(gruopObj);

                    }
                }

                return objData;

            } catch (e) {
                log.error("ERROR IN: " + title, e.message);
            }

        }

        function groupItemsData(lpitemsData) {
            var title = "groupItemsData() :: ";
            try {
                var dataArr = [];
                var body = {};
                for (var i = 0; i < lpitemsData.length; i++) {
                    var obj = lpitemsData[i];
                    var auctionId = obj.auctionId;
                    var auctionName = obj.auctionName;
                    var auctionLpId = obj.auctionLpId;
                    var countryId = obj.countryId;
                    var countryName = obj.countryName;
                    var regionId = obj.regionId;
                    var regionName = obj.regionName;

                    if (i == 0) {
                        body.auctionId = auctionId;
                        body.auctionName = auctionName;
                        body.auctionLpId = auctionLpId;
                        body.countryId = countryId;
                        body.countryName = countryName;
                        body.regionId = regionId;
                        body.regionName = regionName;

                    } else if (body.countryId != countryId || body.regionId != regionId || body.auctionId != auctionId) {
                        dataArr.push(body);
                        var body = {};
                        body.auctionId = auctionId;
                        body.auctionName = auctionName;
                        body.auctionLpId = auctionLpId;
                        body.countryId = countryId;
                        body.countryName = countryName;
                        body.regionId = regionId;
                        body.regionName = regionName;
                    }

                    if (lpitemsData.length == i + 1) {
                        dataArr.push(body);
                    }

                }

                return dataArr;


            } catch (e) {
                log.error("ERROR IN: " + title, e.message);
            }
        }

        function createAllCatalogJson(lpitemsData) {
            var title = "createAllCatalogJson() :: ";
            try {
                var objData = {};
                objData.d = {};
                var bodyObj = {};
                var isIdExist = [];
                var auctionsInfo = [];
                for (var i = 0; i < lpitemsData.length; i++) {

                    if (i == 0) {
                        if (lpitemsData[i].auctionId) {
                            auctionsInfo.push({
                                "__type": "Auction:#CatalogWebService",
                                "Code": lpitemsData[i].auctionName,
                                "Id": lpitemsData[i].auctionId,
                                "Title": ""
                            });
                            isIdExist.push(lpitemsData[i].auctionId);

                        }
                    } else if (isIdExist.indexOf(lpitemsData[i].auctionId) == -1) {
                        if (lpitemsData[i].auctionId) {
                            auctionsInfo.push({
                                "__type": "Auction:#CatalogWebService",
                                "Code": lpitemsData[i].auctionName,
                                "Id": lpitemsData[i].auctionId,
                                "Title": ""
                            });
                            isIdExist.push(lpitemsData[i].auctionId);

                        }
                    }

                }
                bodyObj.__type = "SearchControls:#CatalogWebService.Models"
                bodyObj.Auctions = auctionsInfo;
                bodyObj.Locations = [];

                for (var i = 0; i < lpitemsData.length; i++) {
                    var obj = lpitemsData[i];
                    var tempObj = {};
                    tempObj.__type = "WineLocation:#CatalogWebService.Models";
                    tempObj.Country = obj.countryName;
                    tempObj.Region = obj.regionName;
                    bodyObj.Locations.push(tempObj);

                }
                objData.d = bodyObj;

                return objData;

            } catch (e) {
                log.error("ERROR IN: " + title, e.message);
            }

        }

        function sortList(dataArr) {
            dataArr.sort(fieldSorter(['auctionId', 'countryId', 'regionId']));


            function fieldSorter(fields) {
                return function (a, b) {
                    return fields
                        .map(function (o) {
                            var dir = 1;
                            if (o[0] === '-') {
                                dir = -1;
                                o = o.substring(1);
                            }
                            if (a[o] > b[o])
                                return dir;
                            if (a[o] < b[o])
                                return -(dir);
                            return 0;
                        })
                        .reduce(function firstNonZeroValue(p, n) {
                            return p ? p : n;
                        }, 0);
                };
            }

        }

        function isYearExist(str) { //Using regex validating the year if str is year return ture else false
            try {
                var regex = /^(181[2-9]|18[2-9]\d|19\d\d|2\d{3}|30[0-3]\d|304[0-8])$/
                return regex.test(str);

            } catch (e) {
                log.error("ERROR IN: " + title, e.message);
            }
        }

        function getAllSizeDescriptionInfo() {
            var sizeMappingData = {};
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
                        name: "custrecord_size_desc_singular",
                        join: "custrecord_size_description"
                    }),
                    search.createColumn({
                        name: "custrecord_size_desc_plural",
                        join: "custrecord_size_description"
                    })

                ]
            });
            var searchData = searchObj.run().getRange(0, 1000);
            if (searchData) {
                for (var i = 0; i < searchData.length; i++) {
                    var internalid = searchData[i].getValue({
                        name: 'internalid'
                    });
                    var singular = searchData[i].getValue({
                        name: "custrecord_size_desc_singular",
                        join: "custrecord_size_description"
                    });
                    var plural = searchData[i].getValue({
                        name: "custrecord_size_desc_plural",
                        join: "custrecord_size_description"
                    });

                    sizeMappingData[internalid + 'singular'] = singular;
                    sizeMappingData[internalid + 'plural'] = plural;
                }
            }

            return sizeMappingData;
        }



        return {
            execute: getAuctionLOtIds
        };

    });