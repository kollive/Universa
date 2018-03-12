import React, { Component } from "react";
import { connect } from "react-redux";

import Badge from "material-ui/Badge";
import IconButton from "material-ui/IconButton";
import Paper from "material-ui/Paper";
import Divider from "material-ui/Divider";
import NotificationsIcon from "material-ui/svg-icons/social/notifications";
import { bindActionCreators } from "redux";
import export_excel from "../images/export_excel.PNG";
import chart from "../images/chart.PNG";

//import ApprovalsTab from "./Approvals";
import CadetInlineSearch from "./CadetInlineSearch";
import { actions as cadetDetailsActions } from "../reducers/cadetdetailsreducer";
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

class HomeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notifycollapse: true,
      indicatorscollapse: true,
      showApprovals: false,
      showHome: true,
      searchCadet: true
    };
    // this.onClickAction = this.onClickAction.bind(this);
    this.cadetSearch = this.cadetSearch.bind(this);
  }

  cadetSearch(cadet) {
    this.props.callParentSearch(cadet);
    //alert(cadet.hv_cadet_name);
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
        style={{ width: 1024, overflowX: "hidden", overflowY:"auto", margin: "10px" }}>
        <div
          style={{ display: this.state.showHome == true ? "block" : "none" }} >
          <div className="d-flex">
            <Row >
              {" "}
              <Col sm="12">
                {/*<h4 className="text-default">Home  <i className="fa fa-arrow-circle-o-down" /></h4><br />*/}
                <h5 className="text-primary">
                  Welcome to the Universe Solution.{" "}
                </h5>
                <span className="text-default">
                  The Universe Solution is an all-in-one system that tracks cadets,
                  courses and budget information.<br />
                  This home page gives you quick access notifications and key
                  metrics, and provides you with the quick links to core
                  functions of the system.
                </span>
              </Col>
            </Row>
          </div>
          <Divider />
          <div >
            <Row>
              <Col>
                <div>
                  <i
                    className="fa fa-caret-down fa-lg"
                    onClick={() => {
                      this.setState({
                        notifycollapse: !this.state.notifycollapse
                      });
                    }}
                  />
                  <span> Notifications </span>
                  <Badge
                    badgeContent={10}
                    primary={true}
                    badgeStyle={{ top: "50%", right: 20 }}
                  >
                    <IconButton
                      tooltip="Notifications"
                      onClick={() => {
                        this.setState({
                          notifycollapse: !this.state.notifycollapse
                        });
                      }}
                    >
                      <NotificationsIcon />
                    </IconButton>
                  </Badge>
                </div>
                <Collapse isOpen={this.state.notifycollapse}>
                <Row><Col sm="12">
                  <Paper style={{height: "130px", width: "100%",display: "flex"}}  zDepth={1}>
                    <br />
                    <Table
                      bordered
                      striped
                      hover
                      size="sm"
                      className="border-bottom-0"
                    >
                      <tbody>{this.renderList()}</tbody>
                    </Table>
                  </Paper>
                  </Col></Row>
                </Collapse>
              </Col>
            </Row>
            <br/>
            <Row>
              <Col>
                <div>
                  <i
                    className="fa fa-caret-down fa-lg"
                    onClick={() => {
                      this.setState({
                        indicatorscollapse: !this.state.indicatorscollapse
                      });
                    }}
                  />
                  <span className="text-default"> Key Indicators</span>
                  <Divider />
                </div>
                <Collapse isOpen={this.state.indicatorscollapse}>
                  <a href="">
                    <i>View Reporting Dashboard...</i>
                  </a>
                  <Row>
                    <Col sm="4">
                      {/* <Card body>
                                            <CardText> */}
                      <Table
                        bordered
                        size="sm"
                        className="border-bottom-0"
                        style={{ width: "100%" }}
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                backgroundColor: "#93a8e0",
                                color: "white"
                              }}
                              width="33%"
                            >
                              Submitted <br /> Applications for <br /> Pending
                              Class
                              <br />
                              <br />
                              The target number <br /> of cadets per class{" "}
                              <br /> is 200.
                            </td>
                            <td>
                              Applications submitted,<br />
                              for 2018, Class 35<br />
                              <br />
                              <span style={{ justifyContent: "center" }}>
                                <b>195</b>
                              </span>
                              <br /> <br />
                              <span style={{ fontSize: "10px" }}>
                                This number does not include<br /> rejected
                                applications.{" "}
                              </span>
                              <span>
                                <br />
                                <br />
                                <a
                                  href={"http://hvs.selfip.net:4003/statusexcel"}
                                  download={"test.xlsx"}
                                >
                                  <img
                                    src={export_excel}
                                    alt="chart"
                                    className="px-2"
                                    style={{ float: "right" }}
                                  />
                                </a>
                                {/* <img src={export_excel} alt="chart" className="px-2 " style={{ float: 'right' }} /> */}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      {/* </CardText>
                                            <Button>Go somewhere</Button>
                                        </Card> */}
                    </Col>
                    <Col sm="4">
                      <Table
                        bordered
                        size="sm"
                        className="border-bottom-0"
                        style={{ width: "100%" }}
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                backgroundColor: "#4f8acc",
                                color: "white"
                              }}
                              width="33%"
                            >
                              Accepted <br /> Applications for <br /> Pending
                              Class
                              <br />
                              <br />
                              The target number <br /> of cadets per class{" "}
                              <br /> is 200.
                              <br />
                            </td>
                            <td>
                              Applications accepted for<br />
                              2018, Class 35<br />
                              <br />
                              <span style={{ justifyContent: "center" }}>
                                <b>130</b>
                              </span>
                              <br /> <br />
                              <span style={{ fontSize: "10px" }}>
                                This applications are fully<br /> approved.
                              </span>
                              <span>
                                {" "}
                                <br />
                                <br />
                                <a
                                  href={"http://hvs.selfip.net:4003/statusexcel"}
                                  download={"test.xlsx"}
                                >
                                  <img
                                    src={export_excel}
                                    alt="chart"
                                    className="px-2"
                                    style={{ float: "right" }}
                                  />
                                </a>
                              </span>
                            </td>
                          </tr>
                          <tr />
                        </tbody>
                      </Table>
                    </Col>
                    <Col sm="4">
                      <Table
                        bordered
                        size="sm"
                        className="border-bottom-0"
                        style={{ width: "100%" }}
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                backgroundColor: "#4f8acc",
                                color: "white",
                                width: "100px"
                              }}
                            >
                              Status of <br /> Applications
                              <br />
                              <br />
                              The metrics shows <br /> how many of the
                              applications for the <br />
                              next class are in process, or have been accepted
                              or
                              <br /> rejected.
                              <br />
                            </td>
                            <td style={{ width: "55%" }}>
                              <img
                                src={chart}
                                height="90%"
                                width="100%"
                                alt="chart"
                                className="px-3"
                              />
                              <span>
                                {" "}
                                <br />
                                <a
                                  href={"http://hvs.selfip.net:4003/statusexcel"}
                                  download={"test.xlsx"}
                                >
                                  <img
                                    src={export_excel}
                                    alt="chart"
                                    className="px-2"
                                    style={{ float: "right" }}
                                  />
                                </a>
                                {/* <img src={export_excel} alt="chart" className="px-2 " style={{ float: 'right' }} /> */}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </Collapse>
              </Col>
            </Row>

            <Row>
              <Col>
                <div>
                  <i
                    className="fa fa-caret-down fa-lg"
                    onClick={() => {
                      this.setState({ searchCadet: !this.state.searchCadet });
                    }}
                  />
                  <span> Search for a cadet or a staff member </span>
                </div>
                <Collapse isOpen={this.state.searchCadet}>
                  <Table
                    bordered
                    size="sm"
                    style={{ height: "55px", overflow: "auto" }}
                    className="border-bottom-0"
                  >
                    <tbody>
                      <tr>
                        <td>
                          <CadetInlineSearch
                            callParentSearch={this.cadetSearch}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Collapse>
              </Col>
            </Row>
          </div>
        </div>
        <div
          style={{
            display: this.state.showApprovals == true ? "block" : "none"
          }}>
          <div>
            <Row>
              {" "}
              <Col sm="12">
                {/* <div > */}
                <span
                  className="fa-stack"
                  style={{ float: "right", cursor: "pointer" }}
                  onClick={() => {
                    if (this.state.showHome == false)
                      this.setState({
                        showApprovals: !this.state.showApprovals,
                        showHome: !this.state.showHome
                      });
                  }}
                >
                  <i className="fa fa-square-o fa-stack-2x" />
                  <i className="fa fa-times fa-stack-1x" />
                </span>
                {/* </div>              */}

                {/* <h5 className="text-default" style={{cursor:'pointer'}} onClick={() => {
                                if (this.state.showHome == false)
                                       this.setState
                                        ({ showApprovals: !this.state.showApprovals,
                                        showHome : !this.state.showHome })}}>Home  <i className="fa fa-arrow-circle-o-down" />&nbsp;
                                       <span style={{fontSize:'12px'}}><i className="fa fa-chevron-right"/>Approvals</span></h5>  <ApprovalsTab />*/}
               
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
