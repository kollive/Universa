import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { DatePicker, TimePicker } from 'antd';
import {
    Form, Select, InputNumber, Switch, Radio,
    Slider, Button, Upload, Icon, Rate, Menu, Dropdown, message, Popconfirm
} from 'antd';

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
    //Button,
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
    //Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";

import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import * as _ from "lodash";
import { bindActionCreators } from "redux";
import { types as workplanTypes } from "../reducers/workplanreducer";
import { actions as workplanActions } from "../reducers/workplanreducer";
//import DatePicker from 'react-datepicker';
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

const format = 'HH:mm';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;



export class WorkPlan extends Component {

    static propTypes = {
        //name: PropTypes.string.isRequired
    };

    handleSubmit = (e) => {
        debugger;
        e.preventDefault();
        /*
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
        */

        //console.log(this.props.form.getFieldsError());
        //console.log(this.props.form.getFieldsValue());

        this.props.form.validateFields((err, fieldsValue) => {
            debugger;
            if (err) {
                return;
            }

            if (new Date(fieldsValue['taskStartDate']) > new Date(fieldsValue['taskEndDate'])) {
                alert("Please select Start date less than end date");
                return false;
            }

            // Should format date value before submit.
            //const rangeValue = fieldsValue['range-picker'];
            //const rangeTimeValue = fieldsValue['range-time-picker'];
            const values = {
                ...fieldsValue,
                'changeOrder': fieldsValue['changeOrder'],
                'taskName': fieldsValue['taskName'],
                'taskDesc': fieldsValue['taskDesc'],
                'taskStartDate': fieldsValue['taskStartDate'].format('YYYY-MM-DD'),
                'taskEndDate': fieldsValue['taskEndDate'].format('YYYY-MM-DD'),
                'taskStatus': fieldsValue['taskStatus'],
            };
            console.log('Received values of form: ', values);

            this.saveTask(values);
        });
    }

