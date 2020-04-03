var Zachys = Zachys || {};
var PACKAGE_TYPE_OWC = 1;
var CODE_TYPE_PACKAGING = '1';
var SVG = {};
var countValue = 1;
SVG.Checkmark = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16 checkmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>';
SVG.Search = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>';
SVG.ArrowUp = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg>';

Zachys.Stock = function () {
  var self = this;
  this.UI = {};
  var html = '';
  html += '<div class="select-item" ref="consigmentLines">';
  html += '  <div class="header"><div>';
  html += '    <h1 ref="title">Select License Plates</h1>';
  html += '    <div ref="filterHolder"></div>'
  html += '  </div></div>';
  html += '  <div class="headers">';
  html += '    <span class="item-lot" ref="sort.lot">Pre-Lot#<i>&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-lp" ref="sort.lp">LP#<i>&nbsp;' + SVG.ArrowUp + '</i></span>';
  //html += '    <span class="item-sku">SKU</span>';
  html += '    <span class="item-qty" ref="sort.qtysort">Qty<i>&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-low-price" ref="sort.lowsort">Low<i>&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-high-price" ref="sort.highsort">High<i>&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-description">LP Contents</span>';
  html += '    <span class="item-country" ref="filters.countryname"><span>Country</span></span>';
  html += '    <span class="item-region" ref="filters.regionname"><span>Region</span></span>';
  html += '    <span class="item-class" ref="filters.classnametext"><span>Class</span></span>';
  html += '    <span class="item-apellation" ref="filters.apellationname"><span>Apellation</span></span>';
  html += '    <span class="item-apellation" ref="filters.vintage"><span>Vintage</span></span>';
  html += '    <span class="item-producer" ref="filters.producername"><span>Producer</span></span>';
  html += '  </div>';
  html += '  <div class="content">';
  html += '    <div class="product-line" ref="products"></div>';
  html += '  </div>';
  html += '  <div class="footer">';
  html += '    <div class="buttons">';
  html += '      <b class="button secondary" ref="buttons.cancel">Cancel</b>';
  html += '      <b class="button" ref="buttons.review">Review StockID</b>';
  html += '      <b class="button secondary" ref="buttons.back">Back</b>';
  html += '      <b class="button" ref="buttons.create">Create StockID</b>';
  html += '      <b class="button" ref="buttons.createeachline">Create StockID for each line</b>';
  html += '    </div>';
  html += '  </div>';
  html += '</div>';

  this.holder = Ozine.DOM(html, this.UI);


  var products = WINES_CATALOG;

  this.UI.wines = [];

  this.state = {};

  this.UI.filter = new Zachys.Filter();
  this.UI.filter.onChange = function (search, id) {
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++) {
      self.UI.wines[iWine].filter(search, id, filters);
    }
  }
  this.UI.filterHolder.appendChild(this.UI.filter.holder);

  var countryname = {};
  var regionname = {};
  var classnametext = {};
  var apellationname = {};
  var vintage = {};
  var producername = {};

  for (var iProduct = 0; iProduct < LPs.length; iProduct++) {
    var product = new Zachys.Stock.LicensePlate(LPs[iProduct]);
    product.onSelect = function () {

    }

    var wines = LPs[iProduct].wines;
    for (var iWine = 0; iWine < wines.length; iWine++) {
      var wine = wines[iWine];
      countryname[wine.countryname] = true;
      regionname[wine.regionname] = true;
      classnametext[wine.classnametext] = true;
      apellationname[wine.apellationname] = true;
      vintage[wine.vintage] = true;
      producername[wine.producername] = true;
    }


    this.UI.wines.push(product);
    product.parentNode = this.UI.products;
    this.UI.products.appendChild(product.holder);
  }

  this.UI.sort.lot.onclick = function () {
    if (self.state.sort == 'lot') {
      self.setState({
        sortDirection: self.state.sortDirection == 1 ? -1 : 1
      })
    } else {
      self.setState({
        sort: 'lot',
        sortDirection: 1
      })
    }

  }
  this.UI.sort.qtysort.onclick = function () {
    if (self.state.sort == 'qtysort') {
      self.setState({
        sortDirection: self.state.sortDirection == 1 ? -1 : 1
      })
    } else {
      self.setState({
        sort: 'qtysort',
        sortDirection: 1
      })
    }

  }
  this.UI.sort.lp.onclick = function () {
    if (self.state.sort == 'lp') {
      self.setState({
        sortDirection: self.state.sortDirection == 1 ? -1 : 1
      })
    } else {
      self.setState({
        sort: 'lp',
        sortDirection: 1
      })
    }
  }
  this.UI.sort.lowsort.onclick = function () {
    if (self.state.sort == 'lowsort') {
      self.setState({
        sortDirection: self.state.sortDirection == 1 ? -1 : 1
      })
    } else {
      self.setState({
        sort: 'lowsort',
        sortDirection: 1
      })
    }
  }
  this.UI.sort.highsort.onclick = function () {
    if (self.state.sort == 'highsort') {
      self.setState({
        sortDirection: self.state.sortDirection == 1 ? -1 : 1
      })
    } else {
      self.setState({
        sort: 'highsort',
        sortDirection: 1
      })
    }
  }

  this.UI.buttons.review.onclick = function () {
    self.setState({
      mode: Zachys.Stock.REVIEW
    });
  };
  this.UI.buttons.back.onclick = function () {
    self.setState({
      mode: Zachys.Stock.SELECT_LP
    });
  };

  var filters = {
    countryname: countryname,
    regionname: regionname,
    classnametext: classnametext,
    apellationname: apellationname,
    vintage: vintage,
    producername: producername,
  }
  var countryFilter = new Zachys.Table.HeaderDD(this.UI.filters.countryname, countryname);
  countryFilter.onChange = function (countryname) {
    filters.countryname = countryname;
    var data = self.UI.filter.getData();
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++) {
      self.UI.wines[iWine].filter(data.search, data.lot, filters);
    }
  }
  var regionFilter = new Zachys.Table.HeaderDD(this.UI.filters.regionname, regionname);
  regionFilter.onChange = function (regionname) {
    filters.regionname = regionname;
    var data = self.UI.filter.getData();
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++) {
      self.UI.wines[iWine].filter(data.search, data.lot, filters);
    }
  }
  var classFilter = new Zachys.Table.HeaderDD(this.UI.filters.classnametext, classnametext);
  classFilter.onChange = function (classnametext) {
    filters.classnametext = classnametext;
    var data = self.UI.filter.getData();
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++) {
      self.UI.wines[iWine].filter(data.search, data.lot, filters);
    }
  }
  var apellationFilter = new Zachys.Table.HeaderDD(this.UI.filters.apellationname, apellationname);
  apellationFilter.onChange = function (apellationname) {
    filters.apellationname = apellationname;
    var data = self.UI.filter.getData();
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++) {
      self.UI.wines[iWine].filter(data.search, data.lot, filters);
    }
  }
  var vintageFilter = new Zachys.Table.HeaderDD(this.UI.filters.vintage, vintage);
  vintageFilter.onChange = function (vintage) {
    filters.vintage = vintage;
    var data = self.UI.filter.getData();
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++) {
      self.UI.wines[iWine].filter(data.search, data.lot, filters);
    }
  }
  var producerFilter = new Zachys.Table.HeaderDD(this.UI.filters.producername, producername);
  producerFilter.onChange = function (producername) {
    filters.producername = producername;
    var data = self.UI.filter.getData();
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++) {
      self.UI.wines[iWine].filter(data.search, data.lot, filters);
    }
  }

  this.UI.buttons.create.onclick = function () {
    var stockIdsData = Zachys.Stock.getStockidsData();
    var validateItemsObj = Zachys.Stock.validateSameItemLps(stockIdsData);

    if (validateItemsObj.isSameType == true) {
      Zachys.Stock.createOrUpdateRecord(validateItemsObj.updatedStockIdsData, "refreshpage", true, false);

    } else if (stockIdsData.length == 1) {
      var calculatedInfoArr = [];

      if (stockIdsData[0].linesdata && stockIdsData[0].linesdata.length == 1) {
        var tempStockData = Zachys.Stock.getSingleLineCreationData(stockIdsData[0])
        calculatedInfoArr.push(tempStockData);
        Zachys.Stock.createOrUpdateRecord(calculatedInfoArr, "refreshpage", true, false);
      } else {
        var tempDataArr = Zachys.Stock.getMixedCreationData(stockIdsData);
        calculatedInfoArr.push(tempDataArr[0]);
        Zachys.Stock.createOrUpdateRecord(calculatedInfoArr, "refreshpage", false, false);
      }


    } else {
      if (stockIdsData.length > 1) {
        var tempDataArr = Zachys.Stock.getMixedCreationData(stockIdsData);
        Zachys.Stock.createOrUpdateRecord(tempDataArr, "refreshpage", false, false);

      }

    }
  };

  this.UI.buttons.createeachline.onclick = function () {
    var calculatedInfoArrSingle = [];
    var calculatedInfoArrMixed = [];
    var r = confirm("Are you sure, you want to create a StockID for each LP? You cannot undo this action.");
    if (r == true) {
      var stockIdsData = Zachys.Stock.getStockidsData();
      if (stockIdsData.length > 0) {
        for (var i = 0; i < stockIdsData.length; i++) {
          if (stockIdsData[i].linesdata && stockIdsData[i].linesdata.length == 1) {
            var tempStockData = Zachys.Stock.getSingleLineCreationData(stockIdsData[i])
            calculatedInfoArrSingle.push(tempStockData);

          } else {
            var tempArr = [];
            tempArr.push(stockIdsData[i]);
            var tempDataArr = Zachys.Stock.getMixedCreationData(tempArr);
            calculatedInfoArrMixed.push(tempDataArr[0]);

          }
        }

      }
      var obj = {};
      obj.stockIdsDataSingle = calculatedInfoArrSingle;
      obj.stockIdsDataMixed = calculatedInfoArrMixed;
      var tempArr = [];
      tempArr.push(obj)
      Zachys.Stock.createOrUpdateRecord(tempArr, "refreshpage", true, true);
    }
  };


  Ozine.addState(this);
  this.setState({
    mode: Zachys.Stock.SELECT_LP,
    sort: 'lot',
    sortDirection: -1
  });
}
Zachys.Stock.REVIEW = 'review';
Zachys.Stock.SELECT_LP = 'select-lp';
Zachys.Stock.prototype.setData = function (data) {
  var dict = {};
  for (var iData = 0; iData < data.length; iData++) {
    dict[data[iData].id] = data[iData];
  }

}
Zachys.Table = {}
Zachys.Table.HeaderDD = function (cell, filter) {
  var self = this;
  var button = cell.children[0];

  var popup = document.createElement('div');
  popup.style.display = 'none';
  popup.className = 'popup';
  cell.appendChild(popup);
  Ozine.UI.popupize(button, popup);

  popup.content = document.createElement('div');
  popup.appendChild(popup.content);

  var values = {};

  for (var property in filter) {
    var filterDiv = document.createElement('div');
    filterDiv.className = 'selected';
    filterDiv.innerHTML = (property === '') ? 'Unset' : property;
    values[property] = true;
    filterDiv.property = property;
    filterDiv.onclick = function () {
      values[this.property] = !values[this.property];
      this.classList[values[this.property] ? 'add' : 'remove']('selected');
      self.onChange && self.onChange(values);
    }
    popup.content.appendChild(filterDiv);
  }
}

