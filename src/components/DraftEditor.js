import React, { Component } from "react";
import { connect } from "react-redux";
import ReactDOM from 'react-dom';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';

import { bindActionCreators } from "redux";
import { types as drafteditorTypes } from "../reducers/drafteditorreducer";
import { actions as drafteditorActions } from "../reducers/drafteditorreducer";
//import Timesheet from './Timesheet/Timesheet'
import * as _ from "lodash";
//import {html2canvas, jsPDF} from 'app/ext';
import html2canvas from "html2canvas"
import * as jsPDF from 'jspdf'
import "../App.css";
import { DatePicker, TimePicker } from 'antd';
import {
    Form, Select, InputNumber, Switch, Radio, Table, Spin,
    Slider, Button, Upload, Icon, Rate, Menu, Dropdown, message, Popconfirm, Row,
    Col,
} from 'antd';
import moment from 'moment';

import {
    Container,
    TabContent,
    TabPane,
    Card,
    Table as RTable,
    Collapse,
    CardBody,
    //Button,
    CardTitle,
    CardText,
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
    },
    err: {
        backgroundColor: "red"
    }

};

const addDays = (dt, days) => {
    let d = new Date(dt);
    d.setDate(d.getDate() + days);
    return d;
}
const hhmmToSeconds = (str) => {
    let arr = str.split(':').map(Number);
    return (arr[0] * 3600) + (arr[1] * 60);
};

const secondsToHHMM = (seconds) => {
    let hours = parseInt(seconds / 3600, 10),
        minutes = parseInt((seconds / 60) % 60, 10);
    //seconds = parseInt(seconds % 3600 % 60, 10);

    return [hours, minutes].map(function (i) { return i.toString().length === 2 ? i : '0' + i; }).join(':');
}


const formatDate = (dt) => {
    let d = new Date(dt);
    //d.setDate(d.getDate() + 1);
    return d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2); //d.getHours() d.getMinutes()
}

//dayName                        monthDay                                                      taskDt 
const columns = [{
    title: 'Task ID',
    dataIndex: 'task_id',
    key: 'dayName',
    width: '5%'
}, {
    title: 'Task Title',
    dataIndex: 'task_description',
    key: 'task_description',
    width: '15%'
},
{
    title: 'Mon',
    dataIndex: 'monHrs',
    key: 'monHrs',
    width: '10%',
    render: (text, record, index) => {
        /*
       const obj = {
           children: text,
           props : {}
       }      
       if(index === 1){
           obj.props.colSpan = 0;
       }
        return obj;
       */
        return secondsToHHMM(text);
    },
},
{
    title: 'Tue',
    dataIndex: 'tueHrs',
    key: 'tueHrs',
    width: '10%',
    render: (text, record, index) => {
        return secondsToHHMM(text);
        /*
        let dt = new Date(record.task_date);
        if (dt.getDay() == 2) {
            return record.num_hours
        } else {
            return "00.00"
        }
        */
    },
},
{
    title: 'Wed',
    dataIndex: 'wedHrs',
    key: 'wedHrs',
    width: '10%',
    render: (text, record, index) => {
        return secondsToHHMM(text);
    },
},
{
    title: 'Thu',
    dataIndex: 'thuHrs',
    key: 'thuHrs',
    width: '10%',
    render: (text, record, index) => {
        return secondsToHHMM(text);
    },
},
{
    title: 'Fri',
    dataIndex: 'friHrs',
    key: 'friHrs',
    width: '10%',
    render: (text, record, index) => {
        return secondsToHHMM(text);
    },
},
{
    title: 'Sat',
    dataIndex: 'satHrs',
    key: 'satHrs',
    width: '10%',
    render: (text, record, index) => {
        return secondsToHHMM(text);
    },
},
{
    title: 'Sun',
    dataIndex: 'sunHrs',
    key: 'sunHrs',
    width: '10%',
    render: (text, record, index) => {
        return secondsToHHMM(text);
    },
},
{
    title: 'Total',
    dataIndex: 'totHrs',
    key: 'totHrs',
    width: '10%',
    render: (text, record, index) => {
        return secondsToHHMM(text);
    },
},
];

const sumWeeklyHours = (WeekData) => {
    const sumHrs = WeekData.reduce((sum, week) => {
        return sum + week.totHrs
    }, 0)
    return sumHrs;
}

class DraftEditor extends Component {
    /*
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };
        this.onChange = (editorState) => this.setState({ editorState });
        //alert(this.props.hv_staff_id);
    }
    */

    onMenuClick = (itm, row) => {
        //debugger;
        //alert(row.task_id)
        //message.info(`Click on item ${itm.key}`);
        //if (itm.key == 0) {
        //    this.editTask(row);
        //}
        this.setState({ month: itm.key });
        this.setState({ loading: true });

        this.props.getMonthlyTS({
            type: drafteditorTypes.FETCH_TABLES_REQUEST,
            payload: {
                //staffID: (this.props.staffID == "" ? this.props.CommonState.hv_staff_id : this.props.staffID),
                staffID: (this.props.hv_staff_id == "" ? this.props.CommonState.hv_staff_id : this.props.hv_staff_id),
                month: itm.key
            }
        });

    };

