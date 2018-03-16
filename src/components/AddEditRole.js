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
  Form,
  FormGroup
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
import { types as aeroleTypes } from "../reducers/aerolereducer";
import { actions as aeroleActions } from "../reducers/aerolereducer";

import HVSPagination from "../customComponents/pagination";
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

export class AddEditRole extends Component {
  static propTypes = {
    //name: PropTypes.string.isRequired
  };

  componentWillMount = () => {
    // debugger;
  };

  componentWillReceiveProps(nextProps) {
    debugger;
        

    if (nextProps.aeroleState.items) {

      //alert("componentWillReceiveProps");

      const role = _.uniqBy(nextProps.aeroleState.items, "role_id");
      //const role_name =  _.uniqBy(nextProps.aeroleState.items, "role_name");
      //const role_desc =  _.uniqBy(nextProps.aeroleState.items, "role_Desc");

      console.log(role)
      //console.log(nextProps.aeroleState.items.length)

      if (role.length > 0) {
        this.setState({
          role_id: role[0].role_id,
          role_name: role[0].role_name,
          role_desc: role[0].role_Desc
        })
      }

      debugger;
      let funcSelected = _.filter(nextProps.aeroleState.items, function (item) {
        return parseInt(item.role_func_id) > 0;
      });

      //console.log(funcSelected)
      this.setState({
        funcSelected: funcSelected,
        items: nextProps.aeroleState.items
      })
      console.log("selected Func")
      console.log(funcSelected)

      //this.items = nextProps.aeroleState.items;
    }

    //console.log(nextProps);
    //alert(this.props.cadetName )
    //alert(nextProps.cadetName )
    /*
    if (this.props.cadetName != nextProps.cadetName) {
      //alert("in");
      //alert( nextProps.cadetName)
      this.setState({
        inputSearch: nextProps.cadetName
      });
      this.filterValue = nextProps.cadetName;
      this.debouncedSearch();
      
        
        this.props.getCadets({
            type: aeroleTypes.FETCH_TABLES_REQUEST,
            cname: nextProps.cadetName
          });
        
    }
    if (nextProps.aeroleState.items) {
      this.items = nextProps.aeroleState.items;
    }
    //this.setState({pageOfItems: this.props.attribTableState.items});
    //console.log("nextProps ");
    //debugger;
    //console.log(nextProps);
    //this.forceUpdate();
    */
  }

  componentDidUpdate(prevProps, prevState) {
    //alert("DidUpdate")
    //console.log("componentDidUpdate");
    //console.log(this.state);
    if (_.trim(this.props.aeroleState.message.msg) != "") {
      debugger;      
      alert(this.props.aeroleState.message.msg);
      
      if(this.props.aeroleState.message.val == 1){
        this.props.closeDetails(true);
      }

      this.props.resetMessage({
        type: aeroleTypes.MESSAGE,
        message:  { val: 0, msg: "" }
      });
    }
  }

