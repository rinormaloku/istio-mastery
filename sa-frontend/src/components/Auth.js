import auth0 from 'auth0-js';

import history from './history';

export default class Auth {
    auth0 = new auth0.WebAuth({
        clientID: 'TJRYzHIozou5UlvuQW1DZLixUCulf8jY',
        domain: 'sentiment-analysis.eu.auth0.com',
        redirectUri: 'http://68.183.243.178/callback',
        audience: 'https://sentiment-analysis.io/',
        responseType: 'token id_token',
        scope: 'openid profile'
    });

    constructor() {
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
    }

    handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                history.replace('/');
            } else if (err) {
                history.replace('/');
                console.log(err);
            }
        });
    }

    setSession(authResult) {
        // Set the time that the Access Token will expire at
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        // navigate to the home route
        history.replace('/');
    }

    getAccessToken() {
        return localStorage.getItem('access_token');
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        this.auth0.logout({
            returnTo: 'http://68.183.243.178/logout',
            clientID: 'TJRYzHIozou5UlvuQW1DZLixUCulf8jY',
          });
    }

    isAuthenticated() {
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    login() {
        this.auth0.authorize();
    }
}
