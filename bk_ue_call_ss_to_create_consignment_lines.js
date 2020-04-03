  /**
   * @NApiVersion 2.x
   * @NScriptType UserEventScript
   */
  define(['N/url', 'N/https', 'N/task'],
      function (url, https, task) {

          function afterSubmit(context) {
              var title = 'afterSubmit';
              try {
                  if (context.type == context.UserEventType.CREATE) {
                      var newRec = context.newRecord;
                      var conRecordId = newRec.id;
                      var appraisalId = newRec.getValue({
                          fieldId: 'custrecord_consignment_appraisal'
                      });
                      log.debug("conRecordId : appraisalId", conRecordId + ' : ' + appraisalId);

                      var schedTask = task.create({
                          taskType: task.TaskType.SCHEDULED_SCRIPT
                      });
                      schedTask.scriptId = 'customscript_w_ss_create_cnsignmnt_lines';
                      schedTask.deploymentId = 'customdeploy_w_ss_create_cnsignmnt_lines'

                      schedTask.params = {
                          custscript_consignmentid: conRecordId,
                          custscript_appraisalid: appraisalId
                      };

                      schedTask.submit();


                  }
                  return true;
              } catch (e) {
                  log.debug('Error', e);
                  log.error("ERROR IN:: " + title, e.message);

              }

          }

          return {
              afterSubmit: afterSubmit
          };
      });