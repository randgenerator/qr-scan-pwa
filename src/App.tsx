import React from "react";
import { withRouter } from "utils";

import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore';

// @ts-ignore
const store = createStore({
    authType : 'cookie',
    authName:'_auth',
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === "https:"
});

function App({ children }:{children:any}) {
  
    return (
      <AuthProvider store={store}>
        {children}
      </AuthProvider>
    );
}

export default withRouter(App);
