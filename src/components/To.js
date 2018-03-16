import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//import { itemsFetchData, itemUpdateData, itemDeleteData } from '../actions/items';
import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';

import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import FontIcon from 'material-ui/FontIcon';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import { blue300, indigo900, orange200, deepOrange300, pink400, purple500, } from 'material-ui/styles/colors';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

import '../App.css';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import DropDownMenu from 'material-ui/DropDownMenu';

const styles = {
    paperStyle: {
        height: '90%',
        width: '90%',
        //margin: 20,
        marginTop: 10,
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center'
    },
    toolStyle: {
        height: '90%',
        width: '90%',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-between'
    }

}

const style = {
    margin: 12,
};


class ToComponent extends Component {
    _handleTouchTap = (token) => {
        debugger;
        if(token == "T") {
            this.props.callTOSvc({ type: "FETCH_TO_DATA", payload: { token: sessionStorage.getItem('token') } });
        } else {
            this.props.callTOSvc({ type: "FETCH_TO_DATA", payload: { token: "" } });
        }
        //this.context.router.history.push('/grid');     
    }

    componentWillMount() {
        debugger;
        /*
         if (this.props) {
            this.props.fetchSagaData({ type: "FETCH_DATA_REQUEST", payload: { user: 'ttuso', password: 'ttuso' } });
        }
        */
        /*
        let mode;
        if (this.props.age > 70) {
            mode = 'old';
        } else if (this.props.age < 18) {
            mode = 'young';
        } else {
            mode = 'middle';
        }
        this.setState({ mode });
        */
    }


    componentDidUpdate(prevProps, prevState) {
        //this.context.router.history.push('/grid', ...this.state);
        alert("token: " + sessionStorage.getItem('token'))
        alert(this.props.message);
    }


    componentWillReceiveProps(nextProps) {
        debugger;
    }

    shouldComponentUpdate(nextProps, nextState) {
        debugger;
        return true;
        /*
        if (this.props.isLoading !== nextProps.isLoading) {
            return true;
        }
        if (this.state.items !== nextState.items) {
            return true;
        }
        return true;
        */
    }

    componentDidMount() {
        debugger;
        //branch test
        //this.props.fetchData('http://5826ed963900d612000138bd.mockapi.io/items');
        //this.props.fetchData('http://localhost:4000/reactlogin/');

    }

    constructor(props) {
        super(props);
        //this.state = {open: false};
    }

    state = {
        height: '300px',
        items: [],
        mode: undefined,
        itemsHasErrored: false,
        itemsIsLoading: false,
        open: false
    };

    /*
    _handleTouchTap = (row, edit) => {
        debugger;
        //console.log(e);
        //alert(e.target)
        //alert(e.target.outerHTML)
        //alert(e.target.name)
        if (edit === "E") {
            this.props.updateData({ type: "UPDATE_ROW", payload: row });
            //this.props.updateData(row);
        } else {
            this.props.deleteData({ type: "DELETE_ROW", payload: row });
        }
        //e.preventDefault();
        //this.forceUpdate();
        //alert(row);

    }
    */

    handleToggle = () => this.setState({ open: !this.state.open });
    handleClose = () => this.setState({ open: false });

