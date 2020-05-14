
Zachys.Table = {};
var ROWS_PER_PAGE = 8;
Zachys.Table.Table = function(settings) {
  var self = this;
  var html = '';
  html += '<div class="scrollTable">';
  html += '  <div class="header" ref="header">';
  html += '    <div class="header-fix" ref="header.fix"></div>';
  html += '    <div class="header-container" ref="header.container">';
  html += '      <div class="header-scroll" ref="header.scroll"></div>';
  html += '    </div>';
  html += '  </div>';
  html += '  <div class="content">';
  html += '    <div class="content-fix" ref="content.fix"></div>';
  html += '    <div class="content-container" ref="content.container">';
  html += '      <div class="content-scroll" ref="content.scroll"></div>';
  html += '    </div>';
  html += '  </div>';
  html += '  <div class="paging">';
  html += '    <b class="first disabled" ref="first">' + SVG.AngleDoubleLeft + '</b>';
  html += '    <b class="prev disabled" ref="prev">' + SVG.AngleLeft + '</b>';
  html += '    <span ref="paging"></span>'
  html += '    <b class="next disabled" ref="next">' + SVG.AngleLeft + '</b>';
  html += '    <b class="last disabled" ref="last">' + SVG.AngleDoubleLeft + '</b>';
  html += '  </div>'
  html += '</div>';

  this.UI = {};
  this.settings = settings;
  this.holder = Ozine.DOM(html, this.UI, true);
  this.items = [];
  this.rowsPerPage = this.settings.appLinesRowsPerPage ? this.settings.appLinesRowsPerPage : ROWS_PER_PAGE;

  this.filters = {};

  var fixedWidth = 0;
  var totalWidth = 0;
  this.scrollWidth = 0;
  var columns = settings.columns;
  this.UI.columns = [];
  this.columnsHeaders = {};
  for (var iCol = 0; iCol < columns.length; iCol++) {
    var column = document.createElement('div');
    column.innerHTML = '<span class="' + (columns[iCol].filter ? 'filter' : '') + '">' + columns[iCol].name + '</span>';
    if (columns[iCol].sort){
      column.sort = document.createElement('i');
      column.sort.innerHTML = '&nbsp;' + SVG.ArrowUp;
      column.sort.id = columns[iCol].sort;
      column.sort.onclick = function(){
        if (self.state.sort == this.id){
          self.setState({sortDirection: self.state.sortDirection == 1 ? -1 : 1, currentPage: 0})
        } else {
          self.setState({sort: this.id, sortDirection: 1, currentPage: 0})
        }
      }
      column.appendChild(column.sort);
    }
    if (columns[iCol].filter){
      this.filters[columns[iCol].filter] = {};
    }

    column.style.width = (((iCol === columns.length - 1) ? 7 : 0) + columns[iCol].width) + 'px';

    if (columns[iCol].filter){
      var filter = new Zachys.Table.HeaderDD(column, this.filters[columns[iCol].filter], true);
      filter.filter = columns[iCol].filter;
      filter.onChange = function(filter){
        self.filters[this.filter] = filter;
        self.setState({filters: self.filters, currentPage: 0});
      }
      column.filter = filter;
    }

    totalWidth += columns[iCol].width;
    if (columns[iCol].fixed){
      fixedWidth += columns[iCol].width;
      this.UI.header.fix.appendChild(column);
    } else {
      this.UI.header.scroll.appendChild(column);
      this.scrollWidth += columns[iCol].width;
    }
    column.data = columns[iCol];

    columns[iCol].id && (this.columnsHeaders[columns[iCol].id] = column);

    this.UI.columns.push(column);
  }
  this.UI.header.scroll.style.marginLeft = fixedWidth + 'px';
  this.UI.header.fix.style.width = fixedWidth + 'px';

  this.UI.content.scroll.style.marginLeft = fixedWidth + 'px';
  this.UI.content.fix.style.width = fixedWidth + 'px';

  var scrollSource = null;
  this.UI.content.container.onscroll = function (event) {
    if (scrollSource !== null && scrollSource !== this && new Date().getTime() - scrollTime < 100) {
        return false;
    }
    scrollSource = this;
    scrollTime = new Date().getTime();
    self.UI.header.fix.classList[this.scrollLeft !== 0 ? 'add' : 'remove']('shadow');
    self.UI.content.fix.classList[this.scrollLeft !== 0 ? 'add' : 'remove']('shadow');
    self.UI.header.container.scrollLeft = this.scrollLeft;
    self.UI.content.fix.scrollTop = this.scrollTop;
  };
  this.UI.content.fix.onscroll = function (event) {
    if (scrollSource !== null && scrollSource !== this && new Date().getTime() - scrollTime < 100) {
        return false;
    }
    scrollSource = this;
    scrollTime = new Date().getTime();
    self.UI.content.container.scrollTop = this.scrollTop;
  }

  this.UI.first.onclick = function(){
    var isLineTableId = this.parentNode.parentElement.parentElement.id;

    if(isLineTableId == 'table-container-lines'){
      self.setState({ currentPage: 0 })
    } else {

      self.state.tableLine = true;
      Zachys.Stock.getItemsDetail(0, ROWS_PER_PAGE);
      self.setState({ currentPage: 0 });      
    }
  };
  this.UI.prev.onclick = function(){
    var isLineTableId = this.parentNode.parentElement.parentElement.id;

    if(isLineTableId == 'table-container-lines'){
      self.setState({ currentPage: Math.max(self.state.currentPage - 1, 0) })
    } else {
      self.state.tableLine = true;
      var currentPage = Math.max(self.state.currentPage - 1, 0);
      var startIndex = Number(currentPage * ROWS_PER_PAGE);
      var endIndex = Number((currentPage + 1) * ROWS_PER_PAGE);
  
      Zachys.Stock.getItemsDetail(startIndex, endIndex);
      self.setState({ currentPage:  currentPage})
      
    }

  };
  this.UI.next.onclick = function(){
    var isLineTableId = this.parentNode.parentElement.parentElement.id;

    if(isLineTableId == 'table-container-lines'){
      self.state.tableLine = true;
      self.setState({ currentPage: Math.min(self.state.currentPage + 1, self.state.totalPages - 1) })

    } else {
      var currentPage = Math.min(self.state.currentPage + 1, self.state.totalPages - 1) ;
      var startIndex = Number(currentPage * ROWS_PER_PAGE);
      var endIndex = Number((currentPage + 1) * ROWS_PER_PAGE);
  
      Zachys.Stock.getItemsDetail(startIndex, endIndex);
      self.setState({ currentPage: currentPage })
      
    }


  };
  this.UI.last.onclick = function(){
    var isLineTableId = this.parentNode.parentElement.parentElement.id;

    if(isLineTableId == 'table-container-lines'){
      self.state.tableLine = true;
      self.setState({ currentPage: Math.ceil(self.state.totalPages) - 1 })

    } else {
      var currentPage = self.state.totalPages - 1;
      var startIndex = Number(currentPage * ROWS_PER_PAGE);
      var endIndex = Number((currentPage + 1) * ROWS_PER_PAGE);
  
      Zachys.Stock.getItemsDetail(startIndex, endIndex);
      self.setState({ currentPage: currentPage })
      
    }

  };

  this.filterItems = [];
  this.state = {
    filters: {}
  }
  Ozine.addState(this);
  this.setState({ sort: 'lot', sortDirection: -1, totalPages: 0, currentPage: 0 });
}
Zachys.Table.Table.prototype.onState = function(state) {
  var self = this;
  if (state.sort || state.sortDirection){
    var columns = this.UI.columns;
    for (var iCol = 0; iCol < columns.length; iCol++){
      if (columns[iCol].sort){
        columns[iCol].classList.remove('sort-asc');
        columns[iCol].classList.remove('sort-desc');
        if (this.state.sort === columns[iCol].sort.id){
          if (this.state.sortDirection === 1){
            columns[iCol].classList.add('sort-asc');
          } else {
            columns[iCol].classList.add('sort-desc');
          }
        }
      }

    }

    var self = this;
    this.items.sort(function(a, b){
      var direction = self.state.sortDirection;
      if (a.data[self.state.sort] > b.data[self.state.sort]){
        return 1 * direction;
      }
      if (a.data[self.state.sort] < b.data[self.state.sort]){
        return -1 * direction;
      }
      return 0;
    });
    if(!state.hasOwnProperty('totalPages')){
      this.reset();
    }
    for (var iItem = 0; iItem < this.items.length; iItem++){
      if (this.items[iItem].row.parentNode){
        this.UI.content.fix.appendChild(this.items[iItem].rowFixed);
        this.UI.content.scroll.appendChild(this.items[iItem].row);
      }

    }

  }

  if (state.hasOwnProperty("search") || state.filters) {
    this.filterItems = [];
    for (var iItem = 0; iItem < this.items.length; iItem++){
      var item = this.items[iItem];
      var show = this.settings.filter(item.data, this.state.search, this.state.filters);
      item.row.style.display = (show ? '' : 'none');
      item.rowFixed.style.display = (show ? '' : 'none');
      show && this.filterItems.push(item);
    }
    state.totalPages = this.filterItems.length / this.rowsPerPage
    this.state.totalPages = this.filterItems.length / this.rowsPerPage
  }

  if (state.hasOwnProperty('totalPages') || state.hasOwnProperty('currentPage')) {
    
    this.UI.paging.innerHTML = '';
    var first = Math.max(this.state.currentPage - 2, 0);
    var last = Math.min(first + 5, this.state.totalPages);
    for (var iPage = first; iPage < last; iPage++){
      var button = document.createElement('b');
      button.innerHTML = iPage + 1;
      button.className = 'selected';
      button.page = iPage;
      if(this.state.tableLine || this.rowsPerPage == 50){ 
        
        button.onclick = function(){
            self.setState({ currentPage: this.page })
          
        }

      } else {

        button.onclick = function(){
            var startIndex = Number(this.page * ROWS_PER_PAGE);
            var endIndex = Number((this.page + 1) * ROWS_PER_PAGE);
    
            Zachys.Stock.getItemsDetail(startIndex, endIndex);
            self.setState({ currentPage: this.page }) 
          
        }

      }
      this.UI.paging.appendChild(button);
    }

    if(this.state.tableLine || this.rowsPerPage == 50){
      for (var iItem = 0; iItem < this.items.length; iItem++) {
        var item = this.items[iItem];
        item.row.style.display = ('none');
        item.rowFixed.style.display = ('none');
      }

    }

    var length = Math.min(this.rowsPerPage * (this.state.currentPage + 1), this.filterItems.length)
    var tabIndex = 1;
    for (var iItem = this.rowsPerPage * this.state.currentPage; iItem < length; iItem++){
      var item = this.filterItems[iItem];
      item.row.style.display = '';
      item.rowFixed.style.display = '';
      var inputs = item.rowFixed.getElementsByClassName('tab');
      for (var iInput = 0; iInput < inputs.length; iInput++){
        inputs[iInput].tabIndex = tabIndex.toString();
        tabIndex++;
      }
      var inputs = item.row.getElementsByClassName('tab');
      for (var iInput = 0; iInput < inputs.length; iInput++){
        inputs[iInput].tabIndex = tabIndex.toString();
        tabIndex++;
      }

    }

    this.UI.first.classList[this.state.currentPage === 0 ? 'add' : 'remove']('disabled');
    this.UI.prev.classList[this.state.currentPage === 0 ? 'add' : 'remove']('disabled');
    this.UI.last.classList[this.state.currentPage === this.state.totalPages - 1 ? 'add' : 'remove']('disabled');
    this.UI.next.classList[this.state.currentPage === this.state.totalPages - 1 ? 'add' : 'remove']('disabled');
  }
}
Zachys.Table.Table.prototype.columns = function(columns){
  this.columnOrder = columns;
  var enabledColumns = {};

  for (var iCol = 0; iCol < columns.length; iCol++) {
    var cell = this.columnsHeaders[columns[iCol]];
    cell.parentNode.appendChild(cell);
    enabledColumns[columns[iCol]] = true;
  }

  var scrollWidth = 0;
  for (var iCol = 0; iCol < this.UI.columns.length; iCol++) {
    var column = this.UI.columns[iCol].data;
    if (!column.fixed){
      this.UI.columns[iCol].style.display = (enabledColumns[column.id] || !column.id ? '' : 'none');
    }
    if (!column.fixed && (enabledColumns[column.id] || !column.id)){
      scrollWidth += column.width;

    }
  }

  this.scrollWidth = scrollWidth;

  for (var iItem = 0; iItem < this.items.length; iItem++) {
    var columnsDict = this.items[iItem].column;
    for (var colID in this.columnsHeaders) {
      if (colID && !enabledColumns[colID]) {
        var cell = columnsDict[colID];
        cell && cell.parentNode && cell.parent.removeChild(cell);
      }
    }
    if (this.columnOrder) {
      for (var iCol = 0; iCol < this.columnOrder.length; iCol++) {
        var cell = columnsDict[this.columnOrder[iCol]];
        cell && cell.parent.appendChild(cell);
      }
    }
    this.items[iItem].row.style.width = this.scrollWidth + 'px';
  }

}
Zachys.Table.Table.prototype.createFilters = function(){
  for (var iCol = 0; iCol < this.UI.columns.length; iCol++){
    var column = this.UI.columns[iCol];
    if (column.filter){
      column.filter.render(this.filters[column.filter.filter]);
    }
  }
}
Zachys.Table.Table.prototype.updateFilters = function() {
  var originalFilters = {};
  for (var property in this.filters) {
    originalFilters[property] = this.filters[property];
    this.filters[property] = {};
  }
  for (var iItem = 0; iItem < this.items.length; iItem++){
    var data = this.items[iItem].data;
    for (var property in this.filters){
      var filterValue = data[property];
      var oFilter = originalFilters[property];
      this.filters[property][data[property]] = (oFilter.hasOwnProperty(filterValue) ? oFilter[filterValue] : true);
    }
  }
  for (var iCol = 0; iCol < this.UI.columns.length; iCol++){
    var column = this.UI.columns[iCol];
    if (column.filter){
      column.filter.render(this.filters[column.filter.filter]);
    }
  }
  this.setState({filters: this.filters, currentPage: 0});
}
Zachys.Table.Table.prototype.reset = function() {
  var originalFilters = {};
  for (var property in this.filters) {
    originalFilters[property] = this.filters[property];
    this.filters[property] = {};
  }
  for (var iItem = 0; iItem < this.items.length; iItem++){
    var data = this.items[iItem].data;
    for (var property in this.filters){
      this.filters[property][data[property]] = true;
    }
  }
  for (var iCol = 0; iCol < this.UI.columns.length; iCol++){
    var column = this.UI.columns[iCol];
    if (column.filter){
      column.filter.render(this.filters[column.filter.filter]);
    }
  }
  this.setState({filters: this.filters, currentPage: 0, totalPages: this.items.length, search: ''});
}
Zachys.Table.Table.prototype.filter = function(search){
  this.setState({ search: search, currentPage: 0 });
}
Zachys.Table.Table.prototype.addItem = function(data, addToStart){
  var self = this;
  var columns = this.settings.columns;
  var rowColumns = [];
  var row = document.createElement('div');
  row.className = 'row';
  row.onmouseover = function(){
    rowFixed.classList.add('hover');
    row.classList.add('hover');
  }
  row.onmouseout = function(){
    rowFixed.classList.remove('hover');
    row.classList.remove('hover');
  }

  for (var property in this.filters){
    this.filters[property][data[property]] = true;
  }

  var rowFixed = document.createElement('div');
  rowFixed.className = 'row';
  rowFixed.onmouseover = function(){
    rowFixed.classList.add('hover');
    row.classList.add('hover');
  }
  rowFixed.onmouseout = function(){
    rowFixed.classList.remove('hover');
    row.classList.remove('hover');
  }

  var rowEntity = {fixed: rowFixed, scroll: row, remove: function(){
    rowFixed.parentNode && rowFixed.parentNode.removeChild(rowFixed);
    row.parentNode && row.parentNode.removeChild(row);
    for (var iItem = 0; iItem < self.items.length; iItem++) {
      if (self.items[iItem].data === data) {
        self.items.splice(iItem, 1);
      }
    }
    for (var iItem = 0; iItem < self.filterItems.length; iItem++) {
      if (self.filterItems[iItem].data === data) {
        self.filterItems.splice(iItem, 1);
      }
    }
  }, dispatch: function(events, col) {

    for (var iCol = 0; iCol < rowColumns.length; iCol++){
      if (rowColumns[iCol].model && rowColumns[iCol].model.bind){
        if (rowColumns[iCol].model === col){
          continue;
        }
        var bind = rowColumns[iCol].model.bind;
        var reRender = false;
        for (var iBind = 0; iBind < bind.length && !reRender; iBind++){
          for (var iEvent = 0; iEvent < events.length && !reRender; iEvent++){
            if (bind[iBind] === events[iEvent]){
              reRender = true;
            }
          }
        }

        if (reRender){
          var column = rowColumns[iCol];
          column.innerHTML = '';
          if (column.model.render.constructor === String) {
            column.innerHTML = data[column.model.render];
          } else {
            var content = column.model.render(data, rowEntity, column.model);
            if (content.constructor === String){
              column.innerHTML = content;
            } else {
              column.appendChild(content);
            }

          }
        }

      }
    }

    var bindEvents = self.settings.bind || [];
    var fireChange = false;
    for (var iBind = 0; iBind < bindEvents.length; iBind++) {
      for (var iEvent = 0; iEvent < events.length; iEvent++) {
        if (bindEvents[iBind] === events[iEvent]) {
          fireChange = true;
          iEvent = Infinity;
          iBind = Infinity;
        }
      }
    }
    if (fireChange){
      self.settings.onChange && self.settings.onChange();
    }
  }};

  var columnsDict = {};
  for (var iCol = 0; iCol < columns.length; iCol++) {
    var column = document.createElement('div');
    column.model = columns[iCol];
    //column.innerHTML = columns[iCol].name;
    column.style.width = columns[iCol].width + 'px';
    if (columns[iCol].fixed){
      rowFixed.appendChild(column);
    } else {
      row.appendChild(column);
    }
    if (columns[iCol].className){
      column.className = columns[iCol].className;
    }
    if (columns[iCol].render.constructor === String) {
      column.innerHTML = data[columns[iCol].render];
    } else {
      var content = columns[iCol].render(data, rowEntity, column.model);
      if (content.constructor === String){
        column.innerHTML = content;
      } else {
        column.appendChild(content);
      }
    }
    if (columns[iCol].id) {
      columnsDict[columns[iCol].id] = column;
    }
    column.parent = column.parentNode;
    rowColumns.push(column);
  }

  this.UI.content.fix.appendChild(rowFixed);
  this.UI.content.scroll.appendChild(row);
  row.style.width = this.scrollWidth + 'px';

  if (this.columnOrder) {
    var enabledColumns = {};

    for (var iCol = 0; iCol < this.columnOrder.length; iCol++) {
      enabledColumns[this.columnOrder[iCol]] = true;
    }
    for (var colID in this.columnsHeaders) {
      if (colID && !enabledColumns[colID]) {
        var cell = columnsDict[colID];
        cell && cell.parent.removeChild(cell);
      }
    }
    for (var iCol = 0; iCol < this.columnOrder.length; iCol++) {
      var cell = columnsDict[this.columnOrder[iCol]];
      cell && cell.parent.appendChild(cell);
    }
  }
  var item = {
    data: data,
    row: row,
    rowFixed: rowFixed,
    column: columnsDict,
  };
  this.items.push(item);

  this.settings.onChange && this.settings.onChange();

  this.filterItems.push(item)
  var totalNumberOfItems = this.settings.totalNumberOfItems ? this.settings.totalNumberOfItems : this.items.length;
  this.setState({ totalPages: Math.ceil(totalNumberOfItems / this.rowsPerPage) })
}
Zachys.Table.Table.prototype.clear = function(){
  this.UI.content.fix.innerHTML = "";
  this.UI.content.scroll.innerHTML = "";
  this.items = [];
  this.filterItems = [];
}

