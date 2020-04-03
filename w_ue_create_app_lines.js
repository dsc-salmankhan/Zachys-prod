/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
var STATUS_PRICED = '20' //Priced
define([], function () {
	function beforeLoad(context) {
		var title = 'beforeLoad';
		try {
			context.form.clientScriptFileId = 134335;

			if (context.type !== context.UserEventType.CREATE) {

				var appraisalRec = context.newRecord;
				var consignment = appraisalRec.getValue('custrecord_appraisal_consignment');
				var appStatus = appraisalRec.getValue({
					fieldId: 'custrecord_appraisal_status'
				});

					if (!consignment) {
						var createAppLines = context.form.addButton({
							id: 'custpage_btn_create_app_lines',
							label: 'Manage Appraisal Lines',
							functionName: 'createAppraisalLines(' +
								context.newRecord.id + ')'
						});
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