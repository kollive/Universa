import React, { Component } from "react";
import { connect } from "react-redux";

import Badge from "material-ui/Badge";
import IconButton from "material-ui/IconButton";
import Paper from "material-ui/Paper";
import Divider from "material-ui/Divider";
import NotificationsIcon from "material-ui/svg-icons/social/notifications";
import export_excel from "../images/export_excel.PNG";
import chart from "../images/chart.PNG";

//import ApprovalsTab from "./Approvals";
import CadetInlineSearch from "./CadetInlineSearch";
//import { actions as cadetDetailsActions } from "../../reducers/cadetdetailsreducer";
import TimeSheetHeader from "./TimeSheetHeader";
import WorkPlan from "./WorkPlan";
import { bindActionCreators } from "redux";
import { types as commonTypes } from "../reducers/commonreducer";
import { actions as commonActions } from "../reducers/commonreducer";
import Timesheet from './Timesheet/Timesheet'
import * as _ from "lodash";
//import {html2canvas, jsPDF} from 'app/ext';
import html2canvas from "html2canvas"
import * as jsPDF  from 'jspdf'

import {
    Container,
    TabContent,
    TabPane,
    Card,
    Table,
    Collapse,
    CardBody,
    Button,
    CardTitle,
    CardText,
    Row,
    Col,
    DropdownToggle
} from "reactstrap";

const paperStyle = {
    height: "130px",
    width: "90%",
    display: "flex"
};
const styles = {
    link: {
        cursor: "pointer"
    }
};

class TimeSheetContainer extends Component {
    constructor(props) {
        super(props);
        //alert(this.props.hv_staff_id);

        this.state = {
            staff_id: (this.props.hv_staff_id == "" ? this.props.CommonState.hv_staff_id : this.props.hv_staff_id),
            notifycollapse: true,
            indicatorscollapse: true,
            showApprovals: false,
            showHome: true,
            searchCadet: true,
            staffID: "",
            startDT: null,
            endDT: null,
            mode: "W",
            name: "",
            hv_staff_id: (this.props.hv_staff_id == "" ? this.props.CommonState.hv_staff_id : this.props.hv_staff_id)
        };
        // this.onClickAction = this.onClickAction.bind(this);
        this.setDate = this.setDate.bind(this);
        this.setMode = this.setMode.bind(this);
        this.parentStaffID = this.parentStaffID.bind(this);
        this.printDocument = this.printDocument.bind(this);
        
        this.getStaffID();               
        /*
        if(this.props.CommonState.hv_staff_id) {
            alert("receive")
            alert( this.props.CommonState.hv_staff_id )
            alert(this.props.hv_staff_id)

        if(this.props.hv_staff_id != this.props.CommonState.hv_staff_id &&  this.props.CommonState.hv_staff_id != "" && this.props.hv_staff_id == "") {
            
            this.setState({
                hv_staff_id :  this.props.CommonState.hv_staff_id,
                staff_id :  this.props.CommonState.hv_staff_id
            })
            //alert(this.props.CommonState.hv_staff_id)
            alert(this.state.staff_id)
        }
        }
        */

    }

    printDocument = () => {
        debugger;
        let input = document.getElementById('divToPrint');
        //input.parentElement.style.width = '10000px';
        var styleOrig = input.getAttribute("style");
        //input.setAttribute("style", "width: 1400px; height: 480px;");
        //input.setAttribute("style", "font:bold 48px helvetica");
//var div =  document.getElementById('divToPrint');
//var rect = input.getBoundingClientRect();

//var canvas = document.createElement("canvas");
//canvas.width = rect.width;
//canvas.height = rect.height;

//var ctx = canvas.getContext("2d");
//ctx.translate(-rect.left,-rect.top);
//{scale:4}

html2canvas(input).
    then((canvas) => {
        debugger;

        var ctx = canvas.getContext('2d');
        //ctx.scale(-1, 1);
        //ctx.font = "48px Palatino";
        //ctx.scale(10, 3);
        //ctx.font = '32px Palatino';

        /*
        if (window.devicePixelRatio) {

            var hidefCanvasWidth =canvas.getAttribute("width");
            var hidefCanvasHeight = canvas.getAttribute("height");
            var hidefCanvasCssWidth = hidefCanvasWidth;
            var hidefCanvasCssHeight = hidefCanvasHeight;
        
            //canvas.setAttribute("width" , hidefCanvasWidth * window.devicePixelRatio);
            //canvas.setAttribute("height", hidefCanvasHeight * window.devicePixelRatio);
            //input.css('width', hidefCanvasCssWidth);
            //input.css('height', hidefCanvasCssHeight);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);               
          }
          */

        //ctx.webkitImageSmoothingEnabled = false;
        //ctx.mozImageSmoothingEnabled = false;
        //ctx.imageSmoothingEnabled = false;
        //var myImage = canvas.toDataURL("image/jpeg,1.0");  
        //canvas.width = rect.width;
        //canvas.height = rect.height;
        //canvas.scale=2;
        var imgData = canvas.toDataURL("image/png",1);
        //const pdf = new jsPDF('p', 'pt', 'a4');
        const pdf = new jsPDF();
        

//pdf.setFont("helvetica");
//pdf.setFontType("bold");
//pdf.setFontSize(24);
        //pdf.canvas.height = 72 * 11;
        //pdf.canvas.width = 72 * 8.5;

        //pdf.fromHTML(input);
        //pdf.addImage(imgData,'JPEG',0, 0);
        //pdf.addImage(imgData,'JPEG',0, 0, 200, 60);
        pdf.addImage(imgData,'JPEG',0, 0, 212, 65);
        
        pdf.save("download.pdf");
        input.setAttribute("style", styleOrig);
        //var pHtml = "<img src="+image+" />";
        //$("#parent").append(pHtml);
    });
    }

/*
        html2canvas(input)
          .then((canvas) => {
            
            const imgData = canvas.toDataURL('image/png',1.0);
            const pdf = new jsPDF();
           
            //pdf.addImage(imgData, 0, 0, imgWidth, imgHeight);

            pdf.addImage(imgData,'JPEG',0, 0);
            // pdf.output('dataurlnewwindow');
            pdf.save("download.pdf");
          })
        ;
      }
      */

