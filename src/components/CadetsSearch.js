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
import { types as cadetSearchTypes } from "reducers/cadetsearchreducer";
import { actions as cadetSearchActions } from "reducers/cadetsearchreducer";

import HVSPagination from "customComponents/pagination";
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
    console.log("componentWillReceiveProps");
    console.log(nextProps);
    this.items = nextProps.cadetSearchState.items;
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

    console.log(this.props.location);

    this.props.getCadets({
      type: cadetSearchTypes.FETCH_TABLES_REQUEST,
      name: "%"
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
      inputSearch: ""
    };

    this.tableID = 0;
    this.newUpdateValue = "";
    this.filterValue = "";
    this.items = [];

    //this.insertRow = this.insertRow.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.setFilterValue = this.setFilterValue.bind(this);
    this.dropToggle = this.dropToggle.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onDropDownItemClick = this.onDropDownItemClick.bind(this);
    this.clickedItem = this.clickedItem.bind(this);

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

    /*
    this.props.makeRowEditable({
      type: cadetSearchTypes.MAKE_ROW_EDITABLE,
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
    alert(row.hv_cadet_id);
    this.props.history.push("/cadetdetails", { params: row });
  };

  sortTable = columnName => {
    debugger;
    let rows;
    rows = _.sortBy(this.items, item => {
      debugger;
      if (_.isNumber(_.parseInt(item[columnName]))) {
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

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  RenderHeaderColumn = columnName => {
    debugger;

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
      <div>
        <Container
          fluid
          style={{
            overflow: "hidden",
            margin: "20px"
          }}
        >
          <Nav tabs size="md">
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={classnames({ active: this.state.activeTab === "1" })}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                <i className="fa fa-home" /> Cadets
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={classnames({ active: this.state.activeTab === "2" })}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                <i className="fa fa-podcast" /> Mentors
              </NavLink>
            </NavItem>
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
                  </span>
                </Col>
                <Col sm="4">
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
                        <i style={styles.link}
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
                <Col sm="1" className="d-flex align-items-center">
                  <Label>{this.state.pageOfItems.length} Cadets</Label>
                </Col>
                <Col sm="5">
                  <div className="float-right">
                    <span className="fa-stack fa-lg">
                      <i className="fa fa-square-o fa-stack-2x" />
                      <i className="fa f fa-file-excel-o fa-stack-1x" />
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
                        <th style={{ width: "20px" }} />
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_cadet_name")}
                        >
                          Cadet Name {" "}
                          <i
                            className={this.RenderHeaderColumn("hv_cadet_name")}
                          />
                        </th>
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_cadet_id")}
                        >
                          Cadet ID {" "}
                          <i
                            className={this.RenderHeaderColumn("hv_cadet_id")}
                          />
                        </th>
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_cadet_status")}
                        >
                          Status{" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_cadet_status"
                            )}
                          />
                        </th>
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_cadet_platoon")}
                        >
                          Platoon{" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_cadet_platoon"
                            )}
                          />
                        </th>
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_cadet_squad")}
                        >
                          Squad{" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_cadet_squad"
                            )}
                          />
                        </th>
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_cadet_teacher")}
                        >
                          Teacher{" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_cadet_teacher"
                            )}
                          />
                        </th>
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_cadet_counselor")}
                        >
                          Counselor{" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_cadet_counselor"
                            )}
                          />
                        </th>
                        <th
                          style={styles.link}
                          onClick={() => this.sortTable("hv_cadet_casemgr")}
                        >
                          Case Manager{" "}
                          <i
                            className={this.RenderHeaderColumn(
                              "hv_cadet_casemgr"
                            )}
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.pageOfItems.map((row, index) => (
                        <tr key={index}>
                          <td
                            style={styles.link}
                            onClick={() => this.showDetails(row)}
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
            <TabPane tabId="2">
              <Row>
                <Col sm="6">1</Col>
                <Col sm="6">2</Col>
              </Row>
            </TabPane>
          </TabContent>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  debugger;
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
