import React, { Component } from "react";
import PropTypes from "prop-types";

import clientlogo from "../images/cadetlogo.png";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { types as forgotPWDTypes } from "../reducers/forgotpwdreducer";
import { actions as forgotPWDActions } from "../reducers/forgotpwdreducer";
import * as _ from "lodash";
import bgImg from "../images/cgyca_staffandbdgt.PNG";
import staffImg from "../images/course_cal.PNG";
import roleImg from "../images/role.png";
import userImg from "../images/user.png";
import secImg from "../images/security.png";
import { List, ListItem } from "material-ui/List";
import ActionGrade from "material-ui/svg-icons/action/grade";
import ContentInbox from "material-ui/svg-icons/content/inbox";
import ContentDrafts from "material-ui/svg-icons/content/drafts";
import ContentSend from "material-ui/svg-icons/content/send";
import Subheader from "material-ui/Subheader";
import AttribList from "./AttribTables";
import Drawer from "material-ui/Drawer";
import Paper from "material-ui/Paper";
import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";
import Divider from "material-ui/Divider";
import Toggle from "material-ui/Toggle";
import AppBar from "material-ui/AppBar";
import Roles from "./Roles";

import {
  Table,
  ListGroup,
  ListGroupItem,
  Badge,
  InputGroup,
  InputGroupAddon,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import {
  TabContent,
  TabPane,
  Card,
  CardImg,
  CardHeader,
  CardFooter,
  Collapse,
  CardBody,
  CardTitle,
  CardText
} from "reactstrap";

import {
  Input,
  ButtCollapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
  Jumbotron,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";


import UsersList from "./Users/usersList";
import StaffList from "./Staff/StaffList";
import ChangeOrderList from "./ChangeOrders/ChangeOrderList";



const styles = {
  //margin: 12,
  link: {
    cursor: "pointer"
  },
  refresh: {
    display: "inline-block",
    position: "relative"
  },

  container: {
    overflow: "hidden",
    margin: "0px",
    width: "100%",
    height: "100vh",
    padding: "1px"
    //backgroundImage: `url(${bgImg})`,
    //backgroundSize: "100%",
    //backgroundPosition: "center",
    //backgroundRepeat: "no-repeat"
  },
  absolute: { position: "absolute" }
};
const paperStyle = {
  // height: "130px",
  width: "100%",
  display: "flex"
};

const listStyle = {
  fontSize: "12px",
  fontFamily: "Arial",
  fontStyle: "bold",
  height: "40px",
  margin: "2px"
};
const images = [bgImg, staffImg, roleImg, userImg, secImg];

export class Admin extends Component {
  static propTypes = {};
  constructor(props) {
    debugger;
    super(props);


console.log(props)
    this.state = {
      isLoading: false,
      collapse: false,
      open: false,
      imgIndex: 0,
      inAttrib: true,
      slideOpen: true,
      smColMenu: "2",
      smColForm: "10",
      showFieldMenu: true,
      showmaintainMenu: true,
      showworkorderMenu : true,
      tableTag: "Academy or State Specific Fields",
      compVal : "R"
      //imgSrc: "cgyca_staffandbdgt.PNG"
    };

    this.changeImg = this.changeImg.bind(this);
    this.showAttrib = this.showAttrib.bind(this);
  }

  changeImg = index => {
debugger


    debugger;

    this.setState({
      imgIndex: index,
      inAttrib: false,
      compVal : ""
    });
  };

  showAttrib = () => {
    this.setState({
      inAttrib: true,
      tableTag: ""
    });
  };

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    });
  };

  handleNestedListToggle = item => {
    this.setState({
      open: item.state.open
    });
  };
  handleSlideToggle = () => {
    this.setState({
      slideOpen: false
    });
    debugger;
  };
  handleClose = () => {
    debugger;
    if (!this.state.slideOpen) {
      this.setState({
        slideOpen: true,
        smColMenu: "2",
        smColForm: "10"
      });
    } else {
      this.setState({
        slideOpen: false,
        smColMenu: "0",
        smColForm: "12"
      });
    }
  };
  componentDidUpdate(prevProps, prevState) {
    debugger;
    //this.state.slideOpen=!prevState.slideOpen
    /*
    <Drawer
              open={this.state.slideOpen}
              containerStyle={styles.absolute}
              overlayStyle={styles.absolute}
            >
            */
  }
  componentDidMount() {
    debugger;
    console.log('s '+this.props)

  }
  render() {
    debugger;
    return (
      <div>
        {/*
        <Row>
          <Col sm="12">
            <AppBar
              style={{
                height: "50px",
                marginLeft: "-20px",
                width: "100%",
                backgroundColor: "lightgray",
                color: "black"
              }}
              onClick={this.handleClose}
            />
          </Col>
        </Row>
            */}

        <Row style={{ fontSize: "11px", fontStyle: "normal" }}>
          <Col
            sm={this.state.smColMenu}
            style={{
              overflowY: "auto",
              overflowX: "hidden",
              backgroundColor: "#ecf0f6"
            }}
          >
            {/* <Collapse> */}

            <List style={{ backgroundColor: "#ecf0f6" }}>
              <i
                className="fa fa-caret-down"
                onClick={() => {
                  this.setState({
                    showFieldMenu: !this.state.showFieldMenu
                  });
                }}
              />
              <span
                style={{
                  fontSize: "15px",
                  fontFamily: "Arial",
                  fontStyle: "bold"
                }}
              >
                {" "}
                Field Maintenance{" "}
              </span>
              <Divider />
              <Collapse isOpen={this.state.showFieldMenu}>
                <ListItem
                  style={listStyle}
                  primaryText="Academy or State Specific"
                  onClick={() => {
                    this.setState({
                      inAttrib: true,
                      compVal : "A",
                      tableTag: "Academy or State Specific Fields"
                    });
                  }}
                />
                <ListItem
                  style={listStyle}
                  primaryText="Cadet and Mentor fields"
                  initiallyOpen={false}
                  primaryTogglesNestedList={true}
                  nestedItems={[
                    <ListItem
                      style={listStyle}
                      key={1}
                      primaryText="Cadet Characteristics"
                      onClick={() => {
                        this.setState({
                          inAttrib: true,
                          compVal : "A",
                          tableTag: "Cadet Characteristics"
                        });
                      }}
                    />,
                    <ListItem
                      style={listStyle}
                      key={2}
                      primaryText="Cadet Medical"
                      onClick={() => {
                        this.setState({
                          inAttrib: true,
                          compVal : "A",
                          tableTag: "Cadet Medical"
                        });
                      }}
                    />,
                    <ListItem
                      style={listStyle}
                      key={2}
                      primaryText="Cadet Residential"
                      onClick={() => {
                        this.setState({
                          inAttrib: true,
                          compVal : "A",
                          tableTag: "Cadet Residential"
                        });
                      }}
                    />,
                    <ListItem
                      style={listStyle}
                      key={2}
                      primaryText="Cadet Post-Residential"
                      onClick={() => {
                        this.setState({
                          inAttrib: true,
                          compVal : "A",
                          tableTag: "Cadet Post-Residential"
                        });
                      }}
                    />
                  ]}
                />
                <ListItem
                  style={listStyle}
                  primaryText="Staff and Budget fields"
                  initiallyOpen={false}
                  primaryTogglesNestedList={true}
                  nestedItems={[
                    <ListItem
                      style={listStyle}
                      key={1}
                      primaryText="Staff Members"
                    />,
                    <ListItem
                      style={listStyle}
                      key={2}
                      primaryText="People Organization"
                    />,
                    <ListItem
                      style={listStyle}
                      key={2}
                      primaryText="Budget Items"
                    />
                  ]}
                />

                <ListItem
                  style={listStyle}
                  primaryText="Course Scheduling Fields"
                />
                <ListItem style={listStyle} primaryText="Approvals Fields" />
              </Collapse>
            </List>

            <List style={{ backgroundColor: "#ecf0f6" }}>
              <i
                className="fa fa-caret-down"
                onClick={() => {
                  this.setState({
                    showmaintainMenu: !this.state.showmaintainMenu
                  });
                }}
              />
              <span
                style={{
                  fontSize: "15px",
                  fontFamily: "Arial",
                  fontStyle: "bold"
                }}
              >
                {" "}
                Site and User Maintenance{" "}
              </span>
              <Divider />
              <Collapse isOpen={this.state.showmaintainMenu}>
                <ListItem
                  style={listStyle}
                  primaryText="Site Setup and Maintenance"
                  onClick={() => {
                    debugger;
                    this.changeImg(4);
                  }}
                />

                <ListItem
                  style={listStyle}
                  primaryText="Role Maintenance"
                  onClick={() => {
                    debugger;
                    this.setState({
                      inAttrib: false,
                      compVal : "R",
                    });
                  }}
                />
                <ListItem
                  style={listStyle}
                  primaryText="User Maintenance"
                  onClick={() => {
                    debugger;
                    this.setState({
                      inAttrib: false,
                      compVal : "U",
                    });

                  }}
                />
              </Collapse>
            </List>


            <List style={{ backgroundColor: "#ecf0f6" }}>
              <i
                className="fa fa-caret-down"
                onClick={() => {
                  this.setState({
      showworkorderMenu: !this.state.showworkorderMenu
                  });
                }}
              />
              <span
                style={{
                  fontSize: "15px",
                  fontFamily: "Arial",
                  fontStyle: "bold"
                }}
              >
                {" "}
               Work Orders{" "}
              </span>
              <Divider />
              <Collapse isOpen={this.state.showworkorderMenu}>
                {/* <ListItem
                  style={listStyle}
                  primaryText="Work Orders"
                  onClick={() => {
                    debugger;
                    this.changeImg(4);
                  }}
                /> */}

                <ListItem
                  style={listStyle}
                  primaryText ="Maintain Change Orders"
                  onClick={() => {
                    debugger;
                    this.setState({
                      inAttrib: false,
                      compVal : "C",
                    });

                  }}
                />
                <ListItem
                  style={listStyle}
                  primaryText ="Assign Tasks"
                  onClick={() => {
                    debugger;
                    this.setState({
                      inAttrib: false,
                      compVal : "T",
                    });

                  }}
                />
              </Collapse>
            </List>
            {/* </Paper>    */}
            {/* </Collapse> */}
          </Col>
          {/*
            <Col sm="3">
              <div>
                <i
                  className="fa fa-caret-down fa-lg"
                  onClick={() => {
                    this.setState({
                      collapse: !this.state.collapse
                    });
                  }}
                />
                <span> Field Maintenance </span>
              </div>
              <Collapse isOpen={this.state.collapse}>
                <Card>
                  <CardBody>
                    <CardText>
                      Enter in your email address and we'll send you a link to
                      reset your password
                    </CardText>
                  </CardBody>
                </Card>{" "}
              </Collapse>
            </Col>
            */}
          <Col sm={this.state.smColForm}>
            <Card
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                marginLeft: "2px"
              }}
            >

                {(() => {
                  switch (this.state.compVal) {
                    case "A":
                      return (
                        <AttribList
                          {...this.props}
                          tableTag={this.state.tableTag}
                          tableName={this.state.tableTag}
                        />);

                      case "R":
                      return (
                        <Roles
                          {...this.props}
                        />
                      );
                      case "U":
                      return (
                        <UsersList
                          {...this.props}
                        />
                      );
                       case "S":
                      return (
                        <StaffList
                          {...this.props}
                        />
                      );
                      case "C":
                     return (
                       <ChangeOrderList
                         {...this.props}
                       />
                     );
                    default:
                      return (
                        <img
                        width="100%"
                        height="100%"
                        src={images[this.state.imgIndex]}
                        alt="Card image cap"
                      />
                      );
                  }
                })()}

              {/*
              {!this.state.inAttrib ? (
                <img
                  width="100%"
                  height="100%"
                  src={images[this.state.imgIndex]}
                  alt="Card image cap"
                />
              ) : (
                <AttribList {...this.props} tableTag={this.state.tableTag} tableName={this.state.tableTag} />
              )}
            */}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);

