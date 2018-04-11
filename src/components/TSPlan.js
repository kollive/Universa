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
import { types as tsplanTypes } from "../reducers/tsplanreducer";
import { actions as tsplanActions } from "../reducers/tsplanreducer";
//import Timesheet from './Timesheet/Timesheet'
import * as _ from "lodash";
//import {html2canvas, jsPDF} from 'app/ext';
import html2canvas from "html2canvas"
import * as jsPDF from 'jspdf'
import "../App.css";
import { DatePicker, TimePicker } from 'antd';
import {
    Form, Select, InputNumber, Switch, Radio, Table, Spin,
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
    Row,
    Col,
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


const formatDate = (dt) => {
    let d = new Date(dt);
    //d.setDate(d.getDate() + 1);
    return d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2); //d.getHours() d.getMinutes()
}

//dayName                        monthDay                                                      taskDt 
const columns = [{
    title: 'Task ID',
    dataIndex: 'task_id',
    key: 'dayName',
    width: '5%'
}, {
    title: 'Task Title',
    dataIndex: 'task_description',
    key: 'task_description',
    width: '15%'
},
{
    title: 'Mon',
    dataIndex: 'monHrs',
    key: 'monHrs',
    width: '10%',
    render: (text, record, index) => {
        /*
       const obj = {
           children: text,
           props : {}
       }      
       if(index === 1){
           obj.props.colSpan = 0;
       }
        return obj;
       */
      return secondsToHHMM(text);
    },
},
{
    title: 'Tue',
    dataIndex: 'tueHrs',
    key: 'tueHrs',
    width: '10%',
    render: (text, record, index) => {
        return secondsToHHMM(text);
        /*
        let dt = new Date(record.task_date);
        if (dt.getDay() == 2) {
            return record.num_hours
        } else {
            return "00.00"
        }
        */
    },
},
{
    title: 'Wed',
    dataIndex: 'wedHrs',
    key: 'wedHrs',
    width: '10%',
    render: (text, record, index) => {
        return secondsToHHMM(text);
    },
},
{
    title: 'Thu',
    dataIndex: 'thuHrs',
    key: 'thuHrs',
    width: '10%',
    render: (text, record, index) => {
        return secondsToHHMM(text);
    },
},
{
    title: 'Fri',
    dataIndex: 'friHrs',
    key: 'friHrs',
    width: '10%',
    render: (text, record, index) => {
        return secondsToHHMM(text);
    },
},
{
    title: 'Sat',
    dataIndex: 'satHrs',
    key: 'satHrs',
    width: '10%',
    render: (text, record, index) => {
        return secondsToHHMM(text);
    },
},
{
    title: 'Sun',
    dataIndex: 'sunHrs',
    key: 'sunHrs',
    width: '10%',
    render: (text, record, index) => {
        return secondsToHHMM(text);
    },
},
{
    title: 'Total',
    dataIndex: 'totHrs',
    key: 'totHrs',
    width: '10%',
    render: (text, record, index) => {
        return secondsToHHMM(text);
    },
},
];

const sumWeeklyHours = (WeekData) => {
    const sumHrs = WeekData.reduce((sum, week) => {
        return sum + week.totHrs
    },0)
    return sumHrs;
}

class TSPlan extends Component {
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
            type: tsplanTypes.FETCH_TABLES_REQUEST,
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
                const pdf = new jsPDF();


