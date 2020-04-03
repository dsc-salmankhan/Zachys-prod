/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 *
 */
var LEADING_ZEROS = 5;
define(['N/search', 'N/record'], function (search, record) {
    function afterSubmit(context) {

        try {

            var recObj = record.load({
                type: 'customrecord_auc_lp',
                id: context.newRecord.id,
                isDynamic: true
            });

            if (recObj) {
                var lpName = recObj.getValue({
                    fieldId: "name"
                });
                var consignmentId = recObj.getValue({
                    fieldId: "custrecord_auc_lp_consignment"
                });
                var consignmentText = recObj.getText({
                    fieldId: "custrecord_auc_lp_consignment"
                });

                if (consignmentId) {
                    var lpNumber;
                    consignmentText = consignmentText.replace('CON', '');

                    if (lpName.indexOf(consignmentText) != -1) {
                        return true;
                    }

                    var searchObj = search.create({
                        type: "customrecord_auc_lp",
                        filters: [
                            ["isinactive", "is", "F"],
                            "AND",
                            ["custrecord_auc_lp_consignment", "anyof", consignmentId],
                        ],
                        columns: [
                            search.createColumn({
                                name: "internalid",
                                summary: 'count'
                            })

                        ]
                    });

                    var searchData = searchObj.run().getRange(0, 1000);
                    if (searchData.length > 0) {
                        var internalidCount = searchData[0].getValue({
                            name: "internalid",
                            summary: 'count'
                        });


                        var lpIdsCount = parseInt(internalidCount);
                        lpNumber = consignmentText + '' + (lpIdsCount).pad(LEADING_ZEROS);

                    } else {
                        lpNumber = consignmentText + '00001';
                    }

                    log.debug('lpNumber :: context.newRecord.id :: numberLength', lpNumber + ' : ' + context.newRecord.id);
                    record.submitFields({
                        type: 'customrecord_auc_lp',
                        id: context.newRecord.id,
                        values: {
                            name: lpNumber
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                }
            }
        } catch (e) {
            log.error('Error Message:', e.message)
        }

    }

    Number.prototype.pad = function (size) {
        var s = String(this);
        while (s.length < (size || 2)) {
            s = "0" + s;
        }
        return s;
    }

    return {
        afterSubmit: afterSubmit
    }
});