    formatDate = (dt) => {
        let d = new Date(dt);
        return d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2); //d.getHours() d.getMinutes()
    }


    shouldComponentUpdate = (nextProps, nextState) => {
        return true;
        //return ((new Date(nextProps.startDT).setHours(0, 0, 0, 0) != new Date(this.props.startDT).setHours(0, 0, 0, 0)) || (new Date(nextProps.endDT).setHours(0, 0, 0, 0) != new Date(this.props.endDT).setHours(0, 0, 0, 0))) 
    }


    componentWillReceiveProps(nextProps) {
        //alert("componentWillReceiveProps");
        //console.log(nextProps);
        //alert(this.props.staffID )
        //alert(this.props.CommonState.hv_staff_id )
        //debugger;

        if ( (this.props.staffID != nextProps.staffID ) || (new Date(nextProps.startDT).setHours(0, 0, 0, 0) != new Date(this.props.startDT).setHours(0, 0, 0, 0)) || (new Date(nextProps.endDT).setHours(0, 0, 0, 0) != new Date(this.props.endDT).setHours(0, 0, 0, 0))) {

            //alert("in Receive")
            //this.setState({ refreshData: true });
            this.props.getWorkPlans({
                type: workplanTypes.FETCH_TABLES_REQUEST,
                payload: {
                    //staffID: (this.props.staffID == "" ? this.props.CommonState.hv_staff_id : this.props.staffID),
                    staffID: nextProps.staffID,
                    startDT: this.formatDate(nextProps.startDT),
                    endDT: this.formatDate(nextProps.endDT)
                }
            });
        }
        else {
            //alert(this.state.refreshData)
            if (nextProps.WorkPlanState.items) {

                //alert((this.state.items || []).length)
                //alert( (nextProps.WorkPlanState.items[0] || []).length)

                //let dif = _.differenceWith((this.state.items || []), (nextProps.WorkPlanState.items[0] || []), _.isEqual);
                //let dif = _.isMatch((this.state.items || []), (nextProps.WorkPlanState.items[0] || []));

                //if(!dif) {
                //if (!_.isEqual((this.state.items || []), (nextProps.WorkPlanState.items[0] || []))) {
                this.setState({
                    items: nextProps.WorkPlanState.items[0],
                    changeOrders: nextProps.WorkPlanState.items[1],
                    taskStatusDesc: nextProps.WorkPlanState.items[2]
                })
                /*
                if ((nextProps.WorkPlanState.items[0] || []).length > 0) {
                    this.setState({ refreshData: false });
                }
                */
            }
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

            //this.setState({ modal: !this.state.modal });

            this.props.getWorkPlans({
                type: workplanTypes.FETCH_TABLES_REQUEST,
                payload: {
                    //staffID: (this.props.staffID == "" ? this.props.CommonState.hv_staff_id : this.props.staffID),
                    staffID : this.props.staffID,
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

                //alert("MM")
                this.setState({ modal: !this.state.modal });
                //this.setState({ refreshData: true });

                this.props.getWorkPlans({
                    type: workplanTypes.FETCH_TABLES_REQUEST,
                    payload: {
                        //staffID: (this.props.staffID == "" ? this.props.CommonState.hv_staff_id : this.props.staffID),
                        staffID : this.props.staffID,
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
        /*
        //this.setState({ modal: !this.state.modal });
        this.setState({ refreshData: true });

        alert(this.props.startDT)
        if (this.props.startDT != null) {           
            this.props.getWorkPlans({
                type: workplanTypes.FETCH_TABLES_REQUEST,
                payload: {
                    staffID: (this.props.staffID == "" ? "7" : this.props.staffID),
                    startDT: this.formatDate(this.props.startDT),
                    endDT: this.formatDate(this.props.endDT)
                }
            });
        }
       
    */

    }

    constructor(props) {
        super(props);
        this.TPRefs = new Map();

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
            refreshData: false,
            headerDesc: "Add Task",
            changeOrderID: "",
            taskName: "",
            taskDesc: "",
            taskStatusID: "",
            taskID: ""
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
        this.closeTP = this.closeTP.bind(this);
        this.getHours = this.getHours.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);

        this.handleStartEvent = this.handleStartEvent.bind(this);
        this.handleEndEvent = this.handleEndEvent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.editTask = this.editTask.bind(this);

        this.addTask = this.addTask.bind(this);
        //this.getMenu = this.getMenu.bind(this);
        //this.newAttribVal = "";
    }

    onMenuClick = (itm, row) => {
        //debugger;
        //alert(row.task_id)
        //message.info(`Click on item ${itm.key}`);
        if (itm.key == 0) {
            this.editTask(row);
        }
    };

    toggle = () => {
        //alert("in Toggle")
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
            taskMode: "A",
            headerDesc: "Add Row",
            changeOrderID: "",
            taskName: "",
            taskDesc: "",
            startDate: moment(new Date(this.props.startDT)),
            endDate: moment(new Date(this.props.endDT)),
            taskStatusID: "",
            taskID: ""
        });

    }

    saveTask = (values) => {
        //taskOrderCtl
        //taskNameCtl
        //taskDescCtl
        //startDT
        //endDT
        //taskStatusCtl
        debugger;
        /*
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

         'taskName': fieldsValue['taskName'],
              'taskDesc': fieldsValue['taskDesc'],
              'taskStartDate': fieldsValue['taskStartDate'].format('YYYY-MM'),
              'taskEndDate': fieldsValue['taskEndDate'].format('YYYY-MM'),
              'taskStatus': fieldsValue['taskStatus'],
        */
        if (this.state.taskMode == "A") {
            this.props.insertTaskTable({
                type: workplanTypes.INSERT_REQUEST,
                payload: {
                    staff_id: this.props.staffID,
                    change_order_id: values.changeOrder,
                    task_start_date: values.taskStartDate,
                    task_end_date: values.taskEndDate,
                    task_desc: values.taskDesc,
                    task_status: values.taskStatus,
                }
            });
        } else {
            this.props.updateTaskTable({
                type: workplanTypes.UPDATE_REQUEST,
                payload: {
                    task_id: this.state.taskID,
                    staff_id: this.props.staffID,
                    change_order_id: values.changeOrder,
                    task_start_date: values.taskStartDate,
                    task_end_date: values.taskEndDate,
                    task_desc: values.taskDesc,
                    task_status: values.taskStatus,
                }
            });
        }

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
        debugger;
        return;
        //e.preventDefault();
        this.setState({
            startDate: date
        })
        this.props.form.setFieldsValue({
            taskStartDate: date
        })
    }

    handleEndChange = (date) => {
        //e.preventDefault();
        return;
        this.setState({
            endDate: date
        })
        this.props.form.setFieldsValue({
            taskEndDate: date
        })
    }

    /*
    function hhmmssToSeconds(str)  {
        var arr = str.split(':').map(Number);
        return (arr[0] * 3600) + (arr[1] * 60) + arr[2];
    };
    
    function secondsToHHMMSS(seconds) {
        var hours = parseInt(seconds / 3600, 10),
            minutes = parseInt((seconds / 60) % 60, 10),
            seconds = parseInt(seconds % 3600 % 60, 10);
    
        return [hours, minutes, seconds].map(function (i) { return i.toString().length === 2 ? i : '0' + i; }).join(':');
    }
    */
    hhmmToSeconds = (str) => {
        let arr = str.split(':').map(Number);
        return (arr[0] * 3600) + (arr[1] * 60);
    };

    secondsToHHMM(seconds) {
        let hours = parseInt(seconds / 3600, 10),
            minutes = parseInt((seconds / 60) % 60, 10);
        //seconds = parseInt(seconds % 3600 % 60, 10);

        return [hours, minutes].map(function (i) { return i.toString().length === 2 ? i : '0' + i; }).join(':');
    }

    getHours = (day) => {
        //debugger;
        if (this.props.mode == "W") {
            let rows = _.filter((this.state.items || []), function (itm) {
                //alert("itm" + itm.task_id);
                //alert("row" + row.task_id)
                return (_.parseInt(itm.taskday) == _.parseInt(day))
            });

            //alert(rows.length)
            if (rows.length > 0) {
                let hours = 0;
                let mins = 0;



                rows.forEach(function (val, indx) {
                    let time = val.num_hours.split(":");
                    //hours += Number.parseFloat(val.num_hours);
                    hours += _.parseInt(time[0]);
                    mins += _.parseInt(time[1]);
                })
                //alert(hours)
                return this.secondsToHHMM(this.hhmmToSeconds(hours + ":" + mins));
            } else {
                return 0;
            }
        } else {

            let hours = 0;
            let mins = 0;

            (this.state.items || []).forEach(function (val, indx) {
                let time = val.num_hours.split(":");
                //hours += Number.parseFloat(val.num_hours);
                hours += _.parseInt(time[0]);
                mins += _.parseInt(time[1]);
            })
            //alert(hours)
            return this.secondsToHHMM(this.hhmmToSeconds(hours + ":" + mins));
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
                //console.log(d1)
                return (_.parseInt(itm.task_id) == _.parseInt(tmprow.task_id) && _.parseInt(itm.taskday) == _.parseInt(day) && (d1 != "1900-01-01"))
            });

            if (rows.length > 0) {
                let row = rows[0];
                return moment(row.num_hours || 0, "HH:mm");
            } else {
                return "";
            }
        } else {
            //alert("in")
            //alert(this.props.startDT)
            let startDT = this.props.startDT;
            let rows = _.filter((this.state.items || []), function (itm) {

                //From the database
                let d = new Date(itm.task_date);
                d.setDate(d.getDate() + 1);
                let d1 = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2); //d.getHours() 

                d = new Date(startDT);
                let d2 = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2); //d.getHours() 

                //console.log(itm.task_date)
                //console.log(d1)
                //console.log(d2)
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
                return moment(row.num_hours || 0, "HH:mm");
            } else {
                return "";
            }
        }
    }

    closeTP = (index) => {
        //alert("in Save")
        //debugger;
        let TP = this.TPRefs.get(index);
        TP.timePickerRef.setState({ open: false });
    }

    //hrs = N
    saveHours = (e, date, num, row, index) => {
        //alert("in Save")
        debugger;
        let items = [];

        let TP = this.TPRefs.get(index);
        TP.timePickerRef.setState({ value: e, open: false });

        let dt = new Date(date);
        dt = dt.setDate(dt.getDate() + num);

        //let hrs = e.target.value;
        let hrs = e.format("HH:mm");

        if (_.trim(hrs) == "00:00") {
            hrs = 0;
        }

        items = this.state.items.map((itm, index) => {
            //debugger;
            let d = new Date(itm.task_date);
            d.setDate(d.getDate() + 1);

            if (itm.task_id == row.task_id && new Date(dt).setHours(0, 0, 0, 0) == new Date(d).setHours(0, 0, 0, 0)) {
                //debugger;
                //alert(itm.num_hours)
                itm.num_hours = hrs;
                return itm;
            } else {
                return itm;
            }
        });

        this.setState({ items });
        //hrs = Number(hrs);
        //let items = this.state.items;


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

    handleStartEvent = (e) => {
        debugger;
        return;
        //e.preventDefault();
        //alert(e)
        //alert(e.target.value)
        //debugger;
        this.props.form.setFieldsValue({
            taskStartDate: e
        });
        //return e;
    }

    handleEndEvent = (e) => {
        debugger;
        return;
        //e.preventDefault();
        //alert(e)
        //alert(e.target.value)
        //debugger;
        this.props.form.setFieldsValue({
            taskEndDate: e
        });
        //return e;
    }

    deleteTask = (row) => {
        debugger;
        if (Number(row.taskhourrows) > 0) {
            alert("This task has hours entered, delete is not allowed.")
            return false;
        }

        this.props.deleteTaskTable({
            type: workplanTypes.DELETE_REQUEST,
            payload: {
                task_id: row.task_id         
            }
        });

    }

    editTask = (row) => {

        debugger;
        //alert(row.task_start_date)
        let sdt = new Date(row.task_start_date);
        sdt.setDate(sdt.getDate() + 1);
        //alert(sdt)

        let edt = new Date(row.task_est_comp_date);
        edt.setDate(edt.getDate() + 1);

        this.setState({
            modal: !this.state.modal,
            taskMode: "E",
            headerDesc: "Edit Row",
            changeOrderID: row.change_order_id,
            taskName: row.task_description,
            taskDesc: row.task_description,
            startDate: moment(sdt),
            endDate: moment(edt),
            taskStatusID: row.status_id,
            taskID: row.task_id
        });

    }

    getMenu = (row) => {
        //alert(row.task_id)
        const menu = (
            <Menu style={{ width: 100 }} onClick={(key) => this.onMenuClick(key, row)}>
                <Menu.Item key="0">
                    <span><Icon type="edit"></Icon>{" "}Edit</span>
                </Menu.Item>
                <Menu.Item key="1">
                    <Popconfirm placement="topRight" title="Are you sure to delete this task?" onConfirm={(e) => this.deleteTask(row)} okText="Yes" cancelText="No">
                        <span><Icon type="delete"></Icon>{" "}Delete</span>
                    </Popconfirm>
                </Menu.Item>
            </Menu>
        );

        return menu;
    }


    render() {

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
        };


        let HTML;
        var TPM, TPTu, TPW, TPTh, TPF, TPS, TPSu, TPD;
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
                                            <th style={{ width: "5%" }}>
                                                <span className="fa-stack fa-lg" style={styles.link} onClick={() => this.addTask()}>
                                                    <i className="fa fa-square-o fa-stack-2x" />
                                                    <i className="fa fa-plus-circle fa-stack-1x" />
                                                </span>{" "}
                                            </th>
                                            <th style={{ width: "25%" }} />
                                            <th style={{ width: "10%" }}>
                                                <Label>{this.getHours(2)}</Label>
                                            </th>
                                        </tr>
                                        :
                                        <tr style={{ backgroundColor: "#ADD8E6", color: "black" }}>
                                            <th style={{ width: "5%" }}>
                                                <span className="fa-stack fa-lg" style={styles.link} onClick={() => this.addTask()}>
                                                    <i className="fa fa-square-o fa-stack-2x" />
                                                    <i className="fa fa-plus-circle fa-stack-1x" />
                                                </span>{" "}
                                            </th>
                                            <th style={{ width: "25%" }} />
                                            <th style={{ width: "10%" }}>
                                                <Label>{this.getHours(2)}</Label>
                                            </th>
                                            <th style={{ width: "10%" }}>
                                                <Label>{this.getHours(3)}</Label>
                                            </th>
                                            <th style={{ width: "10%" }}>
                                                <Label>{this.getHours(4)}</Label>
                                            </th>
                                            <th style={{ width: "10%" }}>
                                                <Label>{this.getHours(5)}</Label>
                                            </th>
                                            <th style={{ width: "10%" }}>
                                                <Label>{this.getHours(6)}</Label>
                                            </th>
                                            <th style={{ width: "10%" }}>
                                                <Label>{this.getHours(7)}</Label>
                                            </th>
                                            <th style={{ width: "10%" }}>
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
                                                        <td>
                                                            <TimePicker value={this.getDayHours(2, row)}
                                                                format={format}
                                                                defaultOpenValue={moment('08:00', format)}
                                                                ref={el => this.TPRefs.set((index * 10 + 0), el)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 0, row, (index * 10 + 0)) }}
                                                                addon={() => (
                                                                    <Button size="small" type="primary"
                                                                        onClick={() => this.closeTP((index * 10 + 0))}
                                                                    >
                                                                        Ok
                                                                    </Button>
                                                                )}
                                                            />
                                                        </td>
                                                        <td colspan={6}>
                                                        </td>
                                                    </tr>
                                                ) : (

                                                    <tr key={index}>
                                                        <td style={styles.link}>
                                                            <Dropdown overlay={this.getMenu(row)} trigger={['click']}>
                                                                <i className="fa fa-tasks fa-fw" />
                                                            </Dropdown>
                                                        </td>
                                                        <td>{row.task_description}</td>
                                                        <td>
                                                            <TimePicker value={this.getDayHours(2, row)}
                                                                format={format}
                                                                //open={this.state.openM}
                                                                //onOpenChange={() => this.setState({ openM: true })}
                                                                defaultOpenValue={moment('08:00', format)}
                                                                ref={el => this.TPRefs.set((index * 10 + 0), el)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 0, row, (index * 10 + 0)) }}
                                                                addon={() => (
                                                                    <Button size="small" type="primary"
                                                                        onClick={() => this.closeTP((index * 10 + 0))}
                                                                    >
                                                                        Ok
                                                                    </Button>
                                                                )}
                                                            />
                                                        </td>
                                                        <td>
                                                            <TimePicker value={this.getDayHours(3, row)} format={format}
                                                                ref={el => this.TPRefs.set((index * 10 + 1), el)}
                                                                defaultOpenValue={moment('08:00', format)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 1, row, (index * 10 + 1)) }}
                                                                addon={() => (
                                                                    <Button size="small" type="primary" style={{}}
                                                                        onClick={() => this.closeTP((index * 10 + 1))}
                                                                    >
                                                                        Ok
                                                                    </Button>
                                                                )}
                                                            />
                                                        </td>
                                                        <td>
                                                            <TimePicker value={this.getDayHours(4, row)} format={format}
                                                                ref={el => this.TPRefs.set((index * 10 + 2), el)}
                                                                defaultOpenValue={moment('08:00', format)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 2, row, (index * 10 + 2)) }}
                                                                addon={() => (
                                                                    <Button size="small" type="primary" style={{}}
                                                                        onClick={() => this.closeTP((index * 10 + 2))}
                                                                    >
                                                                        Ok
                                                                    </Button>
                                                                )}
                                                            />
                                                        </td>
                                                        <td>
                                                            <TimePicker value={this.getDayHours(5, row)} format={format}
                                                                ref={el => this.TPRefs.set((index * 10 + 3), el)}
                                                                defaultOpenValue={moment('08:00', format)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 3, row, (index * 10 + 3)) }}
                                                                addon={() => (
                                                                    <Button size="small" type="primary" style={{}}
                                                                        onClick={() => this.closeTP((index * 10 + 3))}
                                                                    >
                                                                        Ok
                                                                    </Button>
                                                                )}
                                                            />
                                                        </td>
                                                        <td>
                                                            <TimePicker value={this.getDayHours(6, row)} format={format}
                                                                ref={el => this.TPRefs.set((index * 10 + 4), el)}
                                                                defaultOpenValue={moment('08:00', format)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 4, row, (index * 10 + 4)) }}
                                                                addon={() => (
                                                                    <Button size="small" type="primary" style={{}}
                                                                        onClick={() => this.closeTP((index * 10 + 4))}
                                                                    >
                                                                        Ok
                                                                    </Button>
                                                                )}
                                                            />
                                                        </td>
                                                        <td>
                                                            <TimePicker value={this.getDayHours(7, row)} format={format}
                                                                ref={el => this.TPRefs.set((index * 10 + 5), el)}
                                                                defaultOpenValue={moment('08:00', format)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 5, row, (index * 10 + 5)) }}
                                                                addon={() => (
                                                                    <Button size="small" type="primary" style={{}}
                                                                        onClick={() => this.closeTP((index * 10 + 5))}
                                                                    >
                                                                        Ok
                                                                    </Button>
                                                                )}
                                                            />
                                                        </td>
                                                        <td>
                                                            <TimePicker value={this.getDayHours(1, row)} format={format}
                                                                ref={el => this.TPRefs.set((index * 10 + 6), el)}
                                                                defaultOpenValue={moment('08:00', format)}
                                                                onChange={(e) => { this.saveHours(e, this.props.startDT, 6, row, (index * 10 + 6)) }}
                                                                addon={() => (
                                                                    <Button size="small" type="primary" style={{}}
                                                                        onClick={() => this.closeTP((index * 10 + 6))}
                                                                    >
                                                                        Ok
                                                                    </Button>
                                                                )}
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
                    <Modal isOpen={this.state.modal} autoFocus={false} size="md">
                        <ModalHeader toggle={this.toggle}>{this.state.headerDesc}</ModalHeader>
                        <ModalBody>
                            <Container fluid>
                                <Form onSubmit={this.handleSubmit}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="Change Order"
                                        hasFeedback
                                        colon
                                    >
                                        {getFieldDecorator('changeOrder', {
                                            initialValue: this.state.changeOrderID,
                                            rules: [
                                                { required: true, message: 'Please select a Change Order!' },
                                            ],
                                        })(
                                            <Select placeholder="Please select change order">
                                                {(this.state.changeOrders || []).map((order, index) => (
                                                    <Option key={order.change_order_id} value={order.change_order_id}>{order.change_order_desc}</Option>
                                                ))}
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="Task Name">
                                        {getFieldDecorator('taskName', {
                                            initialValue: this.state.taskName,
                                            rules: [{
                                                required: true,
                                                message: 'Please input task name',
                                            }],
                                        })(
                                            <Input placeholder="Please input task name" size="small" />
                                        )}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="Task Description">
                                        {getFieldDecorator('taskDesc', {
                                            initialValue: this.state.taskDesc,
                                            rules: [{
                                                required: true,
                                                message: 'Please input task description',
                                            }],
                                        })(
                                            <Input placeholder="Please input task description" size="small" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="Task Start Date"
                                        colon
                                    >
                                        {getFieldDecorator('taskStartDate', {
                                            initialValue: this.state.startDate,
                                            //getValueFromEvent: this.handleStartEvent,                                     
                                            rules: [{
                                                required: true,
                                                message: 'Please select task start date',
                                            }],
                                        })(
                                            <DatePicker format={"YYYY-MM-DD"}
                                            />

                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="Task End Date"
                                        colon
                                    >
                                        {getFieldDecorator('taskEndDate', {
                                            initialValue: this.state.endDate,
                                            //getValueFromEvent: this.handleEndEvent,
                                            rules: [{
                                                required: true,
                                                message: 'Please select task end date',
                                            }],
                                        })(
                                            <DatePicker format={"YYYY-MM-DD"}
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="Task Status"
                                        hasFeedback
                                        colon
                                    >
                                        {getFieldDecorator('taskStatus', {
                                            initialValue: this.state.taskStatusID,
                                            rules: [
                                                { required: true, message: 'Please select Task Status!' },
                                            ],
                                        })(
                                            <Select placeholder="Please select Task Status">
                                                {(this.state.taskStatusDesc || []).map((status, index) => (
                                                    <Option key={status.task_status_id} value={status.task_status_id}> {status.task_status_desc}</Option>
                                                ))}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Form>
                            </Container>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="primary" onClick={this.handleSubmit}>
                                Save
                            </Button>{" "}
                            <Button type="secondary" onClick={this.toggle}>
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

const WrappedWorkplan = Form.create()(WorkPlan)
export default connect(mapStateToProps, mapDispatchToProps)(WrappedWorkplan);
