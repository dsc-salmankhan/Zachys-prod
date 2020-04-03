  /**
   * @NApiVersion 2.x
   * @NScriptType UserEventScript
   */
  define([],
      function () {
          function beforeSubmit(context) {
              var title = 'beforeSubmit';
              try {

                  if (context.type == context.UserEventType.EDIT) {
                      var newRec = context.newRecord;

                      var line = newRec.getLineCount({
                          sublistId: 'recmachcustrecord_cl_consignment'
                      });
                      log.debug('line', line);
                      for (var i = 0; i < line; i++) {

                          var ConsignmentDesc = newRec.getSublistValue({
                              sublistId: 'recmachcustrecord_cl_consignment',
                              fieldId: 'custrecord_cl_item_description',
                              line: i
                          });
                          var tempConsignmentItemName = newRec.getSublistText({
                              sublistId: 'recmachcustrecord_cl_consignment',
                              fieldId: 'custrecord_cl_item',
                              line: i
                          });
                          var ConsignmentItemName = tempConsignmentItemName.replace(/ /g, '==');
                          log.debug('ConsignmentItemName ::', ConsignmentItemName);
                          var ConsignmentScreener = newRec.getSublistText({
                              sublistId: 'recmachcustrecord_cl_consignment',
                              fieldId: 'custrecord_cl_screener',
                              line: i
                          });
                          var ConsignmentBottleLow = newRec.getSublistValue({
                              sublistId: 'recmachcustrecord_cl_consignment',
                              fieldId: 'custrecord_cl_bottle_low',
                              line: i
                          });
                          var ConsignmentBottleHigh = newRec.getSublistValue({
                              sublistId: 'recmachcustrecord_cl_consignment',
                              fieldId: 'custrecord_cl_bottle_high',
                              line: i
                          });
                          var ConsignmentEvent = newRec.getSublistText({
                              sublistId: 'recmachcustrecord_cl_consignment',
                              fieldId: 'custrecord_cl_event',
                              line: i
                          });
                          var ConsignmentQty = newRec.getSublistValue({
                              sublistId: 'recmachcustrecord_cl_consignment',
                              fieldId: 'custrecord_cl_qty_expected',
                              line: i
                          });
                          var ConsignmentLineId = newRec.getSublistValue({
                              sublistId: 'recmachcustrecord_cl_consignment',
                              fieldId: 'id',
                              line: i
                          });
                          var splitUrl = newRec.getSublistValue({
                              sublistId: 'recmachcustrecord_cl_consignment',
                              fieldId: 'custrecord_cl_split_link',
                              line: i
                          });
                          log.debug('ConsignmentLineId', ConsignmentLineId);
                          if (ConsignmentQty && ConsignmentItemName && !splitUrl) {
                              var suiteletUrl = '/app/site/hosting/scriptlet.nl?script=customscript_link_suitelet_split_lines&deploy=1&itemname=' + ConsignmentItemName + '&itemqty=' + ConsignmentQty + '&conlineid=' + ConsignmentLineId + '&consignrecid=' + newRec.id + '&screener=' + ConsignmentScreener + '&event=' + ConsignmentEvent + '&bottlelow=' + ConsignmentBottleLow + '&bottleHigh=' + ConsignmentBottleHigh
                              //   suiteletUrl = suiteletUrl.replace(/' '/g,'==');
                              log.debug('suiteletUrl :: ', suiteletUrl);
                              newRec.setSublistValue({
                                  sublistId: 'recmachcustrecord_cl_consignment',
                                  fieldId: 'custrecord_cl_split_link',
                                  line: i,
                                  value: suiteletUrl
                              });

                          }
                          log.debug('ConsignmentDesc', ConsignmentItemName + ConsignmentQty);
                      }
                  }

                  return true;
              } catch (e) {
                  log.error("ERROR IN:: " + title, e.message);

              }
          }


          function beforeLoad(context) {
              var title = 'beforeLoad';
              try {
                  var newRec = context.newRecord;
                  if (context.type != context.UserEventType.VIEW) {
                      var line = newRec.getLineCount({
                          sublistId: 'recmachcustrecord_cl_consignment'
                      });
                      log.debug('line', line);
                      for (var k = 0; k < line; k++) {
                          var splitLinkValue = newRec.getSublistValue({
                            sublistId: 'recmachcustrecord_cl_consignment',
                            fieldId: 'custrecord_cl_split_link',
                            line: k
                        });
                        log.debug('setting link null start',splitLinkValue);
                          newRec.setSublistValue({
                              sublistId: 'recmachcustrecord_cl_consignment',
                              fieldId: 'custrecord_cl_split_link',
                              line: k,
                              value: null
                          });
                          newRec.save();
                      log.debug('setting link null end');
                      }
                  }

                  return true;
              } catch (e) {
                  log.error("ERROR IN:: " + title, e.message);

              }

          }

          return {
              beforeSubmit: beforeSubmit,
              beforeLoad: beforeLoad
          };
      });