Zachys.Stock.prototype.onState = function (state) {
  if (state.mode) {
    this.UI.buttons.cancel.style.display = state.mode === Zachys.Stock.SELECT_LP ? '' : 'none';
    this.UI.buttons.review.style.display = state.mode === Zachys.Stock.SELECT_LP ? '' : 'none';
    this.UI.buttons.createeachline.style.display = state.mode === Zachys.Stock.SELECT_LP ? '' : 'none';

    this.UI.buttons.back.style.display = state.mode === Zachys.Stock.REVIEW ? '' : 'none';
    this.UI.buttons.create.style.display = state.mode === Zachys.Stock.REVIEW ? '' : 'none';

    if (state.mode === Zachys.Stock.SELECT_LP) {
      this.UI.title.innerHTML = "Select License Plates";
    } else {
      this.UI.title.innerHTML = "Review & Create StockID";
    }


    for (var iWine = 0; iWine < this.UI.wines.length; iWine++) {
      this.UI.wines[iWine].preview(state.mode === Zachys.Stock.REVIEW)
    }
    this.holder.classList[state.mode === Zachys.Stock.REVIEW ? 'add' : 'remove']('preview');
  }
  if (state.sort || state.sortDirection) {
    this.UI.sort.lot.classList.remove('sort-asc');
    this.UI.sort.lot.classList.remove('sort-desc');
    if (this.state.sort === 'lot') {
      if (this.state.sortDirection === 1) {
        this.UI.sort.lot.classList.add('sort-asc');
      } else {
        this.UI.sort.lot.classList.add('sort-desc');
      }
    }
    this.UI.sort.qtysort.classList.remove('sort-asc');
    this.UI.sort.qtysort.classList.remove('sort-desc');
    if (this.state.sort === 'qtysort') {
      if (this.state.sortDirection === 1) {
        this.UI.sort.qtysort.classList.add('sort-asc');
      } else {
        this.UI.sort.qtysort.classList.add('sort-desc');
      }
    }

    this.UI.sort.lp.classList.remove('sort-asc');
    this.UI.sort.lp.classList.remove('sort-desc');
    if (this.state.sort === 'lp') {
      if (this.state.sortDirection === 1) {
        this.UI.sort.lp.classList.add('sort-asc');
      } else {
        this.UI.sort.lp.classList.add('sort-desc');
      }
    }

    this.UI.sort.lowsort.classList.remove('sort-asc');
    this.UI.sort.lowsort.classList.remove('sort-desc');
    if (this.state.sort === 'lowsort') {
      if (this.state.sortDirection === 1) {
        this.UI.sort.lowsort.classList.add('sort-asc');
      } else {
        this.UI.sort.lowsort.classList.add('sort-desc');
      }
    }

    this.UI.sort.highsort.classList.remove('sort-asc');
    this.UI.sort.highsort.classList.remove('sort-desc');
    if (this.state.sort === 'highsort') {
      if (this.state.sortDirection === 1) {
        this.UI.sort.highsort.classList.add('sort-asc');
      } else {
        this.UI.sort.highsort.classList.add('sort-desc');
      }
    }
    var self = this;
    this.UI.wines.sort(function (a, b) {
      var direction = self.state.sortDirection;
      if (self.state.sort == 'lot') {
        if (a.data.lot > b.data.lot) {
          return 1 * direction;
        }
        if (a.data.lot < b.data.lot) {
          return -1 * direction;
        }
        return 0;
      }
      if (self.state.sort == 'qtysort') {
        if (a.data.qtySum > b.data.qtySum) {
          return 1 * direction;
        }
        if (a.data.qtySum < b.data.qtySum) {
          return -1 * direction;
        }
        return 0;
      }
      if (self.state.sort == 'lp') {
        if (a.data.id > b.data.id) {
          return 1 * direction;
        }
        if (a.data.id < b.data.id) {
          return -1 * direction;
        }
        return 0;
      }
      if (self.state.sort == 'lowsort') {
        if (a.data.lowPriceSum > b.data.lowPriceSum) {
          return 1 * direction;
        }
        if (a.data.lowPriceSum < b.data.lowPriceSum) {
          return -1 * direction;
        }
        return 0;
      }
      if (self.state.sort == 'highsort') {
        if (a.data.highPriceSum > b.data.highPriceSum) {
          return 1 * direction;
        }
        if (a.data.highPriceSum < b.data.highPriceSum) {
          return -1 * direction;
        }
        return 0;
      }
      return 0;
    })
    for (var iWine = 0; iWine < this.UI.wines.length; iWine++) {
      if (this.UI.wines[iWine].holder.parentNode) {
        this.UI.products.appendChild(this.UI.wines[iWine].holder);
      }

    }
  }


}
Zachys.LevenshteinArias = function (a, b) {
  var distance = a.length - (b.length - Zachys.Levenshtein(a, b));
  if (distance > 2) {
    return 0;
  }
  if (a.length <= 3) {
    return (b.toLowerCase().search(a.toLowerCase()) >= 0 ? a.length : 0);
  }

  var chars = {}
  var acc = {}
  for (var iChar = 0; iChar < a.length; iChar++) {
    chars[a[iChar]] = (chars[a[iChar]] || 0) + 1;
    acc[a[iChar]] = 0;
  }

  for (var iChar = 0; iChar < Math.min(b.length, a.length + 2); iChar++) {
    acc[b[iChar]] = (acc[b[iChar]] || 0) + 1;
  }
  var hits = 0;
  for (var property in chars) {
    hits += Math.min(acc[property] || 0, chars[property] || 0);
  }
  if (hits >= a.length - 2) {
    var dist = Zachys.Levenshtein(a, b.substr(0, a.length + 2));
    if (dist < 4) {
      return a.length - dist;
    }
  }
  var range = a.length + 2;
  for (var iChar = range; iChar < b.length; iChar++) {
    if (acc[b[iChar]] < chars[b[iChar]]) {
      hits++;
    }
    if (acc[b[iChar - range]] <= chars[b[iChar - range]]) {
      hits--;
    }
    acc[b[iChar]] = (acc[b[iChar]] || 0) + 1;
    acc[b[iChar - range]] = acc[b[iChar - range]] - 1;

    var dist = Zachys.Levenshtein(a, b.substr(iChar - range + 1, a.length + 2));
    if (dist < 4) {
      return a.length - dist;
    }
  }

  return 0;
}
Zachys.Levenshtein = function (a, b) {
  if (a.length == 0) return b.length;
  if (b.length == 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1)); // deletion
      }
    }
  }
  return matrix[b.length][a.length];
};
Zachys.Filter = function () {
  var self = this;
  this.UI = {};
  var html = '';
  html += '<div class="filters">';
  html += '  <div class="code-input" ref="lot" style="">';
  html += '    <b>' + SVG.Search + '</b>'
  html += '    <input type="text" ref="searchLot" placeholder="Lot #, LP #">';
  html += '  </div>';
  html += '  <div class="code-input" ref="code" style="">';
  html += '    <b>' + SVG.Search + '</b>'
  html += '    <input type="text" ref="search" placeholder="Wine name">';
  html += '  </div>';
  html += '</div>';
  this.holder = Ozine.DOM(html, this.UI);
  this.UI.search.oninput = function () {
    self.onChange && self.onChange(self.UI.search.value, self.UI.searchLot.value);
  }
  this.UI.searchLot.oninput = function () {
    self.onChange && self.onChange(self.UI.search.value, self.UI.searchLot.value);
  }
}
Zachys.Filter.prototype.getData = function () {
  return {
    search: this.UI.search.value,
    lot: this.UI.searchLot.value
  }
}

