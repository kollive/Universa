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
import { types as cadetSearchTypes } from "../reducers/cadetsearchreducer";
import { actions as cadetSearchActions } from "../reducers/cadetsearchreducer";

import HVSPagination from "../customComponents/pagination";
import CadetDetails from "./CadetDetails";
import Mentors from "./Mentors"
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

export class CadetsSearch extends Component {
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
          type: cadetSearchTypes.FETCH_TABLES_REQUEST,
          cname: nextProps.cadetName
        });
        */
    }

    if (nextProps.cadetSearchState.items) {
      this.items = nextProps.cadetSearchState.items;
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

    this.props.getCadets({
      type: cadetSearchTypes.FETCH_TABLES_REQUEST,
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
      cadetsearchState: {},
      selectedRowID: -1,
      modal: false,
      attribValue: "",
      pageOfItems: [],
      filterValue: "",
      sortAsc: true,
      sortedCol: "hv_cadet_name",
      searchCol: "hv_cadet_name",
      pageSize: 10,
      dropdownOpen: false,
      popoverOpen: false,
      inputSearch: "",
      inDetailsTab: false,
      filters: {},
      displayFilter: "none",
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
    this.filterValue = item.hv_cadet_name.toLowerCase();
    this.setState({
      popoverOpen: false
    });
    this._onFilterChange();
    this.inputSearch.value = "";
    //console.log(item.hv_universal_name)
    //alert(item.hv_universal_name)
  }

  onfilterChange = e => {
    //debugger;
    let filters = this.state.filters;
    this.filterValue = e.target.value;

    switch (e.target.id) {
      case "hv_cadet_name":
        filters["hv_cadet_name"] = { value: e.target.value };
        break;
      case "hv_cadet_casemgr":
        filters["hv_cadet_casemgr"] = { value: e.target.value };
        break;
    }
    this.setState({ filters: filters });
    this.debouncedSearch();
  };
  
  _onFilterChange() {
    debugger;

    const size = this.props.cadetSearchState.items.length;

    let filteredItems = [];

    let keys = Object.keys(this.state.filters);
    let filter = Object.values(this.state.filters);

    console.log("keys")
    console.log(keys)
    console.log(this.state.filters)

    if (keys.length > 0) {

      filteredItems = this.props.cadetSearchState.items.filter(
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

    } else {
      filteredItems = this.props.cadetSearchState.items.slice(0, (this.state.pageSize || 10));
    }



    this.setState({
      pageOfItems: filteredItems,
      filterValue: this.filterValue.toLowerCase(),
      selectedRowID: -1,
      popoverOpen: false,
      dropdownOpen: false
    });
  }
  /*

  _onFilterChange() {
    debugger;

    if (!this.filterValue) {
      this.setState((prevState, props) => {
        return { pageOfItems: prevState.pageOfItems };
      });
    }

    const filterBy = _.trim(this.filterValue.toLowerCase());
    const size = this.props.cadetSearchState.items.length;

    let filteredItems = [];

    for (var index = 0; index < size; index++) {
      const { hv_cadet_name } = this.props.cadetSearchState.items[index];

      if (hv_cadet_name.toLowerCase().indexOf(filterBy) !== -1) {
        filteredItems.push(this.props.cadetSearchState.items[index]);
      }

      if (filteredItems.length > (this.state.pageSize || 10) - 1) {
        break;
      }
    }


    this.setState({
      pageOfItems: filteredItems,
      filterValue: this.filterValue.toLowerCase(),
      selectedRowID: -1,
      popoverOpen: false,
      dropdownOpen: false
    });
  }
  */

  showDetails = row => {
    debugger;
    //alert(row.hv_cadet_id);
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
      rows = _.sortBy(this.items, item => new Date(item[columnName]))
    } else if (type == "N") {
      rows = _.sortBy(this.items, item => new Number(item[columnName]))
    } else {
      rows = _.sortBy(this.items, [columnName])
    }

    /*
    let rows;
    rows = _.sortBy(this.items, item => {
      debugger;
      if (_.isNumber(_.parseInt(item[columnName]))) {
        return _.toNumber(item[columnName]);
      } else {
        return _.toString(item[columnName].toLowerCase());
      }
    });
    */

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

  render() {
    this.cadetNameFilter = (
      <input
        style={{ display: this.state.displayFilter }}
        type="text"
        id="hv_cadet_name"
        className=""
        value={
          this.state.filters.hv_cadet_name ? this.state.filters.hv_cadet_name.value : ""
        }
        onChange={this.onfilterChange}
      />
    );
    this.caseMgrFilter = (
      <input
        style={{ display: this.state.displayFilter }}
        type="text"
        id="hv_cadet_casemgr"
        className=""
        value={
          this.state.filters.hv_cadet_casemgr ? this.state.filters.hv_cadet_casemgr.value : ""
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
            marginTop: "20px",
            marginLeft: "-10px",
            marginRight: "20px",
            height: "100%"
          }}
        >
          <Nav tabs className="m-0 p-0">
            {!this.state.inDetailsTab && (
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: this.state.activeTab === "1"
                  })}
                  onClick={() => {
                    this.toggle("1");
                  }}
                >
                  <i className="fa fa-home" /> Cadets
                </NavLink>
              </NavItem>
            )}
            {!this.state.inDetailsTab && (
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: this.state.activeTab === "2"
                  })}
                  onClick={() => {
                    this.toggle("2");
                  }}
                >
                  <i className="fa fa-podcast" /> Mentors
                </NavLink>
              </NavItem>
            )}
            {this.state.inDetailsTab && (
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: this.state.activeTab === "3"
                  })}
                  onClick={() => {
                    this.toggle("3");
                  }}
                >
                  <i className="fa fa-podcast" /> Cadet Details
                </NavLink>
              </NavItem>
            )}
          </Nav>

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
                  </span> {" "}
                  <span className="fa-stack fa-lg">
                    <i className="fa fa-square-o fa-stack-2x" />
                    <i className="fa fa-cloud-upload fa-stack-1x" />
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
                  <div className="d-flex justify-content-between text-center flex-nowrap mw-100">
                    <Dropdown disabled={true} toggle={this.classToggle}>
                      <DropdownToggle caret>
                        Residential class 51(In Application)
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <span className="d-flex align-items-center">
                      {this.state.pageOfItems.length} Cadets
                    </span>
                  </div>
                </Col>
                <Col sm="3">
                  <div className="float-right">
                    <span className="fa-stack fa-lg">
                      <i className="fa fa-square-o fa-stack-2x" />
                      <a
                        href={"http://hvs.selfip.net:4003/cadetexcel"}
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
                        <th
                          style={styles.link}                          
                        >
                          Cadet Name {" "}
                          <i
                            className={this.RenderHeaderColumn("hv_cadet_name")}
                            onClick={() => this.sortTable("hv_cadet_name")}
                          />
                          {this.cadetNameFilter}
                        </th>
                        <th
                          style={styles.link}                          
                        >
                          Cadet ID {" "}
                          <i
                            className={this.RenderHeaderColumn("hv_cadet_id")}
                            onClick={() => this.sortTable("hv_cadet_id", "N")}
                          />
                        </th>
                        <th
                          style={styles.link}                          
                        >
                          Status{" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_cadet_status"
                            )}
                            onClick={() => this.sortTable("hv_cadet_status")}
                          />
                        </th>
                        <th
                          style={styles.link}                          
                        >
                          Platoon{" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_cadet_platoon"
                            )}
                            onClick={() => this.sortTable("hv_cadet_platoon")}
                          />
                        </th>
                        <th
                          style={styles.link}                          
                        >
                          Squad{" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_cadet_squad"
                            )}
                            onClick={() => this.sortTable("hv_cadet_squad")}
                          />
                        </th>
                        <th
                          style={styles.link}                          
                        >
                          Teacher{" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_cadet_teacher"
                            )}
                            onClick={() => this.sortTable("hv_cadet_teacher")}
                          />
                        </th>
                        <th
                          style={styles.link}                          
                        >
                          Counselor{" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_cadet_counselor"
                            )}
                            onClick={() => this.sortTable("hv_cadet_counselor")}
                          />
                        </th>
                        <th
                          style={styles.link}                          
                        >
                          Case Manager{" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_cadet_casemgr"
                            )}
                            onClick={() => this.sortTable("hv_cadet_casemgr")}
                          />
                          {this.caseMgrFilter}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.pageOfItems.map((row, index) => (
                        <tr key={index} onClick={() => this.showDetails(row)}>
                          <td
                            style={styles.link}
                          >
                            <i className="fa fa-ellipsis-v fa-fw" />
                          </td>
                          <td>{row.hv_cadet_name}</td>
                          <td>{row.hv_cadet_id}</td>
                          <td>{row.hv_cadet_status}</td>
                          <td>{row.hv_cadet_platoon}</td>
                          <td>{row.hv_cadet_squad}</td>
                          <td>{row.hv_cadet_teacher}</td>
                          <td>{row.hv_cadet_counselor}</td>
                          <td>{row.hv_cadet_casemgr}</td>
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
                        <td colSpan={6} className="p-0 m-0 border-0" />
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
            <TabPane tabId="2">
              <Mentors></Mentors>
            </TabPane>
            <TabPane tabId="3">
              <Row className="mt-2 mb-0 p-0">
                <Col sm="12">
                  <div className="float-right">
                    <span
                      className="fa-stack"
                      style={styles.link}
                      onClick={() =>
                        this.setState({ inDetailsTab: false, activeTab: "1" })}
                    >
                      <i className="fa fa-square-o fa-stack-2x" />
                      <i className="fa fa-times fa-stack-1x" />
                    </span>
                    {/*
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() =>
                        this.setState({ inDetailsTab: false, activeTab: "1" })}
                    >
                      Cancel Details
                    </Button>
                      */}
                  </div>
                </Col>
              </Row>
              <Row className="m-0 p-0">
                <Col sm="12">
                  <CadetDetails cadetRow={this.selectedCadetRow} closeDetails={() => this.setState({ inDetailsTab: false, activeTab: "1" })} />
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
    cadetSearchState: state.cadetSearchState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      ...cadetSearchActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(CadetsSearch);
