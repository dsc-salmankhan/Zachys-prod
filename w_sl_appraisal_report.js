var ITEM_DIPLAY_NAME = '';
var FOLDER_ID = 5085481;
var arialFont = 'https://system.netsuite.com/core/media/media.nl?id=1067136&amp;c=3778702_SB2&amp;h=f1fb818bf870fd11342a&amp;_xt=.ttf';
var arialFontBold = 'https://system.netsuite.com/core/media/media.nl?id=1067137&amp;c=3778702_SB2&amp;h=f5dbfe4a94d6699d5ee3&amp;_xt=.ttf';
var LOW_ESTIMATE = 0;
var HIGH_ESTIMATE = 0;
var EVENT_HIGH_ESTIMATE = 0;
var EVENT_LOW_ESTIMATE = 0;
var SCREENER_HIGH_ESTIMATE = 0;
var SCREENER_LOW_ESTIMATE = 0;
var BOTTLE_COUNT_ARR = [];
var TOTAL_BOTTLE_SUM = 0;
var CURSOR_POSITION = 347;

function execute(request, response) {
    var title = 'execute';
    try {
        var recId = request.getParameter('apprecid');
        nlapiLogExecution('Debug', "recId ::" + title, recId);

        appraisalReportPdf(request, response, recId);
    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);

    }
}


