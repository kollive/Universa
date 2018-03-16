import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";

import {
  Container,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Collapse,
  CardBody,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
  Label,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";

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

import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import * as _ from "lodash";
import { bindActionCreators } from "redux";
import { types as roleTypes } from "../reducers/rolereducer";
import { actions as roleActions } from "../reducers/rolereducer";

import HVSPagination from "../customComponents/pagination";
import AddEditRole from "./AddEditRole";
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  Popover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";

const styles = {
  link: {
    cursor: "pointer"
  }
};

export class Roles extends Component {
  static propTypes = {
    //name: PropTypes.string.isRequired
  };

  componentWillMount = () => {
    // debugger;
  };

  componentWillReceiveProps(nextProps) {
    //alert("componentWillReceiveProps");
    //console.log(nextProps);
    //alert(this.props.cadetName )
    //alert(nextProps.cadetName )


    if (nextProps.roleState.items) {
      this.items = nextProps.roleState.items;
    }
    //this.setState({pageOfItems: this.props.roleState.items});
    //console.log("nextProps ");
    //debugger;
    //console.log(nextProps);
    //this.forceUpdate();
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log("componentDidUpdate");
    //alert(this.props.roleState.message.val)
    if (Number(this.props.roleState.message.val) != 0) { 
      if (Number(this.props.roleState.message.val) == -2) {
        this.props.showTimeOut(this.props.roleState.message.msg);
      } else {
        alert(this.props.roleState.message.msg);
      }
      this.props.resetMessage({
        type: roleTypes.MESSAGE,
        message: { val: 0, msg: "" }
      });

      //this.props.showTimeOut();
      //this.props.history.push("/login");

    }
    //console.log(this.state);
  }

  componentDidMount() {
    debugger;
    //alert(this.props.location.state.params.hv_table_i)
    //if (this.props) {
    //alert("mount")
    //alert(this.props.cadetName)
    //console.log(this.props.location);
    this.props.getRoles({
      type: roleTypes.FETCH_TABLE_REQUEST,
      cname: ""
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      activeTab: "1",
      collapse: false,
      status: "Closed",
      height: "300px",
      items: [],
      mode: undefined,
      itemsHasErrored: false,
      itemsIsLoading: false,
      roleState: {},
      selectedRoleRow: {},
      selectedRowID: -1,
      modal: false,
      attribValue: "",
      pageOfItems: [],
      filterValue: "",
      sortAsc: true,
      sortedCol: "role_name",
      searchCol: "role_name",
      pageSize: 10,
      dropdownOpen: false,
      popoverOpen: false,
      inputSearch: "",
      inDetailsTab: false,
      displayFilter: "none",
      filters: {},
      roleMode: "A"
    };

    this.tableID = 0;
    this.newUpdateValue = "";
    this.filterValue = "";
    this.items = [];
    this.selectedCadetRow = {};

    //this.insertRow = this.insertRow.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    //this._onFilterChange = this._onFilterChange.bind(this);
    this.setFilterValue = this.setFilterValue.bind(this);
    this.dropToggle = this.dropToggle.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onDropDownItemClick = this.onDropDownItemClick.bind(this);
    //this.clickedItem = this.clickedItem.bind(this);
    this.classToggle = this.classToggle.bind(this);
    this.exportToExcel = this.exportToExcel.bind(this);
    this.refreshScreen = this.refreshScreen.bind(this);
    //this.newRoleVal = "";
  }

  exportToExcel = () => {
    debugger;
    this.props.exportToExcel({
      type: roleTypes.EXCEL_REQUEST,
      payload: {
        spName: "select hv_first_name,hv_last_name from tuser",
        cols: [
          {
            caption: "First Name",
            type: "string",
            width: 50
          },
          {
            caption: "Last Name",
            type: "string",
            width: 50
          }
        ]
      }
    });
  };

  debouncedSearch = _.debounce(this._onFilterChange, 100);

  setFilterValue = e => {
    //return;
    debugger;
    /*
    this.inputSearch = e.target;
    if (_.trim(e.target.value) != "") {
      this.setState({ popoverOpen: true });
    } else {
      this.setState({ popoverOpen: false });
    }
    */
    //this.setState({ popoverOpen: !this.state.popoverOpen });
    this.setState({
      inputSearch: e.target.value
    });

    this.filterValue = e.target.value;
    this.debouncedSearch();
  };

  deleteRow = row => {
    debugger;
    if (row.roleHasUser == "Y") {
      if (
        !window.confirm(
          "There are currently users assigned this role in the system. Removing this role from the system will unassign the role from these users. Are you sure you want to permanently delete this role?"
        )
      ) {
        return false;
      }
    }

    this.props.deleteRoleTable({
      type: roleTypes.DELETE_REQUEST,
      roleID: row.role_id
    });
  };

  cancelRow = row => {
    this.props.cancelRoleTable({
      type: roleTypes.CANCEL_REQUEST,
      payload: {
        rowID: row.role_id,
        value: row.hv_universal_name
      }
    });
  };

  addRow = () => {
    const row = {
      role_id: -1
    }

    this.setState({
      modal: !this.state.modal,
      selectedRoleRow: row,
      roleMode: "A"
    });
  }

  editRow = row => {
    debugger;

    this.setState({
      modal: !this.state.modal,
      selectedRoleRow: row,
      roleMode: "U"
    });
    /*
    if (this.props.roleState.rowID != -1) {
      alert("Please Save the current row");
      return false;
    }
    this.newUpdateValue = row.hv_universal_name;
    this.props.makeRowEditable({
      type: roleTypes.MAKE_ROW_EDITABLE,
      payload: {
        rowID: row.role_id
      }
    });
    */
  };

  insertRow = () => {
    debugger;

    this.setState({
      modal: !this.state.modal
    });

    //alert(this.refs["txtValue"].getValue());
    this.props.insertRoleTable({
      type: roleTypes.INSERT_REQUEST,
      payload: {
        tableID: this.tableID,
        value: this.state.attribValue
      }
    });
  };

  /*
  clickedItem(item, e) {
    return;
    debugger;
    this.filterValue = item.role_name.toLowerCase();
    this.setState({
      popoverOpen: false
    });
    this._onFilterChange();
    this.inputSearch.value = "";
    //console.log(item.hv_universal_name)
    //alert(item.hv_universal_name)
  }
*/
  _onFilterChange() {
    debugger;
    /*
    if (!this.filterValue) {
      this.setState((prevState, props) => {
        return { pageOfItems: prevState.pageOfItems };
      });
    }
    const filterBy = _.trim(this.filterValue.toLowerCase());
    */
    const size = this.props.roleState.items.length;

    let filteredItems = [];


    let keys = Object.keys(this.state.filters);
    let filter = Object.values(this.state.filters);

    if (keys.length > 0) {

      filteredItems = this.props.roleState.items.filter(
        function (item) {
          for (var i = 0; i < filter.length; i++) {
            if (item[keys[i]].toLowerCase().indexOf(filter[i].value) == -1) {
              //debugger;
              return false;
            }
          }
          //debugger;
          return true;
        }
      );

      filteredItems = filteredItems.splice(0, (this.state.pageSize || 10));
      /*
      items = this.props.items.map((itm) => {
       return keys.map((key) => {
          console.log("Key:" + key)
          console.log("value:" + this.props.filterValue[key].value)
          console.log("Item value:" + itm[key])
 
          if (this.props.filterValue[key] && _.trim(this.props.filterValue[key].value) != "") {
            if(itm[key].toLowerCase().indexOf(_.trim(this.props.filterValue[key].value)) != -1){
              return itm;
            }
          }
        })         
      })
      */
    } else {
      filteredItems = this.props.roleState.items.slice(0, (this.state.pageSize || 10));
    }

    /*
        //let filteredItems = this.props.roleState.items.slice();
        if (this.state.filters.role_name && _.trim(this.state.filters.role_name) != "") {
          for (var index = 0; index < size; index++) {
            const { role_name } = this.props.roleState.items[index];
            if (
              role_name
                .toLowerCase()
                .indexOf(this.state.filters.role_name.value.toLowerCase()) !== -1
            ) {
              filteredItems.push(this.props.roleState.items[index]);
            }
            if (filteredItems.length > (this.state.pageSize || 10) - 1) {
              break;
            }
          }
          //filteredItems = filteredItems.filter(item => item.role_name.toLowerCase() == this.state.filters.role_name.value.toLowerCase());
        }
        if (this.state.filters.role_desc && _.trim(this.state.filters.role_desc) != "") {
          for (var index = 0; index < size; index++) {
            const { role_desc } = this.props.roleState.items[index];
            if (
              role_desc
                .toLowerCase()
                .indexOf(this.state.filters.role_desc.value.toLowerCase()) !== -1
            ) {
              filteredItems.push(this.props.roleState.items[index]);
            }
            if (filteredItems.length > (this.state.pageSize || 10) - 1) {
              break;
            }
          }
        }
        debugger;
        if(Object.keys(this.state.filters).length == 0) {
          filteredItems = this.props.roleState.items.slice(0,(this.state.pageSize || 10) - 1);
        }
        */
    /*
    for (var index = 0; index < size; index++) {
      const { role_name } = this.props.roleState.items[index];
      if (role_name.toLowerCase().indexOf(filterBy) !== -1) {
        filteredItems.push(this.props.roleState.items[index]);
      }
      if (filteredItems.length > (this.state.pageSize || 10) - 1) {
        break;
      }
    }
    */

    this.setState({
      pageOfItems: filteredItems,
      filterValue: this.filterValue.toLowerCase(),
      selectedRowID: -1,
      popoverOpen: false,
      dropdownOpen: false
    });
  }

  showDetails = row => {
    return;
    debugger;
    //alert(row.role_desc);
    this.selectedCadetRow = row;
    this.setState({
      activeTab: "3",
      inDetailsTab: true
    });
    //this.props.history.push("/cadetdetails",{ params: row});
  };

  sortTable = (columnName, type = "S") => {
    debugger;
    let rows;

    if (type == "D") {
      rows = _.sortBy(this.items, item => new Date(item[columnName]));
    } else if (type == "N") {
      rows = _.sortBy(this.items, item => new Number(item[columnName]));
    } else {
      rows = _.sortBy(this.items, [columnName]);
    }

    if (this.state.sortAsc) {
      rows = rows.reverse();
    }

    this.items = rows;

    this.setState({
      sortedCol: columnName,
      sortAsc: !this.state.sortAsc
    });
  };

  saveRoleVal = event => {
    debugger;
    this.setState({
      attribValue: event.target.value
    });
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

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  classToggle = () => { };

  dropToggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  itemClick = row => {
    debugger;
    console.log(row);
    this.props.history.push("/cadetsearch", { params: row });
  };

  showMessage(msg) {
    alert(msg);
  }

  onDropDownItemClick(val) {
    debugger;
    //alert(val);
    this.setState({
      pageSize: val
    });
  }

  RenderHeaderColumn = columnName => {
    //debugger;

    let className;
    if (this.state.sortedCol == columnName) {
      if (this.state.sortAsc) {
        className = "fa fa-sort-asc fa-fw";
      } else {
        className = "fa fa-sort-desc fa-fw";
      }
    } else {
      className = "fa fa-sort fa-fw";
    }

    return className;
  };

  onfilterChange = e => {
    debugger;
    let filters = this.state.filters;
    this.filterValue = e.target.value;

    switch (e.target.id) {
      case "role_name":
        filters["role_name"] = { value: e.target.value };
        break;
      case "role_desc":
        filters["role_desc"] = { value: e.target.value };
        break;
    }
    this.setState({ filters: filters });
    this.debouncedSearch();
  };

  onFilter = e => {
    debugger;
    this.setState({ filters: e.filters });
  };

  modalToggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  refreshScreen(refresh) {
    this.setState({ modal: false });
    if (refresh) {
      this.props.getRoles({
        type: roleTypes.FETCH_TABLE_REQUEST,
        cname: ""
      });
    }
  }

  render() {
    this.roleNameFilter = (
      <input
        style={{ display: this.state.displayFilter }}
        type="text"
        id="role_name"
        className=""
        value={
          this.state.filters.role_name ? this.state.filters.role_name.value : ""
        }
        onChange={this.onfilterChange}
      />
    );
    this.descFilter = (
      <input
        style={{ display: this.state.displayFilter }}
        type="text"
        id="role_desc"
        className=""
        value={
          this.state.filters.role_desc ? this.state.filters.role_desc.value : ""
        }
        onChange={this.onfilterChange}
      />
    );

    return (
      <div style={{ height: "100%", width: "100%" }}>
        <Container
          fluid
          style={{
            overflow: "hidden",
            height: "100%"
          }}
        >
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row className="p-0 m-0">
                <Col sm="2">
                  <span className="fa-stack fa-lg" style={styles.link} onClick={() => this.addRow()}>
                    <i className="fa fa-square-o fa-stack-2x" />
                    <i className="fa fa-plus-circle fa-stack-1x" />
                  </span>{" "}
                </Col>
                <Col sm="3">
                  {/* 
                  <span className="fa-stack fa-lg">
                    <i className="fa fa-square-o fa-stack-2x" />
                    <i className="fa fa-list-ul fa-stack-1x" />
                  </span>
                  <span className="fa-stack fa-lg">
                      <i className="fa fa-square-o fa-stack-2x" />
                      <i className="fa fa-filter fa-stack-1x" />
                  </span>
                  <div className="float-left">
                    <InputGroup size="sm" style={{ width: "300px" }}>
                      <InputGroupAddon>
                        <i className="fa fa-search fa-fw" />
                      </InputGroupAddon>
                      <Input
                        style={{ width: "200px" }}
                        className="py-2"
                        placeholder="Enter Search..."
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
                  </div>
                  */}
                </Col>
                <Col sm="4">
                  <div className="mx-center">
                    {this.state.pageOfItems.length} Roles
                  </div>
                </Col>
                <Col sm="3">
                  <div className="float-right">
                    <span className="fa-stack fa-lg" style={styles.link}>
                      <i className="fa fa-square-o fa-stack-2x" />
                      <a
                        onClick={() => {
                          this.exportToExcel();
                        }}
                        download={"test.xlsx"}
                      >
                        <i className="fa f fa-file-excel-o fa-stack-1x" />
                      </a>
                    </span>{" "}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm="12">
                  <Table
                    bordered
                    striped
                    hover
                    size="sm"
                    className="border-bottom-0"
                  >
                    <thead>
                      <tr style={{ backgroundColor: "grey", color: "white" }}>
                        <th style={{ width: "38px" }}>
                          <span>
                            <i
                              className="fa fa-filter"
                              onClick={() => {
                                this.setState({ displayFilter: "inline" });
                              }}
                            />{" "}
                            <i
                              className="fa fa-times"
                              onClick={() => {
                                this.filterValue = "";
                                this.debouncedSearch();
                                this.setState({
                                  displayFilter: "none",
                                  filters: {}
                                });
                              }}
                            />
                          </span>{" "}
                        </th>
                        <th style={styles.link}>
                          Role Name{" "}
                          <i
                            className={this.RenderHeaderColumn("role_name")}
                            onClick={() => this.sortTable("role_name")}
                          />
                          {this.roleNameFilter}
                        </th>
                        <th style={styles.link}>
                          Description{" "}
                          <i
                            className={this.RenderHeaderColumn("role_desc")}
                            onClick={() => this.sortTable("role_desc")}
                          />
                          {this.descFilter}
                        </th>
                        <th style={styles.link}>Permissions </th>
                        <th style={styles.link}>
                          Active{" "}
                          <i
                            className={this.RenderHeaderColumn("role_active")}
                            onClick={() => this.sortTable("role_active")}
                          />
                        </th>
                        <th style={styles.link} onClick={() => this.addRow()}>
                          <span className="fa-stack fa-md">
                            <i className="fa fa-square-o fa-stack-2x" />
                            <i className="fa fa-plus-circle fa-stack-1x" />
                          </span>{" "}
                          Add
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.pageOfItems.map((row, index) => (
                        <tr key={index} onClick={() => this.showDetails(row)}>
                          <td style={styles.link}>
                            <i className="fa fa-ellipsis-v fa-fw" />
                          </td>
                          <td>{row.role_name}</td>
                          <td>{row.role_desc}</td>
                          <td>{row.role_functions}</td>
                          <td>{row.role_active}</td>
                          <td>
                            {this.props.roleState.rowID != row.role_id ? (
                              <div>
                                <i style={styles.link}
                                  className="fa fa-pencil fa-fw"
                                  onClick={() => this.editRow(row)}
                                />{" "}
                                <i style={styles.link}
                                  className="fa fa-trash-o fa-fw"
                                  onClick={() => this.deleteRow(row)}
                                />
                              </div>
                            ) : (
                                <div>
                                  <i style={styles.link}
                                    className="fa fa-floppy-o fa-fw"
                                    onClick={() => this.updateRow(row)}
                                  />{" "}
                                  <i style={styles.link}
                                    className="fa fa-ban fa-fw"
                                    onClick={() => this.cancelRow(row)}
                                  />
                                </div>
                              )}
                          </td>
                        </tr>
                      ))}
                      <tr
                        style={{ backgroundColor: "white" }}
                        className="p-0 m-0"
                      >
                        <td className="p-0 m-0 border-0" />
                        <td className="p-0 m-0 border-0">
                          <div className="d-flex justify-content-around">
                            <Label>Page Size:</Label>
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
                          </div>
                        </td>
                        <td colSpan={3} className="p-0 m-0 border-0" />
                        <td className="float-right p-0 m-0 border-0">
                          <HVSPagination
                            searchCol={this.state.searchCol}
                            items={this.items}
                            filterValue={this.state.filters}
                            onChangePage={this.onChangePage}
                            pageSize={this.state.pageSize}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </Container>
        <Modal size="lg"
          isOpen={this.state.modal}
          toggle={this.modalToggle}
        >
          <ModalHeader toggle={() => this.setState({ modal: false })}>
            System Administration > {(this.state.roleMode == "A" ? "Add Role" : "Edit Role")}
          </ModalHeader>
          <ModalBody>
            <AddEditRole roleMode={this.state.roleMode} roleRow={this.state.selectedRoleRow} closeDetails={this.refreshScreen} />
          </ModalBody>
        </Modal>
      </div>

    );
  }
}

const mapStateToProps = state => {
  //debugger;
  return {
    roleState: state.roleState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      ...roleActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(Roles);