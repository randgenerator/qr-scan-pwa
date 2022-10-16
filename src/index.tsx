import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Routes from "routes";
import "assets/styles/main.scss";
import "assets/styles/fonts.css";
import * as serviceWorkerRegistration from 'serviceWorkerRegistration';
import reportWebVitals from 'reportWebVitals';
import { clearDb, getOffline, getToken, initDb, removeOffline } from 'store/db';
import isReachable from 'is-reachable';
import axios from 'axios';
import SendOffline from 'offline';

const init = async () => {
  await initDb()
  if (await isReachable(process.env.REACT_APP_API_BASE_URL!)) {
    await SendOffline()
    await clearDb()
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);

init()
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
