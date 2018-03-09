import React, { Component } from "react";
import cadetlogo from "images/Universe.png";
import cadettitle from "images/UTitle.png";
import "App.css";
import { actions as headerActions } from "reducers/cdheaderreducer";
import { types as headertypes } from "reducers/cdheaderreducer";
import { Container, Row, Col, Alert } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import Avatar from "material-ui/Avatar";
import Toggle from 'material-ui/Toggle';
import DatePicker from 'react-datepicker';
import moment from 'moment'
//import DatePicker from 'react-date-picker';
import { Button } from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css'

class TimeSheetHeader extends React.Component {
    constructor(props) {
        super(props);

        this.items = [];

        this.state = {
            weekOrDay:true,
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
    }

    componentDidMount() {
        //debugger;
        //alert(this.props.location.state.params.hv_table_i)
        //alert(this.props.name)
        /*
        this.props.renderHeader({
            type: headerActions.renderHeader,
            loadheader: {
                userid: "sv"
            }
        });
        */
    }
    componentDidUpdate(prevProps, prevState) {
        //debugger;
        console.log("componentDidUpdate");
        console.log(this.state.items[0].user);
    }
    componentWillReceiveProps(nextProps) {
        //debugger;
        this.state.items = nextProps.headerState.items;
    }

    handleChange = (date) => {

        //console.log(wkStart)
        //console.log(wkEnd)
        //this.focus = !this.focus;
        //alert(this.state.isOpen)    
        /* 
        this.DP.setOpen(!this.state.isOpen);
        
        */
        //let d1 = new Date(date);
        //let d2 = new Date(this.state.startDate);

        //if(d1 != d2) {    
        /*         
        this.DP.setOpen(!this.state.isOpen);
        this.setState({
            isOpen: !this.state.isOpen
        })*/
        this.setState({
            isOpen: !this.state.isOpen
        })
        this.setState({
            startDate: date
        })
        //}

    }

    toggle = () => {
        //alert(this.state.isOpen)         
        this.DP.setOpen(!this.state.isOpen);
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    setDayOrWeek = (val) => {
        this.setState({weekOrDay:val})      
    }

    moveWeek = (tmpDay) => {
        //return;
        debugger;
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

    render() {
        //debugger;
        return (
            <div className="m-2 p-2">
                <Row>
                    <Col sm="3">
                        <div>
                            <h3 className="d-inline align-middle">Timesheet</h3> <br/>
                            <h6>{this.props.hv_name}</h6>
                        </div>
                    </Col>
                    <Col sm="3">
                        <div className="d-sm-inline-flex">
                            <style>
                                {`.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {
                                padding-left: 0;
                                padding-right: 0;
                            }`}
                            </style>
                            <DatePicker ref={(r) => { this.DP = r }} selected={this.state.startDate} onChange={this.handleChange} timeFormat="HH:mm" timeIntervals={15} dateFormat="YYYY-MM-DD" timeCaption="time"
                            /> {"   "}
                            <i className="fa fa-calendar fa-lg fa-fw" style={{ cursor: "pointer" }} onClick={(e) => { this.toggle() }}></i>
                        </div>
                    </Col>
                    <Col sm="3">
                        <span style={{ border: "1px" }}>
                            <Button><i className="fa fa-arrow-left fa-lg fa-fw" style={{ cursor: "pointer" }} onClick={() => this.moveWeek("P")}></i></Button>
                            {" " + this.showWeekOrDay() + " "}
                            <Button><i className="fa fa-arrow-right fa-lg fa-fw" style={{ cursor: "pointer" }} onClick={() => this.moveWeek("N")}></i></Button>
                        </span>
                    </Col>
                    <Col sm="3">
                        <div className="d-sm-inline-flex">Day<Toggle defaultToggled={true} ref={(r) => { this.togCtl = r }} style={{ width: "50px" }} onToggle={(e, val) => { this.setDayOrWeek(val) }} />Week</div>
                    </Col>
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
