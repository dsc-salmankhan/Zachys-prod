/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
 */
var VENDOR_CATEGORY = 5; //Consignor
var NUM_OF_BOTTLE_IN_CASE = 0;
define(['N/https', 'N/record', 'N/ui/message', 'N/runtime', 'N/url', 'N/search', 'N/currentRecord'],
    function (https, record, message, runtime, url, search, currentRecord) {
        function createConsignment(recId) {
            try {
                var environment = runtime.envType;
                log.debug('environment', environment);
                // return;
                log.debug('test njmb');
                console.log('recId', recId);
                var appraisalRec = record.load({
                    type: 'customrecord_appraisal',
                    id: recId,
                    isDynamic: true
                });
                var appConsignor = appraisalRec.getValue({
                    fieldId: 'custrecord_app_consignor'
                });
                var appIntendedSale = appraisalRec.getValue({
                    fieldId: 'custrecord_appraisal_intended_sale'
                });
                log.debug("appIntendedSale", appIntendedSale);

                var appConsignorLink = appraisalRec.getValue({
                    fieldId: 'custrecord_consignment_link'
                });
                var appLineCount = appraisalRec.getLineCount({
                    sublistId: 'recmachcustrecord_applines_appraisal'
                });
                log.debug(recId + ":" + appLineCount);

                var consignorRec = record.create({
                    type: 'customrecord_consignment'
                });
                consignorRec.setValue('custrecord_consignment_appraisal', recId);

                var date = new Date();
                consignorRec.setValue('custrecord_consignment_date', date);
                if (appIntendedSale) {
                    consignorRec.setValue('custrecord_consignment_intended_sale', appIntendedSale);
                }
                console.log('appConsignor', appConsignor);
                if (appConsignor) {
                    var vendorSearch = search.create({

                        type: search.Type.VENDOR,

                        columns: ['internalid'],

                        filters: [{

                            name: 'internalid',

                            operator: 'anyof',

                            values: appConsignor

                        }]

                    });
                    var searchData = vendorSearch.run().getRange(0, 1000);
                    var vendorId;
                    if (searchData.length > 0) {
                        vendorId = searchData[0].getValue({
                            name: 'internalid'
                        });
                        console.log("vendorId:", vendorId)

                    }

                    if (vendorId) {
                        consignorRec.setValue('custrecord_consignment_consignor', vendorId);
                    } else {
                        var recUrl = '/app/common/entity/company.nl?id=' + appConsignor + '&fromtype=custjob&totype=vendor'
                        var response = https.get({
                            url: recUrl
                        });
                        if (response.code == 200) {
                            var vendorCategory = 5; //Consignor
                            record.submitFields({
                                type: record.Type.VENDOR,
                                id: appConsignor,
                                values: {
                                    category: vendorCategory
                                },
                                options: {
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                }
                            });


                        }
                        consignorRec.setValue('custrecord_consignment_consignor', appConsignor);
                    }

                }

                conRecordId = consignorRec.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
                log.debug('conRecordId::', conRecordId);

                if (conRecordId) {

                    var conRecIdLink = url.resolveRecord({
                        recordType: 'customrecord_consignment',
                        recordId: conRecordId
                    });

                    if (conRecIdLink) {
                        var myMsg = message.create({
                            title: "Please Wait",
                            message: "Consignment record has been created Your Consignment lines will be created in few minutes. To view the record, please <a href='" + conRecIdLink + "'>click here</a>",
                            type: message.Type.CONFIRMATION
                        });

                        appraisalRec.setValue({
                            fieldId: 'custrecord_appraisal_consignment',
                            value: conRecordId
                        });

                        appraisalRec.save();
                        myMsg.show();                        

                    }
                }
            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);

            }
        }

        function pageInit() {

        }

        function createAppraisalReport(appRecId) {
            log.debug('appRecId :: ', appRecId);
            var slUrl = url.resolveScript({
                scriptId: 'customscript_w_sl_appraisal_report',
                deploymentId: 'customdeploy_w_sl_appraisal_report_dep'
            });
            slUrl = slUrl + '&apprecid=' + appRecId;
            window.open(slUrl);


        }

        function createAppraisalLines(appRecId) {
            var title = "createAppraisalLines";
            try {
                log.debug(title + 'appRecId :: ', appRecId);

            } catch (e) {
                log.error("ERROR IN:: " + title, e.message);
            }


        }


        return ({

            pageInit: pageInit,
            createConsignment: createConsignment,
            createAppraisalReport: createAppraisalReport
        });
    });