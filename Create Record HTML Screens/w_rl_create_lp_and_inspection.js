/**
 * @NApiVersion 2.x
 * @NScriptType restlet
 */
define(['N/record', 'N/search'], function (record, search) {

    function post(context) {
        try {
            log.debug("context", context.data);
            if (context.data) {
                var creationData = context.data;
                for (var i = 0; i < 1; i++) {
                    var data = creationData[i];
                    log.debug("creationData:", JSON.stringify(data));

                    if (data.tags) {

                        for (var j = 0; j < 1; j++) {

                            var consignmentRec = record.create({
                                type: "customrecord_auc_lp",
                                isDynamic: true,
                            });
                            consignmentRec.setValue({
                                fieldId: "custrecord_auc_lp_consignment",
                                value: data.consignmentid,
                                ignoreFieldChange: true
                            });
                            if (data.consignor) {
                                consignmentRec.setValue({
                                    fieldId: "custrecord_auc_lp_consignor",
                                    value: data.consignor,
                                    ignoreFieldChange: true
                                });

                            }

                            if (data.photo) {
                                consignmentRec.setValue({
                                    fieldId: "custrecord_auc_lp_photo",
                                    value: data.photo,
                                    ignoreFieldChange: true
                                });
                            }

                            if (data.tags[j].type == "Assessment FFT") {
                                consignmentRec.setValue({
                                    fieldId: "custrecord_auc_lp_converted_notes",
                                    value: data.tags[j].text,
                                    ignoreFieldChange: true
                                });

                            }
                            if (data.tags[j].type == "Assessment Codes") {
                                consignmentRec.setValue({
                                    fieldId: "custrecord_auc_lp_notes",
                                    value: data.tags[j].text,
                                    ignoreFieldChange: true
                                });

                            }
                            if (data.tags[j].type == "Internal Notes") {
                                consignmentRec.setValue({
                                    fieldId: "custrecord_auc_lp_internal_notes",
                                    value: data.tags[j].text,
                                    ignoreFieldChange: true
                                });


                            }
                            var id = consignmentRec.save({
                                enableSourcing: true,
                                ignoreMandatoryFields: true
                            });

                            if (id) {
                                var consignmentlineRec = record.load({
                                    type: 'customrecord_cl',
                                    id: data.consignmentlineid,
                                    isDynamic: true
                                });

                                var licensePlateIds;
                                var licensePlate = consignmentlineRec.getValue({
                                    fieldId: 'custrecord_cl_lp'
                                });

                                log.debug('licensePlate.length', licensePlate.length);
                                log.debug('licensePlate[0]', licensePlate[0]);
                                if (licensePlate) {
                                    var tempArr = [id];
                                    licensePlateIds = licensePlate.concat(tempArr);

                                } else {
                                    licensePlateIds = id;

                                }
                                consignmentlineRec.setValue({
                                    fieldId: "custrecord_cl_lp",
                                    value: licensePlateIds,
                                    ignoreFieldChange: true
                                });
                                consignmentlineRec.setValue({
                                    fieldId: "custrecord_cl_qty_received",
                                    value: data.receivedquantity,
                                    ignoreFieldChange: true
                                });
                                consignmentlineRec.save({
                                    enableSourcing: true,
                                    ignoreMandatoryFields: true
                                });
                                log.debug('licensePlate', licensePlate)
                            }
                        }
                    }
                }

            }

            return true;
        } catch (e) {
            log.error("Error ::", e.message);
        }

    }

    return {
        post: post
    };
});