Zachys.Stock.LicensePlate = function (data) {
  var self = this;
  this.UI = {};
  var html = '';
  html += '<div id="auc-plate-lines-' + countValue + '" class="item">';
  html += '  <u>';
  html += '    <b class="button" ref="button" style="width:60px; text-align: center;">Add</b>';
  html += '  </u>';
  html += '  <span id="auc-plate-lines-lot-' + countValue + '" ref="lot"></span>';
  html += '  <span id="auc-plate-lines-id-' + countValue + '" ref="id"></span>';
  html += '   <div style="display: none;">';
  html += '  <span id="auc-plate-lines-consignor-' + countValue + '" ref="consignor"></span>';
  html += '  <span id="auc-plate-lines-auctionplateinternalid-' + countValue + '" ref="internalid"></span>';
  html += '  <span id="auc-plate-lines-consignmentid-' + countValue + '" ref="consignmentid"></span>';
  html += '  <span id="auc-plate-lines-reserve-' + countValue + '" ref="reserve"></span>';
  html += '  <span id="auc-plate-lines-reserve-owc-' + countValue + '" ref="reserveowc"></span>';
  html += '  <span id="auc-plate-lines-currency-' + countValue + '" ref="currency"></span>';
  html += '    </div>';
  html += '  <i ref="wines"></i>';
  html += '  <span class="button-holder">';
  html += '  </span>';
  html += '</div>';
  this.holder = Ozine.DOM(html, this.UI, true);
  this.data = data;

  this.UI.lot.innerHTML = data.lot;
  this.UI.id.innerHTML = data.id;
  this.UI.consignor.innerHTML = data.consignor;
  this.UI.consignmentid.innerHTML = data.consignmentid;
  this.UI.reserve.innerHTML = data.reserve
  this.UI.reserveowc.innerHTML = data.reserveowc
  this.UI.currency.innerHTML = data.currency
  this.UI.internalid.innerHTML = data.internalid;
  this.UI.button.onclick = function () {
    self.setState({
      added: !self.state.added
    });
    self.onSelect && self.onSelect();
  }

  var wines = data.wines;
  var qtySum = 0,
    lowPriceSum = 0,
    highPriceSum = 0;
  for (var iWine = 0; iWine < wines.length; iWine++) {
    qtySum += wines[iWine].qty ? parseInt(wines[iWine].qty) : 0;
    lowPriceSum += wines[iWine].lowPrice ? parseFloat(wines[iWine].lowPrice) : 0.0;
    highPriceSum += wines[iWine].highPrice ? parseFloat(wines[iWine].highPrice) : 0.0;
    var assessmentCodes = wines[iWine].assessmentcodes ? wines[iWine].assessmentcodes + ', ' : '';
    var assessmentFFT = wines[iWine].assessmentfft ? wines[iWine].assessmentfft + ', ' : '';
    var internalNotes = wines[iWine].internalnotes ? wines[iWine].internalnotes : '';
    var allCodes = assessmentCodes + assessmentFFT + internalNotes;
    var wine = document.createElement('div');
    wine.innerHTML = "<b style='display: none; id='auc-plate-lines-sku-" + countValue + "-" + iWine + "' >" + wines[iWine].SKU + "</b><b id='auc-plate-lines-qty-" +
      countValue + "-" + iWine + "' >" + wines[iWine].qty + "</b><b class='column-low-price' ref='low' id='auc-plate-lines-lowPrice-" + countValue + "-" + iWine + "' >" +
      wines[iWine].lowPrice + "</b> <b class='column-high-price' ref='high' id='auc-plate-lines-highPrice-" + countValue + "-" + iWine + "' >" +
      wines[iWine].highPrice + "</b> <b class='column-name' id='auc-plate-lines-name-" + countValue + "-" + iWine + "' >" + wines[iWine].name + ' ' +
      "<span id='auc-plate-lines-size-" + countValue + "-" + iWine + "' style='display: none;' >" + wines[iWine].size + "</span>" +
      "<span id='auc-plate-lines-vintage-" + countValue + "-" + iWine + "' style='display: none;' > (" + wines[iWine].vintage + ") </span><br/><i>" + allCodes + "</i> </b> <b class='column-country'>" + wines[iWine].countryname +
      "</b> <b class='column-region'>" + wines[iWine].regionname + "</b>  <b class='column-class' >" + wines[iWine].classnametext +
      "</b> <b class='column-apellation'>" + wines[iWine].apellationname + "</b> <b class='column-apellation'>" + wines[iWine].vintage + "</b><b class='column-producer' >" + wines[iWine].producername + "</b> <b style='display: none;' id='auc-plate-lines-vintageid-" + countValue + "-" + iWine + "' >" + wines[iWine].vintageid + "</b> <b style='display: none;' id='auc-plate-lines-sizeid-" +
      countValue + "-" + iWine + "' >" + wines[iWine].sizeid + "</b> <b style='display: none;' id='auc-plate-lines-platelineid-" +
      countValue + "-" + iWine + "' >" + wines[iWine].platelineid + "</b> <b style='display: none;' id='auc-plate-lines-varietal-" +
      countValue + "-" + iWine + "' >" + wines[iWine].varietal + "</b> <b style='display: none;' id='auc-plate-lines-country-" +
      countValue + "-" + iWine + "' >" + wines[iWine].country + "</b> <b style='display: none;' id='auc-plate-lines-apellation-" +
      countValue + "-" + iWine + "' >" + wines[iWine].apellation + "</b> <b style='display: none;' class='column-producer' id='auc-plate-lines-producer-" +
      countValue + "-" + iWine + "' >" + wines[iWine].producer + "</b> <b style='display: none;' class='column-class' id='auc-plate-lines-itemclass-" +
      countValue + "-" + iWine + "' >" + wines[iWine].class + "</b> <b style='display: none;' class='column-region' id='auc-plate-lines-region-" +
      countValue + "-" + iWine + "' >" + wines[iWine].region + "</b> <b style='display: none;' class='column-criticnote' id='auc-plate-lines-criticnote-" +
      countValue + "-" + iWine + "' >" + wines[iWine].criticnote + "</b> <b style='display: none;' class='column-sizeDescriptionid' id='auc-plate-lines-sizeDescriptionid-" +
      countValue + "-" + iWine + "' >" + wines[iWine].sizeDescriptionid + "</b> <b style='display: none;' class='column-intendedsale' id='auc-plate-lines-intendedsale-" +
      countValue + "-" + iWine + "' >" + wines[iWine].intendedsale + "</b> <b style='display: none;' class='column-lpPhoto' id='auc-plate-lines-lpPhoto-" +
      countValue + "-" + iWine + "' >" + wines[iWine].lpPhoto + "</b> <b style='display: none;' class='column-itemid' id='auc-plate-lines-itemid-" +
      countValue + "-" + iWine + "' >" + wines[iWine].itemid + "</b> <b style='display: none;' class='column-itemid' id='auc-plate-lines-auction-display-name-" +
      countValue + "-" + iWine + "' >" + wines[iWine].auctiondisplayname + "</b> <b style='display: none;' class='column-itemid' id='auc-plate-lines-assessment-code-" +
      countValue + "-" + iWine + "' >" + assessmentCodes + "</b> <b style='display: none;' class='column-itemid' id='auc-plate-lines-assessment-fft-" +
      countValue + "-" + iWine + "' >" + assessmentFFT + "</b> <b style='display: none;' class='column-itemid' id='auc-plate-lines-package-type-id-" +
      countValue + "-" + iWine + "' >" + wines[iWine].packagetypeid + "</b>";

    this.UI.wines.appendChild(wine);
  }

  var total = document.createElement('div');
  total.className = 'total';
  qtySum = qtySum != 0 ? qtySum : '';
  data.qtySum = qtySum;
  data.lowPriceSum = lowPriceSum;
  data.highPriceSum = highPriceSum;
  total.innerHTML = "<span style='position: relative; left: -65px;'>Total</span><span style='position: relative;left: -33px;'>" + qtySum + "</span><span style='width: 64px;' id='lp-low-total-" + countValue + "'>" + this.price(lowPriceSum) + "</span><b id='lp-high-total-" + countValue + "'>" + this.price(highPriceSum) + "</b><b></b>";

  /*
  country, region, class, apellation, producer
  Producer
  Class
  Country
  Region
  Appellation
  Varietal
  */
  this.UI.wines.appendChild(total);


  countValue++;
  Ozine.addState(this);
  this.state = {
    filter: true
  }
}
Zachys.Stock.LicensePlate.prototype.price = function (price) {
  return '$' + Math.round(price).toLocaleString();
}
Zachys.Stock.LicensePlate.prototype.preview = function (preview) {
  this.setState({
    preview: preview
  });
}
Zachys.Stock.LicensePlate.prototype.filter = function (term, id, filters) {
  // id, lot
  var match = {
    countryname: false,
    regionname: false,
    classnametext: false,
    apellationname: false,
    vintage: false,
    producername: false,
  };
  var wines = this.data.wines;
  for (var iWine = 0; iWine < wines.length; iWine++) {
    var wine = wines[iWine];
    if (match.countryname && match.regionname && match.classnametext && match.apellationname && match.vintage && match.producername) {
      continue;
    }
    if (!match.countryname) {
      match.countryname = filters.countryname[wine.countryname];
    }
    if (!match.regionname) {
      match.regionname = filters.regionname[wine.regionname];
    }
    if (!match.classnametext) {
      match.classnametext = filters.classnametext[wine.classnametext];
    }
    if (!match.apellationname) {
      match.apellationname = filters.apellationname[wine.apellationname];
    }
    if (!match.vintage) {
      match.vintage = filters.vintage[wine.vintage];
    }
    if (!match.producername) {
      match.producername = filters.producername[wine.producername];
    }
  }
  if (!match.countryname || !match.regionname || !match.classnametext || !match.apellationname || !match.vintage || !match.producername) {
    this.setState({
      filter: false
    });
    return false;
  }

  if (term === '' && id === '') {
    this.setState({
      filter: true
    });
    return true;
  }



  if (id) {
    id = id.toString();
    if (this.data.id.toString().search(id) >= 0) {
      this.setState({
        filter: true
      });
      return true;
    }
    if (this.data.lot.toString().search(id) >= 0) {
      this.setState({
        filter: true
      });
      return true;
    }
  }
  if (term) {
    var wines = this.data.wines;
    for (var iWine = 0; iWine < wines.length; iWine++) {
      var wine = wines[iWine];
      // if (wine.SKU.search(term) >= 0){
      //   this.setState({filter: true});
      //   return true;
      // } else 

      var isNotTermExist = true;
      if (term) {
        isNotTermExist = false;
        var splitTermValue = term.split('%');
        for (var i = 0; i < splitTermValue.length; i++) {
          if (splitTermValue[i].length < 3) {
            // if (Zachys.LevenshteinArias(splitTermValue[i], wine.name.toString().toLowerCase())) {
            //   isNotTermExist = true;
            // }

          } else {

            if (wine.name.toString().toLowerCase().indexOf(splitTermValue[i]) != -1) {
              isNotTermExist = true;
            } else {
              isNotTermExist = false;
              break;
            }
          }

        }

      }

      // if (Zachys.LevenshteinArias(term, wine.name.toLowerCase())) {
      //   this.setState({
      //     filter: true
      //   });
      //   return true;
      // }

      if (isNotTermExist) {
        this.setState({
          filter: isNotTermExist
        });
        return true;
      }
    }
  }
  this.setState({
    filter: false
  });
}
Zachys.Stock.LicensePlate.prototype.onState = function (state) {
  if (state.hasOwnProperty('added')) {
    this.UI.button.innerHTML = state.added ? 'Remove' : 'Add'
    this.holder.classList[state.added ? 'add' : 'remove']('selected');
  }
  if (state.hasOwnProperty('preview')) {
    this.holder.classList[state.preview ? 'add' : 'remove']('preview');
    if (state.preview) {
      if (this.state.added) {
        if (this.state.filter) {
          this.parentNode.appendChild(this.holder);
        } else {
          if (this.holder.parentNode) {
            this.parentNode.removeChild(this.holder);
          }
        }
      } else if (this.holder.parentNode) {
        this.parentNode.removeChild(this.holder);
      }
    } else {
      if (this.state.filter) {
        this.parentNode.appendChild(this.holder);
      } else {
        if (this.holder.parentNode) {
          this.parentNode.removeChild(this.holder);
        }
      }
    }
  } else if (state.hasOwnProperty('filter')) {
    if (state.filter) {
      this.parentNode.appendChild(this.holder);
    } else {
      if (this.holder.parentNode) {
        this.parentNode.removeChild(this.holder);
      }
    }
  }
}

