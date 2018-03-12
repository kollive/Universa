import React, { Component } from "react";
import PropTypes from "prop-types";

import clientlogo from "../images/cadetlogo.png";
import "../App.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { types as forgotPWDTypes } from "../reducers/forgotpwdreducer";
import { actions as forgotPWDActions } from "../reducers/forgotpwdreducer";
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
  DropdownItem
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

export class ForgotPassword extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
    this.reqPassword = this.reqPassword.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    //debugger;
    if (this.props.forgotPWDState.message.val != "0") {
      alert(this.props.forgotPWDState.message.msg);
      this.setState({ isLoading: false });
      this.props.resetMessage({
        type: forgotPWDTypes.MESSAGE,
        message: { val: 0, msg: "" }
      });

      if (this.props.forgotPWDState.message.val == 1) {
        this.props.history.push("/login");
      }
      //this.props.history.push("/logon", ...this.state);
      //this.props.history.push('/test', ...this.state);
    } else {
    }
  }

  reqPassword = () => {
    //debugger;
    if (
      this.textInput.value == "" ||
      !this.textInput.value.match(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      )
    ) {
      alert("Please Enter Valid Email Address");
      this.textInput.focus();
      return false;
    }

    this.setState({ isLoading: true });

    this.props.checkEmail({
      type: forgotPWDTypes.CHECK_EMAIL_REQUEST,
      email: _.trim(this.textInput.value)
    });
    //sendEmail
  };

  render() {
    return (
      <div style={styles.container}>
        <div className="App" style={{ height: "100vh" }}>
          <div style={{ margin: "20px" }}>
            <img src={clientlogo} className="mx-auto my-2" />
            <h2 className="text-danger">Welcome to Cadet Systems</h2>
          </div>
          <Container
            fluid
            style={{ width: "500px", height: "600px" }}
            className="d-flex align-items-start"
          >
            <Card>
              <CardHeader>Password Recovery</CardHeader>
              <CardBody>
                <CardText>
                  Enter in your email address and we'll send you a link to reset
                  your password
                </CardText>
                <InputGroup>
                  <InputGroupAddon>@</InputGroupAddon>
                  <Input
                    placeholder="Email"
                    innerRef={input => {
                      this.textInput = input;
                    }}
                  />
                </InputGroup>
                <br />
                <div className="float-right">
                  <Button
                    color="secondary"
                    onClick={() => this.props.history.push("/login")}
                  >
                    Cancel
                  </Button>
                  {"  "}
                  <Button color="primary" onClick={this.reqPassword}>
                    {" "}
                    Request new password
                  </Button>
                  <br />
                  {this.state.isLoading ? (
                    <div className="vw100 py-2">
                      <i class="fa fa-spinner fa-spin fa-2x fa-fw" />
                    </div>
                  ) : null}
                </div>
              </CardBody>
            </Card>{" "}
            {/*
            <a href={"http://hvs.selfip.net:4003/excel"} download={"test.xlsx"}>
              {" "}
              Download Excel
            </a> */}
          </Container>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  //debugger;
  return {
    forgotPWDState: state.forgotPWDState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      ...forgotPWDActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
