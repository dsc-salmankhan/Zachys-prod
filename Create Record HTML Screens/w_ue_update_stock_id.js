  /**
   * @NApiVersion 2.x
   * @NScriptType UserEventScript
   */
  var VINTAGE_BAND = 8; //Mixed

  define(['N/search'],
      function (search) {
          function beforeSubmit(context) {
              var title = 'beforeSubmit';
              try {

                  if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT) {
                      var newRec = context.newRecord;

                      var vintageBand = newRec.getValue({
                          fieldId: 'custrecord_stockid_vintage_band'
                      });
                      var vintage = newRec.getText({
                          fieldId: 'custrecord_stockid_vintage'
                      });
                      var quantityBand = newRec.getValue({
                          fieldId: 'custrecord_stockid_quantity_band'
                      });
                      var quantity = newRec.getValue({
                          fieldId: 'custrecord_stockid_bttl_qty'
                      });

                      log.debug("vintageBand : vintage", vintageBand + ' : ' + vintage);
                      log.debug("quantityBand : quantity", quantityBand + ' : ' + quantity);

                      if (vintage && vintageBand != VINTAGE_BAND) {
                          var vintageBandSearchObj = search.create({
                              type: "customrecord_vintage_band",
                              filters: [
                                  ["isinactive", "is", "F"],
                                  "AND",
                                  ["custrecord_vintage_band_low", "lessthanorequalto", parseInt(vintage)],
                                  "AND",
                                  ["custrecord_vintage_band_high", "greaterthanorequalto", parseInt(vintage)],
                              ],
                              columns: [

                                  search.createColumn({
                                      name: "internalid"
                                  }),
                                  search.createColumn({
                                      name: "name"
                                  })

                              ]
                          });

                          var vintageSearchData = vintageBandSearchObj.run().getRange(0, 1000);

                          if (vintageSearchData.length > 0) {
                              log.debug("vintageSearchData", JSON.stringify(vintageSearchData));
                              var vintageBandId = vintageSearchData[0].getValue({
                                  name: 'internalid'
                              });

                              newRec.setValue({
                                  fieldId: 'custrecord_stockid_vintage_band',
                                  value: vintageBandId
                              });
                          }
                      }


                      if (!quantityBand && quantity) {
                          var qtyBandSearchObj = search.create({
                              type: "customrecord_quantity_band",
                              filters: [
                                  ["isinactive", "is", "F"],
                                  "AND",
                                  ["custrecord_quantity_band_low", "lessthanorequalto", parseInt(quantity)],
                                  "AND",
                                  ["custrecord_quantity_band_high", "greaterthanorequalto", parseInt(quantity)],
                              ],
                              columns: [

                                  search.createColumn({
                                      name: "internalid"
                                  }),
                                  search.createColumn({
                                      name: "name"
                                  })

                              ]
                          });

                          var qtySearchData = qtyBandSearchObj.run().getRange(0, 1000);

                          if (qtySearchData.length > 0) {
                              log.debug("qtySearchData", JSON.stringify(qtySearchData));
                              var qtyBandId = qtySearchData[0].getValue({
                                  name: 'internalid'
                              });

                              newRec.setValue({
                                  fieldId: 'custrecord_stockid_quantity_band',
                                  value: qtyBandId
                              });
                          }
                      }


                  }


                  return true;
              } catch (e) {
                  log.error("ERROR IN:: " + title, e.message);

              }
          }


          return {
              beforeSubmit: beforeSubmit
          };
      });