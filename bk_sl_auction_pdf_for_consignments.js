var PDF_FOLDER = '159269';

function execute(request, response) {
    var title = 'execute';
    try {
        var recId = request.getParameter('auctionid');
        if (recId) {
            nlapiLogExecution('Debug', "recId ::" + title, recId);
            auctionPdfReport(request, response, recId);
        }
    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);

    }
}


function auctionPdfReport(request, response, aucId) {
    var title = "auctionPdfReport";
    try {
        nlapiLogExecution('Debug', title, "start............");
        var logoCom = getCompanyInfo();
        var stockObj = getAuctionLotRec(aucId);
        var mappingConsignmentPdf = getSortingOrderData(aucId);
        nlapiLogExecution("debug", "mappingConsignmentPdf::", JSON.stringify(mappingConsignmentPdf));
        var currDateTime = getCurrentDateTime();
        if (stockObj.stockIdArray.length > 0) {
            dataObj = getAucLicensePlate(stockObj);

            var dataArray = dataObj.dataArr;
            var mappingObject = dataObj.mappingItemObj;
            for (var i = 0; i < dataArray.length; i++) {
                var sortingOrderRecId = '';
                var consignmentName = dataArray[i].aucLpConsignment;
                var objInfo = mappingConsignmentPdf[consignmentName.toLowerCase()] || {};

                if (objInfo.isPdfCreated == 'T') { //Validate is already PDF created.
                    continue;
                } else {
                    sortingOrderRecId = objInfo.internalId;
                }
                var renderer = nlapiCreateTemplateRenderer();
                var template = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
                template += '<pdf>';
                template += "<head>";
                template += '<style type="text/css">* {';
                template += '<#if .locale == "zh_CN">';
                template += 'font-family: NotoSans, NotoSansCJKsc, sans-serif;';
                template += '<#elseif .locale == "zh_TW">';
                template += 'font-family: NotoSans, NotoSansCJKtc, sans-serif;';
                template += '<#elseif .locale == "ja_JP">';
                template += 'font-family: NotoSans, NotoSansCJKjp, sans-serif;';
                template += '<#elseif .locale == "ko_KR">';
                template += 'font-family: NotoSans, NotoSansCJKkr, sans-serif;';
                template += '<#elseif .locale == "th_TH">';
                template += 'font-family: NotoSans, NotoSansThai, sans-serif;';
                template += '<#else>';
                template += 'font-family: NotoSans, sans-serif;';
                template += '</#if>';
                template += '}';
                template += '</style>';
                template += '<macrolist>';
                template += '<macro id="footer-id">';
                template += '<p style="font-size: 8pt;" align="center">';
                template += 'Page <pagenumber/> of <totalpages/>';
                template += '</p>';
                template += '</macro>';
                template += '</macrolist>';
                template += "</head>";
                template += "<body height='11.69in' width='8.27in' footer='footer-id' footer-height='30px' padding='0.25in 0.25in 0.2in 0.25in'>";

                template += "<table width='100%' style='margin-top: 10px;'>";
                template += "<tr>";
                template += "<td width='34%'   align='left'> <img width='143px' height='50px' src='" + logoCom + "' alt='Logo'></img></td>";
                template += "<td width='33%'  align='center'  style='font-size:13pt;'><p align='center'><span style='font-weight: bold;'> Schedule A </span> <br/> <span style='font-size:9pt'>" + currDateTime + "</span> <br/> ";
                template += "</p>";
                template += "</td>";
                var typeValue = dataArray[i].aucType ? ' ' + dataArray[i].aucType : "";
                template += "<td width='33%'  align='left'><p align='left' style='font-size:9pt'><b>Auction Code: </b>" + dataArray[i].auctionCode + typeValue + " <br/> <b>Location: </b>  " + dataArray[i].aucLocation + " " + dataArray[i].aucType + "<br/> <b>Currency: </b>  " + dataArray[i].aucCurrency + "<br/> <b>Date: </b> " + dataArray[i].startDate + " <br/> <b>Total Lots: </b> {REPLACE_LOT_NUMBER}<br/>";
                template += "</p>";
                template += "</td>";
                template += "</tr>";
                template += "</table>";

                template += "<table width='100%'>";
                template += "<tr>";
                //var lowAndHigh = (dataArray[i].sumOfEstimateLow && dataArray[i].sumOfEstimateHigh) ? numberWithCommas(dataArray[i].sumOfEstimateLow) + '-' + numberWithCommas(dataArray[i].sumOfEstimateHigh) : "";
                var consignmentAndConsignor = (dataArray[i].aucLpConsignment && dataArray[i].lotConsignor) ? dataArray[i].aucLpConsignment + "-" + dataArray[i].lotConsignor : "";
                template += "<td width='67%' align='left'><span style='font-size:9pt'><b>Consignment # </b>" + consignmentAndConsignor + "</span></td>";
                template += "<td width='33%' align='left'> <span style='font-size:9pt'><b>Estimate: </b>{REPLACE_LOW_AND_HIGH}</span></td>";
                template += "</tr>";
                template += "</table>";

                if (dataArray[i].auctionLot.length > 0) {
                    sortList(dataArray[i].auctionLot);
                    dataArray[i].auctionLot = combineSameLotNumber(dataArray[i].auctionLot);
                    var lowEstSum = 0;
                    var highEstSum = 0;
                    for (var j = 0; j < dataArray[i].auctionLot.length; j++) {
                        nlapiLogExecution('debug', 'dataArray[i].auctionLot[j]', JSON.stringify(dataArray[i].auctionLot[j]))
                        dataArray[i].auctionLot[j].lines = combineSameItems(dataArray[i].auctionLot[j].lines);

                        template += "<table width='100%' style='margin-top: 5px;'>";
                        template += "<tr style='background-color: black;'>";
                        template += "<td  width='15%' align='left' style='color:white; font-size:10pt; padding-left: 12px; padding-bottom: 4px; padding-top: 6px;'><b>Lot: </b>" + dataArray[i].auctionLot[j].lotNumber + "</td>";
                        if (dataArray[i].auctionLot[j].lines.length > 1) {
                            template += "<td  width='25%' align='left' style='color:white; font-size:10pt; padding-left: 12px; padding-bottom: 4px; padding-top: 6px;'>-- Mixed Lot -- </td>";
                        } else {
                            template += "<td  width='25%' align='left' style='color:white; font-size:10pt; padding-left: 12px; padding-bottom: 4px; padding-top: 6px;'></td>";
                        }

                        lowEstSum += dataArray[i].auctionLot[j].lotEstLow ? parseInt(dataArray[i].auctionLot[j].lotEstLow) : 0;
                        highEstSum += dataArray[i].auctionLot[j].lotEstHigh ? parseInt(dataArray[i].auctionLot[j].lotEstHigh) : 0;
                        template += "<td  width='20%' align='left' style='color:white; font-size:10pt; padding-left: 12px; padding-bottom: 4px; padding-top: 6px;'><b>Reserve: </b>" + numberWithCommas(dataArray[i].auctionLot[j].lotReserve) + "</td>";
                        template += "<td  width='40%' align='left' style='color:white; font-size:10pt; padding-left: 12px; padding-bottom: 4px; padding-top: 6px;'><b>Estimate: </b>" + numberWithCommas(dataArray[i].auctionLot[j].lotEstLow) + "-" + numberWithCommas(dataArray[i].auctionLot[j].lotEstHigh) + "</td>";
                        template += "</tr>";
                        template += "</table>";
                        for (var k = 0; k < dataArray[i].auctionLot[j].lines.length; k++) {

                            if (mappingObject[dataArray[i].auctionLot[j].lines[k].aucLpItemId] && dataArray[i].auctionLot[j].lines[k].aucLpItemId != -999) {
                                template += "<table width='100%' style='paadding: 0px; margin:0px;'>";
                                template += "<tr style='padding: 0;'>";
                                template += "<td  width='100%' align = 'left' style='padding-left: 40px; padding-bottom: 0px; font-size: 8pt'>" + dataArray[i].auctionLot[j].lines[k].aucLpQuantity + " " + mappingObject[dataArray[i].auctionLot[j].lines[k].aucLpItemId].sizeDesc + "</td>";
                                template += "</tr>";
                                template += "<tr style='padding: 0;'>";
                                template += "<td  width='100%' align = 'left' style='padding-left: 40px; padding-bottom: 0px; font-size: 8pt'>" + mappingObject[dataArray[i].auctionLot[j].lines[k].aucLpItemId].auctionDisName + "</td>";
                                template += "</tr>";
                                template += "<tr style='padding: 0;'>";
                                template += "<td  width='100%' align = 'left' style='padding-left: 40px; padding-bottom: 0px; font-size: 8pt'>" + mappingObject[dataArray[i].auctionLot[j].lines[k].aucLpItemId].appellation + " " + mappingObject[dataArray[i].auctionLot[j].lines[k].aucLpItemId].cru + "</td>";
                                template += "</tr>";
                                if (dataArray[i].auctionLot[j].lines.length > 1 && k + 1 != dataArray[i].auctionLot[j].lines.length) {
                                    template += "<tr style='padding: 0px;; margin:0px;'>";
                                    template += "<td height='2px' style='padding-left:20px;'>";
                                    template += "<hr width='100%'/>";
                                    template += "</td>"
                                    template += "</tr>";
                                }
                                template += "</table>";


                            }
                        }
                    }
                    var lowAndHigh = (lowEstSum && highEstSum) ? numberWithCommas(lowEstSum) + '-' + numberWithCommas(highEstSum) : "";
                    template = template.replace(/{REPLACE_LOW_AND_HIGH}/g, lowAndHigh);
                    template = template.replace(/{REPLACE_LOT_NUMBER}/g, dataArray[i].auctionLot.length);
                }
                template += '</body>';
                template += '</pdf>';
                template = template.replace(/&amp;/g, "&");
                template = template.replace(/&/g, "&amp;");
                renderer.setTemplate(template); // Passes in raw string of template to be transformed by FreeMarker
                var xml = renderer.renderToString(); // Returns template content interpreted by FreeMarker as XML string that can be passed to the nlapiXMLToPDF function.
                var file = nlapiXMLToPDF(xml); // Produces PDF output.
                var fileName = dataArray[i].aucLpConsignment.replace(/ /g, '_') + '_' + dataArray[i].lotConsignor.replace(/ /g, '_') + '_ScheduleA.pdf'
                //file.setName("SS Customer Price List.pdf");
                file.setName(fileName);
                // response.setContentType('PDF', fileName, 'inline');
                // response.write(file.getValue());
                file.setFolder(PDF_FOLDER);
                var fileId = nlapiSubmitFile(file);
                if (fileId) {
                    nlapiAttachRecord("file", fileId, 'customrecord_auction', aucId);
                    if (sortingOrderRecId) {
                        nlapiSubmitField('customrecord_sorting_order', sortingOrderRecId, 'custrecord_sorting_is_auction_pdf', 'T');
                    }
                }
                nlapiLogExecution('debug', 'fileId:', fileId)
            }
            response.write("<p>PDF files created successfully.</p>");
        } else {
            response.write("<p>Invalid record information.</p>");

        }
        nlapiLogExecution('Debug', title, "end............");
    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
        response.write("<p>" + e.message + ".</p>");
    }
}


