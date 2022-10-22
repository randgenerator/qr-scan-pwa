import React from "react";
import { withRouter } from "utils";
import { AuthProvider } from "react-auth-kit";

function App({ children }: { children: any }) {
  return (
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={window.location.protocol === "https:"}>
      {children}
    </AuthProvider>
  );
}

export default withRouter(App);
