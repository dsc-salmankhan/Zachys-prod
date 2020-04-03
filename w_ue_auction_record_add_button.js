/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
//Deployed on Auction Record (in Zachys NS Record)
define([],
    function () {

        function beforeLoad(context) {
            try {
                if (context.type == context.UserEventType.EDIT || context.type == context.UserEventType.VIEW) {
                    var form = context.form;
                    form.clientScriptFileId = 153338;
                    
                    form.addButton({
                        id: 'custpage_btn_autcion_pdf',
                        label: 'Generate Auction PDF',
                        functionName: 'callPdfReport(' + context.newRecord.id + ')'
                    });
                }
            } catch (e) {
                log.debug('Error Message', e);
            }
        }

        return {
            beforeLoad: beforeLoad
        }
    });