function getCompanyInfo() {
    var title = 'getCompanyInfo';
    try {
        var companyInfo = nlapiLoadConfiguration('companyinformation');
        var comapnyLogoId = companyInfo.getFieldValue('formlogo');
        var fileObj = nlapiLoadFile(comapnyLogoId);

        var logoUrl = fileObj.getURL();
        var site = "https://4977400-sb1.app.netsuite.com";
        var companyLogoUrl = site + logoUrl;
        companyLogoUrl = companyLogoUrl.replace(/&/g, '&amp;');
        return companyLogoUrl;
    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
    }

}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sortList(lotArr) {
    lotArr.sort(fieldSorter(['lotNumber']));


    function fieldSorter(fields) {
        return function (a, b) {
            return fields
                .map(function (o) {
                    var dir = 1;
                    if (o[0] === '-') {
                        dir = -1;
                        o = o.substring(1);
                    }
                    if (a[o] > b[o])
                        return dir;
                    if (a[o] < b[o])
                        return -(dir);
                    return 0;
                })
                .reduce(function firstNonZeroValue(p, n) {
                    return p ? p : n;
                }, 0);
        };
    }

}

function combineSameLotNumber(dataArr) {
    var title = "combineSameLotNumber() :: ";
    try {

        var updatedDataArr = [];
        var previousLotNumber;
        var indexValue;
        for (var i = 0; i < dataArr.length; i++) {
            if (i == 0) {
                previousLotNumber = dataArr[i].lotNumber;
                indexValue = i;
            } else if (previousLotNumber != dataArr[i].lotNumber) {
                updatedDataArr.push(dataArr[indexValue]);
                previousLotNumber = dataArr[i].lotNumber;
                indexValue = i;
            } else {
                for (var j = 0; j < dataArr[i].lines.length; j++) {
                    dataArr[indexValue].lines.push(dataArr[i].lines[j])
                }
            }

            if (dataArr.length == i + 1) {
                updatedDataArr.push(dataArr[indexValue]);
            }
        }

        return updatedDataArr;


    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
    }
}

