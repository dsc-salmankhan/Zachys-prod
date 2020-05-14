var Zachys = Zachys || {};
var tabIndexCount = 1;
var UI_TABLE_OBJ;
var SVG = {};
SVG.Checkmark = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16 checkmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>';
SVG.Search = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>';
SVG.ArrowUp = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg>';
SVG.Close = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>';
SVG.Gavel = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="gavel" class="svg-inline--fa fa-gavel fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504.971 199.362l-22.627-22.627c-9.373-9.373-24.569-9.373-33.941 0l-5.657 5.657L329.608 69.255l5.657-5.657c9.373-9.373 9.373-24.569 0-33.941L312.638 7.029c-9.373-9.373-24.569-9.373-33.941 0L154.246 131.48c-9.373 9.373-9.373 24.569 0 33.941l22.627 22.627c9.373 9.373 24.569 9.373 33.941 0l5.657-5.657 39.598 39.598-81.04 81.04-5.657-5.657c-12.497-12.497-32.758-12.497-45.255 0L9.373 412.118c-12.497 12.497-12.497 32.758 0 45.255l45.255 45.255c12.497 12.497 32.758 12.497 45.255 0l114.745-114.745c12.497-12.497 12.497-32.758 0-45.255l-5.657-5.657 81.04-81.04 39.598 39.598-5.657 5.657c-9.373 9.373-9.373 24.569 0 33.941l22.627 22.627c9.373 9.373 24.569 9.373 33.941 0l124.451-124.451c9.372-9.372 9.372-24.568 0-33.941z"></path></svg>';
SVG.AngleLeft = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-left" class="svg-inline--fa fa-angle-left fa-w-8" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="currentColor" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path></svg>'
SVG.AngleDoubleLeft = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-double-left" class="svg-inline--fa fa-angle-double-left fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M223.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L319.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L393.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34zm-192 34l136 136c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9L127.9 256l96.4-96.4c9.4-9.4 9.4-24.6 0-33.9L201.7 103c-9.4-9.4-24.6-9.4-33.9 0l-136 136c-9.5 9.4-9.5 24.6-.1 34z"></path></svg>';
SVG.Cog = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cog" class="svg-inline--fa fa-cog fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path></svg>';

