import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";


import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";

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
import { types as workplanTypes } from "reducers/workplanreducer";
import { actions as workplanActions } from "reducers/workplanreducer";

//import HVSPagination from "customComponents/pagination";
//import CadetDetails from "./CadetDetails";
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

export class WorkPlan extends Component {
    static propTypes = {
        //name: PropTypes.string.isRequired
    };

    componentWillMount = () => {
        // debugger;
    };

    formatDate = (dt) => {
        let d = new Date(dt);
        return d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2); //d.getHours() d.getMinutes()
    }
    componentWillReceiveProps(nextProps) {
        //alert("componentWillReceiveProps");
        //console.log(nextProps);
        //alert(this.props.cadetName )
        //alert(nextProps.cadetName )

        if ((new Date(nextProps.startDT).setHours(0, 0, 0, 0) != new Date(this.props.startDT).setHours(0, 0, 0, 0)) || (new Date(nextProps.endDT).setHours(0, 0, 0, 0) != new Date(this.props.endDT).setHours(0, 0, 0, 0))) {
            this.props.getWorkPlans({
                type: workplanTypes.FETCH_TABLES_REQUEST,
                payload: {
                    staffID: "1",
                    startDT: this.formatDate(nextProps.startDT),
                    endDT: this.formatDate(nextProps.endDT)
                }
            });
        }

        if (nextProps.WorkPlanState.items) {
            this.items = nextProps.WorkPlanState.items;
        }
        //this.setState({pageOfItems: this.props.attribTableState.items});
        //console.log("nextProps ");
        //debugger;
        //console.log(nextProps);
        //this.forceUpdate();
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log("componentDidUpdate");
        //console.log(this.state);
    }

    componentDidMount() {
        debugger;
        //alert(this.props.location.state.params.hv_table_i)
        //if (this.props) {
        //alert("mount")
        //alert(this.props.cadetName)
        //console.log(this.props.location);

        this.props.getWorkPlans({
            type: workplanTypes.FETCH_TABLES_REQUEST,
            payload: {
                staffID: "1",
                startDT: this.formatDate(this.props.startDT),
                endDT: this.formatDate(this.props.endDT)
            }
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
            WorkPlanState: {},
            selectedRowID: -1,
            modal: false,
            taskName: "",
            pageOfItems: [],
            filterValue: "",
            sortAsc: true,
            sortedCol: "hv_bdgt_res_name",
            searchCol: "hv_bdgt_res_name",
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

        this.insertRow = this.insertRow.bind(this);
        this.toggle = this.toggle.bind(this);
        //this.newAttribVal = "";
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            attribValue: ""
        });
    };

    addTask = () => {
        const row = {
            role_id: -1
        }

        this.setState({
            modal: !this.state.modal,
            selectedRoleRow: row,
            roleMode: "A"
        });
    }

    insertRow = () => {
        const row = {
            role_id: -1
        }

        this.setState({
            modal: !this.state.modal,
            selectedRoleRow: row,
            roleMode: "A"
        });
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
        this.filterValue = item.hv_bdgt_res_name.toLowerCase();
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
        const size = this.props.WorkPlanState.items.length;

        let filteredItems = [];

        for (var index = 0; index < size; index++) {
            const { hv_bdgt_res_name } = this.props.WorkPlanState.items[index];

            if (hv_bdgt_res_name.toLowerCase().indexOf(filterBy) !== -1) {
                filteredItems.push(this.props.WorkPlanState.items[index]);
            }

            if (filteredItems.length > (this.state.pageSize || 10) - 1) {
                break;
            }
        }

        /*
        this.props.makeRowEditable({
          type: workplanTypes.MAKE_ROW_EDITABLE,
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
        //alert(row.hv_bdgt_res_name);
        this.selectedCadetRow = row;
        this.setState({
            activeTab: "3",
            inDetailsTab: true
        });
        //this.props.history.push("/cadetdetails",{ params: row});
    };


    saveTask = event => {
        debugger;
        this.setState({
            taskName: event.target.value
        });
    };



    popToggle = () => {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    };


    classToggle = () => { };

    itemClick = row => {
        debugger;
        console.log(row);
        this.props.history.push("/cadetsearch", { params: row });
    };

    showMessage(msg) {
        alert(msg);
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
                        width: "100%"
                    }}
                >

                    <Row>
                        <Col sm="12" style={{ width: "100%" }}>
                            <Table
                                bordered
                                striped
                                hover
                                size="sm"
                                className="border-bottom-0"
                            >
                                <thead>
                                    <tr style={{ backgroundColor: "#ADD8E6", color: "black" }}>
                                        <th style={{ width: "20px" }}>
                                            <span className="fa-stack fa-lg" style={styles.link} onClick={() => this.addTask()}>
                                                <i className="fa fa-square-o fa-stack-2x" />
                                                <i className="fa fa-plus-circle fa-stack-1x" />
                                            </span>{" "}
                                        </th>
                                        <th style={{ width: "120px" }} />
                                        <th style={{ width: "70px" }}>Total</th>
                                        <th style={{ width: "80px" }}>
                                            <Label>{this.state.mondayHrs}</Label>
                                        </th>
                                        <th style={{ width: "80px" }}>
                                            <Label>{this.state.tuedayHrs}</Label>
                                        </th>
                                        <th style={{ width: "80px" }}>
                                            <Label>{this.state.weddayHrs}</Label>
                                        </th>
                                        <th style={{ width: "80px" }}>
                                            <Label>{this.state.thudayHrs}</Label>
                                        </th>
                                        <th style={{ width: "80px" }}>
                                            <Label>{this.state.fridayHrs}</Label>
                                        </th>
                                        <th style={{ width: "80px" }}>
                                            <Label>{this.state.satdayHrs}</Label>
                                        </th>
                                        <th style={{ width: "80px" }}>
                                            <Label>{this.state.sundayHrs}</Label>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.pageOfItems.map((row, index) => (
                                        <tr key={index}>
                                            <td style={styles.link}>
                                                <i className="fa fa-tasks fa-fw" />
                                            </td>
                                            <td>{row.hv_desc}</td>
                                            <td>{""}</td>
                                            <td>{row.mondayHr}</td>
                                            <td>{row.tuedayHr}</td>
                                            <td>{row.weddayHr}</td>
                                            <td>{row.thudayHr}</td>
                                            <td>{row.fridayHr}</td>
                                            <td>{row.satdayHr}</td>
                                            <td>{row.sundayHr}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} autoFocus={false}>
                        <ModalHeader toggle={this.toggle}>Add Task</ModalHeader>
                        <ModalBody>
                            <Container fluid>
                                <Row>
                                    <Col>Work Order:</Col>
                                    <Col>
                                        <Input
                                            type="text"
                                            style={{ width: "250px", lineHeight: "0", padding: "0px" }}
                                            placeholder={"Please enter task name"}
                                            onChange={this.saveTask}
                                            value={this.state.taskName}
                                            ref="txtValue"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>Task Name:</Col>
                                    <Col>
                                        <Input
                                            type="text"
                                            style={{ width: "250px", lineHeight: "0", padding: "0px" }}
                                            placeholder={"Please enter task name"}
                                            onChange={this.saveTask}
                                            value={this.state.taskName}
                                            ref="txtValue"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>Task Description:</Col>
                                    <Col>
                                        <Input
                                            type="text"
                                            style={{ width: "250px", lineHeight: "0", padding: "0px" }}
                                            placeholder={"Please enter task name"}
                                            onChange={this.saveTask}
                                            value={this.state.taskName}
                                            ref="txtValue"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>Task Start Date:</Col>
                                    <Col>
                                        <Input
                                            type="text"
                                            style={{ width: "250px", lineHeight: "0", padding: "0px" }}
                                            placeholder={"Please enter task name"}
                                            onChange={this.saveTask}
                                            value={this.state.taskName}
                                            ref="txtValue"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>Task End Date:</Col>
                                    <Col>
                                        <Input
                                            type="text"
                                            style={{ width: "250px", lineHeight: "0", padding: "0px" }}
                                            placeholder={"Please enter task name"}
                                            onChange={this.saveTask}
                                            value={this.state.taskName}
                                            ref="txtValue"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>Task Status:</Col>
                                    <Col>
                                        <Input
                                            type="text"
                                            style={{ width: "250px", lineHeight: "0", padding: "0px" }}
                                            placeholder={"Please enter task name"}
                                            onChange={this.saveTask}
                                            value={this.state.taskName}
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
            </div>
        );
    }
}

const mapStateToProps = state => {
    //debugger;
    return {
        WorkPlanState: state.WorkPlanState
    };
};

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(
        {
            ...workplanActions
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkPlan);
