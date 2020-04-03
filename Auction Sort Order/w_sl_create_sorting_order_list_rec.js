/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */

define(['N/search', 'N/record'],
    function (search, record) {
        function onRequest(context) {
            var title = "onRequest";
            try {
                if (context.request.method === 'GET') {
                    log.debug("onRequest:", "onRequest() GET gethod start");
                    var request = context.request;
                    var parameters = request.parameters;
                    var auctionId = parameters.recid;

                    if (!auctionId) {
                        context.response.write("<p>Invalid Record Id.</p>");
                    }

                    var auctionLotsDataArr = getAuctionLotsData(context, auctionId);
                    if (auctionLotsDataArr.length > 0) {
                        var existingDataObj = getExistingSortOrderData(context, auctionLotsDataArr[0].auctionid);
                        log.debug('existingDataObj:', JSON.stringify(existingDataObj));
                        createSortingOrderList(context, auctionLotsDataArr, existingDataObj);
                    }
                    var oResponse = {};
                    oResponse.type = "success";
                    oResponse.detail = "Records has been created successfully";
                    context.response.write(JSON.stringify(oResponse));

                }
            } catch (e) {
                log.error("ERROR IN :: " + title, e.message);
                var oResponse = {};
                oResponse.type = "Error";
                oResponse.detail = e.message
                context.response.writeLine(JSON.stringify(oResponse));
            }

        }

        function getAuctionLotsData(context, auctionId) {
            try {
                var auctionLotsDataArr = new Array();

                var auctionRecSearchObj = search.create({
                    type: "customrecord_auction_lot",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_auction_lot_auction", "anyof", auctionId]
                    ],
                    columns: [

                        search.createColumn({
                            name: "custrecord_auction_lot_consignment",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "custrecord_auction_lot_consignor",
                            summary: "GROUP"
                        })

                    ]
                });


                var auctionData = auctionRecSearchObj.run().getRange(0, 1000);
                log.debug("auctionData:", JSON.stringify(auctionData))

                if (auctionData) {
                    for (var i = 0; i < auctionData.length; i++) {
                        var obj = {};

                        var consignment = auctionData[i].getValue({
                            name: 'custrecord_auction_lot_consignment',
                            summary: "GROUP"
                        });
                        var consignor = auctionData[i].getValue({
                            name: 'custrecord_auction_lot_consignor',
                            summary: "GROUP"
                        });

                        obj.auctionid = auctionId;
                        obj.consignment = consignment ? consignment : '';
                        obj.consignor = consignor ? consignor : '';
                        auctionLotsDataArr.push(obj);
                    }
                }
                log.debug("auctionLotsDataArr", JSON.stringify(auctionLotsDataArr))
                return auctionLotsDataArr;
            } catch (e) {
                log.error("ERROR IN :: getAuctionLotsData()", e.message);
                var oResponse = {};
                oResponse.type = "Error";
                oResponse.detail = e.message
                context.response.writeLine(JSON.stringify(oResponse));
            }
        }

        function getExistingSortOrderData(context, auctionId) {
            try {
                var existingConsignorArr = [];
                var existingConsignmentArr = [];

                var sortOrderSearchObj = search.create({
                    type: "customrecord_sorting_order",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_sorting_order_auction", "anyof", auctionId]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custrecord_sorting_order_consignment"
                        }),
                        search.createColumn({
                            name: "custrecord_sorting_order_consignor"
                        })
                    ]
                });

                var sortOrderData = sortOrderSearchObj.run().getRange(0, 1000);
                log.debug("sortOrderData:", JSON.stringify(sortOrderData))

                if (sortOrderData) {
                    for (var i = 0; i < sortOrderData.length; i++) {
                        var consignment = sortOrderData[i].getValue({
                            name: 'custrecord_sorting_order_consignment'
                        });
                        var consignor = sortOrderData[i].getValue({
                            name: 'custrecord_sorting_order_consignor'
                        });

                        existingConsignmentArr.push(consignment);
                        existingConsignorArr.push(consignor);
                    }
                }

                var obj = {};
                obj.existingConsignmentArr = existingConsignmentArr;
                obj.existingConsignorArr = existingConsignorArr;

                return obj;
            } catch (e) {
                log.error("ERROR IN :: getExistingSortOrderData() ", e.message);
                var oResponse = {};
                oResponse.type = "Error";
                oResponse.detail = e.message
                context.response.writeLine(JSON.stringify(oResponse));
            }
        }

        function createSortingOrderList(context, auctionLotsDataArr, existingDataObj) {
            try {

                for (var i = 0; i < auctionLotsDataArr.length; i++) {

                    if (existingDataObj.existingConsignorArr.indexOf(auctionLotsDataArr[i].consignor) == -1 && existingDataObj.existingConsignmentArr.indexOf(auctionLotsDataArr[i].consignment) == -1) {
                        var sortOrderRec = record.create({
                            type: "customrecord_sorting_order",
                            isDynamic: true,
                        });
                        sortOrderRec.setValue({
                            fieldId: "custrecord_sorting_order_auction",
                            value: auctionLotsDataArr[i].auctionid,
                            ignoreFieldChange: true
                        });
                        sortOrderRec.setValue({
                            fieldId: "custrecord_sorting_order_consignment",
                            value: auctionLotsDataArr[i].consignment,
                            ignoreFieldChange: true
                        });
                        sortOrderRec.setValue({
                            fieldId: "custrecord_sorting_order_consignor",
                            value: auctionLotsDataArr[i].consignor,
                            ignoreFieldChange: true
                        });

                        var sortOrderInternalId = sortOrderRec.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });

                        log.debug("sortOrderInternalId:", sortOrderInternalId);
                    }

                }

            } catch (e) {
                log.error("ERROR IN :: createSortingOrderList()", e.message);
                var oResponse = {};
                oResponse.type = "Error";
                oResponse.detail = e.message
                context.response.writeLine(JSON.stringify(oResponse));
            }

        }

        return {
            onRequest: onRequest
        };
    });