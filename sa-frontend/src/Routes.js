import React from 'react';
import { Route, Router } from 'react-router-dom';
import App from './App';
import Callback from './components/Callback';
import Logout from './components/Logout';
import Auth from './services/Auth';
import history from './services/history';
import { MuiThemeProvider } from 'material-ui';

export const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
    if(/access_token|id_token|error/.test(nextState.location.hash)) {
        auth.handleAuthentication();
    }
};

export const makeMainRoutes = () => {
    return (
        <MuiThemeProvider>
            <Router history={ history }>
                <div>
                    <Route exact path="/" render={() => <App/>}/>
                    <Route exact path="/logout" render={() => <Logout/>}/>
                    <Route exact path="/callback" render={ (props) => {
                        handleAuthentication(props);
                        return <Callback { ...props } />
                    } }/>
                </div>
            </Router>
        </MuiThemeProvider>
    );
};
