import React, { Component } from 'react'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { types as ManageTimeTypes, permissions as Permissions } from "reducers/Timesheet/timesheetreducer";
import { actions as ManageTimeActions } from "reducers/Timesheet/timesheetreducer";
import TimePicker from 'material-ui/TimePicker';
import * as _ from "lodash";
import { Table } from 'reactstrap';
import moment from 'moment'
import { Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import TimeSheetClass from 'reducers/Timesheet/TimeSheetClass'
export class Timesheet extends Component {
    objTimeSheetClass;
    constructor(props) {
        super(props)
        let startOfWeek, endOfWeek;
        this.objTimeSheetClass=new TimeSheetClass();
        if (!this.props.headerState.weekOrDay) {
            startOfWeek = moment(this.props.headerState.startDate)//this.props.headerState.startDate//this.state.start_timesheet_date
            endOfWeek = moment(this.props.headerState.startDate)//this.props.headerState.endDate//this.state.end_timesheet_date
        }
        else {
            startOfWeek = moment(this.props.headerState.startDate).startOf('isoWeek')//this.props.headerState.startDate//this.state.start_timesheet_date
            endOfWeek = moment(this.props.headerState.startDate).endOf('isoWeek')
        }

        this.state = {
            date: new Date(),
            staff_id: '1',
            //start_timesheet_date: startOfWeek,
            //end_timesheet_date: endOfWeek
        }

    }
    onTimeChange = (event, time, date, row) => {
 
        let saveTime = this.convertTime(time.toLocaleTimeString())
        let saveDate = this.convertDate(date.toDateString())
        this.objTimeSheetClass.setTime(row,saveTime,saveDate)
        let findTime= _.find(this.objTimeSheetClass.getTime(),['timesheet_date',saveDate])
        if(findTime!==undefined)
       // if(findTime.length>0)
        {
           var beginningTime = moment(findTime.end_time, 'h:mma');
           var endTime = moment(findTime.start_time, 'h:mma');
            if(beginningTime.isBefore(endTime))
            {
              alert('Please enter valid Clock Out for date ' + saveDate);
              return;

            }
            else
        {        
        this.objTimeSheetClass.setTime(row,saveTime,saveDate)
            
        let timesheet_time = {}
        switch (row) {
            case 'Clock In':
                {
                    timesheet_time.start_time = saveTime
                    break;
                }
            case 'Lunch In':
                {
                    timesheet_time.lunch_start = saveTime
                    break;
                } case 'Lunch Out':
                {
                    timesheet_time.lunch_end = saveTime
                    break;
                } case 'Clock Out':
                {
                    timesheet_time.end_time = saveTime
                    break;
                }
        }
        this.objTimeSheetClass.setTime(row,timesheet_time,saveDate)
        
        this.props.insertTimesheet({
            type: ManageTimeTypes.INSERT_TIME_REQUEST,
            payload: [{
                staff_id: this.state.staff_id,
                timesheet_date: saveDate,
                timesheet_time: JSON.stringify(timesheet_time),
                createuserid: 'sv'
            },
            {
                function_Id: 65
            }
            ]
        });
        
        }
        }
    }
    convertDate = (dateString) => {
        var dateObj = new Date(dateString);
        var momentObj = moment(dateObj);
        return (momentObj.format('MM/DD/YYYY'))
    }
    convertTime = (timeString => moment(timeString, ["h:mm A"]).format("HH:mm"));

    evaluatePermissions() {
        let userFunctions = [], unqUserFunctions = [];
        try {
            if (JSON.parse(sessionStorage.getItem("roles")) && !!sessionStorage.getItem("roles")) {
                userFunctions = _.map(JSON.parse(sessionStorage.getItem("roles")), function (o) {
                    //debugger
                    return _.filter(Permissions, function (e) {
                        if (o.function_id == e.function_id)
                            return e;
                    })
                }).filter(function (j) {
                    if (j.length != 0)
                        return j;
                })
                _.map(userFunctions, function (obj) {
                    var length = _.reject(unqUserFunctions, function (el) {
                        //debugger
                        return (el.function_id.indexOf(obj[0].function_id) < 0);
                    }).length;
                    if (length < 1) {
                        unqUserFunctions.push(obj[0])
                        return obj
                    }
                });
            }
        }
        catch (ex) {

        }
        finally {
            //debugger
            this.setState({ userFunctions: unqUserFunctions });
        }
        return unqUserFunctions;
    }
    componentDidMount() {

        this.renderSavedTimesheet();

    }
    componentWillReceiveProps(nextProps) {
        //alert('componentWillReceiveProps')
        let startOfWeek, endOfWeek;

        if (nextProps.headerState != this.props.headerState) {

            if (nextProps.headerState != undefined) {
                if (!nextProps.headerState.weekOrDay) {
                    startOfWeek = moment(nextProps.headerState.startDate)
                    endOfWeek = moment(nextProps.headerState.startDate)
                }
                else {
                    startOfWeek = moment(nextProps.headerState.startDate).startOf('isoWeek')
                    endOfWeek = moment(nextProps.headerState.startDate).endOf('isoWeek')
                }

                this.props.getTimesheet({
                    type: ManageTimeTypes.FETCH_TIME_REQUEST,
                    payload: [{
                     staff_id:this.state.staff_id, start_timesheet_date: this.convertDate(startOfWeek), end_timesheet_date: this.convertDate(endOfWeek),                       
                    },
                    { function_id: '67' }]//unqFunction[key].function_id}]
                });
            }

        }
    }
    renderSavedTimesheet() {
        let startOfWeek, endOfWeek;
        let unqFunction = this.evaluatePermissions();
        let key = _.findKey(unqFunction, function (o) { return o.function_id == 67 });
        this.setState({ hasAccessToView: <Alert color="danger">User does not have permission !</Alert> });
        this.setState({ hasAccessToDataGrid: 'none' });
        //if(key!==undefined)
        // {
        this.setState({ hasAccessToView: '' });
        this.setState({ hasAccessToDataGrid: 'block' });
        if (this.props.headerState != undefined) {
            if (!this.props.headerState.weekOrDay) {
                startOfWeek = moment(this.props.headerState.startDate)//this.props.headerState.startDate//this.state.start_timesheet_date
                endOfWeek = moment(this.props.headerState.startDate)//this.props.headerState.endDate//this.state.end_timesheet_date
            }
            else {
                startOfWeek = moment(this.props.headerState.startDate).startOf('isoWeek')//this.props.headerState.startDate//this.state.start_timesheet_date
                endOfWeek = moment(this.props.headerState.startDate).endOf('isoWeek')
            }
        this.props.getTimesheet({
            type: ManageTimeTypes.FETCH_TIME_REQUEST,
            payload: [{
                staff_id:this.state.staff_id, start_timesheet_date: this.convertDate(startOfWeek), end_timesheet_date: this.convertDate(endOfWeek),
            },
            { function_id: '67' }]//unqFunction[key].function_id}]
        });
        //}
        
    }
    }
    render() {
        //  debugger

        let contentHeader, list, startOfWeek, endOfWeek, savedTimesheet, time;
        if (this.props.headerState != undefined) {
            if (!this.props.headerState.weekOrDay) {
                startOfWeek = moment(this.props.headerState.startDate)
                endOfWeek = moment(this.props.headerState.startDate)//this.props.headerState.endDate//this.state.end_timesheet_date
            }
            else {
                startOfWeek = moment(this.props.headerState.startDate).startOf('isoWeek')//this.props.headerState.startDate//this.state.start_timesheet_date
                endOfWeek = moment(this.props.headerState.startDate).endOf('isoWeek')
            }
            var days = [];
            var day = startOfWeek;
            while (day <= endOfWeek) {
                days.push(day.toDate());
                day = day.clone().add(1, 'd');
            }
            const myDays = days
            const myClock = [{ clock: "Clock In" }, { clock: "Lunch In" }, { clock: "Lunch Out" }, { clock: "Clock Out" },]
            const contentCol = myDays.map((day) => {
                let currentDate = day.toDateString().split(" ")
                return <th style={{ textAlign: 'center' }}><TimePicker textFieldStyle={{ width: '60%', textAlign: 'center' }} value={this.state.date} onChange={(event, time) => this.onTimeChange(event, time, currentDate)} autoOk={true} /></th>
            });

            const contentRow = myClock.map((clk) => {
                return <tr id={clk.clock}><th>{clk.clock} </th>
                    <th><TimePicker textFieldStyle={{ width: '60%', textAlign: 'center' }} value={this.state.date} onChange={(event, time) => this.onTimeChange(event, time)} autoOk={true} /></th></tr>
            });

            contentHeader = myDays.map((day) => {
                let currentDate = day.toDateString().split(" ")
                return <th style={{ textAlign: 'center' }}>{currentDate[1]}{" "}{currentDate[2]}<br />{currentDate[0]}</th>
            });

            if (this.props.TimesheetState !== undefined) {
                //debugger
                if (this.props.TimesheetState.items.length !== 0)
                    savedTimesheet = this.props.TimesheetState.items
                //  alert(this.props.TimesheetState.items[0])
            }
            list = myClock.map(p => {
                return (
                    <tr className="grey2" key={p.clock}>
                        <td className="grey1">{p.clock}</td>
                        {myDays.map(k => {
                            let currentDate = k.toDateString().split(" ")
                            if (savedTimesheet !== undefined) {
                                var self = this;
                                time = _.find(savedTimesheet,
                                    function (o) {
                                        return (moment(o.timesheet_date).format('MM/DD/YYYY') == moment(k.toDateString()).format('MM/DD/YYYY'))
                                    });
                                let savedTime = '';
                                if (time !== undefined) {
                                    //   alert(time.start_time)
                                    switch (p.clock) {
                                        case 'Clock In':
                                            savedTime = (time.start_time !== null) ? new Date(time.start_time) : ''
                                            break;
                                        case 'Lunch In':
                                            savedTime = (time.lunch_start !== null) ? new Date(time.lunch_start) : ''
                                            break;
                                        case 'Lunch Out':
                                            savedTime = (time.lunch_end !== null) ? new Date(time.lunch_end) : ''
                                            break;
                                        case 'Clock Out':
                                            savedTime = (time.end_time !== null) ? new Date(time.end_time) : ''
                                            break;
                                    }
                                } 
                                this.objTimeSheetClass.setTime(p.clock,this.convertTime(savedTime),this.convertDate(k) )                               
                                //alert(savedTime)
                                return (<td className="grey1" key={p.id}><TimePicker textFieldStyle={{ width: '60%', textAlign: 'center' }} value={savedTime} onChange={(event, time) => this.onTimeChange(event, time, k, p.clock)} autoOk={true} /></td>);
                            }
                            else
                                return (<td className="grey1" key={p.id}><TimePicker textFieldStyle={{ width: '60%', textAlign: 'center' }} value='' onChange={(event, time) => this.onTimeChange(event, time, k, p.clock)} autoOk={true} /></td>);

                        })}
                    </tr>
                );
            });
        }
        return (
            <div>
                <Table bordered id='#Table'>
                    <thead>
                        <th></th>
                        {contentHeader}
                    </thead>
                    <tbody>
                        {list}
                    </tbody>
                </Table>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        TimesheetState: state.TimesheetState
    };
}

const mapDispatchToProps = dispatch => ({
...bindActionCreators(
    {
      ...ManageTimeActions
    },
    dispatch
)})
export default connect(mapStateToProps, mapDispatchToProps)(Timesheet)