    render() {
        /*
        if (this.props.hasErrored) {
            return <p>Sorry! There was an error loading the items</p>;
        }

        if (this.props.isLoading) {
            return <p>Loading…</p>;
        }
        */

        return (

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', textAlign: 'center' }}>
                    <span style={{ display: 'flex', alignSelf: 'center' }}>
                        <FontIcon className="material-icons" style={{ cursor: 'pointer' }} onTouchTap={this.handleToggle}>view_headline</FontIcon>
                        <Drawer open={this.state.open} docked={false} width={60} onRequestChange={(open) => this.setState({ open })}>
                            <MenuItem style={{ backgroundColor: blue300 }} onTouchTap={this.handleClose}> <FontIcon className="material-icons" style={{ cursor: 'pointer' }} >loop</FontIcon>      </MenuItem>
                            <MenuItem onTouchTap={this.handleClose}> <FontIcon className="material-icons" style={{ cursor: 'pointer' }} >trending_up</FontIcon>  </MenuItem>
                        </Drawer>
                        <img src={logo} className="App-logo" alt="logo" /> <h1>Universe</h1>
                    </span>
                    <span>
                        <Badge
                            badgeContent={4}
                            primary={true}
                        >
                            <NotificationsIcon />
                        </Badge>
                        <Badge
                            badgeContent={10}
                            secondary={true}
                            badgeStyle={{ top: 12, right: 12 }}
                        >
                            <IconButton tooltip="Notifications">
                                <NotificationsIcon />
                            </IconButton>
                        </Badge>
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper style={styles.paperStyle} zDepth={5} >
                        <AppBar
                            title="Village School District - Public school 25 Lafayette"
                            iconElementRight={<FontIcon className="material-icons" style={{ cursor: 'pointer' }} >airplay</FontIcon>}
                        />
                    </Paper>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper style={styles.toolStyle} >
                        <Toolbar style={styles.toolStyle} style={{ width: '100%' }}>
                            <ToolbarGroup>
                                <span>Get Started...</span>
                            </ToolbarGroup>
                            <ToolbarGroup>
                                <ToolbarTitle text="Views" />
                                <FontIcon className="material-icons" style={{ cursor: 'pointer' }} >list</FontIcon>
                                <FontIcon className="material-icons" style={{ cursor: 'pointer' }} >functions</FontIcon>
                                <FontIcon className="material-icons" style={{ cursor: 'pointer' }} >pie_chart</FontIcon>
                                <FontIcon className="material-icons" style={{ cursor: 'pointer' }} >monetization_on</FontIcon>
                            </ToolbarGroup>
                            <ToolbarGroup>
                                <ToolbarTitle text="Actions" />
                                <FontIcon className="material-icons" style={{ cursor: 'pointer' }} >control_point</FontIcon>
                                <FontIcon className="material-icons" style={{ cursor: 'pointer' }} >local_printshop</FontIcon>
                            </ToolbarGroup>
                            <ToolbarGroup>
                                <FontIcon className="material-icons" style={{ cursor: 'pointer' }} >find_in_page</FontIcon>
                                <input type='text' />
                            </ToolbarGroup>
                        </Toolbar>
                    </Paper>
                </div>
                <div>
                    <table style={{ cellSpacing: '20px' }}>
                        <tbody>
                            <tr>
                                <td><RaisedButton label="Call TOSvc W Token" primary={true} style={style} onTouchTap={() => this._handleTouchTap("T")} /></td>
                                <td><RaisedButton label="Call TOSvc WO Token" primary={true} style={style} onTouchTap={() => this._handleTouchTap("N")} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            /*
            <ToolbarSeparator />
            <ul>
                {this.props.items.map((item,index) => (
                    <li key={index}>
                        {item.gs_pr_name}
                    </li>
                ))}
            </ul>
            */
        );
    }
}

//ItemList.defaultProps = {};

/*
ItemList.propTypes = {
    fetchData: PropTypes.func.isRequired,
    updateData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    hasErrored: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
};
*/

const mapStateToProps = (state) => {
    return {
        items: state.items,
        hasErrored: state.itemsHasErrored,
        isLoading: state.itemsIsLoading,
        message: state.message,
    };
};

const mapDispatchToProps = (dispatch) => {
    //debugger;
    return {
        //fetchData: (url) => dispatch(itemsFetchData(url)),
        fetchSagaData: (data) => dispatch(data),
        updateData: (item) => dispatch(item),
        deleteData: (item) => dispatch(item),
        callTOSvc: (data) => dispatch(data)
        //fetchData: (url) => dispatch(itemsFetchData(url))        
        //updateData: (item) => dispatch(itemUpdateData(item)),
        //deleteData: (item) => dispatch(itemDeleteData(item))

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ToComponent);