Zachys.Stock.getSingleLineCreationData = function (stockIdsData) {
  var assessmentCodes = stockIdsData.linesdata[0].assessmentCode;
  var assessmentCode = assessmentCodes ? Zachys.Stock.calculateSumOfSameCode(assessmentCodes, false) : [];
  var assessmentFfts = stockIdsData.linesdata[0].assessmentFft;
  var assessmentFft = assessmentFfts ? Zachys.Stock.calculateSumOfSameCode(assessmentFfts, false) : [];
  stockIdsData.packagetypeid = stockIdsData.linesdata[0].packagetypeid;
  var assessmentNote = assessmentCode.concat(assessmentFft);
  Zachys.Stock.sortList(assessmentNote, false);
  var strData = Zachys.Stock.getJoinOfAssessmentNote(assessmentNote, false);
  stockIdsData.assessmentNote = strData;
  stockIdsData.mixLotDeatils = '';
  return stockIdsData;
}

Zachys.Stock.getMixedCreationData = function (stockIdsData) {
  var tempObjInfo = {};
  var tempDataArr = [];
  var tempAucplateinternalid = [];
  var assessmentCodes = [];
  var assessmentFfts = [];
  var packTypeId = '';
  var country, itemclass, producer, sizeid, sizeDescriptionid, region, apellation, varietal, vintageid, itemid;
  var isNotMixedData = false;

  var QUANTITY_SUM = 0;
  for (var i = 0; i < stockIdsData.length; i++) {
    tempAucplateinternalid.push(stockIdsData[i].aucplateinternalid);
    if (stockIdsData[i].linesdata) {
      for (var j = 0; j < stockIdsData[i].linesdata.length; j++) {
        var tempQty = stockIdsData[i].linesdata[j].quantity ? stockIdsData[i].linesdata[j].quantity : 0;
        QUANTITY_SUM += parseInt(tempQty);

        if (!country) {
          country = stockIdsData[i].linesdata[j].country;
        } else if (country != stockIdsData[i].linesdata[j].country && country != -999) {
          country = -999;
          isNotMixedData = true;
        }

        if (!itemclass) {
          itemclass = stockIdsData[i].linesdata[j].itemclass;
        } else if (itemclass != stockIdsData[i].linesdata[j].itemclass && itemclass != -999) {
          itemclass == -999;
          isNotMixedData = true;
        }


        if (!producer) {
          producer = stockIdsData[i].linesdata[j].producer;
        } else if (producer != stockIdsData[i].linesdata[j].producer && producer != -999) {
          producer = -999;
          isNotMixedData = true;
        }

        if (!sizeid) {
          sizeid = stockIdsData[i].linesdata[j].sizeid;
        } else if (sizeid != stockIdsData[i].linesdata[j].sizeid && sizeid != -999) {
          sizeid = -999;
          isNotMixedData = true;
        }

        if (!sizeDescriptionid) {
          sizeDescriptionid = stockIdsData[i].linesdata[j].sizeDescriptionid;
        } else if (sizeDescriptionid != stockIdsData[i].linesdata[j].sizeDescriptionid && sizeDescriptionid != -999) {
          sizeDescriptionid = -999;
          isNotMixedData = true;
        }

        if (!region) {
          region = stockIdsData[i].linesdata[j].region;
        } else if (region != stockIdsData[i].linesdata[j].region && region != -999) {
          region = -999;
          isNotMixedData = true;
        }

        if (!apellation) {
          apellation = stockIdsData[i].linesdata[j].apellation;
        } else if (apellation != stockIdsData[i].linesdata[j].apellation && apellation != -999) {
          apellation == -999;
          isNotMixedData = true;
        }

        if (!varietal) {
          varietal = stockIdsData[i].linesdata[j].varietal;
        } else if (varietal != stockIdsData[i].linesdata[j].varietal && varietal != -999) {
          varietal = -999
          isNotMixedData = true;
        }

        if (!vintageid) {
          vintageid = stockIdsData[i].linesdata[j].vintageid;
        } else if (vintageid != stockIdsData[i].linesdata[j].vintageid && vintageid != -999) {
          vintageid = -999
          isNotMixedData = true;
        }

        if (!itemid) {
          itemid = stockIdsData[i].linesdata[j].itemid;
        } else if (itemid != stockIdsData[i].linesdata[j].itemid && itemid != -999) {
          itemid = -999;
          isNotMixedData = true;
        }

        if (stockIdsData[i].linesdata[j].packagetypeid && packTypeId != PACKAGE_TYPE_OWC) {
          packTypeId = Zachys.Stock.getMixPackTypeId(stockIdsData[i].linesdata[j].packagetypeid);
        }

        if (stockIdsData[i].linesdata[j].assessmentCode.length > 0) {
          assessmentCodes = assessmentCodes.concat(stockIdsData[i].linesdata[j].assessmentCode);
        }

        if (stockIdsData[i].linesdata[j].assessmentFft.length > 0) {
          assessmentFfts = assessmentFfts.concat(stockIdsData[i].linesdata[j].assessmentFft);
        }
      }
    }
  }

  var assessmentCode = assessmentCodes ? Zachys.Stock.calculateSumOfSameCode(assessmentCodes, true) : [];
  var assessmentFft = assessmentFfts ? Zachys.Stock.calculateSumOfSameCode(assessmentFfts, true) : [];
  var assessmentNote = assessmentCode.concat(assessmentFft);
  Zachys.Stock.sortList(assessmentNote, true);

  tempObjInfo.country = country;
  tempObjInfo.itemclass = itemclass;
  tempObjInfo.producer = producer;
  tempObjInfo.sizeid = sizeid;
  tempObjInfo.sizeDescriptionid = sizeDescriptionid;
  tempObjInfo.region = region;
  tempObjInfo.apellation = apellation;
  tempObjInfo.varietal = varietal;
  tempObjInfo.vintageid = vintageid;
  tempObjInfo.itemid = itemid;
  tempObjInfo.packagetypeid = packTypeId;
  tempObjInfo.consignor = stockIdsData[0].consignor;
  tempObjInfo.consignmentid = stockIdsData[0].consignmentid;
  tempObjInfo.reserve = stockIdsData[0].reserve;
  tempObjInfo.reserveowc = stockIdsData[0].reserveowc;
  tempObjInfo.currency = stockIdsData[0].currency;
  tempObjInfo.aucplateinternalidsarray = tempAucplateinternalid;
  tempObjInfo.qtysum = QUANTITY_SUM;
  tempObjInfo.estematehigh = stockIdsData[0].estimatehightotal || stockIdsData[0].estematehigh;
  tempObjInfo.estimatelow = stockIdsData[0].estimatelowtotal || stockIdsData[0].estimatelow;
  tempObjInfo.assessmentNote = assessmentNote;
  tempDataArr.push(tempObjInfo);

  var strObjData = Zachys.Stock.getJoinOfMixedLotAssessmentNote(tempDataArr[0].assessmentNote);
  tempDataArr[0].assessmentNote = strObjData.assessmentStr;
  tempDataArr[0].mixLotDeatils = isNotMixedData ? stockIdsData[0].mixLotDeatils : "";

  return tempDataArr;
}