Zachys.Stock = function(){
  var self = this;
  this.UI = {};
  var html = '';
  html += '<div class="appraisal" ref="consigmentLines">';
  html += '  <div class="summary" ref="summary"></div>';
  html += '  <div class="header"><div>';
  html += '    <h1 ref="title">Add Appraisal Lines</h1>';
  html += '  </div></div>';
  html += '  <div class="table-title">';
  html += '    <h2 class="filter-h2-name">Available Item Records</h2>';
  html += '    <div class="filterHolder filter-holder-name" ref="filterNameHolder"></div>'
  html += '    <h2 class="filter-h2-vintage">Vintage</h2>';
  html += '    <div class="filterHolder filter-holder-vintage" ref="filterVintageHolder"></div>'
  html += '    <h2 class="filter-h2-size">Size</h2>';
  html += '    <div class="filterHolder filter-holder-size" ref="filterSizeHolder"></div>'
  html += '    <h2 class="filter-h2-item">Item</h2>';
  html += '    <div class="filterHolder filter-holder-item" ref="filterItemHolder"></div>'
  html += '  </div>';
  html += '  <div class="table-container" style="padding-top: 8px;" var="table-container"></div>';
  html += '  <div class="table-title">';
  html += '    <h2 style="width: auto;">Appraisal Lines</h2>';
  html += '    <b class="settings-button" ref="table-container.settings">' + SVG.Cog + '</b>';
  html += '    <div class="filterHolder" ref="filterAppraisalHolder"></div>'
  html += '  </div>';
  html += '  <div class="table-container" id="table-container-lines" var="table-lines"></div>';
  html += '  <div class="headers" var="headers">';
  html += '    <span class="item-size" ref="sort.lp">Size<i>&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-vintage">Vintage</span>';
  html += '    <span class="item-qty">Qty</span>';
  html += '    <span class="item-description">Description</span>';
  html += '    <span class="item-low-price" ref="sort.low">Low<i>&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-high-price" ref="sort.high">High<i>&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-country" ref="filters.country"><span>Country</span><i ref="sort.country">&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-region" ref="filters.region"><span>Region</span><i ref="sort.region">&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-class" ref="filters.class"><span>Class</span><i ref="sort.class">&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-apellation" ref="filters.apellation"><span>Apellation</span><i ref="sort.apellation">&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-producer" ref="filters.producer"><span>Producer</span><i ref="sort.producer">&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '  </div>';
  html += '  <div class="content" var="content">';
  html += '    <div class="product-line" ref="products"></div>';
  html += '  </div>';
  html += '  <div class="footer">';
  html += '    <div class="buttons">';
  html += '      <b class="button secondary" ref="buttons.cancel">Cancel</b>';
  if(window.appraisalLinesInfoData){
    html += '      <b class="button" ref="buttons.create">Save Appraisal</b>';

  } else {
    html += '      <b class="button disabled" ref="buttons.create">Save Appraisal</b>';

  }
  html += '    </div>';
  html += '  </div>';
  html += '</div>';

  this.holder = Ozine.DOM(html, this.UI);

  this.UI.headers.style.display = 'none';
  this.UI.content.style.display = 'none';

  var previousConsignorLocation = '';

  this.UI.table = new Zachys.Table.Table({
    columns: [
      {
        name: '&nbsp',
        width: 60,
        fixed: true,
        className: 'button-cell',
        render: function(data, row){
          var button = document.createElement('b');
          button.className = "button";
          button.innerHTML = 'Add';
          button.onclick = function(){
            var lastLocationAdded = '';
            //row.remove();
            var items = self.UI.tableLines.items;
            var existingLinesdata = [];
            for (var iItem = 0; iItem < items.length; iItem++) {
              if(items[iItem].data.consignorLocation){
                lastLocationAdded = items[iItem].data.consignorLocation;
              }
              
              if(items[iItem].data.isAppLineEdited == false && items[iItem].data.appraisalLineInternalId){
                continue;
              } else {
                existingLinesdata.push(items[iItem].data);
              }
              
            }

            data.consignorLocation = lastLocationAdded;
            Zachys.Stock.addSingleAppraisalLineAndUpdateLines(data, existingLinesdata, function(response){
                Zachys.Stock.updateAppraisalInfo(response.appraisalInfoData);
                self.UI.tableLines.addItem(response.createdAppLineObjData, true);
                self.setState({ saveEnabled: true });
                self.UI.filterAppraisal.reset();
                self.UI.tableLines.reset();
                if(!self.UI.tableLines.UI.last.classList.contains('disabled')){
                  console.log("clicked....")
                  self.UI.tableLines.UI.last.click()

                }
                console.log("self.UI.tableLines.UI.last:", self.UI.tableLines)
  
              
            });
         
          }
          return button;
        }
      },
      {
        name: 'Description',
        className: 'text',
        width: 350,
        fixed: true,
        render: function(data){
          var descriptionText = '';
          data.name = data.name.replace(/---/g, "'");
          data.name = data.name.replace(/####/g, '"');
          if(data.name.length > 50){
            descriptionText = data.name.substring(0, 50);
            descriptionText = descriptionText.trim() + '<span style="font-weight: bold;">...</span>';
          } else {
            descriptionText = data.name;
          }
          return '<a href="' + data.itemUrl +'" target="_blank">' + descriptionText + '</a>'; 
        },
      },      
      {
        name: 'Vintage',
        width: 80,
        render: 'vintage',
        sort: 'vintage',
        filter: 'vintage',
      },
      {
        name: 'Size',
        width: 70,
        render: 'size',
        filter: 'size',

      },
      {
        name: 'Appellation',
        width: 120,
        render: function(data){
          data.appellation = data.appellation.replace(/---/g, "'");
          data.appellation = data.appellation.replace(/####/g, '"');
          return data.appellation;
        }
        //sort: 'lowPrice',
      },
      {
        name: 'Region',
        width: 100,
        render: function(data){
          data.region = data.region.replace(/---/g, "'");
          data.region = data.region.replace(/####/g, '"');
          return data.region;
        }
        //sort: 'highPrice',
      },
      {
        name: 'Country',
        width: 110,
        render: function(data){
          data.country = data.country.replace(/---/g, "'");
          data.country = data.country.replace(/####/g, '"');
          return data.country;
        },
      },
      {
        name: 'Producer',
        width: 220,
        render: function(data){
          data.producer = data.producer.replace(/---/g, "'");
          data.producer = data.producer.replace(/####/g, '"');
          return data.producer;
        }
      },
      {
        name: 'Update By',
        width: 160,
        render: function(data){
          return '<div class="text-ellipsis">' + data.lastUsed + '</div>';
        }
      },
      {
        name: 'ItemID',
        width: 120,
        render: 'SKU',
      },
    ],
    filter: function(data, obj, filters){

      for (var property in filters){
        if (!filters[property][data[property]]){
          return false;
        }
      }

      var filterNameValue = document.getElementById("filter-name-id").value;
      var filterVintageValue = document.getElementById("filter-vintage-id").value;
      var filterSizeValue = document.getElementById("filter-size-id").value;
      var filterSkuValue = document.getElementById("filter-sku-id").value;
      Zachys.Stock.getItemsDetail(0, ROWS_PER_PAGE);
      

      // if(filterNameValue){
      //   var splitNameValue = filterNameValue.split('%');
      //   var isNotNameExist = false;
      //   for(var i = 0; i < splitNameValue.length; i++){
      //     //if (Zachys.LevenshteinArias(splitNameValue[i].trim(), data.name.toLowerCase())){
      //       if(splitNameValue[i].length < 4){
      //         if (Zachys.LevenshteinArias(splitNameValue[i], data.name.toLowerCase())){
      //           isNotNameExist = true;
      //         } else {
      //           isNotNameExist = false;
      //           break;
      //         }

      //       } else {
              
      //         if (data.name.toLowerCase().indexOf(splitNameValue[i]) != -1){
      //           isNotNameExist = true;
      //         } else {
      //           isNotNameExist = false;
      //           break;
      //         }
      //       }
      //   }

      //   if(!isNotNameExist){
      //     return false;
      //   }
      // }
        
      // if(filterVintageValue){
      //     var splitVintageValue = filterVintageValue.split('%');
      //     var isNotVintageExist = false;
      //     for(var i = 0; i < splitVintageValue.length; i++){
      //       //if (Zachys.LevenshteinArias(splitVintageValue[i], data.vintage.toString())){
      //         if(splitVintageValue[i].length < 3){
      //           if (Zachys.LevenshteinArias(splitVintageValue[i], data.vintage.toString().toLowerCase())){
      //             isNotVintageExist = true;
      //           }

      //         } else {
                
      //           if (data.vintage.toString().toLowerCase().indexOf(splitVintageValue[i]) != -1){
      //             isNotVintageExist = true;
      //           }
      //         }
            
      //     }
      //     if (!isNotVintageExist){
      //       return false;
      //     }
      // }

      // if(filterSizeValue){
      //     var splitSizeValue = filterSizeValue.split('%');
      //     var isNotSizeExist = false;
      //     for(var i = 0; i < splitSizeValue.length; i++){
      //       //if (Zachys.LevenshteinArias(splitSizeValue[i], data.size.toString())){
      //       if(splitSizeValue[i].length < 3){
      //         if (Zachys.LevenshteinArias(splitSizeValue[i], data.size.toString().toLowerCase())){
      //           isNotSizeExist = true;
      //         }
      //       } else {
      //         if (data.size.toString().toLowerCase().indexOf(splitSizeValue[i]) != -1){
      //           isNotSizeExist = true;
      //         }
      //       }
      //     }
      //     if (!isNotSizeExist){
      //       return false;
      //     }

      // }

      // if(filterSkuValue){
      //     var splitSkuValue = filterSkuValue.split('%');
      //     var isNotSkuExist = false;
      //     for(var i = 0; i < splitSkuValue.length; i++){
      //       if(splitSkuValue[i].length < 3){
      //         if (Zachys.LevenshteinArias(splitSkuValue[i], data.SKU.toString().toLowerCase())){
      //           isNotSkuExist = true;
      //         }
      //       } else {
      //         if (data.SKU.toString().toLowerCase().indexOf(splitSkuValue[i]) != -1){
      //           isNotSkuExist = true;
      //         }
      //       }
      //     }

      //     if (!isNotSkuExist){
      //       return false;
      //     }
      // }

      return true;

        // if(type == 'name'){
        //   if (Zachys.LevenshteinArias(search, data.name.toLowerCase()) || search === ''){              
        //       return true;
        //   } else {
        //     return false;
        //   }
        // } 
        
        // if(type == 'vintage'){
        //     if (data.vintage.toString() != search && search !== ''){
        //       return false;
        //     } else {
        //       return true;
        //     }
        // } 
        // if(type == 'size'){
        //     if (data.size.toString() != search && search !== ''){
        //       return false;
        //     } else {
        //       return true;
        //     }
        // } 
        // if(type == 'SKU'){
        //     if (data.SKU.toString() != search && search !== ''){
        //       return false;
        //     } else {
        //       return true;
        //     }
        // }
    },

    totalNumberOfItems: window.itemsCount

  });

  UI_TABLE_OBJ = this.UI.table;


  for (var iWine = 0; iWine < ROWS_PER_PAGE; iWine++){
    this.UI.table.addItem(WINES_CATALOG[iWine]);
  }

  this.UI.filter = new Zachys.Filter('name');
  this.UI.filter.onChange = function(search){
    var objName = {};
    var tempName = search.split('%');
    if(tempName[tempName.length - 1].length > 2){
      objName.search = search;
      objName.type = 'name'
      self.UI.table.filter(objName);
    } 
    if(!tempName[0]) {
      objName.search = '';
      objName.type = 'name'
      self.UI.table.filter(objName);
    }
  }
  this.UI.filterNameHolder.appendChild(this.UI.filter.holder);

  this.UI.filterVintage = new Zachys.Filter('vintage');
  this.UI.filterVintage.onChange = function(search){
    var objVintage = {};
    var tempVintage = search.split('%');
    if(tempVintage[tempVintage.length - 1].length > 1){
      objVintage.search = search;
      objVintage.type = 'vintage'
      self.UI.table.filter(objVintage);
    } 
    if(!tempVintage[0]) {
      objVintage.search = '';
      objVintage.type = 'vintage'
      self.UI.table.filter(objVintage);

    }
  }
  this.UI.filterVintageHolder.appendChild(this.UI.filterVintage.holder);

  this.UI.filterSize = new Zachys.Filter('size');
  this.UI.filterSize.onChange = function(search){
    var objSize = {};
    var tempSize = search.split('%');
    if(tempSize[tempSize.length - 1].length > 1){
      objSize.search = search;
      objSize.type = 'size'
      self.UI.table.filter(objSize);
    } 
    if(!tempSize[0]) {
      objSize.search = '';
      objSize.type = 'size'
      self.UI.table.filter(objSize);

    }
  }
  this.UI.filterSizeHolder.appendChild(this.UI.filterSize.holder);

  this.UI.filterItem = new Zachys.Filter('SKU');
  this.UI.filterItem.onChange = function(search){
    var objSize = {};
    var tempSku = search.split('%');
    if(tempSku[tempSku.length - 1].length > 2){
      objSize.search = search;
      objSize.type = 'SKU'
      self.UI.table.filter(objSize);
    }

    if(!tempSku[0]){
      objSize.search = '';
      objSize.type = 'SKU'
      self.UI.table.filter(objSize);

    }
  }
  this.UI.filterItemHolder.appendChild(this.UI.filterItem.holder);


  this.UI.filterAppraisal = new Zachys.Filter();
  this.UI.filterAppraisal.onChange = function(search){
    self.UI.tableLines.filter(search);
  }
  this.UI.filterAppraisalHolder.appendChild(this.UI.filterAppraisal.holder);




  this.UI.table.createFilters();

  this.UI['table-container'].appendChild(this.UI.table.holder);

  this.UI.buttons.create.onclick = function() {
    if (self.state.saveEnabled) {
      var items = self.UI.tableLines.items;
      var data = [];
      for (var iItem = 0; iItem < items.length; iItem++) {
        if(items[iItem].data.isAppLineEdited == false && items[iItem].data.appraisalLineInternalId){
          continue;
        } else {
          data.push(items[iItem].data);

        }
      }
      Zachys.Stock.updateAppraisalLines(data);
      self.setState({ saveEnabled: false });
    }
  }

  this.UI.hammerPrices = new Zachys.Stock.HammerPrices();
  this.UI.reorderColumns = new Zachys.Stock.OrderColumns();
  this.UI.reorderColumns.onChange = function(columns){
    self.UI.tableLines.columns(columns);
  }

  this.UI['table-container'].settings.onclick = function(){
    self.UI.reorderColumns.show();
  }

  this.UI.tableLines = new Zachys.Table.Table({
    columns: [
      {
        name: '&nbsp',
        width: 40,
        fixed: true,
        className: 'erase',
        render: function(data, row){
          var button = document.createElement('b');
          button.innerHTML = SVG.Close;
          button.onclick = function(){
            var actionVal = confirm("Are you sure you want to remove this line from the current appraisal?");
            if(actionVal){
                row.remove();
                if(!data.appraisalLineInternalId){
                  self.UI.table.addItem(data, true);
                  self.UI.filter.reset();
                  self.UI.table.reset();
                  self.setState({ saveEnabled: true })

                } else {
                  self.UI.filter.reset();
                  self.UI.table.reset();
                  self.setState({ saveEnabled: true });
                  var appraisalLineInternalId = data.appraisalLineInternalId;
                  Zachys.Stock.removeAppraisalLine(appraisalLineInternalId);
                  
                }
            }
          }
          return button;
        }
      },
      {
        name: 'Qty',
        width: 50,
        fixed: true,
        className: 'input qty',
        render: function(data, row, col){
          var input = document.createElement('input');
          input.setAttribute('type', 'text');
          input.value = data.qty ? data.qty : '';
          //input.className = 'tab';
          input.tabIndex = tabIndexCount;
          tabIndexCount++;
          input.onfocus = function(){
            this.select();
          }
          input.oninput = function(){
            var number  = this.value.replace(/\D/gim, '')
            if (this.value !== number){
              this.value = number;
            }
            if (number !== data.qty.toString()){
              if (data.appraisalLineInternalId) {
                data.isAppLineEdited = true;
              }
              data.qty = Number(this.value);
              self.setState({ saveEnabled: true })
              row.dispatch(['qty'], col);
            }
          }
          return input;
        }
      },
      {
        name: 'Description',
        className: 'text',
        width: 350,
        fixed: true,
        render: function(data){
          var descriptionText = '';
          data.name = data.name.replace(/---/g, "'");
          data.name = data.name.replace(/####/g, '"');          
          if(data.name.length > 50){
            descriptionText = data.name.substring(0, 50);
            descriptionText = descriptionText.trim() + '<span style="font-weight: bold;">...</span>';
          } else {
            descriptionText = data.name;
          }

          return '<a href="' + data.itemUrl +'" target="_blank">' + descriptionText + '</a>'; 
        }
      },
      {
        name: ' ',
        width: 40,
        fixed: true,
        className: '',
        render: function(data, row, col){
          var icon = document.createElement('div');
          icon.className = 'icon';
          icon.setAttribute('alt', 'Hammer Prices');
          icon.onclick = function(){
            Zachys.Stock.getHammerPrice(data.internalId, function(response){
              self.UI.hammerPrices.show(data.name , response.hammerPriceArr);            
            }); 
          }
          icon.innerHTML = SVG.Gavel;
          return icon;
        }
      },
      {
        name: 'Estimate',
        width: 150,
        fixed: false,
        className: 'dropdown',
        render: function(data, row, col){
          var select = document.createElement('select');
          //select.className = 'tab';
          select.tabIndex = tabIndexCount;
          data.tabIndexCount = tabIndexCount;
          var options = [
            { name: 'Default', value: ''},
            { name: 'Update Global Estimate', value: 'updateestimate'},
            { name: 'Custom Estimate', value: 'custom'},
          ]
          for (var iOption = 0; iOption < options.length; iOption++){
            var option = document.createElement('option');
            option.setAttribute('value', options[iOption].value);
            if(options[iOption].value == data.existinEstType){
              option.selected = true;

            } else if (options[iOption].value == data.estType){
              option.selected = true;
            }
            option.text =  options[iOption].name;
            option.value = options[iOption].value;
            select.appendChild(option);
          }
          select.onchange = function(){
            if (data.appraisalLineInternalId) {
              data.isAppLineEdited = true;
            }
            data.estType = this.value;
            data.lowPrice = data.defaultLowPrice;
            data.highPrice = data.defaultHightPrice;
            self.setState({ saveEnabled: true })
            row.dispatch(['estType'], col);
          }
          return select;
        }
      },
      {
        name: 'Vintage',
        width: 70,
        render: 'vintage',
        sort: 'vintageId',
        filter: 'vintage',
        id: 'vintage',
      },
      {
        name: 'Size',
        width: 70,
        render: 'size',
        filter: 'size',
        id: 'size',
      },
      {
        name: 'Btl Low',
        width: 90,
        bind: ['lowPrice', 'estType'],
        className: 'input',
        render: function(data, row, col) {
          if (data.estType === '') {
            return '$' + Math.round(data.lowPrice).toLocaleString();
          }
          var input = document.createElement('input');
          input.setAttribute('type', 'text');
          //input.className = 'tab';
          input.value = '$' + Math.round(data.lowPrice).toLocaleString();
          input.tabIndex = data.tabIndexCount + 1;
          input.onfocus = function(){
            this.value = data.lowPrice;
            this.select();
          }
          input.onblur = function(){
            this.value = '$' + Math.round(data.lowPrice).toLocaleString();
          }
          input.oninput = function(){
            var number  = this.value.replace(/[^\d.]/gim, '')
            if (this.value !== number){
              this.value = number;
            }
            if (number !== data.lowPrice.toString()){
              if (data.appraisalLineInternalId) {
                data.isAppLineEdited = true;
              }
              data.lowPrice = Number(this.value);
              self.setState({ saveEnabled: true })
              row.dispatch(['lowPrice'], col);
            }
          }
          return input;
        },
        sort: 'lowPrice',
        id: 'lowPrice',
      },
      {
        name: 'Btl High',
        width: 90,
        bind: ['highPrice', 'estType'],
        className: 'input',
        render: function(data, row, col) {
          if (data.estType === '') {
            return '$' + Math.round(data.highPrice).toLocaleString();
          }
          var input = document.createElement('input');
          input.setAttribute('type', 'text');
          //input.className = 'tab';
          input.value = '$' + Math.round(data.highPrice).toLocaleString();
          input.tabIndex = data.tabIndexCount + 2;
          input.onfocus = function(){
            this.value = data.highPrice;
            this.select();
          }
          input.onblur = function(){
            this.value = '$' + Math.round(data.highPrice).toLocaleString();
          }
          input.oninput = function(){
            var number  = this.value.replace(/[^\d.]/gim, '')
            if (this.value !== number){
              this.value = number;
            }
            if (number !== data.highPrice.toString()){
              if (data.appraisalLineInternalId) {
                data.isAppLineEdited = true;
              }
              data.highPrice = Number(this.value);
              self.setState({ saveEnabled: true })
              row.dispatch(['highPrice'], col);
            }
          }
          return input;
        },
        sort: 'highPrice',
        id: 'highPrice'
      },
      {
        name: 'Cs Low',
        width: 90,
        bind: ['lowPrice', 'estType'],
        className: 'input',
        render: function(data, row, col) {
          data.caseLowPrice = data.lowPrice * data.case;
          if (data.estType === '') {
            return '$' + Math.round(data.case * data.lowPrice).toLocaleString();
          }
          var input = document.createElement('input');
          input.setAttribute('type', 'text');
          //input.className = 'tab';
          input.tabIndex = data.tabIndexCount + 3;
          input.value = '$' + Math.round(data.case * data.lowPrice).toLocaleString();
          input.onfocus = function(){
            this.value = data.case * data.lowPrice;
            this.select();
          }
          input.onblur = function(){
            this.value = '$' + Math.round(data.case * data.lowPrice).toLocaleString();
          }
          input.oninput = function(){
            var number  = this.value.replace(/[^\d.]/gim, '')
            if (this.value !== number){
              this.value = number;
            }
            if (number !== (data.case * data.lowPrice).toString()){
              if (data.appraisalLineInternalId) {
                data.isAppLineEdited = true;
              }
              if(data.case){
                data.lowPrice = Number(this.value / data.case);
              }
              data.caseLowPrice = data.lowPrice * data.case;
              self.setState({ saveEnabled: true })
              row.dispatch(['lowPrice'], col);
            }
          }
          return input;
        },
        sort: 'caseLowPrice',
        id: 'caseLowPrice',
      },
      {
        name: 'Cs High',
        width: 90,
        bind: ['highPrice', 'estType'],
        className: 'input',
        render: function(data, row, col) {
          data.caseHighPrice = data.highPrice * data.case;
          if (data.estType === '') {
            return '$' + Math.round(data.case * data.highPrice).toLocaleString();
          }
          var input = document.createElement('input');
          input.setAttribute('type', 'text');
          //input.className = 'tab';
          input.tabIndex = data.tabIndexCount + 4;
          input.value = '$' + Math.round(data.case * data.highPrice).toLocaleString();
          input.onfocus = function(){
            this.value = data.case * data.highPrice;
            this.select();
          }
          input.onblur = function(){
            this.value = '$' + Math.round(data.case * data.highPrice).toLocaleString();
          }
          input.oninput = function(){
            var number  = this.value.replace(/[^\d.]/gim, '')
            if (this.value !== number){
              this.value = number;
            }
            if (number !== (data.case * data.highPrice).toString()){
              if (data.appraisalLineInternalId) {
                data.isAppLineEdited = true;
              }
              if(data.case){
                data.highPrice = Number(this.value / data.case);
              }
              data.caseHighPrice = data.highPrice * data.case;
              self.setState({ saveEnabled: true })
              row.dispatch(['highPrice'], col);
            }
          }
          return input;
        },
        sort: 'caseHighPrice',
        id: 'caseHighPrice',
      },
      {
        name: 'Ext Low',
        width: 90,
        bind: ['qty', 'lowPrice', 'estType'],
        className: 'input',
        render: function(data, row, col) {
          data.extLowPrice = data.lowPrice * data.qty;
          if (data.estType === '') {
            return '$' + Math.round(data.qty * data.lowPrice).toLocaleString();
          }
          var input = document.createElement('input');
          input.setAttribute('type', 'text');
          //input.className = 'tab';
          input.tabIndex = data.tabIndexCount + 5;
          input.value = '$' + Math.round(data.qty * data.lowPrice).toLocaleString();
          input.onfocus = function(){
            this.value = data.qty * data.lowPrice;
            this.select();
          }
          input.onblur = function(){
            this.value = '$' + Math.round(data.qty * data.lowPrice).toLocaleString();
          }
          input.oninput = function(){
            var number  = this.value.replace(/[^\d.]/gim, '')
            if(number){
              if (this.value !== number){
                this.value = number;
              }
              if (number !== (data.qty * data.lowPrice).toString()){
                if (data.appraisalLineInternalId) {
                  data.isAppLineEdited = true;
                }
                if(data.qty){
                  data.lowPrice = Number(this.value / data.qty);
                  data.extLowPrice = data.lowPrice * data.qty;
                }
                self.setState({ saveEnabled: true })
                row.dispatch(['lowPrice'], col);
              }
            }
          }
          return input;
        },
        sort: 'extLowPrice',
        id: 'extLowPrice',
      },
      {
        name: 'Ext High',
        width: 90,
        bind: ['qty', 'highPrice', 'estType'],
        className: 'input',
        render: function(data, row, col) {
          data.extHighPrice = data.highPrice * data.qty;
          if (data.estType === '') {
            return '$' + Math.round(data.qty * data.highPrice).toLocaleString();
          }
          var input = document.createElement('input');
          input.setAttribute('type', 'text');
          //input.className = 'tab';
          input.tabIndex = data.tabIndexCount + 6;
          input.value = '$' + Math.round(data.qty * data.highPrice).toLocaleString();
          input.onfocus = function(){
            this.value = data.qty * data.highPrice;
            this.select();
          }
          input.onblur = function(){
            this.value = '$' + Math.round(data.qty * data.highPrice).toLocaleString();
          }
          input.oninput = function(){
            var number  = this.value.replace(/[^\d.]/gim, '')
            if(number){
              if (this.value !== number){
                this.value = number;
              }
              if (number !== (data.qty * data.highPrice).toString()){
                if (data.appraisalLineInternalId) {
                  data.isAppLineEdited = true;
                }
                if(data.qty){
                  data.highPrice = Number(this.value / data.qty);
                  data.extHighPrice = data.highPrice * data.qty;
                }
                self.setState({ saveEnabled: true })
                row.dispatch(['highPrice'], col);
              }
            }
          }
          return input;
        },
        sort: 'extHighPrice',
        id: 'extHighPrice',
      },
      {
        name: 'Last Updated',
        width: 120,
        render: function(data){
          if(data.lastUpdated){
            var lastUpdatedDate = new Date(data.lastUpdated);
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return lastUpdatedDate.getDate() + ' ' + months[lastUpdatedDate.getMonth()] + ' ' +  lastUpdatedDate.getFullYear();

          } else {
            return '';
          }
        },
        id: 'lastUpdated',
        sort: 'lastUpdatedDateForSort'
      },
      {
        name: 'Update By',
        width: 160,
        render: function(data){
          return '<div class="text-ellipsis">' + data.lastUsed + '</div>';
        },
        id: 'updateBy',
        sort: 'lastUsed'
      },
      {
        name: 'ItemID',
        width: 80,
        render: 'SKU',
        id: 'itemID'
      },
      {
        name: 'ID',
        width: 110,
        render: 'appLineId',
        id: 'applineid',
        sort: 'appLineId'
      },
      {
        name: 'Consignor Location',
        width: 180,
        className: 'input',
        render: function(data){
          var input = document.createElement('input');
          input.setAttribute('type', 'text');
          //input.className = 'tab';
          input.value = data.consignorLocation || previousConsignorLocation;
          tabIndexCount += 7;
          input.tabIndex = tabIndexCount;
          tabIndexCount++;
          input.oninput = function(){
            if (data.appraisalLineInternalId) {
              data.isAppLineEdited = true;
            }
            data.consignorLocation = this.value;
            previousConsignorLocation = this.value;
            self.setState({ saveEnabled: true });
          }
          input.onfocus = function(){
            this.select();
          }
          return input;
        },
        id: 'consignorLocation',
      },
      {
        name: 'Provenance',
        width: 100,
        className: 'input',
        render: function(data){
          var input = document.createElement('input');
          input.setAttribute('type', 'text');
          //input.className = 'tab';
          input.tabIndex = tabIndexCount;
          tabIndexCount++;
          input.value = data.provenance;
          input.oninput = function(){
            if (data.appraisalLineInternalId) {
              data.isAppLineEdited = true;
            }
            data.provenance = this.value;
            self.setState({ saveEnabled: true });
          }
          input.onfocus = function(){
            this.select();
          }
          return input;
        },
        id: 'provenance',
      },
      {
        name: 'Screener',
        width: 80,
        className: 'input',
        render: function(data){
          var input = document.createElement('input');
          input.setAttribute('type', 'text');
          //input.className = 'tab';
          input.tabIndex = tabIndexCount;
          tabIndexCount++;
          input.value = data.screener;
          input.oninput = function(){
            if(data.appraisalLineInternalId) {
              data.isAppLineEdited = true;
            }
            data.screener = this.value;
            self.setState({ saveEnabled: true });
          }
          input.onfocus = function(){
            this.select();
          }
          return input;
        },
        id: 'screener',
      },
      {
        name: 'Event',
        width: 80,
        className: 'input',
        render: function(data){
          var input = document.createElement('input');
          input.setAttribute('type', 'text');
          //input.className = 'tab';
          input.tabIndex = tabIndexCount;
          tabIndexCount++;
          input.value = data.event;
          input.oninput = function(){
            if (data.appraisalLineInternalId) {
              data.isAppLineEdited = true;
            }
            data.event = this.value;
            self.setState({ saveEnabled: true });
          }
          input.onfocus = function(){
            this.select();
          }
          return input;
        },
        id: 'event',
      },
      {
        name: 'Photo Number',
        width: 130,
        className: 'input',
        render: function(data){
          var input = document.createElement('input');
          input.setAttribute('type', 'text');
          //input.className = 'tab';
          input.tabIndex = tabIndexCount;
          tabIndexCount++;
          input.value = data.photoNumber;
          input.oninput = function(){
            if (data.appraisalLineInternalId) {
              data.isAppLineEdited = true;
            }
            data.photoNumber = this.value;
            self.setState({ saveEnabled: true });
          }
          input.onfocus = function(){
            this.select();
          }
          return input;
        },
        id: 'photoNumber',
      },
    ],
    filter: function(data, search, filters){
      for (var property in filters){
        if (!filters[property][data[property]]){
          return false;
        }
      }
      if (search === ''){
        return true;
      }
      if (search){
        var searchFilters = search.split(/\%/gim);
        if (Zachys.LevenshteinArias(searchFilters[0], data.name.toLowerCase()) || searchFilters[0] === ''){
          if (searchFilters.length > 1) {
            if (searchFilters.length === 3){

              if (data.vintage.toString().search(searchFilters[2]) === -1 && searchFilters[2] !== ''){
                return false;
              }
            }
            if (searchFilters.length >= 2){
              if (data.size.toString().search(searchFilters[1]) && searchFilters[1] !== ''){
                return false;
              }
            }
          }
          return true;
        }
        return false;
      }
      return true;
    },
    bind: ['qty', 'lowPrice', 'highPrice', 'estType'],
    appLinesRowsPerPage: 50,
    onChange: function(){
      var qty = 0;
      var lowPrice = 0;
      var highPrice = 0;
      // var items = self.UI.tableLines.items;
      // for (var iItem = 0; iItem < items.length; iItem++) {
      //   qty += items[iItem].data.qty;
      //   lowPrice += items[iItem].data.qty * items[iItem].data.lowPrice;
      //   highPrice += items[iItem].data.qty * items[iItem].data.highPrice;
      // }
      // self.setState({
      //   totalBottles: qty,
      //   totalLowPrice: lowPrice,
      //   totalHighPrice: highPrice,
      // });
    }
  });

  this.UI['table-lines'].appendChild(this.UI.tableLines.holder);

  Ozine.addState(this);
  this.setState({
    internalid:  window.appraisalInfoData.appraisalInternalid,
    consignor:  window.appraisalInfoData.appraisalConsignor,
    appraisalNumber:  window.appraisalInfoData.appraisalName,
    totalBottles:  window.appraisalInfoData.appraisalQtySum,
    totalLowPrice:  window.appraisalInfoData.appraisalLinesExtBottleLowRoundedSum,
    totalHighPrice:  window.appraisalInfoData.appraisalLinesExtBottleHighRoundedSum,
    currency:  window.appraisalInfoData.appraisalCurrency,
  });

  if(window.appraisalLinesInfoData){
    this.setState({ saveEnabled: true })
    for (var i = 0; i < window.appraisalLinesInfoData.length; i++){
      this.UI.tableLines.addItem(window.appraisalLinesInfoData[i]);
    }

  }
}
Zachys.Stock.REVIEW = 'review';
Zachys.Stock.SELECT_LP = 'select-lp';
Zachys.Stock.prototype.setData = function(data){
  var dict = {};
  for (var iData = 0; iData < data.length; iData++){
    dict[data[iData].id] = data[iData];
  }

  for (var iWine = 0; iWine < this.UI.wines.length; iWine++) {
    this.UI.wines[iWine].setData(dict[this.UI.wines[iWine].data.SKU]);
  }
}


Zachys.Stock.prototype.onState = function(state) {
  if (state.hasOwnProperty('saveEnabled')){
    this.UI.buttons.create.classList[!state.saveEnabled ? 'add' : 'remove']('disabled');
  }
  if (state.hasOwnProperty('totalBottles') || state.consignor) {
    var html = '';
    html += '<div><span id="app-info-internalid" style="display: none;">' + this.state.internalid + '</span></div>';
    html += '<div><b>Consignor: </b><span id="app-info-consignor">' + this.state.consignor + '</span></div>';
    html += '<div><b>Appraisal #: </b><span id="app-info-name">' + this.state.appraisalNumber + '</span></div>';
    html += '<div><b>Total Bottles: </b><span id="app-info-total-bottles">' + this.state.totalBottles + '</span></div>';
    html += '<div><b>Total Low Price: </b><span id="app-info-low-price">' + '$' + Math.round(this.state.totalLowPrice).toLocaleString() + '</span></div>';
    html += '<div><b>Total High Price: </b><span id="app-info-high-price">' + '$' + Math.round(this.state.totalHighPrice).toLocaleString() + '</span></div>';
    html += '<div><span id="app-info-currency" style="display: none;">' + this.state.currency + '</span></div>';
    this.UI.summary.innerHTML = '';
    this.UI.summary.appendChild(Ozine.DOM(html))
  }
}
Zachys.LevenshteinArias = function(a, b){
  var distance = a.length - (b.length - Zachys.Levenshtein(a, b));
  if (distance > 2) {
    return 0;
  }
  if (a.length <= 3){
    return (b.toLowerCase().search(a.toLowerCase()) >= 0 ? a.length : 0);
  }

  var chars = {}
  var acc = {}
  for (var iChar = 0; iChar < a.length; iChar++){
    chars[a[iChar]] = (chars[a[iChar]] || 0) + 1;
    acc[a[iChar]] = 0;
  }

  for (var iChar = 0; iChar < Math.min(b.length, a.length + 2); iChar++){
    acc[b[iChar]] = (acc[b[iChar]] || 0) + 1;
  }
  var hits = 0;
  for (var property in chars){
    hits += Math.min(acc[property] || 0, chars[property] || 0);
  }
  if (hits >= a.length - 2){
    var dist = Zachys.Levenshtein(a, b.substr(0, a.length + 2));
    if (dist < 4){
      return a.length - dist;
    }
  }
  var range = a.length + 2;
  for (var iChar = range; iChar < b.length; iChar++){
    if (acc[b[iChar]] < chars[b[iChar]]){
      hits++;
    }
    if (acc[b[iChar - range]] <= chars[b[iChar - range]]){
      hits--;
    }
    acc[b[iChar]] = (acc[b[iChar]] || 0) + 1;
    acc[b[iChar - range]] = acc[b[iChar - range]] - 1;

    var dist = Zachys.Levenshtein(a, b.substr(iChar - range + 1, a.length + 2));
    if (dist < 4){
      return a.length - dist;
    }
  }

  return 0;
}
Zachys.Levenshtein = function(a, b){
  if(a.length == 0) return b.length;
  if(b.length == 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }
  return matrix[b.length][a.length];
};
Zachys.Filter = function(type){
  var self = this;
  this.UI = {};
  var html = '';
  html += '<div class="filters">';
  html += '  <div class="code-input" ref="code" style="">';
  html += '    <b>' + SVG.Search + '</b>'
  if(type){
    if(type == 'name'){
      html += '<input type="text" class="filter-name" id="filter-name-id" ref="search" placeholder="Wine name">';

    } else if(type == 'vintage') {
      html += '<input type="text" class="filter-vintage" id="filter-vintage-id" ref="search" placeholder="Vintage">';

    } else if(type == 'size'){
      html += '<input type="text" class="filter-size" id="filter-size-id" ref="search" placeholder="Size">';
      
    } else if(type == 'SKU'){
      html += '<input type="text" class="filter-SKU" id="filter-sku-id" ref="search" placeholder="SKU">';

    }
  } else {
    html += '<input type="text" ref="search" placeholder="Wine name">';
  }
  html += '  </div>';
  html += '</div>';
  this.state = {};
  this.holder = Ozine.DOM(html, this.UI);
  this.UI.search.oninput = function(){
    self.onChange && self.onChange(self.UI.search.value);
  }
}
Zachys.Filter.prototype.reset = function(){
  this.state.search = '';
  this.UI.search.value = '';
}
Zachys.Filter.prototype.getData = function(){
  return {
    search: this.UI.search.value,
  }
}

Zachys.Stock.LicensePlate = function(data){
  var self = this;
  this.UI = {};
  var html = '';
  html += '<div class="item">';
  html += '  <u>';
  html += '    <b class="button" ref="button" style="width:60px; text-align: center;">Add</b>';
  html += '  </u>';
  html += '  <span ref="id">3</span>';
  html += '  <i ref="wines"></i>';
  html += '  <span class="button-holder">';

  html += '  </span>';
  html += '</div>';
  this.holder = Ozine.DOM(html, this.UI, true);
  this.data = data;


  this.UI.id.innerHTML = data.size;
  this.UI.button.onclick = function(){
    self.setState({ added: !self.state.added });
    self.onSelect && self.onSelect();
  }

  var wine = document.createElement('div');
  wine.innerHTML = "<b>" + data.vintage + "</b><b>" + data.qty + "</b><b class='column-name'>" + data.name + ' ' + data.size + ' (' +  data.vintage + ')' + "</b><b class='column-low-price'>" + this.price(data.lowPrice) + "</b><b class='column-high-price'>" + this.price(data.highPrice) + "</b><b class='column-country'>" + data.country + "</b><b class='column-region'>" + data.region + "</b><b class='column-class'>" + data.class + "</b><b class='column-apellation'>" + data.apellation + "</b><b class='column-producer'>" + data.producer + "</b>";
  this.UI.wines.appendChild(wine);



  Ozine.addState(this);
  this.state = {
    filter: true
  }
}
Zachys.Stock.LicensePlate.prototype.price = function(price){
  return '$' + Math.round(price).toLocaleString();
}
Zachys.Stock.LicensePlate.prototype.preview = function(preview){
  this.setState({ preview:preview });
}
Zachys.Stock.LicensePlate.prototype.filter = function(term, id, filters){
  // id, lot
  var match = {
    country: false,
    region: false,
    class: false,
    apellation: false,
    producer: false,
  };
  var wines = this.data.wines;
  for (var iWine = 0; iWine < wines.length; iWine++){
    var wine = wines[iWine];
    if (match.country && match.region && match.class && match.apellation && match.producer){
      continue;
    }
    if (!match.country){
      match.country = filters.country[wine.country];
    }
    if (!match.region){
      match.region = filters.region[wine.region];
    }
    if (!match.class){
      match.class = filters.class[wine.class];
    }
    if (!match.apellation){
      match.apellation = filters.apellation[wine.apellation];
    }
    if (!match.producer){
      match.producer = filters.producer[wine.producer];
    }
  }
  if (!match.country || !match.region || !match.class || !match.apellation || !match.producer){
    this.setState({filter: false});
    return false;
  }

  if (term === '' && id === ''){
    this.setState({filter: true});
    return true;
  }



  if (id){
    id = id.toString();
    if (this.data.id.toString().search(id) >= 0){
      this.setState({filter: true});
      return true;
    }
    if (this.data.lot.toString().search(id) >= 0){
      this.setState({filter: true});
      return true;
    }
  }
  if (term){
    var wines = this.data.wines;
    for (var iWine = 0; iWine < wines.length; iWine++){
      var wine = wines[iWine];

      if (wine.SKU.search(term) >= 0){
        this.setState({filter: true});
        return true;
      } else if (Zachys.LevenshteinArias(term, wine.name.toLowerCase())){
        this.setState({filter: true });
        return true;
      }
    }
  }
  this.setState({filter: false });
}
Zachys.Stock.LicensePlate.prototype.onState = function(state){
  if (state.hasOwnProperty('added')){
    this.UI.button.innerHTML = state.added ? 'Remove' : 'Add'
    this.holder.classList[state.added ? 'add' : 'remove']('selected');
  }
  if (state.hasOwnProperty('preview')){
    this.holder.classList[state.preview ? 'add' : 'remove']('preview');
    if (state.preview){
      if (this.state.added){
        if (this.state.filter){
          this.parentNode.appendChild(this.holder);
        } else{
          if (this.holder.parentNode){
            this.parentNode.removeChild(this.holder);
          }
        }
      } else if (this.holder.parentNode){
        this.parentNode.removeChild(this.holder);
      }
    } else {
      if (this.state.filter){
        this.parentNode.appendChild(this.holder);
      } else{
        if (this.holder.parentNode){
          this.parentNode.removeChild(this.holder);
        }
      }
    }
  } else if (state.hasOwnProperty('filter')){
    if (state.filter){
      this.parentNode.appendChild(this.holder);
    } else{
      if (this.holder.parentNode){
        this.parentNode.removeChild(this.holder);
      }
    }
  }
}


Zachys.Stock.HammerPrices = function(){
  this.UI = {};
  this.popup = new Zachys.Popup({ width: 700, height: 500, title: 'Hammer Prices'});
  this.UI.title = this.popup.UI.title;
  this.UI.tablePrices = new Zachys.Table.Table({
    columns: [
      {
        name: 'Date',
        width: 90,
        render: function(data){
          if(data.auctionDate){
            var auctionDate = new Date(data.auctionDate);
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return auctionDate.getDate() + ' ' + months[auctionDate.getMonth()] + ' ' +  auctionDate.getFullYear();

          } else {
            return '';
          }
        },
        sort: 'date',
      },
      {
        name: 'Bottles',
        width: 80,
        render: 'bottlesQty',
        sort: 'bottlesQty',
      },
      {
        name: 'Hammer',
        width: 80,
        render: function(data){
          return '$' + Math.round(data.hammer).toLocaleString();
        },
        sort: 'hammer',
      },
      {
        name: 'Btl Low',
        width: 80,
        render: function(data){
          return '$' + Math.round(data.bottleLowPrice).toLocaleString();
        },
        sort: 'bottleLowPrice',
      },
      {
        name: 'Btl High',
        width: 80,
        render: function(data){
          return '$' + Math.round(data.bottlerHighPrice).toLocaleString();
        },
        sort: 'bottlerHighPrice',
      },
      {
        name: 'Hammer per bottle',
        width: 150,
        render: 'hammerPerBottle'
      },
      {
        name: 'Auction',
        width: 100,
        render: 'auctionName'
      },
    ],
  });
  this.popup.UI.container.appendChild(this.UI.tablePrices.holder);
}
Zachys.Stock.HammerPrices.prototype.show = function(name, hammerPriceArr){
  this.popup.UI.holder.style.display = '';
  this.UI.title.innerHTML = "Hammer Prices:" + name;
  if(hammerPriceArr){
    this.UI.tablePrices.clear();
    for (var iPrice = 0; iPrice < hammerPriceArr.length; iPrice++){
      this.UI.tablePrices.addItem(hammerPriceArr[iPrice]);
    }
    
  }
}


Zachys.Stock.OrderColumns = function(){
  var self = this;
  this.UI = {};
  this.popup = new Zachys.Popup({ width: 320, height: 546, title: 'Re-Order Columns'});
  var html = '';
  html += '<div class="reorder-columns" ref="holder">';
  html += '  <div class="list" ref="list">';
  html += '  </div>'
  html += '</div>';


  var columns = [
    {
      name: 'Vintage',
      id: 'vintage',
    },
    {
      name: 'Size',
      id: 'size',
    },    
    {
      name: 'Btl Low',
      id: 'lowPrice',
    },
    {
      name: 'Btl High',
      id: 'highPrice'
    },
    {
      name: 'Cs Low',
      id: 'caseLowPrice',
    },
    {
      name: 'Cs High',
      id: 'caseHighPrice',
    },
    {
      name: 'Ext Low',
      id: 'extLowPrice',
    },
    {
      name: 'Ext High',
      id: 'extHighPrice',
    },
    {
      name: 'Last Updated',
      id: 'lastUpdated',
    },
    {
      name: 'Update By',
      id: 'updateBy',
    },
    {
      name: 'Last Used',
      id: 'lastUsed',
    },
    {
      name: 'ItemID',
      id: 'itemID'
    },
    {
      name: 'ID',
      id: 'applineid'
    },
    {
      name: 'Consignor Location',
      id: 'consignorLocation',
    },
    {
      name: 'Provenance',
      id: 'provenance',
    },
    {
      name: 'Screener',
      id: 'screener',
    },
    {
      name: 'Event',
      id: 'event',
    },
    {
      name: 'Photo Number',
      id: 'photoNumber',
    },
  ]
 

  this.popup.UI.container.appendChild(Ozine.DOM(html, this.UI));

  for (var iCol = 0; iCol < columns.length; iCol++){
    var column = columns[iCol];
    column.show = true;
    var html = '';
    html += '<div class="dragItem" ref="item"><div>';
    html += '  <b class="chbx selected" ref="chbx"></b>';
    html += '  <span>' + column.name + '</span>';
    html += '</div></div>';

    var UI = {};

    this.UI.list.appendChild(Ozine.DOM(html, UI));
    UI.chbx.column = column;
    UI.chbx.onclick = function(){
      this.column.show = !this.column.show;
      this.classList[this.column.show ? 'add' : 'remove']('selected');
      self.onChange && self.onChange(self.getData());
    }
    UI.item.UI = UI;
    UI.item.data = column;
    UI.item.onmousedown = function(event){
      Ozine.UI.reorder(this, event, function(){
        self.onChange && self.onChange(self.getData());
      })
    }
  }
}
Zachys.Stock.OrderColumns.prototype.getData = function(){
  var columns = this.UI.list.children;
  var data = [];
  for (var iCol = 0; iCol < columns.length; iCol++){
    if (columns[iCol].data.show){
      data.push(columns[iCol].data.id);
    }
  }
  return data;
}
Zachys.Stock.OrderColumns.prototype.show = function(data){
  this.popup.UI.holder.style.display = '';
}

Zachys.Stock.addSingleAppraisalLineAndUpdateLines = function (data, existingLinesdata, callback) {
  Zachys.Stock.startLoader();
  var objAppraisal = {};
  var dataToSend = {};
  objAppraisal.appraisalId = window.appraisalInfoData.appraisalInternalid;
  objAppraisal.appraisalConsignmentId = window.appraisalInfoData.appraisalConsignmentId;
  objAppraisal.appraisalCurrency = window.appraisalInfoData.appraisalCurrency;

  dataToSend.objAppraisal = objAppraisal;
  dataToSend.appraisalLinesData = data;
  dataToSend.existingLinesdata = existingLinesdata;
  var xhr = new XMLHttpRequest();
  var url = window.suiteletUrl + "&requestType=addOrUpdateAppraisalLine";
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(dataToSend));
  xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          Zachys.Stock.endLoader();
          var objResponse = JSON.parse(xhr.responseText); 
          if(callback){
            callback(objResponse) ;
          }

      } else {
          if (xhr.responseText) {
              var objResponse = JSON.parse(xhr.responseText);
              if (objResponse.detail) {
                  console.log("Error message: ", objResponse.detail);
              }

          }
          Zachys.Stock.endLoader();
          return {};
      }
  }

}

Zachys.Stock.updateAppraisalLines = function (data) {
  Zachys.Stock.startLoader();
  var objAppraisal = {};
  var dataToSend = {};
  objAppraisal.appraisalId = window.appraisalInfoData.appraisalInternalid;
  objAppraisal.appraisalConsignmentId = window.appraisalInfoData.appraisalConsignmentId;
  objAppraisal.appraisalCurrency = window.appraisalInfoData.appraisalCurrency

  dataToSend.objAppraisal = objAppraisal;
  dataToSend.appraisalLinesData = data;
  var xhr = new XMLHttpRequest();
  var url = window.suiteletUrl + "&requestType=updateAppraisalLine";
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(dataToSend));
  xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          var objResponse = JSON.parse(xhr.responseText);  
          Zachys.Stock.endLoader();  
          location.reload();  

      } else {
          if (xhr.responseText) {
              var objResponse = JSON.parse(xhr.responseText);
              if (objResponse.detail) {
                  console.log("Error message: ", objResponse.detail);
              }

          }
          Zachys.Stock.endLoader();
          location.reload();
          return {};
      }
  }

}

