import React, { Component } from 'react';

import Paper from "material-ui/Paper";
import Divider from "material-ui/Divider";
import TextField from "material-ui/TextField";
import { Button } from 'primereact/components/button/Button';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
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

import { types as ChangeOrderTypes, permissions as Permissions } from "../../reducers/ChangeOrders/changeOrderreducer";
import { actions as ChangeOrderActions } from "../../reducers/ChangeOrders/changeOrderreducer";

import { types as roleTypes  } from "../../reducers/rolereducer";
import { actions as roleActions } from "../../reducers/rolereducer";
import * as utils from "../../Utils/common";

class MaintainChangeOrder extends Component {
  constructor(props) {
    debugger

    super(props);
    let userid;
    if (JSON.parse(sessionStorage.getItem("roles")) && !!sessionStorage.getItem("roles")) {
      //debugger

      _.map(JSON.parse(sessionStorage.getItem("roles")), function (o) {
          userid = o.hv_user_id
      })
  }
    form: null;
    this.state = {
      contract_no : '',
      change_order_desc : '',
      change_order_abstract : '',
      work_order_id : '',
      userid: '',
      change_order_id : '',
      permissions: '',
      btndisabled: false,
      workOrderList : [],
      workOrderClients : [],
      lstClients: [],
      clientId : '',    
      loggedinuser:userid,
      parentProps:props
    }
    this.submitForm = this.submitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onClientChange = this.onClientChange.bind(this);
    this.CloseDialog = this.CloseDialog.bind(this);
  }

  CloseDialog(e) {
    e.preventDefault();
    if (this.props) {
      this.props.onDialogClose();
    }
  }

  checkPermission = (function_id) => {
    // debugger
    return utils.checkPermission(Permissions, function_id);
  }

  onClientChange(e) {   
    debugger
    this.setState({ clientId: e.value });   
    if (this.state.workOrderClients != []){
       let  flist =  _.filter(this.state.workOrderClients,{'client_id':e.value.client_id});
      this.setState({workOrderList : flist});
    }
  }

  componentDidUpdate(prevProps,prevState){
    debugger
    if (this.props.changeOrderState.message.val == 2) {
      if (this.props.changeOrderState.message.statusMsg != undefined) {
        if (this.props.changeOrderState.message.statusMsg[0].hasOwnProperty('ReturnMessage')) {
          alert(this.props.changeOrderState.message.statusMsg[0].ReturnMessage);
          this.props.onDialogClose();
        }
        else
          alert('Error in transaction!!');
      }
      else
        alert("Error in the transaction!!");     
      //this.props.onDialogClose();
      this.props.resetMessage({
        type: ChangeOrderTypes.MESSAGE,
        message: { val: 0, statusMsg: "" }
      });
    }      
    else if (this.props.changeOrderState.message.statusMsg != "" && this.props.changeOrderState.message.val < 0 ){
      debugger
    if (this.props.changeOrderState.message.val == -2)
            this.props.showTimeOut(this.props.changeOrderState.message.statusMsg);
     else 
       alert(this.props.changeOrderState.message.statusMsg);
      this.props.resetMessage({
        type: ChangeOrderTypes.MESSAGE,
        message: { val: 0, statusMsg: "" }
      });
    }
  }

  handleChange(e) {
    const target = e.currentTarget;
    this.form.validateFields(target);
    this.setState({
      btndisabled: !this.form.isValid()
    });
  }
  componentDidMount() {

    if (this.props.COObject != null) {
      if (!this.props.COObject.isNewUser)
        this.setState({ isReadOnly: true });        
      else if (this.props.COObject.isNewUser){
        if(sessionStorage.getItem("token") == undefined){
          this.props.showTimeOut("Please login to proceed !!!");
        }
      }
          this.props.getCOScreenDetails({
          type:  ChangeOrderTypes.GET_SCREENDATA_REQUEST,
          payload: [{},{ function_Id: '70' }]
          });
        }
        }
        