Zachys.Stock.getStockidsData = function () {
  var i = 1;
  var objDataArr = [];
  var highTotal = 0;
  var lowTotal = 0;
  var mixLotArrData = [];
  while (i <= countValue) {

    var j = 0;
    var obj = {};
    obj.aucplateinternalid = document.getElementById("auc-plate-lines-auctionplateinternalid-" + i) ? document.getElementById("auc-plate-lines-auctionplateinternalid-" + i).innerHTML : '';
    var tempHighTotal = document.getElementById("lp-high-total-" + i) ? document.getElementById("lp-high-total-" + i).innerHTML.replace('$', '').replace(/,/, '') : 0;
    var tempLowTotal = document.getElementById("lp-low-total-" + i) ? document.getElementById("lp-low-total-" + i).innerHTML.replace('$', '').replace(/,/, '') : 0;
    highTotal += parseFloat(tempHighTotal);
    lowTotal += parseFloat(tempLowTotal);

    obj.estematehigh = tempHighTotal;
    obj.estimatelow = tempLowTotal;
    obj.estimatelowtotal = '';
    obj.estimatehightotal = '';

    if (obj.aucplateinternalid) {

      obj.lotnumber = document.getElementById("auc-plate-lines-lot-" + i) ? document.getElementById("auc-plate-lines-lot-" + i).innerHTML : '';
      obj.licenseplate = document.getElementById("auc-plate-lines-id-" + i) ? document.getElementById("auc-plate-lines-id-" + i).innerHTML : '';
      obj.consignor = document.getElementById("auc-plate-lines-consignor-" + i) ? document.getElementById("auc-plate-lines-consignor-" + i).innerHTML : '';
      obj.consignmentid = document.getElementById("auc-plate-lines-consignmentid-" + i) ? document.getElementById("auc-plate-lines-consignmentid-" + i).innerHTML : '';
      obj.reserve = document.getElementById("auc-plate-lines-reserve-" + i) ? document.getElementById("auc-plate-lines-reserve-" + i).innerHTML : '';
      obj.reserveowc = document.getElementById("auc-plate-lines-reserve-owc-" + i) ? document.getElementById("auc-plate-lines-reserve-owc-" + i).innerHTML : '';
      obj.currency = document.getElementById("auc-plate-lines-currency-" + i) ? document.getElementById("auc-plate-lines-currency-" + i).innerHTML : '';

      obj.linesdata = [];
      while (j != -999) {
        var objInfo = {};
        var aucplatelineiteminternalid = document.querySelector("#auc-plate-lines-platelineid-" + i + "-" + j);
        var sku = document.querySelector("#auc-plate-lines-sku-" + i + "-" + j);
        var quantity = document.querySelector("#auc-plate-lines-qty-" + i + "-" + j);
        var description = document.querySelector("#auc-plate-lines-name-" + i + "-" + j);
        var vintage = document.querySelector("#auc-plate-lines-vintage-" + i + "-" + j);
        var vintageid = document.querySelector("#auc-plate-lines-vintageid-" + i + "-" + j);
        var size = document.querySelector("#auc-plate-lines-size-" + i + "-" + j);
        var sizeid = document.querySelector("#auc-plate-lines-sizeid-" + i + "-" + j);
        var producer = document.querySelector("#auc-plate-lines-producer-" + i + "-" + j);
        var region = document.querySelector("#auc-plate-lines-region-" + i + "-" + j);
        var apellation = document.querySelector("#auc-plate-lines-apellation-" + i + "-" + j);
        var varietal = document.querySelector("#auc-plate-lines-varietal-" + i + "-" + j);
        var itemclass = document.querySelector("#auc-plate-lines-itemclass-" + i + "-" + j);
        var country = document.querySelector("#auc-plate-lines-country-" + i + "-" + j);
        var criticNote = document.querySelector("#auc-plate-lines-criticnote-" + i + "-" + j);
        var sizeDescriptionid = document.querySelector("#auc-plate-lines-sizeDescriptionid-" + i + "-" + j);
        var intendedsaleHtml = document.querySelector("#auc-plate-lines-intendedsale-" + i + "-" + j);
        var lpPhotoHtml = document.querySelector("#auc-plate-lines-lpPhoto-" + i + "-" + j);
        var itemid = document.querySelector("#auc-plate-lines-itemid-" + i + "-" + j);
        var tempAssessmentCode = document.querySelector("#auc-plate-lines-assessment-code-" + i + "-" + j);
        var tempAssessmentFft = document.querySelector("#auc-plate-lines-assessment-fft-" + i + "-" + j);
        var auctionDisplayName = document.querySelector("#auc-plate-lines-auction-display-name-" + i + "-" + j);
        var packageTypeId = document.querySelector("#auc-plate-lines-package-type-id-" + i + "-" + j);

        if (aucplatelineiteminternalid) {
          objInfo.aucplatelineiteminternalid = aucplatelineiteminternalid ? aucplatelineiteminternalid.innerHTML : '';
          objInfo.sku = sku ? sku.innerHTML : '';
          objInfo.quantity = quantity ? quantity.innerHTML : '';
          objInfo.description = description ? description.innerHTML : '';
          objInfo.vintage = vintage ? vintage.innerHTML : '';
          objInfo.vintageid = vintageid ? vintageid.innerHTML : '';
          objInfo.size = size ? size.innerHTML : '';
          objInfo.sizeid = sizeid ? sizeid.innerHTML : '';
          objInfo.producer = producer ? producer.innerHTML : '';
          objInfo.region = region ? region.innerHTML : '';
          objInfo.apellation = apellation ? apellation.innerHTML : '';
          objInfo.varietal = varietal ? varietal.innerHTML : '';
          objInfo.itemclass = itemclass ? itemclass.innerHTML : '';
          objInfo.country = country ? country.innerHTML : '';
          objInfo.criticnote = criticNote ? criticNote.innerHTML : '';
          objInfo.sizeDescriptionid = sizeDescriptionid ? sizeDescriptionid.innerHTML : '';
          objInfo.itemid = itemid ? itemid.innerHTML : '';
          objInfo.assessmentFft = tempAssessmentFft ? tempAssessmentFft.innerHTML : '';
          objInfo.assessmentCode = tempAssessmentCode ? tempAssessmentCode.innerHTML : '';
          objInfo.auctionDisplayName = auctionDisplayName ? auctionDisplayName.innerHTML : '';
          objInfo.packagetypeid = packageTypeId ? packageTypeId.innerHTML : '';
          objInfo.auctionDisplayName = auctionDisplayName ? auctionDisplayName.innerHTML : '';

          var intendedsale = intendedsaleHtml ? intendedsaleHtml.innerHTML : '';
          var lpPhoto = lpPhotoHtml ? lpPhotoHtml.innerHTML : '';

          var tempQty = objInfo.quantity ? objInfo.quantity + ' ' : '';
          var tempSize = objInfo.size ? objInfo.size + ' ' : '';
          var strMixDetail = '- ' + tempQty + tempSize + objInfo.auctionDisplayName + '\n';
          mixLotArrData.push(strMixDetail);

          var qtyValue = objInfo.quantity ? objInfo.quantity : 0;
          if (objInfo.assessmentCode) {
            var noteObjectData = Zachys.Stock.getCodeObjectData(objInfo.assessmentCode, qtyValue, objInfo.auctionDisplayName, objInfo.size, objInfo.itemid);
            objInfo.assessmentCode = noteObjectData;
          }

          if (objInfo.assessmentFft) {
            var fftObjectData = Zachys.Stock.getNoteObjectData(objInfo.assessmentFft, qtyValue, objInfo.auctionDisplayName, objInfo.size, objInfo.itemid);
            objInfo.assessmentFft = fftObjectData;
          }

          if (!obj.intendedsale && intendedsale) {
            obj.intendedsale = intendedsale;
          }

          if (!obj.lpPhoto && lpPhoto) {
            obj.lpPhoto = lpPhoto;
          }

          obj.linesdata.push(objInfo);

          j++;
        } else {
          j = -999;

        }


      }


      objDataArr.push(obj);
    }

    i++;


  }

  if (objDataArr.length > 0) {
    objDataArr[0].mixLotDeatils = mixLotArrData.length > 0 ? mixLotArrData.join('') : '';
    objDataArr[0].estimatehightotal = highTotal;
    objDataArr[0].estimatelowtotal = lowTotal;
  }
  return objDataArr;
}