function appraisalReportPdf(request, response, appRecId) {
    var title = "appraisalReportPdf";
    try {
        nlapiLogExecution('Debug', title + "================Starting==================");
        var logoCom = getCompanyInfo();
        var appraisalObj = getAppraisalRec(appRecId);
        nlapiLogExecution('Debug', 'appraisalObj.consignerName::', appraisalObj.consignerName);
        nlapiLogExecution('Debug', 'appraisalObj::', JSON.stringify(appraisalObj));
        var renderer = nlapiCreateTemplateRenderer();
        if (appraisalObj.consignerId) {
            var consignerRec = getConsignerRec(appraisalObj.consignerId);
            nlapiLogExecution('Debug', 'consignerRec::', JSON.stringify(consignerRec));
        }

        var template = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
        template += '<pdf>';
        template += "<head>";
        template += '<link name="arialFont" type="font" subtype="TrueType" src="' + arialFont + '" bytes="2"/>';
        template += '<link name="arialFontBold" type="font" subtype="TrueType" src="' + arialFontBold + '" bytes="2"/>';

        template += "<macrolist>";
        template += "<macro id='nlheader'>";
        template += "<table width='100%' height='14%'>";
        template += "<tr>";
        template += "<td width='34%'   align='left'> <img width='143px' height='50px' src='" + logoCom + "' alt='Logo'></img></td>";
        template += "<td width='33%' font-family='arialFontBold' align='center'  style='font-size:13pt'><p align='center'> Auction Proposal <br/> <span style='font-size:10pt'>for</span> <br/> ";
        if (appraisalObj.consignerId) {
            nlapiLogExecution('Debug', 'appraisalObj.consignerName:: 2', appraisalObj.consignerName);
            template += "<span align='center' font-family='arialFontBold' style='font-size:10pt'>" + appraisalObj.consignerName + "</span>";
        } else {
            template += "<span align='center' font-family='arialFontBold' style='font-size:10pt'> </span>";

        }
        template += "</p>";
        template += "</td>";

        if (appraisalObj.currencyId == 1) {
            nlapiLogExecution("Debug", "appraisalObj.currency if", appraisalObj.currencyId);
            template += "<td width='33%' font-family='arialFont'  align='right' style='font-size:8pt'> <p  align='right'> 39 Westmoreland Ave.<br/> White Plains NY 10606 <br/>Tel: (914)448-3026 <br/> Fax: (914)313-2350 <br/><span font-family='arialFontBold'>auction@zachys.com</span></p></td>";
        } else {
            nlapiLogExecution("Debug", "appraisalObj.currency else", appraisalObj.currencyId);
            template += "<td width='33%' font-family='arialFont'  align='right' style='font-size:8pt'> <p  align='right'> Unit A&B, 3/F, Tern Centre Tower II<br/> No 251 Queen's Road Central <br/>Hong Kong <br/> Office: 852.5803.8244 <br/> Fax: 852.3014.3838 <br/><span font-family='arialFontBold'>asia@zachys.com</span></p></td>";
        }
        template += "</tr>";
        template += "</table>";
        template += "<table width='100%' font-family='arialFont' height='2%'>";
        template += "<tr>";
        template += "<td>";
        template += "<hr width='100%' />";
        template += "</td>"
        template += "</tr>";
        template += "</table>";
        template += "<table width='100%' font-family='arialFont' padding='0px' >";
        template += "<tr>";

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var printDate = mm + '/' + dd + '/' + yyyy;

        nlapiLogExecution('Debug', "dd /mm / yyyy " + title, dd + ' ' + mm + ' ' + yyyy + ' ' + printDate);
        if (appraisalObj.consignerId && consignerRec) {
            template += "<td width='35%' align='left' style='line-height:145%;  font-size:8pt; margin-top:-10px;'>";
            template += "<p style='margin-top:5px;'>" + appraisalObj.consignerName + "<br/>";
            template += '#' + appraisalObj.conId + " <br/>";

            // if (consignerRec.addressee) {
            //     template += consignerRec.addressee;
            //     template += "<br/>";
            // } 
            template += consignerRec.addr1 ? consignerRec.addr1 + "<br/>" : '';
            template += consignerRec.city ? consignerRec.city + "<br/>" : '';
            template += consignerRec.zip ? consignerRec.zip + "<br/>" : '';
            template += consignerRec.country ? consignerRec.country + "<br/>" : '';
            template += consignerRec.phone ? consignerRec.phone + "<br/>" : '';
            var emailStr = "<span style='color:#0064bd; text-decoration: underline;'>" + consignerRec.email + "</span>";
            template += consignerRec.email ? emailStr : '';
            template += "</p>";
            template += "</td>";
        } else {
            template += "<td width='30%' align='left' style='font-size:8pt;margin-top:-10px;'><p>  <br/>   <br/>  <br/>  <br/>  <br/> </p></td>";
        }
        if (appraisalObj.appraisalId) {
            template += "<td width='40%' font-family='arialFont' align='left' style='margin-top:5px;font-size:8pt;margin-top:-10px;'><p><span font-family='arialFontBold'> Appraisal #: \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0</span>" + appraisalObj.appraisalId + " </p>";

        } else {
            template += "<td width='40%' font-family='arialFont' align='left' style='margin-top:5px;font-size:8pt;'><p><span font-family='arialFontBold' width='50%'> Consignment: \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0</span></p>";

        }
        template += "<p style='margin-top:5px;' align='left'> <span font-family='arialFontBold'> Print Date:\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0</span>" + printDate + "</p>";
        template += "<p style='margin-top:5px;' align='left'> <span font-family='arialFont'><span font-family='arialFontBold'>Currency:</span>\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0</span>" + appraisalObj.currency + "</p>";
        template += "</td>";
        template += "<td width='25%' align='right' style='font-size:8pt'>";
        template += "<table style='background-color: #ffffff; margin-top:-16px;padding-top:5px;border:1px solid black;border-top:0;padding-left: 15px;padding-right: 15px;padding-bottom: 15px;' width='100%' >";
        for (var s = 0; s < appraisalObj.tableDataValues.length; s++) {
            template += "<tr height='15px' style='mardin-top:-5px;'>";
            if (s > 2) {
                CURSOR_POSITION += 15;

            }
            nlapiLogExecution('Debug', 'HIGH_ESTIMATE :: LOW_ESTIMATE', HIGH_ESTIMATE + ' ' + LOW_ESTIMATE);
            nlapiLogExecution('Debug', 'EVENT_LOW_ESTIMATE :: EVENT_HIGH_ESTIMATE :: SCREENER_LOW_ESTIMATE :: SCREENER_HIGH_ESTIMATE', EVENT_LOW_ESTIMATE + ' ' + EVENT_HIGH_ESTIMATE + ' ' + SCREENER_LOW_ESTIMATE + ' ' + SCREENER_HIGH_ESTIMATE);

            if (s == 0) {
                var lowEstimate = LOW_ESTIMATE;
                template += "<td width='30%' align='left'  font-family='arialFont'><span font-family='arialFontBold'>Low Estimate:  </span>\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 <span style='font-weight:normal'>" + appraisalObj.currencySymbol + "</span></td>";
                template += "<td width='30%' align='left'>" + lowEstimate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " </td>";

            } else if (s == 1) {
                var highEstimate = HIGH_ESTIMATE;
                template += "<td width='30%' align='left' font-family='arialFont'><span font-family='arialFontBold'>High Estimate:</span>\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 <span style='font-weight:normal'>" + appraisalObj.currencySymbol + "</span></td>";
                template += "<td width='30%' align='left' >" + highEstimate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
            }
            // else if (s == 2) {
            //     template += "<td width='30%'>{{REPLACE_RESERVE}}</td>";
            //     template += "<td width='30%' >{{REPLACE_RESERVE_VALUE}}</td>";
            // } 
            else {
                template += "<td width='30%'></td>";
                template += "<td width='30%' ></td>";
            }
            var qtySumValue = appraisalObj.tableDataValues[s].quantitySum ? appraisalObj.tableDataValues[s].quantitySum : 0;
            if (qtySumValue != 0) {
                template += "<td align='right' width='20%'>" + qtySumValue + "</td>";

            } else {
                template += "<td align='right' width='20%'></td>";

            }

            if (appraisalObj.tableDataValues[s].bottleSize != "0") {
                template += "<td align='left' width='10%'>Bottles</td>";
                template += "<td align='left' width='10%' >" + appraisalObj.tableDataValues[s].bottleSize + "</td>";
            } else {
                template += "<td align='left' width='10%'></td>";
                template += "<td align='left' width='10%' ></td>";
            }

            template += "</tr>";
            // if (appraisalObj.tableDataValues.length == 2 && appraisalObj.tableDataValues.length == s + 1) {
            //     template += "<tr>";
            //     template += "<td width='30%' align='left' font-family='arialFont'>{{REPLACE_RESERVE}}</td>";
            //     template += "<td width='30%' align='left' >{{REPLACE_RESERVE_VALUE}}</td>";
            //     template += "<td align='right' width='20%'></td>";
            //     template += "<td align='left' width='10%'></td>";
            //     template += "<td align='left' width='10%' ></td>";
            //     template += "</tr>";
            // }

            TOTAL_BOTTLE_SUM += parseInt(qtySumValue);
        }
        if (appraisalObj.tableDataValues.length == 1) {
            template += "<tr>";
            nlapiLogExecution('Debug', 'HIGH_ESTIMATE :: LOW_ESTIMATE', HIGH_ESTIMATE + ' ' + LOW_ESTIMATE);

            var highEstimate = HIGH_ESTIMATE;
            template += "<td width='30%' align='left' font-family='arialFont'><span font-family='arialFontBold'>High Estimate:</span>\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 <span style='font-weight:normal !important;'>" + appraisalObj.currencySymbol + "</span></td>";
            template += "<td width='30%' align='left' >" + highEstimate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
            template += "<td align='right' width='20%'></td>";
            template += "<td align='left' width='10%'></td>";
            template += "<td align='left' width='10%' ></td>";
            template += "</tr>";


        }
        if (appraisalObj.totalReserve != 0) {
            var reserveName = "<span font-family='arialFontBold'>Reserve:</span> \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 <span style='font-weight:normal !important;'>" + appraisalObj.currencySymbol + "</span>";
            var totalReserve = appraisalObj.totalReserve ? (appraisalObj.totalReserve).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';

            nlapiLogExecution('debug', 'reserveName', reserveName)
            nlapiLogExecution('debug', 'totalReserve', totalReserve)
            // if (reserveName) {
            //     template = template.replace(/{{REPLACE_RESERVE}}/g, reserveName);

            // }

            // if (totalReserve) {
            //     template = template.replace(/{{REPLACE_RESERVE_VALUE}}/g, totalReserve);
            // }

        } else {
            TOTAL_BOTTLE_SUM = TOTAL_BOTTLE_SUM
        }


        template += "<tr height='15px'>";
        template += "<td width='30%'></td>";
        template += "<td width='30%' ></td>";
        template += "<td align='right' style='border-top: 1px solid black;' width='20%'>" + TOTAL_BOTTLE_SUM + "</td>";
        template += "<td align='left'  style='border-top: 1px solid black;' width='10%'>Total</td>";
        template += "<td align='right' style='border-top: 1px solid black;' width='10%'>Bottles</td>";
        template += "</tr>";
        template += "<tr>";
        //rows for Screener High/Low Estimate
        var screenerHighEstimate = SCREENER_HIGH_ESTIMATE.toFixed(2);
        template += "<td width='30%' align='left' font-family='arialFontBold' style='color:white;'>Screener\xa0High\xa0Estimate:</td>";
        template += "<td width='30%' align='left' style='color:white;' >" + screenerHighEstimate + "</td>";
        template += "</tr>";
        template += "<tr>";
        var screenerLowEstimate = SCREENER_LOW_ESTIMATE.toFixed(2);
        template += "<td width='30%' align='left' font-family='arialFontBold' style='color:white;'>Screener Low Estimate:</td>";
        template += "<td width='30%' align='left' style='color:white;' >" + screenerLowEstimate + "</td>";
        template += "</tr>";
        template += "</table>";
        template += "</td>";
        template += "</tr>";

        template += "</table>";
        template += " </macro>"
        template += " <macro id='nlfooter'>";
        template += "<table width='100%' margin-bottom= '5px'>";
        template += "<tr>";
        template += "<td font-family='arialFontBold'  style='font-size:10.5pt'>" + appraisalObj.appraisalId + "</td>";
        template += "<td font-family='arialFontBold'  style='font-size:10.5pt'>Page <pagenumber /> of <totalpages /></td>";
        template += "</tr>";

        template += "</table>";
        template += " </macro>"
        template += "</macrolist>";

        template += "</head>";
        template += "<body header='nlheader' header-height='" + CURSOR_POSITION + "px' footer='nlfooter' footer-height='20px'  height='11.69in' width='8.27in' padding='0.2in 0.2in 0.2in 0.2in'>";
        template += "<table width='100%' style='border:1px solid #595959;border-collapse: collapse; padding: 0px;top:-100px;'>";
        template += "<thead style='background-color:#595959'>";
        template += "<tr height='0.1in' style='background-color: #595959;'>";
        template += "<th font-family='arialFontBold' width='0.69in' align = 'center' style=' padding:2px;  color:white; font-size:8pt'>Qty</th>";
        template += "<th font-family='arialFontBold'  width='5.08in' align = 'left' style='padding:2px; color:white; font-size:8pt'>Description</th>";
        template += "<th font-family='arialFontBold'  width='1.25in' align = 'center' style='padding:2px; color:white; font-size:8pt'>Low Estimate</th>";
        template += "<th font-family='arialFontBold' width='1.25in'  align = 'center' style='padding:2px; color:white; font-size:8pt'>High Estimate</th>";
        // template += "<th font-family='arialFontBold' width='1in'  align = 'center' style='padding:2px; color:white; font-size:8pt'>Reserve</th>";
        template += "</tr>";
        template += "</thead>";
        template += "<tbody>";
        nlapiLogExecution("Debug", "appraisalObj", appraisalObj);
        for (var p = 0; p < appraisalObj.linesData.length; p++) {
            nlapiLogExecution('DEBUG', 'appraisalObj.linesData[p].tempAppClosed', appraisalObj.linesData[p].tempAppClosed)
            if (appraisalObj.linesData[p].tempAppClosed == 'F') {
                if (p % 2 == 0) {
                    template += "<tr style='background-color: #ffffff;border-top:1px solid #595959'>";
                } else {
                    template += "<tr style='background-color: #bfbfbf;border-top:1px solid #595959'>";
                }
                template += "<td font-family='arialFont'  width='0.69in' align = 'center' style='padding: 5px; font-size:8pt'>" + appraisalObj.linesData[p].appLineQty + "</td>";
                template += "<td font-family='arialFont'  width='5.08in' align = 'left' style='padding: 5px; font-size:8pt;border-left:1px solid #595959;'>" + appraisalObj.linesData[p].appLineDesc + "</td>";
                template += "<td font-family='arialFont'  width='1.25in' align = 'center' style='padding: 5px; font-size:8pt;border-left:1px solid #595959;'>" + (appraisalObj.linesData[p].appLineExtLowRound).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
                template += "<td font-family='arialFont'  width='1.25in' align = 'center' style='padding: 5px; font-size:8pt;border-left:1px solid #595959;'>" + (appraisalObj.linesData[p].appLineExtHighRound).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
                // template += "<td font-family='arialFont'  width='1in' align = 'right' style='padding: 5px; font-size:8pt;border-left:1px solid #595959;'>" + (appraisalObj.linesData[p].appLineReserve).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
                template += "</tr>";
            }

        }
        template += "</tbody>";
        template += "</table>";



        template += '</body>';
        template += '</pdf>';
        template = template.replace(/&amp;/g, "&");
        template = template.replace(/&/g, "&amp;");
        renderer.setTemplate(template); // Passes in raw string of template to be transformed by FreeMarker
        var xml = renderer.renderToString(); // Returns template content interpreted by FreeMarker as XML string that can be passed to the nlapiXMLToPDF function.
        var file = nlapiXMLToPDF(xml); // Produces PDF output.
        var fileName = 'appraisal' + '_report.pdf'
        //file.setName("SS Customer Price List.pdf");

        file.setName(fileName);
        // set content type, file name, and content-disposition (inline means display in browser)
        response.setContentType('PDF', fileName, 'inline');
        // write response to the client
        nlapiLogExecution('Debug', '', title + 'end');
        response.write(file.getValue());
        nlapiLogExecution('Debug', title + "================END==================");
    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
    }
}

