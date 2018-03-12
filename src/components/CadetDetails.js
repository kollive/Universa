import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import {
  Card,
  Button,
  CardImg,
  CardTitle,
  CardText,
  CardGroup,
  CardSubtitle,
  CardBody,
  Form,
  FormGroup
} from "reactstrap";

import {
  Container,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Collapse,
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

import clientpic from "../images/cadet_generic.png";
import cDetail from "../images/cDetail.png";
import bottompic from "../images/cadetdetails.png";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import * as _ from "lodash";
import { bindActionCreators } from "redux";
import { types as cadetDetailsTypes } from "../reducers/cadetdetailsreducer";
import { actions as cadetDetailsActions } from "../reducers/cadetdetailsreducer";

import HVSPagination from "../customComponents/pagination";
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  Popover,
  PopoverHeader,
  PopoverBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

const styles = {
  link: {
    cursor: "pointer"
  }
};

export class CadetDetails extends Component {
  static propTypes = {
    //name: PropTypes.string.isRequired
  };

  componentWillMount = () => {
    // debugger;
  };

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps");
    console.log(nextProps);
    this.items = nextProps.cadetDetailsState.items;
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
    console.log(this.props);

    //alert(this.props.cadetRow.hv_table_i)
    //if (this.props) {
    /*
    console.log(this.props.location);

    this.props.getCadets({
      type: cadetDetailsTypes.FETCH_TABLES_REQUEST,
      name: "%"
    });
    */
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
      cadetDetailsState: {},
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
      modal: false
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
    this.modalToggle = this.modalToggle.bind(this);
    //this.newAttribVal = "";
  }

  debouncedSearch = _.debounce(this._onFilterChange, 500);

  modalToggle() {
    this.setState({
      modal: !this.state.modal
    });
  }


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
    const size = this.props.cadetDetailsState.items.length;

    let filteredItems = [];

    for (var index = 0; index < size; index++) {
      const { hv_cadet_name } = this.props.cadetDetailsState.items[index];

      if (hv_cadet_name.toLowerCase().indexOf(filterBy) !== -1) {
        filteredItems.push(this.props.cadetDetailsState.items[index]);
      }

      if (filteredItems.length > (this.state.pageSize || 10) - 1) {
        break;
      }
    }

    /*
    this.props.makeRowEditable({
      type: cadetDetailsTypes.MAKE_ROW_EDITABLE,
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
    this.props.history.push("/cadetDetails", { params: row });
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

  showReport = () => {
    debugger;
    this.setState({
      modal: !this.state.modal
    });
  };
  render() {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <Container
          fluid
          style={{
            overflow: "hidden",
            margin: "0px"
          }}
        >
          <Row>
            <Col sm="12">
              <CardGroup style={{ height: "152px" }}>
                <Card>
                  <CardImg
                    top
                    //style={{ width: "132px", height: "147px" }}
                    src={clientpic}
                    width="100%"
                  />
                </Card>
                <Card className="m-0 p-0">
                  <CardBody>
                    <Form className="m-0 p-0">
                      <FormGroup row className="m-0 p-0">
                        <Col sm={4}>
                          <Label>
                            <strong>Name:</strong>
                          </Label>
                        </Col>
                        <Col sm={8}>{this.props.cadetRow.hv_cadet_name}</Col>
                      </FormGroup>
                      <FormGroup row className="m-0 p-0">
                        <Col sm={4}>
                          <Label>
                            <strong>Birth Date:</strong>
                          </Label>
                        </Col>
                        <Col sm={8}>{this.props.cadetRow.hv_cadet_dob}</Col>
                      </FormGroup>
                      <FormGroup row className="m-0 p-0">
                        <Col sm={4}>
                          <Label>
                            <strong>Current Age:</strong>
                          </Label>
                        </Col>
                        <Col sm={8}>{this.props.cadetRow.hv_cadet_age}</Col>
                      </FormGroup>
                      <FormGroup row className="m-0 p-0">
                        <Col sm={4}>
                          <Label>
                            <strong>Gender:</strong>
                          </Label>
                        </Col>
                        <Col sm={8}>{this.props.cadetRow.hv_cadet_gender}</Col>
                      </FormGroup>
                      <FormGroup row className="m-0 p-0">
                        <Col sm={4}>
                          <Label>
                            <strong>SSN:</strong>
                          </Label>
                        </Col>
                        <Col sm={8}>
                          ***-**-{this.props.cadetRow.hv_cadet_ssn}
                        </Col>
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Form>
                      <FormGroup row className="m-0 p-0">
                        <Col sm={4}>
                          <Label>
                            <strong>ID:</strong>
                          </Label>
                        </Col>
                        <Col sm={8}>{this.props.cadetRow.hv_cadet_id}</Col>
                      </FormGroup>
                      <FormGroup row className="m-0 p-0">
                        <Col sm={4}>
                          <Label>
                            <strong>Physical address:</strong>
                          </Label>
                        </Col>
                        <Col sm={8}>
                          <div>
                            {this.props.cadetRow.hv_cadet_addr1} <br />
                            {this.props.cadetRow.hv_cadet_city}{" "}
                            {this.props.cadetRow.hv_cadet_st}{" "}
                            {this.props.cadetRow.hv_cadet_zip}
                          </div>
                        </Col>
                      </FormGroup>
                      <FormGroup row className="m-0 p-0">
                        <Col sm={12}>
                          <Label
                            style={{
                              cursor: "pointer",
                              color: "blue",
                              textDecoration: "underline"
                            }}
                            onClick={() => this.showReport()}
                          >
                            Cadet Progress report
                          </Label>
                        </Col>
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Form>
                      <FormGroup row className="m-0 p-0">
                        <Col sm={4}>
                          <Label>
                            <strong>Class:</strong>
                          </Label>
                        </Col>
                        <Col sm={8}>{this.props.cadetRow.hv_cadet_class}</Col>
                      </FormGroup>
                      <FormGroup row className="m-0 p-0">
                        <Col sm={4}>
                          <Label>
                            <strong>Mailing address:</strong>
                          </Label>
                        </Col>
                        <Col sm={8}>
                          <div>
                            {this.props.cadetRow.hv_cadet_addr1} <br />
                            {this.props.cadetRow.hv_cadet_city}{" "}
                            {this.props.cadetRow.hv_cadet_st}{" "}
                            {this.props.cadetRow.hv_cadet_zip}
                          </div>
                        </Col>
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <CardGroup style={{ height: "400px" }}>
                <Card>
                  <CardImg top width="100%" src={bottompic} />
                </Card>
              </CardGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <div className="float-right">
                <Button
                  size="sm"
                  color="secondary"
                  onClick={() => this.props.closeDetails()}
                >
                  Save
                </Button>{" "}
                {" "}
                <Button
                  size="sm"
                  color="secondary"
                  onClick={() => this.props.closeDetails()}
                >
                  Cancel
                </Button>
              </div>
            </Col>
          </Row>
          <Modal size="lg"
            isOpen={this.state.modal}
            toggle={this.modalToggle}           
          >
            <ModalHeader toggle={this.modalToggle}>Cadet Progress Report</ModalHeader>
            <ModalBody>
             <img style={{width:"100%"}} src={cDetail} />
            </ModalBody>
            <ModalFooter>            
              <Button color= "secondary" onClick={this.modalToggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  //debugger;
  return {
    cadetDetailsState: state.cadetDetailsState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      ...cadetDetailsActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(CadetDetails);
