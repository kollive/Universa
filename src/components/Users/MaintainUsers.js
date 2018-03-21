import React, { Component } from 'react';

import Paper from "material-ui/Paper";
import Divider from "material-ui/Divider";
import TextField from "material-ui/TextField";
import { Button } from 'primereact/components/button/Button';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { Checkbox } from 'primereact/components/checkbox/Checkbox';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Calendar } from 'primereact/components/calendar/Calendar';
import { InputMask } from 'primereact/components/inputmask/InputMask';
import Dropzone from 'react-dropzone';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as _ from "lodash";
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
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import { types as ManageUserTypes, permissions as Permissions } from "../../reducers/Users/manageusersreducer";
import { actions as ManageUserActions } from "../../reducers/Users/manageusersreducer";
import AssignRoles from './AssignRoles';


import { types as roleTypes  } from "../../reducers/rolereducer";
import { actions as roleActions } from "../../reducers/rolereducer";
import { Accordion, AccordionTab } from 'primereact/components/accordion/Accordion';
import * as utils from "../../Utils/common";
// import { DataTable } from 'primereact/components/datatable/DataTable';
// import { Column } from 'primereact/components/column/Column';
//var js2xmlparser = require("js2xmlparser");
const paperStyle = {
  height: "auto",
  width: "100%",
  padding: "5px"
};

export class UserComponent extends Component {
  constructor(props) {
    super(props);
    form: null;
    this.state = {
      firstName: "",
      lastName: "",
      UId: "",
      uPassword: "",
      emailId: "",
      isActive: true,
      userImage: null,
      uploadedImg: null,
      displayMsgdiv: "block",
      pwdexpiryDt: null,
      mobileNo: "",
      homeNo: "",
      otherNo: "",
      isMobileNo: false,
      isHomeNo: false,
      isOtherNo: false,
      btndisabled: false,
      warningClass: 'normal',
      isReadOnly: false,
      seleactedRoles:[],
      rows: [
        { phone_type: "", phone_number: "" }],
      permissions :''

    }

    this.insertUserDetails = this.insertUserDetails.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onActiveChange = this.onActiveChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.CloseDialog = this.CloseDialog.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.isNumber = this.isNumber.bind(this);
  }

  componentDidMount() {
    if (this.props.userObject != null) {
      if (!this.props.userObject.isNewUser)
        this.setState({ isReadOnly: true });
      else if (this.props.userObject.isNewUser){
        if(sessionStorage.getItem("token") == undefined){
          this.props.showTimeOut("Please login to proceed !!!");
        }
      }
      //this.getPermissions();
      if (this.props.userObject.currectSelectedUser != null) {
        this.props.getUserDetails({
          type: ManageUserTypes.FETCH_USER_REQUEST,
          user: {
            hv_user_id: this.props.userObject.currectSelectedUser.hv_user_id
          }
        });
      }

    }

  }

  getPermissions = () => {
    let functions = JSON.parse(sessionStorage.getItem("roles"));
    debugger
   let flist = _.uniqBy(_.filter(functions, function(o)
   {return (_.find(Permissions, {'function_id' : o.function_id} )) }
  ),'function_id');
  // flist =  _.filter(flist,{'function_id':2});
    this.setState({permissions : flist});
  }

  checkPermission = (function_id) => {
    // let permissions = utils.getPermissions();
    //   if( _.findIndex(permissions , {'function_id' : function_id}) > -1 )
    //     return true;
    // return false;
    debugger
    return utils.checkPermission(Permissions,function_id);
  }

