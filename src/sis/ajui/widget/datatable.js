"use strict";
/**
 * Rich Data Table (old)
 *  Features:
 *    - Copy&Paste from Excel
 *    - Sort
 *    - Filter
 */

// == New Concept ==
//
// +==========+===========================================================+
// | Header 1 | Header 2                                                  |
// +----------+-----------------------------------------------------------+
// | Col 11   | Col 21                                                  A | <- 1
// ~          ~                                                         | ~
// | Col 15   | Col 25                                                  | | <- 5
// | Col 16   | Col 26                                                  | | <- 6
// ~          ~                                                         | ~
// |          |                                                         | |
// |          |                                               ,-----------+
// |          |                                               | < 1...5 > |
// +==========================================================+===========+

// datasource = {
//   /// read a page
//   read: function (from, to, filters, sorts, callback) { ... },
//
//   /// write a page
//   write: function (data, callback) { ... },
//
//   /// get fully available count of collection
//   count: function (callback) { ... }
// }

// getDataSource().read(1000, 1100, [{tld: '.de'}], [{created_at: 1}], callback)

// data = [
//    {
//      _primary:       '1',
//      _selected:      false,
//
//      _loaded:        true,
//
//      _modified:      false,
//      _isNew:         false,
//
//      _columns: {
//            Col11: {
//                editable:   Boolean,
//                widget:     AdminJUI_Widget,
//                static:     String,
//                value:      Object,
//                origValue:  Object
//            },
//            Col21: ...
//        }
//   },
//   ...
// ]
//
// shown = {
//   from: Integer,
//   to: Integer
// }

function AdminJUI_DataTable_TableModel() {
	this._eventManager = sis.ajui.Elements.createEventManager(this);
}

/*
 * Data Table
 *
 *
 *
 *
 */

AdminJUI_DataTable_TableModel.prototype = {
    getColumnCount: function () {
        return 0;
    },

    getRowCount: function () {
        return 0;
    },

    getColumnName: function (columnIndex) {
        return 'Unknown';
    },

    isCellEditable: function (rowIndex, columnIndex) {
        return false;
    },

    getValueAt: function (rowIndex, columnIndex) {
        return null;
    },

    setValueAt: function (data, rowIndex, columnIndex) {
        return this;
    },

    fetch: function (offset, limit, filters) {

    },

    getEventManager: function () {
        return this._eventManager;
    }
};

function AdminJUI_DataTable() {
	AdminJUI_FormElement.call(this);

	this._className = 'DataTable';
	this._allowedChildrenClasses = [];

	// view related
	this._gridObjects   = []; // header elements

    // data related
	this._cellMatrix    = []; // all cell objects align in a matrix format

    // primary key -> was modified (bool)
    this._modifiedRows  = {};

    // dom objects
	this._inputField    = $('<div />').addClass('adminjui-datatable-table');
	this._tableHeader   = $('<div />').addClass('adminjui-datatable-table-header');
	this._tableBody     = $('<div />').addClass('adminjui-datatable-table-body');

	this._inputField.append(this._tableHeader);
	this._inputField.append(this._tableBody);

	this._headers = {}; // TODO: replace by _colums
    this._columns = {};

    // cached shortcuts
	this._headersToMatrixColumn = {}; // TODO: replace by _colums
	this._matrixColumnsToHeader = []; // TODO: replace by _colums

    // view settings
	this._editable              = false;
    this._addNewRowsAllowed     = true;
    this._maxVisibleRows        = 5;
    this._columnSizes           = [];
    this._heightMode            = 'maxVisibleRows';
    this._height                = 0;
    this._usesSelector          = false;

    this._notAttachedToDomYet   = true;

    this._filters = {};
    this._filterCounter = 0;
}

AdminJUI_DataTable.prototype = CloneObject(AdminJUI_FormElement.prototype);

//AdminJUI_DataTable.prototype._createRendererByField = function (field) {
//    if (!this._columns[field]) {
//        return null;
//    }
//
//    var data = this._columns[field];
//    var elem = sis.ajui.Elements.create(data.renderer);
//
//    if (elem.commitFullSpace) {
//        elem.commitFullSpace();
//    }
//
//    if (elem.setDisabled && field != '_selected') {
//        elem.setDisabled(!this._editable);
//    }
//
//    if (data.value) {
//        elem.setValue(data.value);
//    }
//
//    return elem;
//};

/**
 * if something changed in dom structure (like be sorting or removing)
 * then our data model needs to be reset too
 */ // FIXME: BROKEN?!
