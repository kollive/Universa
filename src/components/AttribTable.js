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
import { types as attribTabTypes } from "../reducers/attribtablereducer";
import { actions as attribTabActions } from "../reducers/attribtablereducer";
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

const Styles = {
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

const httpTaskCallback = task => {
  console.log(task);
  /*
    request.post(`/api/task/${this.state.id}`)
      .send(task)
      .end((err, res) => {
        if (!err) return this.setState({ ...task })
        // Handle HTTP error
      })
      */
};

//let newAttribVal = "Test";
var typeRoot = null;

class AttribTable extends Component {

  renderData(tableID) {
    if (this.tableID != tableID) {
      this.props.getAttribTable({
        type: attribTabTypes.FETCH_TABLE_REQUEST,
        payload: {
          hv_table_i: this.props.hv_table_i
        }
      });

      this.tableID = tableID; //1;
    }
  }

  componentWillReceiveProps(nextProps) {

   
    //this.setState({pageOfItems: this.props.attribTableState.items});
    //console.log("nextProps ");
    //debugger;
    //console.log(nextProps);
    //this.forceUpdate();
   debugger;
    if (this.props.hv_table_i != nextProps.hv_table_i) {
      this.props.getAttribTable({
        type: attribTabTypes.FETCH_TABLE_REQUEST,
        payload: {
          hv_table_i: nextProps.hv_table_i
        }
      });

      this.tableID =nextProps.hv_table_i; //1;
    }
   
    if( nextProps.attribTableState){
      this.items = nextProps.attribTableState.items;
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
    console.log(this.state.attribTableState);
  }

  componentDidMount() {
    debugger;
    //alert(this.props.location.state.params.hv_table_i)
    //if (this.props) {
    
    //console.log(this.props.location);
    if (this.props.location) {
      this.props.getAttribTable({
        type: attribTabTypes.FETCH_TABLE_REQUEST,
        payload: {
          hv_table_i: this.props.location.state.params.hv_table_i
            ? this.props.location.state.params.hv_table_i
            : 1
        }
      });

      this.tableID = this.props.location.state.params.hv_table_i;
    } else {
      /*
      this.props.getAttribTable({
        type: attribTabTypes.FETCH_TABLE_REQUEST,
        payload: {
          hv_table_i: this.props.hv_table_i
        }
      });

      this.tableID = this.props.hv_table_i; //1;
      */
    }
    //}
  }

  constructor(props) {
    super(props);
    this.tableID = 0;
    this.newUpdateValue = "";
    this.filterValue = "";
    this.items = [];

    this.insertRow = this.insertRow.bind(this);
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
      this.setState({ popoverOpen: true });
    } else {
      this.setState({ popoverOpen: false });
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
    attribTableState: {},
    selectedRowID: -1,
    modal: false,
    attribValue: "",
    pageOfItems: [],
    filterValue: "",
    sortAsc: true,
    searchCol: "hv_universal_name",
    sortedCol: "hv_universal_i",
    pageSize: 10,
    dropdownOpen: false,
    popoverOpen: false
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
    this.props.history.push("/attribtable", { params: row });
  };

  updateRow = row => {
    debugger;
    this.props.updateAttribTable({
      type: attribTabTypes.UPDATE_REQUEST,
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
    this.props.updateAttribTable({
      type: attribTabTypes.UPDATE_REQUEST,
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
    this.props.updateAttribTableStore({
      type: attribTabTypes.UPDATE_REQUEST,
      payload: {
        rowID: row.hv_universal_i,
        tableID : row.hv_table_i
      }
    });
    */
  };

  deleteRow = row => {
    this.props.deleteAttribTable({
      type: attribTabTypes.DELETE_REQUEST,
      payload: {
        rowID: row.hv_universal_i,
        tableID: row.hv_table_i
      }
    });
  };

  cancelRow = row => {
    this.props.cancelAttribTable({
      type: attribTabTypes.CANCEL_REQUEST,
      payload: {
        rowID: row.hv_universal_i,
        value: row.hv_universal_name
      }
    });
  };

  editRow = row => {
    debugger;

    if (this.props.attribTableState.rowID != -1) {
      alert("Please Save the current row");
      return false;
    }

    this.newUpdateValue = row.hv_universal_name;

    this.props.makeRowEditable({
      type: attribTabTypes.MAKE_ROW_EDITABLE,
      payload: {
        rowID: row.hv_universal_i
      }
    });
  };

  insertRow = () => {
    debugger;

    this.setState({
      modal: !this.state.modal
    });

    //alert(this.refs["txtValue"].getValue());
    this.props.insertAttribTable({
      type: attribTabTypes.INSERT_REQUEST,
      payload: {
        tableID: this.tableID,
        value: this.state.attribValue
      }
    });
  };

  clickedItem(item, e) {
    debugger;
    this.filterValue = item.hv_universal_name.toLowerCase();
    this.setState({
      popoverOpen: false
    });
    this._onFilterChange();
    this.inputSearch.value = "";
    //console.log(item.hv_universal_name)
    //alert(item.hv_universal_name)
  }

  _onFilterChange() {
    debugger;

    if (!this.filterValue) {
      this.setState((prevState, props) => {
        return { pageOfItems: prevState.pageOfItems };
      });
    }

    const filterBy = _.trim(this.filterValue.toLowerCase());
    const size = this.props.attribTableState.items.length;

    let filteredItems = [];

    for (var index = 0; index < size; index++) {
      const { hv_universal_name } = this.props.attribTableState.items[index];

      if (hv_universal_name.toLowerCase().indexOf(filterBy) !== -1) {
        filteredItems.push(this.props.attribTableState.items[index]);
      }

      if (filteredItems.length > 9) {
        break;
      }
    }

    this.props.makeRowEditable({
      type: attribTabTypes.MAKE_ROW_EDITABLE,
      payload: {
        rowID: -1
      }
    });

    this.setState({
      pageOfItems: filteredItems,
      filterValue: this.filterValue.toLowerCase(),
      selectedRowID: -1,
      popoverOpen: false,
      dropdownOpen: false
    });
  }

  sortTable = (columnName, type = "S") => {
    debugger;
    let rows;

    if (type == "D") {
      rows = _.sortBy(this.items, item => new Date(item[columnName]));
    } else if (type == "N") {
      rows = _.sortBy(this.items, item => {        
        return  parseFloat(item[columnName].replace(/[^0-9\.-]/g,""));
      });
    } else {
      rows = _.sortBy(this.items, [columnName]);
    }
    console.log("***********")
    console.log(rows)

    if (this.state.sortAsc) {
      rows = rows.reverse();
    }

    this.items = rows;

    this.setState({
      sortedCol: columnName,
      sortAsc: !this.state.sortAsc
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
          <Col>
            <i onClick={this.toggle} size="sm" className="fa fa-plus-circle" />
          </Col>
          <Col>
            {/*
            <Input placeholder="Enter Search..." id="Popover1" onChange={this.setFilterValue} />
            <div id="typeAheadDiv">
              <Popover
                placement="bottom"
                isOpen={this.state.popoverOpen}
                target="Popover1"
                toggle={this.popToggle}
              >
              <PopoverHeader>Results</PopoverHeader>
                <PopoverBody>
                  <ListGroup>
                    {this.state.pageOfItems.map((row, index) => (
                      <ListGroupItem key={index}> {row.hv_universal_name}</ListGroupItem>
                    ))}
                  </ListGroup>
                </PopoverBody>
              </Popover>
            </div>
            */}
            <Input
              placeholder="Enter Search..."
              id="Popover1"
              onChange={this.setFilterValue}
              innerRef={obj => {
                //debugger;
                //console.log(obj);
                this.inputSearch = obj;
              }}
            />
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
                  width: "91%",
                  maxHeight: "200px",
                  height: "auto",
                  overflowX: "hidden",
                  overflowY: "scroll",
                  border: "1px solid grey"
                }}
              >
                <TypeAhead container={"typeAheadDiv1"}>
                  <ListGroup size="sm">
                    {this.state.pageOfItems.map((row, index) => (
                      <ListGroupItem
                        tag="a"
                        action
                        key={index}
                        className="m-1 p-1 border-0"
                        onClick={e => {
                          this.clickedItem(row, e);
                        }}
                      >
                        <div className="d-flex justify-content-end">
                          <div className="mr-auto">{row.hv_universal_name}</div>
                          <div>
                            <i className="fa fa-check" />
                          </div>
                        </div>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </TypeAhead>
              </div>
            )}
            {/*
            <InputGroup size="sm">
              <InputGroupAddon />
              <Input
                placeholder="Enter Search"
                onChange={this.setFilterValue}
              />
              <InputGroupAddon>
                {" "}
                <i className="fa fa-search" onClick={this._onFilterChange} />
              </InputGroupAddon>
            </InputGroup>
             */}
          </Col>
        </Row>
        <Row>
          <Col>
            <Table bordered striped hover size="sm" className="border-bottom-0">
              <thead>
                <tr style={{ backgroundColor: "grey", color: "white" }}>
                  <th>#</th>
                  <th onClick={() => this.sortTable("hv_universal_i")}>
                    Universal ID {" "}
                    <i className={this.RenderHeaderColumn("hv_universal_i")} />
                  </th>
                  <th onClick={() => this.sortTable("hv_universal_name")}>
                    Universal Name {" "}
                    <i
                      className={this.RenderHeaderColumn("hv_universal_name")}
                    />
                  </th>
                  <th>Universal Desc</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.state.pageOfItems.map((row, index) => (
                  <tr key={index}>
                    <th scope="row">{index}</th>
                    <td>{row.hv_universal_i}</td>
                    <td>
                      <HVSTextControl
                        key={index}
                        selectedRowID={this.props.attribTableState.rowID}
                        value={row.hv_universal_name}
                        placeHolder={""}
                        clientWidth={"200px"}
                        rowID={row.hv_universal_i}
                        tableID={row.hv_table_i}
                        updateRowVal={this.updateRowVal}
                      />
                    </td>
                    <td>
                      {this.props.attribTableState.rowID !=
                        row.hv_universal_i || 1 === 1 ? (
                        row.hv_universal_name
                      ) : (
                        <div
                          id={`${"typeAheadDiv" + row.hv_universal_i}`}
                          className="rounded"
                          style={{
                            position: "absolute",
                            backgroundColor: "white",
                            display: "inline-block",
                            zIndex: "100",
                            lineHeight: "0.85",
                            width: "auto",
                            maxWidth: "300px",
                            maxHeight: "200px",
                            height: "auto",
                            overflowX: "hidden",
                            overflowY: "scroll",
                            border: "1px solid grey"
                          }}
                        >
                          <TypeAhead
                            container={`${"typeAheadDiv" + row.hv_universal_i}`}
                          >
                            <ListGroup size="sm">
                              {this.state.pageOfItems.map((row, index) => (
                                <ListGroupItem
                                  tag="a"
                                  action
                                  key={index}
                                  className="m-1 p-1 border-0"
                                  onClick={e => {
                                    this.clickedItem(row, e);
                                  }}
                                >
                                  <div className="d-flex justify-content-end">
                                    <div className="mr-auto">
                                      {row.hv_universal_name}
                                    </div>
                                  </div>
                                </ListGroupItem>
                              ))}
                            </ListGroup>
                          </TypeAhead>
                        </div>
                      )}
                    </td>
                    <td>
                      {this.props.attribTableState.rowID !=
                      row.hv_universal_i ? (
                        <div>
                          <i
                            className="fa fa-pencil fa-fw"
                            onClick={() => this.editRow(row)}
                          />{" "}
                          <i
                            className="fa fa-trash-o fa-fw"
                            onClick={() => this.deleteRow(row)}
                          />
                        </div>
                      ) : (
                        <div>
                          <i
                            className="fa fa-floppy-o fa-fw"
                            onClick={() => this.updateRow(row)}
                          />{" "}
                          <i
                            className="fa fa-ban fa-fw"
                            onClick={() => this.cancelRow(row)}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: "white" }} className="p-0 m-0">
                  <td className="p-0 m-0 border-0">Page Size:</td>
                  <td className="p-0 m-0 border-0">
                    <Dropdown
                      size="sm"
                      dropup
                      className="p-0 m-0 border-0"
                      isOpen={this.state.dropdownOpen}
                      toggle={this.dropToggle}
                    >
                      <DropdownToggle caret>
                        {this.state.pageSize}
                      </DropdownToggle>
                      <DropdownMenu
                        style={{ minWidth: "20px" }}
                        className="p-0 m-0"
                      >
                        <DropdownItem
                          onClick={() => {
                            this.onDropDownItemClick(5);
                          }}
                        >
                          5
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => {
                            this.onDropDownItemClick(10);
                          }}
                        >
                          10
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => {
                            this.onDropDownItemClick(15);
                          }}
                        >
                          15
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => {
                            this.onDropDownItemClick(20);
                          }}
                        >
                          20
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                  <td colSpan={1} className="p-0 m-0 border-0" />
                  <td className="d-flex flex-row-reverse p-0 m-0 border-0">
                    <HVSPagination
                      items={this.items}
                      filterValue={this.state.filterValue}
                      onChangePage={this.onChangePage}
                      pageSize={this.state.pageSize}
                      searchCol={this.state.searchCol}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        {/*
        <Row size="sm">
          <Col />
          <Col className="d-flex justify-content-end">
            <HVSPagination
              items={this.items}
              filterValue={this.state.filterValue}
              onChangePage={this.onChangePage}
            />
          </Col>
        </Row>
        */}
        <Modal isOpen={this.state.modal} toggle={this.toggle} autoFocus={false}>
          <ModalHeader toggle={this.toggle}>Add Attribue</ModalHeader>
          <ModalBody>
            <Container fluid>
              <Row>
                <Col>Attribute Name:</Col>
                <Col>
                  <Input
                    type="text"
                    style={{ width: "250px", lineHeight: "0", padding: "0px" }}
                    placeholder={"Please enter value"}
                    onChange={this.saveAttribVal}
                    value={this.state.attribValue}
                    ref="txtValue"
                  />
                </Col>
              </Row>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.insertRow}>
              Save
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

//AttribTable.defaultProps = {};

/*
AttribTable.propTypes = {
    fetchData: PropTypes.func.isRequired,
    updateData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    hasErrored: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
};
*/

const mapStateToProps = state => {
 // debugger;
  return {
    attribTableState: state.attribTableState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      ...attribTabActions
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
export default connect(mapStateToProps, mapDispatchToProps)(AttribTable);