Zachys.Stock.createOrUpdateRecord = function (stockCreationData, nextAction, isEachLine, isContainCombination) {
  Zachys.Stock.startLoader();
  var objData = {};
  objData.eachline = isEachLine;
  objData.isContainCombination = isContainCombination;
  objData.data = stockCreationData;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', window.suiteletUrl);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(objData));
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var objResponse = JSON.parse(xhr.responseText);
      if (objResponse.type == "Success" && nextAction == "refreshpage") {
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
      }
      if (objResponse.type == "Success" && nextAction == "closetab") {
        Zachys.Stock.endLoader();
        close();

      } else {
        if (xhr.responseText) {
          var objResponse = JSON.parse(xhr.responseText);
          if (objResponse.detail) {
            console.log("Error message: ", objResponse.detail);
          }
        }
        Zachys.Stock.endLoader();
        location.reload();
      }
    } else {
      if (xhr.responseText) {
        var objResponse = JSON.parse(xhr.responseText);
        if (objResponse.detail) {
          console.log("Error message: ", objResponse.detail);
        }

      }
      Zachys.Stock.endLoader();
      location.reload();
    }
  }

}

Zachys.Stock.getJoinOfAssessmentNote = function (assessmentNoteArr) {
  var arrayData = [];
  if (assessmentNoteArr && assessmentNoteArr.length > 0) {
    var isPackagingType = assessmentNoteArr[0].packType == CODE_TYPE_PACKAGING ? true : false;
    for (var k = 0; k < assessmentNoteArr.length; k++) {
      if (assessmentNoteArr[k]) {

        var codeQtyInWords = (assessmentNoteArr[k].codeQty && assessmentNoteArr[k].codeQty != 0) ? Zachys.Stock.convertNumberToWords(assessmentNoteArr[k].codeQty).trim() + ' ' : '';
        var addComma = (assessmentNoteArr.length != k + 1) ? ', ' : '';
        var transformedText = (parseInt(assessmentNoteArr[k].codeQty) > 1 && assessmentNoteArr[k].transformedTextPlural) ? assessmentNoteArr[k].transformedTextPlural : assessmentNoteArr[k].transformedText;
        var tempCode = codeQtyInWords.toLocaleLowerCase() + transformedText.trim().toLocaleLowerCase() + addComma;

        if (isPackagingType && assessmentNoteArr[k].packType != CODE_TYPE_PACKAGING) {
          arrayData[arrayData.length - 1] = arrayData[arrayData.length - 1];
          arrayData[arrayData.length - 1] = arrayData[arrayData.length - 1].substring(0, arrayData[arrayData.length - 1].length - 2)
          arrayData[arrayData.length - 1] = arrayData[arrayData.length - 1] + '\n';
          isPackagingType = false;
        }

        arrayData.push(tempCode);

      }
    }

  }


  return arrayData.length > 0 ? arrayData.join("") : '';
}

