/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
 */

define(['N/url'],
    function (url) {
        function pageInit() {

        }

        function createAppraisalLines(appRecId) {
            var title = "createAppraisalLines";
            try {
                log.debug(title + 'appRecId :: ', appRecId);
                var suiteletURL = url.resolveScript({
                    scriptId: 'customscript_w_sl_create_appraisal',
                    deploymentId: 'customdeploy_w_sl_create_appraisal',
                });
                var scriptUrl = suiteletURL + '&recid=' + appRecId;
                window.open(scriptUrl);

            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);
            }


        }
        return ({
            pageInit: pageInit,
            createAppraisalLines: createAppraisalLines
        });
    });