function combineSameItems(dataArr) {
    var title = "combineSameItems() :: ";
    try {

        var updatedDataArr = [];
        var previousLotNumber;
        var indexValue;
        for (var i = 0; i < dataArr.length; i++) {
            if (i == 0) {
                previousLotNumber = dataArr[i].aucLpItemId;
                indexValue = i;
            } else if (previousLotNumber != dataArr[i].aucLpItemId) {
                updatedDataArr.push(dataArr[indexValue]);
                previousLotNumber = dataArr[i].aucLpItemId;
                indexValue = i;
            } else {
                dataArr[i].aucLpQuantity = dataArr[i].aucLpQuantity ? parseInt(dataArr[i].aucLpQuantity) : 0;
                dataArr[indexValue].aucLpQuantity = parseInt(dataArr[indexValue].aucLpQuantity) + dataArr[i].aucLpQuantity;
            }

            if (dataArr.length == i + 1) {
                updatedDataArr.push(dataArr[indexValue]);
            }
        }

        return updatedDataArr;


    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
    }
}


function getAuctionLotRec(aucId) {
    var title = 'getAuctionLotRec';
    try {
        var stockIdArray = [];
        var mappingLotNumbers = {};
        var Filters = new Array();
        Filters[0] = new nlobjSearchFilter('custrecord_auction_lot_auction', null, 'anyof', aucId);
        Filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

        var Columns = new Array();
        Columns[0] = new nlobjSearchColumn('custrecord_auction_lot_stockid');
        Columns[1] = new nlobjSearchColumn('custrecord_auction_lot_lotnumber').setSort();
        Columns[2] = new nlobjSearchColumn('custrecord_auction_lot_reserve');
        Columns[3] = new nlobjSearchColumn('custrecord_auction_lot_bottle_low');
        Columns[4] = new nlobjSearchColumn('custrecord_auction_lot_estimate_high');
        Columns[5] = new nlobjSearchColumn('altname', 'custrecord_auction_lot_consignor');
        Columns[6] = new nlobjSearchColumn('custrecord_auction_name', 'custrecord_auction_lot_auction');
        Columns[7] = new nlobjSearchColumn('name', 'custrecord_auction_lot_auction');
        Columns[8] = new nlobjSearchColumn('custrecord_auction_start_date', 'custrecord_auction_lot_auction');
        Columns[9] = new nlobjSearchColumn('custrecord_auction_company', 'custrecord_auction_lot_auction');
        Columns[10] = new nlobjSearchColumn('custrecord_auction_type', 'custrecord_auction_lot_auction');
        Columns[11] = new nlobjSearchColumn('custrecord_auction_currency', 'custrecord_auction_lot_auction');



        var auctionSearchResult = [];
        nlapiLogExecution('DEBUG', 'auctionSearchResult.length', auctionSearchResult.length + ' records returned');
        var searchObj = nlapiCreateSearch('customrecord_auction_lot', Filters, Columns);
        var searchResults = searchObj.runSearch();

        // resultIndex points to record starting current resultSet in the entire results array 
        var resultIndex = 0;
        var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
        var resultSet;
        do {
            // fetch one result set
            resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
            if (resultSet.length != null) {
                auctionSearchResult = auctionSearchResult.concat(resultSet);
            }

            // increase pointer
            resultIndex = resultIndex + resultStep;

        } while (resultSet.length > 0);
        nlapiLogExecution('DEBUG', 'auctionSearchResult.length', auctionSearchResult.length + ' records returned');

        if (auctionSearchResult) {
            for (var p = 0; p < auctionSearchResult.length; p++) {
                var lotObj = {};
                var auctionRec = auctionSearchResult[p];
                var stockId = auctionRec.getValue('custrecord_auction_lot_stockid') || "";
                lotObj.lotName = auctionRec.getValue('custrecord_auction_lot_lotnumber') ? parseFloat(auctionRec.getValue('custrecord_auction_lot_lotnumber')) : '';
                lotObj.lotReserve = auctionRec.getValue('custrecord_auction_lot_reserve') ? parseInt(auctionRec.getValue('custrecord_auction_lot_reserve')) : "";
                lotObj.lotEstLow = auctionRec.getValue('custrecord_auction_lot_bottle_low') ? parseInt(auctionRec.getValue('custrecord_auction_lot_bottle_low')) : "";
                lotObj.lotEstHigh = auctionRec.getValue('custrecord_auction_lot_estimate_high') ? parseInt(auctionRec.getValue('custrecord_auction_lot_estimate_high')) : "";
                lotObj.lotConsignor = auctionRec.getValue('altname', 'custrecord_auction_lot_consignor') || "";
                lotObj.aucName = auctionRec.getValue('custrecord_auction_name', 'custrecord_auction_lot_auction') || "";
                lotObj.aucCode = auctionRec.getValue('name', 'custrecord_auction_lot_auction') || "";
                lotObj.aucLocation = auctionRec.getText('custrecord_auction_company', 'custrecord_auction_lot_auction') || "";
                lotObj.aucType = auctionRec.getText('custrecord_auction_type', 'custrecord_auction_lot_auction') || "";
                lotObj.startDate = auctionRec.getValue('custrecord_auction_start_date', 'custrecord_auction_lot_auction') || "";
                lotObj.aucCurrency = auctionRec.getText('custrecord_auction_currency', 'custrecord_auction_lot_auction') || " ";

                if (stockId && stockIdArray.indexOf(stockId) == -1) {
                    stockIdArray.push(stockId);
                    mappingLotNumbers[stockId] = lotObj;
                }
            }
            nlapiLogExecution('Debug', "stockIdArray ::" + title, JSON.stringify(stockIdArray));

        }
        return {
            stockIdArray: stockIdArray,
            mappingLotNumbers: mappingLotNumbers
        };


    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
        return {};
    }

}

