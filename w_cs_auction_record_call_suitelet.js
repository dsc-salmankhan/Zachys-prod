/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/url', 'N/currentRecord'],
    function (url, currentRecord) {
        function pageInit(context) {

        }

        function callPdfReport(recId) {
            try {

                log.debug('recId', recId);
                var auctionId = recId;

                var suiteletUrl = url.resolveScript({
                    scriptId: 'customscript_bk_sl_auction_pdf',
                    deploymentId: 'customdeploy_bk_sl_auction_pdf',
                    returnExternalUrl: false
                });
                console.log('suiteletUrl', suiteletUrl);
                window.open(suiteletUrl + '&auctionid=' + auctionId);

            } catch (e) {
                console.log('Error Message', e);
            }


        }
        return {
            pageInit: pageInit,
            callPdfReport: callPdfReport
        }
    });