Zachys.Table.HeaderDD = function(cell, filter, isAbsolute){
  var self = this;
  var button = cell.children[0];

  var UI = {};

  var html = '';
  html += '<div class="popup table-header-filter" ref="popup">';
  html += '  <div class="search" ref="searchBar">';
  html += '    <b ref="selectAll"></b>';
  html += '    <input type="text" ref="text"/>';
  html += '    <i>' + SVG.Search + '</i>'
  html += '  </div>';
  html += '  <div ref="popup.content"></div>';
  html += '</div>';

  cell.appendChild(Ozine.DOM(html, UI));

  UI.popup.style.display = 'none';
  UI.text.oninput = function(){
    self.setState({
      search: this.value
    });
  }
  /*var popup = document.createElement('div');
  popup.style.display = 'none';
  popup.className = 'popup';
  cell.appendChild(popup);*/
  Ozine.UI.popupize(button, UI.popup);

  //popup.content = document.createElement('div');
  //popup.appendChild(popup.content);

  var values = {};
  this.values = values;
  var properties = Object.keys(filter);
  properties.sort();

  UI.selectAll.selected = true;
  UI.selectAll.classList.add('selected');
  UI.selectAll.onclick = function(){
    this.selected = !this.selected;
    this.classList[this.selected ? 'add' : 'remove']('selected');

    var children = UI.popup.content.children;
    for (var iChild = 0; iChild < children.length; iChild++){
      var filterDiv = children[iChild];
      values[filterDiv.property] = this.selected;
      filterDiv.classList[this.selected ? 'add' : 'remove']('selected');
    }

    self.onChange && self.onChange(values);
  }

  for (var iProperty = 0; iProperty < properties.length; iProperty++){
    var property = properties[iProperty];
    var filterDiv = document.createElement('div');
    filterDiv.className = 'selected';
    filterDiv.innerHTML = (property === '') ? 'Unset' : property;
    values[property] = true;
    filterDiv.property = property;
    filterDiv.onclick = function(){
      values[this.property] = !values[this.property];
      this.classList[values[this.property] ? 'add' : 'remove']('selected');
      self.onChange && self.onChange(values);

      var isSelectedAll = true;
      var children = UI.popup.content.children;
      for (var iChild = 0; iChild < children.length; iChild++){
        if (!values[children[iChild].property]){
          isSelectedAll = false;
          break;
        }
      }

      UI.selectAll.selected = isSelectedAll;
      UI.selectAll.classList[UI.selectAll.selected ? 'add' : 'remove']('selected');

    }
    UI.popup.content.appendChild(filterDiv);
  }
  this.UI = UI;

  Ozine.addState(this);

  if (isAbsolute){
    button.popup.onOpen = function(){
      UI.popup.style.left = button.getBoundingClientRect().right + 'px';
      UI.popup.style.top = button.getBoundingClientRect().top + 'px';
      UI.popup.style.maxWidth = '240px';
      UI.popup.style.transform = 'translate(-100%, 23px) translateX(10px)';
      document.body.appendChild(UI.popup);
    }
  }
}
Zachys.Table.HeaderDD.prototype.render = function(filter){
  var self = this;
  var UI = this.UI;
  var values = this.values;
  var properties = Object.keys(filter);
  properties.sort();
  UI.popup.content.innerHTML = '';
  for (var iProperty = 0; iProperty < properties.length; iProperty++){
    var property = properties[iProperty];
    var filterDiv = document.createElement('div');
    filterDiv.className = filter[property] ? 'selected' : '';
    filterDiv.innerHTML = (property === '') ? 'Unset' : property;
    values[property] = filter[property];
    filterDiv.property = property;
    filterDiv.onclick = function(){
      values[this.property] = !values[this.property];
      this.classList[values[this.property] ? 'add' : 'remove']('selected');
      self.onChange && self.onChange(values);

      var isSelectedAll = true;
      var children = UI.popup.content.children;
      for (var iChild = 0; iChild < children.length; iChild++){
        if (!values[children[iChild].property]){
          isSelectedAll = false;
          break;
        }
      }
      UI.selectAll.selected = isSelectedAll;
      UI.selectAll.classList[UI.selectAll.selected ? 'add' : 'remove']('selected');
    }
    UI.popup.content.appendChild(filterDiv);
  }
}
Zachys.Table.HeaderDD.prototype.onState = function(state) {
  if (state.search){
    var values = this.values;
    var children = this.UI.popup.content.children;
    for (var iChild = 0; iChild < children.length; iChild++){
      var filterDiv = children[iChild];
      filterDiv.style.display = (filterDiv.property.toLowerCase().search(state.search.toLowerCase()) >= 0 ? '' : 'none');
    }
  }
}

