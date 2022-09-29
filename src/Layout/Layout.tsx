import React from 'react'
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from 'react-router-dom';

const Layout = (props: { children: any; }) => {
    const { children } = props;	
    const location = useLocation();
  return (
    <div>
        {location.pathname != "/login" ? <Header /> : ""}
        <div>{children}</div>
        {location.pathname != "/login" ? <Footer /> : ""}
    </div>
  )
}

export default Layout