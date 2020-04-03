  /**
   * @NApiVersion 2.x
   * @NScriptType UserEventScript
   */
  define(['N/search'],
      function (search) {
          function beforeLoad(context) {
              var title = 'beforeLoad';
              try {
                  log.debug("test", "function start")
                  var t0 = new Date().getTime();
                  var sortDataArr = [];
                  var auctionDataArr = [];
                  if (context.type !== context.UserEventType.CREATE) {
                      context.form.clientScriptFileId = 153085;
                      var recObj = context.newRecord;
                      var recordId = context.newRecord.id

                      var auctionType = recObj.getValue({
                          fieldId: 'custrecord_auction_type'
                      });
                      context.form.addButton({
                          id: 'custpage_btn_create_vendor_bill',
                          label: 'Create Vendor Bill',
                          functionName: 'createVendorBill(' + recordId + ')'
                      });

                      context.form.addButton({
                          id: 'custpage_btn_sorting_order_rec',
                          label: 'Create Sorting Order',
                          functionName: 'createSortingOrder(' + recordId + ')'
                      });

                      var sortRecSearchObj = search.create({
                          type: "customrecord_auction_sorting_order",
                          filters: [
                              ["isinactive", "is", "F"]
                          ],
                          columns: [{
                              name: 'internalid'
                          }, {
                              name: 'name'
                          }, {
                              name: 'custrecord_auc_sorting_class'
                          }, {
                              name: 'custrecord_auc_sorting_country'
                          }, {
                              name: 'custrecord_auc_sorting_region'
                          }, {
                              name: 'custrecord_auc_sorting_varietal'
                          }, {
                              name: 'custrecord_auc_sorting_producer'
                          }, {
                              name: 'custrecord_auc_sorting_appellation'
                          }, {
                              name: 'custrecord_auc_sorting_order',
                              sort: search.Sort.ASC
                          }]
                      });

                      var sortSearchData = sortRecSearchObj.run().getRange(0, 1000);
                      if (sortSearchData.length > 0) {
                          for (var i = 0; i < sortSearchData.length; i++) {
                              var obj = {};
                              var internalid = sortSearchData[i].getValue({
                                  name: 'internalid'
                              });
                              var name = sortSearchData[i].getValue({
                                  name: 'name'
                              });
                              var className = sortSearchData[i].getText({
                                  name: 'custrecord_auc_sorting_class'
                              });
                              var country = sortSearchData[i].getText({
                                  name: 'custrecord_auc_sorting_country'
                              });
                              var region = sortSearchData[i].getText({
                                  name: 'custrecord_auc_sorting_region'
                              });
                              var varietal = sortSearchData[i].getText({
                                  name: 'custrecord_auc_sorting_varietal'
                              });
                              var producer = sortSearchData[i].getText({
                                  name: 'custrecord_auc_sorting_producer'
                              });
                              var appellation = sortSearchData[i].getText({
                                  name: 'custrecord_auc_sorting_appellation'
                              });
                              var orderNumber = sortSearchData[i].getValue({
                                  name: 'custrecord_auc_sorting_order',
                                  sort: search.Sort.ASC
                              });

                              obj.internalid = internalid ? internalid : '';
                              obj.name = name ? name : '';
                              obj.class = className ? className : '';
                              obj.country = country ? country : '';
                              obj.region = region ? region : '';
                              obj.varietal = varietal ? varietal : '';
                              obj.producer = producer ? producer : '';
                              obj.appellation = appellation ? appellation : '';
                              obj.ordernumber = orderNumber ? orderNumber : '';
                              sortDataArr.push(obj);

                          }

                          log.debug("sortDataArr:", JSON.stringify(sortDataArr))
                      }



                      var auctionRecSearchObj = search.create({
                          type: "customrecord_auction_lot",
                          filters: [
                              ["isinactive", "is", "F"],
                              "AND",
                              ["custrecord_auction_lot_auction", "anyof", recordId],
                          ],
                          columns: [
                              "internalid",
                              "name",
                              "custrecord_auction_lot_class",
                              "custrecord_auction_lot_country",
                              "custrecord_auction_lot_region",
                              "custrecord_auction_lot_varietal",
                              "custrecord_auction_lot_producer",
                              "custrecord_auction_lot_appellation",
                              "custrecord_auction_lot_vintage",
                              "custrecord_auction_lot_size",
                              "custrecord_auction_lot_consignment",
                              "custrecord_auction_lot_pre_lot",
                              "custrecord_auction_lot_sort_order",
                              "custrecord_auction_lot_sort_order.custrecord_auc_sorting_order",
                              "custrecord_auction_lot_title"

                          ]
                      });

                      var auctionSearchData = auctionRecSearchObj.run().getRange(0, 1000);
                      if (auctionSearchData.length > 0) {
                          for (var i = 0; i < auctionSearchData.length; i++) {
                              var obj = {};
                              var internalid = auctionSearchData[i].getValue({
                                  name: 'internalid'
                              });
                              var name = auctionSearchData[i].getValue({
                                  name: 'name'
                              });
                              var className = auctionSearchData[i].getText({
                                  name: 'custrecord_auction_lot_class'
                              });
                              var country = auctionSearchData[i].getText({
                                  name: 'custrecord_auction_lot_country'
                              });
                              var region = auctionSearchData[i].getText({
                                  name: 'custrecord_auction_lot_region'
                              });
                              var varietal = auctionSearchData[i].getText({
                                  name: 'custrecord_auction_lot_varietal'
                              });
                              var producer = auctionSearchData[i].getText({
                                  name: 'custrecord_auction_lot_producer'
                              });
                              var appellation = auctionSearchData[i].getText({
                                  name: 'custrecord_auction_lot_appellation'
                              });
                              var vintage = auctionSearchData[i].getText({
                                  name: 'custrecord_auction_lot_vintage'
                              });
                              var size = auctionSearchData[i].getText({
                                  name: 'custrecord_auction_lot_size'
                              });
                              var consignmentid = auctionSearchData[i].getValue({
                                  name: 'custrecord_auction_lot_consignment'
                              });
                              var prelot = auctionSearchData[i].getValue({
                                  name: 'custrecord_auction_lot_pre_lot'
                              });
                              var sortOrder = auctionSearchData[i].getValue({
                                  name: 'custrecord_auction_lot_sort_order'
                              });
                              var orderNumber = auctionSearchData[i].getValue({
                                  name: 'custrecord_auc_sorting_order',
                                  join: 'custrecord_auction_lot_sort_order'
                              });
                              var title = auctionSearchData[i].getValue({
                                  name: 'custrecord_auction_lot_title'
                              });

                              obj.internalid = internalid ? internalid : '-999';
                              obj.name = name ? name : '-999';
                              obj.ordernumber = orderNumber ? orderNumber : '-999';
                              obj.region = region ? region : '-999';
                              obj.title = title ? title : '';
                              obj.vintage = vintage ? vintage : '-999';
                              obj.consignmentid = consignmentid ? consignmentid : '-999';
                              obj.class = className ? className : '-999';
                              obj.country = country ? country : '-999';
                              obj.varietal = varietal ? varietal : '-999';
                              obj.producer = producer ? producer : '-999';
                              obj.appellation = appellation ? appellation : '-999';
                              obj.size = size ? size : '-999';
                              obj.lotSortOrder = sortOrder ? sortOrder : '-999';
                              obj.prelot = parseInt(prelot) ? parseInt(prelot) : '-999';

                              auctionDataArr.push(obj);

                          }

                      }

                      var parameterObj = {};
                      parameterObj.auctionType = auctionType;
                      parameterObj.sortDataArr = sortDataArr;
                      parameterObj.auctionLotsRecordArr = auctionDataArr;
                      parameterObj.recordId = recordId;
                      var conButton = context.form.addButton({
                          id: 'custpage_btn_sort_order',
                          label: 'Sort Auction Lots',
                          functionName: 'sortAuctionLots(' + JSON.stringify(parameterObj) + ')'
                      });

                  }

                  var t1 = new Date().getTime();
                  log.debug('time taken:', "Call to doSomething took " + (t1 - t0) + " milliseconds.")
                  log.debug("test", "function end")
                  return true;
              } catch (e) {
                  log.error("ERROR IN:: " + title, e.message);

              }

          }

          return {
              beforeLoad: beforeLoad
          };
      });