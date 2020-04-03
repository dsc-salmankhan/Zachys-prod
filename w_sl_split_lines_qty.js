/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */

// this creates a Suitelet form

define(['N/ui/serverWidget', 'N/email', 'N/runtime'],
    function (ui, email, runtime) {
        function onRequest(context) {
            if (context.request.method === 'GET') {
                var request = context.request;
                var parameter = request.parameters;
                var itemNamePara = parameter.itemname.replace(/==/g, ' ');
                var itemQtyPara = parameter.itemqty != 'undefined' ? parameter.itemqty : "";
                var conLineIdPara = parameter.conlineid != 'undefined' ? parameter.conlineid : '';
                var conIdPara = parameter.consignrecid != 'undefined' ? parameter.consignrecid : '';
                var conScreener = parameter.screener != 'undefined' ? parameter.screener : '';
                var conBottleLowPara = parameter.bottlelow != 'undefined' ? parameter.bottlelow : '';
                var conBottleHighPara = parameter.bottleHigh != 'undefined' ? parameter.bottleHigh : '';
                var conEvent = parameter.event != 'undefined' ? parameter.event : '';
                log.debug('objInfo', itemNamePara + ':' + itemQtyPara);
                var form = ui.createForm({
                    title: 'SPLIT QUANTITY LINES FORM'
                });
                form.clientScriptFileId = 136704;
                var itemName = form.addField({
                    id: 'item_name',
                    type: ui.FieldType.TEXT,
                    label: 'Item'
                });
                itemName.defaultValue = itemNamePara;
                itemName.updateDisplayType({
                    displayType: ui.FieldDisplayType.DISABLED
                });
                var itemQty = form.addField({
                    id: 'item_qty',
                    type: ui.FieldType.TEXT,
                    label: 'Quantity'
                });
                itemQty.defaultValue = itemQtyPara;
                itemQty.updateDisplayType({
                    displayType: ui.FieldDisplayType.DISABLED
                });
                var splitInto = form.addField({
                    id: 'item_split_into',
                    type: ui.FieldType.TEXT,
                    label: 'Split Into'
                });
                var event = form.addField({
                    id: 'item_event',
                    type: ui.FieldType.TEXT,
                    label: 'EVENT'
                });
                if (conEvent) {
                    event.defaultValue = conEvent;
                }

                event.updateDisplayType({
                    displayType: ui.FieldDisplayType.DISABLED
                });
                var screener = form.addField({
                    id: 'item_screener',
                    type: ui.FieldType.TEXT,
                    label: 'SCREENER'
                });
                if (conScreener) {
                    screener.defaultValue = conScreener;
                }

                screener.updateDisplayType({
                    displayType: ui.FieldDisplayType.DISABLED
                });
                form.addButton({
                    id: 'btn_split_lines',
                    label: 'Start Split',
                    functionName: 'splitLinesTable'
                });

                var sublist = form.addSublist({
                    id: 'splitqtysublist',
                    type: ui.SublistType.INLINEEDITOR,
                    label: 'Split Quantity'
                });
                var itemType = sublist.addField({
                    id: 'itemtypesublist',
                    label: 'Type',
                    type: ui.FieldType.SELECT,
                    source: 'customlist_consginment_lines_type'
                });
                var itemInternal = sublist.addField({
                    id: 'itemsublist',
                    label: 'Item',
                    type: ui.FieldType.TEXT
                });

                itemInternal.updateDisplayType({
                    displayType: ui.FieldDisplayType.DISABLED
                });

                var itemDecription = sublist.addField({
                    id: 'descriptionsublist',
                    label: 'description',
                    type: ui.FieldType.TEXT
                });
                itemDecription.updateDisplayType({
                    displayType: ui.FieldDisplayType.DISABLED
                });
                sublist.addField({
                    id: 'qtysublist',
                    label: 'Quantity',
                    type: ui.FieldType.TEXT
                });
                form.addButton({
                    id: 'btn_submit',
                    label: 'Submit',
                    functionName: 'createConsignLines(' + conLineIdPara + ',' + conIdPara + ',' + conBottleLowPara + ',' + conBottleHighPara + ')'
                });
                context.response.writePage(form);
            }
        }
        return {
            onRequest: onRequest
        };
    });