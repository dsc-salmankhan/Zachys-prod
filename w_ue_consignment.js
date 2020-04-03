  /**
   * @NApiVersion 2.x
   * @NScriptType UserEventScript
   */
  var STATUS_CONFIRMED = '39' //Ready for Consignment
  define([],
      function () {
          function beforeLoad(context) {
              var title = 'beforeLoad';
              try {
                  context.form.clientScriptFileId = 134323;

                  if (context.type !== context.UserEventType.CREATE) {
                      var newRec = context.newRecord;
                      var ConsignmentLink = newRec.getValue({
                          fieldId: 'custrecord_appraisal_consignment'
                      });
                      var appStatus = newRec.getValue({
                          fieldId: 'custrecord_appraisal_status'
                      });

                             var appReportButton = context.form.addButton({
                               id: 'custpage_btn_app_report',
                               label: 'Print Appraisal Report',
                               functionName: 'createAppraisalReport(' + context.newRecord.id + ')'
                           });
                    
                      if (STATUS_CONFIRMED == appStatus) {

                          var conButton = context.form.addButton({
                              id: 'custpage_btn_consignment',
                              label: 'Create Consignment',
                              functionName: 'createConsignment(' + context.newRecord.id + ')'
                          });
                          if (ConsignmentLink) {
                              log.debug('ConsignmentLink', ConsignmentLink);
                              var newButton = context.form.getButton({
                                  id: 'custpage_btn_consignment'
                              })
                              newButton.isDisabled = true;
                          }

                      }
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