  componentDidMount() {
    debugger;
    //alert(this.props.location.state.params.hv_table_i)
    //if (this.props) {
    //alert("mount")
    //alert(this.props.cadetName)
    //console.log(this.props.location);
    this.props.getScreens({
      type: aeroleTypes.FETCH_TABLES_REQUEST,
      cname: this.props.roleRow.role_id
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
      aeroleState: {},
      selectedRowID: -1,
      modal: false,
      attribValue: "",
      pageOfItems: [],
      filterValue: "",
      sortAsc: true,
      sortedCol: "hv_aerole_name",
      searchCol: "hv_aerole_name",
      pageSize: 10,
      role_id: "",
      role_name: "",
      role_desc: "",
      dropdownOpen: false,
      popoverOpen: false,
      inputSearch: "",
      screens: {},
      funcSelected: []
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
    this.setValue = this.setValue.bind(this);
    this.dropToggle = this.dropToggle.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onDropDownpermClick = this.onDropDownpermClick.bind(this);
    this.permClick = this.permClick.bind(this);
    this.clickedItem = this.clickedItem.bind(this);
    this.classToggle = this.classToggle.bind(this);
    this.clickCheck = this.clickCheck.bind(this);
    //this.newAttribVal = "";
    /*onClick={() => {
                      this.permClick(row);
                    }}*/
  }

  setValue = e => {
    //return;
    debugger;
    console.log(e)
    /*
    this.inputSearch = e.target;
    if (_.trim(e.target.value) != "") {
      this.setState({ popoverOpen: true });
    } else {
      this.setState({ popoverOpen: false });
    }
    */
    //this.setState({ popoverOpen: !this.state.popoverOpen });
    let propName = `${e.target.name}`;

    this.setState({
      [e.target.name]: e.target.value
    });

  };

  clickCheck = e => {
    debugger;
    //alert(e.target.checked);
    //alert(e.target.id);
    let FuncPicked = this.props.aeroleState.items.find((item) => {
      return item.function_id == e.target.id;
    })

    debugger;
    let funcSelected = this.state.funcSelected;
    if (!e.target.checked) {
      funcSelected = funcSelected.reduce(function (pre, curr) {
        //debugger;
        if (curr.function_id != parseInt(e.target.id)) {
          pre.push(curr)
        }
        return pre;
      }, []);
    } else {
      funcSelected.push(FuncPicked);
      //Update the store Item with role Id
    }

    debugger;
    //if(FuncPicked) {
    //  FuncPicked.role_func_id = (!e.target.checked ? 0 : e.target.id)
    //}

    let items = this.state.items;
    items = items.map((itm) => {
      //debugger;
      if (itm.function_id == parseInt(e.target.id)) {
        debugger;
        itm.role_func_id = parseInt((!e.target.checked ? 0 : e.target.id))
      }
      return itm;
    })

    debugger;
    //[...this.state.items, FuncPicked]
    this.setState({
      funcSelected: funcSelected,
      items: items
    })


    //console.log(funcSelected)
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
    this.filterValue = item.hv_aerole_name.toLowerCase();
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
    const size = this.props.aeroleState.items.length;

    let filteredItems = [];

    for (var index = 0; index < size; index++) {
      const { hv_aerole_name } = this.props.aeroleState.items[index];

      if (hv_aerole_name.toLowerCase().indexOf(filterBy) !== -1) {
        filteredItems.push(this.props.aeroleState.items[index]);
      }

      if (filteredItems.length > (this.state.pageSize || 10) - 1) {
        break;
      }
    }

    /*
    this.props.makeRowEditable({
      type: aeroleTypes.MAKE_ROW_EDITABLE,
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
    //alert(row.hv_aerole_status);
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

  toggle = screenRow => {
    debugger;
    let screens = this.state.screens;
    screens[screenRow.screen_name] = this.state.screens[screenRow.screen_name]
      ? {
        value: !this.state.screens[screenRow.screen_name].value
      }
      : { value: false };
    this.setState({ screens: screens });
  };

  classToggle = () => { };

  dropToggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  permClick = row => {
    debugger;
    console.log(row);
    alert(row.function_id)
    //this.props.history.push("/cadetsearch", { params: row });
  };

  showMessage(msg) {
    alert(msg);
  }

  onDropDownpermClick(val) {
    debugger;
    //alert(val);
    this.setState({
      pageSize: val
    });
  }

  addUpdate() {
    debugger;
    //spu_getRoleScreenFunctions '2','sv','[{"screenId" : 1, "functionId" : 1},{"screenId" : 2, "functionId" : 3}]'

    if(_.trim(this.state.role_name) == "") {
      alert("please enter role name");
      this.txtRoleName.focus();
      return false;
    }

    if(_.trim(this.state.role_desc) == "") {
      alert("please enter role description");
      this.txtRoleDesc.focus();
      return false;
    }

    let funcSelected = this.state.funcSelected;
    let saveStr = "";
    funcSelected.forEach((func) => {
      saveStr += '{"screenId":' + func.screen_id + ',"functionId":' + func.function_id + '},'
    })

    if (_.trim(saveStr) != "") {
      saveStr = saveStr.substr(0, saveStr.length - 1);
      saveStr = '[' + saveStr + ']';
    }  else {
      alert("Please select a permission for the role");
      return false;
    }

    console.log(saveStr);
    //alert( this.props.roleMode)
    this.props.updateScreenTable({
      type: aeroleTypes.UPDATE_REQUEST,
      payload: {
        role_id: this.state.role_id,
        role_name: this.state.role_name,
        role_desc: this.state.role_desc,
        functions: saveStr,
        mode: this.props.roleMode
      }
    });

  }

  cancelScreen() {
    this.props.closeDetails(false);
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
      className = "";
    }

    return className;
  };

  renderTables(screenName) {
    debugger;
    //let Items = _.filter(this.props.aeroleState.items, function (item) {
    let Items = _.filter(this.state.items, function (item) {
      return item.screen_name == screenName;
    });

    //alert(Items.length)
    console.log(Items);

    return (
      <Row className="p-0 mt-1">
        <Col sm="4">
          <ListGroup>
            {Items.map(
              (row, index) =>
                index < 6 ? (
                  <ListGroupItem
                    className="border-0"
                    style={{
                      cursor: "pointer"
                    }}
                    key={index}
                  >
                    <Input type="checkbox" checked={(parseInt(row.role_func_id) != 0) ? true : false} id={row.function_id} onChange={this.clickCheck} /> {row.function_desc}
                  </ListGroupItem>
                ) : null
            )}
          </ListGroup>
        </Col>
        <Col sm="4">
          <ListGroup>
            {Items.map(
              (row, index) =>
                index >= 6 && index < 12 ? (
                  <ListGroupItem
                    className="border-0"
                    style={{
                      cursor: "pointer"
                    }}
                    key={index}
                  >
                    <Input type="checkbox" checked={(parseInt(row.role_func_id) != 0) ? true : false} id={row.function_id} onChange={this.clickCheck} /> {row.function_desc}
                  </ListGroupItem>
                ) : null
            )}
          </ListGroup>
        </Col>
        <Col sm="4">
          <ListGroup>
            {Items.map(
              (row, index) =>
                index >= 12 && index < 17 ? (
                  <ListGroupItem
                    className="border-0"
                    style={{
                      cursor: "pointer"
                    }}
                    key={index}
                  >
                    <Input type="checkbox" checked={(parseInt(row.role_func_id) != 0) ? true : false} id={row.function_id} onChange={this.clickCheck} /> {row.function_desc}
                  </ListGroupItem>
                ) : null
            )}
          </ListGroup>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <div
        style={{
          height: "100%", width: "100%"
        }}
      >
        <Container
          fluid
          style={{
            overflow: "hidden",

          }}
        >
          <Row className="p-0 m-0">
            <Col sm="12">
              <Form>
                <FormGroup row>
                  <Label sm={2}>Role ID</Label>
                  <Col sm={10}>
                    <Input
                      type="text"
                      name="roleID"
                      id="roleID"
                      placeholder="Role ID"
                      disabled
                      value={(parseInt(this.state.role_id) == -1 ? "" :  this.state.role_id)}
                      size="sm"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Role Name</Label>
                  <Col sm={10}>
                    <Input
                      type="text"
                      name="role_name"
                      id="roleName"
                      placeholder="Please enter role name"
                      value={this.state.role_name}
                      size="sm"
                      onChange={this.setValue}
                      innerRef={obj => {
                        this.txtRoleName = obj;
                      }}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Role Description</Label>
                  <Col sm={10}>
                    <Input
                      type="text"
                      name="role_desc"
                      id="roleDesc"
                      placeholder="Please enter role description"
                      value={this.state.role_desc}
                      onChange={this.setValue}
                      size="sm"
                      innerRef={obj => {
                        this.txtRoleDesc = obj;
                      }}
                    />
                  </Col>
                </FormGroup>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <div
                id="divPerm"
                className="rounded"
                style={{
                  //position: "absolute",
                  backgroundColor: "white",
                  display: "inline-block",
                  zIndex: "100",
                  lineHeight: "0.85",
                  width: "97%",
                  maxHeight: "500px",
                  minHeight: "500px",
                  height: "auto",
                  overflowX: "hidden",
                  overflowY: "scroll",
                  border: "1px solid grey"
                  //marginTop: "-240px"
                  //marginTop:(this.state.pageOfItems.length == 0 ? "-60px" :
                  //(this.state.pageOfItems.length >= 7)? "-240px" : (-1 * this.state.pageOfItems.length * 40) + "px")
                  //onClick={() => this.showDetails(row)}
                }}
              >
                <Table size="md">
                  <tbody>
                    {_.uniqBy(this.state.items, "screen_name").map(
                      (row, index) => (
                        <tr key={index}>
                          <td size="12" className="border-top-0">
                            <i
                              className={classnames({
                                "fa fa-arrow-down fa-fw": this.state.screens[
                                  row.screen_name
                                ]
                                  ? this.state.screens[row.screen_name].value
                                  : true,
                                "fa fa-arrow-right fa-fw": this.state.screens[
                                  row.screen_name
                                ]
                                  ? !this.state.screens[row.screen_name]
                                    .value
                                  : true
                              })}
                              onClick={() => this.toggle(row)}
                            />
                            <span>{row.screen_name}</span>
                            <Collapse
                              isOpen={
                                this.state.screens[row.screen_name]
                                  ? this.state.screens[row.screen_name].value
                                  : true
                              }
                            >
                              {this.renderTables(row.screen_name)}
                            </Collapse>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <div className="float-right">
                <Button color="primary" style={styles.link} onClick={() => this.addUpdate()}>
                  {(this.props.roleMode == "A") ? "Add" : "Update"}
                </Button>{" "}
                <Button color="secondary"  style={styles.link}  onClick={() => this.cancelScreen()}>
                  Cancel
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  //debugger;
  return {
    aeroleState: state.aeroleState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      ...aeroleActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(AddEditRole);