//AdminJUI_DataTable.prototype._rebuildCellMatrix = function() {
//    var j = 0;
//
//    this._cellMatrix = [];
//	this._tableBody.children('.adminjui-datatable-table-row').each(function(_j, row) {
//        this._cellMatrix[j] = [];
//        var i = 0;
//		$(row).children('.adminjui-datatable-table-cell').each(function(_i, cell) {
//			var data = $(cell).data('dataObj');
//
//			data.cellNum = i;
//			data.rowNum = j;
//
//			this._cellMatrix[j][i++] = data;
//		}.bind(this));
//        j++;
//	}.bind(this));
//};

//AdminJUI_DataTable.prototype._setVisibiltyStateForRowElement = function (rowElem, hidden) {
//    if (hidden) {
//        rowElem
//            .addClass('adminjui-datatable-table-row-hidden')
//            .removeClass('adminjui-datatable-table-row');
//    } else {
//        rowElem
//            .removeClass('adminjui-datatable-table-row-hidden')
//            .addClass('adminjui-datatable-table-row');
//    }
//
//    return this;
//};

AdminJUI_DataTable.prototype.removeRowByPrimaryId = function (ids) {
    if (!ids instanceof Array) {
        ids = [ids];
    }
//
//    for (var key in ids) {
//        for (var i = 0, j = this._cellMatrix.length; i != j; i++) {
//            var row = this._cellMatrix[i][0];
//
//            if (row.row == ids[key]) {
//                var elem = row.cellObj.parent();
//
////                elem.fadeOut('fast', function () {
//                    elem.remove();
////                });
//            }
//        }
//    }
//
//    this._rebuildCellMatrix();

    return this;
};

//AdminJUI_DataTable.prototype.setVisibilityStateForRowByPrimaryId = function (primaryId, hidden) {
//    for (var i in this._cellMatrix) {
//        var row = this._cellMatrix[i][0];
//
//        if (row && (primaryId === undefined || row.row == primaryId)) {
//            this._setVisibiltyStateForRowElement(row.cellObj.parent(), hidden);
//
//            if (primaryId !== undefined) {
//                return this;
//            }
//        }
//    }
//
//    return this;
//};

//AdminJUI_DataTable.prototype._checkValueAgainstFilterRules = function (value, filter) {
//    if (filter.value) {
//        if (value.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) {
//            return true;
//        }
//    } else if (filter.regexp) {
//        if (filter.regexp.test(value)) {
//            return true;
//        }
//    } else {
//        console.log('unknown filter', filter);
//    }
//
//    return false;
//};

//AdminJUI_DataTable.prototype._refreshFilters = function () {
//    this.setVisibilityStateForRowByPrimaryId();
//
//    for (var j in this._cellMatrix) {
//        var row = this._cellMatrix[j][0].cellObj.parent();
//        var originalData = row.data('row-original-data');
//
//        this._setVisibiltyStateForRowElement(row, true);
//
//        var mayShow = true;
//
//        for (var filterId in this._filters) {
//            var filter = this._filters[filterId];
//            if (!this._columns[filter.key]) {
//                if (originalData[filter.key]) {
//                    if (!this._checkValueAgainstFilterRules(originalData[filter.key], filter)) {
//                        mayShow = false;
//                    }
//                } else {
//                    continue;
//                }
//            }
//
//            for (var i in this._cellMatrix[j]) {
//                var cell    = this._cellMatrix[j][i];
//
//                if (filter.key == cell.cell && !this._checkValueAgainstFilterRules(cell.data, filter)) {
//                    mayShow = false;
//                }
//            }
//        }
//
//        this._setVisibiltyStateForRowElement(row, !mayShow);
//    }
//
//    return this;
//};

/**
 * sorts data
 *
 * @param sortAfter
 * @param orderBy
 * @returns {AdminJUI_DataTable}
 */
AdminJUI_DataTable.prototype.sort = function(sortAfter, orderBy) {
//	this._tableHeader
//		.find('.adminjui-datatable-table-cell > a')
//		.removeClass('adminjui-datatable-sorter-asc')
//		.removeClass('adminjui-datatable-sorter-desc')
//	;
//
//	this._tableHeader.find('.adminjui-datatable-header-' + sortAfter)
//		.addClass('adminjui-datatable-sorter-' + orderBy);
//
//	var sortAfterCol = this._headersToMatrixColumn[sortAfter];
//
//	this._tableBody.children().sortElements(function(a, b) {
//		a = this._cellMatrix[$(a)[0]['_row-num']][sortAfterCol];
//		b = this._cellMatrix[$(b)[0]['_row-num']][sortAfterCol];
//
//		if (orderBy === 'asc') {
//			return a.data > b.data ? 1 : -1;
//		} else {
//			return a.data < b.data ? 1 : -1;
//		}
//
//		return 0;
//	}.bind(this));
//
//	// rearrange matrix
//	this._rebuildCellMatrix();

	return this;
};

