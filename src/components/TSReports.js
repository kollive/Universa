import React, { Component } from "react";
import { connect } from "react-redux";

import Badge from "material-ui/Badge";
import IconButton from "material-ui/IconButton";
import Paper from "material-ui/Paper";
import Divider from "material-ui/Divider";
import NotificationsIcon from "material-ui/svg-icons/social/notifications";
import export_excel from "../images/export_excel.PNG";
import chart from "../images/chart.PNG";

import { bindActionCreators } from "redux";
import { types as tsreportsTypes } from "../reducers/tsreportreducer";
import { actions as tsreportsActions } from "../reducers/tsreportreducer";
//import Timesheet from './Timesheet/Timesheet'
import * as _ from "lodash";
//import {html2canvas, jsPDF} from 'app/ext';
import html2canvas from "html2canvas"
import * as jsPDF from 'jspdf'
import "../App.css";
import { DatePicker, TimePicker } from 'antd';
import {
    Form, Select, InputNumber, Switch, Radio, Table, Spin, Row,
    Col,
    Slider, Button, Upload, Icon, Rate, Menu, Dropdown, message, Popconfirm
} from 'antd';
import moment from 'moment';



import {
    Container,
    TabContent,
    TabPane,
    Card,
    Table as RTable,
    Collapse,
    CardBody,
    //Button,
    CardTitle,
    CardText,
    DropdownToggle
} from "reactstrap";

const paperStyle = {
    height: "130px",
    width: "90%",
    display: "flex"
};
const styles = {
    link: {
        cursor: "pointer"
    },
    err: {
        backgroundColor: "red"
    }

};

const addDays = (dt, days) => {
    let d = new Date(dt);
    d.setDate(d.getDate() + days);
    return d;
}
const hhmmToSeconds = (str) => {
    let arr = str.split(':').map(Number);
    return (arr[0] * 3600) + (arr[1] * 60);
};

const secondsToHHMM = (seconds) => {
    let hours = parseInt(seconds / 3600, 10),
        minutes = parseInt((seconds / 60) % 60, 10);
    //seconds = parseInt(seconds % 3600 % 60, 10);

    return [hours, minutes].map(function (i) { return i.toString().length === 2 ? i : '0' + i; }).join(':');
}

const rowColor = (record) => {
    let d = new Date(record.taskDt);
    d.setDate(d.getDate() + 1);

    if (d.getDay() != 6 && d.getDay() != 0) {
        return record.totalHours == null ? 'err' : 'm-1 p-1'
    } else {
        //return record.totalHours == null ? 'err' : 'm-1 p-1'
        return "m-1 p-1"
    }
}


const formatDate = (dt) => {
    let d = new Date(dt);
    //d.setDate(d.getDate() + 1);
    return d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2); //d.getHours() d.getMinutes()
}

//dayName                        monthDay                                                      taskDt
const columns = [{
    title: 'Name',
    dataIndex: 'dayName',
    key: 'dayName',
    width: '10%'
}, {
    title: 'Day',
    dataIndex: 'monthDay',
    key: 'monthDay',
    width: '10%'
},
/*
, {
    title: 'Date',
    dataIndex: 'taskDt',
    key: 'taskDt',
    width: '10%',
    render: dt => `${moment(new Date(dt)).format("YYYY-MM-DD")}`,
    //render: name => `${name.first} ${name.last}`,
    //start_time       lunch_start      lunch_end        end_time
},
*/
{
    title: 'Clock In',
    dataIndex: 'start_time',
    key: 'start_time',
    width: '10%',
    render: tm => `${moment.utc(tm).format("HH:mm A")}`,
},
{
    title: 'Lunch In',
    dataIndex: 'lunch_start',
    key: 'lunch_start',
    width: '10%',
    render: tm => `${moment.utc(tm).format("HH:mm A")}`,
},
{
    title: 'Lunch Out',
    dataIndex: 'lunch_end',
    key: 'lunch_end',
    width: '10%',
    render: tm => `${moment.utc(tm).format("HH:mm A")}`,
},
{
    title: 'Clock Out',
    dataIndex: 'end_time',
    key: 'end_time',
    width: '10%',
    render: tm => `${moment.utc(tm).format("HH:mm A")}`,
},
{
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    width: '10%',
    render: (text, record) => {

        if (record.totalHours == null || record.lunchHours == null) {
            return "00:00"
        }
        let time = record.totalHours.split(":");

        let totHrs = _.parseInt(time[0]);
        let totMins = _.parseInt(time[1]);

        time = record.lunchHours.split(":");

        let lunHrs = _.parseInt(time[0]);
        let lunMins = _.parseInt(time[1]);

        let hrs = totHrs - lunHrs;
        let mins = totMins - lunMins;

        //alert(hours)
        return secondsToHHMM(hhmmToSeconds(hrs + ":" + mins));
    },
},
{
    title: 'C# 9450016',
    dataIndex: 'total4016',
    key: 'total4016',
    width: '9%'
},
{
    title: 'C# 9854086',
    dataIndex: 'total4086',
    key: 'total4086',
    width: '9%'
},
];


