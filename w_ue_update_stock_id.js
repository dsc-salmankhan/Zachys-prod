  /**
   * @NApiVersion 2.x
   * @NScriptType UserEventScript
   */
  var VINTAGE_BAND_MIXED = 8; //Mixed
  var VINTAGE_MIXED = 201; //Mixed

  define(['N/search', 'N/record'],
      function (search, record) {
          function afterSubmit(context) {
              var title = 'afterSubmit';
              try {

                  if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT) {
                      var oldVintageId = '';
                      var oldQuantity = '';
                      var oldLeEstimate = '';
                      if (context.type == context.UserEventType.EDIT) {
                          var oldRec = context.oldRecord;
                          oldVintageId = oldRec.getValue({
                              fieldId: 'custrecord_stockid_vintage'
                          });
                          oldQuantity = oldRec.getValue({
                              fieldId: 'custrecord_stockid_bttl_qty'
                          });
                          oldLeEstimate = oldRec.getValue({
                              fieldId: 'custrecord_stockid_le_band'
                          });
                          oldestLow = oldRec.getValue({
                              fieldId: 'custrecord_stockid_est_low'
                          });
                      }
                      var newRec = context.newRecord;
                      var internalId = newRec.id;
                      var vintageBand = newRec.getValue({
                          fieldId: 'custrecord_stockid_vintage_band'
                      });
                      var quantityBand = newRec.getValue({
                          fieldId: 'custrecord_stockid_quantity_band'
                      });
                      var leEstimate = newRec.getValue({
                          fieldId: 'custrecord_stockid_le_band'
                      });
                      var currencyId = newRec.getValue({
                          fieldId: 'custrecord_stockid_currency'
                      });
                      var estLow = newRec.getValue({
                          fieldId: 'custrecord_stockid_est_low'
                      });

                      if (internalId || !vintageBand || !quantityBand) {
                          var stockRec = record.load({
                              type: 'customrecord_stockid',
                              id: internalId,
                              isDynamic: true
                          });
                          var vintageId = stockRec.getValue({
                              fieldId: 'custrecord_stockid_vintage'
                          });
                          var vintage = stockRec.getText({
                              fieldId: 'custrecord_stockid_vintage'
                          });
                          var quantity = stockRec.getValue({
                              fieldId: 'custrecord_stockid_bttl_qty'
                          });

                          if (context.type == context.UserEventType.CREATE) {
                              oldVintageId = vintageId;
                              oldQuantity = quantity;
                              oldLeEstimate = leEstimate;
                              oldestLow = estLow;
                          }

                          log.debug("vintageId : vintage", vintageId + ' : ' + vintage);
                          log.debug("quantity", quantity);

                          if ((vintageId && vintageId != VINTAGE_MIXED && !vintageBand) || (oldVintageId != vintageId)) {
                              log.debug("if 1", "yes got true")
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

                                  stockRec.setValue({
                                      fieldId: "custrecord_stockid_vintage_band",
                                      value: vintageBandId,
                                      ignoreFieldChange: true
                                  });

                              }
                          } else {
                              log.debug("else 1", "yes got true");
                            if (!vintageBand) {
                              stockRec.setValue({
                                  fieldId: "custrecord_stockid_vintage_band",
                                  value: VINTAGE_BAND_MIXED,
                                  ignoreFieldChange: true
                              });
                            }
                          }


                          if ((!quantityBand && quantity) || (oldQuantity != quantity)) {
                              log.debug("if 2", "yes got true")
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
                                  stockRec.setValue({
                                      fieldId: "custrecord_stockid_quantity_band",
                                      value: qtyBandId,
                                      ignoreFieldChange: true
                                  });

                              }
                          }

                          if ((oldLeEstimate != leEstimate || !leEstimate || oldQuantity != quantity || oldestLow != estLow) && quantity && estLow) {
                              log.debug("if 3", "yes got true");

                              var averageExtLow = parseInt(estLow / quantity);
                              if (averageExtLow > 0) {

                                  var avgLeBandObj = search.create({
                                      type: "customrecord_le_band",
                                      filters: [
                                          ["isinactive", "is", "F"],
                                          "AND",
                                          ["custrecord_le_band_low", "lessthanorequalto", parseInt(averageExtLow)],
                                          "AND",
                                          ["custrecord_le_band_high", "greaterthanorequalto", parseInt(averageExtLow)],
                                          "AND",
                                          ["custrecord_le_band_currency", "anyof", currencyId]
                                      ],
                                      columns: [
                                          search.createColumn({
                                              name: "internalid"
                                          })
                                      ]
                                  });

                                  var avgLeBandSearchData = avgLeBandObj.run().getRange(0, 1000);

                                  if (avgLeBandSearchData.length > 0) {
                                      var leBandId = avgLeBandSearchData[0].getValue({
                                          name: 'internalid'
                                      });
                                      stockRec.setValue({
                                          fieldId: "custrecord_stockid_le_band",
                                          value: leBandId,
                                          ignoreFieldChange: true
                                      });
                                  }

                                  log.debug("averageExtLow:", averageExtLow);

                              }


                          }
                          stockRec.save({
                              enableSourcing: true,
                              ignoreMandatoryFields: true
                          });

                      }
                  }



                  return true;
              } catch (e) {
                  log.error("ERROR IN:: " + title, e.message);

              }
          }


          return {
              afterSubmit: afterSubmit
          };
      });