AdminJUI_DataTable.prototype.setPrimaryKey = function() {
	throw 'not supported';
};

AdminJUI_DataTable.prototype.getColumnSizes = function () {
    return this._columnSizes;
};

AdminJUI_DataTable.prototype.setColumnSizes = function (csize) {
    this._columnSizes = csize;

    this.redraw();

    return this;
};

AdminJUI_DataTable.prototype.setColumns = function (cols) {
    this.clear();

//    var headers = {};
//    var sizes = [];
//
//    cols = $.extend({
//        _selected : {
//            header:     '',
//            renderer:   'checkbox',
//            width:      '28px'
//        }
//    }, cols);
//
//    // prepare data
//    for (var key in cols) {
//        headers[key] = cols[key].header;
//        sizes.push(cols[key].width);
//    }
//
//    this.setHeaders(headers);
//    this.setColumnSizes(sizes);
//
//    this._columns = cols;

    return this;
};

/**
 * sets header and also clears table afterwards
 * @param headers
 * @returns {AdminJUI_DataTable}
 * @deprecated use setColumns instead
 */
AdminJUI_DataTable.prototype.setHeaders = function(headers) {
//	this._headers = headers;
//
//	this._tableHeader.empty();
//	this._gridObjects = [];
//
//	var i = 0;
//
//	for(var key in headers) {
//		var cell = $('<div />').addClass('adminjui-datatable-table-cell');
//
//		var anchor = $('<a />');
//
//		this._matrixColumnsToHeader[i] = key;
//		this._headersToMatrixColumn[key] = i++;
//
//		anchor
//			.html(headers[key])
//			.attr('href', '#')
//            .attr('title', headers[key])
//			.addClass('adminjui-datatable-header-' + key)
//			.click(function(e) {
//
//			e.preventDefault();
//
//			var orderBy = 'asc';
//
//			if (this[2].hasClass('adminjui-datatable-sorter-asc')) {
//				orderBy = 'desc';
//			}
//
//			this[3].sort(this[0], orderBy);
//		}.bind([key, headers[key], anchor, this]));
//
//		cell.append(anchor);
//
//		this._tableHeader.append(cell);
//		this._gridObjects.push(cell);
//	}

	this.clear();

    this.redraw();

	return this;
};

/**
 * clears table, removes all rows
 * @returns {AdminJUI_DataTable}
 */
AdminJUI_DataTable.prototype.clear = function () {
//	// reset data
//	this._cellMatrix = [];
//	this._tableBody.empty();
//	this.redraw();

	return this;
};

/**
 * whether the whole data matrix is empty or not
 * @returns {Boolean}
 */
AdminJUI_DataTable.prototype.isEmpty = function() {
//	for (var j in this._cellMatrix) {
//		for (var i in this._cellMatrix[j]) {
//			if ($.trim(this._cellMatrix[j][i].data) !== '') {
//				return false;
//			}
//		}
//	}
//
	return true;
};

/**
 * @return Object
 */
//AdminJUI_DataTable.prototype._getDataObjFromMatrix = function(x, y) {
//	if (typeof(this._cellMatrix[y]) === 'undefined' ||
//		typeof(this._cellMatrix[y][x]) === 'undefined') {
//		return null;
//	}
//
//	return this._cellMatrix[y][x];
//};

//AdminJUI_DataTable.prototype._setDataObjFromMatrix = function(x, y, data) {
//	if (!this._cellMatrix instanceof Array) {
//		this._cellMatrix = [];
//	}
//
//	if (typeof(this._cellMatrix[y]) === 'undefined') {
//		this._cellMatrix[y] = [];
//	}
//
//	this._cellMatrix[y][x] = data;
//
//    return this;
//};

/**
 * sets value, removes existing ones
 *
 * @param values
 * @returns {AdminJUI_DataTable}
 */
AdminJUI_DataTable.prototype.setValues = function(values) {
	// add values
	this.clear().addValues(values);

	return this;
};

