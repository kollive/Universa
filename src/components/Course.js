import React, { Component } from 'react';
import CourseImg from '../images/course_cal.PNG'

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

export default class Course extends Component {

    render() {
        return(
            <Container fluid style={{ width: 1024, overflow: "hidden", margin: "20px" }} >
           <div className="d-flex">             
                <Row> <Col sm="12">
                <Card style={{ width: '900px'} }>
                 <CardImg
                
                style={{width:"100%",height:"100%"}}
                    src={CourseImg}                
              />
            </Card>
                </Col>

                </Row>
            </div>
            </Container>
        )
    }

}