    getStaffID=()=>{
        //alert("in Getstaff")
        let userid;
        if (JSON.parse(sessionStorage.getItem("roles")) && !!sessionStorage.getItem("roles")) {
            //debugger
            _.map(JSON.parse(sessionStorage.getItem("roles")), function (o) {
                userid = o.hv_user_id
            })
        }
       // alert(userid)
       //alert(this.state.staff_id)
       if(this.props.hv_staff_id != "") {
            this.props.setStaffID({
                type: commonTypes.STAFFID,
                payload: {
                    hv_staff_id : this.props.hv_staff_id               
                }
            });
            
            this.setState({
                staff_id : this.props.hv_staff_id,
                hv_staff_id :  this.props.hv_staff_id
            })
        }

        this.props.setUserID({
            type: commonTypes.USERID,
            payload: {
                hv_user_id: userid         
            }
        });

        if(this.props.name != "" ) {
        this.props.setName({
            type: commonTypes.NAME,
            payload: {
                hv_name : this.props.name               
            }
        });
    }
    }

    componentWillMount = () => {
        debugger;
        
    }
    
    componentWillReceiveProps(nextProps) {
        /*
           if(nextProps.CommonState) {
                
                    if(this.props.hv_staff_id != nextProps.CommonState.hv_staff_id &&  nextProps.CommonState.hv_staff_id != "" ) {
                    this.setState({
                        staff_id : nextProps.CommonState.hv_staff_id
                    })
            }
                //alert("receive")
                //alert(nextProps.CommonState.hv_staff_id)
            }
           */
    }

    componentDidMount() {
        debugger;
        //alert(this.props.CommonState.hv_staff_id)
        //alert(this.props.name) 
           
    }

    setDate(startDT, endDT) {
        debugger;
        //alert(this.state.hv_staff_id);
        this.setState({
            startDT: startDT,
            endDT: endDT,
        });

    }
 
    setMode(mode) {
        debugger;
        //alert(this.state.hv_staff_id);
        this.setState({
            mode: mode
        });

    }

    parentStaffID (staffID){
        //alert("staff")
        //alert(staffID)
       this.setState({
            staff_id: staffID
        });

        //staffID={ (this.props.hv_staff_id !="") ?  this.props.hv_staff_id : this.state.staff_id} />
        /*
       className="mt4" 
       style = {{
            backgroundColor: '#f5f5f5',
            width: '210mm',
            minHeight: '297mm',
            marginLeft: 'auto',
            marginRight: 'auto'
        }}
        */
    }


    render() {
        this.renderTimesheet=<Timesheet headerState={this.state}        
        staffID={this.state.staff_id}  />

        return (
            <div>
      <div className="mb5">
        <button onClick={this.printDocument}>Print</button>
      </div>
      <div id="divToPrint" style={{width:"100%", display:"inline-block"}}>
            <Container
                fluid
                style={{ margin: "10px" }}>
                <div>
                    <div>
                        <Row >
                            {" "}
                            <Col sm="12">
                                <TimeSheetHeader staffID={this.state.hv_staff_id} hv_name={(this.props.CommonState.hv_name == "" ? this.props.name : this.props.CommonState.hv_name )} callParentDates={this.setDate} callParentMode={this.setMode} 
                                callParentStaffID={this.parentStaffID}
                                />
                            </Col>
                        </Row>
                    </div>
                    <Divider />
                      <div >                        
                        <Row >
                            {" "}
                            <Col sm="12">
                            <Timesheet headerState={this.state} staffID={this.state.staff_id}  />
                            </Col>
                        </Row>
                    </div>
                    <div >                        
                        <Row >
                            {" "}
                            <Col sm="12">
                                <WorkPlan staffID={this.state.staff_id}  startDT={this.state.startDT} endDT={this.state.endDT} mode={this.state.mode} />
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>
            </div>
    </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        CommonState: state.CommonState
    };
};

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(
        {
            ...commonActions
        },
        dispatch
    )
});



export default connect(mapStateToProps, mapDispatchToProps)(TimeSheetContainer);