/**
 * adds value, primaryKey can be null
 *
 * @param primaryKey
 * @param cells
 * @returns {AdminJUI_DataTable}
 */
AdminJUI_DataTable.prototype.addRow = function(primaryKey, cells) {
//	var row = {};
//
//	// got array, lets try to think
//    if (cells instanceof Array) {
//        throw 'cannot add array as row.';
//    }
//
//	row[primaryKey] = cells;
//
//	this.addValues(row);

	return this;
};

/**
 * adds an empty row
 * @returns {AdminJUI_DataTable}
 */
AdminJUI_DataTable.prototype.addEmptyRow = function () {
	var row = {};

	for (var key in this._headers) {
		row[key] = '';
	}

//	this.addRow(0, row);
    this.addRow(null, row);

	return this;
};

/**
 * like setValues/setValue, but doesn't clear the data table
 *
 * @param values
 * @returns {AdminJUI_DataTable}
 */
AdminJUI_DataTable.prototype.addValues = function(values) {
//	var i = 0, j = this._cellMatrix.length;
//
//    for (var key in values) {
//        var row = $('<div />').addClass('adminjui-datatable-table-row');
//
//        if (this._columns) {
//            values[key] = $.extend({_selected: false}, values[key]);
//        }
//
//		row[0]['_row-num'] = j;
//
//		this._cellMatrix[j] = [];
//		i = 0;
//
//		row.data('row-primary-key', key);
//        row.data('row-original-data', values[key]);
//
//		for (var innerKey in values[key]) {
//			// FIXME: would be cleaner if cell generation was outside addValues
//			var cell = $('<div />').addClass('adminjui-datatable-table-cell');
//
//            var renderer = this._createRendererByField(innerKey);
//
//            if (!renderer) {
//                continue;
//            }
//
//			var data = {
//				// view object, here jquery object of cell
//				cellObj: cell,
//
//                // libajui widget renderer instance
//                renderer: renderer,
//
//				// AdminJUI_DataTable instance
//				that: this,
//
//				// associated keys
//				row: key,
//				cell: innerKey,
//
//				// position in matrix
//				rowNum: j,
//				cellNum: i,
//
//                // data control
//                isModified: false,
//
//				// cell content
//				data: values[key][innerKey]
//			};
//
//            var publicData = {
//                primaryKey: key,
//                column:     innerKey
//            };
//
//			this._setDataObjFromMatrix(i++, j, data);
//
//			cell.data('dataObj', data);
//
//            if (renderer) {
//                renderer.setHiddenValue('data', data);
//                renderer.setValue(values[key][innerKey]);
//
//                renderer.getEventManager().observe('change', function () {
//                    var _data = this.getHiddenValue('data');
//
//                    _data.data = this.getValue();
//
//                    if (_data.cell === '_selected') {
//                        if (this.getValue()) {
//                            _data.that.getEventManager().getType('selected').trigger(publicData);
//                        } else {
//                            _data.that.getEventManager().getType('unselected').trigger(publicData);
//                        }
//
//                        _data.that.getEventManager().getType('select').trigger(publicData);
//
//                        return;
//                    }
//
//                    _data.isModified = true;
//                    _data.that._modifiedRows[_data.that.rowNum] = true;
//
//                    _data.that._valueChanged();
//                });
//
//                cell.append(renderer.getHtmlNode());
//            }
//
//			row.append(cell);
//		}
//
//		j++;
//
//		this._tableBody.append(row);
//	}

    this.redraw();

	return this;
};

AdminJUI_DataTable.prototype.getValue = function() {
	return this.getValues();
};

AdminJUI_DataTable.prototype.getValues = function() {
	var values = [];

//	for(var j in this._cellMatrix) {
//		var line = {};
//
//		var isEmpty = true; // FIXME: make optional?
//
//		for (var i in this._cellMatrix[j]) {
//			var data = this._cellMatrix[j][i].data;
//
//			line[this._matrixColumnsToHeader[i]] = data;
//
//			if (isEmpty && $.trim(data)) {
//				isEmpty = false;
//			}
//		}
//
//		if (!isEmpty) {
//			values.push(line);
//		}
//	}

	return values;
};

AdminJUI_DataTable.prototype.getSelectedRowCount = function () {
    var count = 0;

//    for (var j in this._cellMatrix) {
//        if (this._cellMatrix[j][0] &&
//            this._cellMatrix[j][0].renderer &&
//            this._cellMatrix[j][0].renderer.getValue()) {
//            count++;
//        }
//    }

    return count;
};