class TSReports extends Component {
    constructor(props) {
        super(props);
        //alert(this.props.hv_staff_id);

        this.state = {
            staff_id: (this.props.hv_staff_id == "" ? this.props.CommonState.hv_staff_id : this.props.hv_staff_id),
            notifycollapse: true,
            indicatorscollapse: true,
            showApprovals: false,
            showHome: true,
            searchCadet: true,
            staffID: "",
            startDT: null,
            endDT: null,
            mode: "W",
            name: "",
            items: [],
            month: "March",
            loading: false,
            hv_staff_id: (this.props.hv_staff_id == "" ? this.props.CommonState.hv_staff_id : this.props.hv_staff_id)
        };
        // this.onClickAction = this.onClickAction.bind(this);
        this.setDate = this.setDate.bind(this);
        this.setMode = this.setMode.bind(this);
        this.parentStaffID = this.parentStaffID.bind(this);
        this.printDocument = this.printDocument.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
        this.getMenu = this.getMenu.bind(this);
        //this.secondsToHHMM = this.secondsToHHMM.bind(this);

        this.getStaffID();
    }


    onMenuClick = (itm, row) => {
        //debugger;
        //alert(row.task_id)
        //message.info(`Click on item ${itm.key}`);
        //if (itm.key == 0) {
        //    this.editTask(row);
        //}
        this.setState({ month: itm.key });
        this.setState({ loading: true });

        this.props.getMonthlyTS({
            type: tsreportsTypes.FETCH_TABLES_REQUEST,
            payload: {
                //staffID: (this.props.staffID == "" ? this.props.CommonState.hv_staff_id : this.props.staffID),
                staffID: (this.props.hv_staff_id == "" ? this.props.CommonState.hv_staff_id : this.props.hv_staff_id),
                month: itm.key
            }
        });

    };

    getMenu = () => {
        //alert(row.task_id)
        const menu = (
            <Menu style={{ width: 200 }} onClick={(key) => this.onMenuClick(key)}>
                <Menu.Item key="January">January</Menu.Item>
                <Menu.Item key="February">February</Menu.Item>
                <Menu.Item key="March">March</Menu.Item>
                <Menu.Item key="April">April</Menu.Item>
                <Menu.Item key="May">May</Menu.Item>
                <Menu.Item key="June">June</Menu.Item>
                <Menu.Item key="July">July</Menu.Item>
                <Menu.Item key="August">August</Menu.Item>
                <Menu.Item key="September">September</Menu.Item>
                <Menu.Item key="October">October</Menu.Item>
                <Menu.Item key="November">November</Menu.Item>
                <Menu.Item key="December">December</Menu.Item>
            </Menu>
        );

        return menu;
    }



    printDocument = () => {
        debugger;
        let input = document.getElementById('divTimeSheet');
        //input.parentElement.style.width = '10000px';
        var styleOrig = input.getAttribute("style");

        html2canvas(input).
            then((canvas) => {
                debugger;

                var ctx = canvas.getContext('2d');

                var imgData = canvas.toDataURL("image/png", 1);
                //const pdf = new jsPDF('p', 'pt', 'a4');
                const pdf = new jsPDF('p','pt','a4',true)
  pdf.addImage(imgData, 'PNG', 0, 0, 0,270,'','FAST');

              //  pdf.addImage(imgData, 'JPEG', 0, 0, 212, 300);

                pdf.save("download.pdf");
                input.setAttribute("style", styleOrig);

            });
    }


    getStaffID = () => {
        //alert("in Getstaff")
        let userid;
    }

    componentWillMount = () => {
        //debugger;

    }

    componentWillReceiveProps(nextProps) {
        debugger;
        //alert(nextProps.hv_staff_id)
        //alert(this.props.hv_staff_id)
        if (this.props.hv_staff_id != nextProps.hv_staff_id) {
            //this.setState({spinning:true});

            this.props.getMonthlyTS({
                type: tsreportsTypes.FETCH_TABLES_REQUEST,
                payload: {
                    staffID: (nextProps.hv_staff_id == "" ? "10" : nextProps.hv_staff_id),
                    //staffID: "10",
                    month: "march"
                }
            });
        } else {
            this.setState({ loading: false });
        }

        if (nextProps.TSRptState) {
            this.setState({ items: nextProps.TSRptState.items[0] });
        }
    }

    componentDidMount() {
        debugger;
        this.setState({ loading: true });
        this.props.getMonthlyTS({
            type: tsreportsTypes.FETCH_TABLES_REQUEST,
            payload: {
                staffID: (this.props.hv_staff_id == "" ? "10" : this.props.hv_staff_id),
                //staffID: "10",
                month: "march"
            }
        });

    }

    setDate(startDT, endDT) {
        debugger;
        //alert(this.state.hv_staff_id);
        this.setState({
            startDT: startDT,
            endDT: endDT,
        });

    }

