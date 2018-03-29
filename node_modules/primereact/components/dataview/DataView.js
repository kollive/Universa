'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DataViewLayoutOptions = exports.DataView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Paginator = require('../paginator/Paginator');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ObjectUtils = require('../utils/ObjectUtils');

var _ObjectUtils2 = _interopRequireDefault(_ObjectUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataView = exports.DataView = function (_Component) {
    _inherits(DataView, _Component);

    function DataView(props) {
        _classCallCheck(this, DataView);

        var _this = _possibleConstructorReturn(this, (DataView.__proto__ || Object.getPrototypeOf(DataView)).call(this, props));

        _this.state = {
            first: 0,
            rows: _this.props.rows,
            totalRecords: -1,
            layout: _this.props.layout,
            sortOrder: _this.props.sortOrder,
            sortField: _this.props.sortField
        };
        _this.sortChange = false;
        _this.onPageChange = _this.onPageChange.bind(_this);
        return _this;
    }

    _createClass(DataView, [{
        key: 'getTotalRecords',
        value: function getTotalRecords() {
            return this.props.value ? this.props.lazy ? this.props.totalRecords : this.props.value.length : 0;
        }
    }, {
        key: 'createPaginator',
        value: function createPaginator(position) {
            var className = 'ui-paginator-' + position;

            return _react2.default.createElement(_Paginator.Paginator, { first: this.state.first, rows: this.state.rows, className: className, onPageChange: this.onPageChange,
                totalRecords: this.state.totalRecords === -1 ? this.getTotalRecords() : this.state.totalRecords });
        }
    }, {
        key: 'onPageChange',
        value: function onPageChange(event) {
            this.setState({ first: event.first, rows: event.rows });

            if (this.props.lazy) {
                if (this.props.onLazyLoad) {
                    this.props.onLazyLoad({
                        first: event.first,
                        rows: event.rows
                    });
                }
            }

            if (this.props.onPage) {
                this.props.onPage({
                    first: event.first,
                    rows: event.rows
                });
            }
        }
    }, {
        key: 'changeLayout',
        value: function changeLayout(event, layout) {
            this.setState({ layout: layout });
            event.preventDefault();
        }
    }, {
        key: 'isEmpty',
        value: function isEmpty() {
            var data = this.filteredValue || this.props.value;
            return data === null || data.length === 0;
        }
    }, {
        key: 'sort',
        value: function sort() {
            var _this2 = this;

            if (this.props.value) {
                this.props.value.sort(function (data1, data2) {
                    var value1 = _ObjectUtils2.default.resolveFieldData(data1, _this2.state.sortField);
                    var value2 = _ObjectUtils2.default.resolveFieldData(data2, _this2.state.sortField);
                    var result = null;

                    if (value1 == null && value2 != null) result = -1;else if (value1 != null && value2 == null) result = 1;else if (value1 == null && value2 == null) result = 0;else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
                    return _this2.state.sortOrder * result;
                });
            }
            this.sortChange = true;
            if (this.props.lazy) {
                if (this.props.onLazyLoad) {
                    this.props.onLazyLoad({
                        first: this.state.first,
                        rows: this.state.rows
                    });
                }
            }

            if (this.props.onSort) {
                this.props.onSort({
                    field: this.state.sortField,
                    order: this.state.sortOrder
                });
            }
        }
    }, {
        key: 'filter',
        value: function filter(value) {
            if (this.props.value && this.props.value.length) {
                var searchFields = this.props.filterBy.split(',');
                this.filteredValue = _ObjectUtils2.default.filter(this.props.value, searchFields, value);

                if (this.filteredValue.length === this.props.value.length) {
                    this.filteredValue = null;
                }

                if (this.props.paginator) {
                    this.setState({ totalRecords: this.filteredValue ? this.filteredValue.length : this.props.value ? this.props.value.length : 0 });
                }
            }
        }
    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate(nextProps) {
            if (this.state.sortField !== nextProps.sortField || this.state.sortOrder !== nextProps.sortOrder) {
                this.setState({ sortField: nextProps.sortField, sortOrder: nextProps.sortOrder });
                this.sortChange = false;
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.state.sortField && !this.sortChange) {
                this.sort();
            }
        }
    }, {
        key: 'renderTopPaginator',
        value: function renderTopPaginator() {
            if (this.props.paginator && (this.props.paginatorPosition !== 'bottom' || this.props.paginatorPosition === 'both')) {
                return this.createPaginator('top');
            } else {
                return null;
            }
        }
    }, {
        key: 'renderBottomPaginator',
        value: function renderBottomPaginator() {
            if (this.props.paginator && (this.props.paginatorPosition !== 'top' || this.props.paginatorPosition === 'both')) {
                return this.createPaginator('bottom');
            } else {
                return null;
            }
        }
    }, {
        key: 'renderEmptyMessage',
        value: function renderEmptyMessage() {
            if (this.isEmpty()) {
                return _react2.default.createElement(
                    'div',
                    { className: 'ui-widget-content ui-g-12' },
                    this.props.emptyMessage
                );
            } else {
                return null;
            }
        }
    }, {
        key: 'renderHeader',
        value: function renderHeader() {
            if (this.props.header) {
                return _react2.default.createElement(
                    'div',
                    { className: 'ui-dataview-header ui-widget-header ui-corner-top' },
                    this.props.header
                );
            } else {
                return null;
            }
        }
    }, {
        key: 'renderFooter',
        value: function renderFooter() {
            if (this.props.footer) {
                return _react2.default.createElement(
                    'div',
                    { className: 'ui-dataview-footer ui-widget-header ui-corner-bottom' },
                    ' ',
                    this.props.footer
                );
            } else {
                return null;
            }
        }
    }, {
        key: 'renderContent',
        value: function renderContent() {
            var _this3 = this;

            var value = this.props.paginator ? (this.filteredValue || this.props.value).slice(this.props.lazy ? 0 : this.state.first, (this.props.lazy ? 0 : this.state.first) + this.state.rows) : this.filteredValue || this.props.value;

            var itemClassName = (0, _classnames2.default)('ui-g-12', this.state.layout === 'list' ? '' : ' ui-md-3');

            var emptyMessage = this.renderEmptyMessage();

            return _react2.default.createElement(
                'div',
                { className: 'ui-dataview-content ui-widget-content' },
                _react2.default.createElement(
                    'div',
                    { className: 'ui-g' },
                    value && value.map(function (val, i) {
                        return _this3.props.itemTemplate ? _react2.default.cloneElement(_this3.props.itemTemplate(val, _this3.state.layout), { key: i + '_dataviewitem' }) : _react2.default.createElement(
                            'div',
                            { className: itemClassName, key: i + '_dataviewitem' },
                            val
                        );
                    }),
                    emptyMessage
                )
            );
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
            if (this.props.lazy && nextProps.value === this.props.value) return false;else return true;
        }
    }, {
        key: 'render',
        value: function render() {

            var className = (0, _classnames2.default)('ui-dataview ui-widget', { 'ui-dataview-list': this.state.layout === 'list',
                'ui-dataview-grid': this.state.layout === 'grid' }, this.props.className);

            var topPaginator = this.renderTopPaginator();
            var bottomPaginator = this.renderBottomPaginator();
            var header = this.renderHeader();
            var footer = this.renderFooter();
            var content = this.renderContent();

            return _react2.default.createElement(
                'div',
                { id: this.props.id, style: this.props.style, className: className },
                header,
                topPaginator,
                content,
                bottomPaginator,
                footer
            );
        }
    }]);

    return DataView;
}(_react.Component);

DataView.defaultProps = {
    id: null,
    header: null,
    footer: null,
    value: null,
    layout: 'list',
    paginator: false,
    rows: null,
    totalRecords: null,
    pageLinks: 5,
    rowsPerPageOptions: null,
    paginatorPosition: "bottom",
    lazy: false,
    emptyMessage: 'No records found',
    sortField: null,
    sortOrder: null,
    style: null,
    className: null,
    filterBy: null,
    onLazyLoad: null,
    onPage: null,
    onSort: null,
    itemTemplate: null
};
DataView.propsTypes = {
    id: _propTypes2.default.string,
    header: _propTypes2.default.string,
    footer: _propTypes2.default.string,
    value: _propTypes2.default.array,
    layout: _propTypes2.default.string,
    paginator: _propTypes2.default.bool,
    rows: _propTypes2.default.number,
    totalRecords: _propTypes2.default.number,
    pageLinks: _propTypes2.default.number,
    rowsPerPageOptions: _propTypes2.default.array,
    paginatorPosition: _propTypes2.default.string,
    lazy: _propTypes2.default.bool,
    emptyMessage: _propTypes2.default.string,
    sortField: _propTypes2.default.string,
    sortOrder: _propTypes2.default.number,
    style: _propTypes2.default.object,
    className: _propTypes2.default.string,
    filterBy: _propTypes2.default.string,
    onLazyLoad: _propTypes2.default.func,
    onPage: _propTypes2.default.func,
    onSort: _propTypes2.default.func,
    itemTemplate: _propTypes2.default.func
};

var DataViewLayoutOptions = exports.DataViewLayoutOptions = function (_Component2) {
    _inherits(DataViewLayoutOptions, _Component2);

    function DataViewLayoutOptions(props) {
        _classCallCheck(this, DataViewLayoutOptions);

        var _this4 = _possibleConstructorReturn(this, (DataViewLayoutOptions.__proto__ || Object.getPrototypeOf(DataViewLayoutOptions)).call(this, props));

        _this4.state = { layout: 'list' };
        _this4.changeLayout = _this4.changeLayout.bind(_this4);
        return _this4;
    }

    _createClass(DataViewLayoutOptions, [{
        key: 'changeLayout',
        value: function changeLayout(event, layout) {
            this.setState({ layout: layout });
            if (this.props.onClick) {
                this.props.onClick({
                    originalEvent: event,
                    layout: layout
                });
            }
            event.preventDefault();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var className = (0, _classnames2.default)('ui-dataview-layout-options ui-selectbutton ui-buttonset', this.props.className);
            var buttonListClass = (0, _classnames2.default)("ui-button ui-button-icon-only ui-state-default", { 'ui-state-active': this.state.layout === 'list' });
            var buttonGridClass = (0, _classnames2.default)("ui-button ui-button-icon-only ui-state-default", { 'ui-state-active': this.state.layout === 'grid' });
            return _react2.default.createElement(
                'div',
                { id: this.props.id, style: this.props.style, className: className },
                _react2.default.createElement(
                    'a',
                    { role: "button", className: buttonListClass, onClick: function onClick(e) {
                            return _this5.changeLayout(e, 'list');
                        } },
                    _react2.default.createElement('i', { className: 'fa fa-bars' })
                ),
                _react2.default.createElement(
                    'a',
                    { role: "button", className: buttonGridClass, onClick: function onClick(e) {
                            return _this5.changeLayout(e, 'grid');
                        } },
                    _react2.default.createElement('i', { className: 'fa fa-th-large' })
                )
            );
        }
    }]);

    return DataViewLayoutOptions;
}(_react.Component);

DataViewLayoutOptions.defaultProps = {
    id: null,
    style: null,
    className: null,
    onClick: null
};
DataViewLayoutOptions.propsTypes = {
    id: _propTypes2.default.string,
    style: _propTypes2.default.object,
    className: _propTypes2.default.string,
    onClick: _propTypes2.default.func
};