AdminJUI_DataTable.prototype.getModifiedValues = function() {
    var data = {};

//    for (var j in this._cellMatrix) {
//        var line = null;
//
//		for (var i in this._cellMatrix[j]) {
//            var cell = this._cellMatrix[j][i];
//
//            if (cell.isModified) {
//                if (line === null) {
//                    line = {};
//                }
//
//                line[cell.cell] = cell.data;
//            }
//        }
//
//        if (line !== null) {
//            data[this._cellMatrix[j][0].row] = line;
//        }
//    }

    return data;
};

AdminJUI_DataTable.prototype.resetModifiedFlags = function () {
//    for (var j in this._cellMatrix) {
//    	for (var i in this._cellMatrix[j]) {
//            this._cellMatrix[j][i].isModified = false;
//        }
//    }

    return false;
};

AdminJUI_DataTable.prototype.getSelectedPrimaryIds = function () {
//    var values = [];
//
//    if (!this._columns) {
        throw 'not implemented yet';
//    }
//
//	for(var j in this._cellMatrix) {
//		var obj = this._cellMatrix[j][0];
//
//        if (!obj.data) {
//            continue;
//        }
//
//        values.push(obj.row);
//	}
//
//	return values;
};

AdminJUI_DataTable.prototype.getSelectedValues = function() {
//	var values = {};
//
//    if (!this._columns) {
        throw 'not implemented yet';
//    }
//
//	for(var j in this._cellMatrix) {
//		var line = {};
//
//		var isEmpty = true; // FIXME: make optional?
//
//        if (!this._cellMatrix[j][0].data) {
//            continue;
//        }
//
//		for (var i in this._cellMatrix[j]) {
//            if (this._matrixColumnsToHeader[i] == '_selected') {
//                continue;
//            }
//
//			var data = this._cellMatrix[j][i].data;
//
//			line[this._matrixColumnsToHeader[i]] = data;
//
//			if (isEmpty && $.trim(data)) {
//				isEmpty = false;
//			}
//		}
//
//		if (!isEmpty) {
//			values[this._cellMatrix[j][0].row] = line;
//		}
//	}
//
//	return values;
};

/**
 * @see AdminJUI_HBox.getCell
 */
AdminJUI_DataTable.prototype.getCell = function() {
	return AdminJUI_HBox.prototype.getCell.apply(this, arguments);
};

AdminJUI_DataTable.prototype.setAddNewRowsAllowed = function (allowed) {
    this._addNewRowsAllowed = allowed;

    return this;
};

AdminJUI_DataTable.prototype.setEditable = function(editable) {
	if (this._editable === editable) {
		return this;
	}

	this._editable = editable;
//
//	for (var j in this._cellMatrix) {
//		for (var i in this._cellMatrix[j]) {
//            if (this._cellMatrix[j][i].renderer !== null) {
//                if (i > 0) {
//                    this._cellMatrix[j][i].renderer.setDisabled(!editable);
//                }
//            } else {
//                this._cellMatrix[j][i].cellObj.attr('contenteditable', editable ? 'true' : null);
//            }
//		}
//	}
//
//    if (this._editable) {
//        this._inputField.addClass('adminjui-datatable-editable');
//        this._inputField.removeClass('adminjui-datatable-readonly');
//	} else {
//        this._inputField.removeClass('adminjui-datatable-editable');
//        this._inputField.addClass('adminjui-datatable-readonly');
//    }

	return this;
};

