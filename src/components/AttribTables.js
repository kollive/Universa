import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
//import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Table } from "reactstrap";
import { ListGroup, ListGroupItem, Badge } from "reactstrap";

import AttribTable from "./AttribTable";
import TextField from "material-ui/TextField";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";

import CircularProgress from "material-ui/CircularProgress";
import * as _ from "lodash";
import { bindActionCreators } from "redux";
import { types as attribTypes } from "../reducers/attribreducer";
import { actions as attribActions } from "../reducers/attribreducer";
import classnames from "classnames";
import {
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
  Button
} from "reactstrap";

import {
  TabContent,
  TabPane,
  Card,
  Collapse,
  CardBody,
  CardTitle,
  CardText,
  Label
} from "reactstrap";

const styles = {
  link: {
    cursor: "pointer"
  },
  propContainer: {
    width: 400,
    overflow: "hidden",
    margin: "20px"
  },
  propToggleHeader: {
    margin: "20px auto 10px"
  },
  radioButton: {
    marginTop: 16
  }
};

class AttribList extends Component {
  componentWillReceiveProps(nextProps) {
    //debugger;
    console.log(nextProps);
    if (
      this.props.tableTag != nextProps.tableTag &&
      nextProps.tableTag !== ""
    ) {
      //alert("in Tables")
      this.setState({ inDetailsTab: false, activeTab: "1" });
      this.props.getAttribTables({
        type: attribTypes.FETCH_TABLES_REQUEST,
        tableTag: nextProps.tableTag ? nextProps.tableTag : ""
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //debugger;

    return true;
    /*
        if (this.props.isLoading !== nextProps.isLoading) {
            return true;
        }
        if (this.state.items !== nextState.items) {
            return true;
        }
        return true;
        */
  }

  componentDidMount() {
    //debugger;

    if (this.props.tableTag) {
      //alert("in Tables")
      this.props.getAttribTables({
        type: attribTypes.FETCH_TABLES_REQUEST,
        tableTag: this.props.tableTag ? this.props.tableTag : ""
      });
    }
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.attribTable = null;

    this.state = {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: true,
      enableSelectAll: true,
      deselectOnClickaway: true,
      showCheckboxes: true,
      height: "300px",
      items: [],
      mode: undefined,
      itemsHasErrored: false,
      itemsIsLoading: false,
      hv_table_i: 1,
      inDetailsTab: false,
      activeTab: "1",
      tableName: ""
    };
  }

  itemClick = row => {
    //debugger;
    console.log(row);

    this.setState({
      hv_table_i: row.hv_table_i,
      inDetailsTab: true,
      activeTab: "2",
      tableName: row.hv_table_name
    });
    //this.attribTable.renderData(row.hv_table_i);
    //this.props.history.push("/attribtable", { params: row });
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  renderTables(Items) {    
    return(
      <Row className="p-0 mt-1">
      <Col sm="4">      
        <ListGroup>
          {Items.map((row, index) => (
            (index < 6 ?
            <ListGroupItem className="border-0"
              style={{
                cursor: "pointer"
              }}
              key={index}
              onClick={() => {
                this.itemClick(row);
              }}
            >
              {row.hv_table_name} <Badge pill>{row.hv_count}</Badge>
            </ListGroupItem>
            : null
            )
          ))
        }
        </ListGroup>
      </Col>
      <Col sm="4">      
        <ListGroup>
          {Items.map((row, index) => (
            (index >= 6 && index < 12 ?
            <ListGroupItem  className="border-0"
              style={{
                cursor: "pointer"
              }}
              key={index}
              onClick={() => {
                this.itemClick(row);
              }}
            >
              {row.hv_table_name} <Badge pill>{row.hv_count}</Badge>
            </ListGroupItem>
            : null
            )
          ))
        }
        </ListGroup>
      </Col>
      <Col sm="4">      
        <ListGroup>
          {Items.map((row, index) => (
            (index >= 12 && index < 17 ?
            <ListGroupItem  className="border-0"
              style={{
                cursor: "pointer"
              }}
              key={index}
              onClick={() => {
                this.itemClick(row);
              }}
            >
              {row.hv_table_name} <Badge pill>{row.hv_count}</Badge>
            </ListGroupItem>
            : null
            )
          ))
        }
        </ListGroup>
      </Col>
    </Row>    
    )
  }

  render() {
    return (
      <div>
        <Container
          fluid
          style={{
            overflow: "hidden",
            margin: "1px"
          }}
        >
          <Nav tabs className="m-0 p-0">
            {!this.state.inDetailsTab && (
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
                  <i className="fa fa-home" />{" "}
                  {this.props.tableName
                    ? this.props.tableName
                    : "Attribute Tables"}
                </NavLink>
              </NavItem>
            )}
            {this.state.inDetailsTab && (
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
                  <i className="fa fa-podcast" />{" "}
                  {this.props.tableName ? this.props.tableName : "Attribute"}
                </NavLink>
              </NavItem>
            )}
          </Nav>

          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              {/*
              <Row className="p-0 mt-1">
                <Col sm="12">
                  <ListGroup>
                    {this.props.attribState.items.map((row, index) => (
                     
                      <ListGroupItem
                        style={{
                          cursor: "pointer"
                        }}
                        key={index}
                        onClick={() => {
                          this.itemClick(row);
                        }}
                      >
                        {row.hv_table_name} <Badge pill>{row.hv_count}</Badge>
                      </ListGroupItem>
                     
                    ))}
                  </ListGroup>
                </Col>
              </Row>
               */}
              {this.props.attribState.items.length < 6 ? (
                <Row className="p-0 mt-1">
                  <Col sm="4">
                    <ListGroup>
                      {this.props.attribState.items.map((row, index) => (
                        <ListGroupItem  className="border-0"
                          style={{
                            cursor: "pointer"
                          }}
                          key={index}
                          onClick={() => {
                            this.itemClick(row);
                          }}
                        >
                          {row.hv_table_name} <Badge pill>{row.hv_count}</Badge>
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </Col>
                </Row>
              ) : (
                this.renderTables(this.props.attribState.items)
              )}
            </TabPane>

            <TabPane tabId="2">
              <Row className="mt-2 mb-0 p-0">
                <Col sm="12">
                  <div className="float-left">
                    <h6>{this.state.tableName}</h6>
                  </div>
                  <div className="float-right">
                    <span
                      className="fa-stack"
                      style={styles.link}
                      onClick={() =>
                        this.setState({
                          inDetailsTab: false,
                          activeTab: "1"
                        })}
                    >
                      <i className="fa fa-square-o fa-stack-2x" />
                      <i className="fa fa-times fa-stack-1x" />
                    </span>
                  </div>
                </Col>
              </Row>
              <Row className="m-0 p-0">
                <Col sm="12">
                  <AttribTable
                    ref={instance => {
                      this.attribTable = instance;
                    }}
                    hv_table_i={this.state.hv_table_i}
                    tableName={this.props.tableName}
                  />
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </Container>
      </div>
      /*
            <ul>
                {this.props.items.map((item,index) => (
                    <li key={index}>
                        {item.gs_pr_name}
                    </li>
                ))}
            </ul>
            */
    );
  }
}

//AttribList.defaultProps = {};

/*
AttribList.propTypes = {
    fetchData: PropTypes.func.isRequired,
    updateData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    hasErrored: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
};
*/

const mapStateToProps = state => {
  return {
    attribState: state.attribState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      ...attribActions
    },
    dispatch
  )
});

/*
const mapDispatchToProps = (dispatch) => {
    return {
        fetchSagaData: (data) => dispatch(data)
    };  
};
*/
export default connect(mapStateToProps, mapDispatchToProps)(AttribList);