Zachys.Stock.removeAppraisalLine = function (appraisalLineInternalId) {
  Zachys.Stock.startLoader();
  var dataToSend = {};
  dataToSend.appraisalLinesToRemove = [appraisalLineInternalId];
  dataToSend.appraisalId = window.appraisalInfoData.appraisalInternalid;
  var xhr = new XMLHttpRequest();
  var url = window.suiteletUrl + "&requestType=removeappraisalline";
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(dataToSend));
  xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          var objResponse = JSON.parse(xhr.responseText);
          Zachys.Stock.updateAppraisalInfo(objResponse.appraisalInfoData);
          Zachys.Stock.endLoader();

      } else {
          if (xhr.responseText) {
              Zachys.Stock.endLoader();
              var objResponse = JSON.parse(xhr.responseText);
              if (objResponse.detail) {
                  console.log("Error message: ", objResponse.detail);
              }
          }

      }
  }

}

Zachys.Stock.updateAppraisalInfo = function (objAppraisalData) {
  document.getElementById("app-info-total-bottles").textContent = '$' + Math.round(objAppraisalData.appraisalQtySum).toLocaleString();
  document.getElementById("app-info-low-price").textContent = '$' + Math.round(objAppraisalData.appraisalLinesExtBottleLowRoundedSum).toLocaleString();
  document.getElementById("app-info-high-price").textContent = '$' + Math.round(objAppraisalData.appraisalLinesExtBottleHighRoundedSum).toLocaleString();
}