AdminJUI_DataTable.prototype.redraw = function () {
    AdminJUI_FormElement.prototype.redraw.apply(this, arguments);

    if (!this._inputField || this._notAttachedToDomYet) { // uninitialized input, no redraw.
        return this;
    }

//    // speed up everything
//    var oneRow      = this._tableBody.children('.adminjui-datatable-table-row').get(0);
//    var hasRow      = oneRow != null;
//
//    oneRow = $(oneRow);
//
//    var lineWidth   = (hasRow ? oneRow : this._inputField).innerWidth();
//    var lineHeight  = Math.max(17, (hasRow ? oneRow.outerHeight() : 0));
//    var columns     = this._gridObjects.length;
//
//    var sizes       = [];
//
//    if (lineWidth === 0) {
//        return this;
//    }
//
//    // path 1: no explicit column sizes set
//    if (this._columnSizes.length != columns) {
//        var newWidth = lineWidth / columns - 10; // 10 = cell's padding. FIXME
//
//        // spray newWidth across sizes Array
//        for (var i = 0; i != columns; i++) {
//            sizes.push(newWidth + 'px');
//        }
//    } else { // path 2: explicit column size set
//        // column size values are a bit tricky
//        var pattern = new RegExp(/^-?([0-9\.]+)\s*(%|px|\*)$/);
//
//        // recalculate every column
//        var remainingSpace = lineWidth;
//        var fillSpaceColumn = -1;
//        for (var i = 0; i != columns; i++) {
//            var fillSpaceMode = (this._columnSizes[i] === '*');
//            var matches = fillSpaceMode ? null : pattern.exec(this._columnSizes[i]);
//            var mode = null, number = null, size = 0;
//
//            if (matches) {
//                number = matches[1];
//                mode = matches[2];
//            } else if (fillSpaceMode) {
//                number = 0;
//                mode = '*';
//            }
//
//            switch(mode) {
//                case '%':
//                    size = (number / 100) * lineWidth;
//                    break;
//
//                case 'px':
//                    size = number;
//                    break;
//
//                case '*':
//                    size = 0;
//
//                    if (fillSpaceColumn !== -1) {
//                        throw 'multiple fill spaces';
//                    }
//
//                    fillSpaceColumn = i;
//                    break;
//
//                default:
//                    throw 'unknown spread mode ' + mode;
//            }
//
//            if (size > remainingSpace) {
//                throw 'space overflow';
//            }
//
//            remainingSpace -= size;
//
//            sizes.push(size);
//        }
//
//        if (fillSpaceColumn !== -1) {
//            sizes[fillSpaceColumn] = remainingSpace;
//        }
//    }
//
//    // redraw every cell
//	for (var j in this._cellMatrix) {
//		for (var i in this._cellMatrix[j]) {
//			this._cellMatrix[j][i].cellObj.css('width', (sizes[i] - 10) + 'px');
//		}
//	}
//
//    // redraw header seperately
//	for (var i in this._gridObjects) {
//        this._gridObjects[i].css('width', (sizes[i] - 10) + 'px');
//    }
//
//    // respect _maxVisibleRows
//    if (this._heightMode === 'height') {
//        this._tableBody.css('height', this._height - this._tableHeader.outerHeight() - 2 /* border */ );
//    } else { // maxVisibleRows
//        this._tableBody.css('height', Math.max(5, this._maxVisibleRows) * lineHeight);
//    }
    return this;
};

AdminJUI_DataTable.prototype.getMaxVisibleRows = function () {
    return this._maxVisibleRows;
};

AdminJUI_DataTable.prototype.setMaxVisibleRows = function (numRows) {
    this._maxVisibleRows = numRows;
    this._heightMode     = 'maxVisibleRows';

    this.redraw();

    return this;
};

AdminJUI_DataTable.prototype.getHeight = function () {
    return this._height;
};

AdminJUI_DataTable.prototype.setHeight = function (height) {
    this._height        = height;
    this._heightMode    = 'height';

    this.redraw();

    return this;
};

AdminJUI_DataTable.prototype.addFilter = function (filterOptions) {
//
//    if (!filterOptions instanceof Array) {
//        if (!filterOptions.key) {
//            throw 'key is missing';
//        }
//
//        this._filters[this._filterCounter] = filterOptions;
//        this._refreshFilters();
//
//        return this._filterCounter++;
//    }
//
//    var ids = [];
//
//    for (var i in filterOptions) {
//        var filterOption = filterOptions[i];
//
//        if (!filterOption.key) {
//            throw 'key is missing';
//        }
//
//        this._filters[this._filterCounter] = filterOption;
//
//        ids.push(this._filterCounter++);
//    }
//
//    this._refreshFilters();
//
//
//    return ids;

    return [];
};

AdminJUI_DataTable.prototype.removeFilter = function (filterId) {
    delete this._filters[filterId];
    this._refreshFilters();

    return this;
};

AdminJUI_DataTable.prototype.resetFilters = function () {
    this._filters = {};
    this._refreshFilters();

    return this;
};

AdminJUI_DataTable.prototype._postprocessHtmlNode = function() {
	this._getInputContainer().append(this._inputField);

    this._notAttachedToDomYet = false;

    this.redraw();
};

// expose inner class
AdminJUI_DataTable.TableModel = AdminJUI_DataTable_TableModel;

AdminJUI_Elements.registerElementClass('datatable', AdminJUI_DataTable);
