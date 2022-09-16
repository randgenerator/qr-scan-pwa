import React from 'react'
import Header from "./Header";
import Footer from "./Footer";

const Layout = (props) => {
    const { children } = props;	

  return (
    <div>
        <Header />
        <div>{children}</div>
        <Footer />
    </div>
  )
}

export default Layout