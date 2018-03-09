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
import DatePicker from 'react-datepicker';
import moment from 'moment';

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

    formatDate = (dt) => {
        let d = new Date(dt);
        return d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2); //d.getHours() d.getMinutes()
    }

    componentWillReceiveProps(nextProps) {
        //alert("componentWillReceiveProps");
        //console.log(nextProps);
        //alert(this.props.staffID )
        //alert(this.props.CommonState.hv_staff_id )
        //debugger;

        if ((new Date(nextProps.startDT).setHours(0, 0, 0, 0) != new Date(this.props.startDT).setHours(0, 0, 0, 0)) || (new Date(nextProps.endDT).setHours(0, 0, 0, 0) != new Date(this.props.endDT).setHours(0, 0, 0, 0))) {
            this.props.getWorkPlans({
                type: workplanTypes.FETCH_TABLES_REQUEST,
                payload: {
                    staffID: (this.props.staffID == "" ? "7" : this.props.staffID),
                    startDT: this.formatDate(nextProps.startDT),
                    endDT: this.formatDate(nextProps.endDT)
                }
            });
        }

        if (nextProps.WorkPlanState.items) {
            //if(this.props != nextProps) {
            //debugger;
            //alert("in Data")
            this.setState({
                items: nextProps.WorkPlanState.items[0],
                changeOrders: nextProps.WorkPlanState.items[1],
                taskStatusDesc: nextProps.WorkPlanState.items[2]
            })
            /*
            let moHrs = 0;
            let tuHrs = 0;
            let wdHrs = 0;
            let thHrs = 0;
            let frHrs = 0;
            let stHrs = 0;
            let suHrs = 0;

            moHrs = this.getHours(2);
            tuHrs = this.getHours(3);
            wdHrs = this.getHours(4);
            thHrs = this.getHours(5);
            frHrs = this.getHours(6);
            stHrs = this.getHours(7);
            suHrs = this.getHours(1);
            //alert(mondayHrs)

            this.setState({
                mondayHrs: this.getHours(2),
                tuedayHrs: this.getHours(3),
                weddayHrs: this.getHours(4),
                thudayHrs: this.getHours(5),
                fridayHrs: this.getHours(6),
                satdayHrs: this.getHours(7),
                sundayHrs: this.getHours(1),
            })       
            */
            //alert(this.state.mondayHrs);
        }
        //this.setState({pageOfItems: this.props.attribTableState.items});
        //console.log("nextProps ");
        //debugger;
        //console.log(nextProps);
        //this.forceUpdate();
    }

    componentDidUpdate(prevProps, prevState) {
        //alert("DidUpdate")
        //console.log("componentDidUpdate");
        //console.log(this.state);
        if (_.trim(this.props.WorkPlanState.message.msg) == "data") {
            this.props.getWorkPlans({
                type: workplanTypes.FETCH_TABLES_REQUEST,
                payload: {
                    staffID: (this.props.staffID == "" ? "7" : this.props.staffID),
                    startDT: this.formatDate(this.props.startDT),
                    endDT: this.formatDate(this.props.endDT)
                }
            });


            this.props.resetMessage({
                type: workplanTypes.MESSAGE,
                message: { val: 0, msg: "" }
            });

        } else if (_.trim(this.props.WorkPlanState.message.msg) != "") {
            //debugger;      
            alert(this.props.WorkPlanState.message.msg);

            if (this.props.WorkPlanState.message.val == "1") {
                this.setState({ modal: !this.state.modal });

                this.props.getWorkPlans({
                    type: workplanTypes.FETCH_TABLES_REQUEST,
                    payload: {
                        staffID: (this.props.staffID == "" ? "7" : this.props.staffID),
                        startDT: this.formatDate(this.props.startDT),
                        endDT: this.formatDate(this.props.endDT)
                    }
                });
            }

            this.props.resetMessage({
                type: workplanTypes.MESSAGE,
                message: { val: 0, msg: "" }
            });
        } else {

        }
    }


    componentDidMount() {
        debugger;
        //alert(this.props.staffID)
        //if (this.props) {
        /*
    if (this.props.startDT != null) {
        //alert(this.props.CommonState.hv_staff_id)
        this.props.getWorkPlans({
            type: workplanTypes.FETCH_TABLES_REQUEST,
            payload: {
                staffID: (this.props.staffID == "" ? this.props.CommonState.hv_staff_id : this.props.staffID),
                startDT: this.formatDate(this.props.startDT),
                endDT: this.formatDate(this.props.endDT)
            }
        });
    }
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
            selectedRowID: -1,
            modal: false,
            taskName: "",
            pageOfItems: [],
            filterValue: "",
            sortAsc: true,
            startDate: moment(),
            endDate: moment(),
            pageSize: 10,
            dropdownOpen: false,
            popoverOpen: false,
            inputSearch: "",
            inDetailsTab: false,
            changeOrders: [],
            taskStatusDesc: [],
            mondayHrs: 0,
            tuedayHrs: 0,
            weddayHrs: 0,
            thudayHrs: 0,
            fridayHrs: 0,
            satdayHrs: 0,
            sundayHrs: 0,
        };

        this.tableID = 0;
        this.newUpdateValue = "";
        this.filterValue = "";
        this.selectedCadetRow = {};

        this.formatDate = this.formatDate.bind(this);
        this.saveTask = this.saveTask.bind(this);
        this.toggle = this.toggle.bind(this);
        this.getDayHours = this.getDayHours.bind(this);
        this.saveHours = this.saveHours.bind(this);
        this.getHours = this.getHours.bind(this);

        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);

        this.addTask = this.addTask.bind(this);
        this.saveTask = this.saveTask.bind(this);
        //this.newAttribVal = "";
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
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

    saveTask = () => {
        //taskOrderCtl
        //taskNameCtl
        //taskDescCtl
        //startDT
        //endDT
        //taskStatusCtl
        debugger;
        if (_.trim(this.taskNameCtl.value) == "") {
            alert("Please enter task name.")
            this.taskNameCtl.focus();
            return false;
        }

        if (_.trim(this.taskDescCtl.value) == "") {
            alert("Please enter task description.")
            this.taskDescCtl.focus();
            return false;
        }

        this.props.insertTaskTable({
            type: workplanTypes.INSERT_REQUEST,
            payload: {
                staff_id: this.props.staffID,
                change_order_id: this.taskOrderCtl.value,
                task_start_date: this.formatDate(new Date(this.state.startDate)),
                task_end_date: this.formatDate(new Date(this.state.endDate)),
                task_desc: this.taskDescCtl.value,
                task_status: this.taskStatusCtl.value
            }
        });
    }

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

    handleStartChange = (date) => {
        this.setState({
            startDate: date
        })
    }

    handleEndChange = (date) => {
        this.setState({
            endDate: date
        })
    }

    getHours = (day) => {
        debugger;
        if (this.props.mode == "W") {
            let rows = _.filter((this.state.items || []), function (itm) {
                //alert("itm" + itm.task_id);
                //alert("row" + row.task_id)
                return (_.parseInt(itm.taskday) == _.parseInt(day))
            });

            //alert(rows.length)
            if (rows.length > 0) {
                let hours = 0
                rows.forEach(function (val, indx) {
                    hours += _.parseInt(val.num_hours);
                })
                //alert(hours)
                return hours;
            } else {
                return 0;
            }
        } else {

            let hours = 0;
            (this.state.items || []).forEach(function (val, indx) {
                hours += _.parseInt(val.num_hours);
            })
            //alert(hours)
            return hours;
        }
    }

    //Sunday = 1, Saturday = 7
    getDayHours = (day, tmprow) => {

        if (this.props.mode == "W") {
            let rows = _.filter((this.state.items || []), function (itm) {
                //alert("itm" + itm.task_id);
                //alert("row" + row.task_id)

                //From the database
                let d = new Date(itm.task_date);
                d.setDate(d.getDate() + 1);
                let d1 = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + (d.getDate())).slice(-2); //d.getHours() 
                console.log(d1)                                               
                return (_.parseInt(itm.task_id) == _.parseInt(tmprow.task_id) && _.parseInt(itm.taskday) == _.parseInt(day) && (d1 != "1900-01-01"))
            });

            if (rows.length > 0) {
                let row = rows[0];
                return row.num_hours || 0;
            } else {
                return 0;
            }
        } else {
            //alert("in")
            //alert(this.props.startDT)
            let startDT = this.props.startDT;
            let rows = _.filter((this.state.items || []), function (itm) {
                //alert("itm" + itm.task_id);
                //alert("row" + row.task_id)
                //console.log(this.formatDate(itm.task_date))
                //console.log(this.formatDate(startDT))
                //console.log(new Date(itm.task_date).setHours(0,0,0,0))
                //console.log( new Date(startDT).setHours(0,0,0,0))

                //From the database
                let d = new Date(itm.task_date);
                d.setDate(d.getDate() + 1);
                let d1 = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2); //d.getHours() 
                
                d = new Date(startDT);
                let d2 = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2); //d.getHours() 

                console.log(itm.task_date)
                console.log(d1)
                console.log(d2)
                //let d1 = this.formatDate(itm.task_date);
                //let d2 = this.formatDate(itm.startDT);

                return (_.parseInt(itm.task_id) == _.parseInt(tmprow.task_id) && (d1 != "1900-01-01") && (d1 == d2))
            });
            //console.log("9999999999999")
            //console.log(this.state.items)
            //console.log(startDT);
            //console.log(rows)
            if (rows.length > 0) {
                let row = rows[0];
                return row.num_hours || 0;
            } else {
                return 0;
            }
        }
    }

    saveHours = (e, date, num, row) => {
        //alert("in Save")
        debugger;
        let hrs = e.target.value;
        if (_.trim(hrs) == "") {
            hrs = 0;
        }
        hrs = Number(hrs);

        let items = this.state.items;

        let dt = new Date(date);
        dt = dt.setDate(dt.getDate() + num);

        this.props.insertHourTable({
            type: workplanTypes.INSERTHOUR_REQUEST,
            payload: {
                task_id: row.task_id,
                task_date: this.formatDate(dt),
                num_hours: (hrs || 0),
                user_id: "sv"
            }
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
                                    {this.props.mode == "D" ?
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
                                                <Label>{this.getHours(2)}</Label>
                                            </th>
                                        </tr>
                                        :
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
                                                <Label>{this.getHours(2)}</Label>
                                            </th>
                                            <th style={{ width: "80px" }}>
                                                <Label>{this.getHours(3)}</Label>
                                            </th>
                                            <th style={{ width: "80px" }}>
                                                <Label>{this.getHours(4)}</Label>
                                            </th>
                                            <th style={{ width: "80px" }}>
                                                <Label>{this.getHours(5)}</Label>
                                            </th>
                                            <th style={{ width: "80px" }}>
                                                <Label>{this.getHours(6)}</Label>
                                            </th>
                                            <th style={{ width: "80px" }}>
                                                <Label>{this.getHours(7)}</Label>
                                            </th>
                                            <th style={{ width: "80px" }}>
                                                <Label>{this.getHours(1)}</Label>
                                            </th>
                                        </tr>
                                    }
                                </thead>
                                <tbody>
                                    {_.uniqBy((this.state.items || []), "task_id").map(
                                        (row, index) => (
                                            this.props.mode == "D" ?
                                                (
                                                    <tr key={index}>
                                                        <td style={styles.link}>
                                                            <i className="fa fa-tasks fa-fw" />
                                                        </td>
                                                        <td>{row.task_description}</td>
                                                        <td>{""}</td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                style={{ width: "40px", height: "22px", lineHeight: "0", padding: "0px" }}
                                                                value={this.getDayHours(2, row)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 0, row) }}  //Monday                                        
                                                            ></Input>
                                                        </td>
                                                        <td colspan={6}>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <tr key={index}>
                                                        <td style={styles.link}>
                                                            <i className="fa fa-tasks fa-fw" />
                                                        </td>
                                                        <td>{row.task_description}</td>
                                                        <td>{""}</td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                style={{ width: "40px", height: "22px", lineHeight: "0", padding: "0px" }}
                                                                value={this.getDayHours(2, row)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 0, row) }}  //Monday                                        
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                style={{ width: "40px", height: "22px", lineHeight: "0", padding: "0px" }}
                                                                value={this.getDayHours(3, row)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 1, row) }}  //Tuesday          
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                style={{ width: "40px", height: "22px", lineHeight: "0", padding: "0px" }}
                                                                value={this.getDayHours(4, row)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 2, row) }}  //Wednesday                                
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                style={{ width: "40px", height: "22px", lineHeight: "0", padding: "0px" }}
                                                                value={this.getDayHours(5, row)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 3, row) }}  //Thursday                                
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                style={{ width: "40px", height: "22px", lineHeight: "0", padding: "0px" }}
                                                                value={this.getDayHours(6, row)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 4, row) }}  //Friday                                
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                style={{ width: "40px", height: "22px", lineHeight: "0", padding: "0px" }}
                                                                value={this.getDayHours(7, row)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 5, row) }}  //Saturday                                
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                style={{ width: "40px", height: "22px", lineHeight: "0", padding: "0px" }}
                                                                value={this.getDayHours(1, row)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 6, row) }}  //Sunday                                
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                        )
                                    )}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} autoFocus={false} size="md">
                        <ModalHeader toggle={this.toggle}>Add Task</ModalHeader>
                        <ModalBody>
                            <Container fluid>
                                <Row>
                                    <Col>Change Order:</Col>
                                    <Col>
                                        <Input
                                            type="select"
                                            style={{ width: "250px", lineHeight: "0", padding: "0px" }}
                                            placeholder={"Please select a change Order"}
                                            innerRef={(ref) => { this.taskOrderCtl = ref }}
                                        >
                                            {(this.state.changeOrders || []).map((order, index) => (
                                                <option key={order.change_order_id} value={order.change_order_id}>{order.change_order_desc}</option>
                                            ))}
                                        </Input>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>Task Name:</Col>
                                    <Col>
                                        <Input
                                            type="text"
                                            style={{ width: "250px", lineHeight: "0", padding: "0px" }}
                                            placeholder={"Please enter task name"}
                                            innerRef={(ref) => { this.taskNameCtl = ref }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>Task Description:</Col>
                                    <Col>
                                        <Input
                                            type="text"
                                            style={{ width: "250px", lineHeight: "0", padding: "0px" }}
                                            placeholder={"Please enter task description"}
                                            innerRef={(ref) => { this.taskDescCtl = ref }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>Task Start Date:</Col>
                                    <Col>
                                        <DatePicker ref={(r) => { this.startDT = r }} selected={this.state.startDate} onChange={this.handleStartChange} dateFormat="YYYY-MM-DD" />
                                    </Col>

                                </Row>
                                <Row>
                                    <Col>Task End Date:</Col>
                                    <Col>
                                        <DatePicker ref={(r) => { this.endDT = r }} selected={this.state.endDate} onChange={this.handleEndChange} dateFormat="YYYY-MM-DD" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>Task Status:</Col>
                                    <Col>
                                        <Input
                                            type="select"
                                            style={{ width: "250px", lineHeight: "0", padding: "0px" }}
                                            placeholder={"Please select a change Order"}
                                            innerRef={(ref) => { this.taskStatusCtl = ref }}
                                        >
                                            {(this.state.taskStatusDesc || []).map((status, index) => (
                                                <option key={status.task_status_id} value={status.task_status_id}> {status.task_status_desc}</option>
                                            ))}
                                        </Input>
                                    </Col>
                                </Row>
                            </Container>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.saveTask}>
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
        WorkPlanState: state.WorkPlanState,
        CommonState: state.CommonState
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
