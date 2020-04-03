  /**
   * @NApiVersion 2.x
   * @NScriptType UserEventScript
   */
  var AUCTION_VERSION_TEMPLATE = '1'; //Standard
  var DEFAULT_SORT_ORDER_ID = '47'; //Other

  define(['N/record', 'N/search'],
      function (record, search) {
          function afterSubmit(context) {
              var title = 'afterSubmit() :: ';
              try {
                  var newRec = context.newRecord;

                  if (context.type != context.UserEventType.DELETE) {
                      var aucSortCatergoryRecData = getSortingCatergoryRecInfo();
                      if (aucSortCatergoryRecData) {
                          var itemObj = getItemRecFields(newRec);

                          log.debug(title + "aucSortCatergoryRecData:", JSON.stringify(aucSortCatergoryRecData));
                          log.debug(title + "aucSortCatergoryRecData.length:", aucSortCatergoryRecData.length);
                          log.debug(title + "item record fields:", JSON.stringify(itemObj));
                          var aucSorderObj = getMappedData(itemObj, aucSortCatergoryRecData);
                          if (aucSorderObj) {
                              log.debug(title + "aucSorderObj:", JSON.stringify(aucSorderObj));
                              if (JSON.stringify(aucSorderObj) != "{}") {
                                  record.submitFields({
                                      type: newRec.type,
                                      id: newRec.id,
                                      values: {
                                          custitem_sort_order: aucSorderObj.categoryId,
                                          custitem_sort_order_sequence: aucSorderObj.sequenceOrder
                                      },
                                      options: {
                                          enableSourcing: false,
                                          ignoreMandatoryFields: true
                                      }
                                  });
                              }

                          }

                      }



                  }
                  return true;
              } catch (e) {
                  log.error("ERROR IN:: " + title, e.message);

              }
          }

          function getItemRecFields(newRecObj) {
              var obj = {};
              var newRec = record.load({
                type: newRecObj.type,
                id: newRecObj.id,
                isDynamic: true
            });
              obj.class = newRec.getText({
                  fieldId: "custitem_class"
              }).trim().toLowerCase() || "-999";
              obj.country = newRec.getText({
                  fieldId: "cseg_country"
              }).trim().toLowerCase() || "-999";
              obj.region = newRec.getText({
                  fieldId: "cseg_region"
              }).trim().toLowerCase() || "-999";
              obj.varietal = newRec.getText({
                  fieldId: "custitem_varietal"
              }).trim().toLowerCase() || "-999";
              obj.producer = newRec.getText({
                  fieldId: "custitem_producer"
              }).trim().toLowerCase() || "-999";
              obj.appellation = newRec.getText({
                  fieldId: "cseg_appellation"
              }).trim().toLowerCase() || "-999";

              return obj;
          }

          function getSortingCatergoryRecInfo() {
              var sortDataArr = [];

              var sortObjSearch = search.create({
                  type: "customrecord_auction_version_cat_sort",
                  filters: [
                      ["isinactive", "is", "F"],
                      "AND",
                      ["custrecord_avcs_version_template", "anyof", AUCTION_VERSION_TEMPLATE]
                  ],
                  columns: [
                      search.createColumn({
                          name: "internalid"
                      }),
                      search.createColumn({
                          name: "custrecord_auc_sorting_class",
                          join: "custrecord_avcs_sort_category"
                      }),
                      search.createColumn({
                          name: "custrecord_auc_sorting_country",
                          join: "custrecord_avcs_sort_category"
                      }),
                      search.createColumn({
                          name: "custrecord_auc_sorting_region",
                          join: "custrecord_avcs_sort_category"
                      }),
                      search.createColumn({
                          name: "custrecord_auc_sorting_varietal",
                          join: "custrecord_avcs_sort_category"
                      }),
                      search.createColumn({
                          name: "custrecord_auc_sorting_producer",
                          join: "custrecord_avcs_sort_category"
                      }),
                      search.createColumn({
                          name: "custrecord_auc_sorting_appellation",
                          join: "custrecord_avcs_sort_category"
                      }),
                      search.createColumn({
                          name: "custrecord_auc_sorting_order",
                          join: "custrecord_avcs_sort_category",
                          sort: search.Sort.ASC
                      }),
                      search.createColumn({
                          name: "custrecord_avcs_version_template"
                      }),
                      search.createColumn({
                          name: "custrecord_avcs_order_sequence"
                      }),
                      search.createColumn({
                          name: "custrecord_avcs_sort_category"
                      })
                  ]
              });

              var sortSearchData = [];
              var count = 0;
              var pageSize = 1000;
              var start = 0;
              do {
                  var searchObjArr = sortObjSearch.run().getRange(start, start + pageSize);

                  sortSearchData = sortSearchData.concat(searchObjArr);
                  count = searchObjArr.length;
                  start += pageSize;
              } while (count == pageSize);

              if (sortSearchData.length > 0) {
                  for (var i = 0; i < sortSearchData.length; i++) {
                      var obj = {};
                      obj.internalid = sortSearchData[i].getValue({
                          name: 'internalid'
                      }).trim().toLowerCase() || "";
                      obj.class = sortSearchData[i].getText({
                          name: 'custrecord_auc_sorting_class',
                          join: "custrecord_avcs_sort_category"
                      }).trim().toLowerCase() || "";
                      obj.country = sortSearchData[i].getText({
                          name: 'custrecord_auc_sorting_country',
                          join: "custrecord_avcs_sort_category"
                      }).trim().toLowerCase() || "";
                      obj.region = sortSearchData[i].getText({
                          name: 'custrecord_auc_sorting_region',
                          join: "custrecord_avcs_sort_category"
                      }).trim().toLowerCase() || "";
                      obj.varietal = sortSearchData[i].getText({
                          name: 'custrecord_auc_sorting_varietal',
                          join: "custrecord_avcs_sort_category"
                      }).trim().toLowerCase() || "";
                      obj.producer = sortSearchData[i].getText({
                          name: 'custrecord_auc_sorting_producer',
                          join: "custrecord_avcs_sort_category"
                      }).trim().toLowerCase() || "";
                      obj.appellation = sortSearchData[i].getText({
                          name: 'custrecord_auc_sorting_appellation',
                          join: "custrecord_avcs_sort_category"
                      }).trim().toLowerCase() || "";
                      obj.templateId = sortSearchData[i].getValue({
                          name: "custrecord_avcs_version_template"
                      }) || "";
                      obj.sequenceOrder = sortSearchData[i].getValue({
                          name: "custrecord_avcs_order_sequence"
                      }) || "";
                      obj.categoryId = sortSearchData[i].getValue({
                          name: "custrecord_avcs_sort_category"
                      }) || "";
                      obj.sortingOrder = sortSearchData[i].getValue({
                          name: "custrecord_auc_sorting_order",
                          join: "custrecord_avcs_sort_category",
                          sort: search.Sort.ASC
                      }) || "";
                      sortDataArr.push(obj);

                  }

              }

              return sortDataArr;
          }

          function getMappedData(itemObj, aucSortOrderDataArr) {
              var isExist = false;
              var sortOrderObj = {};
              for (var i = 0; i < aucSortOrderDataArr.length; i++) {
                  if ((!aucSortOrderDataArr[i].class || aucSortOrderDataArr[i].class.trim().indexOf(itemObj.class.trim()) != -1) &&
                      (!aucSortOrderDataArr[i].country || aucSortOrderDataArr[i].country.trim().indexOf(itemObj.country.trim()) != -1) &&
                      (!aucSortOrderDataArr[i].region || aucSortOrderDataArr[i].region.trim().indexOf(itemObj.region.trim()) != -1) &&
                      (!aucSortOrderDataArr[i].varietal || aucSortOrderDataArr[i].varietal.trim().indexOf(itemObj.varietal.trim()) != -1) &&
                      (!aucSortOrderDataArr[i].producer || aucSortOrderDataArr[i].producer.trim().indexOf(itemObj.producer.trim()) != -1) &&
                      (!aucSortOrderDataArr[i].appellation || aucSortOrderDataArr[i].appellation.trim().indexOf(itemObj.appellation.trim()) != -1)) {

                      sortOrderObj = aucSortOrderDataArr[i];
                      isExist = true;
                      break;

                  }
              }

              if (!isExist) {
                  sortOrderObj.categoryId = DEFAULT_SORT_ORDER_ID;
                  sortOrderObj.sequenceOrder = DEFAULT_SORT_ORDER_ID;
              }


              return sortOrderObj;
          }

          return {
              afterSubmit: afterSubmit
          };
      });