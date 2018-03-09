import React, { Component } from "react";
import { connect } from "react-redux";

import Badge from "material-ui/Badge";
import IconButton from "material-ui/IconButton";
import Paper from "material-ui/Paper";
import Divider from "material-ui/Divider";
import NotificationsIcon from "material-ui/svg-icons/social/notifications";
import export_excel from "images/export_excel.PNG";
import chart from "images/chart.PNG";

//import ApprovalsTab from "./Approvals";
import CadetInlineSearch from "./CadetInlineSearch";
//import { actions as cadetDetailsActions } from "reducers/cadetdetailsreducer";
import TimeSheetHeader from "./TimeSheetHeader";
import WorkPlan from "./WorkPlan";
import { bindActionCreators } from "redux";
import { types as commonTypes } from "reducers/commonreducer";
import { actions as commonActions } from "reducers/commonreducer";
import Timesheet from './Timesheet/Timesheet'


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

        this.state = {
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
            hv_staff_id: ""
        };
        // this.onClickAction = this.onClickAction.bind(this);
        this.setDate = this.setDate.bind(this);
        this.setMode = this.setMode.bind(this);
        
    }

    componentWillMount = () => {
        debugger;
        //alert(this.props.hv_staff_id )
        this.props.setName({
            type: commonTypes.NAME,
            payload: {
                hv_name: this.props.name               
            }
        });

        this.props.setStaffID({
            type: commonTypes.STAFFID,
            payload: {
                hv_staff_id: this.props.hv_staff_id               
            }
        });
    }
    
    componentWillReceiveProps(nextProps) {

        if (nextProps) {
           
            //alert("next")
        }
    }

    componentDidMount() {
        debugger;
        //alert(this.props.commonState.hv_staff_id)
        //alert(this.props.name) 
        if (this.props.name) {
            //console.log("00000000000000")
            //console.log(this.props)
            this.setState({
                name: this.props.name,
                hv_staff_id: this.props.hv_staff_id
            })
        }
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


    render() {
        this.renderTimesheet=<Timesheet headerState={this.state} staffID={ (this.props.commonState.hv_staff_id == "" ? this.props.hv_staff_id : this.props.commonState.hv_staff_id)}/>

        return (
            <Container
                fluid
                style={{ margin: "10px" }}>
                <div>
                    <div>
                        <Row >
                            {" "}
                            <Col sm="12">
                                <TimeSheetHeader hv_name={(this.props.commonState.hv_name == "" ? this.props.name : this.props.commonState.hv_name )} callParentDates={this.setDate} callParentMode={this.setMode} />
                            </Col>
                        </Row>
                    </div>
                    <Divider />
                      <div >                        
                        <Row >
                            {" "}
                            <Col sm="12">
                                              {this.renderTimesheet}

                            </Col>
                        </Row>
                    </div>
                    <div >                        
                        <Row >
                            {" "}
                            <Col sm="12">
                                <WorkPlan staffID={ (this.props.commonState.hv_staff_id == "" ? this.props.hv_staff_id : this.props.commonState.hv_staff_id)} startDT={this.state.startDT} endDT={this.state.endDT} mode={this.state.mode} />
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
        commonState: state.CommonState
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
