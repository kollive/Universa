import React, { Component } from "react";
import { connect } from "react-redux";

import Badge from "material-ui/Badge";
import IconButton from "material-ui/IconButton";
import Paper from "material-ui/Paper";
import Divider from "material-ui/Divider";
import NotificationsIcon from "material-ui/svg-icons/social/notifications";
import { bindActionCreators } from "redux";
import export_excel from "images/export_excel.PNG";
import chart from "images/chart.PNG";

//import ApprovalsTab from "./Approvals";
import CadetInlineSearch from "./CadetInlineSearch";
//import { actions as cadetDetailsActions } from "reducers/cadetdetailsreducer";
import TimeSheetHeader from "./TimeSheetHeader";
import WorkPlan from "./WorkPlan";
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

class TimeSheet extends Component {
  constructor(props) {
    super(props);
debugger
    this.state = {
      notifycollapse: true,
      indicatorscollapse: true,
      showApprovals: false,
      showHome: true,
      searchCadet: true,
      staffID:"",
      startDT:"2018-03-01",
      endDT: "2018-03-07"
    };
    // this.onClickAction = this.onClickAction.bind(this);
    this.setDate = this.setDate.bind(this);
  }



  setDate(startDT,endDT) {
      debugger;
    //alert(cadet.hv_cadet_name);
    this.setState({
        startDT: startDT,
        endDT: endDT
    });
   
  }

  onClickLink(index) {
    //debugger;
    if (index == 1) {
      /*
      this.setState({
        showApprovals: true,
        showHome: false
      });
      */
      this.props.parentSwitchTab("4");
    }
  }
  renderList() {
    return this.props.notificationState.map((notification, index) => {
      return (
        <tr key={index}>
          <td style={{ fontSize: "13px" }}>
            <b>{notification.total_ntf_cnt}</b>
          </td>
          <td style={{ fontSize: "13px" }}>{notification.notify_type}</td>
          <td style={{ fontSize: "13px" }}>{notification.notify_message}</td>
          <td style={{ fontSize: "13px" }}>
            <label
              style={{
                cursor: "pointer",
                textDecorationLine: "underline",
                color: "#4f8acc"
              }}
              onClick={() => {
                if (index == 1) {
                  /*
                  this.setState({
                    showApprovals: !this.state.showApprovals,
                    showHome: !this.state.showHome
                  });
                  */
                  this.props.parentSwitchTab("4");
                }
              }}
            >
              {notification.nofity_details}
            </label>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <Container
        fluid
        style={{ margin: "10px" }}>
        <div>
          <div>
            <Row >
              {" "}
              <Col sm="12">
              <TimeSheetHeader callParentDates={this.setDate} />
              </Col>
            </Row>
          </div>
          <Divider />
          <div >
          <Row >
              {" "}
              <Col sm="12">
            
              </Col>
            </Row>
            <Divider />
            <Row >
              {" "}
              <Col sm="12">
              <WorkPlan staffID={this.props.hv_staff_id} startDT={this.state.startDT} endDT={this.state.endDT} />
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
    notificationState: state.notificationState
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSheet);
