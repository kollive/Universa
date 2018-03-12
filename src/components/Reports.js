import React, { Component } from 'react';
import reportDashboard from '../images/reportsDashboard.png'
import reportsLibrary from '../images/reportsLibrary.png'
import reportsAdHoc from '../images/reportsAdHoc.png'
import export_excel from "../images/export_excel.PNG";
import chart from "../images/chart.PNG";
import budget from "../images/Reports_budget.PNG";
import graduates from "../images/graduates.PNG";
import {
    Container,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Card,
    Collapse,
    CardBody,
    Button,
    CardTitle,
    Table,
    CardText,
    Row,
    Col,
    Label,
    CardImg
} from "reactstrap";
import Divider from 'material-ui/Divider';
import classnames from "classnames";
const tabStyles = {
    backgroundColor: '#1b3039'

}
export default class Reports extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: "1"

        };
    }

    toggle = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    };
    render() {
        return (
            <div>
                <Container
                    fluid
                    style={{
                        overflow: "hidden",
                        marginTop: "20px",
                        marginLeft: "-10px",
                        marginRight: "20px",  
                    }}
                    >
                    <Nav tabs className="m-0 p-0">

                        <NavItem>
                            <NavLink
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                    active: this.state.activeTab === "1"
                                })}
                                onClick={() => {
                                    this.toggle("1");
                                } }
                                >
                                Dashboard
                </NavLink>
                        </NavItem>


                        <NavItem>
                            <NavLink
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                    active: this.state.activeTab === "2"
                                })}
                                onClick={() => {
                                    this.toggle("2");
                                } }
                                >
                                Report Library
                </NavLink>
                        </NavItem>


                        <NavItem>
                            <NavLink
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                    active: this.state.activeTab === "3"
                                })}
                                onClick={() => {
                                    this.toggle("3");
                                } }
                                >
                                Ad Hoc Reports
                </NavLink>
                        </NavItem>

                    </Nav>

                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                         
            <Row style={{fontSize :"10px"}}>
              <Col sm="12">
                 <Card>
                  <Row>
                    <Col sm="3">
                    
                      <Table
                        bordered
                        size="sm"
                        className="border-bottom-0"
                        style={{ width: "100%", fontSize:"11px" }}
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
                                  href={"http://hvs.selfip.net:4003/cadetexcel"}
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
                    <Col sm="3">
                      <Table
                        bordered
                        size="sm"
                        className="border-bottom-0"
                        style={{ width: "100%",fontSize:"11px" }}
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
                                  href={"http://hvs.selfip.net:4003/cadetexcel"}
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
                    <Col sm="3">
                      <Table
                        bordered
                        size="sm"
                        className="border-bottom-0"
                        style={{ width: "100%",fontSize:"11px" }}
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
                              </td>
                            <td style={{ width: "55%" }}>
                              <img
                                src={chart}
                                height="70%"
                                width="70%"
                                alt="chart"
                                className="px-3"
                              />
                              <span>
                                {" "}
                                <br />
                                <a
                                  href={"http://hvs.selfip.net:4003/cadetexcel"}
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
                    <Col sm="3">
                    <Table
                        bordered
                        size="sm"
                        className="border-bottom-0"
                        style={{ width: "100%",fontSize: "11px" }}
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
                              Graduation <br /> Rate in Last Complete Class 
                              <br />
                              <br />
                              The percentage <br /> of the last class <br /> of cadets{" "}
                              <br /> to graduate.
                            </td>
                            <td>
                              Percentage graduating  <br />
                              Class of 2018,Class 34<br />
                              <br />
                              <span style={{ justifyContent: "center" }}>
                                <b>97.3%</b>
                              </span>
                              <br /> <br />
                              <span style={{ fontSize: "10px" }}>
                                217 of 223 cadets <br/>
                                graduated in the last class.{" "}
                              </span>
                              <span>
                                <br />
                                <br />
                                <a
                                  href={"http://hvs.selfip.net:4003/cadetexcel"}
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
                  <Row>
                 <Col sm="6">
                    <Table
                        bordered
                        size="sm"
                        className="border-bottom-0"
                        style={{ width: "100%",fontSize:"11px" }}
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                backgroundColor: "#93a8e0",
                                color: "white"
                              }}
                              width="20%"
                            >
                              Budget <br /> Total by Staff Type
                              <br />
                              <br />
                              The total <br /> budgeted <br /> amounts for
                              <br /> each staff type.
                            </td>
                            <td>
                            <img
                                src={budget}
                                height="80%"
                                width="90%"
                                alt="chart"
                                className="px-3"
                              />
                            </td> 
                                                      </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col sm="6">
                    <Table
                        bordered
                        size="sm"
                        className="border-bottom-0"
                        style={{ width: "100%",fontSize:"11px" }}
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                backgroundColor: "#93a8e0",
                                color: "white"
                              }}
                              width="18%"
                            >
                              Graduates <br /> by Class
                              <br />
                              <br />
                              The total <br /> graduating <br /> cadets by
                              <br /> class.
                            </td>
                            <td>
                            <img
                                src={graduates}
                                height="92%"
                                width="100%"
                                alt="chart"
                                className="px-4"
                              />
                            
                            </td> 
                                                      </tr>
                        </tbody>
                      </Table>
                    </Col>
                    </Row>
                </Card>
              </Col>
            </Row>
                            {/* <Row className="">
                                <Col sm="12">
                                <br/>
                                    <CardImg style={{ width: "100%", height: "100%" }} src={reportDashboard} />
                                </Col>
                            </Row> */}

                        </TabPane>
                        <TabPane tabId="2">
                                <br/>
                        
                        <Row>
                    <span className="header-label" style={{ marginLeft:'20px' }}><i>
             The Reports library, provides real time report date in on Excel format.<br/>
Click on a report to export the report date to Excel.</i>
            </span>
                        </Row>
                                <br/>
                        
                            <Row>
                                <Col sm="12">
                                    <CardImg style={{ width: "80%", height: "90%" }} src={reportsLibrary} />

                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="3">
                        <Row>
                    <span className="header-label" style={{ marginLeft:'20px' }}>
                                <br/><i>
                    
             Ad Hoc reports allows user to create their own reports by selecting fields and defining filter criteria.<br/>
Select the fields and criteria for your report and click on a report to export the report date to Excel.</i>
            </span>
                        </Row>
                                <br/>
                        
                            <Row>
                                <Col sm="12">
                                    <CardImg style={{ width: "90%", height: "100%" }} src={reportsAdHoc} />

                                </Col>
                            </Row>

                        </TabPane>
                    </TabContent>

                </Container>
            </div>

        )
    }

}