    setMode(mode) {
        debugger;
        //alert(this.state.hv_staff_id);
        this.setState({
            mode: mode
        });

    }

    parentStaffID(staffID) {
        //alert("staff")
        //alert(staffID)
        this.setState({
            staff_id: staffID
        });
    }

    renderWeek = (WeekStart) => {

        let sumHours = 0;
        let sumMins = 0;

        let c945Hours = 0;
        let c945Mins = 0;
        let c985Hours = 0;
        let c985Mins = 0;

        let Items = _.filter(this.state.items, function (itm) {
            debugger;

            let d = new Date(itm.WeekStart);
            d.setDate(d.getDate() + 1);
            let d1 = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2); //d.getHours()

            d = new Date(WeekStart);
            d.setDate(d.getDate() + 1);
            let d2 = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2); //d.getHours()


            if (d1 == d2) {
                let totalHours = itm.totalHours;
                let lunchHours = itm.lunchHours;

                if (totalHours == null || lunchHours == null) {

                } else {
                    if (totalHours == null) {
                        totalHours = "00:00"
                    }
                    if (lunchHours == null) {
                        lunchHours = "00:00"
                    }
                    let time = totalHours.split(":");

                    let totHrs = _.parseInt(time[0]);
                    let totMins = _.parseInt(time[1]);

                    time = lunchHours.split(":");

                    let lunHrs = _.parseInt(time[0]);
                    let lunMins = _.parseInt(time[1]);

                    let hrs = totHrs - lunHrs;
                    let mins = totMins - lunMins;

                    if (itm.contract_no == "9854086") {
                        c985Hours += hrs;
                        c985Mins += mins;
                    } else {
                        c945Hours += hrs;
                        c945Mins += mins;
                    }
                    sumHours += hrs;
                    sumMins += mins;
                }
            }
            //alert(hours)
            //return secondsToHHMM(hhmmToSeconds(hrs + ":" + mins));
            //loading={<Spin spinning={this.state.loading} />}
            //footer={() => <div className="float-right"><span>Total: {secondsToHHMM(hhmmToSeconds(sumHours + ":" + sumMins))}</span><span>{secondsToHHMM(hhmmToSeconds(c945Hours + ":" + c945Mins))}</span><span>{secondsToHHMM(hhmmToSeconds(c985Hours + ":" + c985Mins))}</span></div>}
            return (d1 == d2)
        });


        debugger;
        return (
            <div>
                <Row style={{ width: "100%", display: "inline-block", border: "none" }}>
                    <Col span={24}>
                        <Table pagination={false} rowKey={record => record.rowNum} dataSource={Items} columns={columns} size="small"
                            rowClassName={(record, index) => rowColor(record)}
                            title={() => <span className="font-weight-bold">Week ({formatDate(WeekStart)} to {formatDate(addDays(WeekStart, 6))} )</span>}
                            footer={() => <div><Row><Col span={14}>{' '}</Col><Col span={2}>Weekly Total:</Col><Col span={4} push={1}>{secondsToHHMM(hhmmToSeconds(sumHours + ":" + sumMins))}</Col><Col span={2}>{secondsToHHMM(hhmmToSeconds(c945Hours + ":" + c945Mins))}</Col><Col span={2}>{secondsToHHMM(hhmmToSeconds(c985Hours + ":" + c985Mins))}</Col></Row></div>
                            }
                        ></Table>
                    </Col>
                </Row>
            </div>
        );
    }


    render() {


        return (
            <div>
                <Container fluid>
                    <div style={{ marginTop: 8, marginLeft: 10 }}>
                        <span style={{ marginRight: 16, fontWeight: "bold" }}>Please select month:</span>
                        <Dropdown overlay={this.getMenu()} trigger={['click']}>
                            <span>{this.state.month}  <Icon type="down" /></span>
                        </Dropdown>
                        <Button onClick={this.printDocument} className="float-right">Print</Button>
                    </div>
                    <div id="divTimeSheet" style={{ width: "100%", display: "inline-block" }}>
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
                                //maxHeight: "500px",
                                //minHeight: "500px",
                                height: "auto",
                                overflowX: "hidden",
                                overflowY: "scroll",
                                //border: "1px solid grey"
                                //marginTop: "-240px"
                                //marginTop:(this.state.pageOfItems.length == 0 ? "-60px" :
                                //(this.state.pageOfItems.length >= 7)? "-240px" : (-1 * this.state.pageOfItems.length * 40) + "px")
                                //onClick={() => this.showDetails(row)}
                            }}
                        >
                            <RTable size="md">
                                <tbody>
                                    {_.uniqBy(this.state.items, "WeekStart").map(
                                        (row, index) => (
                                            <tr key={index}>
                                                <td size="12">
                                                    {this.renderWeek(row.WeekStart)}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </RTable>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        TSRptState: state.TSRptState,
        CommonState: state.CommonState
    };
};

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(
        {
            ...tsreportsActions
        },
        dispatch
    )
});



export default connect(mapStateToProps, mapDispatchToProps)(TSReports);
