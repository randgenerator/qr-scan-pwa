// import React from 'react';
// import logo from './logo.svg';
import React, { useEffect } from "react";
import { withRouter } from "utils";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import './App.css';
// import About from "./pages/About";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Events from "./pages/Events";
// import Qrscan from './Qrscan';
import { initDb } from "./store/db";
import { AuthProvider } from 'react-auth-kit'

// const App: React.FC = () => {

//   useEffect(() => {
//     initDb()
//   }, [])

//   return (
//     <Router>
//       <Suspense fallback={<div>Loading...</div>}>
//         <nav>
//           <ul>
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/about">About</Link>
//             </li>
//           </ul>
//         </nav>
//         <Routes>
//           <Route path="/about" element={<About />} />
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/events" element={<Events />} />
//         </Routes>
//       </Suspense>
//     </Router>
//   )
// };

function App({ children }:{children:any}) {
    useEffect(() => {
      initDb()
    }, [])
	
    return (
      <AuthProvider authType = {'cookie'}
                  authName={'_auth'}>
        {children}
      </AuthProvider>
    );
}

export default withRouter(App);
