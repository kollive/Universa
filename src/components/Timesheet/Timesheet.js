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
export class Timesheet extends Component {
constructor(props){
    super(props)
     this.state={
    staff_id : '1',
    start_timesheet_date: moment(new Date).startOf('isoWeek'),
    end_timesheet_date:moment(new Date).endOf('isoWeek')
}
}
onTimeChange=(event,time,date,row)=>{
    debugger
    let saveTime=moment(time.toLocaleTimeString(), ["h:mm A"]).format("HH:mm");
    let saveDate=this.convertDate(date.toDateString())
    let timesheet_time={}
    switch(row)
    {
        case 'Clock In' :
        {
            timesheet_time.start_time=saveTime         
            break;
        }
            case 'Lunch In' :
        {
            timesheet_time.lunch_start=saveTime         
            break;
        }    case 'Lunch Out' :
        {
            timesheet_time.lunch_end=saveTime         
            break;
        }    case 'Clock Out' :
        {
            timesheet_time.end_time=saveTime         
            break;
        }
	   
    }
     this.props.insertTimesheet({
        type: ManageTimeTypes.INSERT_TIME_REQUEST,
        payload:[{
     	staff_id :this.state.staff_id,
	    timesheet_date :saveDate,
	    timesheet_time:JSON.stringify(timesheet_time),
	    createuserid:'sv'
        },
        {
          function_Id:65
        }
        ]
      });
}
convertDate(dateString){
var dateObj = new Date(dateString);
var momentObj = moment(dateObj);
return(momentObj.format('MM/DD/YYYY'))
}
evaluatePermissions(){
     let userFunctions = [], unqUserFunctions = [];
     try{
     if(JSON.parse(sessionStorage.getItem("roles")) && !!sessionStorage.getItem("roles"))
     {
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
  catch(ex)
  {

  }
  finally
  {
    //debugger
    this.setState({ userFunctions: unqUserFunctions });
  }
    return unqUserFunctions;
  }
componentDidMount() {
    let unqFunction=this.evaluatePermissions(); 
    let key= _.findKey(unqFunction, function(o){ return o.function_id == 67});
    this.setState({ hasAccessToView: <Alert color="danger">User does not have permission !</Alert>});
    this.setState({ hasAccessToDataGrid: 'none'});  
    if(key!==undefined)
    {
    this.setState({ hasAccessToView: '' });
    this.setState({ hasAccessToDataGrid: 'block'});  
    debugger
      this.props.getTimesheet({
          type: ManageTimeTypes.FETCH_TIME_REQUEST,
          payload: [{
              staff_id:this.state.staff_id,start_timesheet_date:this.state.start_timesheet_date, end_timesheet_date:this.state.end_timesheet_date,
          },
              { function_id:unqFunction[key].function_id}]
        });
      }
}
render() {
        debugger
        var startOfWeek = this.state.start_timesheet_date
        var endOfWeek = this.state.end_timesheet_date
        var days = [];
        var day = startOfWeek;
        while (day <= endOfWeek) {
            days.push(day.toDate());
            day = day.clone().add(1, 'd');
        }
        const myDays=days;
        const myClock = [{ clock: "Clock In" }, { clock: "Lunch In" }, { clock: "Lunch Out" }, { clock: "Clock Out" },]        
        const contentCol = myDays.map((day) =>
        {
        let currentDate= day.toDateString().split(" ")
        return <th style={{textAlign:'center'}}><TimePicker  textFieldStyle={{ width: '60%' ,textAlign:'center'}}   value={this.state.date}   onChange={(event,time) => this.onTimeChange(event,time,currentDate)} autoOk={true}/></th>
        });

        const contentRow =  myClock.map((clk) =>{
          return  <tr id={clk.clock}><th>{clk.clock} </th>
          <th><TimePicker  textFieldStyle={{ width: '60%' ,textAlign:'center'}}   value={this.state.date}   onChange={(event,time) => this.onTimeChange(event,time)} autoOk={true}/></th></tr>
        });
         
        const contentHeader = myDays.map((day) =>
        {
          let currentDate= day.toDateString().split(" ")
           return<th style={{textAlign:'center'}}>{currentDate[1]}{" "}{currentDate[2]}<br/>{currentDate[0]}</th>
        });
     
         let list = myClock.map(p =>{
           return (
                <tr className="grey2" key={p.clock}>
                <td className="grey1">{p.clock}</td>
                     {myDays.map(k => {
          let currentDate= k.toDateString().split(" ")
                         
                           return (<td className="grey1" key={p.id+''+k}>
                          <TimePicker  textFieldStyle={{ width: '60%' ,textAlign:'center'}}   value={this.state.date}   onChange={(event,time) => this.onTimeChange(event,time,k,p.clock)} autoOk={true}/>                           
            
                           </td>);

                     })}
                </tr>
           );
      });
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
    manageTimeState: state.ManageTimeState
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