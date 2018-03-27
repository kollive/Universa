import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";
import { Button } from 'primereact/components/button/Button';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { types as COTypes } from "../../reducers/ChangeOrders/colistreducer";
import { permissions as Permissions } from "../../reducers/ChangeOrders/colistreducer";
import { actions as COActions } from "../../reducers/ChangeOrders/colistreducer";
import clientpic from "../../images/cadet_generic.png";
import {
  Row,
  Col,
} from "reactstrap";
import ChangeOrder from './MaintainChangeOrders'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import "../../App.css";
import { Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import * as _ from "lodash";
import {ProgressSpinner} from 'primereact/components/progressspinner/ProgressSpinner';
 
export class ChangeOrderList extends Component {
  static propTypes = {
    
  };


  constructor(props) {
    //debugger
    super(props);
    this.viewTemplate = this.viewTemplate.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
    this.export = this.export.bind(this);
    this.addNew = this.addNew.bind(this);
    this.editRow = this.editRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.onHideDialog = this.onHideDialog.bind(this);
    this.toggle = this.toggle.bind(this);
   this.renderList = this.renderList.bind(this)
    this.state = {
      COCount: 0,
      dialogTitle: "Add Change Order",
      displayDialog: false,
      currectSelectedCO: [],
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
        unqUserFunctions.push(obj[0]);
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

 
  renderList() {
      debugger
    let unqFunction=this.evaluatePermissions(); 
    let key= _.findKey(unqFunction, function(o){ return o.function_id == 72});
    this.setState({ hasAccessToView: <Alert color="danger">User does not have permission !</Alert>});
    this.setState({ hasAccessToDataGrid: 'none'});  
    if(key!==undefined)
    {
    this.setState({ hasAccessToView: '' });
    this.setState({ hasAccessToDataGrid: 'block'});  
    debugger
      this.props.getCOList({
          type: COTypes.FETCH_LIST_REQUEST,
          payload: { function_id:unqFunction[key].function_id}
        });
      }
    
    }
  

  componentDidMount() {
    debugger
    this.renderList()
  }

  componentDidUpdate(prevProps, prevState) {    
  debugger
    if (this.props.ChangeOrderListState.message.msg == 'deleted') {
      alert('User deleted successfully');
      this.props.resetMessage({
        type: COTypes.MESSAGE,
        message: { val: 0, msg: "" }
      });
    }
    if (this.props.ChangeOrderListState.message.val == -2) {
      this.props.showTimeOut(this.props.ChangeOrderListState.message.msg);
    }
  }


  componentWillReceiveProps(nextProps) {
    debugger
    let hasAccessToView=<Alert color="danger">User does not have permission !</Alert>
    let hasAccessToDataGrid='none'
    let checkPermissons=this.evaluatePermissions();
    if (nextProps.ChangeOrderListState.message.val == 0) {
      if (nextProps.ChangeOrderListState.items.length != 0) {
           this.setState({ COCount: nextProps.ChangeOrderListState.items[0].length });
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
      case 'change_order_abstract':
        filters['change_order_abstract'] = { value: e.target.value };
        break;
        case 'client_name':
        filters['client_name'] = { value: e.target.value };
        break;
          case 'contract_no':
        filters['contract_no'] = { value: e.target.value };
        break;
      case 'createdby':
        filters['createdby'] = { value: e.target.value };
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
    this.renderList()

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
      dialogTitle: 'Add New Change Order',
      currectSelectedCO: null,
      isNewUser: true,
      isView:''
    });

    
  }
  deleteRow(row) {

    if (window.confirm("Are you sure to delete this Change Order?")) {
        debugger
      this.props.deleteChangeOrder({
        type: COTypes.DELETE_LIST_REQUEST,
        payload:[ {
          row},{function_Id:71}]
      });
    } else {
      return;
    }


  }
  editRow(row, e) {
      debugger
    this.setState({
      displayDialog: true,
      dialogTitle: 'Edit Change Order',
      currectSelectedCO: _.find(this.props.ChangeOrderListState.items[0], { 'change_order_id': row.change_order_id }),//Object.assign({}, row),
      isNewUser: false,
      isView:''
    });
   

  }

  viewRow(row, e) {
    this.setState({
      displayDialog: true,
      dialogTitle: 'View Change Order',
      currectSelectedCO: Object.assign({}, row),
      isNewUser: false,
      isView: 'disableElement'
    });
  }
  render() {
    console.log('props'+ this.props)
    let ABFilter = <input style={{ display: this.state.displayFilter }} type="text" id="change_order_abstract" className="" value={this.state.filters.change_order_id ? this.state.filters.change_order_id.value : ''} onChange={this.onfilterChange} />
    let CNFilter = <input style={{ display: this.state.displayFilter }} type="text" id="client_name" className="" value={this.state.filters.client_name ? this.state.filters.client_name.value : ''} onChange={this.onfilterChange} />
    let COFilter = <input style={{ display: this.state.displayFilter }} type="text" id="contract_no" className="" value={this.state.filters.contract_no ? this.state.filters.contract_no.value : ''} onChange={this.onfilterChange} />
    let CBYFilter = <input style={{ display: this.state.displayFilter }} type="text" id="createdby" className="" value={this.state.filters.createdby ? this.state.filters.createdby.value : ''} onChange={this.onfilterChange} />
  
   var header = <Row style={{ "backgroundColor": "white" }}>
      <Col sm="10">
        <div className="float-left">
          <span className="text-primary" style={{ 'fontSize': '14px' }}>Change Orders</span>
          <br></br>
          <span className="text-primary" style={{ 'fontSize': '12px' }}>Manage the Change Orders by adding or modifying the exisiting Order.</span>

        </div>
      </Col>
      <Col sm="2">
        <span>{this.state.COCount} Total Change Orders </span>
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
        debugger
      //console.log('count VIEWVIEWVIEWVIEW ' + el.function_name.indexOf('VIEW'))
      if (el.function_name.indexOf('ADDEDIT') !== -1) {
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

    let maintainCO = null;
    if (this.state.displayDialog) {

   
      maintainCO = <Dialog visible={this.state.displayDialog} header={this.state.dialogTitle} modal={true} appendTo={document.body}
        onHide={this.onHideDialog} width='950px' height='500px' positionTop="40" style={{ overflow: 'auto' }} overflow='auto' >
        <ChangeOrder {...this.props} COObject={this.state}  onDialogClose={this.onHideDialog}/></Dialog>
        
    }
    else {
      {
        maintainCO = ''
      }
    }
    let dtSource=[]
    if(this.props.ChangeOrderListState!==undefined)
    dtSource=this.props.ChangeOrderListState.items[0];

    return (
      <div>
        {this.state.hasAccessToView}
        
        <DataTable id="dataTable" value={dtSource} paginator={true} rows={10} rowsPerPageOptions={[5, 10, 20]} style={{display:this.state.hasAccessToDataGrid}}
          ref={(el) => { this.dt = el; } } header={header} onFilter={this.onFilter} filters={this.state.filters} tableClassName="datatable" >
          <Column field="change_order_id" header={filter} body={this.viewTemplate} style={{ textAlign: 'center', width: '3%' }} sortable={false} filter={false} />
        
          <Column field="change_order_abstract" header="Order Name" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} filter={true} filterElement={ABFilter} filterMatchMode="contains" />
          <Column field="client_name" header="Client Name" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} filter={true} filterElement={CNFilter} filterMatchMode="contains" />
          <Column field="contract_no" header="Contract #" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} filter={true} filterElement={COFilter} filterMatchMode="contains" />
          <Column field="work_order_id" header="Work Order#" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} />
          {/* <Column field="createdate" header="Created On" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} /> */}
          <Column field="createdby" header="Created By" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} filter={true} filterElement={CBYFilter} filterMatchMode="contains" />        
                  
          <Column body={this.actionTemplate} header={customHeaderAction} style={{ textAlign: 'center', width: '3%' }} />
        </DataTable>
 
        
        {maintainCO}
       </div>

    )
  }
}
function mapStateToProps(state) {
  return {
    ChangeOrderListState: state.ChangeOrderListState
  };
}

const mapDispatchToProps = dispatch => ({
 
    ...bindActionCreators(
  {
        ...COActions
      },
  dispatch
)})
export default connect(mapStateToProps, mapDispatchToProps)(ChangeOrderList)