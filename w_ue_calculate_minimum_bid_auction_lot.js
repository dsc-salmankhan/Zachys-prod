/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 *
 * @description This code simply populates the parent and section code when 
 * creating a project budget record.
 */
define(['N/log', 'N/search'], function (log, search) {
    function beforeSubmit(context) {
        var rec = context.newRecord;

        var auctionId = rec.getValue({
            fieldId: "custrecord_auction_lot_auction"
        });

        var reserveValue = rec.getValue({
            fieldId: "custrecord_auction_lot_reserve"
        });

        if (reserveValue && auctionId) {
            var auctionObj = search.lookupFields({
                type: 'customrecord_auction',
                id: auctionId,
                columns: 'custrecord_auction_min_bid'
            });
            var auctionIncrementBy = auctionObj.custrecord_auction_min_bid ? parseInt(auctionObj.custrecord_auction_min_bid) : null

            if (auctionIncrementBy) {
                log.debug('auctionIncrementBy:', JSON.stringify(auctionIncrementBy));
                log.debug('reserveValue:', reserveValue);

                for (var i = 0; i < auctionIncrementBy; i++) {
                    reserveValue = getRoundedValue(reserveValue);
                    log.debug('reserveValue ' + i + ' :', reserveValue);
                }

                log.debug("minimum bid values", reserveValue);

            }

            rec.setValue({
                fieldId: "custrecord_auction_lot_minimum_bid",
                value: reserveValue
            });

        }

    }

    function getRoundedValue(reserveValue) {
        var roundedValue;
        var searchObj = search.create({
            type: "customrecord_bid_increment",
            filters: [
                ["isinactive", "is", "F"],
                "AND",
                ["custrecord_bid", "lessthanorequalto", parseInt(reserveValue)],
                "AND",
                ["custrecord_bid_high", "greaterthanorequalto", parseInt(reserveValue)],
            ],
            columns: [

                search.createColumn({
                    name: "custrecord_bid_increment"
                })

            ]
        });

        var binSearchData = searchObj.run().getRange(0, 1000);

        if (binSearchData.length > 0) {
            var roundedIncrement = binSearchData[0].getValue({
                name: 'custrecord_bid_increment'
            });

            roundedValue = parseInt(reserveValue) - parseInt(roundedIncrement);
        } else {
            roundedValue = reserveValue;
        }

        return roundedValue;
    }
    return {
        beforeSubmit: beforeSubmit
    }
});