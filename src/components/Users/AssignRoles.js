import React, { Component } from 'react'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as _ from "lodash";
import { types as roleTypes } from "../../reducers/rolereducer";
import { actions as roleActions } from "../../reducers/rolereducer";
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import Roles from "../Roles";
import { Modal, ModalHeader, ModalBody, ModalFooter ,
Row,Col, Collapse, Button, CardBody, Card } from 'reactstrap';
import Paper from "material-ui/Paper";
import { Checkbox } from 'primereact/components/checkbox/Checkbox';
import Divider from "material-ui/Divider";


export class AssignRoles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      selectedRoles: [],
      assignRoles: [],
      collapse:true
    }
    this.toggle = this.toggle.bind(this);
    this.onRoleSelection = this.onRoleSelection.bind(this);
    this.checkTemplate = this.checkTemplate.bind(this);
  }
  componentDidMount() {
    debugger
    this.setState({ assignRoles: this.props.rolesObject })
  }
  componentWillReceiveProps(nextProps){
    debugger
        if (nextProps.rolesObject) {

    this.setState({ assignRoles: nextProps.rolesObject })
        }
    
  }
  toggle(e) {
    debugger
    this.props.getRoles({
      type: roleTypes.FETCH_TABLE_REQUEST,
      cname: ""
    });
    this.setState({ modal: !this.state.modal });
  }
  onRoleDialogClose = () => {
    this.setState({ modal: !this.state.modal });
    this.props.callParentAssignRoles(this.state.assignRoles)

  }
  onRoleSelection(e, rowData) {
    // debugger
    let arr = this.state.assignRoles
    let currRow;
    if (e.checked) {
        var today = new Date(),
        date = (today.getMonth() + 1) + '/' + today.getDate()  + '/' + today.getFullYear();
      currRow = {  
        role_id: rowData.role_id,        
        role_name: rowData.role_name,        
        DateAssigned: date,
        checked:true
      }
      arr.push(currRow)
      this.setState({ assignRoles: arr })
    }
    else {
      currRow = arr.filter((e) => e.role_id != rowData.role_id)
      this.setState({ assignRoles: currRow })
    }
  }
  checkTemplate(rowData, column) {
    //debugger
    var isAssigned = this.state.assignRoles.filter((e) => e.role_id === rowData.role_id)
    if (isAssigned.length > 0)
      rowData.assigned = true
    else
      rowData.assigned = false
    return <Checkbox onChange={(e) => { this.onRoleSelection(e, rowData) } } checked={rowData.assigned}></Checkbox>
  }
  render() {
    return (
      <div>
     
           <Collapse   isOpen={this.state.collapse} style={{overflow:'scroll'}}>
           
              <Row>
      <Col sm="10">
        <div className="float-left">
      Security Roles
        </div>
      </Col>
      <Col sm="2">
        <div className="float-right">
          <span className="fa-stack fa-lg">
            <i className="fa fa-square-o fa-stack-2x" />
            <div style={{ textAlign: 'left' }}><div className="fa fa-plus-circle fa-stack-1x" label="" onClick={this.toggle}></div></div>
          </span>{" "}Add
          {" "}
        </div>
      </Col>
    </Row>
    <Divider/>
            <DataTable id="dataTableRoles" value={this.state.assignRoles} scrollable={true}   style={{minHeight:"160px",maxHeight:"160px",tableLayout:'fixed',boarder:'1'}}
              ref={(el) => { this.dt = el; } }  >
              <Column field="role_id" header="Role ID" sortable={true} style={{ textAlign: 'center', width: '3%' }} sortable={true} />
              <Column field="role_name" header="Role Name" sortable={true} style={{ textAlign: 'center', width: '8%' }} sortable={true} />
              <Column field="DateAssigned" header="Date Assigned" sortable={true} style={{ textAlign: 'center', width: '8%' }} sortable={true} />
            </DataTable>
        
        </Collapse>
      
        <Modal isOpen={this.state.modal} size="lg" >
          <ModalHeader><h6>Assign Role(s)</h6>
          </ModalHeader>
          <ModalBody>
            <DataTable id="dataTable" value={this.props.roleState.items} paginator={true} rows={10} rowsPerPageOptions={[5, 10, 20]}
              ref={(el) => { this.dt = el; } } style={{ width: '100%' }}>
              <Column body={this.checkTemplate} style={{ textAlign: 'center', width: '1%' }} />
              <Column field="role_name" header="Role Name" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} />
              <Column field="role_desc" header="Role Desc" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} />
              <Column field="role_functions" header="Role Functions" sortable={true} style={{ textAlign: 'center', width: '6%' }} sortable={true} />
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

const mapStateToProps = state => {
  return {
    roleState: state.roleState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
  {
  ...roleActions
  },
  dispatch
)
});

export default connect(mapStateToProps, mapDispatchToProps)(AssignRoles);