Zachys.Dropdown = function(settings){
  var self = this;
  var UI = {};
  var html = '';
  html += '<div class="dropdown">';
  html += '  <div id="dropdown-div-id" class="label" ref="button">';
  html += '    <span ref="label"></span>';
  html += '    <span id="selected-auction-id" style="display: none;" ref="labelid"></span>';
  html += '    <b>' + SVG.ArrowUp + '</b>';
  html += '  </div>';
  html += '  <div class="popup" ref="popup">';
  html += '    <div class="search" ref="searchBar">';
  html += '      <input type="text" ref="text"/>';
  html += '      <i>' + SVG.Search + '</i>'
  html += '    </div>';
  html += '    <div ref="popup.content"></div>';
  html += '  </div>';
  html += '</div>';

  this.UI = UI;

  this.holder = Ozine.DOM(html, UI);

  this.UI.label.innerHTML = settings.blank;

  UI.popup.style.display = 'none';
  UI.text.oninput = function(){
    self.setState({
      search: this.value
    });
  }
  Ozine.UI.popupize(UI.button, UI.popup);
  Ozine.addState(this);
}
Zachys.Dropdown.prototype.getValue = function(){
  return this.value ? this.value.id : null;
}
Zachys.Dropdown.prototype.setOptions = function(options) {
  var self = this;
  for (var iOption = 0; iOption < options.length; iOption++) {
    var option = document.createElement('div');
    option.innerHTML = options[iOption].name;
    option.id = options[iOption].id;
    option.data = options[iOption];
    option.onclick = function() {
      var children = self.UI.popup.content.children;
      for (var iChild = 0; iChild < children.length; iChild++) {
        children[iChild].classList[children[iChild] == this ? 'add' : 'remove']('selected');
      }
      self.value = this.data;
      self.UI.label.innerHTML = this.data.name;
      self.onChange && self.onChange(this.data);
      self.holder.classList.remove('invalid');
      self.UI.button.popup.close();
    }
    this.UI.popup.content.appendChild(option);
  }
}
Zachys.Dropdown.prototype.validate = function(){
  var isValid = this.getValue() !== null;
  this.holder.classList[(!isValid ? 'add' : 'remove')]('invalid')
  return isValid;
}
Zachys.Dropdown.prototype.onState = function(state) {
  if (state.search) {
    var children = this.UI.popup.content.children;
    for (var iChild = 0; iChild < children.length; iChild++) {
      var filterDiv = children[iChild];
      filterDiv.style.display = (filterDiv.data.name.toLowerCase().search(state.search.toLowerCase()) >= 0 ? '' : 'none');
    }
  }
}


Zachys.Popup = function(settings) {
  this.UI = {};
  var self = this;
  var html = '';
  html += '<div class="popup-container" ref="holder">';
  html += '  <div class="title">';
  html += '    <b ref="buttons.close">' + SVG.Close + '</b>';
  html += '    <span ref="title"></span>';
  html += '  </div>';
  html += '  <div class="container" ref="container"></div>'
  html += '</div>';

  document.body.appendChild(Ozine.DOM(html, this.UI));

  this.UI.holder.style.display = 'none';
  this.UI.buttons.close.onclick = function(){
    self.UI.holder.style.display = 'none'
  }
  this.UI.holder.style.maxWidth = settings.width + 'px';
  this.UI.holder.style.maxHeight = settings.height + 'px';
  this.UI.title.innerHTML = settings.title;
}
Zachys.Popup.prototype.show = function(){
  this.UI.holder.style.display = '';
}
