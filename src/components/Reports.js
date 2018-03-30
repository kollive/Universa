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
import TSReports from "./TSReports";

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
                }}
              >
                Time Sheet
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
                }}
              >
                Work Plan
                </NavLink>
            </NavItem>

          </Nav>

          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
                <TSReports  hv_staff_id={this.props.hv_staff_id} />
            </TabPane>
            <TabPane tabId="2">
            </TabPane>
          </TabContent>

        </Container>
      </div>

    )
  }

}