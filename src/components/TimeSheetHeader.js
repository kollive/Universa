import React, { Component } from "react";
import cadetlogo from "../images/Universe.png";
import cadettitle from "../images/UTitle.png";
import "../App.css";
import { actions as headerActions } from "../reducers/cdheaderreducer";
import { types as headertypes } from "../reducers/cdheaderreducer";
import { Container, Row, Col, Alert } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import Avatar from "material-ui/Avatar";
import Toggle from 'material-ui/Toggle';
//import DatePicker from 'react-datepicker';
import moment from 'moment'
//import DatePicker from 'react-date-picker';
//import { Button } from 'reactstrap';
//import 'react-datepicker/dist/react-datepicker.css'
import { DatePicker, TimePicker, Button, Icon } from 'antd';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
 import * as _ from "lodash";

class TimeSheetHeader extends React.Component {

    constructor(props) {
        super(props);

        this.items = [];

        this.state = {
            staffItem:'',
            StaffList:[],
            selectedStaffID:'',
            weekOrDay: true,
            isOpen: false,
            startDate: moment(),
            items: [
                {
                    user: "",
                    img: ""
                }
            ],
            locationinfo: "3201 Oak Hill Drive, Laurel, Maryland 20724"
        };
        this.handleChange = this.handleChange.bind(this);
        this.moveWeek = this.moveWeek.bind(this);
        this.toggle = this.toggle.bind(this);
        //this.renderTimesheet;

    }

    componentDidMount() {
     this.props.getStaffDetails({
      type: headertypes.GET_STAFF_DETAILS,
      payload: [{hv_staff_id : (!this.props.staffID=='')?this.props.staffID:0},{ function_Id: '66' }]
      });
    }
    componentDidUpdate(prevProps, prevState) {
        debugger;
        console.log("componentDidUpdate");
       // console.log(this.state.items[0].user);
    }
    componentWillReceiveProps(nextProps) {
        debugger;
        this.state.items = nextProps.headerState.items;
        if(nextProps.headerState.items!==undefined)
        {
        var self = this;
        let findID = _.find(nextProps.headerState.items,
         function (o) {return (o.hv_staff_id==self.props.staffID)});
                                        
                                        // ['hv_staff_id', this.props.staffID])
        if(findID!==undefined)
        {
        this.setState({ staffItem: findID  });
        }
        }
    }

    handleChange = (date) => {
        debugger
        
        this.setState({
            startDate: date
        })
       
    }

    toggle = () => {
        //alert(this.state.isOpen)         
        this.DP.setOpen(!this.state.isOpen);
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    setDayOrWeek = (val) => {
        this.setState({ weekOrDay: val })
        let mode = (val ? "W" : "D");
        this.props.callParentMode(mode);
    }

    moveWeek = (tmpDay) => {
        //return;
        //debugger;
        let newDate = null;
        if (tmpDay == "P") {
            newDate = new Date(this.state.startDate);
            if (this.state.weekOrDay) {
                newDate.setDate(newDate.getDate() - 7);
            } else {
                newDate.setDate(newDate.getDate() - 1);
            }
            this.setState({
                startDate: moment(newDate)
            })
            //this.showWeek();
        } else {
            newDate = new Date(this.state.startDate);
            //newDate.setDate(newDate.getDate() + 7);
            if (this.state.weekOrDay) {
                newDate.setDate(newDate.getDate() + 7);
            } else {
                newDate.setDate(newDate.getDate() + 1);
            }
            this.setState({
                startDate: moment(newDate)
            })
            //this.showWeek();
        }

    }

    showWeekOrDay = () => {
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        //debugger;
        let dt = new Date(this.state.startDate);
        let currentWeekDay = dt.getDay();
        var lessDays, wkStart, wkEnd;

        if (this.state.weekOrDay) {//Week
            lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
            wkStart = new Date(new Date(dt).setDate(dt.getDate() - lessDays));
            wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
        } else {
            wkStart = new Date(new Date(dt).setDate(dt.getDate()));
            wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate()));
        }
        this.props.callParentDates(wkStart, wkEnd)
        /*
        this.setState({
            wkStartDate : wkStart,
            wkEndDate : wkEnd,
        })
        */
        return (monthNames[wkStart.getMonth()] + " " + wkStart.getDate() + " - " + monthNames[wkEnd.getMonth()] + " " + wkEnd.getDate())
    }

    componentWillMount = () => {
        //debugger;  HH:mm A
    };
    onStaffListChange = (e) => {
        this.setState({ staffItem: e.value });
        this.setState({ selectedStaffID: e.value.hv_staff_id });
        this.props.callParentStaffID(e.value.hv_staff_id)
    }
    render() {
        debugger;
        // const renderTimesheet=<Timesheet headerState={this.state}/>
        // this.renderTimesheet=<Timesheet headerState={this.state}/>
                        //alert(this.props.headerState.items)
                        //<h3 className="d-inline align-middle">Timesheet</h3> <br />
{this.state.staffItem}
        return (
            <div className="m-2 p-2">
                <Row>
                    <Col sm="1">
                        <h6 className="d-inline align-middle">Timesheet</h6> <br />
                    
                </Col>
                    <Col sm="3">
                        <div>
                            
                             <Dropdown value={this.state.staffItem} options={this.props.headerState.items} optionLabel="hv_staff_name"  onChange={this.onStaffListChange} style={{ width: "80%", fontSize: '12px' }}
                          required
                          placeholder="Select Program" id="ddlProgram" />
                        </div>
                    </Col>
                    <Col sm="3">
                        <div className="d-sm-inline-flex">

                            <DatePicker ref={(r) => { this.DP = r }} value={this.state.startDate} onChange={this.handleChange} format={"YYYY-MM-DD"}
                            />

                        </div>
                    </Col>
                    <Col sm="3">
                        <span style={{ border: "1px" }}>
                            <Button onClick={() => this.moveWeek("P")}><Icon type="caret-left" style={{ cursor: "pointer" }} /></Button>
                            {"  " + this.showWeekOrDay() + "  "}
                            <Button onClick={() => this.moveWeek("N")}><Icon type="caret-right" style={{ cursor: "pointer" }} /></Button>
                        </span>
                    </Col>
                    <Col sm="2">
                        <div className="d-sm-inline-flex">Day<Toggle defaultToggled={true} ref={(r) => { this.togCtl = r }} style={{ width: "50px" }} onToggle={(e, val) => { this.setDayOrWeek(val) }} />Week</div>
                    </Col>
                </Row>
                <Row>
                </Row>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        headerState: state.headerState
    };
};

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(
        {
            ...headerActions
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(TimeSheetHeader);