      componentWillReceiveProps(nextProps) {
          debugger
            if (nextProps.changeOrderState!==undefined) {
            if (nextProps.changeOrderState.items.length > 0) {
             this.setState({ lstClients: nextProps.changeOrderState.items[0] })
             if (nextProps.changeOrderState.items.length > 1)
             this.setState({ workOrderClients: nextProps.changeOrderState.items[1] })
            }
          }


         if (nextProps.COObject != undefined) {
         if (nextProps.COObject.currectSelectedCO != null) {
          var order = nextProps.COObject.currectSelectedCO
          if (order.client_id != null ){
            if (nextProps.changeOrderState.items[1] != []){
              let  flist =  _.filter(nextProps.changeOrderState.items[1],{'client_id':order.client_id});
             this.setState({workOrderList : flist});
           }
          }
          debugger
            this.setState({
                  change_order_id : order.change_order_id,
                  contract_no: order.contract_no,
                  change_order_abstract: order.change_order_abstract,
                  change_order_desc: order.change_order_desc,
                  clientId: _.find(nextProps.changeOrderState.items[0], { 'client_id': order.client_id }),
                  work_order_id: _.find(nextProps.changeOrderState.items[1], { 'work_order_id': order.work_order_id }),
                  userid: order.createdby
            })
         }

         }
        }

        submitForm(e) {
          e.preventDefault();
          if (utils.checkPermission(Permissions, 70)) {
            debugger
            if(this.state.clientId.length==0)
            {
            alert('Please select valid Client Details.')
            return;
            }
            if(this.state.work_order_id.length==0)
            {
            alert('Please select proper Work Order.')
            return;
            }  
            this.form.validateFields();            
            if (this.form.isValid()) {
              if (this.props.COObject.isNewUser)
                this.insertChangeOrderDetails();
              else
              this.updateChangeOrderDetails();
            }
          }
          else
            alert("Please check the permissions. You don't have access to make changes!!");
        }

        updateChangeOrderDetails() {
          this.props.updateChangeOrderDetails({
            type: ChangeOrderActions.UPDATE_CHANGEORDER_REQUEST,
            order:[{        
              change_order_id :   this.state.change_order_id,
              change_order_abstract: _.trim(this.change_order_abstract.getValue()),          
              change_order_desc: _.trim(this.change_order_desc.getValue()),
              client_id: this.state.clientId.client_id,
              work_order_id: this.state.work_order_id.work_order_id,
              contract_no: _.trim(this.contract_no.getValue()),
              user_id:this.state.loggedinuser
            },
            {
              function_Id:70
            }
            ]
          });
        }
        insertChangeOrderDetails() {
          this.props.inserChangeOrderDetails({
            type: ChangeOrderActions.INSERT_CHANGEORDER_REQUEST,
            order:[{              
              change_order_abstract: _.trim(this.change_order_abstract.getValue()),          
              change_order_desc: _.trim(this.change_order_desc.getValue()),
              client_id: this.state.clientId.client_id,
              work_order_id: this.state.work_order_id.work_order_id,
              contract_no: _.trim(this.contract_no.getValue()),
              user_id:this.state.loggedinuser
            },
            {
              function_Id:70
            }
            ]
          });
        }