                pdf.addImage(imgData, 'JPEG', 0, 0, 212, 300);

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
                type: tsplanTypes.FETCH_TABLES_REQUEST,
                payload: {
                    staffID: (nextProps.hv_staff_id == "" ? "10" : nextProps.hv_staff_id),
                    //staffID: "10",
                    month: "march"
                }
            });
        } else {
            this.setState({ loading: false });
        }

        if (nextProps.TSPlanState) {
            this.setState({ items: nextProps.TSPlanState.items[0] });
        }
    }

    componentDidMount() {
        debugger;
        this.setState({ loading: true });
        this.props.getMonthlyTS({
            type: tsplanTypes.FETCH_TABLES_REQUEST,
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

        let Items = _.filter(this.state.items, function (itm) {
            debugger;

            let d = new Date(itm.WeekStart);
            d.setDate(d.getDate() + 1);
            let d1 = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2); //d.getHours() 

            d = new Date(WeekStart);
            d.setDate(d.getDate() + 1);
            let d2 = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2); //d.getHours() 

            let seconds = hhmmToSeconds(itm.num_hours)
            /*
            let td = new Date(itm.task_date);
            td.setDate(td.getDate() + 1);
            let ts = td.getFullYear() + "-" + ('0' + (td.getMonth() + 1)).slice(-2) + "-" + ('0' + (td.getDate())).slice(-2); //d.getHours() 
            */
            /*
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

                    sumHours += hrs;
                    sumMins += mins;
                }
            }
            */
            //alert(ts)
            //return secondsToHHMM(hhmmToSeconds(hrs + ":" + mins));
            //loading={<Spin spinning={this.state.loading} />}
            return (d1 == d2 && (seconds > 0))
        });

        const taskId = _.uniqBy(Items, "task_id");
        let planData = [];
        console.log(WeekStart)
        console.log("taskID")
        console.log(taskId)

        taskId.map((task,idx) => {
            const planItems = _.filter(Items, (itm) => {
                return Number(task.task_id) == Number(itm.task_id)
            })

            console.log("PlanItems")
            console.log(planItems)

            let planObj = {}
            planObj.rowNum = idx;
            planObj.task_id = task.task_id;
            planObj.task_description = planItems[0].task_description;

            console.log("")
            const monHrs = planItems.reduce((total, itm) => {
                debugger;
                let dt = new Date(itm.task_date);
                dt.setDate(dt.getDate() + 1);
                return (dt.getDay() != 1) ? total : total + hhmmToSeconds(itm.num_hours);               
            },0)

            planObj.monHrs = monHrs;
            //alert("monHrs")
            //alert(monHrs);
            //alert(planObj.monHrs);

            planObj.tueHrs = planItems.reduce((total, itm) => {
                let dt = new Date(itm.task_date);
                dt.setDate(dt.getDate() + 1);
                return (dt.getDay() != 2) ? total : total + hhmmToSeconds(itm.num_hours);               
            },0)

            planObj.wedHrs = planItems.reduce((total, itm) => {
                let dt = new Date(itm.task_date);
                dt.setDate(dt.getDate() + 1);
                return (dt.getDay() != 3) ? total : total + hhmmToSeconds(itm.num_hours);               
            },0)

            planObj.thuHrs = planItems.reduce((total, itm) => {
                let dt = new Date(itm.task_date);
                dt.setDate(dt.getDate() + 1);
                return (dt.getDay() != 4) ? total : total + hhmmToSeconds(itm.num_hours);               
            },0)

            planObj.friHrs = planItems.reduce((total, itm) => {
                let dt = new Date(itm.task_date);
                dt.setDate(dt.getDate() + 1);
                return (dt.getDay() != 5) ? total : total + hhmmToSeconds(itm.num_hours);               
            },0)

            planObj.satHrs = planItems.reduce((total, itm) => {
                let dt = new Date(itm.task_date);
                dt.setDate(dt.getDate() + 1);
                return (dt.getDay() != 6) ? total : total + hhmmToSeconds(itm.num_hours);               
            },0)

            planObj.sunHrs = planItems.reduce((total, itm) => {
                let dt = new Date(itm.task_date);
                dt.setDate(dt.getDate() + 1);
                return (dt.getDay() != 0) ? total : total + hhmmToSeconds(itm.num_hours);               
            },0)

           planObj.totHrs = Number(planObj.monHrs) +
           Number(planObj.tueHrs) +
           Number(planObj.wedHrs) +
           Number(planObj.thuHrs) +
           Number(planObj.friHrs) +
           Number(planObj.satHrs) +
           Number(planObj.sunHrs);
           
           //console.log("PlanObj")
           //console.log(planObj)
           planData.push(planObj)
        });

        debugger;
        return (

            <div style={{ width: "100%", display: "inline-block", border: "none" }}>
                <Table pagination={false} rowKey={record => record.rowNum} dataSource={planData} columns={columns} size="small"
                    rowClassName={"m-1 p-1"}
                    //rowClassName={(record, index) => record.totalHours == null ? 'err' : 'm-1 p-1'}
                    title={() => <span className="font-weight-bold">Week ({formatDate(WeekStart)} to {formatDate(addDays(WeekStart, 6))} )</span>}
                    footer={() => <div className="float-right">Weekly Total: {secondsToHHMM(sumWeeklyHours(planData))}</div>}
                ></Table>
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
        TSPlanState: state.TSPlanState,
        CommonState: state.CommonState
    };
};

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(
        {
            ...tsplanActions
        },
        dispatch
    )
});



export default connect(mapStateToProps, mapDispatchToProps)(TSPlan);
