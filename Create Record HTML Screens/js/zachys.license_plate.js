var SVG = {};
var countValue = 1;
SVG.Search = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>';
SVG.Checkmark = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16 checkmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>';
SVG.Times = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11 times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>'
var Zachys = Zachys || {};

Zachys.LicensePlate = function () {
  var self = this;
  this.UI = {};
  var products = WINES_CATALOG;
  var consignmentName = products[0] ? products[0].consignmentName : '';
  var consignorName = products[0] ? products[0].consignorName : '';

  var html = '';
  html += '<div class="license-plate">';
  html += '  <div class="header"><div>';
  html += '    <h1 ref="title">Add Consignment Lines To LP</h1>';
  html += '    <div ref="filterHolder"></div>'
  html += '  </div>';
  html += '  <div class="item" style="box-shadow: none;"><span style="padding-left: 0;" class="price" ref="consignment-detail">Consignment: <i>' + consignmentName + '</i> Consignor Name: <i>' + consignorName + '</i></span></div>';
  html += '</div>';
  html += '  <div class="content">'
  html += '    <div class="product-line" ref="products"></div>';
  html += '  </div>';
  html += '  <div class="footer">';
  html += '    <div class="buttons">';
  html += '      <b class="button secondary" ref="buttons.cancel">Cancel</b>';
  html += '      <b class="button" ref="buttons.create">Add Inspection Notes</b>';
  html += '      <b class="button" ref="buttons.createClose">Create LP & Close</b>';
  html += '    </div>';
  html += '  </div>';
  html += '</div>';

  this.holder = Ozine.DOM(html, this.UI);
  Ozine.UI.PressButton(this.UI.buttons.cancel);
  Ozine.UI.PressButton(this.UI.buttons.create);



  this.UI.wines = [];

  this.state = {
    mode: Zachys.LicensePlate.BOTTLE_SELECTION
  };

  this.UI.filter = new Zachys.Filter();
  this.UI.filter.onChange = function (search) {
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++) {
      self.UI.wines[iWine].filter(search);
    }
  }
  this.UI.filterHolder.appendChild(this.UI.filter.holder);

  for (var iProduct = 0; iProduct < products.length; iProduct++) {
    var product = new Zachys.LicensePlate.ConsignmentLine(products[iProduct]);
    product.onChange = function () {}
    this.UI.wines.push(product);
    this.UI.products.appendChild(product.holder);
  }

  this.UI.buttons.createClose.style.display = 'none';

  this.UI.buttons.cancel.onclick = function () {
    var testimonials = document.querySelectorAll('.input-qty');
    Array.prototype.forEach.call(testimonials, function (elements, index) {
      if (elements.value != 0) {
        elements.value = 0;
        elements.onblur();
      }
    });
    if (self.state.mode === Zachys.LicensePlate.CODE_MODE) {
      self.setState({
        mode: Zachys.LicensePlate.BOTTLE_SELECTION
      });
    } else if (self.state.mode === Zachys.LicensePlate.BOX_SUMMARY) {
      self.setState({
        mode: Zachys.LicensePlate.CODE_MODE
      });
    }
  }
  this.UI.buttons.create.onclick = function () {
    var element = document.getElementById('row-search');
    element.value = "";
    var event = new Event('input');
    element.dispatchEvent(event);

    if (self.state.mode === Zachys.LicensePlate.CODE_MODE) {
      self.setState({
        mode: Zachys.LicensePlate.BOX_SUMMARY
      });
    } else if (self.state.mode === Zachys.LicensePlate.BOTTLE_SELECTION) {
      self.setState({
        mode: Zachys.LicensePlate.CODE_MODE
      });
    } else {
      var lpInspectionData = Zachys.LicensePlate.getLpInspectionData();
      Zachys.LicensePlate.createOrUpdateRecord(lpInspectionData, "final-stage");


    }
  }

  // this.UI.buttons.createClose.onclick = function(){
  //   var lpInspectionData = Zachys.LicensePlate.getLpInspectionData();
  //   Zachys.LicensePlate.createOrUpdateRecord(lpInspectionData, "closetab");
  // }
  Ozine.addState(this);

  /*this.setData([
    {
      qty: 1,
      id: '1620585',
      codes: '5xbnob, 1xts, 1xh.nick, 2xscuff, 1xh.scuff, 1xh.torn, 2xdsl, 1xh.dsl, 2xl.wrinkled, '
    },
    {
      qty: 2,
      id: '1627631',
      codes: 'includes 12pk owc, 5x2cmob, 4x2.5cm, 1x3cm, 2xh.wsl, 1xtorn, 1xwsl, 1xl.wsl, 3xdsl, 1xscuff // box97:  1x3.5cm, 1x4cm, 2xbsl'
    }
  ])*/
}
Zachys.LicensePlate.prototype.setData = function (data) {
  var dict = {};
  for (var iData = 0; iData < data.length; iData++) {
    dict[data[iData].id] = data[iData];
  }
  for (var iWine = 0; iWine < this.UI.wines.length; iWine++) {
    this.UI.wines[iWine].setData(dict[this.UI.wines[iWine].data.SKU]);
  }
}
Zachys.LicensePlate.prototype.onState = function (state) {
  if (state.mode) {
    for (var iWine = 0; iWine < this.UI.wines.length; iWine++) {
      this.UI.wines[iWine].setMode(state.mode);
    }
    if (state.mode === Zachys.LicensePlate.BOX_SUMMARY) {
      this.UI.buttons.cancel.innerHTML = 'Back';
      this.UI.title.innerHTML = 'Review & Create LP';
      this.UI.buttons.create.innerHTML = 'Create LP';
      this.UI.buttons.createClose.style.display = 'none'; // zain 11-11-19
    }
    if (state.mode === Zachys.LicensePlate.CODE_MODE) {
      this.UI.buttons.cancel.innerHTML = 'Back';
      this.UI.title.innerHTML = 'Add Inspection Notes';
      this.UI.buttons.create.innerHTML = 'Complete Inspection';
      this.UI.buttons.createClose.style.display = 'none';
    }
    if (state.mode === Zachys.LicensePlate.BOTTLE_SELECTION) {
      this.UI.buttons.cancel.innerHTML = 'Cancel';
      this.UI.title.innerHTML = 'Add Consignment Lines To LP';
      this.UI.buttons.create.innerHTML = 'Add Inspection Notes';
      this.UI.buttons.createClose.style.display = 'none';
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
Zachys.LicensePlate.Codes = function (text) {
  var raw = text.split(',');
  var codes = [];
  var notes = [];
  for (var iCode = 0; iCode < raw.length; iCode++) {
    var code = raw[iCode].trim();
    var isAssessmentFFT = false;
    //15-nov-2019 start
    var codeText = code.replace(/^[\d ]{1,};/, '').trim();
    var amount = '';
    if (code.indexOf(';') != -1) {
      amount = code.split(';')[0].trim();
    }

    if (codeText.indexOf('=') != -1 && code.toLowerCase().indexOf('int=') == -1) {
      var typeArr = Zachys.LicensePlate.TypesArr;
      if (typeArr.length > 0) {
        for (var j = 0; j < typeArr.length; j++) {
          if (code.toLowerCase().indexOf(typeArr[j].typeName.toLowerCase()) != -1) {
            isAssessmentFFT = true;
          }
        }
      }

    }

    if (code.toLowerCase().indexOf('int=') != -1) {
      codes.push({
        code: codeText,
        amount: !isNaN(amount) ? amount : '',
        codeTextName: 'internalNote',
        codeType: 'internal'
      });

    } else if (isAssessmentFFT) {

      codes.push({
        code: codeText,
        amount: !isNaN(amount) ? amount : '',
        codeTextName: 'assessmentFFT',
        codeType: 'tag'
      });

    } else if (isNaN(amount) || code.toLowerCase() === amount.toLowerCase()) {
      if (Zachys.LicensePlate.CODES[codeText.toLowerCase()]) {
        codes.push({
          code: Zachys.LicensePlate.CODES[codeText.toLowerCase()].code,
          amount: '',
          codeTextName: 'assessmentCode',
          codeType: 'note',
          packTypeId: Zachys.LicensePlate.CODES[codeText.toLowerCase()].packType
        })
      } else {
        codes.push({
          code: codeText,
          amount: !isNaN(amount) ? amount : '',
          codeTextName: 'notRecognized',
          codeType: 'notrecognized'
        });

      }
    } else {
      if (Zachys.LicensePlate.CODES[codeText.toLowerCase()]) {
        codes.push({
          code: Zachys.LicensePlate.CODES[codeText.toLowerCase()].code,
          amount: !isNaN(amount) ? amount : '',
          codeTextName: 'assessmentCode',
          codeType: 'note',
          packTypeId: Zachys.LicensePlate.CODES[codeText.toLowerCase()].packType
        })
      } else {
        codes.push({
          code: codeText,
          amount: !isNaN(amount) ? amount : '',
          codeTextName: 'notRecognized',
          codeType: 'notrecognized'
        })
      }
    }
  }
  //15-nov-2019 end
  return codes;
}
Zachys.Filter = function () {
  var self = this;
  this.UI = {};
  var html = '';
  html += '<div class="filters">';
  html += '  <div class="code-input" ref="code" style="">';
  html += '    <b>' + SVG.Search + '</b>'
  html += '    <input id="row-search" type="text" ref="search">';
  html += '  </div>';
  html += '</div>';
  this.holder = Ozine.DOM(html, this.UI);
  this.UI.search.oninput = function () {
    self.onChange && self.onChange(this.value);
  }
}

Zachys.LicensePlate.ConsignmentLine = function (data) {
  var self = this;
  this.UI = {};
  var html = '';
  html += '<div id="consignment-line-' + countValue + '" class="item bottle-selection">';
  //html += '  <i ref="label.amount">3</i>';
  html += '  <b>';
  html += '    <b id="consignment-line-amount-' + countValue + '"  class="amount" ref="label.amount"></b>';
  html += '    <b id="consignment-line-name-' + countValue + '"  class="name" ref="name"></b>';
  html += '  </b>';
  html += '  <span class="price" ref="price"></span>'
  html += '<br>';
  html += '  <span class="price" id="existiing-lp-lines-' + countValue + '" ref="lpsrecordid"></span>'
  html += '  <span class="counter" ref="counter">';
  html += '    <i ref="buttons.minus">-</i>';
  html += '    <input type="text" value="0" class="input-qty" ref="input"/>';
  html += '    <i ref="buttons.add">+</i>';
  html += '  </span>'
  html += '  <div class="code-input" ref="code">';
  html += '    <b>Codes</b>';
  html += '    <input type="text" ref="code.input"/>';
  html += '  </div>';
  html += '  <div id="codes-notes-' + countValue + '"  class="codes-notes" ref="codes-notes"></div>';
  html += '  <div style="display: none" id="codes-notes-obj-data-' + countValue + '"  class="codes-notes" ref="codes-notes-obj-data"></div>';
  html += '  <div class="features" ref="features">';
  html += '    <div>';
  html += '      <b>Type:</b>';
  html += '      <i ref="label.typename" id="data-type-name-' + countValue + '" ></i>';
  html += '    </div>';
  html += '    <div>';
  html += '      <b>Cage:</b>';
  html += '      <i id="consignment-line-cage-' + countValue + '"  ref="label.cage"></i>';
  html += '      <i style="display: none;" id="consignment-line-value-cage-' + countValue + '"  ref="label.valuecage"></i>';
  html += '    </div>';
  html += '    <div>';
  html += '      <b>Photo:</b>';
  html += '      <i id="consignment-line-photo-' + countValue + '" ref="label.photo"></i>';
  html += '    </div>';
  html += '    <div>';
  html += '      <b>Expected Qty</b>';
  html += '      <i id="consignment-line-qty-' + countValue + '" ref="label.qty"></i>';
  html += '    </div>';
  html += '    <div>';
  html += '      <b>Received Qty</b>';
  html += '      <i id="consignment-line-rec-qty-' + countValue + '" ref="label.rec_qty">0</i>';
  html += '    </div>';
  html += '  </div>';
  html += '    <div style="display: none;">';
  html += '      <i id="consignment-line-internalid-' + countValue + '" ref="label.internalid">0</i>';
  html += '    </div>';
  html += '    <div style="display: none;">';
  html += '      <i id="consignment-line-consignment_id-' + countValue + '" ref="label.consignment_id">0</i>';
  html += '    </div>';
  html += '    <div style="display: none;">';
  html += '      <i id="consignment-line-consignor-' + countValue + '" ref="label.consignor">0</i>';
  html += '    </div>';
  html += '    <div style="display: none;">';
  html += '      <i id="consignment-line-itemid-' + countValue + '" ref="label.itemid">0</i>';
  html += '    </div>';
  html += '    <div style="display: none;">';
  html += '      <i id="consignment-line-type-' + countValue + '"  ref="label.type"></i>';
  html += '    </div>';
  html += '    <div style="display: none;">';
  html += '      <i id="consignment-line-prelot-' + countValue + '"  ref="label.prelot"></i>';
  html += '    </div>';
  html += '    <div style="display: none;">';
  html += '      <i id="consignment-line-intendedsale-' + countValue + '"  ref="label.intendedsale"></i>';
  html += '    </div>';
  html += '    <div style="display: none;">';
  html += '      <i id="consignment-line-lowestimate-' + countValue + '"  ref="label.lowestimate"></i>';
  html += '    </div>';
  html += '    <div style="display: none;">';
  html += '      <i id="consignment-line-highestimate-' + countValue + '"  ref="label.highestimate"></i>';
  html += '    </div>';
  html += '    <div style="display: none;">';
  html += '      <i id="consignment-line-lowPrice-' + countValue + '"  ref="label.lowPrice"></i>';
  html += '    </div>';
  html += '    <div style="display: none;">';
  html += '      <i id="consignment-line-highPrice-' + countValue + '"  ref="label.highPrice"></i>';
  html += '    </div>';
  html += '</div>';
  this.holder = Ozine.DOM(html, this.UI, true);

  this.data = data;
  this.state = {
    qty: 0,
    filter: true,
    mode: Zachys.LicensePlate.BOTTLE_SELECTION
  };

  window.consignmentid = data.consignment_id;
  this.UI.name.innerHTML = data.name //' <span>' + data.size + '</span> <i>(' + data.vintage + ')</i>';
  this.UI.label.qty.innerHTML = data.qty;
  this.UI.label.type.innerHTML = data.type;
  this.UI.label.typename.innerHTML = data.typename;
  this.UI.label.cage.innerHTML = data.cage ? SVG.Checkmark : SVG.Times;
  this.UI.label.valuecage.innerHTML = data.cage;
  this.UI.label.photo.innerHTML = data.photo;
  this.UI.label.internalid.innerHTML = data.internalid;
  this.UI.label.consignment_id.innerHTML = data.consignment_id;
  this.UI.label.consignor.innerHTML = data.consignor;
  this.UI.label.itemid.innerHTML = data.itemid;
  this.UI.label.amount.style.display = 'none';
  this.UI.code.style.display = 'none';
  this.UI.label.rec_qty.innerHTML = data.rec_qty;
  this.UI.price.innerHTML = 'Bottle Low/High: <i>$' + data.lowPrice.toLocaleString() + ' - $' + data.highPrice.toLocaleString() + '</i>';
  this.UI.price.innerHTML += ' Region: <i id="data-region-' + countValue + '"  >' + data.region + '</i>';
  this.UI.price.innerHTML += ' Class: <i id="data-class-' + countValue + '" >' + data.class + '</i>';
  this.UI.price.innerHTML += ' Apellation: <i id="data-apellation-' + countValue + '" >' + data.apellation + '</i>';
  this.UI.lpsrecordid.innerHTML += ' Existing LPs: <i>' + data.lpItemqtysumdata + '</i>';
  this.UI.label.prelot.innerHTML = data.prelot;
  this.UI.label.intendedsale.innerHTML = data.intendedsale;
  this.UI.label.lowestimate.innerHTML = data.lowestimate;
  this.UI.label.highestimate.innerHTML = data.highestimate;
  this.UI.label.lowPrice.innerHTML = data.lowPrice;
  this.UI.label.highPrice.innerHTML = data.highPrice;

  this.UI.code.input.oninput = function () {

    var codes = Zachys.LicensePlate.Codes(this.value);
    self.setState({
      codes: codes
    })
  }
  this.UI.buttons.minus.onclick = function () {
    self.setState({
      qty: Math.max(0, self.state.qty - 1)
    });
  }
  this.UI.buttons.add.onclick = function () {
    //self.setState({ qty: Math.min(data.qty - data.rec_qty, self.state.qty + 1) });
    self.setState({
      qty: self.state.qty + 1
    }); //ZAC-25: Remove restriction on + QTY button (11-Nov-2019)
  }
  this.UI.input.onblur = function () {
    var value = Number(this.value);
    if (isNaN(value)) {
      self.setState({
        qty: self.state.qty
      });
    } else {
      self.setState({
        qty: value
      });
    }
  }
  this.UI.input.onkeydown = function (event) {
    if (event.keyCode === 13) {
      this.onblur();
    }
  }
  if (html)
    Ozine.addState(this);

  countValue++;
}
Zachys.LicensePlate.CODE_MODE = 'code-mode';
Zachys.LicensePlate.BOTTLE_SELECTION = 'bottle-selection';
Zachys.LicensePlate.BOX_SUMMARY = 'box-summary';

Zachys.LicensePlate.ConsignmentLine.prototype.filter = function (term) {
  var isNotTermExist = true;
  if (term) {
    isNotTermExist = false;
    var splitTermValue = term.split('%');
    for (var i = 0; i < splitTermValue.length; i++) {
      if (splitTermValue[i].length < 3) {
        // if (Zachys.LevenshteinArias(splitTermValue[i], this.data.name.toString().toLowerCase())) {
        //   isNotTermExist = true;
        // }

      } else {

        if (this.data.name.toString().toLowerCase().indexOf(splitTermValue[i]) != -1) {
          isNotTermExist = true;
        } else {
          isNotTermExist = false;
          break;
        }
      }

    }

  }
  this.setState({
    filter: isNotTermExist
  });

}
Zachys.LicensePlate.ConsignmentLine.prototype.setMode = function (mode) {
  this.setState({
    mode: mode
  });
}
Zachys.LicensePlate.ConsignmentLine.prototype.setData = function (data) {
  data = data || {};
  this.UI.code.input.value = data.codes || '';
  this.UI.code.input.oninput();
  this.setState({
    qty: data.qty || 0
  })

}
Zachys.LicensePlate.ConsignmentLine.prototype.onState = function (state) {
  if (state.hasOwnProperty('qty')) {
    this.UI.input.value = state.qty;
    var dataQty = this.data.rec_qty ? parseInt(this.data.rec_qty) : 0
    this.UI.label.rec_qty.innerHTML = state.qty + dataQty;
    this.UI.label.amount.innerHTML = state.qty + 'x';
    this.onChange && this.onChange();
  }
  var codesNotesObjArr = [];
  if (state.codes) {
    this.UI["codes-notes"].innerHTML = '';
    for (var iCode = 0; iCode < state.codes.length; iCode++) {
      var tag = document.createElement('b');
      var amount = state.codes[iCode].amount;
      if (state.codes[iCode].codeType == 'internal') {
        tag.className = 'internal';
        tag.id = 'internal-' + (iCode + 1)

      } else if (state.codes[iCode].codeType == 'tag') {
        tag.className = 'tag';
        tag.id = 'tag-' + (iCode + 1);
      } else if (state.codes[iCode].codeType == 'note') {
        tag.className = 'note';
        tag.id = 'note-' + (iCode + 1);
      } else {
        tag.className = 'notrecognized';
        tag.id = 'notrecognized-' + (iCode + 1);
      }

      tag.innerHTML = (amount ? amount + ' <i>x</i> ' : '') + state.codes[iCode].code;

      codesNotesObjArr.push({
        codeText: amount ? amount + ';' + state.codes[iCode].code : state.codes[iCode].code,
        amount: amount ? amount : '',
        codeType: state.codes[iCode].codeType,
        codeTextName: state.codes[iCode].codeTextName,
        packTypeId: state.codes[iCode].packTypeId ? state.codes[iCode].packTypeId : ''
      })

      this.UI["codes-notes"].appendChild(tag);
      this.UI["codes-notes-obj-data"].innerText = JSON.stringify(codesNotesObjArr);
    }
  }

  this.holder.className = "item " + this.state.mode;
  if (state.mode === Zachys.LicensePlate.BOX_SUMMARY) {
    this.UI.counter.style.display = 'none';
    this.UI.label.amount.style.display = '';
    this.UI.code.style.display = 'none';
    this.UI['codes-notes'].style.display = '';
    this.UI.features.style.display = 'none';
  }
  if (state.mode === Zachys.LicensePlate.CODE_MODE) {
    this.UI.counter.style.display = 'none';
    this.UI.label.amount.style.display = '';
    this.UI.code.style.display = '';
    this.UI['codes-notes'].style.display = '';
    this.UI.features.style.display = 'none';
  }
  if (state.mode === Zachys.LicensePlate.BOTTLE_SELECTION) {
    this.UI.counter.style.display = '';
    this.UI.label.amount.style.display = 'none';
    this.UI.code.style.display = 'none';
    this.UI['codes-notes'].style.display = 'none';
    this.UI.features.style.display = '';
  }
  this.holder.style.display = ((this.state.mode === Zachys.LicensePlate.BOTTLE_SELECTION || this.state.qty > 0) && this.state.filter) ? '' : 'none';
}

Zachys.LicensePlate.getLpInspectionData = function () {
  var i = 1;
  var objDataArr = [];
  while (i != 0) {
    var consignmentLineDisplay = document.getElementById('consignment-line-' + i) ? document.getElementById('consignment-line-' + i).style.display : null

    if (consignmentLineDisplay != null && consignmentLineDisplay != "none") {
      var obj = {};
      obj.consignmentlineid = document.getElementById("consignment-line-internalid-" + i) ? document.getElementById("consignment-line-internalid-" + i).innerHTML : '';
      obj.consignmentid = document.getElementById("consignment-line-consignment_id-" + i) ? document.getElementById("consignment-line-consignment_id-" + i).innerHTML : '';
      obj.consignor = document.getElementById("consignment-line-consignor-" + i) ? document.getElementById("consignment-line-consignor-" + i).innerHTML : '';
      obj.receivedquantity = document.getElementById("consignment-line-rec-qty-" + i) ? document.getElementById("consignment-line-rec-qty-" + i).innerHTML : '';
      obj.type = document.getElementById("consignment-line-type-" + i) ? document.getElementById("consignment-line-type-" + i).innerHTML : '';
      obj.typeName = document.getElementById("data-type-name-" + i) ? document.getElementById("data-type-name-" + i).innerHTML : '';
      obj.cageValue = document.getElementById("consignment-line-value-cage-" + i) ? document.getElementById("consignment-line-value-cage-" + i).innerHTML : '';
      obj.photo = document.getElementById("consignment-line-photo-" + i) ? document.getElementById("consignment-line-photo-" + i).innerHTML : '';
      obj.itemid = document.getElementById("consignment-line-itemid-" + i) ? document.getElementById("consignment-line-itemid-" + i).innerHTML : '';
      obj.description = document.getElementById("consignment-line-name-" + i) ? document.getElementById("consignment-line-name-" + i).innerHTML : '';
      obj.currentreceivedquantity = document.getElementById("consignment-line-amount-" + i) ? document.getElementById("consignment-line-amount-" + i).innerHTML.replace('x', '').replace('X', '') : '';
      obj.prelot = document.getElementById("consignment-line-prelot-" + i) ? document.getElementById("consignment-line-prelot-" + i).innerHTML : '';
      obj.intendedsale = document.getElementById("consignment-line-intendedsale-" + i) ? document.getElementById("consignment-line-intendedsale-" + i).innerHTML : '';
      obj.lowestimate = document.getElementById("consignment-line-lowestimate-" + i) ? document.getElementById("consignment-line-lowestimate-" + i).innerHTML : '';
      obj.highestimate = document.getElementById("consignment-line-highestimate-" + i) ? document.getElementById("consignment-line-highestimate-" + i).innerHTML : '';
      obj.bottlelowPrice = document.getElementById("consignment-line-lowPrice-" + i) ? document.getElementById("consignment-line-lowPrice-" + i).innerHTML : '';
      obj.bottlehighPrice = document.getElementById("consignment-line-highPrice-" + i) ? document.getElementById("consignment-line-highPrice-" + i).innerHTML : '';
      obj.existingLpLines = document.getElementById("existiing-lp-lines-" + i) ? document.getElementById("existiing-lp-lines-" + i).innerHTML : '';
      obj.region = document.getElementById("data-region-" + i) ? document.getElementById("data-region-" + i).innerHTML : '';
      obj.class = document.getElementById("data-class-" + i) ? document.getElementById("data-class-" + i).innerHTML : '';
      obj.apellation = document.getElementById("data-apellation-" + i) ? document.getElementById("data-apellation-" + i).innerHTML : '';

      var isTagsExist = document.getElementById("codes-notes-obj-data-" + i) ? true : false;
      if (isTagsExist) {
        var internalDataArray = document.getElementById("codes-notes-obj-data-" + i).innerHTML;
        internalDataArray = internalDataArray ? JSON.parse(internalDataArray) : [];

        var assessmentFFT = [];
        var internalNotes = [];
        var assessmentCodes = [];
        var notRecognized = [];
        for (var jj = 0; jj < internalDataArray.length; jj++) {
          if (!obj.packagTypeId && internalDataArray[jj].packTypeId) {
            obj.packagTypeId = internalDataArray[jj].packTypeId;
          }
          var codeTextName = internalDataArray[jj].codeTextName;
          var codeText = internalDataArray[jj].codeText;
          if (codeTextName == 'assessmentFFT') {
            assessmentFFT.push(codeText);

          } else if (codeTextName == 'internalNote') {
            internalNotes.push(codeText);

          } else if (codeTextName == 'assessmentCode') {
            assessmentCodes.push(codeText);

          } else {
            notRecognized.push(codeText);

          }




          obj.assessmentFFT = assessmentFFT.length > 0 ? assessmentFFT.join() : '';
          obj.internalNotes = internalNotes.length > 0 ? internalNotes.join() : '';
          obj.assessmentCodes = assessmentCodes.length > 0 ? assessmentCodes.join() : '';
          obj.notRecognized = notRecognized.length > 0 ? notRecognized.join() : '';

        }


        objDataArr.push(obj);

      }

    }
    i++;

    if (consignmentLineDisplay == null) {
      i = 0;
    }



  }

  return objDataArr;
}

Zachys.LicensePlate.createOrUpdateRecord = function (lpInspectionData, nextAction) {
  var summaryHtmlContent = Zachys.LicensePlate.AddSummaryOnCreation(lpInspectionData);

  Zachys.LicensePlate.startLoader();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', window.suiteletUrl);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(lpInspectionData));
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var objResponse = JSON.parse(xhr.responseText);
      if (objResponse.type == "Success" && nextAction == "final-stage") {
        Zachys.LicensePlate.endLoader();
        document.getElementById("new-lp-number").innerHTML = objResponse.lpRecName
        document.getElementById("box-type-value").innerHTML = objResponse.typeName ? objResponse.typeName : '&nbsp;'
        var tempCageValue = objResponse.cageValue == true ? '&#10004;' : '&#10060;';
        document.getElementById("box-cage-value").innerHTML = tempCageValue;
        document.getElementById("box-photo-value").innerHTML = objResponse.photo != 0 ? objResponse.photo : '&nbsp;'
        $(".license-plate-final-step").css("display", "block");
        $(".license-plate").css("display", "none");
        document.getElementById('license-plate-summary').innerHTML = summaryHtmlContent;
      }

    } else {
      Zachys.LicensePlate.endLoader();
    }
  }

}

Zachys.LicensePlate.AddSummaryOnCreation = function (lpInspectionData) {
  var template = '';
  for (var i = 0; i < lpInspectionData.length; i++) {
    var data = lpInspectionData[i];

    template += '<div class="license-plate-2" id="license-plate-summary" style="height: auto;">'
    template += '<div class="content">';
    template += '<div class="product-line" ref="products">';
    template += '<div class="item box-summary">';
    template += '<b class="first-line" style="float: left;padding-bottom: 5px;width: 50%;padding-top: 10px;font-size: 16px;">';
    template += '<b class="amount" id="custom-amount">' + data.currentreceivedquantity + 'X</b><b class="name" id="custom-name">' + data.description + '</b>';
    template += '</b>';
    template += '<div class="right-sec-line-one">';
    template += '<div class="custom-boxes sub-custom-boxes" style="width: 257px;margin: 0;float: right;margin-right: 15px;box-shadow: none;margin-top:0px;padding-top: 0">';
    template += '<span style="padding: 5px 7px;width: 75px;height: 31px;">';
    template += '<p style="font-size: 11px;margin-top: 0;">Type</p>';
    var typeName = data.typeName ? data.typeName : '&nbsp;'
    template += '<p id="custom-type" style="font-size: 13px;margin-top: 3px;">' + typeName + '</p>';
    template += ' </span>';
    template += '<span style="padding: 5px 7px;width: 68px;height: 31px;">';
    template += '<p style="font-size: 11px;margin-top: 0;">Cage</p>';
    var cageValue = (data.cageValue == 'true') ? '&#10004;' : '&#10060;';
    template += '<p id="custom-cage" style="font-size: 13px;margin-top: 1px;">' + cageValue + '</p>';
    template += '</span>';
    template += '<span style="padding: 5px 7px;width: 68px;height: 31px;">';
    template += '<p style="font-size: 11px;margin-top: 0;">Photo</p>';
    var photo = data.photo ? data.photo : '&nbsp;'
    template += '<p id="custom-photo" style="font-size: 13px;margin-top: 3px;">' + photo + '</p>';
    template += ' </span>';
    template += '</div>';
    template += '</div>';
    template += '<span class="price" style="clear: both;padding-right: 14px;">Bottle Low/High: ';
    template += '<i id="custom-price">$' + data.bottlelowPrice.toLocaleString() + ' - $' + data.bottlehighPrice.toLocaleString() + '</i> Region: ';
    template += '<i id="custom-region">' + data.region + '</i> Class: <i id="custom-class">' + data.class + '</i> <br> Apellation: ';
    template += '<i id="custom-apellation">' + data.apellation + '</i>Existing LPs: ';
    template += '<i id="custom-lps">' + data.existingLpLines.replace('Existing LPs:', '') + '</i>';
    template += '</span>';
    template += '<div class="code-input">';
    var internalNotes = data.internalNotes ? ',' + data.internalNotes : ' ';
    var assessmentCodes = data.assessmentCodes ? ',' + data.assessmentCodes : ' ';
    var assessmentFFT = data.assessmentFFT ? data.assessmentFFT : ' '
    var codesValue = assessmentFFT + internalNotes + assessmentCodes;
    template += '<b>Codes</b><input id="custom-code" disabled type="text" value="' + codesValue + '" >';
    template += '</div>';
    template += ' </div>';
    template += '</div>';
    template += '</div>';
    template += '</div>';
  }

  return template;
}

Zachys.LicensePlate.startLoader = function () {
  var loaderSpin = document.getElementById("loader-spin");
  loaderSpin.classList.add("lds-spinner");
  var loaderInn = document.getElementById("loader-inn");
  loaderInn.classList.add("loader-inner");
}
Zachys.LicensePlate.endLoader = function () {
  var loaderSpin = document.getElementById("loader-spin");
  loaderSpin.classList.remove("lds-spinner");
  var loaderInn = document.getElementById("loader-inn");
  loaderInn.classList.remove("loader-inner");
}