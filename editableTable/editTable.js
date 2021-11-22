/** 
 * JS实现可编辑的表格
 **/
(function(){
    if (typeof Object.prototype.attr != 'function') {
        Object.defineProperty(Object.prototype, 'attr', {
            value: function attr(obj) {
                var args = arguments,
                    len = args.length,
                    type = Object.prototype.toString.call(obj);
                if (!(this instanceof HTMLElement)) {
                    throw new TypeError('the context which call attr must be a HTMLElement');
                }
                if (len === 1) {
                    if (type === '[object String]') {
                        return this.getAttribute(obj);
                    } else if (type === '[object Object]') {
                        for (var key in obj)
                            this.setAttribute(key, obj[key]);
                    }
                } else if (len === 2 && Object.prototype.toString.call(args[0]) === '[object String]') {
                    this.setAttribute(arguments[0], arguments[1]);
                } else {
                    throw new TypeError('arguments\' length or type is error!');
                }
    
                return this;
            },
            writable: false,
            configurable: false
        });
    }
    if (typeof Object.prototype.css != 'function') {
        Object.defineProperty(Object.prototype, 'css', {
            value: function attr(obj) {
                if (!(this instanceof HTMLElement)) {
                    throw new TypeError('the context which call attr must be a HTMLElement');
                }
                if (Object.prototype.toString.call(obj) !== '[object Object]') {
                    throw new TypeError('the argument must be a plain javascript object');
                }
                for (var key in obj) {
                    //驼峰式命名
                    var formatKey = key.replace(/[A-Z]/g, function ($1) {
                        return '-' + $1.toLowerCase();
                    });
    
                    this.style[formatKey] = obj[key];
                }
                return this;
            },
            writable: false,
            configurable: false
        });
    }
    
    if (typeof Object.assign != 'function') {
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) {
                'use strict';
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }
                var to = Object(target);
    
                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];
    
                    if (nextSource != null) { // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        });
    }

    if (typeof Object.prototype.attr != 'function') {
        Object.defineProperty(Object.prototype, 'attr', {
            value: function attr(obj) {
                var args = arguments,
                    len = args.length,
                    type = Object.prototype.toString.call(obj);
                if (!(this instanceof HTMLElement)) {
                    throw new TypeError('the context which call attr must be a HTMLElement');
                }
                if (len === 1) {
                    if (type === '[object String]') {
                        return this.getAttribute(obj);
                    } else if (type === '[object Object]') {
                        for (var key in obj)
                            this.setAttribute(key, obj[key]);
                    }
                } else if (len === 2 && Object.prototype.toString.call(args[0]) === '[object String]') {
                    this.setAttribute(arguments[0], arguments[1]);
                } else {
                    throw new TypeError('arguments\' length or type is error!');
                }
    
                return this;
            },
            writable: false,
            configurable: false
        });
    }
    
    if (typeof Object.prototype.css != 'function') {
        Object.defineProperty(Object.prototype, 'css', {
            value: function attr(obj) {
                if (!(this instanceof HTMLElement)) {
                    throw new TypeError('the context which call attr must be a HTMLElement');
                }
                if (Object.prototype.toString.call(obj) !== '[object Object]') {
                    throw new TypeError('the argument must be a plain javascript object');
                }
                for (var key in obj) {
                    //驼峰式命名
                    var formatKey = key.replace(/[A-Z]/g, function ($1) {
                        return '-' + $1.toLowerCase();
                    });
    
                    this.style[formatKey] = obj[key];
                }
                return this;
            },
            writable: false,
            configurable: false
        });
    }
    
    if (typeof Object.assign != 'function') {
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) {
                'use strict';
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }
                var to = Object(target);
    
                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];
    
                    if (nextSource != null) { // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        });
    }
    
    function TableEditable(opts) {
        this.opts = Object.assign({}, this.defaults, opts);
        this.instance = this.createInstance();
    }
    
    function create(ele) {
        return document.createElement(ele.toUpperCase());
    }
    
    function createTable() {
        return create("table");
    }
    
    function createInput() {
        return create("input");
    }
    
    
    TableEditable.prototype = {
        defaults: {
            width: 500,
            border: 0,
            cellpadding: 0,
            cellspacing: 0,
            columns: [],
            selectable: true
        },
        createInstance: function () {
            var instance = this.createContainer(),
                handler = this.createHandleBtn(),
                tab = this.crateBaseTable();
            tab.appendChild(this.createHead());
            var tbody = this.createBody();
            var row = this.createRow();
            this.setRowEditable(row);
            tbody.appendChild(row);
            tab.appendChild(tbody);
            instance.appendChild(handler);
            instance.appendChild(tab);
            this.table = tab;
            return instance;
        },
    
        createContainer: function () {
            var container = create("div").css({
                width: this.opts.width
            });
            container.className = 'root_edit';
            return container;
        },
        createHandleBtn: function () {
            var parent = create("div"),
                addBtn = create("div").css({
                    marginRight: 5
                }),
                removeBtn = create("div");
            parent.className = 'handler_edit';
            addBtn.className = 'circle';
            removeBtn.className = 'circle';
            addBtn.textContent = "+";
            removeBtn.textContent = "-";
            addBtn.onclick = this.addRow.bind(this);
            removeBtn.onclick = this.deleteRow.bind(this);
            parent.appendChild(addBtn);
            parent.appendChild(removeBtn);
            return parent;
        },
        crateBaseTable: function () {
            var opts = this.opts,
                width = opts.width,
                border = opts.border,
                cellpadding = opts.cellpadding,
                cellspacing = opts.cellspacing;
            return createTable().attr({
                width: width,
                border: border,
                cellpadding: cellpadding,
                cellspacing: cellspacing
            });
        },
        createHead: function () {
            var columns = this.opts.columns,
                thead = create("thead"),
                tr = create("tr");
            thead.appendChild(tr);
            if (this.opts.selectable) {
                var thChecked = create("th").css({
                        width: 32
                    }),
                    input = create("input").attr({
                        type: 'checkbox',
                        name: 'checkbox'
                    });
                thChecked.appendChild(input);
                tr.appendChild(thChecked);
            }
            for (var i = 0; i < columns.length; i++) {
                var col = columns[i],
                    th = create("th").attr({
                        width: col.width || 'auto',
                    });
                th.textContent = col.name;
                tr.appendChild(th);
            }
            return thead;
        },
        createBody: function () {
            return create('tbody');
        },
        createRow: function () {
            var tr = create("tr");
            if (this.opts.selectable) {
                var td = create("td"),
                    input = createInput().attr({
                        type: 'checkbox'
                    });
                td.appendChild(input);
                tr.appendChild(td);
            }
            for (var i = 0, columns = this.opts.columns; i < columns.length; i++) {
                var col = columns[i],
                    td2 = create("td");
                td2.textContent = col.value || "";
                td2.value = col.value || "";
                tr.appendChild(td2);
            }
            return tr;
        },
        setRowEditable: function (row) {
            var opts = this.opts,
                selectable = opts.selectable,
                columns = opts.columns,
                ctx = this;
            row.onclick = function (e) {
                if (e.target.nodeName.toLowerCase() == 'td') {
                    var index = e.target.cellIndex;
                    if (selectable && index === 0) { //过滤掉是单选框的column
                        return;
                    }
                    var col = selectable ? columns[index - 1] : columns[index],
                        type = col.type || 'textbox',
                        disabled = col.disabled;
                    if (!disabled) {
                        ctx.editCell(e.target, type, col);
                    }
                }
            };
        },
        editCell: function (cell, type, col) {
            switch (type) {
                case "textbox":
                    this.createTextBox(cell);
                    break;
                case "dropdown":
                    this.createDropdown(cell, col);
                    break;
                default:
                    break;
            }
        },
        createTextBox: function (ele) {
            var editStatus = ele.editStatus,
                ctx = this;
            if (!editStatus) {
                var textbox = createInput();
                textbox.type = "text";
                textbox.className = "editCell_textbox";
                textbox.value = ele.textContent;
                //设置文本框的失去焦点事件  
                textbox.onblur = function () {
                    ctx.editOk(this.parentNode, this.value);
                };
                //向当前单元格添加文本框  
                this.clearChild(ele);
                ele.appendChild(textbox);
                textbox.focus();
                textbox.select();
                //改变状态变量  
                ele.editStatus = true;
            }
        },
        createDropdown: function (ele, col) {
            //检查编辑状态，如果已经是编辑状态，跳过  
            var editState = ele.editStatus,
                ctx = this;
            if (!editState) {
                //创建下接框  
                var select = create('select');
                select.className = "editCell_dropDown";
                //添加列表项  
                var items = col.options;
                if (items) {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var option = create('option');
                        option.text = item.text;
                        option.value = item.value;
                        select.options.add(option);
                    }
                }
                //设置列表当前值  
                select.value = ele.value;
                //设置创建下接框的失去焦点事件  
                select.onblur = function () {
                    ctx.editOk(this.parentNode, this.value, this.options[this.selectedIndex].text);
                };
                //向当前单元格添加创建下拉框  
                ctx.clearChild(ele);
                ele.appendChild(select);
                select.focus();
                //记录状态的改变  
                ele.editStatus = true;
            }
        },
        editOk: function (ele, value, text) {
            ele.value = value;
            if (text) {
                ele.innerHTML = text;
            } else {
                ele.innerHTML = value;
            }
            ele.editStatus = false;
        },
        clearChild: function (ele) {
            ele.innerHTML = "";
        },
        addRow: function () {
            // var lastRow = this.table.rows[this.table.rows.length - 1];
            // var newRow = lastRow.cloneNode(true);
            var newRow = this.createRow();
            this.table.tBodies[0].appendChild(newRow);
            this.setRowEditable(newRow);
            return newRow;
        },
        deleteRow: function () {
            var tab = this.table;
            for (var i = tab.rows.length - 1; i > 0; i--) {
                var chkOrder = tab.rows[i].cells[0].firstChild;
                if (chkOrder) {
                    if (chkOrder.type === "checkbox") {
                        if (chkOrder.checked) {
                            //执行删除  
                            tab.deleteRow(i);
                        }
                    }
                }
            }
        },
        getTableData: function () {
            var data = [],
                tab = this.table;
            for (var i = 1; i < tab.rows.length; i++) {
                data.push(this.getRowData(tab.rows[i]));
            }
            this.data =data;
            return data;
        },
        getRowData: function (row) {
            var rowData = {},columns =this.opts.columns,selectable=this.opts.selectable;
            for (var j = selectable?1:0; j < row.cells.length; j++) {
                var cell =row.cells[j],col =columns[selectable?j-1:j];
                rowData[col.code] =cell.value;
            }
            return rowData;
        }
    
    };
    

})();