function getCurrentDateTime() {
    var title = 'getCurrentDateTime';
    try {
        var today = new Date();
        var dd = today.getDate();
        var mm = addZero(today.getMonth() + 1);
        var yyyy = today.getFullYear();
        var hour = addZero(today.getHours());
        var amPm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12; // the hour '0' should be '12'
        var minute = addZero(today.getMinutes());
        minute = minute < 10 ? '0' + minute : minute;
        var sec = addZero(today.getSeconds());
        var printDate = mm + '/' + dd + '/' + yyyy;
        var prinTime = hour + ':' + minute + ':' + sec + ' ' + amPm;
        var dateTime = printDate + ' ' + prinTime;
        return dateTime;

    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
    }

}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getAucLicensePlate(stockIdObj) {
    try {
        var title = 'getAucLicensePlate() :: ';
        var dataArr = [];
        // for (var j = 0; j < stockIdArr.length; j++) {
        var stockIdArr = stockIdObj.stockIdArray;
        var mappingLotNumbers = stockIdObj.mappingLotNumbers;
        var lpFilters = new Array();
        lpFilters[0] = new nlobjSearchFilter('custrecord_auc_lp_stockid', null, 'anyof', stockIdArr);

        var lpColumns = new Array();
        lpColumns[0] = new nlobjSearchColumn('name');
        lpColumns[1] = new nlobjSearchColumn('custrecord_auc_lp_stockid');
        lpColumns[2] = new nlobjSearchColumn('custrecord_auc_lp_consignment').setSort();
        lpColumns[3] = new nlobjSearchColumn('internalid').setSort();
        lpColumns[4] = new nlobjSearchColumn('custrecord_lp_item_item', 'CUSTRECORD_LP_ITEM_LP').setSort();
        lpColumns[5] = new nlobjSearchColumn('custrecord_lp_item_quantity', 'CUSTRECORD_LP_ITEM_LP');


        var lpSearchResult = [];

        var searchObj = nlapiCreateSearch('customrecord_auc_lp', lpFilters, lpColumns);
        var searchResults = searchObj.runSearch();

        // resultIndex points to record starting current resultSet in the entire results array 
        var resultIndex = 0;
        var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
        var resultSet;
        do {
            // fetch one result set
            resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);

            if (resultSet) {
                lpSearchResult = lpSearchResult.concat(resultSet);
            }

            // increase pointer
            resultIndex = resultIndex + resultStep;

            // process or log the results
            // once no records are returned we already got all of them
        } while (resultSet.length > 0);
        nlapiLogExecution('DEBUG', 'lpSearchResult.length', lpSearchResult.length + ' records returned');

        if (!isNullOrEmpty(lpSearchResult)) {
            var body = {};
            var auctionLotObj = {};
            var itemArray = [];
            var estimateHighSum = 0;
            var estimateLowSum = 0;
            for (var i = 0; i < lpSearchResult.length; i++) {
                var aucLpId = lpSearchResult[i].getValue('internalid');
                var aucLpName = lpSearchResult[i].getValue('name');
                var aucLpConsignment = lpSearchResult[i].getText('custrecord_auc_lp_consignment');
                var stockId = lpSearchResult[i].getValue('custrecord_auc_lp_stockid');
                var lotConsignor = mappingLotNumbers[stockId].lotConsignor;
                var tempEstHighSum = mappingLotNumbers[stockId].lotEstHigh ? parseInt(mappingLotNumbers[stockId].lotEstHigh) : parseInt(0);
                var tempEstLowSum = mappingLotNumbers[stockId].lotEstLow ? parseInt(mappingLotNumbers[stockId].lotEstLow) : parseInt(0);


                if (i == 0) {
                    auctionLotObj.lotNumber = mappingLotNumbers[stockId].lotName;
                    auctionLotObj.lotReserve = mappingLotNumbers[stockId].lotReserve ? parseInt(mappingLotNumbers[stockId].lotReserve) : "";
                    auctionLotObj.lotEstHigh = mappingLotNumbers[stockId].lotEstHigh ? parseInt(mappingLotNumbers[stockId].lotEstHigh) : "";
                    auctionLotObj.aucLpId = aucLpId;
                    auctionLotObj.lotEstLow = mappingLotNumbers[stockId].lotEstLow ? parseInt(mappingLotNumbers[stockId].lotEstLow) : "";
                    auctionLotObj.lines = [];
                    estimateHighSum += tempEstHighSum;
                    estimateLowSum += tempEstLowSum;
                } else if (auctionLotObj.aucLpId != aucLpId) {
                    body.auctionLot.push(auctionLotObj);
                    var auctionLotObj = {};
                    auctionLotObj.lotNumber = mappingLotNumbers[stockId].lotName;
                    auctionLotObj.lotReserve = mappingLotNumbers[stockId].lotReserve ? parseInt(mappingLotNumbers[stockId].lotReserve) : "";
                    auctionLotObj.lotEstHigh = mappingLotNumbers[stockId].lotEstHigh ? parseInt(mappingLotNumbers[stockId].lotEstHigh) : "";
                    auctionLotObj.aucLpId = aucLpId;
                    auctionLotObj.lotEstLow = mappingLotNumbers[stockId].lotEstLow ? parseInt(mappingLotNumbers[stockId].lotEstLow) : "";
                    auctionLotObj.lines = [];
                    if (body.aucLpConsignment == aucLpConsignment) {
                        estimateHighSum += tempEstHighSum;
                        estimateLowSum += tempEstLowSum;
                    }

                }

                if (i == 0) {
                    body.aucLpId = aucLpId;
                    body.aucLpName = aucLpName;
                    body.aucLpConsignment = aucLpConsignment;
                    body.stockId = stockId;
                    body.lotConsignor = lotConsignor;
                    body.auctionName = mappingLotNumbers[stockId].aucName;
                    body.auctionCode = mappingLotNumbers[stockId].aucCode;
                    body.aucLocation = mappingLotNumbers[stockId].aucLocation;
                    body.aucType = mappingLotNumbers[stockId].aucType;
                    body.aucCurrency = mappingLotNumbers[stockId].aucCurrency;
                    body.startDate = mappingLotNumbers[stockId].startDate;
                    body.auctionLot = [];
                } else if (body.aucLpConsignment != aucLpConsignment) {
                    body.sumOfEstimateLow = estimateLowSum;
                    body.sumOfEstimateHigh = estimateHighSum;
                    dataArr.push(body);
                    var body = {};
                    body.aucLpId = aucLpId;
                    body.aucLpName = aucLpName;
                    body.aucLpConsignment = aucLpConsignment;
                    body.auctionName = mappingLotNumbers[stockId].aucName;
                    body.auctionCode = mappingLotNumbers[stockId].aucCode;
                    body.aucLocation = mappingLotNumbers[stockId].aucLocation;
                    body.aucType = mappingLotNumbers[stockId].aucType;
                    body.aucCurrency = mappingLotNumbers[stockId].aucCurrency;
                    body.startDate = mappingLotNumbers[stockId].startDate;
                    body.stockId = stockId;
                    body.lotConsignor = lotConsignor;
                    body.auctionLot = [];

                    estimateHighSum = 0;
                    estimateLowSum = 0;
                    estimateHighSum += tempEstHighSum;
                    estimateLowSum += tempEstLowSum;
                }
                var objItemLp = {};
                objItemLp.aucLpItemId = lpSearchResult[i].getValue('custrecord_lp_item_item', 'CUSTRECORD_LP_ITEM_LP');
                objItemLp.aucLpQuantity = lpSearchResult[i].getValue('custrecord_lp_item_quantity', 'CUSTRECORD_LP_ITEM_LP');

                if (itemArray.indexOf(objItemLp.aucLpItemId) == -1) {
                    itemArray.push(objItemLp.aucLpItemId);
                }
                auctionLotObj.lines.push(objItemLp);


                if (lpSearchResult.length == i + 1) {
                    body.auctionLot.push(auctionLotObj);
                    body.sumOfEstimateLow = estimateLowSum;
                    body.sumOfEstimateHigh = estimateHighSum;
                    dataArr.push(body);
                }
            }
            nlapiLogExecution('DEBUG', "dataArr ::" + title, JSON.stringify(dataArr));
            var mappingItemObj = getItemRecMappingObjects(itemArray);

            return {
                dataArr: dataArr,
                mappingItemObj: mappingItemObj
            };

        }
        // }


    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);

    }


}

