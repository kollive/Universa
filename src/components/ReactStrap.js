import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import cadetlogo from "images/cadetlogo.png";
import cadettitle from "images/cadettitl.png";
import CadetHeader from "./cadetheader";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
import Toggle from "material-ui/Toggle";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import NavigationClose from "material-ui/svg-icons/navigation/close";
import Avatar from "material-ui/Avatar";
import FileFolder from "material-ui/svg-icons/file/folder";
import FontIcon from "material-ui/FontIcon";
import List from "material-ui/List/List";
import ListItem from "material-ui/List/ListItem";
import { Tabs, Tab } from "material-ui/Tabs";
import Drawer from 'material-ui/Drawer';

import StaffList from "./Staff/StaffList";
    
import {
  blue300,
  indigo900,
  orange200,
  deepOrange300,
  pink400,
  purple500
} from "material-ui/styles/colors";
import Paper from "material-ui/Paper";

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
  CardText,
  Row,
  Col,
  DropdownToggle,
  CardImg,
  CardSubtitle,
  CardHeader
} from "reactstrap";
import HomeComponent from "./HomeMainComponent";
import BAS from "./BAS";
import BudgetStaff from "./BudgetStaff";
import Reports from "./Reports";
import Course from "./Course";
import Admin from "./Admin";

import CadetsSearch from "./CadetsSearch";
import AttribList from "./AttribTables";
import TimeSheet from "./TimeSheet";

import BAP from "./BAP";
import Calendar from "./Calendar"

import "App.css";

const tabStyles = {
  // backgroundColor: "#D3D3D3",
  //   color:"black",
  default_tab: {
    color: "#000000",
    backgroundColor: "#D3D3D3",
    fontWeight: 400,
  },
  active_tab: {
    color: "#D3D3D3",
  }
};

const styles = {
  margin: 12,
  refresh: {
    display: "inline-block",
    position: "relative"
  },

  container: {
    overflowX: "hidden",
    overflowY: "scroll",
    margin: "0px",
    width: "98vw",
    height: "99vh",
    padding: "0px"
    //backgroundImage: `url(${bgImg})`,
    // backgroundSize: "100%",
    // backgroundPosition:"center",
    // backgroundRepeat:"no-repeat",
    // backgroundColor: "#51b8e1"
  }
};
const paperStyle = {
  height: "80px",
  width: "99.2%",
  margin: 5,
  backgroundColor: '#ecf0f6'
  // textAlign: "left",
  // display: "flex",
  // justifyContent: "left"
};
const FirstFunctional = props => {
  return <div onClick={() => props.showMessage("Child")}>{props.name}</div>;
};

export class ReactStrapComp extends Component {
  static propTypes = {
    //name: PropTypes.string.isRequired
  };

  showMessage(msg) {
    alert(msg);
  }
  constructor(props) {
    super(props);
    console.log("************")
    console.log(props)
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: "1",
      collapse: false,
      status: "Closed",
      cadetName: "",
      activeTab: "0",
      open: false
    };

    this.cadetSearch = this.cadetSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  handleActive(tab) {
    alert(
      `A tab with this route property ${tab.props["data-route"]} was activated.`
    );
  }

  cadetSearch(cadet) {
    //alert(cadet.hv_cadet_name);
    this.setState({
      cadetName: cadet.hv_cadet_name
    });
    this.setState({
      activeTab: "1"
    });
  }

  handleChange = value => {
    debugger
    //alert(value)
    this.setState({
      activeTab: value
    });

  };

  render() {
let showlist=false
    return (

      <div style={styles.container}>

        <Card style={{ height: "100%", width: "100%" }}>
          <span
            className="float-left px-2"
            style={{ fontWeight: "bold", color: "#102027" }}
          >
            <i className="fa fa-bars fa-lg fa-fw" style={{ cursor: "pointer" }} onClick={() => this.setState({ open: !this.state.open })}></i>
          
          <Paper style={paperStyle} zDepth={1}>
            <CadetHeader name={this.props.name} {...this.props} />
          </Paper>
          </span>
          <Tabs
            value={this.state.activeTab}
            onChange={this.handleChange}
            inkBarStyle={{ background: 'blue' }}
            style={{ height: "100%", width: "100%" }}
          >
            <Tab
              style={tabStyles.default_tab}
              label="Home"
              value="0"
              icon={<FontIcon className="fa fa-home" style={{ color: "darkgrey" }} />}
            >
            <TimeSheet {...this.props} /> 
              {/*<HomeComponent callParentSearch={this.cadetSearch} parentSwitchTab={this.handleChange} /> */}
            </Tab>
            <Tab
              style={tabStyles.default_tab}
              label="Staff"
              value="1"
              data-route="/StaffList"
              icon={<FontIcon className="fa fa-home" style={{ color: "darkgrey" }}/>}   onActive= {() => {
                    
                   }}>
                      <StaffList
                           {...this.props}
                        />
              
             
            
            </Tab>
            {/*           {(() =>{
                           alert(showlist)
                          if(showlist)
                           <StaffList
                          {...this.props}
                        />
    })}
            <Tab  <StaffList
                          {...this.props}
                        />
              style={tabStyles.default_tab}
              label="Staff and Budget"
              value="2"
              icon={<FontIcon className="fa fa-users" style={{color:"darkgrey" }}/>}
            >
              <BAP />
            </Tab>
            <Tab
              style={tabStyles.default_tab}
              label="Course Schedule"
              value="3"
              icon={<FontIcon className="fa fa-calendar" style={{color:"darkgrey" }}/>}
            >
              <Calendar />
            </Tab>
            */}
            <Tab
              style={tabStyles.default_tab}
              label="Approvals"
              value="4"
              icon={<FontIcon className="fa fa-check-circle" style={{ color: "darkgrey" }} />}
            >
              <BAS />
            </Tab>{" "}
            <Tab
              style={tabStyles.default_tab}
              label="Reports"
              value="5"
              icon={<FontIcon className="fa fa-line-chart" style={{ color: "darkgrey" }} />}
            >
              <Reports />
            </Tab>{" "}
            <Tab
              style={tabStyles.default_tab}
              label="Admin"
              value="6"
              icon={<FontIcon className="fa fa-cog" style={{ color: "darkgrey" }} />}
            >
              <Row className="m-0 p-0">
                <Col sm="12">
                  <Container
                    fluid
                    style={{
                      overflow: "hidden",
                      margin: "2px",
                      position: "relative"
                    }}
                  >

                    <Row>
                      {" "}
                      <Col sm="12">
                        <Admin {...this.props} />
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Card>
        <Drawer open={this.state.open}  docked={false}  onRequestChange={(open) => this.setState({open})} width={250} openSecondary={true}>
          <AppBar
            title="Universe"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
          <MenuItem>Menu Item</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
        </Drawer>
      </div>

    );
  }
}

const mapStateToProps = state => {
  //debugger;
  //alert(state.authState.name)
  return {
    name: state.authState.name
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ReactStrapComp);
