/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */

define(['N/search', 'N/record'],
    function (search, record) {

        function beforeSubmit(context) {
            var title = 'beforeSubmit() :: ';
            try {
                var recObj = context.newRecord;
                if (context.type == context.UserEventType.CREATE) {
                    log.debug(title, "Start..........");
                    var representingSubsidiary = recObj.getValue({
                        fieldId: 'representingsubsidiary'
                    });
                    log.debug(title + "representingSubsidiary:", representingSubsidiary);
                    if (!representingSubsidiary) {
                        var subsidiaryList = getDefaultSubsidiariesLis(recObj);

                        if (subsidiaryList.length > 0) {
                            log.debug(title + "subsidiaryList:", JSON.stringify(subsidiaryList));
                            addSubsidiaries(subsidiaryList, recObj);

                            log.debug(title + "alert:", "Subsidiaries updated successfully");
                        }

                    }
                    log.debug(title, "End..........");
                }

                return true;
            } catch (e) {
                log.error("ERROR IN:: " + title, e);

            }
        }

        function getDefaultSubsidiariesLis(recObj) {
            var title = 'getDefaultSubsidiariesLis';
            try {
                var subsidiaryList = [];
                var existingSubsidiaryArr = [];
                var flag = true;
                var j = 0;
                while (flag) {
                    var subId = recObj.getSublistValue({
                        sublistId: 'submachine',
                        fieldId: 'subsidiary',
                        line: j
                    });
                    if (subId) {
                        existingSubsidiaryArr.push(subId.toString());
                    } else {
                        flag = false;
                    }
                    j++;
                }

                var subsidiarySearch = search.create({
                    type: search.Type.SUBSIDIARY,
                    filters: [
                        search.createFilter({
                            name: 'isinactive',
                            operator: search.Operator.IS,
                            values: 'F'
                        })
                    ],
                    columns: [
                        search.createColumn({
                            name: 'internalid'
                        }),
                        search.createColumn({
                            name: 'custrecord_default_on_customer'
                        }),
                        search.createColumn({
                            name: 'parent',
                            sort: search.Sort.ASC
                        })
                    ]
                });

                var searchResults = subsidiarySearch.run().getRange({
                    start: 0,
                    end: 1000
                });
                if (searchResults) {
                    for (var i = 0; i < searchResults.length; i++) {
                        var internalId = searchResults[i].getValue({
                            name: 'internalid'
                        });
                        var defaultOnCustomer = searchResults[i].getValue({
                            name: 'custrecord_default_on_customer'
                        });

                        if (existingSubsidiaryArr.indexOf(internalId.toString()) != -1 || defaultOnCustomer == true) {
                            subsidiaryList.push(internalId);

                        }
                    }
                }

                return subsidiaryList;

            } catch (e) {
                log.error(title + "Error ::", e);
            }
        }

        function addSubsidiaries(subsidiaryList, recObj) {
            var title = "addSubsidiaries() :: ";
            try {
                for (var i = 0; i < subsidiaryList.length; i++) {

                    log.debug(title + " subsidiary " + i + " :", subsidiaryList[i]);
                    recObj.setSublistValue({
                        sublistId: 'submachine',
                        fieldId: 'subsidiary',
                        line: i,
                        value: subsidiaryList[i]
                    });

                }


            } catch (e) {
                log.error(title + "Error ::", e);
            }
        }

        return {
            beforeSubmit: beforeSubmit
        };
    });