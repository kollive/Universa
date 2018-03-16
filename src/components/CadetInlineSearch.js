import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
//import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Table } from "reactstrap";
import {
  ListGroup,
  ListGroupItem,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import TextField from "material-ui/TextField";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";

import CircularProgress from "material-ui/CircularProgress";
import * as _ from "lodash";
import { bindActionCreators } from "redux";
import { types as CadetInlineTypes } from "../reducers/cadetinlinesearchreducer";
import { actions as CadetInlineActions } from "../reducers/cadetinlinesearchreducer";
import HVSPagination from "../customComponents/pagination";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  Popover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";
//import {Typeahead} from 'react-bootstrap-typeahead';
import TypeAhead from "../customComponents/typeAhead";

import {
  Input,
  ButtCollapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
  Jumbotron,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

import HVSTextControl from "../customComponents/tdInputText";

const styles = {
  link: {
    cursor: "pointer"
  },
  propContainer: {
    width: 800,
    overflow: "hidden",
    margin: "20px"
  },
  propToggleHeader: {
    margin: "20px auto 10px"
  },
  radioButton: {
    marginTop: 16
  }
};

class CadetInlineSearch extends Component {
  renderData(tableID) {
    if (this.tableID != tableID) {
      this.props.getCadetInlineSearch({
        type: CadetInlineTypes.FETCH_TABLE_REQUEST,
        payload: {
          hv_table_i: this.props.hv_table_i
        }
      });

      this.tableID = tableID; //1;
    }
  }

  componentWillReceiveProps(nextProps) {
    //this.setState({pageOfItems: this.props.CadetInlineSearchState.items});
    //console.log("nextProps ");
    //debugger;
    //console.log(nextProps);
    //this.forceUpdate();
    debugger;
    /*
    if (this.props.hv_table_i != nextProps.hv_table_i) {
      this.props.getCadetInlineSearch({
        type: CadetInlineTypes.FETCH_TABLE_REQUEST,
        payload: {
          hv_table_i: nextProps.hv_table_i
        }
      });

      this.tableID = nextProps.hv_table_i; //1;
    }
    */

    if (nextProps.CadetInlineSearchState) {
      this.items = nextProps.CadetInlineSearchState.items;
    }
  }

  //shouldComponentUpdate(nextProps, nextState) {
  //debugger;
  //return true;
  /*
        if (this.props.isLoading !== nextProps.isLoading) {
            return true;
        }
        if (this.state.items !== nextState.items) {
            return true;
        }
        return true;
        */
  //}

  componentWillMount = () => {
    // debugger;
  };

  componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate");
    console.log(this.state.CadetInlineSearchState);
  }

  componentDidMount() {
    debugger;
    //alert(this.props.location.state.params.hv_table_i)
    //if (this.props) {

    //console.log(this.props.location);
    //if (this.props.location) {
      this.props.getCadetsInline({
        type: CadetInlineTypes.FETCH_TABLES_REQUEST,
        name: "%"
      });
   // } else {
      /*
      this.props.getCadetInlineSearch({
        type: CadetInlineTypes.FETCH_TABLE_REQUEST,
        payload: {
          hv_table_i: this.props.hv_table_i
        }
      });

      this.tableID = this.props.hv_table_i; //1;
      */
    //}
    //}
  }

  constructor(props) {
    super(props);
    this.tableID = 0;
    this.newUpdateValue = "";
    this.filterValue = "";
    this.items = [];

    this.onChangePage = this.onChangePage.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.setFilterValue = this.setFilterValue.bind(this);
    this.dropToggle = this.dropToggle.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onDropDownItemClick = this.onDropDownItemClick.bind(this);
    this.clickedItem = this.clickedItem.bind(this);

    //this.newAttribVal = "";
  }

  debouncedSearch = _.debounce(this._onFilterChange, 500);

  setFilterValue = e => {
    debugger;
    this.inputSearch = e.target;
    if (_.trim(e.target.value) != "") {
      this.setState({ popoverOpen: true , inputSearch : e.target.value});
    } else {
      this.setState({ popoverOpen: false, inputSearch : "" });
    }
    //this.setState({ popoverOpen: !this.state.popoverOpen });
    this.filterValue = e.target.value;
    this.debouncedSearch();
  };

  saveAttribVal = event => {
    debugger;
    this.setState({
      attribValue: event.target.value
    });
    //newAttribVal = event.target.value;
  };

  state = {
    height: "300px",
    items: [],
    mode: undefined,
    itemsHasErrored: false,
    itemsIsLoading: false,
    CadetInlineSearchState: {},
    selectedRowID: -1,
    modal: false,
    attribValue: "",
    pageOfItems: [],
    filterValue: "",
    sortAsc: true,
    searchCol: "hv_cadet_name",
    sortedCol: "hv_universal_i",
    pageSize: 10,
    dropdownOpen: false,
    popoverOpen: false,
    inputSearch : ""
  };

  onChangePage = pageOfItems => {
    debugger;
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  };

  popToggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      attribValue: ""
    });
  };

  dropToggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
    //debugger;
    //console.log(this.state.dropdownOpen);
    //this.setState((prevState, props) => {
    //  return { dropdownOpen: !prevState.dropdownOpen };
    //});
    //console.log(this.state.dropdownOpen);
  };

  itemClick = row => {
    debugger;
    console.log(row);
    this.props.history.push("/CadetInlineSearch", { params: row });
  };

  updateRow = row => {
    debugger;
    this.props.updateCadetInlineSearch({
      type: CadetInlineTypes.UPDATE_REQUEST,
      payload: {
        rowID: row.hv_universal_i,
        tableID: row.hv_table_i,
        value: this.newUpdateValue
      }
    });
  };

  updateRowVal = rowObj => {
    debugger;
    this.newUpdateValue = rowObj.value;
    /*
    this.props.updateCadetInlineSearch({
      type: CadetInlineTypes.UPDATE_REQUEST,
      payload: {
        rowID: rowObj.rowID,
        tableID : rowObj.tableID,
        value: rowObj.value
      }
    });
    
    //this.setState({
    //  newUpdateValue: rowObj.value
    //})
    */
    /*
    this.props.updateCadetInlineSearchStore({
      type: CadetInlineTypes.UPDATE_REQUEST,
      payload: {
        rowID: row.hv_universal_i,
        tableID : row.hv_table_i
      }
    });
    */
  };

  clickedItem(item, e) {
    debugger;
    //this.filterValue = item.hv_cadet_name.toLowerCase();
    this.setState({
      popoverOpen: false,
      inputSearch: ""
    });
    //this._onFilterChange();
    //this.inputSearch.value = "";
    //console.log(item.hv_universal_name)
    //alert(item.hv_cadet_name);
    this.props.callParentSearch(item);
  }

  _onFilterChange() {
    debugger;

    if (!this.filterValue) {
      this.setState((prevState, props) => {
        return { pageOfItems: prevState.pageOfItems };
      });
    }

    //alert( this.props.CadetInlineSearchState.items.length)

    const filterBy = _.trim(this.filterValue.toLowerCase());
    const size = this.props.CadetInlineSearchState.items.length;

    let filteredItems = [];

    for (var index = 0; index < size; index++) {
      const { hv_cadet_name } = this.props.CadetInlineSearchState.items[index];

      if (hv_cadet_name.toLowerCase().indexOf(filterBy) !== -1) {
        filteredItems.push(this.props.CadetInlineSearchState.items[index]);
      }

      if (filteredItems.length > (this.state.pageSize || 10) - 1) {
        break;
      }
    }

    this.setState({
      pageOfItems: filteredItems,
      filterValue: this.filterValue.toLowerCase(),
      selectedRowID: -1
    });
  }

  sortTable = columnName => {
    debugger;
    /*
    const rows = this.state.pageOfItems.slice();
    rows.sort((a, b) => {
      let sortVal = 0;


      if (a[columnName] > b[columnName]) {
        sortVal = 1;
      }
      if (a[columnName] < b[columnName]) {
        sortVal = -1;
      }

      //do the reverse
      if (this.state.sortAsc) {
        sortVal = sortVal * -1;
      }
      return sortVal;
    });
    */
    let rows;
    rows = _.sortBy(this.items, item => {
      debugger;
      if (_.isNumber(item[columnName])) {
        return _.toNumber(item[columnName]);
      } else {
        return _.toString(item[columnName].toLowerCase());
      }
    });

    if (this.state.sortAsc) {
      rows = rows.reverse();
    }

    this.items = rows;

    this.setState({
      sortedCol: columnName,
      sortAsc: !this.state.sortAsc
      //pageOfItems: rows
    });
  };

  RenderHeaderColumn = columnName => {
   // debugger;

    let className;
    if (this.state.sortedCol == columnName) {
      if (this.state.sortAsc) {
        className = "fa fa-sort-asc fa-fw";
      } else {
        className = "fa fa-sort-desc fa-fw";
      }
    } else {
      className = "";
    }

    return className;
  };

  onDropDownItemClick(val) {
    debugger;
    //alert(val);
    this.setState({
      pageSize: val
    });
  }

  render() {
    return (
      <Container fluid>
        {/*
        <Row>
          <Col><h3>Attribute Table</h3></Col>
          <Col><div className="float-right"> <Button color="secondary" size="sm" onClick={() => this.props.history.push('/tabs', ...this.state)}>Show Tabs</Button></div></Col>
        </Row>
        */}
        <Row>
          <Col sm="4" className="float-left">
            <InputGroup size="sm" style={{ width: "300px" }}>
              <InputGroupAddon>
                <i className="fa fa-search fa-fw" />
              </InputGroupAddon>
              <Input
                style={{ width: "200px" }}
                className="py-2"
                placeholder="Search for a Cadet by Name"
                id="Popover1"
                value={this.state.inputSearch}
                onChange={this.setFilterValue}
                innerRef={obj => {
                  //debugger;
                  //console.log(obj);
                  this.inputSearch = obj;
                }}
              />
              <InputGroupAddon>
                <i
                  style={styles.link}
                  onClick={() => {
                    this.setState({
                      inputSearch: ""
                    });
                    this.filterValue = "";
                    this.debouncedSearch();
                  }}
                  className="fa fa-times fa-fw"
                />
              </InputGroupAddon>
            </InputGroup>
            {this.state.popoverOpen && (
              <div
                id="typeAheadDiv1"
                className="rounded"
                style={{
                  position: "absolute",
                  backgroundColor: "white",
                  display: "inline-block",
                  zIndex: "100",
                  lineHeight: "0.85",
                  width: "70%",
                  maxHeight: "200px",
                  minHeight: "200px",
                  height: "auto",
                  overflowX: "hidden",
                  overflowY: "scroll",
                  border: "1px solid grey",
                  marginTop: "-240px"
                  //marginTop:(this.state.pageOfItems.length == 0 ? "-60px" :
                  //(this.state.pageOfItems.length >= 7)? "-240px" : (-1 * this.state.pageOfItems.length * 40) + "px")
                }}
              >
                <TypeAhead container={"typeAheadDiv1"}>
                  <ListGroup size="sm">
                    {this.state.pageOfItems.length > 0 ? (
                      this.state.pageOfItems.map((row, index) => (
                        <ListGroupItem
                          style={styles.link}
                          key={index}
                          className="m-1 p-1 border-0"                          
                          onClick={e => {
                            this.clickedItem(row, e);
                          }}
                        >
                          <div className="d-flex justify-content-end">
                            <div className="mr-auto">{row.hv_cadet_name}</div>
                          </div>
                        </ListGroupItem>
                      ))
                    ) : (
                      <ListGroupItem
                        style={styles.link}
                        key={-1}                       
                        className="m-1 p-1 border-0"                       
                      >
                        <div className="d-flex justify-content-end">
                          <div className="mr-auto">No Data</div>
                        </div>
                      </ListGroupItem>
                    )}
                  </ListGroup>
                </TypeAhead>
              </div>
            )}
          </Col>
          <Col sm="4" className="float-right">
            <InputGroup size="sm" style={{ width: "300px" }}>
              <InputGroupAddon>
                <i className="fa fa-search fa-fw" />
              </InputGroupAddon>
              <Input
                style={{ width: "200px" }}
                className="py-2"
                placeholder="Search for a Staff member by name"
                id="Popover2"
                value=""
                //onChange={this.setFilterValue}
                innerRef={obj => {
                  //debugger;
                  //console.log(obj);
                  //this.inputSearch = obj;
                }}
              />
              <InputGroupAddon>
                <i style={styles.link} className="fa fa-times fa-fw" />
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  //debugger;
  return {
    CadetInlineSearchState: state.CadetInlineSearchState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      ...CadetInlineActions
    },
    dispatch
  )
});

/*
const mapDispatchToProps = (dispatch) => {
    return {
        fetchSagaData: (data) => dispatch(data)
    };  
};
*/
export default connect(mapStateToProps, mapDispatchToProps)(CadetInlineSearch);
