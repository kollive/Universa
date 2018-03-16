import React, { Component } from 'react'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { types as ManageStaffTypes, permissions as Permissions } from "../../reducers/Staff/managestaffreducer";
import { actions as ManageStaffActions } from "../../reducers/Staff/managestaffreducer";
import * as utils from "../../Utils/common";

import Paper from "material-ui/Paper";
import Divider from "material-ui/Divider";
import TextField from "material-ui/TextField";
import { Button } from 'primereact/components/button/Button';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import {
  Container,
  Card,
  Table,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import { Column } from 'primereact/components/column/Column';
import * as _ from "lodash";

class ManageStaff extends Component {
  constructor(props) {
    debugger

    super(props);
    form: null;
    this.state = {
      firstName: "",
      lastName: "",
      initials: "",
      resourcecategory: "",
      resourcetype: '',
      program:'',
      manager:'',
      userid: '',
      permissions: '',
      btndisabled: false,
      ResourceCategoryItems: [],//[{ hvs_rsc_id: 1, hvs_rsc_name: 'a' }],
      ResourceTypeItems:[],// [{ hvs_rsc_typ_id: 1, hvs_rsc_typ_name: 'b' }],
      ProgramItems: [],//[{ hv_program: 1, hv_program_name: 'DELTA' }],
      ManagerItems: [],//[{ hv_program: 1, hv_program_name: 'DELTA' }],
      loggedinuser:'',
      parentProps:props
    }
    this.submitForm = this.submitForm.bind(this);
    this.CloseDialog = this.CloseDialog.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  setUser = () => {
   // let functions = JSON.parse(sessionStorage.getItem("roles"));
//if(functions.length>0)
  //  this.setState({ loggedinuser:functions[0].hv_user_id})
  }

  checkPermission = (function_id) => {
    // debugger
    return utils.checkPermission(Permissions, function_id);
  }
  shouldComponentUpdate(nextProps, nextState){
    // return a boolean value
    debugger
    return true;
}

    componentDidMount() {
    if (this.props.staffObject != null) {
      if (!this.props.staffObject.isNewUser)
        this.setState({ isReadOnly: true });        
      else if (this.props.staffObject.isNewUser){
        if(sessionStorage.getItem("token") == undefined){
          this.props.showTimeOut("Please login to proceed !!!");
        }
      }
      this.setUser();
      this.props.getStaffResDetails({
      type: ManageStaffTypes .FETCH_STAFF_RESOURCE_DETAILS,
      payload: [{},{ function_Id: '66' }]
      });
    }
  }

 

  
  componentDidUpdate(prevProps,prevState){
    debugger
    if(this.props.staffObject!==undefined)
    {
    if (this.props.manageStaffState.message.val == 2) {
      if (this.props.manageStaffState.message.statusMsg != undefined) {
        if (this.props.manageStaffState.message.statusMsg[0].hasOwnProperty('ReturnMessage')) {
          this.setState({ btndisabled: !this.form.isValid() });          
          alert(this.props.manageStaffState.message.statusMsg[0].ReturnMessage);
        this.props.onDialogClose()  
        
        }
        else
          alert('Error in transaction!!');
      }
      else
        alert("Error in the transaction!!");     
   //   this.props.onDialogClose();
      this.props.resetMessage({
        type: ManageStaffTypes.MESSAGE,
        message: { val: 0, statusMsg: "" }
      });
    }      
    else if (this.props.manageStaffState.message.statusMsg != "" && this.props.manageStaffState.message.val < 0 ){
      debugger
    if (this.props.manageStaffState.message.val == -2)
            this.props.showTimeOut(this.props.manageStaffState.message.statusMsg);
     else 
       alert(this.props.manageStaffState.message.statusMsg);
      this.props.resetMessage({
        type: ManageStaffTypes.MESSAGE,
        message: { val: 0, statusMsg: "" }
      });
    }
    }
  }
  componentWillReceiveProps(nextProps) {
  
    debugger

    if (nextProps.manageStaffState!==undefined) {
      if (nextProps.manageStaffState.items.length > 0) {
       this.setState({ ResourceCategoryItems: nextProps.manageStaffState.items[0] })
       this.setState({ ResourceTypeItems: nextProps.manageStaffState.items[1] })
       this.setState({ ProgramItems: nextProps.manageStaffState.items[2] })
       this.setState({ ManagerItems: nextProps.manageStaffState.items[3] })
      }
    }
 

   if (nextProps.staffObject != undefined) {
   if (nextProps.staffObject.currectSelectedStaff != null) {
    var staff = nextProps.staffObject.currectSelectedStaff 
    
    //alert(_.find(this.state.ResourceCategoryItems, { 'hvs_rsc_name': staff.hvs_rsc_name }))
      this.setState({
            firstName: staff.hv_first_name,
            lastName: staff.hv_last_name,
            initials: staff.hv_initials,
            resourcecategory: _.find(nextProps.manageStaffState.items[0], { 'hvs_rsc_name': staff.hvs_rsc_name }),
            program: _.find(nextProps.manageStaffState.items[2], { 'hv_program': staff.hv_program }),
            resourcetype:_.find(nextProps.manageStaffState.items[1], { 'hvs_rsc_typ_name': staff.hvs_rsc_typ_name }),  
            userid: staff.hv_user_id,
           // manager: staff.hv_staff_id,
            
      })
   }

   }
  }

componentWillUnmount(){
   this.props.clearItemsState({
        type: ManageStaffTypes.ITEMS,
        items: []
      });
}
  insertStaffDetails() {
      this.props.insertStaffDetails({
        type: ManageStaffTypes.INSERT_REQUEST,
        payload:[{
          hv_first_name: _.trim(this.firstName.getValue()),
          hv_initials: _.trim(this.initials.getValue()),          
          hv_last_name: _.trim(this.lastName.getValue()),
          hv_resource_category: this.state.resourcecategory.hvs_rsc_id,
          hv_program: this.state.program.hv_program,
          hv_resource_type: this.state.resourcetype.hvs_rsc_typ_id,
          hv_user_id:this.state.loggedinuser,
          hv_manager_id:this.state.manager.hv_manager_id,
          
        },
        {
          function_Id:65
        }
        ]
      });
    }
  


  updateStaffDetails() {
    this.props.updateStaffDetails({
        type: ManageStaffTypes.UPDATE_USER_REQUEST,
        payload:[ {
          hv_staff_id:this.props.staffObject.currectSelectedStaff.hv_staff_id,
          hv_first_name: _.trim(this.firstName.getValue()),
          hv_initials: _.trim(this.initials.getValue()),          
          hv_last_name: _.trim(this.lastName.getValue()),
          hv_resource_category: this.state.resourcecategory.hvs_rsc_id,
          hv_program: this.state.program.hv_program,
          hv_resource_type: this.state.resourcetype.hvs_rsc_typ_id,
          hv_user_id: this.state.loggedinuser,
          hv_manager_id:this.state.manager.hv_manager_id,
          
        },
        {
          function_Id:65
        }
        ]
      });
    
    }
 
  CloseDialog(e) {
    e.preventDefault();
    if (this.props) {
      this.props.onDialogClose();
    }
  }
  handleChange(e) {
    const target = e.currentTarget;
    this.form.validateFields(target);
    this.setState({
      btndisabled: !this.form.isValid()
    });
  }
  submitForm(e) {
    e.preventDefault();
    if (utils.checkPermission(Permissions, 65)) {
      debugger
      if(this.state.resourcecategory.length==0)
      {
      alert('Please Select Resource Category')
      return;
      }
      if(this.state.program.length==0)
      {
      alert('Please Select Program')
      return;
      }  if(this.state.resourcetype.length==0)
      {
      alert('Please Select Resource Items')
      return;
      }
      this.form.validateFields();
      
      if (this.form.isValid()) {
        if (this.props.staffObject.isNewUser)
          this.insertStaffDetails();
        else
          this.updateStaffDetails();
      }
    }
    else
      alert("Please check the permissions. You don't have access to make changes!!");
  }

  onResourceCategoryChange = (e) => {

    this.setState({ resourcecategory: e.value });
  }
  onResourceTypeChange = (e) => {

    this.setState({ resourcetype: e.value });
  }
    onProgramChange = (e) => {

    this.setState({ program: e.value });
  }
      onManagerChange = (e) => {

    this.setState({ manager: e.value });
  }
  
  render() {
    debugger
    let showSaveButton = '';let classDisable=''
    if (this.checkPermission(65)) {
      showSaveButton = <Button label="Save" style={{ float: "right", background: "grey", borderColor: "grey" }}
        disabled={this.state.btndisabled} onClick={this.submitForm}
        />
    }
      //alert(this.props.isView)
    if(this.props.staffObject!==undefined)
   classDisable=this.props.staffObject.isView
    return (
      <div  className={classDisable} >
        <FormWithConstraints ref={formwithConstraints => this.form = formwithConstraints} noValidate>
          <div id="divUsers" >
            <div className="row">
              <div className="col-sm-12">
                <div className="box box-info">
                  <div className='box-body' style={{ minHeight: "300px", width: '100%' }}>
                    <div className="row"  >
                      <div className="col-sm-2 alignCenter" >
                        <span className="text-left labelfont">First Name</span>
                      </div>
                      <div className="col-sm-3 alignCenter">
                        <TextField id="txtFirstName" name="txtFirstName" style={{ width: '80%' }}
                          className="font11" required maxLength="10"
                          ref={element => (this.firstName = element)}
                          value={this.state.firstName}
                          onChange={(e) => {
                            this.form.validateFields(e.target);
                            this.handleChange(e);
                            this.setState({ firstName: e.target.value })
                          } }
                          hintText="First Name" />
                        <FieldFeedbacks style={{ width: "256px", color: "red" }} for="txtFirstName">
                          <FieldFeedback when="valueMissing">First Name required.</FieldFeedback>
                        </FieldFeedbacks>

                      </div>
                    
                      <div className="col-sm-1 alignCenter" >
                        <TextField id="txtInititals" name="txtInititals" style={{ width: '30px' }}
                          className="font11"  maxLength="3"
                          ref={element => (this.initials = element)}
                          value={this.state.initials}
                          onChange={(e) => {
                            this.form.validateFields(e.target);
                            this.handleChange(e);
                            this.setState({ initials: e.target.value })
                          } }
                          hintText="Inititals" />

                      </div>
                      <div className="col-sm-2 alignCenter" >
                        <span className="labelfont">Last Name</span>
                      </div>
                      <div className="col-sm-4 alignCenter">
                        <TextField id="txtLastName" name="txtLastName" style={{ width: '90%' }}
                          className="font11"  maxLength="50" multiLine={true} rows={2} 
                          ref={element => (this.lastName = element)}
                          value={this.state.lastName} required
                          onChange={(e) => {
                            this.form.validateFields(e.target);
                            this.handleChange(e);
                            this.setState({ lastName: e.target.value })
                          } }
                          hintText="Last Name" />
                        <FieldFeedbacks style={{ width: "256px", color: "red" }} for="txtLastName">
                          <FieldFeedback when="valueMissing">Last Name required.</FieldFeedback>
                        </FieldFeedbacks>

                      </div>
                    </div>
                    <div className="row"  >
                      <div className="col-sm-2  alignCenter" >
                        <span className="text-left labelfont">Resource Category</span>
                      </div>
                      <div className="col-sm-3 alignCenter">
                        <Dropdown value={this.state.resourcecategory} optionLabel="hvs_rsc_name" id="ddlresourcecategory"
                          onChange={this.onResourceCategoryChange} options={this.state.ResourceCategoryItems}
                          style={{ width: "80%", fontSize: '12px' }} placeholder="Select Resource Category" required />
                        <FieldFeedbacks style={{ width: "256px", color: "red" }} for="ddlresourcecategory" id="tdxx">
                       <FieldFeedback when={value => (value)} id="eee">Please enter valid text</FieldFeedback>
                        </FieldFeedbacks>
                      </div>
     <div className="col-sm-1 alignCenter" >
                    
                      </div>
                      <div className="col-sm-2 alignCenter" >
                        <span className="labelfont">Program </span>
                      </div>
                      <div className="col-sm-4 alignCenter">
                        <Dropdown value={this.state.program} options={this.state.ProgramItems} optionLabel="hv_program_name"  onChange={this.onProgramChange} style={{ width: "80%", fontSize: '12px' }}
                          required
                          placeholder="Select Program" id="ddlProgram" />
                        <FieldFeedbacks style={{ width: "256px", color: "red" }} for="ddlProgram">
                          <FieldFeedback when="valueMissing">Resource Category required.</FieldFeedback>
                        </FieldFeedbacks>

                      </div>
                    </div>
                    <div className="row"  >
                      <br />
                    </div>
                    <div className="row"  >
                      <div className="col-sm-2  alignCenter" >
                        <span className="text-left labelfont">Resource Type</span>
                      </div>
                      <div className="col-sm-3  alignCenter">
                        <Dropdown value={this.state.resourcetype} options={this.state.ResourceTypeItems} optionLabel="hvs_rsc_typ_name" style={{ width: "80%", fontSize: '12px' }} required
                          placeholder="Select Resource Type" onChange={this.onResourceTypeChange} id="ddlresourcetype" />
                        <FieldFeedbacks style={{ width: "256px", color: "red" }} for="ddlresourcetype">
                          <FieldFeedback when="*">Resource Category required.</FieldFeedback>
                        </FieldFeedbacks>

                      </div>

                      <div className="col-sm-1 alignCenter" >

                      </div>
                           <div className="col-sm-2 alignCenter" >
                        <span className="labelfont">Manager </span>
                      </div>
                      <div className="col-sm-4 alignCenter">
                        <Dropdown value={this.state.manager} options={this.state.ManagerItems} optionLabel="hv_manager_name"  onChange={this.onManagerChange} style={{ width: "80%", fontSize: '12px' }}
                           
                          placeholder="Select Manager" id="ddlManager" />
                      

                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>


          <Row>
            <Col sm="12" style={{ paddingTop: '1%', paddingBottom: '1%' }}>
              <br />
            </Col>
          </Row>
          <Row>
            <Col sm="12" style={{ float: "right", margin: "5px" }}>
              <Button label=" Cancel" style={{ float: "right", background: "lightslategray", borderColor: "lightslategray" }}
                onClick={this.CloseDialog}
                />
              {showSaveButton}

            </Col>
          </Row>
        </FormWithConstraints>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    manageStaffState: state.ManageStaffState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
  {
      ...ManageStaffActions
    },
  dispatch
)
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageStaff);