function getItemRecMappingObjects(itemIds) {
    var title = 'getItemRecMappingObjects';
    try {
        nlapiLogExecution('Debug', "itemIds" + title, JSON.stringify(itemIds));

        var mappingItemObj = {};
        var Filters = new Array();
        Filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', itemIds);
        Filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

        var Columns = new Array();
        Columns[0] = new nlobjSearchColumn('cseg_appellation');
        Columns[1] = new nlobjSearchColumn('custitem_cru');
        Columns[2] = new nlobjSearchColumn('custitem_auction_display_name');
        Columns[3] = new nlobjSearchColumn('custrecord_size_description', 'custitem_size');


        var itemSearchResult = [];
        var searchObj = nlapiCreateSearch('lotnumberedinventoryitem', Filters, Columns);
        var searchResults = searchObj.runSearch();

        // resultIndex points to record starting current resultSet in the entire results array 
        var resultIndex = 0;
        var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
        var resultSet;
        do {
            // fetch one result set
            resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);

            if (resultSet.length > 0) {
                itemSearchResult = itemSearchResult.concat(resultSet);
            }

            // increase pointer
            resultIndex = resultIndex + resultStep;

            // process or log the results
            nlapiLogExecution('DEBUG', 'itemSearchResult.length', itemSearchResult.length +
                ' records returned');
            // once no records are returned we already got all of them
        } while (resultSet.length > 0);

        if (itemSearchResult) {
            for (var i = 0; i < itemSearchResult.length; i++) {
                var itemObj = {};
                var itemRec = itemSearchResult[i];
                itemObj.appellation = itemRec.getText('cseg_appellation');
                itemObj.cru = itemRec.getText('custitem_cru');
                itemObj.auctionDisName = itemRec.getValue('custitem_auction_display_name');
                itemObj.sizeDesc = itemRec.getText('custrecord_size_description', 'custitem_size');
                mappingItemObj[itemRec.id] = itemObj;
            }

        }
        return mappingItemObj;


    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
    }

}

