/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
 */
define(['N/url', 'N/search'],
    function (url, search) {
        function createLpAndInspection(recId) {
            var suiteletURL = url.resolveScript({
                scriptId: 'customscript_w_sl_crt_lp_and_inspection',
                deploymentId: 'customdeploy_w_sl_crt_lp_and_inspection',
            });
            var scriptUrl = suiteletURL + '&recid=' + recId;
            window.open(scriptUrl);
        }

        function createConsignmentReport(recId) {
            var suiteletURL = url.resolveScript({
                scriptId: 'customscript_w_sl_consignment_report',
                deploymentId: 'customdeploy_w_sl_consignment_report',
            });
            var scriptUrl = suiteletURL + '&recid=' + recId;
            window.open(scriptUrl);
        }

        function createStockIds(recId) {
            var suiteletURL = url.resolveScript({
                scriptId: 'customscript_w_sl_create_stockids',
                deploymentId: 'customdeploy_w_sl_create_stockids',
            });
            var scriptUrl = suiteletURL + '&recid=' + recId;
            window.open(scriptUrl);
        }

        function createAuctionLot(recId) {
            var suiteletURL = url.resolveScript({
                scriptId: 'customscript_w_sl_create_auction',
                deploymentId: 'customdeploy_w_sl_create_auction',
            });
            var scriptUrl = suiteletURL + '&recid=' + recId;
            window.open(scriptUrl);
        }

        function openDiscrepancyReport(recId) {
            var isNotFound = true;
            var consignmentSearch = search.load({
                id: 'customsearch_consignment_discrepancy_rep'
            });
            var newSearchFilterExpression = [];
            var searchFilterExpression = consignmentSearch.filterExpression;
            for (var i = 0; i < searchFilterExpression.length; i++) {
                if (searchFilterExpression[i][0] != 'internalid') {
                    newSearchFilterExpression.push(searchFilterExpression[i]);
                } else {
                    if (i != 0) {
                        newSearchFilterExpression.pop();
                    }
                }
            }
            newSearchFilterExpression.push('and');
            newSearchFilterExpression.push(["internalid", "anyof", recId]);

            consignmentSearch.filterExpression = newSearchFilterExpression;
            consignmentSearch.save();

            window.open('/app/common/search/searchresults.nl?searchid=customsearch_consignment_discrepancy_rep');

        }


        function pageInit() {}
        return ({

            pageInit: pageInit,
            createLpAndInspection: createLpAndInspection,
            createConsignmentReport: createConsignmentReport,
            createStockIds: createStockIds,
            createAuctionLot: createAuctionLot,
            openDiscrepancyReport: openDiscrepancyReport
        });
    });