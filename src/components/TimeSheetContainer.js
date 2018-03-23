import React, { Component } from "react";
import { connect } from "react-redux";

import Badge from "material-ui/Badge";
import IconButton from "material-ui/IconButton";
import Paper from "material-ui/Paper";
import Divider from "material-ui/Divider";
import NotificationsIcon from "material-ui/svg-icons/social/notifications";
import export_excel from "../images/export_excel.PNG";
import chart from "../images/chart.PNG";

//import ApprovalsTab from "./Approvals";
import CadetInlineSearch from "./CadetInlineSearch";
//import { actions as cadetDetailsActions } from "../../reducers/cadetdetailsreducer";
import TimeSheetHeader from "./TimeSheetHeader";
import WorkPlan from "./WorkPlan";
import { bindActionCreators } from "redux";
import { types as commonTypes } from "../reducers/commonreducer";
import { actions as commonActions } from "../reducers/commonreducer";
import Timesheet from './Timesheet/Timesheet'
import * as _ from "lodash";


import {
    Container,
    TabContent,
    TabPane,
    Card,
    Table,
    Collapse,
    CardBody,
    Button,
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
    }
};

class TimeSheetContainer extends Component {
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
            hv_staff_id: (this.props.hv_staff_id == "" ? this.props.CommonState.hv_staff_id : this.props.hv_staff_id)
        };
        // this.onClickAction = this.onClickAction.bind(this);
        this.setDate = this.setDate.bind(this);
        this.setMode = this.setMode.bind(this);
        this.parentStaffID = this.parentStaffID.bind(this);
        
        this.getStaffID();

        /*
        if(this.props.CommonState.hv_staff_id) {

            alert("receive")
            alert( this.props.CommonState.hv_staff_id )
            alert(this.props.hv_staff_id)

        if(this.props.hv_staff_id != this.props.CommonState.hv_staff_id &&  this.props.CommonState.hv_staff_id != "" && this.props.hv_staff_id == "") {
            
            this.setState({
                hv_staff_id :  this.props.CommonState.hv_staff_id,
                staff_id :  this.props.CommonState.hv_staff_id
            })
            //alert(this.props.CommonState.hv_staff_id)
            alert(this.state.staff_id)
        }
        }
        */

    }

    getStaffID=()=>{
        //alert("in Getstaff")
        let userid;
        if (JSON.parse(sessionStorage.getItem("roles")) && !!sessionStorage.getItem("roles")) {
            //debugger
            _.map(JSON.parse(sessionStorage.getItem("roles")), function (o) {
                userid = o.hv_user_id
            })
        }
       // alert(userid)
       //alert(this.state.staff_id)
       if(this.props.hv_staff_id != "") {
            this.props.setStaffID({
                type: commonTypes.STAFFID,
                payload: {
                    hv_staff_id : this.props.hv_staff_id               
                }
            });
            
            this.setState({
                staff_id : this.props.hv_staff_id,
                hv_staff_id :  this.props.hv_staff_id
            })
        }

        this.props.setUserID({
            type: commonTypes.USERID,
            payload: {
                hv_user_id: userid         
            }
        });

        if(this.props.name != "" ) {
        this.props.setName({
            type: commonTypes.NAME,
            payload: {
                hv_name : this.props.name               
            }
        });
    }
    }

    componentWillMount = () => {
        debugger;
        
    }
    
    componentWillReceiveProps(nextProps) {
        /*
           if(nextProps.CommonState) {
                
                    if(this.props.hv_staff_id != nextProps.CommonState.hv_staff_id &&  nextProps.CommonState.hv_staff_id != "" ) {
                    this.setState({
                        staff_id : nextProps.CommonState.hv_staff_id
                    })
            }
                //alert("receive")
                //alert(nextProps.CommonState.hv_staff_id)
            }
           */
    }

    componentDidMount() {
        debugger;
        //alert(this.props.CommonState.hv_staff_id)
        //alert(this.props.name) 
           
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

    parentStaffID (staffID){
        //alert("staff")
        //alert(staffID)
       this.setState({
            staff_id: staffID
        });

        //staffID={ (this.props.hv_staff_id !="") ?  this.props.hv_staff_id : this.state.staff_id} />
    }


    render() {
        this.renderTimesheet=<Timesheet headerState={this.state}        
        staffID={this.state.staff_id}  />

        return (
            <Container
                fluid
                style={{ margin: "10px" }}>
                <div>
                    <div>
                        <Row >
                            {" "}
                            <Col sm="12">
                                <TimeSheetHeader staffID={this.state.hv_staff_id} hv_name={(this.props.CommonState.hv_name == "" ? this.props.name : this.props.CommonState.hv_name )} callParentDates={this.setDate} callParentMode={this.setMode} 
                                callParentStaffID={this.parentStaffID}
                                />
                            </Col>
                        </Row>
                    </div>
                    <Divider />
                      <div >                        
                        <Row >
                            {" "}
                            <Col sm="12">
                            <Timesheet headerState={this.state} staffID={this.state.staff_id}  />
                            </Col>
                        </Row>
                    </div>
                    <div >                        
                        <Row >
                            {" "}
                            <Col sm="12">
                                <WorkPlan staffID={this.state.staff_id}  startDT={this.state.startDT} endDT={this.state.endDT} mode={this.state.mode} />
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        CommonState: state.CommonState
    };
};

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(
        {
            ...commonActions
        },
        dispatch
    )
});



export default connect(mapStateToProps, mapDispatchToProps)(TimeSheetContainer);
