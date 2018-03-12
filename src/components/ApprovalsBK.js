import React, { Component } from 'react';
import approvalGrid from '../images/approvals.PNG'

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

export default class ApprovalsTab extends Component {

    render() {
        return(
            <Container fluid style={{ width: 1024, overflow: "hidden",margin:'20px' }} >
                {/* <div style={{height : '50px'}}></div> */}
            <div className="d-flex">
               
                <Row> <Col sm="12">
                <Card style={{ width: '1000px'} }>
                 <CardImg
                
                style={{width:"100%",height:"100%"}}
                    src={approvalGrid}                
              />
            </Card>
                </Col>

                </Row>
            </div>
            </Container>
        )
    }

}