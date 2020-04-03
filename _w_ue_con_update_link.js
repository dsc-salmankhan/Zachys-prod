  /**
   * @NApiVersion 2.x
   * @NScriptType UserEventScript
   */
  define(['N/record'],
    function (record) {
      function afterSubmit(context) {
        var title = 'afterSubmit';
        try {

          if (context.type != context.UserEventType.DELETE) {
            var newRec = context.newRecord;
            var rec = record.load({
              type: newRec.type,
              id: newRec.id
            });
            var tempConsignmentItemName = rec.getText({
              fieldId: 'custrecord_cl_item'
            });
            var ConsignmentItemName = tempConsignmentItemName.replace(/ /g,'==');
            var ConsignmentQty = rec.getValue({
              fieldId: 'custrecord_cl_qty_expected'
            });
            var ConsignmentId = rec.getValue({
              fieldId: 'custrecord_cl_consignment'
            });
            var screener = rec.getValue({
              fieldId: 'custrecord_cl_screener'
            });
            var bottleLow = rec.getValue({
              fieldId: 'custrecord_cl_bottle_low'
            });
            var bottleHigh = rec.getValue({
              fieldId: 'custrecord_cl_bottle_high'
            });
            var event = rec.getValue({
              fieldId: 'custrecord_cl_event'
            });
            var ConsignmentLineId = newRec.id;
            if (ConsignmentQty && ConsignmentItemName) {
              log.debug('test value: ', ConsignmentQty + ' : ' + ConsignmentItemName);
              var suiteletUrl = '/app/site/hosting/scriptlet.nl?script=customscript_link_suitelet_split_lines&deploy=1&itemname=' + ConsignmentItemName + '&itemqty=' + ConsignmentQty + '&conlineid=' + ConsignmentLineId + '&consignrecid=' + ConsignmentId + '&screener=' + screener + '&event=' + event  + '&bottlelow=' + bottleLow  + '&bottleHigh=' + bottleHigh
              log.debug('suiteletUrl', suiteletUrl);
              rec.setValue({
                fieldId: 'custrecord_cl_split_link',
                value: suiteletUrl
              });

            }
          }
          rec.save({
            enableSourcing: true,
            ignoreMandatoryFields: true
          });
          return true;
        } catch (e) {
          log.error("ERROR IN:: " + title, e.message);

        }
      }
      return {
        afterSubmit: afterSubmit
      };
    });