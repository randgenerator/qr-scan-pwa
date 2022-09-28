import React, { useEffect } from "react";
import { withRouter } from "utils";
import { initDb, clearDb } from "./store/db";
import { AuthProvider } from 'react-auth-kit'
import isReachable from "is-reachable";


function App({ children }:{children:any}) {
    useEffect(() => {
      const init = async () => {
        if (await isReachable("https://pa-test.esynergy.lv")) {
          await clearDb()
        }        
        await initDb()
      } 
      init()
    }, [])
	
    return (
      <AuthProvider authType = {'cookie'}
                  authName={'_auth'}
                  cookieDomain={window.location.hostname}
                  cookieSecure={window.location.protocol === "https:"}>
        {children}
      </AuthProvider>
    );
}

export default withRouter(App);