    printDocument = () => {
        debugger;
        let input = document.getElementById('divWPlan');
        //input.parentElement.style.width = '10000px';
        var styleOrig = input.getAttribute("style");

        html2canvas(input).
            then((canvas) => {
                debugger;

                var ctx = canvas.getContext('2d');
                var imgData = canvas.toDataURL("image/png", 1);
                //const pdf = new jsPDF('p', 'pt', 'a4');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'JPEG', 0, 0, 218, 300);

                pdf.save("download.pdf");
                input.setAttribute("style", styleOrig);
            });
    }


    getStaffID = () => {
        //alert("in Getstaff")
        let userid;
    }

    componentWillMount = () => {
        //debugger;

    }


    componentDidUpdate(prevProps, prevState) {
        //alert("DidUpdate")
        //console.log("componentDidUpdate");
        //console.log(this.state);
        if (_.trim(this.props.DraftEditorState.message.msg) != "") {
            //debugger;      
            alert(this.props.DraftEditorState.message.msg);
            this.props.resetMessage({
                type: drafteditorTypes.MESSAGE,
                message: { val: 0, msg: "" }
            });
        } else {

        }
    }

    componentWillReceiveProps(nextProps) {
        debugger;
        if (nextProps.DraftEditorState) {
            //console.log("Contentttttttttt")
            //console.log(nextProps)
            if (nextProps.DraftEditorState.content != null) {
               //alert("in Props")
                //console.log( convertFromRaw(nextProps.DraftEditorState.content))
                this.setState({
                    //editorState : EditorState.createWithContent(convertFromRaw(nextProps.DraftEditorState.content)),                    
                    editorState: EditorState.createWithContent(convertFromRaw(nextProps.DraftEditorState.content))
                })
                //this.setState({
                //    editorState: convertFromRaw(nextProps.DraftEditorState.content)
                //})
                //console.log("(((((((((((((((((((((((((()))))))))))))))))))))))))")
                //console.log(this.state.editorState)
            }
        }

        /*
        //alert(nextProps.hv_staff_id)
        //alert(this.props.hv_staff_id)
        if (this.props.hv_staff_id != nextProps.hv_staff_id) {
            //this.setState({spinning:true});

            this.props.getMonthlyTS({
                type: drafteditorTypes.FETCH_TABLES_REQUEST,
                payload: {
                    staffID: (nextProps.hv_staff_id == "" ? "10" : nextProps.hv_staff_id),
                    //staffID: "10",
                    month: "march"
                }
            });
        } else {
            this.setState({ loading: false });
        }

        if (nextProps.DraftEditorState) {
            this.setState({ items: nextProps.DraftEditorState.items[0] });
        }
        */
    }

    componentDidMount() {
        debugger;
         
        //this.setState({ loading: true });
        this.props.getEditorContent({
            type: drafteditorTypes.GETCONTENT_REQUEST,
            payload: {                
            }
        });
            
    }

    constructor(props) {
        super(props);
        this.state = { 
            serverEditorState : EditorState.createEmpty(),
            editorState: EditorState.createEmpty() 
        };

        this.focus = () => this.refs.editor.focus();
        this.onChange = (editorState) => this.setState({ editorState });

        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    }

    _handleKeyCommand(command) {
        const { editorState } = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    handleEditorChange = _.debounce((editorState) => {
        // We need to continue updating the local state in order
        // to get the latest selection position
        this.setState({ editorState })
        debugger;
        // Your Redux action
/*
        this.props.updateMongo({
            type: drafteditorTypes.UPDATEMONGO_REQUEST,
            payload: {
                content: convertToRaw(this.state.editorState.getCurrentContent())
            }
        });

    }, 1500);
    */
        
        this.props.setEditorContent({
            type: drafteditorTypes.UPDATECONTENT_REQUEST,
            payload: {
                content: convertToRaw(editorState.getCurrentContent())
            }
        });
        
    }, 10);

    upsertMongo = () => {
        this.props.updateMongo({
            type: drafteditorTypes.UPDATEMONGO_REQUEST,
            payload: {
                content: convertToRaw(this.state.editorState.getCurrentContent())
            }
        });
    }

    render() {
        const { editorState, serverEditorState } = this.state;

        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        return (
            <div>
                <Button onClick={() => this.upsertMongo()}> Mongo </Button>
                <div className="RichEditor-root">
                    <BlockStyleControls
                        editorState={editorState}
                        onToggle={this.toggleBlockType}
                    />
                    <InlineStyleControls
                        editorState={editorState}
                        onToggle={this.toggleInlineStyle}
                    />
                    <div className={className} onClick={this.focus}>
                        <Editor
                            blockStyleFn={getBlockStyle}
                            customStyleMap={styleMap}
                            //editorState={editorState}
                            handleKeyCommand={this.handleKeyCommand}
                            //onChange={this.onChange}
                            onTab={this.onTab}
                            placeholder="Tell a story..."
                            ref="editor"
                            editorState={EditorState.acceptSelection(editorState, this.state.editorState.getSelection())}
                            onChange={this.handleEditorChange}
                            spellCheck={true}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        DraftEditorState: state.DraftEditorState,
        CommonState: state.CommonState
    };
};

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(
        {
            ...drafteditorActions
        },
        dispatch
    )
});


export default connect(mapStateToProps, mapDispatchToProps)(DraftEditor);

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}

const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'code-block' },
];

const BlockStyleControls = (props) => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

var INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

