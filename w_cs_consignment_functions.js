/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript 
 */
define([],
    function () {

        function pageInit(context) {
            $("#recmachcustrecord_cl_consignment_splits tr > *:nth-child(5)").hide();
        }
        function fieldChanged(context) {
            var title = 'fieldChanged';
            try {
                var currentRecord = context.currentRecord;
                var sublistName = context.sublistId;
                log.debug("currentRecord :: sublistName",currentRecord +' ' +sublistName);

            } catch (e) {
                log.error(title + "Error ::", e.message);
            }

        }

        return {

            pageInit: pageInit,
            fieldChanged: fieldChanged
        };
    });