  /**
   * @NApiVersion 2.x
   * @NScriptType UserEventScript
   */
  define([],
      function () {

          function beforeLoad(context) {
              var title = 'beforeLoad';
              try {
                log.debug("test", "test2");
                  context.form.clientScriptFileId = 136699;
                  if (context.type !== context.UserEventType.CREATE) {
                      log.debug("test", "8899");
                      var conReportButton = context.form.addButton({
                          id: 'custpage_btn_con_report',
                          label: 'Print Consignment Report',
                          functionName: 'createConsignmentReport(' + context.newRecord.id + ')'
                      });

                      var conButton = context.form.addButton({
                          id: 'custpage_btn_create_lp_inspection',
                          label: 'Create LP & Inspection',
                          functionName: 'createLpAndInspection(' + context.newRecord.id + ')'
                      });

                      var conButton = context.form.addButton({
                          id: 'custpage_btn_create_stockids',
                          label: 'Create Stock ID',
                          functionName: 'createStockIds(' + context.newRecord.id + ')'
                      });

                      var conButton = context.form.addButton({
                          id: 'custpage_btn_create_auction_lot',
                          label: 'Create Auction Lot',
                          functionName: 'createAuctionLot(' + context.newRecord.id + ')'
                      });

                      var conButton = context.form.addButton({
                        id: 'custpage_btn_discrepancy_report',
                        label: 'Discrepancy Report',
                        functionName: 'openDiscrepancyReport(' + context.newRecord.id + ')'
                    });

                  }
                  return true;
              } catch (e) {
                  log.error("ERROR IN:: " + title, e.message);

              }

          }

          return {
              beforeLoad: beforeLoad
          };
      });