Zachys.Stock.getHammerPrice = function (itemInternalId, callback) {
  Zachys.Stock.startLoader();
  var xhr = new XMLHttpRequest();
  var url = window.suiteletUrl + "&requestType=hammerprice&itemInternalId=" + itemInternalId;
  xhr.open('GET', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
  xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          Zachys.Stock.endLoader();
          var objResponse = JSON.parse(xhr.responseText); 
          if(callback){
            callback(objResponse) ;
          }

      } else {
          if (xhr.responseText) {
              var objResponse = JSON.parse(xhr.responseText);
              if (objResponse.detail) {
                  console.log("Error message: ", objResponse.detail);
              }

          }
          Zachys.Stock.endLoader();
          return {};
      }
  }

}

Zachys.Stock.getItemsDetail = function (starIndex, endIndex) {
  var description = document.getElementById("filter-name-id").value;
  var vintage = document.getElementById("filter-vintage-id").value;
  var size = document.getElementById("filter-size-id").value;
  var sku = document.getElementById("filter-sku-id").value;
  description = description ? description : '';
  vintage = vintage ? vintage : '';
  size = size ? size : '';
  sku = sku ? sku : '';
  var dataToSend = {};
  dataToSend.description = description;
  dataToSend.vintage = vintage;
  dataToSend.size = size;
  dataToSend.sku = sku;
  Zachys.Stock.startLoader();
  var xhr = new XMLHttpRequest();
  var url = window.suiteletUrl + "&requestType=getitemsinformation&starIndex=" + starIndex + "&endIndex=" + endIndex;
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(dataToSend));
  xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          var objResponse = JSON.parse(xhr.responseText);
          if(objResponse.type == "Success"){
            var itemsDataArr = objResponse.itemsDataArr;
            var totalNumberOfItems = objResponse.totalNumberOfItems;
            if(itemsDataArr){
              UI_TABLE_OBJ.settings.totalNumberOfItems = totalNumberOfItems;
              if(itemsDataArr.length > 0){
                UI_TABLE_OBJ.clear();
              }
              starIndex = parseInt(starIndex);
              endIndex = parseInt(endIndex);
              for (var i = 0; i < itemsDataArr.length; i++){
                UI_TABLE_OBJ.addItem(itemsDataArr[i]);
              }
              
            }

          }

      } else {
          if (xhr.responseText) {
              var objResponse = JSON.parse(xhr.responseText);
              if (objResponse.detail) {
                  console.log("Error message: ", objResponse.detail);
              }

          }
          Zachys.Stock.endLoader();
          return {};
      }
  }

}

Zachys.Stock.startLoader = function() {
  var loaderSpin = document.getElementById("loader-spin");
  loaderSpin.classList.add("lds-spinner");
  var loaderInn = document.getElementById("loader-inn");
  loaderInn.classList.add("loader-inner");
}
Zachys.Stock.endLoader = function() {
  var loaderSpin = document.getElementById("loader-spin");
  loaderSpin.classList.remove("lds-spinner");
  var loaderInn = document.getElementById("loader-inn");
  loaderInn.classList.remove("loader-inner");
}