  componentDidUpdate(prevProps,prevState){
    debugger
    if (this.props.userState.message.val == 2) {
      if (this.props.userState.message.statusMsg != undefined) {
        if (this.props.userState.message.statusMsg[0].hasOwnProperty('ReturnMessage')) {
          alert(this.props.userState.message.statusMsg[0].ReturnMessage);
          this.props.onDialogClose();
        }
        else
          alert('Error in transaction!!');
      }
      else
        alert("Error in the transaction!!");
      this.props.onDialogClose();
      this.props.resetMessage({
        type: ManageUserTypes.MESSAGE,
        message: { val: 0, statusMsg: "" }
      });
    }
    else if (this.props.userState.message.statusMsg != "" && this.props.userState.message.val < 0 ){
      debugger
    if (this.props.userState.message.val == -2)
            this.props.showTimeOut(this.props.userState.message.statusMsg);
     else
       alert(this.props.userState.message.statusMsg);
      this.props.resetMessage({
        type: ManageUserTypes.MESSAGE,
        message: { val: 0, statusMsg: "" }
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    // if (nextProps.userState.message.val == 2) {
    //         if (nextProps.userState.message.statusMsg != undefined) {
    //           if (nextProps.userState.message.statusMsg[0].hasOwnProperty('ReturnMessage')) {
    //             alert(nextProps.userState.message.statusMsg[0].ReturnMessage);
    //             this.props.onDialogClose();
    //           }
    //           else
    //             alert('Error in transaction!!');
    //         }
    //         else
    //           alert("Error in the transaction!!");
    //         this.props.onDialogClose();
    //         this.props.resetMessage({
    //           type: ManageUserTypes.MESSAGE,
    //           message: { val: 0, statusMsg: "" }
    //         });
    //       }
    //       else if (nextProps.userState.message.statusMsg != "" && nextProps.userState.message.val < 0 ){
    //         debugger
    //       if (nextProps.userState.message.val == -2)
    //               nextProps.showTimeOut(nextProps.userState.message.statusMsg);
    //        else
    //          alert(nextProps.userState.message.statusMsg);
    //         this.props.resetMessage({
    //           type: ManageUserTypes.MESSAGE,
    //           message: { val: 0, statusMsg: "" }
    //         });
    //       }
    if (nextProps.userState.items) {
    if (nextProps.userState.items.length>0) {

    if (nextProps.userState.items) {
      var user = nextProps.userState.items[0][0];
      this.setState({
        firstName: user.hv_first_name,
        lastName: user.hv_last_name,
        UId: user.hv_user_id,
        uPassword: user.hv_pwd,
        emailId: user.hv_email,
        isActive: user.hv_is_active == 'Y' ? true : false,
        userImage: user.hv_photo == "" ? null : user.hv_photo,
        uploadedImg: user.hv_photo == "" ? null : user.hv_photo,
        displayMsgdiv: user.hv_photo ? 'none' : 'block',
      })
      if (nextProps.userState.items[2].length > 0) {
        let phonelist = nextProps.userState.items[2];
        this.setState({ rows: phonelist });
      }

      this.setState({seleactedRoles:nextProps.userState.items[1]})
    }
  }

  }
  }

componentWillUnmount(){
   this.props.clearItemsState({
        type: ManageUserTypes.ITEMS,
        items: []
      });
}
  insertUserDetails() {

    let res=this.buildJSON()
       if(res!==false)
    {
    // Build json for phone numbers
    let saveStr = res

    this.props.insertUserDetails({
      type: ManageUserTypes.INSERT_REQUEST,
      user: {
        hv_first_name: _.trim(this.firstName.getValue()),
        hv_last_name: _.trim(this.lastName.getValue()),
        hv_user_id: _.trim(this.UId.getValue()),
        hv_pwd: _.trim(this.uPassword.getValue()),
        hv_email: _.trim(this.emailId.getValue()),
        hv_isactive: this.state.isActive == true ? 'Y' : 'N',
        hv_phones: saveStr,
        hv_image: this.state.userImage ? this.state.userImage : null,
        hv_roles:this.state.assingedRolesStr
      }
    });
    }
  }


  updateUserDetails() {

    let res=this.buildJSON()
       if(res!==false)
    {
    // Build json for phone numbers
    let saveStr = res

    this.props.updateUserDetails({
      type: ManageUserTypes.UPDATE_USER_REQUEST,
      user: {
        hv_first_name: _.trim(this.firstName.getValue()),
        hv_last_name: _.trim(this.lastName.getValue()),
        hv_user_id: _.trim(this.UId.getValue()),
        hv_pwd: _.trim(this.uPassword.getValue()),
        hv_email: _.trim(this.emailId.getValue()),
        hv_isactive: this.state.isActive == true ? 'Y' : 'N',
        hv_phones: saveStr,
        hv_image: this.state.userImage ? this.state.userImage : null,
        hv_roles:this.state.assingedRolesStr,
      }
    });
    }



  }

  onActiveChange(e) {
    // debugger
    this.setState({ isActive: e.checked });
  }

  buildJSON() {
       let saveStr = "";
       this.state.rows.forEach((phone) => {

         if (phone.phone_number != "" && phone.phone_type == "")
         {
           alert('Please Enter Phone Type');
           saveStr= false;
         }
         if (phone.phone_number == "" && phone.phone_type != "")
         {
           alert('Please Enter Phone Number');
           saveStr= false;
         }
         if (phone.phone_number != "" && phone.phone_type != ""){

           saveStr += '{"phone_type":"' + phone.phone_type + '","phone_number":"' + phone.phone_number + '"},'

         }
       })
       if (_.trim(saveStr) != "") {
         saveStr = saveStr.substr(0, saveStr.length - 1);
         saveStr = '[' + saveStr + ']';
       }
       return saveStr
     }

  CloseDialog(e) {
    e.preventDefault();
    if (this.props) {
      this.props.onDialogClose();
    }
  }

  onImageDrop(files) {
    // debugger
    var fileasBinary, imageType;
    files.forEach(function (file) {
      // debugger
      const reader = new FileReader();
      reader.onload = () => {
        // debugger
        fileasBinary = reader.result;
        // let base64data = 'data:' + imageType + ';base64,' + fileasBinary;
        this.setState({
          userImage: fileasBinary
        })
      }
      imageType = file.type;
      reader.readAsDataURL(file);
    }, this);
    this.setState({
      uploadedImg: files[0],
      displayMsgdiv: "none"
    });
  }

  typeTemplate = (rowData, column) => {
    debugger
    let phoneTypes = [
      { label: 'Mobile', value: 'Mobile' },
      { label: 'Home', value: 'Home' },
      { label: 'Other', value: 'Other' }
    ]
    return <div>
      <Dropdown options={phoneTypes} style={{ width: "100%", fontSize: '12px' }} value={this.state.rows[column.rowIndex].phone_type}
        onChange={(e) => this.onEditorValueChange(column, 'phone_type', e.value)} required
        placeholder="Select Phone type" />
      {/* className= {this.state.warningClass} */}
    </div>;
  }
  phoneTemplate = (rowData, column) => {
    return <div>
      <input type="text" style={{ fontSize: "12px", width: "100%" }} pattern="9999999999" value={this.state.rows[column.rowIndex].phone_number} placeholder="Enter Phone number"
        onChange={(e) => {
          debugger
          const re = /^[0-9\b]+$/;
         if (e.target.value == '' || re.test(e.target.value)) {
           if(e.target.value.length < 11)
            this.onEditorValueChange(column, 'phone_number', e.target.value)}}} onBlur={
              (e) => {
                if(e.target.value != '' && e.target.value.length < 10)
                  alert("Please enter valid mobile number");
              }
            } required /></div>;
    {/* <InputMask mask="(999)-999-9999" style={{fontSize:"12px"}} unmask="true" id={column.rowIndex} value={this.state.rows[column.rowIndex].phone_number} placeholder="Enter Phone number"
   onChange={(e) => this.onEditorValueChange(column,'phone_number', e.target.value)}></InputMask> </div>; */}

  }

 isNumber(evt) {
   debugger
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
  handleUserChange(e) {
    // debugger
    this.form.validateFields(e.target);
    this.handleChange(e);
    this.setState({ UId: e.target.value });
  }

  handlePasswordChange(e) {
    this.form.validateFields(e.target);
    this.handleChange(e);
    this.setState({ uPassword: e.target.value });
  }

  handleChange(e) {
    const target = e.currentTarget;
    this.form.validateFields(target);
    this.setState({
      btndisabled: !this.form.isValid()
    });
  }


  CloseDialog(e) {
    e.preventDefault();
    if (this.props) {
      this.props.onDialogClose();
    }
  }

  onImageDrop(files) {
    // debugger
    var fileasBinary, imageType;
    files.forEach(function (file) {
      // debugger
      const reader = new FileReader();
      reader.onload = () => {
        // debugger
        fileasBinary = reader.result;
        // let base64data = 'data:' + imageType + ';base64,' + fileasBinary;
        this.setState({
          userImage: fileasBinary
        })
      }
      imageType = file.type;
      reader.readAsDataURL(file);
    }, this);
    this.setState({
      uploadedImg: files[0],
      displayMsgdiv: "none"
    });
  }

  typeTemplate = (rowData, column) => {
    debugger
    let phoneTypes = [
      { label: 'Mobile', value: 'Mobile' },
      { label: 'Home', value: 'Home' },
      { label: 'Other', value: 'Other' }
    ]
    return <div>
      <Dropdown options={phoneTypes} style={{ width: "100%", fontSize: '12px' }} value={this.state.rows[column.rowIndex].phone_type}
        onChange={(e) => this.onEditorValueChange(column, 'phone_type', e.value)} required
        placeholder="Select Phone type" />
      {/* className= {this.state.warningClass} */}
    </div>;
  }
  phoneTemplate = (rowData, column) => {
    return <div>
      <input type="text" style={{ fontSize: "12px", width: "100%" }} pattern="9999999999" value={this.state.rows[column.rowIndex].phone_number} placeholder="Enter Phone number"
        onChange={(e) => {
          debugger
          const re = /^[0-9\b]+$/;
         if (e.target.value == '' || re.test(e.target.value)) {
           if(e.target.value.length < 11)
            this.onEditorValueChange(column, 'phone_number', e.target.value)}}} onBlur={
              (e) => {
                if(e.target.value != '' && e.target.value.length < 10)
                  alert("Please enter valid mobile number");
              }
            } required /></div>;
    {/* <InputMask mask="(999)-999-9999" style={{fontSize:"12px"}} unmask="true" id={column.rowIndex} value={this.state.rows[column.rowIndex].phone_number} placeholder="Enter Phone number"
   onChange={(e) => this.onEditorValueChange(column,'phone_number', e.target.value)}></InputMask> </div>; */}

  }

 isNumber(evt) {
   debugger
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
  handleUserChange(e) {
    // debugger
    this.form.validateFields(e.target);
    this.handleChange(e);
    this.setState({ UId: e.target.value });
  }

  handlePasswordChange(e) {
    this.form.validateFields(e.target);
    this.handleChange(e);
    this.setState({ uPassword: e.target.value });
  }

  handleChange(e) {
    const target = e.currentTarget;
    this.form.validateFields(target);
    this.setState({
      btndisabled: !this.form.isValid()
    });
  }


  addNewRow = () => {
    let isValid = true;
    console.log(this.state.rows);
    this.state.rows.map((row) => {
      if (row.phone_number == "" || row.phone_type == "") {
        isValid = false;
      }
    })
    if (isValid) {
      var phoneInfo = {
        phone_type: "",
        phone_number: ""
      }
      var currentRows = this.state.rows;
      currentRows.push(phoneInfo);
      this.setState({ rows: currentRows });
    }
  }
  submitForm(e) {
    e.preventDefault();
    //this.getPermissions();
    debugger
    if (utils.checkPermission(Permissions,1)) {
    this.form.validateFields();
    this.setState({ btndisabled: !this.form.isValid() });
    if (this.form.isValid()) {
      if (this.props.userObject.isNewUser)
        this.insertUserDetails();
      else
        this.updateUserDetails();
    }
  }
  else
  alert("Please check the permissions. You don't have access to make changes!!");
  }


  deleteRow(rowdata) {
    debugger
    let list = this.state.rows;
    let newList = list.filter(e => e.phone_number !== rowdata.phone_number)
      this.setState({ rows: newList });
    // }
  }
  actionTemplate(rowData, column) {
    return <div>
      <i
        className="fa fa-trash fa-fw" style={{ width: "50%" }}
        onClick={() => this.deleteRow(rowData)}
      />

    </div>;
  }
  onEditorValueChange(props, field, value) {

    let phones = [...this.state.rows];
    phones[props.rowIndex][field] = value;
    this.setState({
      rows: phones,
      warningClass: 'normal'
    });
  }


  deleteRow(rowdata) {
    debugger
    let list = this.state.rows;
    let newList = list.filter(e => e.phone_number !== rowdata.phone_number)
      this.setState({ rows: newList });
    // }
  }
  actionTemplate(rowData, column) {
    return <div>
      <i
        className="fa fa-trash fa-fw" style={{ width: "50%" }}
        onClick={() => this.deleteRow(rowData)}
      />

    </div>;
  }
  onEditorValueChange(props, field, value) {

    let phones = [...this.state.rows];
    phones[props.rowIndex][field] = value;
    this.setState({
      rows: phones,
      warningClass: 'normal'
    });
  }

  myCallback = (dataFromChild) => {
    debugger
    this.setState({assingedRolesStr:JSON.stringify(dataFromChild)})
  }
  render() {
    let assingRoles = null
    assingRoles = <AssignRoles rolesObject={this.state.seleactedRoles} callParentAssignRoles={this.myCallback} />

    let showSaveButton = '';
    if (this.checkPermission(1)){
      showSaveButton = <Button label="Save" style={{ float: "right", background: "grey", borderColor: "grey" }}
        disabled={this.state.btndisabled}  onClick={this.submitForm}
      />
}
    let customHeader = <span >
      <i className="fa fa-plus-circle" styl={{ width: "50%" }} onClick={this.addNewRow} />
    </span>

  let header = <Row>
      <Col sm="10">
        <div className="float-left">
        </div>
      </Col>
      <Col sm="2">

        <div className="float-right">
          <span className="fa-stack fa-lg">
            <i className="fa fa-square-o fa-stack-2x" />
            <div style={{ textAlign: 'left' }}><div className="fa fa-plus-circle fa-stack-1x" label="" onClick={this.export}></div></div>
          </span>{" "}Add
          {" "}
        </div>
      </Col>
    </Row>
    return (
      <div>
        <FormWithConstraints ref={formwithConstraints => this.form = formwithConstraints} noValidate>
          <div className="" id="divUsers" >
            <div className="row">
              <div className="FileUpload auto">
                <Paper style={{ width: "190px", height: "190px" }} zDepth={0} >
                  <Dropzone
                    onDrop={this.onImageDrop.bind(this)}
                    multiple={false}
                    accept="image/*"
                    activeClassName='active-dropzone' style={{ borderStyle: 'solid', borderWidth: '0px' }}>
                    <div style={{ display: this.state.displayMsgdiv }}>Drop an image or click to select a file to upload.</div>
                    {(this.state.uploadedImg == null) || (this.state.uploadedImg == '') ? null :
                      <div>
                        <img src={this.state.uploadedImg.preview ? this.state.uploadedImg.preview : this.state.uploadedImg} style={{ width: "190px", height: "190px" }} />
                      </div>}
                  </Dropzone>
                </Paper>
              </div>
              <div className="col-sm-9">
                <div className="box box-info">
                  <div className='box-body' style={{ minHeight: "300px", width: '100%' }}>
                    <div className="row"  >
                      <div className="col-sm-auto labelWidth alignCenter" >
                        <label id="lblEmployeeId" runat="server" className="labelfont">
                          Employee Id
                    </label>
                      </div>
                      <div className="col-sm-auto ">
                        <TextField id="txtEmployeeId"
                          className="font11"
                          hintText="Employee Id" style={{ width: "75%" }} />
                        <i className="fa fa-search" onClick={e => {
                          alert("tdfdfg");
                        }} />
                      </div>
                      <div className="col-sm-auto labelWidth alignCenter" >
                        {/* <Checkbox  label="test" onChange={this.onActiveChange}
                   checked={this.state.isActive}></Checkbox> */}
                        <label id="lblUserId" runat="server" className="labelfont">
                          Active
                    </label>
                      </div>
                      <div className="col-sm-auto alignCenter" >
                        <input type="checkbox" style={{ marginLeft: "5px", verticalAlign: "top" }}
                          checked={this.state.isActive}
                          onChange={this.onActiveChange}
                        />
                      </div>
                    </div>
                    <Paper style={paperStyle} zDepth={0} >
                      <Row>
                        <Col sm="6">
                          <Row>
                            <Col sm="auto" className="labelWidth alignCenter">
                              <span className="text-left labelfont">First Name</span>
                            </Col>
                            <Col sm="3">
                              <TextField id="txtFirstName" name="txtFirstName"
                                className="font11" required
                                ref={element => (this.firstName = element)}
                                value={this.state.firstName}
                                onChange={(e) => {
                                  this.form.validateFields(e.target);
                                  this.handleChange(e);
                                  this.setState({ firstName: e.target.value })
                                }}
                                hintText="First Name" />
                              <FieldFeedbacks style={{ width: "256px", color: "red" }} for="txtFirstName">
                                <FieldFeedback when="valueMissing">First Name required.</FieldFeedback>
                              </FieldFeedbacks>

                            </Col>
                          </Row>
                          <Row>
                            <Col sm="auto" className="labelWidth alignCenter">
                              <span className="text-left labelfont">
                                Last Name</span>
                            </Col>
                            <Col sm="3">
                              <TextField id="txtLastName" name="txtLastName"
                                className="font11"
                                ref={element => (this.lastName = element)}
                                value={this.state.lastName} required
                                onChange={(e) => {
                                  this.form.validateFields(e.target);
                                  this.handleChange(e);
                                  this.setState({ lastName: e.target.value })
                                }}
                                hintText="Last Name" />
                              <FieldFeedbacks style={{ width: "256px", color: "red" }} for="txtLastName">
                                <FieldFeedback when="valueMissing">Last Name required.</FieldFeedback>
                              </FieldFeedbacks>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm="auto" style={{ width: "93px" }} className="labelWidth alignCenter">
                              <span className="text-left labelfont required">
                                User Id</span>
                            </Col>
                            <Col sm="3">
                              <TextField id="txtUId"
                                ref={element => (this.UId = element)}
                                className="font11" required
                                value={this.state.UId}
                                readOnly={this.state.isReadOnly}
                                onChange={this.handleUserChange}
                                hintText="User Id" minLength={3} />
                              <FieldFeedbacks style={{ width: "256px", color: "red" }} for="txtUId">
                                <FieldFeedback when="valueMissing">Must enter User Id.</FieldFeedback>
                                <FieldFeedback when="tooShort">UserId must contain atleast 3 characters. </FieldFeedback>
                              </FieldFeedbacks>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm="auto" className="labelWidth alignCenter">
                              <span className="text-left labelfont required">
                                Password</span>
                            </Col>
                            <Col sm="3">
                              <TextField
                                id="txtUPassword" name="txtUPassword"
                                ref={element => (this.uPassword = element)}
                                value={this.state.uPassword} required
                                onChange={this.handlePasswordChange}
                                hintText="Password"
                                type="password" minLength={8} />
                              <FieldFeedbacks style={{ width: "256px", color: "red" }} for="txtUPassword" show="all">
                                <FieldFeedback when="valueMissing">Password is required</FieldFeedback>
                                <FieldFeedback when="tooShort">Password must of atleast 8 length.</FieldFeedback>
                                <FieldFeedback when={value => !/\d/.test(value)}>Should contain atleast 1 number. </FieldFeedback>
                                <FieldFeedback when={value => !/\W/.test(value)}>Should contain atleast 1 special character. </FieldFeedback>
                                <FieldFeedback when={value => !/[a-z]/.test(value)}>Should contain atleast 1 character. </FieldFeedback>
                              </FieldFeedbacks>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm="auto" style={{ width: "93px" }} className="labelWidth alignCenter">
                              <span className="text-left labelfont">
                                Email Id</span>
                            </Col>
                            <Col sm="3">
                              <TextField type="email" name="txtEmailId"
                                id="txtEmailId" required
                                placeholder="abc@test.com"
                                ref={element => (this.emailId = element)}
                                value={this.state.emailId}
                                onChange={(e) => {
                                  this.form.validateFields(e.target);
                                  this.handleChange(e);
                                  this.setState({ emailId: e.target.value })
                                }
                                }
                              />
                              <FieldFeedbacks style={{ width: "256px", color: "red" }} for="txtEmailId">
                                <FieldFeedback when="valueMissing">Email Id is required.</FieldFeedback>
                                <FieldFeedback when="*" />
                              </FieldFeedbacks>
                            </Col>
                          </Row>
                        </Col>
                        <Col sm="6">
                          <Row>
                            <Col sm="auto" className="labelWidth alignCenter">
                              <span className="text-left labelfont">Password Expiry</span>
                            </Col>
                            <Col sm="4">
                              <Calendar showIcon="true" value={this.state.pwdexpiryDt}
                                onChange={(e) => this.setState({ pwdexpiryDt: e.value })} style={{ marginLeft: "11px", background: "lightslategrey" }}></Calendar>
                            </Col>
                          </Row><br />
                          <Row>
                            <Col sm="auto" className="labelWidth alignCenter">
                              <span className="text-left labelfont">
                                Phone Number(s)</span>
                            </Col>
                          </Row>
                          <Row> &nbsp;
                      <div style={{ width: "90%" }}>
                              <DataTable value={this.state.rows} editable={true} ref={(el) => { this.dtPhones = el; }} >
                                <Column header="Phone Type" body={this.typeTemplate} style={{ width: '30%' }} />
                                <Column header="Phone Number(s)" body={this.phoneTemplate} style={{ width: '30%' }} />
                                <Column header={customHeader} style={{ width: '5%' }} body={this.actionTemplate} />
                              </DataTable>
                            </div>
                          </Row>

                        </Col>
                      </Row>
                    </Paper>

                  </div>
                </div>
              </div>
            </div>
          </div>
          {assingRoles}

           <Row>
                      <Col sm="12" style={{ paddingTop: '1%',paddingBottom: '1%'}}>
                        <br/>
                      </Col>
                    </Row>
             <Row>
                      <Col sm="12" style={{ float: "right", margin: "5px" }}>
                        <Button label="Cancel" style={{ float: "right", background: "lightslategray", borderColor: "lightslategray" }}
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
    userState: state.ManageUserState
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      ...ManageUserActions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(UserComponent);
