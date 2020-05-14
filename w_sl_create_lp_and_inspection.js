/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */

var CODE_VALUE = "XXXXXXX";
var LP_INSPECTION_HTML_CONTENT = '134337'
var OWC_PACK_TYPE = 1; //OWC
var OC_PACK_TYPE = 2; //OC
var CODES_JSON_FILE = 134351;

define(['N/record', 'N/file', 'N/search', 'N/url'],
    function (record, file, search, url) {
        function onRequest(context) {
            var title = "onRequest";
            try {
                if (context.request.method === 'GET') {
                    log.debug("onRequest:", "onRequest() GET gethod start");
                    var template = '';
                    var request = context.request;
                    var parameters = request.parameters;
                    var consignmentId = parameters.recid;

                    if (!consignmentId) {
                        context.response.write("<p>Invalid Record Id.");
                    }

                    var lpsQtyDataArr = getAllLpsQtyData(consignmentId);
                    log.debug("lpsQtyDataArr::", JSON.stringify(lpsQtyDataArr))
                    var consignmentLinesArr = getConsignmentLinesData(consignmentId, lpsQtyDataArr);
                    var suiteletUrl = getScriptUrl();
                    var codesData = getCodesData();
                    var fileContent = file.load({
                        id: LP_INSPECTION_HTML_CONTENT
                    }).getContents();
                    template = fileContent;
                    var tempContentData = JSON.stringify(consignmentLinesArr);
                    var contentData = tempContentData.replace(/'/g, "\\'").replace(/"/g, '\\"');
                    template = template.replace(/{{WINES_CATALOG}}/g, contentData);
                    template = template.replace(/{{CODES_DATA_OBJ}}/g, JSON.stringify(codesData));
                    template = template.replace(/{{SUITELET_URL}}/g, suiteletUrl);
                    context.response.write(template);

                } else {
                    log.debug("onRequest:", "onRequest() post method start");
                    var request = context.request;
                    var bodyData = request.body;
                    log.debug("bodyData:", JSON.stringify(bodyData));

                    var lpName = '';
                    var lpTypeName = '';
                    if (bodyData) {
                        var creationData = JSON.parse(bodyData);
                        if (creationData.length > 0) {
                            var lpRec = record.create({
                                type: "customrecord_auc_lp",
                                isDynamic: true,
                            });
                            lpRec.setValue({
                                fieldId: "custrecord_auc_lp_consignment",
                                value: creationData[0].consignmentid,
                                ignoreFieldChange: true
                            });
                            if (creationData[0].consignor) {
                                lpRec.setValue({
                                    fieldId: "custrecord_auc_lp_consignor",
                                    value: creationData[0].consignor,
                                    ignoreFieldChange: true
                                });

                            }

                            if (creationData[0].photo) {
                                lpRec.setValue({
                                    fieldId: "custrecord_auc_lp_photo",
                                    value: creationData[0].photo,
                                    ignoreFieldChange: true
                                });
                            }



                            var lpRecId = lpRec.save({
                                enableSourcing: true,
                                ignoreMandatoryFields: true
                            });

                            if (lpRecId) {
                                var isCageExist = false;
                                var minimumPhoto = 0;
                                for (var i = 0; i < creationData.length; i++) {
                                    var isValueExist = false;
                                    var data = creationData[i];
                                    log.debug("data :: ", JSON.stringify(data))

                                    var lpItemRec = record.create({
                                        type: "customrecord_lp_item",
                                        isDynamic: true,
                                    });
                                    lpItemRec.setValue({
                                        fieldId: "custrecord_lp_item_lp",
                                        value: lpRecId,
                                        ignoreFieldChange: true
                                    });
                                    lpItemRec.setValue({
                                        fieldId: "custrecord_lp_item_consignment_line",
                                        value: data.consignmentlineid,
                                        ignoreFieldChange: true
                                    });
                                    lpItemRec.setValue({
                                        fieldId: "custrecord_lp_item_item",
                                        value: data.itemid,
                                        ignoreFieldChange: true
                                    });
                                    lpItemRec.setValue({
                                        fieldId: "custrecord_lp_item_quantity",
                                        value: data.currentreceivedquantity,
                                        ignoreFieldChange: true
                                    });
                                    lpItemRec.setValue({
                                        fieldId: "custrecord_lp_item_description",
                                        value: data.description,
                                        ignoreFieldChange: true
                                    });

                                    if (data.cageValue == 'true') {
                                        isCageExist = true;
                                        lpItemRec.setValue({
                                            fieldId: "custrecord_lp_item_cage",
                                            value: true,
                                            ignoreFieldChange: true
                                        });
                                    }

                                    if (data.photo) {
                                        lpItemRec.setValue({
                                            fieldId: "custrecord_lp_item_photo",
                                            value: data.photo,
                                            ignoreFieldChange: true
                                        });

                                        if (minimumPhoto == 0) {
                                            minimumPhoto = data.photo ? data.photo : 0;
                                        } else {
                                            minimumPhoto = parseInt(minimumPhoto) > parseInt(data.photo) ? data.photo : minimumPhoto;
                                        }


                                    }

                                    lpItemRec.setValue({
                                        fieldId: "custrecord_lp_item_line_type",
                                        value: data.type,
                                        ignoreFieldChange: true
                                    });

                                    lpItemRec.setValue({
                                        fieldId: "custrecord_lp_item_pre_lot",
                                        value: data.prelot,
                                        ignoreFieldChange: true
                                    });
                                    lpItemRec.setValue({
                                        fieldId: "custrecord_lp_item_intended_sale",
                                        value: data.intendedsale,
                                        ignoreFieldChange: true
                                    });

                                    var lowPrice = data.bottlelowPrice.replace('$', '').replace(/,/g, '');
                                    lpItemRec.setValue({
                                        fieldId: "custrecord_lp_item_bottle_low",
                                        value: lowPrice,
                                        ignoreFieldChange: true
                                    });

                                    if (lowPrice && data.currentreceivedquantity) {
                                        var lowEstimateValue = parseFloat(lowPrice * data.currentreceivedquantity);
                                        lpItemRec.setValue({
                                            fieldId: "custrecord_lp_item_ext_low",
                                            value: lowEstimateValue,
                                            ignoreFieldChange: true
                                        });
                                    }

                                    var highPrice = data.bottlehighPrice.replace('$', '').replace(/,/g, '');
                                    lpItemRec.setValue({
                                        fieldId: "custrecord_lp_item_bottle_high",
                                        value: highPrice,
                                        ignoreFieldChange: true
                                    });

                                    if (highPrice && data.currentreceivedquantity) {
                                        var highEstimateValue = parseFloat(highPrice * data.currentreceivedquantity);
                                        lpItemRec.setValue({
                                            fieldId: "custrecord_lp_item_ext_high",
                                            value: highEstimateValue,
                                            ignoreFieldChange: true
                                        });

                                    }

                                    log.debug("data.notRecognized:", data.notRecognized)
                                    if (data.notRecognized) {
                                        lpItemRec.setValue({
                                            fieldId: "custrecord_lp_item_undetected_codes",
                                            value: data.notRecognized,
                                            ignoreFieldChange: true
                                        });
                                    }

                                    if (data.assessmentFFT) {
                                        if (data.assessmentFFT.indexOf(CODE_VALUE) != -1) {
                                            isValueExist = true;
                                        }
                                        lpItemRec.setValue({
                                            fieldId: "custrecord_lp_item_assessment_fft",
                                            value: data.assessmentFFT,
                                            ignoreFieldChange: true
                                        });

                                    }
                                    if (data.assessmentCodes) {
                                        if (data.assessmentCodes.indexOf(CODE_VALUE) != -1) {
                                            isValueExist = true;
                                        }
                                        lpItemRec.setValue({
                                            fieldId: "custrecord_lp_item_assessment_codes",
                                            value: data.assessmentCodes,
                                            ignoreFieldChange: true
                                        });

                                    }
                                    if (data.internalNotes) {
                                        lpItemRec.setValue({
                                            fieldId: "custrecord_lp_item_internal_notes",
                                            value: data.internalNotes,
                                            ignoreFieldChange: true
                                        });


                                    }

                                    if (data.packagTypeId) {
                                        lpItemRec.setValue({
                                            fieldId: "custrecord_lp_item_pack_type",
                                            value: data.packagTypeId,
                                            ignoreFieldChange: true
                                        });
                                    }
                                    var id = lpItemRec.save({
                                        enableSourcing: true,
                                        ignoreMandatoryFields: true
                                    });

                                    if (lpRecId) {
                                        var consignmentlineRec = record.load({
                                            type: 'customrecord_cl',
                                            id: data.consignmentlineid,
                                            isDynamic: true
                                        });

                                        var licensePlateIds;
                                        var licensePlate = consignmentlineRec.getValue({
                                            fieldId: 'custrecord_cl_lp'
                                        });

                                        if (licensePlate.length > 0) {
                                            var tempArr = [lpRecId];
                                            licensePlateIds = licensePlate.concat(tempArr);

                                        } else {
                                            licensePlateIds = [];
                                            licensePlateIds.push(lpRecId)

                                        }
                                        if (licensePlateIds) {
                                            consignmentlineRec.setValue({
                                                fieldId: "custrecord_cl_lp",
                                                value: licensePlateIds,
                                                ignoreFieldChange: true
                                            });

                                        }
                                        consignmentlineRec.setValue({
                                            fieldId: "custrecord_cl_qty_received",
                                            value: data.receivedquantity,
                                            ignoreFieldChange: true
                                        });
                                        consignmentlineRec.save({
                                            enableSourcing: true,
                                            ignoreMandatoryFields: true
                                        });
                                    }

                                }

                                var lpRec = record.load({
                                    type: 'customrecord_auc_lp',
                                    id: lpRecId,
                                    isDynamic: true
                                });

                                lpName = lpRec.getValue("name") || '';


                                var objType = getMaximumType(lpRecId);
                                lpTypeName = objType.typeName ? objType.typeName : "";
                                if (objType.typeId) {
                                    log.debug("objType.typeId:", objType.typeId)
                                    lpRec.setValue({
                                        fieldId: "custrecord_auc_lp_type",
                                        value: objType.typeId
                                    })
                                }

                                lpRec.save();
                            }

                        }
                    }

                    var oResponse = {};
                    oResponse.type = "Success";
                    oResponse.detail = "Successfully completed process"
                    oResponse.lpRecName = lpName;
                    oResponse.typeName = lpTypeName; //ZAC-68
                    oResponse.cageValue = isCageExist;
                    oResponse.photo = minimumPhoto;
                    context.response.writeLine(JSON.stringify(oResponse));

                }

            } catch (e) {
                log.error("ERROR IN :: " + title, e.message);
                var oResponse = {};
                oResponse.type = "Error";
                oResponse.detail = e.message
                context.response.writeLine(JSON.stringify(oResponse));
            }

        }

        function getConsignmentLinesData(consignmentId, lpsQtyDataArr) {
            var consignmentLinesArr = new Array();
            var consignor = search.lookupFields({
                type: 'customrecord_consignment',
                id: consignmentId,
                columns: ['custrecord_consignment_consignor', 'name']
            });
            var consignmentLineSearchObj = search.create({
                type: "customrecord_cl",
                filters: [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custrecord_cl_consignment", "anyof", consignmentId]
                ],
                columns: [

                    search.createColumn({
                        name: "internalid"
                    }),
                    search.createColumn({
                        name: "custrecord_cl_item"
                    }),
                    search.createColumn({
                        name: "custrecord_cl_item_description"
                    }),
                    search.createColumn({
                        name: "custrecord_cl_bottle_low"
                    }),
                    search.createColumn({
                        name: "custrecord_cl_bottle_high"
                    }),
                    search.createColumn({
                        name: "custrecord_cl_region"
                    }),
                    search.createColumn({
                        name: "custrecord_cl_country"
                    }),
                    search.createColumn({
                        name: "custrecord_cl_type"
                    }),
                    search.createColumn({
                        name: "custrecord_cl_cage"
                    }),
                    search.createColumn({
                        name: "custrecord_cl_photo"
                    }),
                    search.createColumn({
                        name: "custrecord_cl_qty_expected"
                    }),
                    search.createColumn({
                        name: "custrecord_cl_qty_received"
                    }),
                    search.createColumn({
                        name: "custrecord_cl_lp"
                    }),
                    search.createColumn({
                        name: 'custrecord_cl_prelot_number'
                    }),
                    search.createColumn({
                        name: 'custrecord_cl_intended_sale'
                    }),
                    search.createColumn({
                        name: 'custrecord_cl_extended_low'
                    }),
                    search.createColumn({
                        name: 'custrecord_cl_extended_high'
                    }),
                    search.createColumn({
                        name: 'cseg_appellation',
                        join: 'custrecord_cl_item'
                    })
                ]
            });


            var searchData = [];
            var count = 0;
            var pageSize = 1000;
            var start = 0;
            do {
                var searchObjArr = consignmentLineSearchObj.run().getRange(start, start + pageSize);

                searchData = searchData.concat(searchObjArr);
                count = searchObjArr.length;
                start += pageSize;
            } while (count == pageSize);

            if (searchData) {
                log.debug("searchData.length:", searchData.length);
                for (var i = 0; i < searchData.length; i++) {
                    var obj = {};
                    var qtyReceived = 0;
                    var internalid = searchData[i].getValue({
                        name: 'internalid'
                    });
                    var itemId = searchData[i].getValue({
                        name: 'custrecord_cl_item'
                    });
                    var description = searchData[i].getValue({
                        name: 'custrecord_cl_item_description'
                    });
                    var size = searchData[i].getValue({
                        name: 'custrecord_cl_size'
                    });
                    var bolottleLow = searchData[i].getValue({
                        name: 'custrecord_cl_bottle_low'
                    });
                    var bolottleHigh = searchData[i].getValue({
                        name: 'custrecord_cl_bottle_high'
                    });
                    var region = searchData[i].getValue({
                        name: 'custrecord_cl_region'
                    });
                    var country = searchData[i].getValue({
                        name: 'custrecord_cl_country'
                    });
                    var type = searchData[i].getValue({
                        name: 'custrecord_cl_type'
                    });
                    var typeName = searchData[i].getText({
                        name: 'custrecord_cl_type'
                    });
                    var cage = searchData[i].getValue({
                        name: 'custrecord_cl_cage'
                    });
                    var photo = searchData[i].getValue({
                        name: 'custrecord_cl_photo'
                    });
                    var expectedQuantity = searchData[i].getValue({
                        name: 'custrecord_cl_qty_expected'
                    });
                    var received = searchData[i].getValue({
                        name: 'custrecord_cl_qty_received'
                    });
                    var lpId = searchData[i].getValue({
                        name: 'custrecord_cl_lp'
                    });
                    var prelot = searchData[i].getValue({
                        name: 'custrecord_cl_prelot_number'
                    });
                    var intendedSale = searchData[i].getValue({
                        name: 'custrecord_cl_intended_sale'
                    });
                    var lowEstimate = searchData[i].getValue({
                        name: 'custrecord_cl_extended_low'
                    });
                    var highEstimate = searchData[i].getValue({
                        name: 'custrecord_cl_extended_high'
                    });
                    var apellationName = searchData[i].getText({
                        name: 'cseg_appellation',
                        join: 'custrecord_cl_item'
                    });


                    var lpItemQtySumArr = [];
                    if (lpId) {
                        if (i == 0) {
                            log.audit("lpsQtyDataArr:", JSON.stringify(lpsQtyDataArr));
                        }
                        log.audit("lpId:", JSON.stringify(lpId));

                        var splitLps = lpId.split(',');
                        for (var ii = 0; ii < splitLps.length; ii++) {
                            if (lpsQtyDataArr.length > 0) {
                                var lpItemQtySum, lpRecName;
                                var isFound = false;
                                for (var kk = 0; kk < lpsQtyDataArr.length; kk++) {
                                    if (lpsQtyDataArr[kk].lpId == splitLps[ii] && lpsQtyDataArr[kk].itemId == itemId) {
                                        if (lpsQtyDataArr[kk].qtySum) {
                                            qtyReceived += parseFloat(lpsQtyDataArr[kk].qtySum);
                                        }
                                        lpItemQtySum = lpsQtyDataArr[kk].qtySum;
                                        lpRecName = lpsQtyDataArr[kk].lpName;
                                        lpsQtyDataArr.splice(kk, 1);
                                        isFound = true;
                                        break;
                                    }
                                }

                                lpItemQtySum = lpItemQtySum ? lpItemQtySum : '';
                                lpRecName = lpRecName ? lpRecName : '';
                                if (isFound) {
                                    var tempInfo = lpRecName + '(' + lpItemQtySum + ')';
                                    lpItemQtySumArr.push(tempInfo);

                                }
                            }
                        }
                    }

                    var tempConsignor = consignor.custrecord_consignment_consignor[0] ? consignor.custrecord_consignment_consignor[0].text : '';
                    var splitConsignor = tempConsignor.split(' ');
                    var consignorName = '';
                    if (splitConsignor.length > 0) {
                        for (var jj = 1; jj < splitConsignor.length; jj++) {
                            consignorName += splitConsignor[jj] + ' ';
                        }
                    }
                    //obj.internalid = internalid ? internalid : '';
                    obj.SKU = "1627628"
                    obj.apellation = apellationName ? apellationName : ''
                    obj.cage = cage ? true : false;
                    obj.class = country ? country : '';
                    obj.highPrice = bolottleHigh ? bolottleHigh : '';
                    obj.lowPrice = bolottleLow ? bolottleLow : '';
                    obj.name = description ? description : '';
                    obj.photo = photo ? photo : '';
                    obj.qty = expectedQuantity ? expectedQuantity : '';
                    obj.rec_qty = qtyReceived != 0 ? qtyReceived : '';
                    obj.region = region ? region : '';
                    obj.size = size ? size : '';
                    obj.type = type ? type : '';
                    obj.typename = typeName ? typeName : ''
                    obj.vintage = ''
                    obj.internalid = internalid
                    obj.consignment_id = consignmentId;
                    obj.itemid = itemId ? itemId : ''
                    obj.consignor = consignor.custrecord_consignment_consignor[0] ? consignor.custrecord_consignment_consignor[0].value : ''
                    obj.consignorName = consignorName.replace(/\s+/g, ' ');
                    obj.consignmentName = consignor.name ? consignor.name : ''
                    obj.lpid = lpId ? lpId : ''
                    obj.lpItemqtysumdata = lpItemQtySumArr ? lpItemQtySumArr.join(', ') : [];
                    obj.prelot = prelot ? prelot : '';
                    obj.intendedsale = intendedSale ? intendedSale : '';
                    obj.lowestimate = lowEstimate ? lowEstimate : '';
                    obj.highestimate = highEstimate ? highEstimate : '';
                    consignmentLinesArr.push(obj);

                }
            }
            return consignmentLinesArr;
        }

        function getAllLpsQtyData(consignmentId) {
            var consignmentLinesArr = [];
            var lpsObjDataArr = [];
            var lpsObj = search.create({
                type: "customrecord_cl",
                filters: [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custrecord_cl_consignment", "anyof", consignmentId]
                ],
                columns: [

                    search.createColumn({
                        name: "internalid"
                    })
                ]
            });
            var searchData = [];
            var count = 0;
            var pageSize = 1000;
            var start = 0;
            do {
                var searchObjArr = lpsObj.run().getRange(start, start + pageSize);

                searchData = searchData.concat(searchObjArr);
                count = searchObjArr.length;
                start += pageSize;
            } while (count == pageSize);
            if (searchData) {
                for (var i = 0; i < searchData.length; i++) {
                    var internalid = searchData[i].getValue({
                        name: 'internalid'
                    });

                    consignmentLinesArr.push(internalid);

                }
            }

            if (consignmentLinesArr.length > 0) {
                var lpItemQty = search.create({
                    type: "customrecord_lp_item",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_lp_item_consignment_line", "anyof", consignmentLinesArr]
                    ],
                    columns: [

                        search.createColumn({
                            name: "custrecord_lp_item_quantity"

                        }),
                        search.createColumn({
                            name: "custrecord_lp_item_lp"

                        }),
                        search.createColumn({
                            name: "custrecord_lp_item_item"

                        })
                    ]
                });

                // var lpItemQtyData = lpItemQty.run().getRange(0, 1000);
                var lpItemQtyData = [];
                var count = 0;
                var pageSize = 1000;
                var start = 0;
                do {
                    var lpItemSearchObjArr = lpItemQty.run().getRange(start, start + pageSize);

                    lpItemQtyData = lpItemQtyData.concat(lpItemSearchObjArr);
                    count = lpItemSearchObjArr.length;
                    start += pageSize;
                } while (count == pageSize);

                if (lpItemQtyData) {
                    for (var j = 0; j < lpItemQtyData.length; j++) {
                        var obj = {};
                        var internalid = lpItemQtyData[j].id;
                        var qtySum = lpItemQtyData[j].getValue({
                            name: 'custrecord_lp_item_quantity'
                        });
                        var lpId = lpItemQtyData[j].getValue({
                            name: 'custrecord_lp_item_lp'
                        });
                        var lpName = lpItemQtyData[j].getText({
                            name: 'custrecord_lp_item_lp'
                        });
                        var itemId = lpItemQtyData[j].getValue({
                            name: 'custrecord_lp_item_item'
                        });

                        obj.lpId = lpId ? lpId : '';
                        obj.lpName = lpName ? lpName : '';
                        obj.qtySum = qtySum ? qtySum : '';
                        obj.internalid = internalid;
                        obj.itemId = itemId;

                        lpsObjDataArr.push(obj);
                    }
                }


            }

            return lpsObjDataArr;

        }

        function getCodesData() {
            try {
                var title = "getCodesData()";
                var dataObj = {};
                var codesDataObjArr = [];
                var codesTypeObjArray = [];
                var codesTypeArray = [];

                var codesSearch = search.create({
                    type: "customrecord_ac",
                    filters: [
                        ["isinactive", "is", "F"]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custrecord_ac_code"
                        }),
                        search.createColumn({
                            name: "internalid"
                        }),
                        search.createColumn({
                            name: "custrecord_ac_code_type"
                        }),
                        search.createColumn({
                            name: "custrecord_ac_long_description"
                        }),
                        search.createColumn({
                            name: "custrecord_ac_type"
                        }),
                        search.createColumn({
                            name: "custrecord_ac_pack_type"
                        })
                    ]
                });

                var searchData = [];
                var count = 0;
                var pageSize = 1000;
                var start = 0;
                do {
                    var searchObjArr = codesSearch.run().getRange(start, start + pageSize);

                    searchData = searchData.concat(searchObjArr);
                    count = searchObjArr.length;
                    start += pageSize;
                } while (count == pageSize);

                if (searchData) {
                    for (var i = 0; i < searchData.length; i++) {
                        var obj = {};
                        obj.internalid = searchData[i].getValue({
                            name: "internalid"
                        });

                        obj.code = searchData[i].getValue({
                            name: "custrecord_ac_code"
                        });

                        var typeId = searchData[i].getValue({
                            name: "custrecord_ac_code_type"
                        });
                        var typeText = searchData[i].getText({
                            name: "custrecord_ac_code_type"
                        });
                        obj.description = searchData[i].getValue({
                            name: "custrecord_ac_long_description"
                        });
                        obj.orderingType = searchData[i].getValue({
                            name: "custrecord_ac_type"
                        });
                        obj.packType = searchData[i].getValue({
                            name: "custrecord_ac_pack_type"
                        });
                        obj.packTypeText = searchData[i].getText({
                            name: "custrecord_ac_pack_type"
                        });

                        if (codesTypeArray.indexOf(typeId) == -1) {
                            codesTypeObjArray.push({
                                typeId: typeId,
                                typeName: typeText
                            })

                            codesTypeArray.push(typeId);
                        }
                        codesDataObjArr.push(obj);
                    }
                }


                var codesTypeObjArray = getAssessmentCodeTypeList();
                dataObj.codesDataObjArr = codesDataObjArr ? codesDataObjArr : [];
                dataObj.codesTypeObjArray = codesTypeObjArray ? codesTypeObjArray : [];

                return dataObj;


            } catch (e) {
                log.error("Error in " + title, e.message);
            }
        }

        function getAssessmentCodeTypeList() {
            var codesTypejArr = [];

            var codesSearch = search.create({
                type: "customrecord_code_type",
                filters: [
                    ["isinactive", "is", "F"]
                ],
                columns: [
                    search.createColumn({
                        name: "name"
                    }),
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.ASC
                    }),
                ]
            });

            var searchData = [];
            var count = 0;
            var pageSize = 1000;
            var start = 0;
            do {
                var searchObjArr = codesSearch.run().getRange(start, start + pageSize);

                searchData = searchData.concat(searchObjArr);
                count = searchObjArr.length;
                start += pageSize;
            } while (count == pageSize);

            if (searchData) {
                for (var i = 0; i < searchData.length; i++) {
                    var obj = {};
                    obj.typeId = searchData[i].getValue({
                        name: "internalid"
                    });

                    obj.typeName = searchData[i].getValue({
                        name: "name"
                    });
                    codesTypejArr.push(obj);
                }
            }

            return codesTypejArr;
        }


        function getScriptUrl() {
            var outputUrl = url.resolveScript({
                scriptId: 'customscript_w_sl_crt_lp_and_inspection',
                deploymentId: 'customdeploy_w_sl_crt_lp_and_inspection'
            });

            log.debug("outputUrl:", outputUrl);
            return outputUrl;
        }

        function getMaximumType(lpRecId) {
            var typeName;
            var typeId;
            var lpSearch = search.create({
                type: "customrecord_lp_item",
                filters: [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custrecord_lp_item_lp", "anyof", lpRecId],
                    "AND",
                    ["custrecord_lp_item_line_type", "noneof", ["@NONE@"]]
                ],
                columns: [
                    search.createColumn({
                        name: "custrecord_lp_item_line_type",
                        summary: 'group'
                    }),
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.DESC,
                        summary: 'count'
                    })
                ]
            });
            var searchData = lpSearch.run().getRange(0, 1000);
            if (searchData) {
                typeName = searchData[0].getText({
                    name: "custrecord_lp_item_line_type",
                    summary: 'group'
                })
                typeId = searchData[0].getValue({
                    name: "custrecord_lp_item_line_type",
                    summary: 'group'
                })
            }

            var objData = {};
            objData.typeName = typeName ? typeName : "";
            objData.typeId = typeId ? typeId : "";
            return objData;
        }

        return {
            onRequest: onRequest
        };
    });