Zachys.Stock.getJoinOfMixedLotAssessmentNote = function (assessmentNoteArr) {
  var arrayData = [];

  if (assessmentNoteArr && assessmentNoteArr.length > 0) {
    var isPackagingType = assessmentNoteArr[0].packType == CODE_TYPE_PACKAGING ? true : false;
    var itemId = assessmentNoteArr[0].itemId;
    var isItemAdded = false;
    for (var k = 0; k < assessmentNoteArr.length; k++) {
      if (assessmentNoteArr[k]) {
        var addComma = (assessmentNoteArr.length != k + 1) ? ', ' : '';
        var strInfo = '';
        var lineBreak = '';
        var codeQtyInWords = (assessmentNoteArr[k].codeQty && assessmentNoteArr[k].codeQty != 0) ? Zachys.Stock.convertNumberToWords(assessmentNoteArr[k].codeQty).trim() + ' ' : '';

        if (itemId != assessmentNoteArr[k].itemId) {
          itemId = assessmentNoteArr[k].itemId;
          isItemAdded = false;
          isPackagingType = assessmentNoteArr[0].packType == CODE_TYPE_PACKAGING ? true : false;
          lineBreak = '\n\n';
        }

        if (!isItemAdded) {
          var quantity = assessmentNoteArr[k].quantity + ' ';
          var description = assessmentNoteArr[k].auctionDisplayName.trim() + ' ';
          var size = assessmentNoteArr[k].size.trim() + ' ';

          strInfo = lineBreak + quantity + size + description + '\n';
          isItemAdded = true;
          if (arrayData.length > 0) {
            arrayData[arrayData.length - 1] = arrayData[arrayData.length - 1];
            arrayData[arrayData.length - 1] = arrayData[arrayData.length - 1].substring(0, arrayData[arrayData.length - 1].length - 2);

          }
        }

        var strConcatenatedCode = strInfo + codeQtyInWords.toLocaleLowerCase() + assessmentNoteArr[k].transformedText.trim().toLocaleLowerCase().toLocaleLowerCase() + addComma;
        if (isPackagingType && assessmentNoteArr[k].packType != CODE_TYPE_PACKAGING) {
          arrayData[arrayData.length - 1] = arrayData[arrayData.length - 1];
          arrayData[arrayData.length - 1] = arrayData[arrayData.length - 1].substring(0, arrayData[arrayData.length - 1].length - 2)
          arrayData[arrayData.length - 1] = arrayData[arrayData.length - 1] + '\n';
          isPackagingType = false;

        }

        arrayData.push(strConcatenatedCode);

      }
    }

  }
  var objReturn = {};
  objReturn.assessmentStr = arrayData.length > 0 ? arrayData.join("") : '';
  return objReturn;
}

Zachys.Stock.validateSameItemLps = function (stockIdsData) {
  var itemsIdsArr = [];
  var aucplateinternalidsArr = [];
  var objInfo = {};
  var quantitySum = 0;
  var assessmentCodes = [];
  var assessmentFfts = [];
  var packTypeId = '';

  for (var i = 0; i < stockIdsData.length; i++) {

    if (stockIdsData[i].linesdata.length == 1) {

      if (itemsIdsArr.length == 0) {
        itemsIdsArr.push(stockIdsData[i].linesdata[0].itemid);
        aucplateinternalidsArr.push(stockIdsData[i].aucplateinternalid);
        quantitySum += parseFloat(stockIdsData[i].linesdata[0].quantity);
        packTypeId = stockIdsData[i].linesdata[0].packagetypeid;

        if (stockIdsData[i].linesdata[0].assessmentCode.length > 0) {
          assessmentCodes = assessmentCodes.concat(stockIdsData[i].linesdata[0].assessmentCode);
        }

        if (stockIdsData[i].linesdata[0].assessmentFft.length > 0) {
          assessmentFfts = assessmentFfts.concat(stockIdsData[i].linesdata[0].assessmentFft);
        }

      } else {
        if (itemsIdsArr.indexOf(stockIdsData[i].linesdata[0].itemid) != -1) {
          aucplateinternalidsArr.push(stockIdsData[i].aucplateinternalid);
          quantitySum += parseFloat(stockIdsData[i].linesdata[0].quantity);

          if (stockIdsData[i].linesdata[0].packagetypeid && packTypeId != PACKAGE_TYPE_OWC) {
            packTypeId = Zachys.Stock.getMixPackTypeId(stockIdsData[i].linesdata[0].packagetypeid);
          }

          if (stockIdsData[i].linesdata[0].assessmentCode.length > 0) {
            assessmentCodes = assessmentCodes.concat(stockIdsData[i].linesdata[0].assessmentCode);
          }

          if (stockIdsData[i].linesdata[0].assessmentFft.length > 0) {
            assessmentFfts = assessmentFfts.concat(stockIdsData[i].linesdata[0].assessmentFft);
          }

        } else {
          objInfo.isSameType = false;
          break;
        }

      }

    } else {
      objInfo.isSameType = false;
      break;
    }
  }

  if (aucplateinternalidsArr.length > 1) {
    objInfo.isSameType = true;
    var updatedStockIdsData = [];
    updatedStockIdsData.push(stockIdsData[0]);
    updatedStockIdsData[0].isSameType = true;
    updatedStockIdsData[0].aucplateinternalid = aucplateinternalidsArr;
    updatedStockIdsData[0].estimatelow = updatedStockIdsData[0].estimatelowtotal;
    updatedStockIdsData[0].estematehigh = updatedStockIdsData[0].estimatehightotal;
    updatedStockIdsData[0].linesdata[0].quantity = quantitySum;
    updatedStockIdsData[0].packagetypeid = packTypeId;
    var assessmentCode = Zachys.Stock.calculateSumOfSameCode(assessmentCodes, false);
    var assessmentFft = Zachys.Stock.calculateSumOfSameCode(assessmentFfts, false);
    var assessmentNote = assessmentCode.concat(assessmentFft);
    Zachys.Stock.sortList(assessmentNote, true);
    updatedStockIdsData[0].assessmentNote = assessmentNote;
    var strObjData = Zachys.Stock.getJoinOfAssessmentNote(updatedStockIdsData[0].assessmentNote);
    updatedStockIdsData[0].assessmentNote = strObjData;
    updatedStockIdsData[0].mixLotDeatils = "";

    objInfo.updatedStockIdsData = updatedStockIdsData;

  } else {
    objInfo.isSameType = false;
  }

  return objInfo;
}

