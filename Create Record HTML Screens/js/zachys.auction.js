var Zachys = Zachys || {};
var SVG = {};
var countValue = 1;

SVG.Checkmark = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16 checkmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>';
SVG.Search = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>';
SVG.ArrowUp = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg>';

Zachys.Stock = function(){
  var self = this;
  this.UI = {};
  var html = '';
  html += '<div class="select-item" ref="consigmentLines">';
  html += '  <div class="header"><div>';
  html += '    <h1 ref="title">Assign StockID\'s to Auction</h1>';
  html += '    <div ref="filterHolder"></div>'
  html += '  </div></div>';
  html += '  <div class="headers">';
  html += '    <span class="item-lot" ref="sort.lot">PRE-LOT#<i>&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-lp" ref="sort.lp">StockID<i>&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-auction" ref="sort.auction">I-SALE#<i>&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-qty">Qty</span>';
  html += '    <span class="item-low-price" ref="sort.low">Low<i>&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-high-price" ref="sort.high">High<i>&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-description">Stock ID Contents</span>';
  html += '    <span class="item-country" ref="filters.country"><span>Country</span><i ref="sort.country">&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-region" ref="filters.region"><span>Region</span><i ref="sort.region">&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-class" ref="filters.class"><span>Class</span><i ref="sort.class">&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-apellation" ref="filters.apellation"><span>Apellation</span><i ref="sort.apellation">&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '    <span class="item-producer" ref="filters.producer"><span>Producer</span><i ref="sort.producer">&nbsp;' + SVG.ArrowUp + '</i></span>';
  html += '  </div>';
  html += '  <div class="content">';
  html += '    <div class="product-line" ref="products"></div>';
  html += '  </div>';
  html += '  <div class="footer">';
  html += '    <div class="buttons" ref="buttons">';
  html += '      <b class="button secondary" ref="buttons.cancel">Cancel</b>';
  html += '      <b class="button" ref="buttons.review">Assign StockIDs to Auction</b>';
  html += '      <b class="button secondary" ref="buttons.back">Back</b>';
  html += '      <b class="button" ref="buttons.create">Create Auction Lots for each StockID</b>';
  html += '    </div>';
  html += '  </div>';
  html += '</div>';

  this.holder = Ozine.DOM(html, this.UI);


  var products = WINES_CATALOG;

  this.UI.wines = [];

  this.state = {};

  this.UI.filter = new Zachys.Filter();
  this.UI.filter.onChange = function(search, id){
    console.log("filters", filters)
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++){
      self.UI.wines[iWine].filter(search, id, filters);
    }
  }
  this.UI.filterHolder.appendChild(this.UI.filter.holder);

  var country = {};
  var region = {};
  var classWine = {};
  var apellation = {};
  var producer = {};

  for (var iProduct = 0; iProduct < LPs.length; iProduct++){
    var product = new Zachys.Stock.LicensePlate(LPs[iProduct]);
    product.onSelect = function(){

    }

    country[LPs[iProduct].country] = true;
    region[LPs[iProduct].region] = true;
    classWine[LPs[iProduct].class] = true;
    apellation[LPs[iProduct].apellation] = true;
    producer[LPs[iProduct].producer] = true;

    countValue++;
    this.UI.wines.push(product);
    product.parentNode = this.UI.products;
    this.UI.products.appendChild(product.holder);
  }
  console.log(country, region, classWine, apellation, producer)

  this.UI.auction = new Zachys.Dropdown({blank:'Select Auction'});
  this.UI.auction.onChange = function(data){
    console.log(data);
    document.getElementById('selected-auction-id').innerHTML = data.id;
    self.setState({auction:data.id})
  }
  this.UI.auction.setOptions(window.auctionsDataArr);
  this.UI.buttons.appendChild(this.UI.auction.holder);

  this.UI.sort.lot.onclick = function(){
    if (self.state.sort == 'lot'){
      self.setState({sortDirection: self.state.sortDirection == 1 ? -1 : 1})
    } else {
      self.setState({sort: 'lot', sortDirection: 1})
    }
  }
  this.UI.sort.auction.onclick = function(){
    if (self.state.sort == 'auction'){
      self.setState({sortDirection: self.state.sortDirection == 1 ? -1 : 1})
    } else {
      self.setState({sort: 'auction', sortDirection: 1})
    }
  }
  this.UI.sort.lp.onclick = function(){
    if (self.state.sort == 'lp'){
      self.setState({sortDirection: self.state.sortDirection == 1 ? -1 : 1})
    } else {
      self.setState({sort: 'lp', sortDirection: 1})
    }
  }
  this.UI.sort.low.onclick = function(){
    if (self.state.sort == 'low'){
      self.setState({sortDirection: self.state.sortDirection == 1 ? -1 : 1})
    } else {
      self.setState({sort: 'low', sortDirection: 1})
    }
  }
  this.UI.sort.high.onclick = function(){
    if (self.state.sort == 'high'){
      self.setState({sortDirection: self.state.sortDirection == 1 ? -1 : 1})
    } else {
      self.setState({sort: 'high', sortDirection: 1})
    }
  }
  this.UI.sort.country.onclick = function(){
    if (self.state.sort == 'country'){
      self.setState({sortDirection: self.state.sortDirection == 1 ? -1 : 1})
    } else {
      self.setState({sort: 'country', sortDirection: 1})
    }
  }
  this.UI.sort.region.onclick = function(){
    if (self.state.sort == 'region'){
      self.setState({sortDirection: self.state.sortDirection == 1 ? -1 : 1})
    } else {
      self.setState({sort: 'region', sortDirection: 1})
    }
  }
  this.UI.sort.class.onclick = function(){
    if (self.state.sort == 'class'){
      self.setState({sortDirection: self.state.sortDirection == 1 ? -1 : 1})
    } else {
      self.setState({sort: 'class', sortDirection: 1})
    }
  }
  this.UI.sort.apellation.onclick = function(){
    if (self.state.sort == 'apellation'){
      self.setState({sortDirection: self.state.sortDirection == 1 ? -1 : 1})
    } else {
      self.setState({sort: 'apellation', sortDirection: 1})
    }
  }

  this.UI.sort.producer.onclick = function(){
    if (self.state.sort == 'producer'){
      self.setState({sortDirection: self.state.sortDirection == 1 ? -1 : 1})
    } else {
      self.setState({sort: 'producer', sortDirection: 1})
    }
  }

  this.UI.buttons.review.onclick = function(){
    console.log(self.state.auction)
    if (self.UI.auction.validate()){
      self.setState({ mode: Zachys.Stock.REVIEW });
    } else{
      setTimeout(function(){alert("Please choose an auction");}, 100);
    }

  };
  this.UI.buttons.back.onclick = function(){
    self.setState({ mode: Zachys.Stock.SELECT_LP });
  };
  this.UI.buttons.create.onclick = function(){
    var stockIdsData = Zachys.Stock.getStockidsData();
    if(stockIdsData.length > 0){
      Zachys.Stock.createOrUpdateRecord(stockIdsData, "refreshpage");
    }
    console.log("stockIdsData", stockIdsData);
  };

  var filters = {
    country: country,
    region: region,
    class: classWine,
    apellation: apellation,
    producer: producer,
  }
  console.log(filters);
  var countryFilter = new Zachys.Table.HeaderDD(this.UI.filters.country, country);
  countryFilter.onChange = function(country){
    filters.country = country;
    var data = self.UI.filter.getData();
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++){
      self.UI.wines[iWine].filter(data.search, data.lot, filters);
    }
  }
  var regionFilter = new Zachys.Table.HeaderDD(this.UI.filters.region, region);
  regionFilter.onChange = function(region){
    filters.region = region;
    var data = self.UI.filter.getData();
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++){
      self.UI.wines[iWine].filter(data.search, data.lot, filters);
    }
  }
  var classFilter = new Zachys.Table.HeaderDD(this.UI.filters.class, classWine);
  classFilter.onChange = function(classWine){
    filters.class = classWine;
    var data = self.UI.filter.getData();
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++){
      self.UI.wines[iWine].filter(data.search, data.lot, filters);
    }
  }
  var apellationFilter = new Zachys.Table.HeaderDD(this.UI.filters.apellation, apellation);
  apellationFilter.onChange = function(apellation){
    filters.apellation = apellation;
    var data = self.UI.filter.getData();
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++){
      self.UI.wines[iWine].filter(data.search, data.lot, filters);
    }
  }
  var producerFilter = new Zachys.Table.HeaderDD(this.UI.filters.producer, producer);
  producerFilter.onChange = function(producer){
    filters.producer = producer;
    var data = self.UI.filter.getData();
    for (var iWine = 0; iWine < self.UI.wines.length; iWine++){
      self.UI.wines[iWine].filter(data.search, data.lot, filters);
    }
  }

  Ozine.addState(this);
  this.setState({ mode: Zachys.Stock.SELECT_LP, sort: 'lot', sortDirection: -1 });
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
  if (state.search){
    var values = this.values;
    var children = this.UI.popup.content.children;
    for (var iChild = 0; iChild < children.length; iChild++){
      var filterDiv = children[iChild];
      filterDiv.style.display = (filterDiv.property.search(state.search) >= 0 ? '' : 'none');
    }
  }
  if (state.mode){
    this.UI.buttons.cancel.style.display = state.mode === Zachys.Stock.SELECT_LP ? '' : 'none';
    this.UI.buttons.review.style.display = state.mode === Zachys.Stock.SELECT_LP ? '' : 'none';

    this.UI.buttons.back.style.display = state.mode === Zachys.Stock.REVIEW ? '' : 'none';
    this.UI.buttons.create.style.display = state.mode === Zachys.Stock.REVIEW ? '' : 'none';

    if (state.mode === Zachys.Stock.SELECT_LP){
      this.UI.title.innerHTML = "Assign StockID\'s to Auction";
    } else {
      this.UI.title.innerHTML = "Review & Create Auction";
    }


    for (var iWine = 0; iWine < this.UI.wines.length; iWine++){
      this.UI.wines[iWine].preview(state.mode === Zachys.Stock.REVIEW)
    }
    this.holder.classList[state.mode === Zachys.Stock.REVIEW ? 'add' : 'remove']('preview');
  }
  console.log(state);
  if (state.sort || state.sortDirection){
    this.UI.sort.lot.classList.remove('sort-asc');
    this.UI.sort.lot.classList.remove('sort-desc');
    if (this.state.sort === 'lot'){
      if (this.state.sortDirection === 1){
        this.UI.sort.lot.classList.add('sort-asc');
      } else {
        this.UI.sort.lot.classList.add('sort-desc');
      }
    }

    this.UI.sort.auction.classList.remove('sort-asc');
    this.UI.sort.auction.classList.remove('sort-desc');
    if (this.state.sort === 'auction'){
      if (this.state.sortDirection === 1){
        this.UI.sort.auction.classList.add('sort-asc');
      } else {
        this.UI.sort.auction.classList.add('sort-desc');
      }
    }

    this.UI.sort.lp.classList.remove('sort-asc');
    this.UI.sort.lp.classList.remove('sort-desc');
    if (this.state.sort === 'lp'){
      if (this.state.sortDirection === 1){
        this.UI.sort.lp.classList.add('sort-asc');
      } else {
        this.UI.sort.lp.classList.add('sort-desc');
      }
    }

    this.UI.sort.low.classList.remove('sort-asc');
    this.UI.sort.low.classList.remove('sort-desc');
    if (this.state.sort === 'low'){
      if (this.state.sortDirection === 1){
        this.UI.sort.low.classList.add('sort-asc');
      } else {
        this.UI.sort.low.classList.add('sort-desc');
      }
    }

    this.UI.sort.high.classList.remove('sort-asc');
    this.UI.sort.high.classList.remove('sort-desc');
    if (this.state.sort === 'high'){
      if (this.state.sortDirection === 1){
        this.UI.sort.high.classList.add('sort-asc');
      } else {
        this.UI.sort.high.classList.add('sort-desc');
      }
    }

    this.UI.filters.country.classList.remove('sort-asc');
    this.UI.filters.country.classList.remove('sort-desc');
    if (this.state.sort === 'country'){
      if (this.state.sortDirection === 1){
        this.UI.filters.country.classList.add('sort-asc');
      } else {
        this.UI.filters.country.classList.add('sort-desc');
      }
    }
    this.UI.filters.region.classList.remove('sort-asc');
    this.UI.filters.region.classList.remove('sort-desc');
    if (this.state.sort === 'region'){
      if (this.state.sortDirection === 1){
        this.UI.filters.region.classList.add('sort-asc');
      } else {
        this.UI.filters.region.classList.add('sort-desc');
      }
    }
    this.UI.filters.class.classList.remove('sort-asc');
    this.UI.filters.class.classList.remove('sort-desc');
    if (this.state.sort === 'class'){
      if (this.state.sortDirection === 1){
        this.UI.filters.class.classList.add('sort-asc');
      } else {
        this.UI.filters.class.classList.add('sort-desc');
      }
    }
    this.UI.filters.apellation.classList.remove('sort-asc');
    this.UI.filters.apellation.classList.remove('sort-desc');
    if (this.state.sort === 'apellation'){
      if (this.state.sortDirection === 1){
        this.UI.filters.apellation.classList.add('sort-asc');
      } else {
        this.UI.filters.apellation.classList.add('sort-desc');
      }
    }

    this.UI.filters.producer.classList.remove('sort-asc');
    this.UI.filters.producer.classList.remove('sort-desc');
    if (this.state.sort === 'producer'){
      if (this.state.sortDirection === 1){
        this.UI.filters.producer.classList.add('sort-asc');
      } else {
        this.UI.filters.producer.classList.add('sort-desc');
      }
    }

    var self = this;
    this.UI.wines.sort(function(a, b){
      var direction = self.state.sortDirection;
      if (self.state.sort == 'country'){
        if (a.data.country > b.data.country){
          return 1 * direction;
        }
        if (a.data.country < b.data.country){
          return -1 * direction;
        }
        return 0;
      }
      if (self.state.sort == 'region'){
        if (a.data.region > b.data.region){
          return 1 * direction;
        }
        if (a.data.region < b.data.region){
          return -1 * direction;
        }
        return 0;
      }
      if (self.state.sort == 'class'){
        if (a.data.class > b.data.class){
          return 1 * direction;
        }
        if (a.data.class < b.data.class){
          return -1 * direction;
        }
        return 0;
      }
      if (self.state.sort == 'apellation'){
        if (a.data.apellation > b.data.apellation){
          return 1 * direction;
        }
        if (a.data.apellation < b.data.apellation){
          return -1 * direction;
        }
        return 0;
      }

      if (self.state.sort == 'producer'){
        if (a.data.producer > b.data.producer){
          return 1 * direction;
        }
        if (a.data.producer < b.data.producer){
          return -1 * direction;
        }
        return 0;
      }

      if (self.state.sort == 'lot'){
        if (a.data.lot > b.data.lot){
          return 1 * direction;
        }
        if (a.data.lot < b.data.lot){
          return -1 * direction;
        }
        return 0;
      }
      if (self.state.sort == 'auction'){
        if (a.data.auction > b.data.auction){
          return 1 * direction;
        }
        if (a.data.auction < b.data.auction){
          return -1 * direction;
        }
        return 0;
      }
      if (self.state.sort == 'lp'){
        if (a.data.id > b.data.id){
          return 1 * direction;
        }
        if (a.data.id < b.data.id){
          return -1 * direction;
        }
        return 0;
      }
      if (self.state.sort == 'low'){
        if (a.data.lowPriceSort > b.data.lowPriceSort){
          return 1 * direction;
        }
        if (a.data.lowPriceSort < b.data.lowPriceSort){
          return -1 * direction;
        }
        return 0;
      }
      if (self.state.sort == 'high'){
        if (a.data.highPriceSort > b.data.highPriceSort){
          return 1 * direction;
        }
        if (a.data.highPriceSort < b.data.highPriceSort){
          return -1 * direction;
        }
        return 0;
      }
      return 0;
    })
    //console.log(this.UI.wines);
    for (var iWine = 0; iWine < this.UI.wines.length; iWine++){
      //console.log(this.UI.wines[iWine].holder, this.UI.wines[iWine].holder.parentNode, this.UI.wines[iWine].data.id, this.UI.wines[iWine].data.lot);
      if (this.UI.wines[iWine].holder.parentNode){
        this.UI.products.appendChild(this.UI.wines[iWine].holder);
      }

    }
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
Zachys.Filter = function(){
  var self = this;
  this.UI = {};
  var html = '';
  html += '<div class="filters">';
  html += '  <div class="code-input" ref="lot" style="">';
  html += '    <b>' + SVG.Search + '</b>'
  html += '    <input type="text" ref="searchLot" placeholder="Lot #, I-Auction#, StockID">';
  html += '  </div>';
  html += '</div>';
  this.holder = Ozine.DOM(html, this.UI);
  this.UI.searchLot.oninput = function(){
    self.onChange && self.onChange('', self.UI.searchLot.value);
  }
}
Zachys.Filter.prototype.getData = function(){
  return {
    lot: this.UI.searchLot.value
  }
}

Zachys.Stock.LicensePlate = function(data){
  var self = this;
  this.UI = {};
  console.log("data:", data)
  var html = '';
  html += '<div class="item">';
  html += '  <u>';
  html += '    <b class="button" ref="button" style="width:60px; text-align: center;">Add</b>';
  html += '  </u>';
  html += '  <span id="auc-plate-lines-lot-' + countValue +  '"  ref="lot">3</span>';
  html += '  <span id="auc-plate-lines-id-' + countValue +  '"  ref="id">3</span>';
  html += '  <span id="auc-plate-lines-auction-' + countValue +  '"  class="auction" ref="auction">3</span>';
  html += '  <i ref="wines"></i>';
  html += '  <span class="button-holder">';

  html += '  </span>';
  html += '</div>';
  this.holder = Ozine.DOM(html, this.UI, true);
  this.data = data;

  this.UI.lot.innerHTML = data.lot;
  this.UI.id.innerHTML = data.id;
  this.UI.auction.innerHTML = data.auction;
  this.UI.button.onclick = function(){
    self.setState({ added: !self.state.added });
    self.onSelect && self.onSelect();
  }

  var wines = data.wines;
  var contentDataStr = '';
  for (var iWine = 0; iWine < wines.length; iWine++) {
    contentDataStr += wines[iWine].name + "<br/><i>" + wines[iWine].allcodes + "</i><br/>";
  }

  var wine = document.createElement('div');
  wine.innerHTML = "<b id='auc-plate-lines-qty-" + countValue +  "' >" + data.qty + "</b><b id='auc-plate-lines-low-price-" + countValue + "' class='column-low-price'>" + this.price(data.lowPrice) + 
  "</b><b id='auc-plate-lines-high-price-" + countValue +  "' class='column-high-price'>" + this.price(data.highPrice) + 
  "</b><b class='column-name'>" + contentDataStr + " </b><b class='column-country' >" + 
  data.country + "</b><b  class='column-region'>" + data.region + 
  "</b><b class='column-class'>" + data.class + "</b><b  class='column-apellation'>" + data.apellation + "</b><b class='column-producer'>" + 
  data.producer + "</b><b class='column-country' style='display: none;' id='auc-plate-lines-country-" + countValue +  "' >" + 
  data.countryId + "</b><b style='display: none;' id='auc-plate-lines-regionid-" + countValue +  "' class='column-region'>" + data.regionId + 
  "</b><b style='display: none;' id='auc-plate-lines-classid-" + countValue +  "' class='column-class'>" + data.classId + 
  "</b><b style='display: none;' id='auc-plate-lines-apellationid-" + countValue +  "' class='column-apellation'>" + 
  data.apellationId + "</b><b style='display: none;' id='auc-plate-lines-producerid-" + countValue +  "' class='column-producer'>" + 
  data.producerId + "</b><b style='display: none;' id='auc-plate-lines-sizeid-" + countValue +  "'>" + 
  data.sizeId + "</b><b style='display: none;' id='auc-plate-lines-sizedescription-" + countValue +  "' >" + 
  data.sizedescription + "</b><b style='display: none;' id='auc-plate-lines-varietalid-" + countValue +  "'>" + 
  data.varietalid + "</b><b style='display: none;' id='auc-plate-lines-qtybandid-" + countValue +  "' >" + 
  data.qtybandid + "</b><b style='display: none;' id='auc-plate-lines-vintagebandid-" + countValue +  "' >" + 
  data.vintagebandid + "</b> <b style='display: none;' id='auc-plate-lines-packtype-" + countValue +  "' >" + 
  data.packtype + "</b><b style='display: none;' id='auc-plate-lines-mixedlot-" + countValue +  "' >" + 
  data.mixedlot + "</b><b style='display: none;' id='auc-plate-lines-consignor-" + countValue +  "' >" + 
  data.consignor + "</b><b style='display: none;' id='auc-plate-lines-consignmentid-" + countValue +  "' >" + 
  data.consignmentid + "</b><b style='display: none;' id='auc-plate-lines-vintage-" + countValue +  "' >" + 
  data.vintage + "</b><b style='display: none;' id='auc-plate-lines-vintageid-" + countValue +  "' >" + 
  data.vintageId + "</b><b style='display: none;' id='auc-plate-lines-reserve-" + countValue +  "' >" + 
  data.reserve + "</b><b style='display: none;' id='auc-plate-lines-itemid-" + countValue +  "' >" + 
  data.itemId + "</b>";
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
  console.log("\n\n")
  if (!match.country){
    match.country = filters.country[this.data.country];
  }
  if (!match.region){
    match.region = filters.region[this.data.region];
  }
  if (!match.class){
    match.class = filters.class[this.data.class];
  }
  if (!match.apellation){
    match.apellation = filters.apellation[this.data.apellation];
  }
  if (!match.producer){
    match.producer = filters.producer[this.data.producer];
  }

  //console.log(wines, filters, match, term, id);
  if (!match.country || !match.region || !match.class || !match.apellation || !match.producer){
    this.setState({filter: false});
    return false;
  }

  term = '';
  console.log(term, id)
  if (term === '' && id === ''){
    this.setState({filter: true});
    return true;
  }
  //console.log(term, id, filters)
  //console.log(this.data, id);
  if (id){
    id = id.toString();
    if (this.data.id.toString().search(id) >= 0){
      this.setState({filter: true});
      return true;
    }
    if (this.data.auction.toString().search(id) >= 0){
      this.setState({filter: true});
      return true;
    }
    if (this.data.lot.toString().search(id) >= 0){
      this.setState({filter: true});
      return true;
    }
  }
  this.setState({filter: false });
  //console.log(Zachys.LevenshteinArias(term, this.data.name), term, this.data.name)
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

Zachys.Stock.getStockidsData = function () {
  var i = 1;
  var objDataArr = [];
  while (i <= countValue) {

      var j = 0;
      var obj = {};
      obj.stockinternalid = document.getElementById("auc-plate-lines-id-" + i) ? document.getElementById("auc-plate-lines-id-" + i).innerHTML : '';
      obj.auctioninternalid = document.getElementById("selected-auction-id") ? document.getElementById("selected-auction-id").innerHTML : '';
      obj.consignor = document.getElementById("auc-plate-lines-consignor-" + i) ? document.getElementById("auc-plate-lines-consignor-" + i).innerHTML : '';
      obj.consignmentid = document.getElementById("auc-plate-lines-consignmentid-" + i) ? document.getElementById("auc-plate-lines-consignmentid-" + i).innerHTML : '';
      obj.reserve = document.getElementById("auc-plate-lines-reserve-" + i) ? document.getElementById("auc-plate-lines-reserve-" + i).innerHTML : '';
      obj.stocklotnumber = document.getElementById("auc-plate-lines-lot-" + i) ? document.getElementById("auc-plate-lines-lot-" + i).innerHTML : '';
      obj.qty = document.getElementById("auc-plate-lines-qty-" + i) ? document.getElementById("auc-plate-lines-qty-" + i).innerHTML : '';
      obj.lowprice = document.getElementById("auc-plate-lines-low-price-" + i) ? document.getElementById("auc-plate-lines-low-price-" + i).innerHTML : '';
      obj.highprice = document.getElementById("auc-plate-lines-high-price-" + i) ? document.getElementById("auc-plate-lines-high-price-" + i).innerHTML : '';
      obj.countryid = document.getElementById("auc-plate-lines-country-" + i) ? document.getElementById("auc-plate-lines-country-" + i).innerHTML : '';
      obj.regionid = document.getElementById("auc-plate-lines-regionid-" + i) ? document.getElementById("auc-plate-lines-regionid-" + i).innerHTML : '';
      obj.classid = document.getElementById("auc-plate-lines-classid-" + i) ? document.getElementById("auc-plate-lines-classid-" + i).innerHTML : '';
      obj.apellationid = document.getElementById("auc-plate-lines-apellationid-" + i) ? document.getElementById("auc-plate-lines-apellationid-" + i).innerHTML : '';
      obj.producerid = document.getElementById("auc-plate-lines-producerid-" + i) ? document.getElementById("auc-plate-lines-producerid-" + i).innerHTML : '';
      obj.sizeid = document.getElementById("auc-plate-lines-sizeid-" + i) ? document.getElementById("auc-plate-lines-sizeid-" + i).innerHTML : '';
      obj.sizedescription = document.getElementById("auc-plate-lines-sizedescription-" + i) ? document.getElementById("auc-plate-lines-sizedescription-" + i).innerHTML : '';
      obj.varietalid = document.getElementById("auc-plate-lines-varietalid-" + i) ? document.getElementById("auc-plate-lines-varietalid-" + i).innerHTML : '';
      obj.qtybandid = document.getElementById("auc-plate-lines-qtybandid-" + i) ? document.getElementById("auc-plate-lines-qtybandid-" + i).innerHTML : '';
      obj.vintagebandid = document.getElementById("auc-plate-lines-vintagebandid-" + i) ? document.getElementById("auc-plate-lines-vintagebandid-" + i).innerHTML : '';
      obj.packtype = document.getElementById("auc-plate-lines-packtype-" + i) ? document.getElementById("auc-plate-lines-packtype-" + i).innerHTML : '';
      obj.mixedlot = document.getElementById("auc-plate-lines-mixedlot-" + i) ? document.getElementById("auc-plate-lines-mixedlot-" + i).innerHTML : false;
      obj.vintage = document.getElementById("auc-plate-lines-vintage-" + i) ? document.getElementById("auc-plate-lines-vintage-" + i).innerHTML : '';
      obj.vintageid = document.getElementById("auc-plate-lines-vintageid-" + i) ? document.getElementById("auc-plate-lines-vintageid-" + i).innerHTML : '';
      obj.itemId = document.getElementById("auc-plate-lines-itemid-" + i) ? document.getElementById("auc-plate-lines-itemid-" + i).innerHTML : '';
      if (obj.stockinternalid) {

          objDataArr.push(obj);
      }

      i++;
  } 

  return objDataArr;
}

Zachys.Stock.createOrUpdateRecord = function(stockIdsData, nextAction) {
  Zachys.Stock.startLoader();
  var xhr = new XMLHttpRequest();
      xhr.open('POST', window.suiteletUrl);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(stockIdsData));
      xhr.onreadystatechange = function () {
          if (xhr.readyState == XMLHttpRequest.DONE) {
              var objResponse = JSON.parse(xhr.responseText);
              if(objResponse.type == "Success" && nextAction == "refreshpage"){
                Zachys.Stock.endLoader();
                alert("Records has been created successfully")
                location.reload();
              }  
              if(objResponse.type == "Success" && nextAction == "closetab"){
                Zachys.Stock.endLoader();
                close();
              
              }  
          } else {
            Zachys.Stock.endLoader();
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