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
  Label
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
import { types as scheduleTypes } from "../reducers/schedulereducer";
import { actions as scheduleActions } from "../reducers/schedulereducer";

import HVSPagination from "../customComponents/pagination";
import CadetDetails from "./CadetDetails";
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

export class Schedule extends Component {
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

    if (this.props.cadetName != nextProps.cadetName) {
      //alert("in");
      //alert( nextProps.cadetName)
      this.setState({
        inputSearch: nextProps.cadetName
      });

      this.filterValue = nextProps.cadetName;
      this.debouncedSearch();
      /*
        
        this.props.getCadets({
            type: scheduleTypes.FETCH_TABLES_REQUEST,
            cname: nextProps.cadetName
          });
          */
    }

    if (nextProps.ScheduleState.items) {
      this.items = nextProps.ScheduleState.items;
    }
    //this.setState({pageOfItems: this.props.attribTableState.items});
    //console.log("nextProps ");
    //debugger;
    //console.log(nextProps);
    //this.forceUpdate();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate");
    console.log(this.state);
  }

  componentDidMount() {
    debugger;
    //alert(this.props.location.state.params.hv_table_i)
    //if (this.props) {
    //alert("mount")
    //alert(this.props.cadetName)
    //console.log(this.props.location);
    this.props.getSchedules({
      type: scheduleTypes.FETCH_TABLES_REQUEST,
      cname: "%"
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
      ScheduleState: {},
      selectedRowID: -1,
      modal: false,
      attribValue: "",
      pageOfItems: [],
      filterValue: "",
      sortAsc: true,
      sortedCol: "hv_staff_name",
      searchCol: "hv_staff_name",
      pageSize: 10,
      dropdownOpen: false,
      popoverOpen: false,
      inputSearch: "",
      inDetailsTab: false
    };

    this.tableID = 0;
    this.newUpdateValue = "";
    this.filterValue = "";
    this.items = [];
    this.selectedCadetRow = {};

    //this.insertRow = this.insertRow.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.setFilterValue = this.setFilterValue.bind(this);
    this.dropToggle = this.dropToggle.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onDropDownItemClick = this.onDropDownItemClick.bind(this);
    this.clickedItem = this.clickedItem.bind(this);
    this.classToggle = this.classToggle.bind(this);
    //this.newAttribVal = "";
  }

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

  clickedItem(item, e) {
    return;
    debugger;
    this.filterValue = item.hv_staff_name.toLowerCase();
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
    const size = this.props.ScheduleState.items.length;

    let filteredItems = [];

    for (var index = 0; index < size; index++) {
      const { hv_staff_name } = this.props.ScheduleState.items[index];

      if (hv_staff_name.toLowerCase().indexOf(filterBy) !== -1) {
        filteredItems.push(this.props.ScheduleState.items[index]);
      }

      if (filteredItems.length > (this.state.pageSize || 10) - 1) {
        break;
      }
    }

    /*
    this.props.makeRowEditable({
      type: scheduleTypes.MAKE_ROW_EDITABLE,
      payload: {
        rowID: -1
      }
    });
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
    //alert(row.hv_staff_name);
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
      rows = _.sortBy(this.items, item => {        
        return  parseFloat(item[columnName].replace(/[^0-9\.-]/g,""));
      });
    } else {
      rows = _.sortBy(this.items, [columnName]);
    }
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

  saveAttribVal = event => {
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

  classToggle = () => {};

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

  render() {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <Container
          fluid
          style={{
            overflow: "hidden",
            height: "100%",
            width:"100%"
          }}
        >
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row className="p-0 m-0">
                <Col sm="2">
                  <span className="fa-stack fa-lg">
                    <i className="fa fa-square-o fa-stack-2x" />
                    <i className="fa fa-plus-circle fa-stack-1x" />
                  </span>{" "}
                  {" "}
                  <span className="fa-stack fa-lg">
                    <i className="fa fa-square-o fa-stack-2x" />
                    <i className="fa fa-list-ul fa-stack-1x" />
                  </span>
                </Col>
                <Col sm="3">
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
                </Col>
                <Col sm="4">
                  <div className="mx-center">
                    {this.state.pageOfItems.length} Courses 
                  </div>
                </Col>
                <Col sm="3">
                  <div className="float-right">
                    <span className="fa-stack fa-lg">
                      <i className="fa fa-square-o fa-stack-2x" />
                      <a
                        href={"http://hvs.selfip.net:4003/scheduleexcel"}
                        download={"test.xlsx"}
                      >
                        <i className="fa f fa-file-excel-o fa-stack-1x" />
                      </a>
                    </span>{" "}
                    {" "}
                    <span className="fa-stack fa-lg">
                      <i className="fa fa-square-o fa-stack-2x" />
                      <i className="fa fa-filter fa-stack-1x" />
                    </span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm="12" style={{width:"100%"}}>
                  <Table
                    bordered
                    striped
                    hover
                    size="sm"
                    className="border-bottom-0"
                  >
                    <thead>
                      <tr style={{ backgroundColor: "grey", color: "white" }}>
                        <th style={{ width: "20px" }} />
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_category")}
                        >
                          Class / Term {" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_category"
                            )}
                          />
                        </th>
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_staff_name")}
                        >
                          Course / Activity {" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_staff_name"
                            )}
                          />
                        </th>
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_staff_title")}
                        >
                          Teacher / Leader {" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_staff_title"
                            )}
                          />
                        </th>
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_obj_code")}
                        >
                         Title {" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_obj_code"
                            )}
                          />
                        </th>
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_bdgt_diff")}
                        >
                            Time Start / End {" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_bdgt_diff"
                            )}
                          />
                        </th>
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_allocation")}
                        >
                          Weekly Sched {" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_allocation"
                            )}
                          />
                        </th>
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_apprv_type")}
                        >
                          Approve / Reject {" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_apprv_type"
                            )}
                          />
                        </th>            
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.pageOfItems.map((row, index) => (
                        <tr key={index} onClick={() => this.showDetails(row)}>
                          <td style={styles.link}>
                            <i className="fa fa-ellipsis-v fa-fw" />
                          </td>
                          <td>{row.hv_category}</td>
                          <td>{row.hv_staff_name}</td>
                          <td>{row.hv_staff_title}</td>
                          <td>{row.hv_obj_code}</td>
                          <td>{row.hv_bdgt_diff}</td>
                          <td>{row.hv_allocation}</td>
                          <td><div><Button className="bg-primary text-white rounded" size="sm" >Approve</Button>{" "}<Button color="secondary" className="rounded" size="sm" >Reject</Button> </div></td>
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
                        <td colSpan={5} className="p-0 m-0 border-0" />
                        <td className="float-right p-0 m-0 border-0">
                          <HVSPagination
                            searchCol={this.state.searchCol}
                            items={this.items}
                            filterValue={this.state.filterValue}
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  //debugger;
  return {
    ScheduleState: state.ScheduleState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      ...scheduleActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
