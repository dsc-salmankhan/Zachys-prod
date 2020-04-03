var Zachys = Zachys || {};
var SVG = {};
SVG.Search = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>';

Zachys.SelectItem = function(){
  var self = this;
  this.UI = {};
  var html = '';
  html += '<div class="select-item">';
  html += '  <div class="header"><div>';
  html += '    <h1 ref="title">Item Search</h1>';
  html += '    <div ref="filterHolder"></div>'
  html += '  </div></div>';
  html += '  <div class="headers">';
  html += '    <span class="item-code">Item Code</span>';
  html += '    <span class="item-description">Item Description</span>';
  html += '  </div>';
  html += '  <div class="content">';
  html += '    <div class="product-line" ref="products"></div>';
  html += '  </div>';
  html += '</div>';

  this.holder = Ozine.DOM(html, this.UI);


  var products = WINES_CATALOG;

  this.UI.wines = [];

  this.state = {};

  this.UI.filter = new Zachys.Filter();
  this.UI.filter.onChange = function(search){
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++){
      self.UI.wines[iWine].filter(search);
    }
  }
  this.UI.filterHolder.appendChild(this.UI.filter.holder);

  for (var iProduct = 0; iProduct < products.length; iProduct++){
    var product = new Zachys.SelectItem.ConsignmentLine(products[iProduct]);
    this.UI.wines.push(product);
    this.UI.products.appendChild(product.holder);
  }

  Ozine.addState(this);
}
Zachys.SelectItem.prototype.setData = function(data){
  var dict = {};
  for (var iData = 0; iData < data.length; iData++){
    dict[data[iData].id] = data[iData];
  }
  for (var iWine = 0; iWine < this.UI.wines.length; iWine++) {
    this.UI.wines[iWine].setData(dict[this.UI.wines[iWine].data.SKU]);
  }
}
Zachys.SelectItem.prototype.onState = function(state) {

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
Zachys.Filter = function(){
  var self = this;
  this.UI = {};
  var html = '';
  html += '<div class="filters">';
  html += '  <div class="code-input" ref="code" style="">';
  html += '    <b>' + SVG.Search + '</b>'
  html += '    <input type="text" ref="search">';
  html += '  </div>';
  html += '</div>';
  this.holder = Ozine.DOM(html, this.UI);
  this.UI.search.oninput = function(){
    self.onChange && self.onChange(this.value);
  }
}

Zachys.SelectItem.ConsignmentLine = function(data){
  var self = this;
  this.UI = {};
  var html = '';
  html += '<div class="item">';
  html += '  <span ref="sku">3</span>';
  html += '  <i ref="name"></i>';
  html += '  <span class="button-holder">';
  html += '    <b class="button" ref="button">Select</b>';
  html += '  </span>';
  html += '</div>';
  this.holder = Ozine.DOM(html, this.UI, true);
  this.data = data;
  this.UI.name.innerHTML = data.name;
  this.UI.sku.innerHTML = data.SKU;
  Ozine.addState(this);
}


Zachys.SelectItem.ConsignmentLine.prototype.filter = function(term){
  if (term === ''){
    this.setState({filter: true});
  } else if (this.data.SKU.search(term) >= 0){
    this.setState({filter: true});
  } else {
    this.setState({filter:(term === '' ? true : Zachys.LevenshteinArias(term, this.data.name.toLowerCase()))});
  }

  //console.log(Zachys.LevenshteinArias(term, this.data.name), term, this.data.name)
}
Zachys.SelectItem.ConsignmentLine.prototype.onState = function(state){

  this.holder.style.display = ( this.state.filter) ? '' : 'none';
}
