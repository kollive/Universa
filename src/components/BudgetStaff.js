import React, { Component } from 'react';
import Staffandbdgt from '../images/Staffandbdgt.PNG'
import RaisedButton from "material-ui/RaisedButton";
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
    CardImg

} from "reactstrap";
import Divider from 'material-ui/Divider';

export default class ApprovalsTab extends Component {

    render() {
        return (
            /* <Container fluid >
             { <div style={{height : '50px'}}></div> }
         <div  >
                        
              <CardImg
             
             style={{width:"100%",height:"60%"}}
                 src={Staffandbdgt}                
           />*/

            <Container fluid style={{ width: 1024, overflow: "hidden", marginTop: "20px", marginLeft: "10px" }} >
                {/* <div style={{height : '50px'}}></div> */}
                <div className="d-flex">

                    <Row> <Col sm="12">
                        <Card style={{ width: '1000px' }}>
                            <CardImg

                                style={{ width: "100%", height: "80%" }}
                                src={Staffandbdgt}
                                /><br/>
                                <div style={{'margin-left':"auto"}}>
                            <a
                                href={"http://hvs.selfip.net:4003/budgetexcel"}
                                download={"test.xlsx"}
                                > 
                                  <Button
                        size="sm"
                                     style={{ justifyContent: "right" ,backgroundColor:"#507EB1"}} >Standard Budget/Accounting Report
                      </Button>
                    
                            </a>
</div>
                        </Card>
                    </Col>

                    </Row>


                     

                </div>
            </Container>
        )
    }

}