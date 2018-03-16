import React, { Component } from "react";
import PropTypes from "prop-types";
import passwordRules from "password-rules";

import clientlogo from "../images/cadetlogo.png";
import "../App.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { types as changePWDTypes } from "../reducers/changepwdreducer";
import { actions as changePWDActions } from "../reducers/changepwdreducer";
import * as _ from "lodash";
import bgImg from "../images/cgyca_background.png";

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
  DropdownItem,
  Form,
  FormGroup,
  Label,
  FormText
} from "reactstrap";

import {
  TabContent,
  TabPane,
  Card,
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

const styles = {
    margin: 12,
    refresh: {
      display: "inline-block",
      position: "relative"
    },
  
    container: {
      overflow: "hidden",
      margin: "0px",
      width: "100%",
      height: "100vh",
      padding: "1px",
      backgroundImage: `url(${bgImg})`,
      backgroundSize: "100%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundColor: "#295878"
    }
  };

export class ChangePassword extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.changePWD = this.changePWD.bind(this);
    this.cancel = this.cancel.bind(this);
    this.state = {
      isLoading: false,
      showCurrPwd: true,
      userReadOnly: false,
      userID: ""
    };
  }

  componentDidMount = () => {
    //debugger;
    if (this.props.match.params.secToken) {
      this.setState({ showCurrPwd: false, userReadOnly: true });
      this.props.checkToken({
        type: changePWDTypes.CHK_TOKEN_REQUEST,
        token: this.props.match.params.secToken
      });
      this.newPWD.focus();
    } else {
      this.setState({ showCurrPwd: true, userReadOnly: false });
      this.userID.focus();
    }
    //console.log(this.props.location);
    //console.log(this.props.match.params);
    //console.log(this.props.location.state.params);
  };

  componentDidUpdate(prevProps, prevState) {
    //debugger;
    if (this.props.changePWDState.message.val != "0") {
      alert(this.props.changePWDState.message.msg);
      this.setState({ isLoading: false });
      this.props.resetMessage({
        type: changePWDTypes.MESSAGE,
        message: { val: 0, msg: "" }
      });

      if (this.props.changePWDState.message.val == 1) {
        this.props.history.push("/login");
      }
      //this.props.history.push("/logon", ...this.state);
      //this.props.history.push('/test', ...this.state);
    } else {
    }

    if (this.props.changePWDState.userID != "" && this.state.userID === "") {
      this.setState({
        userID: this.props.changePWDState.userID
      });
    }
  }

  cancel = () => {
    this.props.history.push("/login");
  };

  changePWD = () => {
    //debugger;
    if (this.userID.value.trim() == "") {
      alert("Please enter the user ID");
      this.userID.focus();
      return false;
    }

    if (this.state.showCurrPwd) {
      if (this.currPWD.value.trim() == "") {
        alert("Please enter the current password");
        this.currPWD.focus();
        return false;
      }
    }

    if (this.newPWD.value.trim() == "") {
      alert("Please enter the new password");
      this.newPWD.focus();
      return false;
    }

    if (this.newPWD1.value.trim() == "") {
      alert("Please re-enter the new password");
      this.newPWD1.focus();
      return false;
    }

    let invalidPWD = passwordRules(this.newPWD.value, {
      requireSpecial: true
    });

    if (!invalidPWD) {
      //debugger;

      if (this.newPWD.value.trim() != this.newPWD1.value.trim()) {
        alert(
          "Please make sure that the re-entered password matches with the new password"
        );
        return false;
      }

      this.setState({ isLoading: true });

      this.props.changePWD({
        type: changePWDTypes.UPD_PWD_REQUEST,
        userID: _.trim(this.userID.value),
        currPWD: this.state.showCurrPwd
          ? _.trim(this.currPWD.value)
          : _.trim(this.newPWD.value),
        newPWD: _.trim(this.newPWD.value),
        emailReset: this.state.showCurrPwd ? "N" : "Y"
      });
    } else {
      let msg = "";
      //console.log(invalidPWD);

      msg = invalidPWD.issues.reduce((prev, current) => {
        //debugger;
        return prev + current.message + "\n";
      }, "");
      alert(msg);
    }
  };

  render() {
    return (
      <div style={styles.container}>
        <div className="App" style={{ height: "100vh" }}>
          <div  style={{margin:"20px"}}>
            <img src={clientlogo} className="mx-auto my-2" />
            <h2 className="text-danger">Welcome to Cadet Systems</h2>
          </div>
          <Container
            className="mx-auto"
            fluid
            style={{ width: "960px", height: "600px" }}
          >
            <Row>
              <Col sm="2" />
              <Col sm="5">
                <Card>
                  <CardHeader>Change Password</CardHeader>
                  <CardBody>
                    <Form>
                      <FormGroup row>
                        <Col sm={12}>
                          <InputGroup size="sm">
                            <InputGroupAddon>
                              <i className="fa fa-user fa-fw" />
                            </InputGroupAddon>
                            <Input
                              size="sm"
                              type="text"
                              value={this.state.userID}
                              onChange={e =>
                                this.setState({ userID: e.target.value })}
                              readOnly={this.state.userReadOnly}
                              id="userID"
                              innerRef={input => {
                                this.userID = input;
                              }}
                              placeholder="User ID"
                            />
                          </InputGroup>
                        </Col>
                      </FormGroup>
                      {this.state.showCurrPwd && (
                        <FormGroup row>
                          <Col sm={12}>
                            <InputGroup size="sm">
                              <InputGroupAddon>
                                <i className="fa fa-lock fa-fw" />
                              </InputGroupAddon>

                              <Input
                                size="sm"
                                type="password"
                                id="currPWD"
                                innerRef={input => {
                                  this.currPWD = input;
                                }}
                                placeholder="Current Password"
                              />
                            </InputGroup>
                          </Col>
                        </FormGroup>
                      )}
                      <FormGroup row>
                        <Col sm={12}>
                          <InputGroup size="sm">
                            <InputGroupAddon>
                              <i className="fa fa-unlock fa-fw" />
                            </InputGroupAddon>
                            <Input
                              size="sm"
                              type="password"
                              id="newPWD"
                              innerRef={input => {
                                this.newPWD = input;
                              }}
                              placeholder="New Password"
                            />
                          </InputGroup>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col sm={12}>
                          <InputGroup size="sm">
                            <InputGroupAddon>
                              <i className="fa fa-unlock-alt fa-fw" />
                            </InputGroupAddon>
                            <Input
                              size="sm"
                              type="password"
                              id="newPWD1"
                              innerRef={input => {
                                this.newPWD1 = input;
                              }}
                              placeholder="Reenter New Password"
                            />
                          </InputGroup>
                        </Col>
                      </FormGroup>
                    </Form>
                    <br />
                    <div className="float-right">
                      <Button
                        size="sm"
                        color="secondary"
                        onClick={this.cancel}
                        className="text-white"
                      >
                        {" "}
                        Cancel
                      </Button>
                      {"  "}
                      <Button
                        size="sm"
                        color="primary"
                        onClick={this.changePWD}
                      >
                        {" "}
                        Change password
                      </Button>
                      {this.state.isLoading ? (
                        <div className="py-2 mx-auto">
                          <i class="fa fa-spinner fa-spin fa-2x fa-fw" />
                        </div>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col sm="5">
                <Card body inverse color="warning">
                  <CardHeader>Password Must:</CardHeader>
                  <CardBody>
                    <ul>
                      <li>Password must be at least 8 letters long</li>
                      <li>Password must contain a Capital letter</li>
                      <li>Password must contain a number</li>
                      <li>Password must contain a special character</li>
                    </ul>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  //debugger;
  return {
    changePWDState: state.changePWDState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      ...changePWDActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
