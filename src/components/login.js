import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactDOM from "react-dom";

import clientlogo from "../images/Universe.png";
import bgImg from "../images/Universe.jpg";
import "../App.css";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Paper from "material-ui/Paper";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import CircularProgress from "material-ui/CircularProgress";
import * as _ from "lodash";
import { bindActionCreators } from "redux";
import { types as authTypes } from "../reducers/authreducer";
import { actions as authActions } from "../reducers/authreducer";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import passwordRules from "password-rules";
import { Tooltip } from "reactstrap";
import RefreshIndicator from "material-ui/RefreshIndicator";
import { Container } from "reactstrap";

//import { actions as messageActions } from 'ducks/message'

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

const paperStyle = {
  height: "280px",
  width: "500px",
  margin: 20,
  textAlign: "center",
  display: "flex",
  justifyContent: "center"
};

const font11 = {
  color: "#0b4981",
  fontFamily: "Roboto,sans-serif",
  fontSize: "14px"
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      isLoading: false,
      error: null,
      items: [],
      message: "",
      value: "",
      tooltipOpen: false,
      txtUser: "",
      txtPwd: "",
      hv_staff_id : -1,
      userid: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.tooltipToggle = this.tooltipToggle.bind(this);
  }

  tooltipToggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  handleChange = (event, index, value) => {
    this.setState({ value });
  };

  fetchData(url) {
    this.setState({ isLoading: true });
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        this.setState({ isLoading: false });
        return response;
      })
      .then(response => response.json())
      .then(items => this.setState({ items }))
      .catch(() => this.setState({ hasErrored: true }));
  }

  componentDidUpdate(prevProps, prevState) {
  //componentWillReceiveProps(nextProps) {
    ////debugger;
    if (this.props.authState.message.msg == "ok") {
      ////debugger;
      //this.context.router.history.push('/grid', ...this.state);
      //alert("token: " + sessionStorage.getItem("token"));
      //this.props.history.push
      //this.props.history.push('/attrib', ...this.state);
      //alert(this.props.authState.hv_staff_id);
      this.setState({ isLoading: false, name: this.props.authState.name, hv_staff_id:  this.props.authState.hv_staff_id, userid:this.txtUser.getValue()});
      this.props.resetMessage({
        type: authTypes.MESSAGE,
        message: ""
      });
      this.props.history.push("/tabs", ...this.state);
      //this.props.history.push('/test', ...this.state);
    } else {
      
      if (
        _.trim(this.props.authState.message.msg) != "" &&
        this.props.authState.message.msg != "ok"
      ) {
        //alert("msg")
        this.setState({ isLoading: false });
        alert(this.props.authState.message.msg);

        this.props.resetMessage({
          type: authTypes.MESSAGE,
          message: { val: 0, msg: "" }
        });

        this.setState({
          txtUser: "",
          txtPwd: ""
        });
        this.txtUser.focus();
        //alert(this.props.authState.message.val)
        if (this.props.authState.message.val == -2) {
          this.props.history.push("/changepwd");
        }

        //Reset the message
      }
    }
  }

  changePWD = () => {
    this.props.history.push("/changepwd", ...this.state);
  };

  forgotPWD = () => {
    this.props.history.push("/forgotpwd", ...this.state);
  };

  componentDidMount() {
    //this.fetchData('http://5826ed963900d612000138bd.mockapi.io/items');
  }

  _handleTouchTap = () => {
    //console.log(this.refs)
    //alert(this.refs["txtUser"].getValue())
    //alert(this.txtPwd.getValue())

    //ReactDOM.findDOMNode(this.refs["txtUser"]).focus()
    if (this.txtUser.getValue() == "") {
      alert("Please Enter User ID");
      this.txtUser.focus();
      return false;
    }

    if (this.txtPwd.getValue() == "") {
      alert("Please Enter Password");
      this.txtPwd.focus();
      return false;
    }

    let invalidPWD = passwordRules(this.txtPwd.getValue(), {
      requireSpecial: true
    });

    if (!invalidPWD || 1 === 1) {
      ////debugger;
      this.setState({ isLoading: true});

      this.props.login({
        type: authTypes.LOGIN_REQUEST,
        payload: {
          user: this.txtUser.getValue(),
          password: this.txtPwd.getValue()
        }
      });
    } else {
      let msg = "";
      console.log(invalidPWD);

      msg = invalidPWD.issues.reduce((prev, current) => {
        ////debugger;
        return prev + current.message + "\n";
      }, "");
      alert(msg);
    }
    //this.context.router.history.push('/grid');
  };

  handleKeyPress = event => {
    ////debugger;
    if (event.target.charCode == 13) {
      alert("Enter clicked!!!");
    }
  };

  render() {
    if (this.state.hasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    /*
    return (      
    )
    
    <div style={{height:"21vh",backgroundImage:`url(${clientlogo})`,backgroundRepeat:"no-repeat",backgroundSize:"10%",backgroundPosition:"center"}}></div>
           <img src={clientlogo} className="img-fluid"/>
     <img src={clientlogo} className="mx-auto"  />
    {this.props.authState.message == "ok" ? (<div style={font11}> Log on Succesfull </div>) : this.props.authState.message}
    */

    return (
      <div style={styles.container}>
        <Container
          fluid
          style={{
            overflow: "hidden",
            margin: "20px"
          }}
        >
          <div className="App">
            <div>
              <img src={clientlogo} className="mx-auto my-2" />
              <h2 className="text-danger">Welcome to Universe</h2>
            </div>
            <div className="d-flex justify-content-center">
              <Paper style={paperStyle} zDepth={5}>
                <table style={{ cellSpacing: "20px" }} className="w-75">
                  <tbody>
                    <tr>
                      <td colSpan="2">
                        <br />
                      </td>
                    </tr>
                    <tr>
                      <td style={font11} className="text-left">
                        User ID:
                      </td>
                      <td style={font11}>
                        <TextField
                          ref={element => (this.txtUser = element)}
                          value={this.state.txtUser}
                          style={font11}
                          onChange={e =>
                            this.setState({ txtUser: e.target.value })}
                          hintText="Enter User ID"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={font11} className="text-left">
                        Password:
                      </td>
                      <td style={font11}>
                        <TextField
                          id="txtPassword"
                          type="password"
                          ref={element => (this.txtPwd = element)}
                          onChange={e =>
                            this.setState({ txtPwd: e.target.value })}
                          style={font11}
                          hintText="Enter Password"
                          value={this.state.txtPwd}
                          onKeyPress={ev => {
                            //console.log(`Pressed keyCode ${ev.key}`);
                            if (ev.key === "Enter") {
                              // Do code here
                              this._handleTouchTap();
                              ev.preventDefault();
                            }
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td />
                      <td className="text-primary d-flex justify-content-between p-3">
                        <h6
                          style={{ cursor: "pointer" }}
                          onClick={this.forgotPWD}
                        >
                          Forgot password ?
                        </h6>{" "}
                        {""}{" "}
                        <h6
                          style={{ cursor: "pointer" }}
                          onClick={this.changePWD}
                        >
                          Change password
                        </h6>{" "}
                      </td>
                    </tr>

                    {/*
                <tr>
                  <td style={font11}>Application:</td>
                  <td>
                    <SelectField
                      //floatingLabelText="Application"
                      value={1}
                      onChange={this.handleChange}
                      style={{ textAlign: 'left' }}
                    >
                      <MenuItem value={1} primaryText="Case Management" />
                      <MenuItem value={2} primaryText="Budgeting" />
                      <MenuItem value={3} primaryText="InstaBooks" />
                    </SelectField>
                  </td>
                </tr>
                <div style={{ position: "relative" }}>                        
                        <RefreshIndicator
                            size={40}
                            left={0}
                            top={10}
                            percentage={60}
                            loadingColor="#FF9800"
                            status="loading"
                            style={style.refresh}
                          />
                      </div>
                */}
                    <tr>
                      <td colSpan="2">
                        <RaisedButton
                          className="rounded"
                          label="Login"
                          fullWidth={true}
                          primary={true}
                          onClick={this._handleTouchTap}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        {this.state.isLoading ? (
                          <div className="py-2">
                            <i className="fa fa-spinner fa-spin fa-2x fa-fw" />
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Paper>
            </div>

            {/*
        <div className="d-flex justify-content-center">
          <FormText color="primary"><h6>New Customer? SIGN UP</h6></FormText>
        </div>
        */}
            <Tooltip
              placement="right"
              isOpen={this.state.tooltipOpen}
              target="txtPassword"
              toggle={this.tooltipToggle}
            >
              Password must be at least 8 letters long<br />
              Password must contain a Capital Letter<br />
              Password must contain a number<br />
              Password must contain a special character<br />
            </Tooltip>
          </div>
        </Container>
      </div>
    );
  }
}

/*
Login.contextTypes = {
  router: PropTypes.object.isRequired,
};
*/

Login.defaultProps = {};

//App.propTypes = {
//};

const mapStateToProps = state => {
  return {
    authState: state.authState
    //items: state.items,
    //message: state.message,
    //hasErrored: state.itemsHasErrored,
    //isLoading: state.itemsIsLoading
  };
};

/*
const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (action) => dispatch(action),
  };
};
*/

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      ...authActions
      //...messageActions,
      //...navigationActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
//export default App;