Zachys.Stock.getCodeObjectData = function (assessmentCode, quantity, auctionDisplayName, size, itemId) {
  var codesDataObjArr = CODES_DATA_OBJ.codesDataObjArr;
  var objArrCodes = [];

  var codesArr = assessmentCode.split(",");
  if (codesArr.length > 0) {
    for (var i = 0; i < codesArr.length; i++) {
      if (codesArr[i]) {
        var codeQty = codesArr[i].indexOf(';') != -1 ? codesArr[i].split(';')[0] : 0;
        var codeText = codesArr[i].indexOf(';') != -1 ? codesArr[i].split(';')[1] : codesArr[i].split(';')[0];
        var objValues = codesDataObjArr.filter(function (arr) {
          return arr.code.trim().toLowerCase() == codeText.trim().toLowerCase()
        });

        if (objValues.length > 0) {
          objArrCodes.push({
            codeQty: parseInt(codeQty),
            codeText: codeText.trim(),
            transformedText: objValues[0].description,
            transformedTextPlural: objValues[0].descriptionPlural,
            packType: objValues[0].typeId,
            orderingType: objValues[0].orderingType,
            quantity: parseInt(quantity),
            auctionDisplayName: auctionDisplayName,
            size: size,
            itemId: itemId
          })
        }

      }
    }

  }

  return objArrCodes;

}


Zachys.Stock.getNoteObjectData = function (assessmentFft, quantity, auctionDisplayName, size, itemId) {
  var codesTypeObjArray = CODES_DATA_OBJ.codesTypeObjArray;
  var objArrFft = [];

  var codesArr = assessmentFft.split(",");
  if (codesArr.length > 0) {
    for (var i = 0; i < codesArr.length; i++) {
      if (codesArr[i]) {
        var codeQty = codesArr[i].indexOf(';') != -1 ? codesArr[i].split(';')[0] : 0;
        var codeText = codesArr[i].indexOf(';') != -1 ? codesArr[i].split(';')[1] : codesArr[i].split(';')[0];
        if (codeText.indexOf('=') != -1) {
          var splitValue = codeText.split('=')[0];
          var codeTextValue = codeText.split('=')[1];
          var objValues = codesTypeObjArray.filter(function (arr) {
            if (arr.typeName.toLowerCase().trim().indexOf(splitValue.toLowerCase().trim()) != -1) {
              return true;

            }
          });

          if (objValues.length > 0) {
            objArrFft.push({
              codeQty: 0,
              codeText: codeTextValue.trim(),
              transformedText: codeTextValue.trim(),
              packType: objValues[0].typeId,
              typeName: objValues[0].typeName,
              quantity: parseInt(quantity),
              auctionDisplayName: auctionDisplayName,
              size: size,
              itemId: itemId
            })
          }

        }

      }
    }

  }

  return objArrFft;
}


Zachys.Stock.calculateSumOfSameCode = function (objArrCodes, isMixedLps) {
  var output = objArrCodes.reduce((accumulator, cur) => {
    let codeText = cur.codeText;
    let itemId = cur.itemId;
    let found = isMixedLps ? accumulator.find(elem => (elem.codeText === codeText && elem.itemId == itemId)) : accumulator.find(elem => elem.codeText === codeText)
    if (found) {
      found.codeQty += parseInt(cur.codeQty);
      if (cur.quantity) {
        found.quantity += parseInt(cur.quantity);
      }
    } else {
      accumulator.push(cur);
    }
    return accumulator;
  }, []);
  return output;
}

Zachys.Stock.sortList = function (list, isMixedLps) {
  var sortOrder = ['packType', 'orderingType'];
  if (isMixedLps) {
    sortOrder.splice(0, 0, 'itemId');
  }
  list.sort(fieldSorter(sortOrder));

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

Zachys.Stock.startLoader = function () {
  var loaderSpin = document.getElementById("loader-spin");
  loaderSpin.classList.add("lds-spinner");
  var loaderInn = document.getElementById("loader-inn");
  loaderInn.classList.add("loader-inner");
}
Zachys.Stock.endLoader = function () {
  var loaderSpin = document.getElementById("loader-spin");
  loaderSpin.classList.remove("lds-spinner");
  var loaderInn = document.getElementById("loader-inn");
  loaderInn.classList.remove("loader-inner");
}

Zachys.Stock.convertNumberToWords = function (amount) {
  var words = new Array();
  words[0] = '';
  words[1] = 'One';
  words[2] = 'Two';
  words[3] = 'Three';
  words[4] = 'Four';
  words[5] = 'Five';
  words[6] = 'Six';
  words[7] = 'Seven';
  words[8] = 'Eight';
  words[9] = 'Nine';
  words[10] = 'Ten';
  words[11] = 'Eleven';
  words[12] = 'Twelve';
  words[13] = 'Thirteen';
  words[14] = 'Fourteen';
  words[15] = 'Fifteen';
  words[16] = 'Sixteen';
  words[17] = 'Seventeen';
  words[18] = 'Eighteen';
  words[19] = 'Nineteen';
  words[20] = 'Twenty';
  words[30] = 'Thirty';
  words[40] = 'Forty';
  words[50] = 'Fifty';
  words[60] = 'Sixty';
  words[70] = 'Seventy';
  words[80] = 'Eighty';
  words[90] = 'Ninety';
  amount = amount.toString();
  var atemp = amount.split(".");
  var number = atemp[0].split(",").join("");
  var n_length = number.length;
  var words_string = "";
  if (n_length <= 9) {
    var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    var received_n_array = new Array();
    for (var i = 0; i < n_length; i++) {
      received_n_array[i] = number.substr(i, 1);
    }
    for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
      n_array[i] = received_n_array[j];
    }
    for (var i = 0, j = 1; i < 9; i++, j++) {
      if (i == 0 || i == 2 || i == 4 || i == 7) {
        if (n_array[i] == 1) {
          n_array[j] = 10 + parseInt(n_array[j]);
          n_array[i] = 0;
        }
      }
    }
    value = "";
    for (var i = 0; i < 9; i++) {
      if (i == 0 || i == 2 || i == 4 || i == 7) {
        value = n_array[i] * 10;
      } else {
        value = n_array[i];
      }
      if (value != 0) {
        words_string += words[value] + " ";
      }
      if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
        words_string += "Crores ";
      }
      if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
        words_string += "Lakhs ";
      }
      if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
        words_string += "Thousand ";
      }
      if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
        words_string += "Hundred and ";
      } else if (i == 6 && value != 0) {
        words_string += "Hundred ";
      }
    }
    words_string = words_string.split("  ").join(" ");
  }
  return words_string;
}

Zachys.Stock.getMixPackTypeId = function (packagetypeid) {
  var packId = '';
  if (packagetypeid == PACKAGE_TYPE_OWC) {
    packId = packagetypeid;
  } else {
    packId = packagetypeid;
  }

  return packId;

}