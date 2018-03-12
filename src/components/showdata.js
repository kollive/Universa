import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
//import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Table } from "reactstrap";
import { ListGroup, ListGroupItem, Badge } from "reactstrap";

import TextField from "material-ui/TextField";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";

import CircularProgress from "material-ui/CircularProgress";
import * as _ from "lodash";
import { bindActionCreators } from "redux";
import { types as showDataTypes } from "../reducers/showdatareducer";
import { actions as showDataActions } from "../reducers/showdatareducer";
import HVSPagination from "../customComponents/pagination";
import { InputGroup, InputGroupAddon, InputGroupButton } from "reactstrap";

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

import HVSTextControl from "../customComponents/tdInputText";

const Styles = {
  propContainer: {
    width: 800,
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

const httpTaskCallback = task => {
  console.log(task);
  /*
    request.post(`/api/task/${this.state.id}`)
      .send(task)
      .end((err, res) => {
        if (!err) return this.setState({ ...task })
        // Handle HTTP error
      })
      */
};

//let newAttribVal = "Test";

class ShowData extends Component {
  componentWillReceiveProps(nextProps) {
    this.items = nextProps.showDataState.items;
    //this.setState({pageOfItems: this.props.showDataState.items});
    //console.log("nextProps ");
    //debugger;
    //console.log(nextProps);
    //this.forceUpdate();
  }

  //shouldComponentUpdate(nextProps, nextState) {
  //debugger;
  //return true;
  /*
        if (this.props.isLoading !== nextProps.isLoading) {
            return true;
        }
        if (this.state.items !== nextState.items) {
            return true;
        }
        return true;
        */
  //}

  componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate");
    console.log(this.state.showDataState);
  }

  componentDidMount() {
    debugger;
    //alert(this.props.location.state.params.hv_table_i)

    this.props.getAttribTables({
      type: showDataTypes.FETCH_TABLE_REQUEST,
      payload: { 
          s:""      
      }
    });
  }

  constructor(props) {
    super(props);
    this.tableID = 0;
    this.newUpdateValue = "";
    this.filterValue = "";
    this.items = [];

    this.insertRow = this.insertRow.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.setFilterValue = this.setFilterValue.bind(this);

    //this.newAttribVal = "";
  }

  debouncedSearch = _.debounce(this._onFilterChange, 500);

  setFilterValue = e => {
    debugger;
    this.filterValue = e.target.value;
    this.debouncedSearch();
  };

  saveAttribVal = event => {
    debugger;
    this.setState({
      attribValue: event.target.value
    });
    //newAttribVal = event.target.value;
  };

  state = {
    height: "300px",
    items: [],
    mode: undefined,
    itemsHasErrored: false,
    itemsIsLoading: false,
    showDataState: {},
    selectedRowID: -1,
    modal: false,
    attribValue: "",
    pageOfItems: [],
    filterValue: "",
    sortAsc: true,
    sortedCol: "hv_universal_i"
  };

  onChangePage = pageOfItems => {
    debugger;
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      attribValue: ""
    });
  };

  itemClick = row => {
    debugger;
    console.log(row);
    this.props.history.push("/showData", { params: row });
  };

  updateRow = row => {
    debugger;
    this.props.updateshowDatale({
      type: showDataTypes.UPDATE_REQUEST,
      payload: {
        rowID: row.hv_universal_i,
        tableID: row.hv_table_i,
        value: this.newUpdateValue
      }
    });
  };

  updateRowVal = rowObj => {
    debugger;
    this.newUpdateValue = rowObj.value;
    /*
    this.props.updateshowDatale({
      type: showDataTypes.UPDATE_REQUEST,
      payload: {
        rowID: rowObj.rowID,
        tableID : rowObj.tableID,
        value: rowObj.value
      }
    });
    
    //this.setState({
    //  newUpdateValue: rowObj.value
    //})
    */
    /*
    this.props.updateshowDataleStore({
      type: showDataTypes.UPDATE_REQUEST,
      payload: {
        rowID: row.hv_universal_i,
        tableID : row.hv_table_i
      }
    });
    */
  };

  deleteRow = row => {
    this.props.deleteshowDatale({
      type: showDataTypes.DELETE_REQUEST,
      payload: {
        rowID: row.hv_universal_i,
        tableID: row.hv_table_i
      }
    });
  };

  cancelRow = row => {
    this.props.cancelshowDatale({
      type: showDataTypes.CANCEL_REQUEST,
      payload: {
        rowID: row.hv_universal_i,
        value: row.hv_universal_name
      }
    });
  };

  editRow = row => {
    debugger;

    if (this.props.showDataState.rowID != -1) {
      alert("Please Save the current row");
      return false;
    }

    this.newUpdateValue = row.hv_universal_name;

    this.props.makeRowEditable({
      type: showDataTypes.MAKE_ROW_EDITABLE,
      payload: {
        rowID: row.hv_universal_i
      }
    });
  };

  insertRow = () => {
    debugger;

    this.setState({
      modal: !this.state.modal
    });

    //alert(this.refs["txtValue"].getValue());
    this.props.insertshowDatale({
      type: showDataTypes.INSERT_REQUEST,
      payload: {
        tableID: this.tableID,
        value: this.state.attribValue
      }
    });
  };

  _onFilterChange() {
    debugger;

    if (!this.filterValue) {
      this.setState((prevState, props) => {
        return { pageOfItems: prevState.pageOfItems };
      });
    }

    const filterBy = this.filterValue.toLowerCase();
    const size = this.props.showDataState.items.length;

    let filteredItems = [];

    for (var index = 0; index < size; index++) {
      const { hv_universal_name } = this.props.showDataState.items[index];

      if (hv_universal_name.toLowerCase().indexOf(filterBy) !== -1) {
        filteredItems.push(this.props.showDataState.items[index]);
      }

      if (filteredItems.length > 9) {
        break;
      }
    }

    this.setState({
      pageOfItems: filteredItems,
      filterValue: this.filterValue.toLowerCase()
    });
  }

  sortTable = columnName => {
    debugger;
    /*
    const rows = this.state.pageOfItems.slice();
    rows.sort((a, b) => {
      let sortVal = 0;


      if (a[columnName] > b[columnName]) {
        sortVal = 1;
      }
      if (a[columnName] < b[columnName]) {
        sortVal = -1;
      }

      //do the reverse
      if (this.state.sortAsc) {
        sortVal = sortVal * -1;
      }
      return sortVal;
    });
    */
    let rows;
    rows = _.sortBy(this.items, item => {
      debugger;
      if (_.isNumber(item[columnName])) {
        return _.toNumber(item[columnName]);
      } else {
        return _.toString(item[columnName].toLowerCase());
      }
    });

    if (this.state.sortAsc) {
      rows = rows.reverse();
    }

    this.items = rows;

    this.setState({
      sortedCol: columnName,
      sortAsc: !this.state.sortAsc
      //pageOfItems: rows
    });
  };

  RenderHeaderColumn = columnName => {
    debugger;

    let className;
    if (this.state.sortedCol == columnName) {
      if (this.state.sortAsc) {
        className = "fa fa-sort-asc fa-fw";
      } else {
        className = "fa fa-sort-desc fa-fw";
      }
    } else {
      className = "";
    }

    return className;
  };

  render() {
    return (
      <Container fluid style={Styles.propContainer}>
        <Row>
          <h3>New Demo Table</h3>
        </Row>

        <Row>
          <Col>
            <Table bordered striped hover size="sm">
              <thead>
                <tr style={{ backgroundColor: "grey", color: "white" }}>
                  <th>#</th>
                  <th>Universal ID</th>
                  <th>Universal Name</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.props.showDataState.items.map((row, index) => (
                  <tr key={index}>
                    <th scope="row">{index}</th>
                    <td>{row.hv_table_i}</td>
                    <td style={{ verticalAlign: "middle" }}>
                      {row.hv_table_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

//showDatale.defaultProps = {};

/*
showDatale.propTypes = {
    fetchData: PropTypes.func.isRequired,
    updateData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    hasErrored: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
};
*/

const mapStateToProps = state => {
  //debugger;
  return {
    showDataState: state.showDataState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      ...showDataActions
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
export default connect(mapStateToProps, mapDispatchToProps)(ShowData);