function getSortingOrderData(auctionId) {
    var title = 'getSortingOrderData';
    try {

        var mappingConsignmentPdf = {};
        var Filters = new Array();
        Filters[0] = new nlobjSearchFilter('custrecord_sorting_order_auction', null, 'anyof', auctionId);
        Filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

        var Columns = new Array();
        Columns[0] = new nlobjSearchColumn('custrecord_sorting_order_consignment');
        Columns[1] = new nlobjSearchColumn('custrecord_sorting_is_auction_pdf');


        var searchResult = nlapiSearchRecord('customrecord_sorting_order', null, Filters, Columns);
        if (searchResult) {
            for (var i = 0; i < searchResult.length; i++) {
                var consignmentName = searchResult[i].getText('custrecord_sorting_order_consignment');
                var isPdfCreated = searchResult[i].getValue('custrecord_sorting_is_auction_pdf');
                mappingConsignmentPdf[consignmentName.toLowerCase()] = {
                    isPdfCreated: isPdfCreated,
                    internalId: searchResult[i].id
                };
            }

        }
        return mappingConsignmentPdf;


    } catch (e) {
        nlapiLogExecution('Error', "ERROR IN ::" + title, e.message);
    }

}

function isNullOrEmpty(valueStr) {
    return (valueStr == null || valueStr == "" || valueStr == undefined);
}