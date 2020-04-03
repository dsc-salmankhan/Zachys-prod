/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
 */
define(['N/url'],
    function (url) {
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
            var count = 1;
            var consignmentSearch = search.load({
                id: 'customsearch_consignment_discrepancy_rep'
            });
            var searchFilterExpression = consignmentSearch.filterExpression;
            if (searchFilterExpression.length > 0) {
                count++;
                searchFilterExpression.push('and');
            }
            searchFilterExpression.push(["internalid", "anyof", recId]);


            consignmentSearch.filterExpression = searchFilterExpression;
            consignmentSearch.save();

            window.open('/app/common/search/searchresults.nl?searchid=customsearch_consignment_discrepancy_rep');

            var consignmentSearch = search.load({
                id: 'customsearch_consignment_discrepancy_rep'
            });
            var searchFilterExpression = consignmentSearch.filterExpression;
            if (count > 1) {
                searchFilterExpression.pop();
            }
            searchFilterExpression.pop();
            consignmentSearch.filterExpression = searchFilterExpression;
            consignmentSearch.save();
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