// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { UserAgentApplication } from 'msal';

import { config } from './Config';
import { getUserDetails } from './GraphService';

export interface AuthComponentProps {
  error: any;
  isAuthenticated: boolean;
  user: any;
  login: Function;
  logout: Function;
  getAccessToken: Function;
  setError: Function;
  //history: any;
}

interface AuthProviderState {
  error: any;
  isAuthenticated: boolean;
  user: any;
}

export default function withAuthProvider<T extends React.Component<AuthComponentProps>>
  (WrappedComponent: new(props: AuthComponentProps, context?: any) => T): React.ComponentClass {
  return class extends React.Component<any, AuthProviderState> {
    private userAgentApplication: UserAgentApplication;

    constructor(props: any) {
      super(props);
      
      this.state = {
        error: null,
        isAuthenticated: false,
        user: {}
      };
      

      // Initialize the MSAL application object
      this.userAgentApplication = new UserAgentApplication({
        auth: {
            clientId: config.appId,
            redirectUri: config.redirectUri,
            authority: config.authority
        },
        cache: {
            cacheLocation: "sessionStorage",
            storeAuthStateInCookie: true
        }
      });
    }

    componentDidMount() {
      // If MSAL already has an account, the user
      // is already logged in
      var account = this.userAgentApplication.getAccount();

      if (account) {
        // Enhance user object with data from Graph
        this.getUserProfile();
      }
    }

    render() {
      return <WrappedComponent
        error = { this.state.error }
        isAuthenticated = { this.state.isAuthenticated }
        user = { this.state.user }
        login = { () => this.login() }
        logout = { () => this.logout() }
        getAccessToken = { (scopes: string[]) => this.getAccessToken(scopes)}
        setError = { (message: string, debug: string) => this.setErrorMessage(message, debug)}
        {...this.props} {...this.state} />;
    }

    async login() {
      try {
        // Login via popup
        await this.userAgentApplication.loginPopup(
            {
              scopes: config.scopes,
              prompt: "select_account"
          });
        // After login, get the user's profile
        await this.getUserProfile();
      }
      catch(err) {
        this.setState({
          isAuthenticated: false,
          user: {},
          error: this.normalizeError(err)
        });
      }
    }

    logout() {
      this.userAgentApplication.logout();
    }

    async getAccessToken(scopes: string[]): Promise<string> {
      try {
        // Get the access token silently
        // If the cache contains a non-expired token, this function
        // will just return the cached token. Otherwise, it will
        // make a request to the Azure OAuth endpoint to get a token
        var silentResult = await this.userAgentApplication.acquireTokenSilent({
          scopes: scopes
        });

        return silentResult.accessToken;
      } catch (err) {
        // If a silent request fails, it may be because the user needs
        // to login or grant consent to one or more of the requested scopes
        if (this.isInteractionRequired(err)) {
          var interactiveResult = await this.userAgentApplication.acquireTokenPopup({
            scopes: scopes
          });

          return interactiveResult.accessToken;
        } else {
          throw err;
        }
      }
    }

    // <getUserProfileSnippet>
    async getUserProfile() {
      try {
        var accessToken = await this.getAccessToken(config.scopes);

        if (accessToken) {
          // Get the user's profile from Graph
          var user = await getUserDetails(accessToken);
          this.setState({
            isAuthenticated: true,
            user: {
              displayName: user.displayName,
              email: user.mail || user.userPrincipalName
            },
            error: null
          });
        }
      }
      catch(err) {
        this.setState({
          isAuthenticated: false,
          user: {},
          error: this.normalizeError(err)
        });
      }
    }
    // </getUserProfileSnippet>

    setErrorMessage(message: string, debug: string) {
      this.setState({
        error: {message: message, debug: debug}
      });
    }

    normalizeError(error: string | Error): any {
      var normalizedError = {};
      if (typeof(error) === 'string') {
        var errParts = error.split('|');
        normalizedError = errParts.length > 1 ?
          { message: errParts[1], debug: errParts[0] } :
          { message: error };
      } else {
        normalizedError = {
          message: error.message,
          debug: JSON.stringify(error)
        };
      }
      return normalizedError;
    }

    isInteractionRequired(error: Error): boolean {
      if (!error.message || error.message.length <= 0) {
        return false;
      }

      return (
        error.message.indexOf('consent_required') > -1 ||
        error.message.indexOf('interaction_required') > -1 ||
        error.message.indexOf('login_required') > -1
      );
    }
  }
}
