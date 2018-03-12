import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";
import { Button } from 'primereact/components/button/Button';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { MultiSelect } from 'primereact/components/multiselect/MultiSelect';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { types as UsersListTypes } from "../../reducers/usersList_reducer";
import { permissions as Permissions } from "../../reducers/usersList_reducer";
import { actions as UsersListActions } from "../../reducers/usersList_reducer";
import clientpic from "../../images/cadet_generic.png";
import {
  Row,
  Col,
} from "reactstrap";
import MaintainUser from './MaintainUsers'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import "../../App.css";
import AssignRoles from './AssignRoles';
import { Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import * as _ from "lodash";

 
export class UsersList extends Component {
  static propTypes = {
    //name: PropTypes.string.isRequired
  };


  constructor(props) {
    super(props);
    this.onActiveChange = this.onActiveChange.bind(this);
    this.viewTemplate = this.viewTemplate.bind(this);
    this.imageTemplate = this.imageTemplate.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
    this.export = this.export.bind(this);
    this.addNew = this.addNew.bind(this);
    this.editRow = this.editRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.onHideDialog = this.onHideDialog.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onRoleDialogOpen = this.onRoleDialogOpen.bind(this);
    this.onRoleDialogClose = this.onRoleDialogClose.bind(this);
    this.onRoleDialogClose = this.onRoleDialogClose.bind(this);
    this.renderUsersList = this.renderUsersList.bind(this)
    this.state = {
      usersCount: 0,
      dialogTitle: "Add User",
      displayDialog: false,
      currectSelectedUser: [],
      isNewUser: true,
      displayFilter: 'none',
      filters: {},
      modal: false,
      rolesAssigned: [],
      userFunctions: [],
      hasAccessToView:'',
      hasAccessToDataGrid:'block' 
    }
  }

  evaluatePermissions(){
     let userFunctions = [], unqUserFunctions = [];
     try{
     if(JSON.parse(sessionStorage.getItem("roles")) && !!sessionStorage.getItem("roles"))
     {
    userFunctions = _.map(JSON.parse(sessionStorage.getItem("roles")), function (o) {
      //debugger
      return _.filter(Permissions, function (e) {
        if (o.function_id == e.function_id)
          return e;
      })
    }).filter(function (j) {
      if (j.length != 0)
        return j;
    })
    _.map(userFunctions, function (obj) {
      var length = _.reject(unqUserFunctions, function (el) {
        //debugger
        return (el.function_id.indexOf(obj[0].function_id) < 0);
      }).length;
      if (length < 1) {
        unqUserFunctions.push(obj[0])
        return obj
      }
    });
    }
  }
  catch(ex)
  {

  }
  finally
  {
    debugger
    this.setState({ userFunctions: unqUserFunctions });
  }
    return unqUserFunctions;
  }

 
  renderUsersList() {
    let unqFunction=this.evaluatePermissions(); 
    let key= _.findKey(unqFunction, function(o){ return o.function_id == 3});
    this.setState({ hasAccessToView: <Alert color="danger">User does not have permission !</Alert>});
    this.setState({ hasAccessToDataGrid: 'none'});  
    if(key!==undefined)
    {

    this.setState({ hasAccessToView: '' });
    this.setState({ hasAccessToDataGrid: 'block'});  
      this.props.getUsersList({
          type: UsersListTypes.FETCH_REQUEST,
          payload: { function_id:unqFunction[key].function_id}
        });
      }
    
    }
  

  componentDidMount() {
    // debugger
    this.renderUsersList()
  }

  componentDidUpdate(prevProps, prevState) {    
    debugger
    if (this.props.usersListState.message.msg == 'deleted') {
      alert('User deleted successfully');
      this.props.resetMessage({
        type: UsersListTypes.MESSAGE,
        message: { val: 0, msg: "" }
      });
    }
    if (this.props.usersListState.message.val == -2) {
      this.props.showTimeOut(this.props.usersListState.message.msg);
    }
  }


  componentWillReceiveProps(nextProps) {
    let hasAccessToView=<Alert color="danger">User does not have permission !</Alert>
    let hasAccessToDataGrid='none'
    let checkPermissons=this.evaluatePermissions();
    if (nextProps.usersListState.message.val == 0) {
      if (nextProps.usersListState.items.length != 0) {
      //  alert(nextProps.usersListState.items[0].length )
        this.setState({ usersCount: nextProps.usersListState.items[0].length });
      }
    }
    checkPermissons.map((el) => {
      debugger
      //console.log('count VIEWVIEWVIEWVIEW ' + el.function_name.indexOf('VIEW'))
      if (el.function_name.indexOf('VIEW') == -1) {
          hasAccessToView= <Alert color="danger">User does not have permission !</Alert>
         hasAccessToDataGrid='none'  
      }
      else {
        hasAccessToView = ''
        hasAccessToDataGrid='block'
        //disableClass = "";
      }
    })
        this.setState({ hasAccessToView: hasAccessToView });
        this.setState({ hasAccessToDataGrid: hasAccessToDataGrid});

  }
  actionTemplate(rowData, column) {

    let edit = '', del = '', view = ''
    //_.map(this.state.userFunctions, function (el) {
    this.state.userFunctions.map((el) => {
      //debugger
      if (el.function_name.indexOf('EDIT') !== -1) {
        edit = <i className='fa fa-pencil fa-fw'
          onClick={() => this.editRow(rowData)}
          />
      }
      if (el.function_name.indexOf('DELETE') !== -1) {
       // debugger
        rowData['function_id'] = el.function_id;
        del = <i className='fa fa-trash fa-fw'
          onClick={() => this.deleteRow(rowData)}
          />
      }
    })
    console.log('len' + edit.length + "  " + del.length)

    if (edit.length !== 0 && del.length !== 0) {
      return <div>
        {edit}
        {" "}
        {del}
      </div>;
    }
    else if (edit.length !== 0) {
      return <div>
        {edit}
        {" "}
        <i
          className='fa fa-trash fa-fw disableElement'
          onClick={() => this.deleteRow(rowData)}
          />
      </div>;
    }
    else if (del.length !== 0) {
      return <div>
        <i className='fa fa-pencil fa-fw disableElement'
          onClick={() => this.editRow(rowData)}
          />
        {" "}
        {del}
      </div>;
    }
    else {
      <div>

        <i
          className='fa fa-pencil fa-fw disableElement'
          onClick={() => this.editRow(rowData)}
          />

        {" "}
        <i
          className='fa fa-trash fa-fw disableElement'
          onClick={() => this.deleteRow(rowData)}
          />
      </div>;
    }




  }
  roleTemplate = (rowData, column) => {
    
    return <i class="fa fa-ellipsis-h" aria-hidden="true" onClick={(e) => { this.onRoleDialogOpen(rowData) } }>  </i>

  }
  toggle = (e) => {
    this.setState({ modal: !this.state.modal });
  }
  onRoleDialogClose = () => {
    this.setState({ modal: !this.state.modal });
    //this.props.callParentAssignRoles(this.state.assignRoles)

  }
  onRoleDialogOpen = (rowData) => {
    debugger
    this.setState({ modal: !this.state.modal });
    let arr = this.props.usersListState.items[1].filter((e) => e.hv_user_id == rowData.hv_user_id)
    this.setState({ rolesAssigned: arr })
  }
  viewTemplate(rowData, column) {
    let edit = '', del = '', view = ''
    this.state.userFunctions.map((el) => {
      //debugger
      console.log('count me ' + el.function_name.indexOf('EDIT'))
      if (el.function_name.indexOf('EDIT') !== -1)
        edit = <MenuItem primaryText="Edit" onClick={() => this.editRow(rowData)} />
      if (el.function_name.indexOf('DELETE') !== -1)
        del = <MenuItem primaryText="Delete" onClick={() => this.deleteRow(rowData)} />
      if (el.function_name.indexOf('VIEW') !== -1)
        view = <MenuItem primaryText="View" onClick={() => this.viewRow(rowData)} />
    }, this)
    if (edit.length !== 0 || del.length !== 0 || view.length !== 0) {
      return <div>
        <IconMenu
          iconButtonElement={<i className="fa fa-ellipsis-v fa-fw" />}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}>
          {edit}{del}{view}
        </IconMenu>
      </div>;
    }
    return <div><i className="fa fa-ellipsis-v fa-fw" /></div>
  }
  imageTemplate(rowData, column) {
    return <img src={rowData.hv_photo} style={{ display: "block", width: "50px", height: "  50px" }} />;
  }
  activeTemplate = (rowData, column) => {
    //debugger
    if (rowData.hv_is_active !== null) {
      if (rowData.hv_is_active == 'Y') {
        return <span>
          Yes
          </span>;
      }
      if (rowData.hv_is_active == 'N') {
        return <span>
          No
          </span>;
      }
    }
  }

  onActiveChange = (e) => {
    //debugger
    let filters = this.state.filters;
    let ds = [];
    e.value.map(val => {
      ds.push({ value: val })

    })
    filters['hv_is_active'] = { value: e.value }
    this.setState({ filters: filters });
  }
  onfilterChange = (e) => {
    //debugger
    let filters = this.state.filters;
    switch (e.target.id) {
      case 'hv_user_id':
        filters['hv_user_id'] = { value: e.target.value };
        break;
      case 'hv_first_name':
        filters['hv_first_name'] = { value: e.target.value };
        break;
      case 'hv_last_name':
        filters['hv_last_name'] = { value: e.target.value };
        break;
      case 'hv_role_name':
        filters['hv_role_name'] = { value: e.target.value };
        break;
    }
    this.setState({ filters: filters });
  }

  onFilter = (e) => {
    //debugger
    this.setState({ filters: e.filters });
  }

  onHideDialog() {
    this.setState({ displayDialog: false, isNewUser: false })
    this.renderUsersList()

  }
  onShowFilter = () => {
    this.dt.getColumns().map(col => {
      col.props
    })
    if (this.state.displayFilter !== 'inline-table')
      this.setState({ displayFilter: 'inline-table' })
    else
      this.setState({ displayFilter: 'none' })
  }
  onClearFilter = () => {
    let filters = this.state.filters;
    filters = {}
    this.setState({ filters: filters })
  }
  export() {
    this.dt.exportCSV();
  }


  addNew() {
    this.setState({
      displayDialog: true,
      dialogTitle: 'Add User',
      currectSelectedUser: null,
      isNewUser: true
    });
  }
  deleteRow(row) {

    if (window.confirm("Are you sure to delete this User?")) {
      this.props.deleteUser({
        type: UsersListTypes.DELETE_REQUEST,
        payload: row
      });
    } else {
      return;
    }


  }
  editRow(row, e) {
    this.setState({
      displayDialog: true,
      dialogTitle: 'Edit Details',
      currectSelectedUser: Object.assign({}, row),
      isNewUser: false
    });
  }

  viewRow(row, e) {
    this.setState({
      displayDialog: true,
      dialogTitle: 'View Details',
      currectSelectedUser: Object.assign({}, row),
      isNewUser: false,
      isView: true
    });
  }
  render() {
    //debugger    
  
    let userIDFilter = <input style={{ display: this.state.displayFilter }} type="text" id="hv_user_id" className="" value={this.state.filters.hv_user_id ? this.state.filters.hv_user_id.value : ''} onChange={this.onfilterChange} />
    let FNFilter = <input style={{ display: this.state.displayFilter }} type="text" id="hv_first_name" className="" value={this.state.filters.hv_first_name ? this.state.filters.hv_first_name.value : ''} onChange={this.onfilterChange} />
    let LNFilter = <input style={{ display: this.state.displayFilter }} type="text" id="hv_last_name" className="" value={this.state.filters.hv_last_name ? this.state.filters.hv_last_name.value : ''} onChange={this.onfilterChange} />
    let roleFilter = <input style={{ display: this.state.displayFilter }} type="text" id="hv_role_name" className="" value={this.state.filters.hv_role_name ? this.state.filters.hv_role_name.value : ''} onChange={this.onfilterChange} />
    let active = [
      { label: 'Yes', value: 'Y' },
      { label: 'No', value: 'N' },
    ];
    let activeFilter =
      <MultiSelect style={{ width: '10px', display: this.state.displayFilter }} className="" value={this.state.filters.hv_is_active ? this.state.filters.hv_is_active.value : null} options={active} onChange={this.onActiveChange} />
    //<Dropdown style={{width:'100%',visibility:this.state.displayFilter}} className="ui-column-filter" value={this.state.filters.hv_is_active ? this.state.filters.hv_is_active.value: 'N'} options={active} onChange={this.onActiveChange}/>

    var header = <Row style={{ "backgroundColor": "white" }}>
      <Col sm="10">
        <div className="float-left">
          <span className="text-primary" style={{ 'fontSize': '14px' }}>User Security</span>
          <br></br>
          <span className="text-primary" style={{ 'fontSize': '12px' }}>Manage the user that can access the system by adding new users, or modifying the access of exisiting user.</span>

        </div>
      </Col>
      <Col sm="2">
        <span>{this.state.usersCount}User Accounts </span>
        <div className="float-right">
          <span className="fa-stack fa-lg">
            <i className="fa fa-square-o fa-stack-2x" />
            <div style={{ textAlign: 'left' }}><div className="fa f fa-file-excel-o fa-stack-1x" label="" onClick={this.export}></div></div>
          </span>{" "}
          {" "}
        </div>
      </Col>
    </Row>
    let customHeaderAction = ''
    customHeaderAction = <div>   <span className="fa-stack fa-md disableElement">
      <i className="fa fa-square-o fa-stack-2x" />
      <i className="fa fa-plus-circle fa-stack-1x" onClick={this.addNew} />
    </span>{" "}Add</div>
    this.state.userFunctions.map((el) => {
      //console.log('count VIEWVIEWVIEWVIEW ' + el.function_name.indexOf('VIEW'))
      if (el.function_name.indexOf('ADD') !== -1) {
        customHeaderAction = <div>   <span className="fa-stack fa-md ">
          <i className="fa fa-square-o fa-stack-2x" />
          <i className="fa fa-plus-circle fa-stack-1x" onClick={this.addNew} />
        </span>{" "}Add</div>
      }
    })
    let filter =
      <div>
        <span className="fa-stack fa-md">
          <i className="fa fa-filter fa-stack-1x" onClick={() => { this.onShowFilter() } } />
        </span>
        {" "}
        <span className="fa-stack fa-md">

          <i className="fa fa-close" onClick={() => { this.onClearFilter() } } />
        </span>

      </div>


    let maintainUser = null;
    //debugger
    if (this.state.displayDialog) {
      maintainUser = <Dialog visible={this.state.displayDialog} header={this.state.dialogTitle} modal={true} appendTo={document.body}
        onHide={this.onHideDialog} width='1200px' height='700px' positionTop="40" style={{ overflow: 'auto' }} overflow='auto' >
        <MaintainUser  {...this.props} userObject={this.state} onDialogClose={this.onHideDialog}/></Dialog>
    }
    else {
      {
        maintainUser = ''
      }
    }
      
    return (
      <div>
        {this.state.hasAccessToView}
        <DataTable id="dataTable" value={this.props.usersListState.items[0]} paginator={true} rows={10} rowsPerPageOptions={[5, 10, 20]} style={{display:this.state.hasAccessToDataGrid}}
          ref={(el) => { this.dt = el; } } header={header} onFilter={this.onFilter} filters={this.state.filters} tableClassName="datatable" >
          <Column field="" header={filter} body={this.viewTemplate} style={{ textAlign: 'center', width: '3%' }} sortable={false} filter={false} />
          <Column field="hv_user_id" header="User ID" style={{ textAlign: 'center', width: '5%', height: '1px' }} sortable={true} filter={true} filterElement={userIDFilter} filterMatchMode="contains" />
          <Column field="hv_first_name" header="First Name" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} filter={true} filterElement={FNFilter} filterMatchMode="contains" />
          <Column field="hv_last_name" header="Last Name" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} filter={true} filterElement={LNFilter} filterMatchMode="contains" />
          {/* <Column field="hv_role_name" header="Role(s) Assigned" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} filter={true} filterElement={roleFilter} filterMatchMode="contains" />*/}
          <Column body={this.roleTemplate} header="Role(s) Assigned" sortable={true} style={{ textAlign: 'center', width: '6%' }} />

          <Column field="hv_is_active" body={this.activeTemplate} style={{ textAlign: 'center', width: '5%' }} header="Active" sortable={true} filter={true} filterElement={activeFilter} filterMatchMode="in" />
          <Column body={this.actionTemplate} header={customHeaderAction} style={{ textAlign: 'center', width: '3%' }} />
        </DataTable>
        {maintainUser}
        <Modal isOpen={this.state.modal} size="lg" >
          <ModalHeader><h6>Role(s) Assigned </h6>
          </ModalHeader>
          <ModalBody>
            <DataTable id="dataTable" value={this.state.rolesAssigned} paginator={true} rows={10} rowsPerPageOptions={[5, 10, 20]}
              style={{ width: '100%' }}>
              <Column field="role_name" header="Role Name" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} />
              <Column field="create_ts" header="Date Assigned" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} />
            </DataTable>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onRoleDialogClose}>Close</Button>
          </ModalFooter>
        </Modal>

      </div>

    )
  }
}
function mapStateToProps(state) {
  //debugger;
  return {
    usersListState: state.usersListState
  };
}

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(
  {
        ...UsersListActions
      },
  dispatch
)})
export default connect(mapStateToProps, mapDispatchToProps)(UsersList)
