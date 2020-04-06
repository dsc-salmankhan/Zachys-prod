//* Version   Date            Author          Change/Issue#	    Remarks  						
//* 1.00      12/4/2019       Dev1 	                           Initial Version
//* 1.02      2/4/2020        Dev1 	         ZAC-129           Additional UAT Feedback
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
var EXCLUDE_SUM = ['3', '5'];
var EXCLUDE_ITEM_TYPE = ['2', '7'];
var EVENT_ID = 3;
var SCREENER_ID = 5;

function execute(request, response) {
    var title = 'execute';
    try {
        var recId = request.getParameter('recid');
        nlapiLogExecution('Debug', "recId ::" + title, recId);

        consignmentReportPdf(request, response, recId);
    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);

    }
}

function consignmentReportPdf(request, response, conRecId) {
    var title = "consignmentReportPdf";
    try {
        nlapiLogExecution('Debug', title + "================Starting==================");
        var consignmentLoadedRec = nlapiLoadRecord('customrecord_consignment', conRecId);
        var reservePercent = consignmentLoadedRec.getFieldValue('custrecord_consignment_reserve');
        var consignmentCurrency = consignmentLoadedRec.getFieldValue("custrecord_consignment_currency");
        var consignmentCurrencyText = consignmentLoadedRec.getFieldText("custrecord_consignment_currency");
        if (consignmentCurrency != null) {
            var currencyRec = nlapiLoadRecord("currency", consignmentCurrency);
            var currencySymbol = currencyRec.getFieldValue("displaysymbol");
        } else {
            var currencySymbol = "";
        }
        var ProposedlowEstimateAmount = consignmentLoadedRec.getFieldText('custrecord_consignment_app_low_est');
        reservePercent = JSON.stringify(reservePercent);
        if (reservePercent != null) {
            reservePercent = reservePercent.split('%');
            reservePercent = parseFloat(reservePercent[0]);
            var reserveQty = 1;
            var reserveAmount = reservePercent * parseFloat(ProposedlowEstimateAmount) / 100;

        } else {
            var reserveAmount = 0;
        }


        var logoCom = getCompanyInfo();
        var consignmentObj = getConsignmentRec(conRecId);
        var renderer = nlapiCreateTemplateRenderer();
        if (consignmentObj.consignerId) {
            var consignerRec = getConsignerRec(consignmentObj.consignerId);
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
        template += "<td width='33%' font-family='arialFontBold' align='center'  style='font-size:13pt'><p align='center'> Consignment Report <br/><span style='font-size:10pt'> for </span><br/> ";
        if (consignmentObj.consignerId) {
            template += "<span align='center' font-family='arialFontBold' style='font-size:10pt'>" + consignmentObj.consignerName + "</span>";
        } else {
            template += "<span align='center' font-family='arialFont' style='font-size:10pt'> </span>";

        }
        template += "</p>";
        template += "</td>";
        template += "<td width='33%' font-family='arialFont'  align='right' style='font-size:8pt'> 39 Westmoreland Ave.<br/> White Plains NY 10606 <br/>Tel: (914)448-3026 <br/> Fax: (914)313-2350 <br/><span font-family='arialFontBold'>Auction@zachys.com</span></td>";
        template += "</tr>";
        template += "</table>";
        template += "<table width='100%' font-family='arialFont' height='2%'>";
        template += "<tr>";
        template += "<td>";
        template += "<hr width='100%' />";
        template += "</td>"
        template += "</tr>";
        template += "</table>";
        template += " </macro>"
        template += " <macro id='nlfooter'>";
        template += "<table width='100%' margin-bottom= '5px'>";
        template += "<tr>";
        template += "<td font-family='arialFontBold'  style='font-size:10.5pt'>" + consignmentObj.consignmentId + "</td>";
        template += "<td font-family='arialFontBold'  style='font-size:10.5pt'>Page <pagenumber /> of <totalpages /></td>";
        template += "</tr>";

        template += "</table>";
        template += " </macro>"
        template += "</macrolist>";

        template += "</head>";
        template += "<body header='nlheader' header-height='8.8%' footer='nlfooter' footer-height='20px'  height='11.69in' width='8.27in' padding='0.2in 0.2in 0.2in 0.2in'>";
        template += "<table width='100%' font-family='arialFont' padding='0px' >";
        template += "<tr>";

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var printDate = mm + '/' + dd + '/' + yyyy;

        if (consignmentObj.consignerId && consignerRec) {

            template += "<td width='40%' align='left' style='font-size:8pt; margin-top:-10px;'>";
            template += "<p style='margin-top:0px;margin-bottom:5px;'>" + consignmentObj.consignerName + "</p>";
            template += "<p style='margin-top:0px;margin-bottom:5px;'>" + "#" + consignmentObj.conId + " </p>";
            //     if (consignerRec.addressee) {
            //     template += consignerRec.addressee;
            // } else {
            //     template += " ";
            // }
            if (consignerRec.addr1) {
                template += "<p style='margin-top:0px;margin-bottom:5px;'>" + consignerRec.addr1 + "</p>";
            } else {
                template += " ";
            }
            if (consignerRec.city) {
                template += "<p style='margin-top:0px;margin-bottom:5px;'>" + consignerRec.city + " , " + consignerRec.zip + "</p>";
            } else {
                template += " ";
            }
            // if (consignerRec.zip) {
            //     template += "<p style='margin-top:0px;'>" + consignerRec.zip + "</p>";
            // } else {
            //     template += " ";
            // }
            if (consignerRec.country) {
                template += "<p style='margin-top:0px;margin-bottom:5px;'>" + consignerRec.country + "</p>";
            } else {
                template += " ";
            }
            if (consignerRec.phone) {
                template += "<p style='margin-top:0px;margin-bottom:5px;'>" + consignerRec.phone + "</p>";

            } else {
                template += "<p style='margin-top:0px;margin-bottom:5px;'></p>";
            }
            if (consignerRec.email) {
                template += "<p style='margin-top:0px;margin-bottom:5px;color:#0064bd; text-decoration: underline;'>" + consignerRec.email + "</p> ";

            } else {
                template += "<p style='margin-top:0px;margin-bottom:5px;color:#0064bd; text-decoration: underline;'></p> ";
            }

            // template += consignerRec.addressee +"<br/>"+consignerRec.addr1 +"<br/>"+consignerRec.city +" "+consignerRec.zip +"<br/>"+consignerRec.country;
            template += "</td>";
        } else {
            template += "<td width='30%' align='left' style='font-size:8pt;margin-top:-10px;'><p>  <br/>   <br/>  <br/>  <br/>  <br/> </p></td>";
        }
        if (consignmentObj.appraisal) {
            template += "<td width='40%' font-family='arialFont' align='left' style='font-size:8pt;margin-top:-10px;'><p style='margin-top:0px;margin-bottom:5px;'><span font-family='arialFontBold'> Appraisal # \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0</span>" + consignmentObj.appraisal + " </p>";

        } else {
            template += "<td width='40%' font-family='arialFont' align='left' style='margin-top:0px;font-size:8pt;'><p style='margin-top:0px;margin-bottom:5px;'><span font-family='arialFontBold' width='50%'> Appraisal \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0</span></p>";

        }
        if (consignmentObj.consignmentId) {
            template += "<p style='margin-top:0px;margin-bottom:5px;' align='left'> <span font-family='arialFontBold'> Consignment # \xa0\xa0\xa0\xa0\xa0</span>" + consignmentObj.consignmentId + " </p>";
        } else {
            template += "<p style='margin-top:0px;margin-bottom:5px;' align='left'> <span font-family='arialFontBold'> Consignment # \xa0\xa0\xa0\xa0\xa0\xa0\xa0</span></p>";

        }
        template += "<p style='margin-top:0px;margin-bottom:5px;' align='left'> <span font-family='arialFontBold'>Print Date\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0</span>" + printDate + "</p>";
        template += "<p style='margin-top:0px;margin-bottom:5px;' align='left'> <span font-family='arialFontBold'>Currency\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0</span>" + consignmentCurrencyText + "</p>";
        template += "</td>";
        template += "<td width='30%' align='right' style='font-size:8pt'>";
        template += "<table style='background-color: #ffffff; margin-top:-16px;padding-top:5px;border:1px solid black;border-top:0;padding-left: 15px;padding-right: 15px;padding-bottom: 15px;' width='100%' >";
        for (var s = 0; s < consignmentObj.tableDataValues.length; s++) {
            template += "<tr height='15px' style='mardin-top:-5px;'>";
            if (s > 2) {
                CURSOR_POSITION += 20;

            }
            if (s == 0) {
                var lowEstimate = LOW_ESTIMATE.toFixed(0);
                template += "<td width='30%' align='left'  font-family='arialFont'><span font-family='arialFontBold'>Low Estimate:  </span>\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 <span style='font-weight:normal'>" + currencySymbol + "</span></td>";
                template += "<td width='30%' align='left'>" + lowEstimate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " </td>";

            } else if (s == 1) {
                var highEstimate = HIGH_ESTIMATE.toFixed(0);
                template += "<td width='30%' align='left' font-family='arialFont'><span font-family='arialFontBold'>High Estimate:</span>\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 <span style='font-weight:normal'>" + currencySymbol + "</span></td>";
                template += "<td width='30%' align='left' >" + highEstimate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
            } else if (s == 2 && consignmentObj.totalReserve != 0) {
                template += "<td width='30%' align='left' font-family='arialFont'><span font-family='arialFontBold'>Reserve:</span> \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 <span style='font-weight:normal !important;'>" + currencySymbol + "</span></td>";
                template += "<td width='30%' >" + consignmentObj.totalReserve.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
            } else {
                template += "<td width='30%'></td>";
                template += "<td width='30%' ></td>";
            }
            var qtySumValue = consignmentObj.tableDataValues[s].quantitySum ? consignmentObj.tableDataValues[s].quantitySum : 0;

            if (qtySumValue != 0) {
                template += "<td align='right' width='20%'>" + qtySumValue + "</td>";

            } else {
                template += "<td align='right' width='20%'></td>";

            }
            if (consignmentObj.tableDataValues[s].bottleSize != "0") {
                template += "<td align='left' width='10%'>Btls</td>";
                template += "<td align='left' width='10%' >" + consignmentObj.tableDataValues[s].bottleSizeText + "</td>";
            } else {
                template += "<td align='left' width='10%'></td>";
                template += "<td align='left' width='10%' ></td>";

            }
            template += "</tr>";
            TOTAL_BOTTLE_SUM += parseFloat(qtySumValue);
        }
        if (consignmentObj.tableDataValues.length == 1) {
            template += "<tr>";

            var highEstimate = HIGH_ESTIMATE.toFixed(2);
            template += "<td width='30%' align='left' font-family='arialFont'><span font-family='arialFontBold'>High Estimate:</span>\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 <span style='font-weight:normal !important;'>" + currencySymbol + "</span></td>";
            template += "<td width='30%' align='left' >" + highEstimate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
            template += "<td align='right' width='20%'></td>";
            template += "<td align='left' width='10%'></td>";
            template += "<td align='left' width='10%' ></td>";
            template += "</tr>";
        }
        nlapiLogExecution('debug', "consignmentObj.tableDataValues.length", consignmentObj.tableDataValues.length)
        if ((consignmentObj.tableDataValues.length == 1 || consignmentObj.tableDataValues.length == 2) && consignmentObj.totalReserve != 0) {
            nlapiLogExecution('debug', "Hello", 'yes got here')
            template += "<tr>";
            template += "<td width='30%' align='left' font-family='arialFont'><span font-family='arialFontBold'>Reserve:</span> \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 <span style='font-weight:normal !important;'>" + currencySymbol + "</span></td>";
            template += "<td width='30%' align='left' >" + consignmentObj.totalReserve.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
            template += "<td align='right' width='20%'></td>";
            template += "<td align='left' width='10%'></td>";
            template += "<td align='left' width='10%' ></td>";
            template += "</tr>";
        }

        if (consignmentObj.totalReserve && consignmentObj.totalReserve != 0) {
            TOTAL_BOTTLE_SUM = TOTAL_BOTTLE_SUM;
        } else {
            template = template.replace(/{{REPLACE_RESERVE_VALUE}}/g, '');
            TOTAL_BOTTLE_SUM = TOTAL_BOTTLE_SUM;
        }


        template += "<tr height='15px'>";
        template += "<td width='30%'></td>";
        template += "<td width='30%' ></td>";
        template += "<td align='right' style='border-top: 1px solid black;font-family:arialFontBold;' width='20%'>" + TOTAL_BOTTLE_SUM + "</td>";
        template += "<td align='left'  style='border-top: 1px solid black;font-family:arialFontBold;' width='10%'>Total</td>";
        template += "<td align='right' style='border-top: 1px solid black;font-family:arialFontBold;' width='10%'>Bottles</td>";
        template += "</tr>";

        template += "<tr>";
        //rows for Screener High/Low Estimate
        template += "<td width='30%' align='left' font-family='arialFontBold' style='color:white;'>Screener\xa0High\xa0Estimate:</td>";
        template += "<td width='30%' align='left' >\xa0</td>";
        template += "</tr>";
        template += "</table>";
        template += "</td>";
        template += "</tr>";
        template += "</table>";
        template += "<table width='100%' style='border:1px solid #595959;border-collapse: collapse; padding: 0px;margin-top:30px;'>";
        template += "<thead style='background-color:#595959'>";
        template += "<tr height='0.1in' style='background-color: #595959;'>";
        template += "<th font-family='arialFontBold' width='0.49in' align = 'center' style=' padding:2px;  color:white; font-size:8pt'>Qty</th>";
        template += "<th font-family='arialFontBold'  width='4.78in' align = 'left' style='padding:2px; color:white; font-size:8pt'>Description</th>";
        template += "<th font-family='arialFontBold'  width='1in' align = 'center' style='padding:2px; color:white; font-size:8pt'>Low Estimate</th>";
        template += "<th font-family='arialFontBold' width='1in'  align = 'center' style='padding:2px; color:white; font-size:8pt'>High Estimate</th>";
        template += "<th font-family='arialFontBold' width='1in'  align = 'center' style='padding:2px; color:white; font-size:8pt'>Reserve</th>";
        template += "</tr>";
        template += "</thead>";
        template += "<tbody>";

        var backGroundColorCount = 0;
        for (var p = 0; p < consignmentObj.linesData.length; p++) {
            //Change ZAC-129
            if (consignmentObj.linesData[p].conLineType != EVENT_ID && consignmentObj.linesData[p].conLineType != SCREENER_ID && consignmentObj.linesData[p].conLineQty != 0) {
                if (backGroundColorCount % 2 == 0) {
                    template += "<tr style='background-color: #ffffff;border-top:1px solid #595959'>";
                } else {
                    template += "<tr style='background-color: #bfbfbf;border-top:1px solid #595959'>";
                }
                template += "<td font-family='arialFont'  width='0.49in' align = 'center' style='padding: 5px; font-size:8pt'>" + consignmentObj.linesData[p].conLineQty + "</td>";
                template += "<td font-family='arialFont'  width='4.78in' align = 'left' style='padding: 5px; font-size:8pt;border-left:1px solid #595959;'>" + consignmentObj.linesData[p].conLineDesc + "</td>";
                template += "<td font-family='arialFont'  width='1in' align = 'right' style='padding: 5px; font-size:8pt;border-left:1px solid #595959;'>" + (consignmentObj.linesData[p].conLineExtLow).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
                template += "<td font-family='arialFont'  width='1in' align = 'right' style='padding: 5px; font-size:8pt;border-left:1px solid #595959;'>" + (consignmentObj.linesData[p].conLineExtHigh).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
                template += "<td font-family='arialFont'  width='1in' align = 'right' style='padding: 5px; font-size:8pt;border-left:1px solid #595959;'>" + (consignmentObj.linesData[p].conLineReserve).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
                template += "</tr>";

                backGroundColorCount++;
            }
            //Change-End ZAC-129
        }
        template += "</tbody>";
        template += "</table>";

        // template += "<table width='100%' style='padding: 0px; margin-top:0px'>";
        // template += "<tr>";
        // template += "<td font-family='arialFontBold'  width='100%' align = 'left' style='padding: 5px; font-size:8pt'>Events and Screener's</td>";
        // template += "</tr>";
        // template += "</table>";
        template += "<p font-family='arialFontBold' align='center' style='background-color: #404040;color:white;width:100%;display:block;margin-top:30px;margin-bottom:0;font-size:8.5pt;padding:2px;'>SCREENER AND EVENT BOTTLES</p>";
        template += "<table width='100%' style='border:1px solid #595959;border-collapse: collapse; padding: 0px; margin-top:0px'>";
        template += "<tr height='0.1in' style='background-color: #595959;'>";
        template += "<th font-family='arialFontBold' width='0.90in' align = 'center' style='padding:2px;color:white;font-size:8pt'>Qty</th>";
        template += "<th font-family='arialFontBold' width='4.90in' align = 'left' style='padding:2px;color:white;font-size:8pt'>Description</th>";
        template += "<th font-family='arialFontBold' width='1.1in' align = 'center' style='padding:2px;color:white;font-size:8pt'>Bt Low Estimate</th>";
        template += "<th font-family='arialFontBold' width='1.1in'  align = 'center' style='padding:2px;color:white;font-size:8pt'>Type</th>";
        //Change ZAC-129
        // template += "<th font-family='arialFontBold' width='1in'  align = 'center' style='padding:2px;color:white;font-size:8pt'>\xa0</th>";
        //Change-End ZAC-129
        template += "</tr>";

        var backGroundColorCount = 0;
        for (var l = 0; l < consignmentObj.linesData.length; l++) {
            if (consignmentObj.linesData[l].conLineQty != 0 && (consignmentObj.linesData[l].conLineType == EVENT_ID || consignmentObj.linesData[l].conLineType == SCREENER_ID)) {
                if (backGroundColorCount % 2 == 0) {
                    template += "<tr style='background-color: #ffffff;border-top:1px solid #595959'>";
                } else {
                    template += "<tr style='background-color: #bfbfbf;border-top:1px solid #595959'>";
                }
                // template += "<tr>"

                // Check for Zain Ch (Start)

                // Check for Zain Ch (End)

                template += "<td font-family='arialFont'  width='0.90in' align = 'center' style='padding: 5px; font-size:8pt'>" + consignmentObj.linesData[l].conLineQty + "</td>";
                template += "<td font-family='arialFont'  width='4.90in' align = 'left' style='padding: 5px; font-size:8pt;border-left:1px solid #595959;'>" + consignmentObj.linesData[l].conLineDesc + "</td>";
                template += "<td font-family='arialFont'  width='1.1in' align = 'right' style='padding: 5px; font-size:8pt;border-left:1px solid #595959;'>" + (consignmentObj.linesData[l].conLineBottleLow).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>";
                //Change ZAC-129
                // template += "<td font-family='arialFont'  width='1in' align = 'right' style='padding: 5px; font-size:8pt;border-left:1px solid #595959;'>" + consignmentObj.linesData[l].conLineExtLow + "</td>";
                //Change-End ZAC-129
                if (consignmentObj.linesData[l].conLineType == EVENT_ID) {
                    template += "<td font-family='arialFont'  width='1.1in' align = 'left' style='padding: 5px; font-size:8pt;border-left:1px solid #595959;'>Event</td>";
                } else if (consignmentObj.linesData[l].conLineType == SCREENER_ID) {
                    template += "<td font-family='arialFont'  width='1.1in' align = 'left' style='padding: 5px; font-size:8pt;border-left:1px solid #595959;'>Screener</td>";
                }
                //Change ZAC-129
                // template += "<td font-family='arialFont'  width='1in' align = 'right' style='padding: 5px; font-size:8pt;border-left:1px solid #595959;'>\xa0</td>";
                //Change-End ZAC-129
                template += "</tr>";
                backGroundColorCount++;
            }
        }

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
        response.write(file.getValue());
        nlapiLogExecution('Debug', title + "================END==================");
    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
    }
}

function getCompanyInfo() {
    var title = 'getCompanyInfo';
    try {
        var companyInfo = nlapiLoadConfiguration('companyinformation');
        var comapnyLogoId = companyInfo.getFieldValue('formlogo');
        var fileObj = nlapiLoadFile(comapnyLogoId);

        var logoUrl = fileObj.getURL();
        var companyLogoUrl = logoUrl;
        companyLogoUrl = companyLogoUrl.replace(/&/g, '&amp;');
        return companyLogoUrl;
    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
    }

}

function getConsignmentRec(recConId) {
    var title = 'getConsignmentRec';
    try {
        nlapiLogExecution('Debug', "function " + title, "Start");
        var sizeMappingObj = getSizeMappingObj();
        var objConsignment = {};
        var tableDataValues = [];
        var tempBottle = "";
        var tempBottleText = "";
        var tempQtySum = 0;
        var flag = false;
        var totalReserve = 0;

        consignmentRec = nlapiLoadRecord('customrecord_consignment', recConId);
        tempConsigner = consignmentRec.getFieldText('custrecord_consignment_consignor');
        splitConsigner = tempConsigner.split(' ');
        objConsignment.conId = splitConsigner[0];
        objConsignment.consignerName = '';
        for (var i = 1; i < splitConsigner.length; i++) {
            objConsignment.consignerName += splitConsigner[i] + ' ';
        }
        objConsignment.consignmentId = consignmentRec.getFieldValue('name');
        objConsignment.consignerId = consignmentRec.getFieldValue('custrecord_consignment_consignor');
        objConsignment.appraisal = consignmentRec.getFieldText('custrecord_consignment_appraisal');

        objConsignment.linesData = [];

        var lineCount = consignmentRec.getLineItemCount('recmachcustrecord_cl_consignment');

        if (lineCount > 0) {
            for (var i = 1; i <= lineCount; i++) {
                var tempObj = {};
                var tempConLineType = consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl_type', i);
                tempObj.conLineType = tempConLineType ? parseFloat(tempConLineType) : '';

                if (EXCLUDE_ITEM_TYPE.indexOf(tempConLineType) != -1) {
                    continue;
                }

                //Change ZAC-129
                var tempLowEst = parseFloat(consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl_ext_low_rounded', i));
                tempObj.conLineExtLow = tempLowEst ? Math.round(tempLowEst) : 0;

                var tempHighEst = parseFloat(consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl__ext_high_rounded', i));
                tempObj.conLineExtHigh = tempHighEst ? Math.round(tempHighEst) : 0;
                //Change-End ZAC-129

                // var tempLowEstRound = parseFloat(consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl_ext_low_rounded', i));
                // tempObj.conLineExtLow = tempLowEstRound ? parseFloat(tempLowEstRound) : '';

                // var tempHighEstRound = parseFloat(consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl__ext_high_rounded', i));
                // tempObj.conLineExtHigh = tempHighEstRound ? parseFloat(tempHighEstRound) : '';

                var tempReserve = parseFloat(consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl_reserve', i));
                tempObj.conLineReserve = tempReserve ? parseFloat(tempReserve) : 0;



                var tempBottleSize = consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl_size', i);
                tempBottleSize = tempBottleSize ? tempBottleSize : "0";

                var bottleSizeText = consignmentRec.getLineItemText('recmachcustrecord_cl_consignment', 'custrecord_cl_size', i) || "";

                var tempConRecivedQty = consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl_qty_received', i);

                tempObj.conLineQty = tempConRecivedQty ? tempConRecivedQty : 0;

                //for Event 
                var conLineEvent = consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl_event', i);
                tempObj.conLineEvent = conLineEvent ? conLineEvent : '';

                //for Screener
                var conLineScreener = consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl_screener', i);
                tempObj.conLineScreener = conLineScreener ? conLineScreener : '';

                var conLineSortOrder = consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl_sort_order', i);
                tempObj.conLineSortOrder = conLineSortOrder ? parseInt(conLineSortOrder) : 0;

                var tempConLineDesc = consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl_item_description', i);
                tempObj.conLineDesc = tempConLineDesc ? tempConLineDesc : '';

                var conLineVintage = consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl_vintage', i);
                tempObj.conLineVintage = conLineVintage ? parseInt(conLineVintage) : 0;


                //Change ZAC-129
                var tempConLineBottleLow = consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl_ext_low_rounded', i);
                tempObj.conLineBottleLow = tempConLineBottleLow ? Math.round(tempConLineBottleLow) : 0;

                var tempConLineBottleHigh = consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_cl__ext_high_rounded', i);
                tempObj.conLineBottleHigh = tempConLineBottleHigh ? Math.round(tempConLineBottleHigh) : 0;
                //Change-End ZAC-129

                // var tempAppLineCashLow = consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_applines_case_low', i);
                // tempObj.appLineCashLow = tempAppLineCashLow ? parseFloat(tempAppLineCashLow) : '';

                // var tempAppLineCashHigh = consignmentRec.getLineItemValue('recmachcustrecord_cl_consignment', 'custrecord_applines_case_high', i);
                // tempObj.appLineCashHigh = tempAppLineCashHigh ? parseFloat(tempAppLineCashHigh) : '';

                //Event Low Estimates
                if (tempConLineBottleLow && conLineEvent) {
                    var tempEventLowEstimate = tempConLineBottleLow * conLineEvent;
                    EVENT_LOW_ESTIMATE += tempEventLowEstimate ? parseInt(tempEventLowEstimate) : 0;
                }
                //Event High Estimates
                if (tempConLineBottleHigh && conLineEvent) {
                    var tempEventHighEstimate = tempConLineBottleHigh * conLineEvent;
                    EVENT_HIGH_ESTIMATE += tempEventHighEstimate ? parseInt(tempEventHighEstimate) : 0;
                }

                //Screener Low Estimates
                if (tempConLineBottleLow && conLineScreener) {
                    var tempScreenerLowEstimate = tempConLineBottleLow * conLineScreener;
                    SCREENER_LOW_ESTIMATE += tempScreenerLowEstimate ? parseInt(tempScreenerLowEstimate) : 0;
                }
                //Screener High Estimates
                if (tempConLineBottleHigh && conLineScreener) {
                    var tempScreenerHighEstimate = tempConLineBottleHigh * conLineScreener;
                    SCREENER_HIGH_ESTIMATE += tempScreenerHighEstimate ? parseInt(tempScreenerHighEstimate) : 0;
                }
                objConsignment.linesData.push(tempObj);
                //Change ZAC-129
                if (EXCLUDE_SUM.indexOf(tempConLineType) == -1) {
                    LOW_ESTIMATE += tempLowEst ? parseFloat(tempLowEst) : 0;
                    HIGH_ESTIMATE += tempHighEst ? parseFloat(tempHighEst) : 0;
                    if (tempReserve) {
                        totalReserve = totalReserve + parseFloat(tempReserve);
                    }
                }

                if (tempConRecivedQty != null) {
                    var sizeInLiters = sizeMappingObj[bottleSizeText];
                    BOTTLE_COUNT_ARR.push({
                        bottleSize: tempBottleSize,
                        conQty: tempConRecivedQty,
                        bottleSizeText: bottleSizeText,
                        sizeInLiters: sizeInLiters
                    });
                }

            }

        }
        if (totalReserve) {
            objConsignment.totalReserve = totalReserve;
        }
        //Change-End ZAC-129
        sortDataAscendingOrder(BOTTLE_COUNT_ARR, ['sizeInLiters']);
        BOTTLE_COUNT_ARR.reduce(function (r, o) {
            if (r[o.bottleSize]) {
                tempBottle = o.bottleSize;
                tempBottleText = o.bottleSizeText
                tempQtySum += parseFloat(o.conQty);

            } else {
                if (flag) {
                    tableDataValues.push({
                        bottleSize: tempBottle,
                        quantitySum: tempQtySum,
                        bottleSizeText: tempBottleText
                    });
                    tempBottle = o.bottleSize;
                    tempBottleText = o.bottleSizeText
                    tempQtySum = 0 + parseFloat(o.conQty);
                    r[o.bottleSize] = true;

                } else {
                    flag = true;
                    tempBottle = o.bottleSize;
                    tempBottleText = o.bottleSizeText
                    tempQtySum += parseFloat(o.conQty);
                    r[o.bottleSize] = true

                }
            }
            return r;
        }, {});
        tableDataValues.push({
            bottleSize: tempBottle,
            quantitySum: tempQtySum,
            bottleSizeText: tempBottleText

        });

        if (tableDataValues[0].bottleSize == "0") {
            var tempIndexValue = tableDataValues[0];
            tableDataValues.splice(0, 1);
            tableDataValues.push(tempIndexValue);
        }

        objConsignment.tableDataValues = tableDataValues;
        if (objConsignment.linesData.length > 0) {
            sortDataAscendingOrder(objConsignment.linesData, ['conLineSortOrder', 'conLineDesc', 'conLineVintage'])
        }

        nlapiLogExecution('Debug', "function " + title, "End");
        return objConsignment;
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
        var conRecFields = nlapiLoadRecord('vendor', consignerId)
        conObj.consignerEntityId = conRecFields.getFieldValue('entityid');
        conObj.splitConEntityName = conRecFields.getFieldValue('companyname');
        conObj.email = conRecFields.getFieldValue('email');
        conObj.phone = conRecFields.getFieldValue('phone');
        // conObj.glommedname =  conRecFields.getFieldText('glommedname');
        var numberOfAddresses = conRecFields.getLineItemCount('addressbook');


        for (var i = 1; i <= numberOfAddresses; i++) {
            conRecFields.selectLineItem('addressbook', i);

            var addressID = conRecFields.getCurrentLineItemValue('addressbook', 'internalid');
            var addressLabel = conRecFields.getCurrentLineItemValue('addressbook', 'label');
            conObj.shipToAddress = conRecFields.getCurrentLineItemValue('addressbook', 'addrtext').replace(/<br\s*\/?>/mg, "\n");
            conObj.addressee = conRecFields.getCurrentLineItemValue('addressbook', 'addressee');
            conObj.addr1 = conRecFields.getCurrentLineItemValue('addressbook', 'addr1');
            conObj.city = conRecFields.getCurrentLineItemValue('addressbook', 'city');
            conObj.dropdownstate = conRecFields.getCurrentLineItemText('addressbook', 'dropdownstate');
            conObj.zip = conRecFields.getCurrentLineItemValue('addressbook', 'zip');
            conObj.country = conRecFields.getCurrentLineItemValue('addressbook', 'country');

        }
        return conObj;

    } catch (e) {

        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
    }

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