function getAppraisalRec(recAppId) {
    var title = 'getAppraisalRec';
    try {
        nlapiLogExecution('Debug', "function " + title, "Start");
        var sizeMappingObj = getSizeMappingObj();
        var objAppraisal = {};
        var tableDataValues = [];
        var tempBottle = "";
        var tempQtySum = 0;
        var flag = false;
        var totalReserve = 0;

        appraisalRec = nlapiLoadRecord('customrecord_appraisal', recAppId);

        tempConsigner = appraisalRec.getFieldText('custrecord_app_consignor');
        splitConsigner = tempConsigner.split(' ');
        objAppraisal.conId = splitConsigner[0];
        objAppraisal.consignerName = '';
        for (var i = 1; i < splitConsigner.length; i++) {
            objAppraisal.consignerName += splitConsigner[i] + ' ';
        }
        nlapiLogExecution('Debug', 'appraisalObj.consignerName:: 3', objAppraisal.consignerName);
        objAppraisal.consignerId = appraisalRec.getFieldValue('custrecord_app_consignor');
        objAppraisal.consignment = appraisalRec.getFieldText('custrecord_appraisal_consignment');
        // objAppraisal.preparedBy = appraisalRec.getFieldText('owner');
        objAppraisal.currency = appraisalRec.getFieldText('custrecord_app_currency');
        var currencyId = appraisalRec.getFieldValue('custrecord_app_currency');
        var currencyRec = nlapiLoadRecord('currency', currencyId);
        var currencySymbol = currencyRec.getFieldValue('displaysymbol');
        objAppraisal.currencySymbol = currencySymbol;
        objAppraisal.currencyId = currencyId;


        objAppraisal.appraisalId = appraisalRec.getFieldValue('name');



        objAppraisal.linesData = [];

        var lineCount = appraisalRec.getLineItemCount('recmachcustrecord_applines_appraisal');
        nlapiLogExecution('Debug', "lineCount::" + lineCount);

        if (lineCount > 0) {
            for (var i = 1; i <= lineCount; i++) {
                var tempObj = {};

                var tempLowEst = parseInt(appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_ext_low', i));
                // tempObj.appLineExtLow = tempLowEst ? parseInt(tempLowEst) : '';

                var tempHighEst = parseInt(appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_ext_high', i));
                // tempObj.appLineExtHigh = tempHighEst ? parseInt(tempHighEst) : '';

                var tempBottleSize = appraisalRec.getLineItemText('recmachcustrecord_applines_appraisal', 'custrecord_applines_size', i);
                tempBottleSize = tempBottleSize ? tempBottleSize : "0";
                tempObj.appLineBottleSize = tempAppraisalQty;

                var tempAppraisalQty = parseInt(appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_quantity', i));
                tempAppraisalQty = tempAppraisalQty ? parseInt(tempAppraisalQty) : 0;
                tempObj.appLineQty = tempAppraisalQty;

                //for Event 
                var appLineEvent = appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_event', i);
                tempObj.appLineEvent = appLineEvent ? appLineEvent : '';

                //for Screener
                var appLineScreener = appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_screener', i);
                tempObj.appLineScreener = appLineScreener ? appLineScreener : '';

                var tempAppClosed = appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_closed', i);
                tempObj.tempAppClosed = tempAppClosed ? tempAppClosed : '';

                var tempAppSortOrder = appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_sort_order', i);
                tempObj.appSortOrder = tempAppSortOrder ? parseInt(tempAppSortOrder) : 0;

                var tempAppLineDesc = appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_description', i);
                tempObj.appLineDesc = tempAppLineDesc ? tempAppLineDesc : '';

                var tempAppLineVintage = appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_vintage', i);
                tempObj.appLineVintage = tempAppLineVintage ? parseInt(tempAppLineVintage) : 0;

                var tempAppLineBottleLow = appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_bottle_low', i);
                tempObj.appLineBottleLow = tempAppLineBottleLow ? parseInt(tempAppLineBottleLow) : '';

                var tempAppLineBottleHigh = appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_bottle_high', i);
                tempObj.appLineBottleHigh = tempAppLineBottleHigh ? parseInt(tempAppLineBottleHigh) : '';

                var tempAppLineCashLow = appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_low', i);
                tempObj.appLineCashLow = tempAppLineCashLow ? parseInt(tempAppLineCashLow) : '';

                var tempAppLineCashHigh = appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_case_high', i);
                tempObj.appLineCashHigh = tempAppLineCashHigh ? parseInt(tempAppLineCashHigh) : '';

                //Event Low Estimates
                if (tempAppLineBottleLow && appLineEvent) {
                    var tempEventLowEstimate = tempAppLineBottleLow * appLineEvent;
                    EVENT_LOW_ESTIMATE += tempEventLowEstimate ? parseInt(tempEventLowEstimate) : 0;
                }
                //Event High Estimates
                if (tempAppLineBottleHigh && appLineEvent) {
                    var tempEventHighEstimate = tempAppLineBottleHigh * appLineEvent;
                    EVENT_HIGH_ESTIMATE += tempEventHighEstimate ? parseInt(tempEventHighEstimate) : 0;
                }

                //Screener Low Estimates
                if (tempAppLineBottleLow && appLineScreener) {
                    var tempScreenerLowEstimate = tempAppLineBottleLow * appLineScreener;
                    SCREENER_LOW_ESTIMATE += tempScreenerLowEstimate ? parseInt(tempScreenerLowEstimate) : 0;
                }
                //Screener High Estimates
                if (tempAppLineBottleHigh && appLineScreener) {
                    var tempScreenerHighEstimate = tempAppLineBottleHigh * appLineScreener;
                    SCREENER_HIGH_ESTIMATE += tempScreenerHighEstimate ? parseInt(tempScreenerHighEstimate) : 0;
                }

                var tempAppLineExtLowRound = appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_ext_low_rounded', i);
                tempObj.appLineExtLowRound = tempAppLineExtLowRound ? parseInt(tempAppLineExtLowRound) : '';
                nlapiLogExecution("Debug", "tempAppLineExtLowRound", tempObj.appLineExtLowRound);

                var tempAppLineExtHighRound = appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_ext_high_rounded', i);
                tempObj.appLineExtHighRound = tempAppLineExtHighRound ? parseInt(tempAppLineExtHighRound) : '';

                var tempAppLineReserve = appraisalRec.getLineItemValue('recmachcustrecord_applines_appraisal', 'custrecord_applines_ext_high_reserve', i);
                tempObj.appLineReserve = tempAppLineReserve ? parseInt(tempAppLineReserve) : '';

                if (tempAppLineReserve) {
                    tempAppLineReserve = tempAppLineReserve ? parseFloat(tempAppLineReserve) : 0.00;
                    totalReserve = totalReserve + tempAppLineReserve;
                }
                objAppraisal.linesData.push(tempObj);

                LOW_ESTIMATE += tempAppLineExtLowRound ? parseInt(tempAppLineExtLowRound) : 0;
                HIGH_ESTIMATE += tempAppLineExtHighRound ? parseInt(tempAppLineExtHighRound) : 0;

                var sizeInLiters = sizeMappingObj[tempBottleSize];
                BOTTLE_COUNT_ARR.push({
                    bottleSize: tempBottleSize,
                    appQty: tempAppraisalQty,
                    sizeInLiters: sizeInLiters
                });
            }

        }

        objAppraisal.totalReserve = totalReserve;

        sortDataAscendingOrder(BOTTLE_COUNT_ARR, ['sizeInLiters']);
        nlapiLogExecution('Debug', "BOTTLE_COUNT_ARR " + title, JSON.stringify(BOTTLE_COUNT_ARR));
        BOTTLE_COUNT_ARR.reduce(function (r, o) {
            if (r[o.bottleSize]) {
                tempBottle = o.bottleSize;
                tempQtySum += parseInt(o.appQty);

            } else {
                if (flag) {
                    tableDataValues.push({
                        bottleSize: tempBottle,
                        quantitySum: tempQtySum
                    });
                    tempBottle = o.bottleSize;
                    tempQtySum = 0 + parseInt(o.appQty);
                    r[o.bottleSize] = true;

                } else {
                    flag = true;
                    tempBottle = o.bottleSize;
                    tempQtySum += parseInt(o.appQty);
                    r[o.bottleSize] = true

                }
            }
            return r;
        }, {});
        nlapiLogExecution('debug', 'tempBottle : ', tempBottle + ' : ' + tempQtySum);
        tableDataValues.push({
            bottleSize: tempBottle,
            quantitySum: tempQtySum

        });

        if (tableDataValues[0].bottleSize == "0") {
            var tempIndexValue = tableDataValues[0];
            tableDataValues.splice(0, 1);
            tableDataValues.push(tempIndexValue);
        }

        objAppraisal.tableDataValues = tableDataValues;
        sortDataAscendingOrder(objAppraisal.linesData, ['appSortOrder', 'appLineDesc', 'appLineVintage'])
        nlapiLogExecution('Debug', "objAppraisal.tableDataValues  " + title, JSON.stringify(objAppraisal.tableDataValues));
        nlapiLogExecution('Debug', "function " + title, "End");
        return objAppraisal;
    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
    }


}

function getCompanyInfo() {
    var title = 'getCompanyInfo';
    try {
        var companyInfo = nlapiLoadConfiguration('companyinformation');
        var comapnyLogoId = companyInfo.getFieldValue('formlogo');
        nlapiLogExecution('Debug', title + 'comapnyLogoId :: ', comapnyLogoId);
        var fileObj = nlapiLoadFile(comapnyLogoId);

        nlapiLogExecution('Debug', title + 'fileObj :: ', fileObj);
        var logoUrl = fileObj.getURL();
        var companyLogoUrl = logoUrl;
        companyLogoUrl = companyLogoUrl.replace(/&/g, '&amp;');
        nlapiLogExecution('Debug', title + 'companyLogoUrl :: ', companyLogoUrl);
        return companyLogoUrl;
    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
    }

}

function sortDataAscendingOrder(appraisalRecArr, sortArr) {
    appraisalRecArr.sort(fieldSorter(sortArr));

    function fieldSorter(fields) {
        return function (a, b) {
            return fields.map(function (o) {
                var dir = 1;
                if (o[0] === '-') {
                    dir = -1;
                    o = o.substring(1);
                }
                if (a[o] > b[o]) return dir;
                if (a[o] < b[o]) return -(dir);
                return 0;
            }).reduce(function firstNonZeroValue(p, n) {
                return p ? p : n;
            }, 0);
        };
    }
}



function getConsignerRec(consignerId) {
    var title = 'getConsignerRec';
    try {
        var conObj = {};
        var conRecFields = nlapiLoadRecord('customer', consignerId)
        var email = conRecFields.getFieldValue('email');
        conObj.email = email ? email : "";
        var phone = conRecFields.getFieldValue('phone');
        conObj.phone = phone ? phone : "";
        var consignerEntity = conRecFields.getFieldValue('entityid');
        conObj.splitConEntity = consignerEntity.split(' ');
        // conObj.glommedname =  conRecFields.getFieldText('glommedname');
        var numberOfAddresses = conRecFields.getLineItemCount('addressbook');

        nlapiLogExecution('DEBUG', 'conObj.splitConEntity[1]', conObj.splitConEntity[1] + ' ' + conObj.splitConEntity[2]);

        for (var i = 1; i <= numberOfAddresses; i++) {
            conRecFields.selectLineItem('addressbook', i);

            var addressID = conRecFields.getCurrentLineItemValue('addressbook', 'internalid'),
                addressLabel = conRecFields.getCurrentLineItemValue('addressbook', 'label');
            conObj.shipToAddress = conRecFields.getCurrentLineItemValue('addressbook', 'addrtext').replace(/<br\s*\/?>/mg, "\n");
            conObj.addressee = conRecFields.getCurrentLineItemValue('addressbook', 'addressee');
            conObj.addr1 = conRecFields.getCurrentLineItemValue('addressbook', 'addr1');
            conObj.city = conRecFields.getCurrentLineItemValue('addressbook', 'city');
            conObj.dropdownstate = conRecFields.getCurrentLineItemText('addressbook', 'dropdownstate');
            conObj.zip = conRecFields.getCurrentLineItemValue('addressbook', 'zip');
            conObj.country = conRecFields.getCurrentLineItemValue('addressbook', 'country');

            nlapiLogExecution('DEBUG', 'addressID/Label', JSON.stringify(conObj) + '/' + conObj.splitConEntity[1] + '/' + conObj.splitConEntity[0] + '/' + addressID + '/' + addressLabel + '/' + conObj.shipToAddress);
        }
        return conObj;

    } catch (e) {

        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
    }

}

function isNullOrEmpty(valueStr) {
    return (valueStr == null || valueStr == "" || valueStr == undefined);
}

function getSizeMappingObj() {
    var sizeMappingObj = {};
    var filters = new Array();
    filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));

    var columns = [];
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('custrecord_size_in_liter');

    var result = nlapiSearchRecord('customrecord_size_list', null, filters, columns);
    for (i = 0; i < result.length; i++) {
        var sizeName = result[i].getValue(columns[0]);
        var sizeInLiters = result[i].getValue(columns[1]) || 0;

        if (sizeName && sizeInLiters) {
            sizeMappingObj[sizeName] = parseFloat(sizeInLiters);
        }

    }

    return sizeMappingObj;
}