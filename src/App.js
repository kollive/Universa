
import React, { Component, PropTypes } from 'react'
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
import Main from "./Main";
import Login from "./components/login";
import TimeOut from "./components/TimeOut";
import Attributes from "./components/AttribTables";
import AttribTable from "./components/AttribTable";
import AppNavigation from "./components/NavBar";
import ListItems from "./components/ListItems";
import ShowData from "./components/showdata";
import ForgotPassword from "./components/ForgotPassword";
import ChangePassword from "./components/ChangePassword";
import ReactStrapComp from "./components/ReactStrap";
import CadetsSearch from "./components/CadetsSearch";
import CadetInlineSearch from "./components/CadetInlineSearch";
import Admin from "./components/Admin";
import UserComponent from './components/Users/MaintainUsers';
import CadetDetails from "./components/CadetDetails";
import logo from "./logo.svg";

import "./App.css";
import { Button, Container, Row, Col } from "reactstrap";
import CadetHeader from "./components/cadetheader";
import MainNavList from "./components/MainNavList";
import HomeComponent from "./components/HomeMainComponent";
// Import primereact 
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import "./App.css";
import UsersList from "./components/Users/usersList";
import Roles from "./components/Roles";
import Calendar from "./components/Calendar";
import Timesheet from "./components/Timesheet/Timesheet";

import IdleTimer from 'react-idle-timer';
import {
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";

const Root = props => <div {...props} />;


const HeaderBar = props => (
  <div
    style={{
      width: "100vw",
      height: "20vh",
      overflow: "none"
    }}
    {...props}
  />
);
const MainDiv = props => <div {...props} />;

export class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      timeout: 900000,
      remaining: null,
      isIdle: false,
      lastActive: null,
      elapsed: null,
      modal: false,
      message: ""
    }

    this.modalToggle = this.modalToggle.bind(this);
    //this.showTO = this.showTO.bind(this);
  }

  modalToggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  componentDidMount() {
    //alert("mount")
    this.setState({
      remaining: this.refs.idleTimer.getRemainingTime(),
      lastActive: this.refs.idleTimer.getLastActiveTime(),
      elapsed: this.refs.idleTimer.getElapsedTime()
    });

    let intervalHandle = setInterval(() => {
      if (!this.refs.idleTimer.getRemainingTime() > 0) {
        //alert("Timed Out");        
        //this.refs.idleTimer.pause();
        //console.log(this.props.location)
        //console.log(window.location.pathname)
        if (window.location.pathname == "/login") {
          //console.log("in Reset")
          this.refs.idleTimer.reset();
        } else {
          clearInterval(intervalHandle);
          this.setState({
            modal: true,
            message: `Your Session has timed out.\nPlease Login to continue.`
          });
        }
        //return false;
      }

      this.setState({
        remaining: this.refs.idleTimer.getRemainingTime(),
        lastActive: this.refs.idleTimer.getLastActiveTime(),
        elapsed: this.refs.idleTimer.getElapsedTime()
      });

    }, 1000);
  }

  showTO = () => {
    this.setState({ modal: true });
  };

  closeTimeOut = () => {
    this.setState({ modal: false });

    let intervalHandle = setInterval(() => {
      if (!this.refs.idleTimer.getRemainingTime() > 0) {
        //alert("Timed Out");        
        //this.refs.idleTimer.pause();
        clearInterval(intervalHandle);
        this.setState({ modal: true });
        //return false;
      }

      this.setState({
        remaining: this.refs.idleTimer.getRemainingTime(),
        lastActive: this.refs.idleTimer.getLastActiveTime(),
        elapsed: this.refs.idleTimer.getElapsedTime()
      });

    }, 1000);
    //this.refs.idleTimer.resume();
    //this.refs.idleTimer.reset();
  }

  _onActive = () => {
    //alert("on Active")
    this.setState({ isIdle: false });
  }

  _onIdle = () => {
    this.setState({ isIdle: true });
  }

  _changeTimeout = () => {
    this.setState({
      timeout: this.refs.timeoutInput.state.value()
    });
  }

  _reset = () => {
    this.refs.idleTimer.reset();
  }

  _pause = () => {
    this.refs.idleTimer.pause();
  }

  _resume = () => {
    this.refs.idleTimer.resume();
  }

  //const App = props => {
  //const { history } = props;
  /*
  <div>
              <h3>Timeout: {this.state.timeout}ms</h3>
              <h3>Time Remaining: {this.state.remaining}</h3>
              <h3>Time Elapsed: {this.state.elapsed}</h3>
              <h3>Last Active: {this.state.lastActive}</h3>
              <h3>Idle: {this.state.isIdle.toString()}</h3>
            </div>
  */
  render() {
    return (
      <IdleTimer
        ref="idleTimer"
        element={document}
        activeAction={this._onActive}
        idleAction={this._onIdle}
        timeout={this.state.timeout}
        format="MM-DD-YYYY HH:MM:ss.SSS">
        <MainDiv>
          <Container fluid>
            <Row>
              <Col>
                <ConnectedRouter history={this.props.history}>
                  <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/forgotpwd" component={ForgotPassword} />
                    <Route path="/changepwd/:secToken" render={props => <ChangePassword {...this.props} />} />
                    <Route path="/changepwd" component={ChangePassword} />
                    <Route path="/listitems" component={ListItems} />
                    <Route path="/cadet" component={CadetsSearch} />
                    <Route path="/cadetinline" component={CadetInlineSearch} />
                    <Route path="/admin" component={Admin} />
                    <Route path="/calendar" component={Calendar} />
                    <Route
                      path="/cadetdetails"
                      render={props => <CadetDetails {...this.props} />}
                    />
                    <Route
                      path="/attribtable"
                      render={match => <AttribTable {...match} />}
                    />
                    <Route path="/test" component={ShowData} />
                    <Route
                      path="/tabs"
                      render={props => <ReactStrapComp {...this.props} />}
                    />
                    <Route
                      path="/users"
                      render={props => <UserComponent {...this.props} />}
                    />
                    <Route
                      path="/homes"
                      render={props => <HomeComponent {...this.props} />}
                    />
                    <Route
                      path="/userslist"
                      render={props => <UsersList {...this.props} />}
                    />
                    <Route
                      path="/Roles"
                      render={props => <UsersList {...this.props} />}
                    />
 <Route
                      path="/Timesheet"
                      render={props => <Timesheet {...this.props} />}
                    />
                    <Route path="/" component={Main} />
                  </Switch>
                </ConnectedRouter>
              </Col>
            </Row>
          </Container>
        </MainDiv>
        <Modal size="md"
          isOpen={this.state.modal}
        >
          <ModalBody>
            <TimeOut {...this.props} closeTimeOut={this.closeTimeOut} message={this.state.message} />
          </ModalBody>
        </Modal>
      </IdleTimer>

    );
  };
}
export default App;
