import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

export default class Logout extends Component {
    render() {
        const style = {
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            width: '100vw',
            backgroundColor: 'white',
        };

        return (
            <div style={style}>
                <Paper zDepth={1} className="content">
                    You are logged out, <br />
                    <a href="/">Login</a> to access the app.                 
                </Paper>
            </div>
        );
    }
}
