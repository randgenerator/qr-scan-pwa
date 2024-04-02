import React from 'react'
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from 'react-router-dom';
import './style.scss'

const Layout = (props: { children: any; }) => {
    const { children } = props;	
    const location = useLocation();
  return (
    <div className={'main-layout'}>
        {location.pathname != "/login" ? <Header /> : ""}
        <div className={'main-layout-content'}>{children}</div>
        {location.pathname != "/login" ? <Footer /> : ""}
    </div>
  )
}

export default Layout