        render() {
          debugger
          let showSaveButton = '';let classDisable=''
          if (this.checkPermission(70)) {
            showSaveButton = <Button label="Save" style={{ float: "right", background: "grey", borderColor: "grey" }}
              disabled={this.state.btndisabled} onClick={this.submitForm}
              />
          }
            //alert(this.props.isView)
        //   if(this.props.staffObject!==undefined)
        //  classDisable=this.props.staffObject.isView
          return (
            <div  className={classDisable} >
              <FormWithConstraints ref={formwithConstraints => this.form = formwithConstraints} noValidate>
                <div id="divOrders" >
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="box box-info">
                        <div className='box-body' style={{ minHeight: "300px", width: '100%' }}>
                          <div className="row"  >
                            <div className="col-sm-2 alignCenter" >
                              <span className="text-left labelfont">Contract Number</span>
                            </div>
                            <div className="col-sm-4 alignCenter">
                              <TextField id="txtContractNo" name="txtContractNo" style={{ width: '80%' }}
                                className="font11" maxLength="50"
                                ref={element => (this.contract_no = element)}
                                value={this.state.contract_no}
                                onChange={(e) => {
                                 this.setState({ contract_no: e.target.value })
                                } }
                                hintText="Enter Contract Number" />     
                            </div>
                          </div>
                          <div className="row">
                           <div className="col-sm-2 alignCenter" >
                              <span className="labelfont">Change Order Abstract</span>
                            </div>
                            <div className="col-sm-4 alignCenter">
                              <TextField id="txtAbstract" name="txtAbstract" style={{ width: '90%' }}
                                className="font11"  maxLength="100" multiLine={true} rows={2} 
                                ref={element => (this.change_order_abstract = element)}
                                value={this.state.change_order_abstract} required
                                onChange={(e) => {
                                  this.form.validateFields(e.target);
                                  this.handleChange(e);
                                  this.setState({ change_order_abstract: e.target.value })
                                } }
                                hintText="Enter brief details" />
                              <FieldFeedbacks style={{ width: "256px", color: "red" }} for="txtAbstract">
                                <FieldFeedback when="valueMissing">Please provide details.</FieldFeedback>
                              </FieldFeedbacks>
      
                            </div>
                            </div>
                            <div className="row">
                           <div className="col-sm-2 alignCenter" >
                              <span className="labelfont">Description</span>
                            </div>
                            <div className="col-sm-4 alignCenter">
                              <TextField id="txtDetails" name="txtDetails" style={{ width: '90%' }}
                                className="font11"  maxLength="250" multiLine={true} rows={3} 
                                ref={element => (this.change_order_desc = element)}
                                value={this.state.change_order_desc} required
                                onChange={(e) => {
                                  this.form.validateFields(e.target);
                                  this.handleChange(e);
                                  this.setState({ change_order_desc: e.target.value })
                                } }
                                hintText="Enter detailed description here." />
                              <FieldFeedbacks style={{ width: "256px", color: "red" }} for="txtDetails">
                                <FieldFeedback when="valueMissing">Please provide Details</FieldFeedback>
                              </FieldFeedbacks>      
                            </div>
                            </div>
                          <div className="row"  >
                            <div className="col-sm-2  alignCenter" >
                              <span className="text-left labelfont">Client</span>
                            </div>
                            <div className="col-sm-3 alignCenter">
                              <Dropdown value={this.state.clientId} optionLabel="client_name" id="ddlClients"
                                onChange={this.onClientChange} options={this.state.lstClients}
                                style={{ width: "80%", fontSize: '12px' }} placeholder="Select Client" required />
                            </div>
                            <div className="col-sm-1 alignCenter" >                          
                            </div>
                            <div className="col-sm-2 alignCenter" >
                              <span className="labelfont">Work Order </span>
                            </div>
                            <div className="col-sm-4 alignCenter">
                              <Dropdown value={this.state.work_order_id} options={this.state.workOrderList} 
                              optionLabel="work_order_name" 
                               onChange={(e) =>{
                                  this.setState({work_order_id : e.value})
                               }} style={{ width: "80%", fontSize: '12px' }}
                                required
                                placeholder="Select Work Order Number" id="ddlWorkOrders" />
                              <FieldFeedbacks style={{ width: "256px", color: "red" }} for="ddlWorkOrders">
                                <FieldFeedback when="valueMissing">Work Order Details required.</FieldFeedback>
                              </FieldFeedbacks>      
                            </div>
                          </div>
                          <div className="row"  >
                            <br />
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
        changeOrderState: state.MaintainChangeOrderState
      };
    };

    const mapDispatchToProps = dispatch => ({
      ...bindActionCreators(
      {
          ...ChangeOrderActions
        },
      dispatch
    )
    });


    export default connect(mapStateToProps, mapDispatchToProps)(MaintainChangeOrder);