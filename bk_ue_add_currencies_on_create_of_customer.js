/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */

var DEFAULT_CURRENCY_LIST = ['1', '2', '4', '5'];

define([],
    function () {

        function beforeSubmit(context) {
            var title = 'beforeSubmit() :: ';
            try {
                var recObj = context.newRecord;
                if (context.type == context.UserEventType.CREATE) {
                    log.debug(title, "Start..........");
                    var existingCurrencyList = getExistingCurrencyList(recObj);
                    
                    for (var i = 0; i < DEFAULT_CURRENCY_LIST.length; i++) {
                        if (existingCurrencyList.indexOf(DEFAULT_CURRENCY_LIST[i]) == -1) {
                            recObj.setSublistValue({
                                sublistId: 'currency',
                                fieldId: 'currency',
                                line: i,
                                value: DEFAULT_CURRENCY_LIST[i]
                            });
                        }


                    }
                    log.debug(title, "End..........");
                }

                return true;
            } catch (e) {
                log.error("ERROR IN:: " + title, e);

            }
        }

        function getExistingCurrencyList(recObj) {
            var title = 'getExistingCurrencyList';
            try {
                var existingCurrencyArr = [];
                var flag = true;
                var j = 0;
                while (flag) {
                    var currId = recObj.getSublistValue({
                        sublistId: 'currency',
                        fieldId: 'currency',
                        line: j
                    });
                    if (currId) {
                        existingCurrencyArr.push(currId.toString());
                    } else {
                        flag = false;
                    }
                    j++;
                }

                log.debug('existingCurrencyArr:: ', JSON.stringify(existingCurrencyArr));

                return existingCurrencyArr.join();

            } catch (e) {
                log.error(title + "Error ::", e);
            }
        }


        return {
            beforeSubmit: beforeSubmit
        };
    });