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
import { types as StaffListTypes } from "../../reducers/Staff/stafflistreducer";
import { permissions as Permissions } from "../../reducers/Staff/stafflistreducer";
import { actions as StaffListActions } from "../../reducers/Staff/stafflistreducer";
import clientpic from "../../images/cadet_generic.png";
import {
  Row,
  Col,
} from "reactstrap";
import ManageStaff from './ManageStaff'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import "../../App.css";
import { Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import * as _ from "lodash";
import {ProgressSpinner} from 'primereact/components/progressspinner/ProgressSpinner';
 
export class StaffList extends Component {
  static propTypes = {
    //name: PropTypes.string.isRequired
  };


  constructor(props) {
    //debugger
    super(props);
  //  this.onActiveChange = this.onActiveChange.bind(this);
    this.viewTemplate = this.viewTemplate.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
    this.export = this.export.bind(this);
    this.addNew = this.addNew.bind(this);
    this.editRow = this.editRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.onHideDialog = this.onHideDialog.bind(this);
    this.toggle = this.toggle.bind(this);
   this.renderStaffList = this.renderStaffList.bind(this)
    this.state = {
      StaffCount: 0,
      dialogTitle: "Add Staff",
      displayDialog: false,
      currectSelectedStaff: [],
      isNewUser: true,
      displayFilter: 'none',
      filters: {},
      modal: false,
      rolesAssigned: [],
      userFunctions: [],
      hasAccessToView:'',
      hasAccessToDataGrid:'block' ,
      isView: ''
      
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
    //debugger
    this.setState({ userFunctions: unqUserFunctions });
  }
    return unqUserFunctions;
  }

 
  renderStaffList() {
    let unqFunction=this.evaluatePermissions(); 
    let key= _.findKey(unqFunction, function(o){ return o.function_id == 67});
    this.setState({ hasAccessToView: <Alert color="danger">User does not have permission !</Alert>});
    this.setState({ hasAccessToDataGrid: 'none'});  
    if(key!==undefined)
    {
    this.setState({ hasAccessToView: '' });
    this.setState({ hasAccessToDataGrid: 'block'});  
    debugger
      this.props.getStaffList({
          type: StaffListTypes.FETCH_REQUEST,
          payload: { function_id:unqFunction[key].function_id}
        });
      }
    
    }
  

  componentDidMount() {
    debugger
    this.renderStaffList()
  }

  componentDidUpdate(prevProps, prevState) {    
  debugger
    if (this.props.StaffListState.message.msg == 'deleted') {
      alert('User deleted successfully');
      this.props.resetMessage({
        type: StaffListTypes.MESSAGE,
        message: { val: 0, msg: "" }
      });
    }
    if (this.props.StaffListState.message.val == -2) {
      this.props.showTimeOut(this.props.StaffListState.message.msg);
    }
  }


  componentWillReceiveProps(nextProps) {
    debugger
    let hasAccessToView=<Alert color="danger">User does not have permission !</Alert>
    let hasAccessToDataGrid='none'
    let checkPermissons=this.evaluatePermissions();
    if (nextProps.StaffListState.message.val == 0) {
      if (nextProps.StaffListState.items.length != 0) {
      //  alert(nextProps.StaffListState.items[0].length )
        this.setState({ StaffCount: nextProps.StaffListState.items[0].length });
      }
    }
    checkPermissons.map((el) => {
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
  toggle = (e) => {
    this.setState({ modal: !this.state.modal });
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

  onfilterChange = (e) => {
    //debugger
    let filters = this.state.filters;
    //alert(e.target.id)
    switch (e.target.id) {
      case 'hvs_rsc_name':
        filters['hvs_rsc_name'] = { value: e.target.value };
        break;
        case 'hvs_rsc_typ_name':
        filters['hvs_rsc_typ_name'] = { value: e.target.value };
        break;
          case 'hv_program_name':
        filters['hv_program_name'] = { value: e.target.value };
        break;
      case 'hv_person_name':
        filters['hv_person_name'] = { value: e.target.value };
        break;
      case 'hv_last_name':
        filters['hv_last_name'] = { value: e.target.value };
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
    this.renderStaffList()

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
      dialogTitle: 'Add Staff',
      currectSelectedStaff: null,
      isNewUser: true,
      isView:''
    });

    
  }
  deleteRow(row) {

    if (window.confirm("Are you sure to delete this Staff?")) {
      this.props.deleteStaff({
        type: StaffListTypes.DELETE_REQUEST,
        payload:[ {
          row},{function_Id:66}]
      });
    } else {
      return;
    }


  }
  editRow(row, e) {
      debugger
    this.setState({
      displayDialog: true,
      dialogTitle: 'Edit Staff',
      currectSelectedStaff: _.find(this.props.StaffListState.items[0], { 'hv_staff_id': row.hv_staff_id }),//Object.assign({}, row),
      isNewUser: false,
      isView:''
    });
   

  }

  viewRow(row, e) {
    this.setState({
      displayDialog: true,
      dialogTitle: 'View Staff',
      currectSelectedStaff: Object.assign({}, row),
      isNewUser: false,
      isView: 'disableElement'
    });
  }
  render() {
    console.log('props'+ this.props)
    let PNFilter = <input style={{ display: this.state.displayFilter }} type="text" id="hv_program_name" className="" value={this.state.filters.hv_program_name ? this.state.filters.hv_program_name.value : ''} onChange={this.onfilterChange} />
    let FNFilter = <input style={{ display: this.state.displayFilter }} type="text" id="hv_person_name" className="" value={this.state.filters.hv_person_name ? this.state.filters.hv_person_name.value : ''} onChange={this.onfilterChange} />
    let LNFilter = <input style={{ display: this.state.displayFilter }} type="text" id="hv_last_name" className="" value={this.state.filters.hv_last_name ? this.state.filters.hv_last_name.value : ''} onChange={this.onfilterChange} />
    let RCFilter = <input style={{ display: this.state.displayFilter }} type="text" id="hvs_rsc_name" className="" value={this.state.filters.hvs_rsc_name ? this.state.filters.hvs_rsc_name.value : ''} onChange={this.onfilterChange} />
    let RTFilter = <input style={{ display: this.state.displayFilter }} type="text" id="hvs_rsc_typ_name" className="" value={this.state.filters.hvs_rsc_typ_name ? this.state.filters.hvs_rsc_typ_name.value : ''} onChange={this.onfilterChange} />  
   var header = <Row style={{ "backgroundColor": "white" }}>
      <Col sm="10">
        <div className="float-left">
          <span className="text-primary" style={{ 'fontSize': '14px' }}>Staff List</span>
          <br></br>
          <span className="text-primary" style={{ 'fontSize': '12px' }}>Manage the staff by adding new Staff, or modifying the exisiting staff.</span>

        </div>
      </Col>
      <Col sm="2">
        <span>{this.state.StaffCount} Staff Members </span>
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

    let maintainStaff = null;
    if (this.state.displayDialog) {

   
      maintainStaff = <Dialog visible={this.state.displayDialog} header={this.state.dialogTitle} modal={true} appendTo={document.body}
        onHide={this.onHideDialog} width='950px' height='500px' positionTop="40" style={{ overflow: 'auto' }} overflow='auto' >
        <ManageStaff {...this.props}  staffObject={this.state} onDialogClose={this.onHideDialog}/></Dialog>
        
    }
    else {
      {
        maintainStaff = ''
      }
    }
    let dtSource=[]
    if(this.props.StaffListState!==undefined)
    dtSource=this.props.StaffListState.items[0];

    return (
      <div>
        {this.state.hasAccessToView}
        
        <DataTable id="dataTable" value={dtSource} paginator={true} rows={10} rowsPerPageOptions={[5, 10, 20]} style={{display:this.state.hasAccessToDataGrid}}
          ref={(el) => { this.dt = el; } } header={header} onFilter={this.onFilter} filters={this.state.filters} tableClassName="datatable" >
          <Column field="hv_staff_id" header={filter} body={this.viewTemplate} style={{ textAlign: 'center', width: '3%' }} sortable={false} filter={false} />
        
          <Column field="hv_person_name" header="Person Name" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} filter={true} filterElement={FNFilter} filterMatchMode="contains" />
          <Column field="hvs_rsc_name" header="Resource Category" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} filter={true} filterElement={RCFilter} filterMatchMode="contains" />
          <Column field="hv_program_name" header="Program Code" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} filter={true} filterElement={PNFilter} filterMatchMode="contains" />
          <Column field="hvs_rsc_typ_name" header="Resource Type" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} filter={true} filterElement={RTFilter} filterMatchMode="contains" />        
          <Column body={this.actionTemplate} header={customHeaderAction} style={{ textAlign: 'center', width: '3%' }} />
        </DataTable>
 
        
        {maintainStaff}
       </div>

    )
  }
}
function mapStateToProps(state) {
  return {
    StaffListState: state.StaffListState
  };
}

const mapDispatchToProps = dispatch => ({
 
    ...bindActionCreators(
  {
        ...StaffListActions
      },
  dispatch
)})
export default connect(mapStateToProps, mapDispatchToProps)(StaffList)