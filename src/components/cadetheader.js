import React, { Component } from "react";
import cadetlogo from "../images/Universe Logo.png";
import cadettitle from "../images/UTitle.png";
import "../App.css";
import { actions as headerActions } from "../reducers/cdheaderreducer";
import { types as headertypes } from "../reducers/cdheaderreducer";
import { Container, Row, Col, Alert } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import Avatar from "material-ui/Avatar";

class CadetHeader extends React.Component {
  constructor(props) {
    super(props);

    this.items = [];

    this.state = {
      items: [
        {
          user: "",
          img: ""
        }
      ],
      locationinfo: "3201 Oak Hill Drive, Laurel, Maryland 20724"
    };
  }

  componentDidMount() {
    //debugger;
    //alert(this.props.location.state.params.hv_table_i)
    //alert(this.props.name)
    this.props.renderHeader({
      type: headerActions.renderHeader,
      loadheader: {
        userid: "sv"
      }
    });
  }
  componentDidUpdate(prevProps, prevState) {
    //debugger;
    console.log("componentDidUpdate");
    //console.log(this.state.items[0].user);
  }
  componentWillReceiveProps(nextProps) {
    //debugger;
    this.state.items = nextProps.headerState.items;
  }

  componentWillMount = () => {
    //debugger;
  };

  render() {
    //debugger;
    return (
      <div>
        <Row>
          <Col sm="11">
            <div>
              <img src={cadetlogo} className="App-logo"  alt="logo" />
              {/*}<img
                src={cadettitle}
                height="60"
                alt="logoTitle"
                className="px-0"
              />*/}
              <span style={{"padding-left":"20px", "font-family":"Arial","letter-spacing": "0rem", "font-size":"1.5rem","color":"#4d6788" }} >uni</span>
              <span style={{"font-family":"Arial","letter-spacing": "0rem", "font-size":"1.5rem","color":"#698dba" }} >verse</span>
              {/*<h3 className="d-inline align-middle">Welcome to React</h3>*/}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="float-left header-label px-4">
              {this.state.locationinfo}
            </div>
          </Col>
          <Col>
            <div
              className="float-right  header-label px-2"
              style={{ fontWeight: "bold", color: "#102027" }}
            >
              Welcome, {this.props.name || "Blackwell, Raynald"} {" "}
              <i className="fa fa-sign-out fa-lg fa-fw" style={{cursor:"pointer"}} onClick={()=> this.props.history.push("/login")}></i>
            </div>
          </Col>

        </Row>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    headerState: state.headerState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      ...headerActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(CadetHeader);
