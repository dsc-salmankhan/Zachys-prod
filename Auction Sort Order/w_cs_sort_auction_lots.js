/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
 */

var OTHER_SORTING_ORDER = 50;
define(['N/currentRecord', 'N/record', 'N/url', 'N/https', 'N/search'],
    function (currentRecord, record, url, https, search) {
        function sortAuctionLots(dataObj) {
            try {
                if (dataObj) {
                    var sortDataArr = dataObj.sortDataArr
                    var auctionLotsRecordArr = dataObj.auctionLotsRecordArr;

                    if (sortDataArr.length > 0 && auctionLotsRecordArr.length > 0) {
                        // sortDataDescendingOrder(auctionLotsRecordArr);

                        if (dataObj.auctionType == 2) { //Internet
                            sortOrderTypeInternet(auctionLotsRecordArr, sortDataArr, dataObj.recordId);
                        } else {
                            var sortingOrderArr = getSortingOrderData(dataObj.recordId);
                            if (sortingOrderArr.length > 0) {
                                sortOrderTypeLiveStandardPreLot(auctionLotsRecordArr, sortDataArr, sortingOrderArr, dataObj.recordId);

                            } else {
                                sortOrderTypeInternet(auctionLotsRecordArr, sortDataArr, dataObj.recordId);
                            }
                        }

                        location.reload();
                    }


                }

            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);

            }
        }

        function createSortingOrder(recordId) {
            var suiteUrl = url.resolveScript({
                scriptId: 'customscript_w_sl_create_sorting_order',
                deploymentId: 'customdeploy_w_sl_create_sorting_order',
                returnExternalUrl: false,
                params: {
                    'recid': recordId
                }
            });

            var response = https.get({
                url: suiteUrl
            });

            if (response.body) {
                var dataBody = JSON.parse(response.body);
                if (dataBody.type == 'success') {
                    location.reload();
                } else {
                    alert("Error message: ", dataBody.detail)
                }
            }
        }

        function sortOrderTypeInternet(auctionLotsRecordArr, sortDataArr, aucInternalId) {

            var mappedAuctionLotsRecordArr = getMappedData(auctionLotsRecordArr, sortDataArr);
            sortDataAscendingOrder(mappedAuctionLotsRecordArr, 'general');

            var currentRec = record.load({
                type: 'customrecord_auction',
                id: aucInternalId,
                isDynamic: true
            });
            var auctionLotLinesCount = currentRec.getLineCount({
                sublistId: 'recmachcustrecord_auction_lot_auction'
            });
            var lotNumber = 1;
            for (var i = 0; i < mappedAuctionLotsRecordArr.length; i++) {
                for (var m = 0; m < auctionLotLinesCount; m++) {
                    currentRec.selectLine({
                        sublistId: 'recmachcustrecord_auction_lot_auction',
                        line: m
                    });
                    var auctionLineId = currentRec.getCurrentSublistValue({
                        sublistId: 'recmachcustrecord_auction_lot_auction',
                        fieldId: "id"
                    });

                    if (mappedAuctionLotsRecordArr[i].internalid == auctionLineId) {

                        currentRec.setCurrentSublistValue({
                            sublistId: 'recmachcustrecord_auction_lot_auction',
                            fieldId: 'custrecord_auction_lot_sort_order',
                            value: mappedAuctionLotsRecordArr[i].lotSortOrder
                        });
                        currentRec.setCurrentSublistValue({
                            sublistId: 'recmachcustrecord_auction_lot_auction',
                            fieldId: 'custrecord_auction_lot_lotnumber',
                            value: lotNumber
                        });
                        currentRec.commitLine({
                            sublistId: 'recmachcustrecord_auction_lot_auction'
                        });

                        lotNumber++;

                        break;
                    }
                }


            }
            var recId = currentRec.save({
    						enableSourcing: false,
    						ignoreMandatoryFields: true
						});

            return true;
        }

        function sortOrderTypeLiveStandardPreLot(auctionLotsRecordArr, sortDataArr, sortingOrderArr, aucInternalId) {

            var mappedAuctionLotsRecordArr = getMappedData(auctionLotsRecordArr, sortDataArr);
            sortDataAscendingOrder(mappedAuctionLotsRecordArr, 'general');

            var groupOfAuctionLotsConsignmentArr = getGroupOfAuctionLots(mappedAuctionLotsRecordArr, 'consignmentid');
            var lotNumber = 1;
            var currentRec = record.load({
                type: 'customrecord_auction',
                id: aucInternalId,
                isDynamic: true
            });
            var auctionLotLinesCount = currentRec.getLineCount({
                sublistId: 'recmachcustrecord_auction_lot_auction'
            });
            for (var i = 0; i < sortingOrderArr.length; i++) {
                for (var j = 0; j < groupOfAuctionLotsConsignmentArr.length; j++) {
                    var isEqualConsignmentId;
                    if (groupOfAuctionLotsConsignmentArr[j].length > 0) {
                        isEqualConsignmentId = groupOfAuctionLotsConsignmentArr[j][0].consignmentid;
                    } else {
                        isEqualConsignmentId = groupOfAuctionLotsConsignmentArr[j].consignmentid;

                    }
                    if (sortingOrderArr[i].sortOrderType == 'Standard') {

                        if (sortingOrderArr[i].consignmentId == isEqualConsignmentId) {
                            var groupOfAuctionLotsArr = '';
                            if (groupOfAuctionLotsConsignmentArr[j].length > 0) {
                                groupOfAuctionLotsArr = getGroupOfAuctionLots(groupOfAuctionLotsConsignmentArr[j], 'lotSortOrder');
                            } else {
                                groupOfAuctionLotsArr = groupOfAuctionLotsConsignmentArr[j];
                            }

                            if (groupOfAuctionLotsArr) {
                                for (var k = 0; k < groupOfAuctionLotsArr.length; k++) {
                                    if (groupOfAuctionLotsArr[k].length) {
                                        for (var l = 0; l < groupOfAuctionLotsArr[k].length; l++) {
                                            for (var m = 0; m < auctionLotLinesCount; m++) {
                                                currentRec.selectLine({
                                                    sublistId: 'recmachcustrecord_auction_lot_auction',
                                                    line: m
                                                });
                                                var auctionLineId = currentRec.getCurrentSublistValue({
                                                    sublistId: 'recmachcustrecord_auction_lot_auction',
                                                    fieldId: "id"
                                                });

                                                if (groupOfAuctionLotsArr[k][l].internalid == auctionLineId) {

                                                    currentRec.setCurrentSublistValue({
                                                        sublistId: 'recmachcustrecord_auction_lot_auction',
                                                        fieldId: 'custrecord_auction_lot_sort_order',
                                                        value: groupOfAuctionLotsArr[k][l].lotSortOrder
                                                    });
                                                    currentRec.setCurrentSublistValue({
                                                        sublistId: 'recmachcustrecord_auction_lot_auction',
                                                        fieldId: 'custrecord_auction_lot_lotnumber',
                                                        value: lotNumber
                                                    });
                                                    currentRec.commitLine({
                                                        sublistId: 'recmachcustrecord_auction_lot_auction'
                                                    });

                                                    break;
                                                }
                                            }
                                            // record.submitFields({
                                            //     type: 'customrecord_auction_lot',
                                            //     id: groupOfAuctionLotsArr[k][l].internalid,
                                            //     values: {
                                            //         custrecord_auction_lot_sort_order: groupOfAuctionLotsArr[k][l].lotSortOrder,
                                            //         custrecord_auction_lot_lotnumber: lotNumber
                                            //     },
                                            //     options: {
                                            //         enableSourcing: false,
                                            //         ignoreMandatoryFields: true
                                            //     }
                                            // });

                                            lotNumber++;
                                        }
                                    } else {
                                        for (var m = 0; m < auctionLotLinesCount; m++) {
                                            currentRec.selectLine({
                                                sublistId: 'recmachcustrecord_auction_lot_auction',
                                                line: m
                                            });
                                            var auctionLineId = currentRec.getCurrentSublistValue({
                                                sublistId: 'recmachcustrecord_auction_lot_auction',
                                                fieldId: "id"
                                            });

                                            if (groupOfAuctionLotsArr[k].internalid == auctionLineId) {

                                                currentRec.setCurrentSublistValue({
                                                    sublistId: 'recmachcustrecord_auction_lot_auction',
                                                    fieldId: 'custrecord_auction_lot_sort_order',
                                                    value: groupOfAuctionLotsArr[k].lotSortOrder
                                                });
                                                currentRec.setCurrentSublistValue({
                                                    sublistId: 'recmachcustrecord_auction_lot_auction',
                                                    fieldId: 'custrecord_auction_lot_lotnumber',
                                                    value: lotNumber
                                                });
                                                currentRec.commitLine({
                                                    sublistId: 'recmachcustrecord_auction_lot_auction'
                                                });

                                                break;
                                            }
                                        }
                                        // record.submitFields({
                                        //     type: 'customrecord_auction_lot',
                                        //     id: groupOfAuctionLotsArr[k].internalid,
                                        //     values: {
                                        //         custrecord_auction_lot_sort_order: groupOfAuctionLotsArr[k].lotSortOrder
                                        //     },
                                        //     options: {
                                        //         enableSourcing: false,
                                        //         ignoreMandatoryFields: true
                                        //     }
                                        // });

                                        lotNumber++;
                                    }
                                }
                            }
                        }
                    } else if (sortingOrderArr[i].sortOrderType == 'Pre-Lot') {
                        if (sortingOrderArr[i].consignmentId == isEqualConsignmentId) {
                            var groupOfAuctionLotsArr = '';
                            if (groupOfAuctionLotsConsignmentArr[j].length > 0) {
                                groupOfAuctionLotsArr = groupOfAuctionLotsConsignmentArr[j];
                                sortDataAscendingOrder(groupOfAuctionLotsArr, 'pre-lot');

                            } else {
                                groupOfAuctionLotsArr = groupOfAuctionLotsConsignmentArr[j];
                            }

                            if (groupOfAuctionLotsArr.length > 0) {
                                for (var k = 0; k < groupOfAuctionLotsArr.length; k++) {
                                    for (var m = 0; m < auctionLotLinesCount; m++) {
                                        currentRec.selectLine({
                                            sublistId: 'recmachcustrecord_auction_lot_auction',
                                            line: m
                                        });
                                        var auctionLineId = currentRec.getCurrentSublistValue({
                                            sublistId: 'recmachcustrecord_auction_lot_auction',
                                            fieldId: "id"
                                        });

                                        if (groupOfAuctionLotsArr[k].internalid == auctionLineId) {
                                            currentRec.setCurrentSublistValue({
                                                sublistId: 'recmachcustrecord_auction_lot_auction',
                                                fieldId: 'custrecord_auction_lot_lotnumber',
                                                value: lotNumber
                                            });
                                            currentRec.commitLine({
                                                sublistId: 'recmachcustrecord_auction_lot_auction'
                                            });

                                            break;
                                        }
                                    }
                                    // record.submitFields({
                                    //     type: 'customrecord_auction_lot',
                                    //     id: groupOfAuctionLotsArr[k].internalid,
                                    //     values: {
                                    //         custrecord_auction_lot_lotnumber: lotNumber
                                    //     },
                                    //     options: {
                                    //         enableSourcing: false,
                                    //         ignoreMandatoryFields: true
                                    //     }
                                    // });

                                    lotNumber++;
                                }
                            } else {
                                record.submitFields({
                                    type: 'customrecord_auction_lot',
                                    id: groupOfAuctionLotsArr.internalid,
                                    values: {
                                        custrecord_auction_lot_lotnumber: lotNumber
                                    },
                                    options: {
                                        enableSourcing: false,
                                        ignoreMandatoryFields: true
                                    }
                                });
                            }
                        }
                    }

                }
            }
            var recId = currentRec.save({
    						enableSourcing: false,
    						ignoreMandatoryFields: true
						});

            return true;
        }


        function getMappedData(auctionLotsRecordArr, sortDataArr) {
            for (var i = 0; i < auctionLotsRecordArr.length; i++) {
                var isExist = false;
                for (var j = 0; j < sortDataArr.length; j++) {

                    if ((!sortDataArr[j].class.trim() || sortDataArr[j].class.trim().indexOf(auctionLotsRecordArr[i].class.trim())) != -1 &&
                        (!sortDataArr[j].country.trim() || sortDataArr[j].country.indexOf(auctionLotsRecordArr[i].country.trim())) != -1 &&
                        (!sortDataArr[j].region.trim() || sortDataArr[j].region.indexOf(auctionLotsRecordArr[i].region.trim())) != -1 &&
                        (!sortDataArr[j].varietal.trim() || sortDataArr[j].varietal.indexOf(auctionLotsRecordArr[i].varietal.trim())) != -1 &&
                        (!sortDataArr[j].producer.trim() || sortDataArr[j].producer.indexOf(auctionLotsRecordArr[i].producer.trim())) != -1 &&
                        (!sortDataArr[j].appellation.trim() || sortDataArr[j].appellation.indexOf(auctionLotsRecordArr[i].appellation.trim())) != -1) {

                        auctionLotsRecordArr[i].lotSortOrder = sortDataArr[j].internalid.trim();
                        auctionLotsRecordArr[i].ordernumber = parseInt(sortDataArr[j].ordernumber);
                        auctionLotsRecordArr[i].vintage = parseInt(auctionLotsRecordArr[i].vintage);
                        isExist = true;

                        break;
                    }
                }

                if (!isExist) {

                    auctionLotsRecordArr[i].lotSortOrder = OTHER_SORTING_ORDER;
                }
            }

            return auctionLotsRecordArr;
        }

        function getGroupOfAuctionLots(auctionLotsRecordArr, sortType) {
            var temp = {};

            if (sortType == 'lotSortOrder') {
                auctionLotsRecordArr.forEach(function (ob) {
                    temp[ob.ordernumber] = temp[ob.ordernumber] === undefined ? ob : Array.isArray(temp[ob.ordernumber]) ? temp[ob.ordernumber].concat([ob]) : [temp[ob.ordernumber]].concat([ob]);
                })

            } else if (sortType == 'consignmentid') {
                auctionLotsRecordArr.forEach(function (ob) {
                    temp[ob.consignmentid] = temp[ob.consignmentid] === undefined ? ob : Array.isArray(temp[ob.consignmentid]) ? temp[ob.consignmentid].concat([ob]) : [temp[ob.consignmentid]].concat([ob]);
                })

            }
            var result = Object.values(temp);

            return result;
        }

        function pageInit() {

        }


        function sortDataAscendingOrder(auctionRecArr, type) {
            if (type == 'pre-lot') {
                auctionRecArr.sort(fieldSorter(['prelot']));
            } else {
                auctionRecArr.sort(fieldSorter(['ordernumber', 'region', 'title', 'vintage']));

            }

            function fieldSorter(fields) {
                return function (a, b) {
                    return fields.map(function (o) {
                        var dir = 1;
                        if (o[0] === '-') {
                            dir = -1;
                            o = o.substring(1);
                        }
                        if (a[o] > b[o]) return dir;
                        if (a[o] < b[o]) return -(dir);
                        return 0;
                    }).reduce(function firstNonZeroValue(p, n) {
                        return p ? p : n;
                    }, 0);
                };
            }
        }

        function sortDataDescendingOrder(auctionRecArr) {
            auctionRecArr.sort(fieldSorter(['vintage']));

            function fieldSorter(fields) {
                return function (a, b) {
                    return fields.map(function (o) {
                        var dir = 1;
                        if (o[0] === '-') {
                            dir = -1;
                            o = o.substring(1);
                        }
                        if (a[o] < b[o]) return dir;
                        if (a[o] > b[o]) return -(dir);
                        return 0;
                    }).reduce(function firstNonZeroValue(p, n) {
                        return p ? p : n;
                    }, 0);
                };
            }
        }

        function getSortingOrderData(recordId) {
            var sortingOrderDataArr = [];
            var sortRecSearchObj = search.create({
                type: "customrecord_sorting_order",
                filters: [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custrecord_sorting_order_auction", "anyof", recordId]
                ],
                columns: [
                    search.createColumn({
                        name: "custrecord_sorting_order_sequence",
                        sort: search.Sort.ASC
                    }),
                    search.createColumn({
                        name: "custrecord_sorting_order_consignment"
                    }),
                    search.createColumn({
                        name: "custrecord_sorting_order_type"
                    })
                ]
            });
            var sortingOrderData = sortRecSearchObj.run().getRange(0, 1000);

            if (sortingOrderData) {
                for (var i = 0; i < sortingOrderData.length; i++) {
                    var obj = {};
                    var sortOrderSequence = sortingOrderData[i].getValue({
                        name: "custrecord_sorting_order_sequence",
                        sort: search.Sort.ASC
                    });
                    var consignmentId = sortingOrderData[i].getValue({
                        name: 'custrecord_sorting_order_consignment'
                    });
                    var sortOrderType = sortingOrderData[i].getText({
                        name: 'custrecord_sorting_order_type'
                    });

                    obj.sortOrderSequence = sortOrderSequence ? sortOrderSequence : '';
                    obj.sortOrderType = sortOrderType ? sortOrderType : '';
                    obj.consignmentId = consignmentId ? consignmentId : '';

                    sortingOrderDataArr.push(obj);

                }

            }

            return sortingOrderDataArr;
        }

        function createVendorBill(recordId) {
            var suiteUrl = url.resolveScript({
                scriptId: 'customscript_w_sl_create_vendor_bill',
                deploymentId: 'customdeploy_w_sl_create_vendor_bill',
                returnExternalUrl: false,
                params: {
                    'recid': recordId
                }
            });

            var response = https.get({
                url: suiteUrl
            });

            if (response.body) {
                var dataBody = JSON.parse(response.body);
                if (dataBody.type == 'success') {
                    location.reload();
                } else {
                    alert("Error message: ", dataBody.detail)
                }
            }
        }

        return ({

            pageInit: pageInit,
            sortAuctionLots: sortAuctionLots,
            createSortingOrder: createSortingOrder,
            createVendorBill: createVendorBill
        });
    });