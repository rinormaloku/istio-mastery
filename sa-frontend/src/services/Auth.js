import auth0 from 'auth0-js';

import history from './history';

const Config = {
    clientID: '{YOUR_CLIENT_ID}',
    domain:'{YOUR_DOMAIN}',
    audience: '{YOUR_AUDIENCE}',
    ingressIP: '{EXTERNAL_IP}'
}

export default class Auth {
    auth0 = new auth0.WebAuth({
        clientID: Config.clientID,
        domain: Config.domain,
        redirectUri: `http://${Config.ingressIP}/callback`,
        audience: Config.audience,
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
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);

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
            returnTo: `http://${Config.ingressIP}/logout`,
            clientID: Config.clientID,
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
